#!/usr/bin/env bash
# =============================================================================
#  Hamerewegelz – cPanel Deployment Build Script
#  Run this on your LOCAL machine before uploading to the server.
# =============================================================================
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
CLIENT="$ROOT/client"
SERVER="$ROOT/server"
DIST="$ROOT/dist-cpanel"

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║   Hamerewegelz  ·  cPanel Build Script              ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# ── 1. Clean previous dist ────────────────────────────────
echo "▶  Cleaning previous build..."
rm -rf "$DIST"
mkdir -p "$DIST/public_html"
mkdir -p "$DIST/server"

# ── 2. Build Next.js (static export) ─────────────────────
echo ""
echo "▶  Installing client dependencies..."
cd "$CLIENT"
npm ci --legacy-peer-deps

echo ""
echo "▶  Building Next.js (static export)..."
npm run build

# 'output: export' places files in client/out/
if [ ! -d "$CLIENT/out" ]; then
  echo "✖  Build failed – client/out/ not found."
  exit 1
fi

echo ""
echo "▶  Copying static files → dist-cpanel/public_html/"
cp -r "$CLIENT/out/." "$DIST/public_html/"

# ── 3. Copy .htaccess for Apache ─────────────────────────
cat > "$DIST/public_html/.htaccess" <<'HTACCESS'
Options -MultiViews
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Serve pre-rendered HTML – strip trailing slash for index pages
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.+)$ $1.html [L]

# SPA fallback – let Next.js static pages handle 404
ErrorDocument 404 /404.html
HTACCESS

echo "   .htaccess written."

# ── 4. Package the server ─────────────────────────────────
echo ""
echo "▶  Packaging server → dist-cpanel/server/"
rsync -a \
  --exclude='node_modules' \
  --exclude='.env' \
  --exclude='*.log' \
  "$SERVER/." "$DIST/server/"

echo ""
echo "▶  Installing server production dependencies..."
cd "$DIST/server"
npm ci --omit=dev --legacy-peer-deps

# ── 5. Create server .env template ───────────────────────
cat > "$DIST/server/.env.example" <<'ENVFILE'
# ── Paste this as .env on the cPanel server, fill in real values ──

NODE_ENV=production
PORT=5000

# MongoDB Atlas connection string
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/hamerewegelz?retryWrites=true&w=majority

# JWT
JWT_SECRET=CHANGE_ME_TO_A_LONG_RANDOM_STRING
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Cloudinary (used for file uploads)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email (SMTP)
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=465
SMTP_EMAIL=info@yourdomain.com
SMTP_PASSWORD=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Chapa
CHAPA_SECRET_KEY=

# Public URL of the API (used for CORS)
CLIENT_URL=https://yourdomain.com
ENVFILE

echo "   .env.example written."

# ── 6. Summary ────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║   Build complete!  See dist-cpanel/                 ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
echo "  dist-cpanel/"
echo "  ├── public_html/     ← upload contents to public_html on cPanel"
echo "  └── server/          ← upload to ~/apps/hamerewegelz/ on cPanel"
echo ""
echo "  Next steps: read DEPLOY.md for the full cPanel walkthrough."
echo ""
