#!/usr/bin/env bash
# One-time host setup: the nginx site and Let's Encrypt certificate for
# shakibhowlader.online. Run from the checkout on the VPS:
#
#   sudo bash deploy/install-nginx.sh
#
# Safe to re-run. It only writes this site's files, and if `nginx -t` fails it
# reverts them so the other sites on the server keep running.
set -euo pipefail

DOMAIN=shakibhowlader.online
NAMES=("$DOMAIN" "www.$DOMAIN")
EMAIL=contactshakibhere@gmail.com
SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/nginx/$DOMAIN.conf"
AVAILABLE=/etc/nginx/sites-available/$DOMAIN
ENABLED=/etc/nginx/sites-enabled/$DOMAIN

[[ $EUID -eq 0 ]] || { echo "run as root: sudo bash $0" >&2; exit 1; }
nginx -t 2>/dev/null || { echo "nginx -t already fails; fix that before adding a site" >&2; exit 1; }

# Installs $1 as this site's config and reloads nginx, or reverts and exits.
install_site() {
  local backup=""
  if [[ -f "$AVAILABLE" ]]; then
    backup="$(mktemp)"
    cp "$AVAILABLE" "$backup"
  fi
  install -m 644 "$1" "$AVAILABLE"
  ln -sfn "$AVAILABLE" "$ENABLED"
  if ! nginx -t; then
    echo "nginx -t failed; reverting $DOMAIN" >&2
    if [[ -n "$backup" ]]; then cp "$backup" "$AVAILABLE"; else rm -f "$ENABLED" "$AVAILABLE"; fi
    exit 1
  fi
  systemctl reload nginx
}

mkdir -p /var/www/certbot

if [[ ! -f /etc/letsencrypt/live/$DOMAIN/fullchain.pem ]]; then
  # The full config needs the certificate, so answer the ACME challenge over
  # plain HTTP first.
  bootstrap="$(mktemp)"
  cat >"$bootstrap" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${NAMES[*]};

    location ^~ /.well-known/acme-challenge/ {
        default_type "text/plain";
        root /var/www/certbot;
    }

    location / { return 404; }
}
EOF
  install_site "$bootstrap"

  domains=()
  for name in "${NAMES[@]}"; do domains+=(-d "$name"); done
  certbot certonly --webroot -w /var/www/certbot "${domains[@]}" \
    --cert-name "$DOMAIN" --email "$EMAIL" --agree-tos --non-interactive \
    --deploy-hook "systemctl reload nginx"
fi

install_site "$SRC"
echo "https://$DOMAIN is configured"
