#!/usr/bin/env bash
# Deploys one commit of the portfolio on the VPS.
#
# GitHub Actions runs this over SSH with a key that authorized_keys restricts to
# this script: the SSH command is "deploy <commit-sha>" and a GHCR token comes
# on stdin. To run it by hand from the checkout:
#
#   deploy/deploy.sh deploy <commit-sha>
#
# It checks out the commit, pulls that commit's image, backs up the database,
# starts the new image, and rolls back to the previous one if it isn't healthy.
set -euo pipefail

APP_DIR="$(cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")/.." && pwd)"
IMAGE="ghcr.io/mr-shakib/shakib-portfolio"
KEEP_BACKUPS=14
cd "$APP_DIR"

log() { printf '[deploy] %s\n' "$*"; }
die() { printf '[deploy] error: %s\n' "$*" >&2; exit 1; }
compose() { docker compose -f docker-compose.prod.yml "$@"; }

# Stage 1: check out the commit, then re-run this script from that commit so
# every deploy runs its own version of it.
if [[ "${1:-}" != "--checked-out" ]]; then
  read -r action sha extra <<<"${SSH_ORIGINAL_COMMAND:-$*}"
  [[ "$action" == "deploy" && -z "$extra" ]] || die "usage: deploy <commit-sha>"
  [[ "$sha" =~ ^[0-9a-f]{40}$ ]] || die "not a full commit sha: $sha"
  log "checking out $sha"
  git fetch --quiet origin
  git checkout --quiet --detach "$sha"
  exec "$APP_DIR/deploy/deploy.sh" --checked-out "$sha"
fi

# Stage 2: deploy.
sha="$2"
umask 077
[[ -f .env ]] || die ".env is missing — see deploy/README.md"

# The token is only valid while the CI job runs. Log in with a throwaway Docker
# config so the account's ~/.docker/config.json is never touched.
token=""
[[ -t 0 ]] || token="$(cat)"
log "pulling $IMAGE:$sha"
(
  if [[ -n "$token" ]]; then
    DOCKER_CONFIG="$(mktemp -d)"
    export DOCKER_CONFIG
    trap 'rm -rf "$DOCKER_CONFIG"' EXIT
    printf '%s' "$token" | docker login ghcr.io --username github-actions --password-stdin >/dev/null
  fi
  docker pull --quiet "$IMAGE:$sha" >/dev/null
)

prev="$(sed -n 's/^APP_TAG=//p' .env | tail -n 1)"

# Pins the image tag in .env, so plain `docker compose` commands keep using it.
set_tag() {
  local tmp
  tmp="$(mktemp .env.XXXXXX)"
  { grep -v '^APP_TAG=' .env || true; printf 'APP_TAG=%s\n' "$1"; } >"$tmp"
  mv "$tmp" .env
}

# The new image applies migrations on start, so back up first.
if [[ -n "$(compose ps --status running --quiet db)" ]]; then
  mkdir -p backups
  backup="backups/db-$(date -u +%Y%m%dT%H%M%SZ)-${prev:0:7}.sql.gz"
  log "backing up the database to $backup"
  compose exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB"' | gzip >"$backup"
  ls -1t backups/db-*.sql.gz | tail -n +$((KEEP_BACKUPS + 1)) | xargs -r rm --
fi

log "starting $sha"
set_tag "$sha"
if ! compose up -d --wait --wait-timeout 180 --remove-orphans; then
  compose logs --tail 80 app || true
  if [[ -n "$prev" && "$prev" != "$sha" ]]; then
    log "rolling back to $prev"
    set_tag "$prev"
    compose up -d --wait --wait-timeout 180 || true
  fi
  die "deploy of $sha failed"
fi

# Keep only the running image and the previous one.
docker image ls "$IMAGE" --format '{{.Tag}}' \
  | grep -vxF -e "$sha" -e "${prev:-$sha}" -e '<none>' \
  | sed "s|^|$IMAGE:|" \
  | xargs -r docker rmi >/dev/null 2>&1 || true

log "deployed $sha"
