# Deployment

Production runs on the VPS (`shakib@187.53.136.115`) at
<https://shakibhowlader.online>, next to other projects on the same host.

```
push to main ─▶ GitHub Actions ─▶ typecheck + lint ─▶ build image ─▶ ghcr.io/mr-shakib/shakib-portfolio:<sha>
                                                                          │
                                   ssh (key limited to deploy/deploy.sh) ◀┘
                                                   │
VPS  ~/shakib-portfolio ─ docker-compose.prod.yml: app (127.0.0.1:3350) + db (Postgres 16)
     host nginx ─ shakibhowlader.online ─▶ 127.0.0.1:3350
```

Pull requests run the checks and build the image without pushing or deploying.
To redeploy main without a new commit, use **Actions → CI/CD → Run workflow**.

## What `deploy/deploy.sh` does

1. Checks out the commit in `~/shakib-portfolio` and re-runs itself from it.
2. Pulls `ghcr.io/mr-shakib/shakib-portfolio:<sha>`, using the CI job's token.
3. Dumps the database to `backups/` (the last 14 are kept).
4. Sets `APP_TAG=<sha>` in `.env` and runs `docker compose up -d --wait`. The
   app runs `prisma migrate deploy` before it starts.
5. If the app doesn't become healthy, puts the previous `APP_TAG` back and
   fails the job.

## Operations (on the VPS, in `~/shakib-portfolio`)

```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f app

# Roll back: deploy an older commit of main
deploy/deploy.sh deploy <commit-sha>

# Restore a backup (stop the app first)
docker compose -f docker-compose.prod.yml stop app
gunzip -c backups/<file>.sql.gz \
  | docker compose -f docker-compose.prod.yml exec -T db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
docker compose -f docker-compose.prod.yml start app
```

Production settings live in `~/shakib-portfolio/.env` on the VPS (mode 600, not
in git; see `.env.example`). After changing it, run
`docker compose -f docker-compose.prod.yml up -d`. `NEXT_PUBLIC_SITE_URL` is
baked in at build time, so it's also a GitHub variable (below). Changing it
needs a new build.

## One-time setup

Already done for this server. These steps are for rebuilding it from scratch.

**GitHub** (Settings → Secrets and variables → Actions)

| Name                   | Kind     | Value                                                       |
| ---------------------- | -------- | ----------------------------------------------------------- |
| `VPS_SSH_KEY`          | secret   | private half of the deploy key                              |
| `VPS_KNOWN_HOSTS`      | secret   | `ssh-keyscan -t ed25519 187.53.136.115` (fingerprint checked) |
| `VPS_HOST`             | variable | `187.53.136.115`                                            |
| `VPS_USER`             | variable | `shakib`                                                    |
| `NEXT_PUBLIC_SITE_URL` | variable | `https://shakibhowlader.online`                             |

**VPS**

```bash
git clone https://github.com/mr-shakib/shakib-portfolio.git ~/shakib-portfolio
cd ~/shakib-portfolio
cp .env.example .env && chmod 600 .env   # fill in; set APP_PORT=3350
```

Add the deploy key's public half to `~/.ssh/authorized_keys`, restricted to
the deploy script:

```
command="/home/shakib/shakib-portfolio/deploy/deploy.sh",restrict ssh-ed25519 AAAA… github-actions@shakib-portfolio
```

Point DNS for `shakibhowlader.online` and `www.shakibhowlader.online` at the
VPS, then set up nginx and the certificate (needs sudo):

```bash
sudo bash deploy/install-nginx.sh
```
