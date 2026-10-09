# Hamerewegelz — cPanel Deployment Guide

> This guide covers deploying:
> - **Frontend** → Next.js static export → Apache on cPanel `public_html`
> - **Backend** → Express.js → cPanel *"Setup Node.js App"* (Node.js Selector)

---

## Prerequisites

| Requirement | Details |
|---|---|
| cPanel hosting | Must support **Node.js Selector** (CloudLinux / LiteSpeed hosts) |
| Node.js version | 18.x or 20.x LTS |
| MongoDB | Use **MongoDB Atlas** (free tier works) |
| Domain | Pointed to your cPanel server |

---

## Step 1 — Build locally

Run the build script from the project root:

```bash
chmod +x deploy-cpanel.sh
./deploy-cpanel.sh
```

This creates:
```
dist-cpanel/
├── public_html/     ← static Next.js site
└── server/          ← Express API + node_modules
```

---

## Step 2 — Update the CORS origin in `server/src/index.js`

Before uploading, open `dist-cpanel/server/src/index.js` and add your real domain to `allowedOrigins`:

```js
const allowedOrigins = [
  'https://yourdomain.com',      // <- add this
  'https://www.yourdomain.com',  // <- and this
  'http://localhost:3500',
];
```

---

## Step 3 — Upload the frontend

1. In **cPanel → File Manager**, navigate to `public_html` (or the subdomain/addon domain folder).
2. **Delete** any existing files there (keep `.htaccess` if you have custom rules you want to preserve).
3. Upload **all contents** of `dist-cpanel/public_html/` — including the `.htaccess` file.

> Tip: Compress the folder to a `.zip`, upload it, then **Extract** in place — much faster than uploading files one by one.

```bash
# Create a zip locally for easy upload
cd dist-cpanel
zip -r frontend.zip public_html/
```

---

## Step 4 — Set up the Node.js API

### 4a. Create the Node.js app in cPanel

1. cPanel → **Setup Node.js App** (under *Software*).
2. Click **Create Application**.
3. Fill in:

| Field | Value |
|---|---|
| Node.js version | `20.x` (or `18.x`) |
| Application mode | `Production` |
| Application root | `apps/hamerewegelz` |
| Application URL | `yourdomain.com/api` *(or a subdomain like `api.yourdomain.com`)* |
| Application startup file | `src/index.js` |

4. Click **Create**. cPanel will create the folder `~/apps/hamerewegelz/`.

### 4b. Upload the server files

Upload the contents of `dist-cpanel/server/` to `~/apps/hamerewegelz/` on the server.

```bash
# Zip server folder locally
cd dist-cpanel
zip -r server.zip server/
```

Then in **File Manager**, navigate to `apps/hamerewegelz/`, upload `server.zip`, and extract it.

> **Important:** After extracting, make sure `src/index.js` is at `~/apps/hamerewegelz/src/index.js`.

### 4c. Set environment variables

In cPanel → **Setup Node.js App**, click your app → **Environment Variables** section:

```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/hamerewegelz
JWT_SECRET=your_super_secret_string
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=465
SMTP_EMAIL=info@yourdomain.com
SMTP_PASSWORD=...
STRIPE_SECRET_KEY=sk_live_...
CHAPA_SECRET_KEY=...
```

> **Caution:** Never commit the real `.env` to Git. Use the `.env.example` in `dist-cpanel/server/` as a reference.

### 4d. Install npm packages & start

In **Setup Node.js App**, click your app and then:
1. Click **Run NPM Install** → installs production dependencies.
2. Click **Start Application**.

Your API will be live at the URL you set (e.g., `https://api.yourdomain.com/api/v1`).

---

## Step 5 — Update the frontend API URL

The frontend reads the API URL from `client/.env`:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
```

> **Important:** If you change the API domain/path, you must rebuild the frontend (`./deploy-cpanel.sh`) and re-upload `public_html/`. The URL is baked into static files at build time.

---

## Step 6 — Point the domain to the static files

- **Main domain** → files go into `public_html/` — nothing extra to configure.
- **Addon domain / subdomain** → cPanel → **Addon Domains** → set document root to the folder where you uploaded the frontend files.

---

## Step 7 — Enable HTTPS

cPanel → **SSL/TLS** → **Let's Encrypt SSL** → issue a free certificate for your domain. Enable **Force HTTPS Redirect** — the `.htaccess` already has the redirect rule.

---

## .htaccess explained

The `.htaccess` auto-generated inside `public_html/` handles:

```apache
# Forces HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Serves Next.js static pages without .html extension in URL
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.+)$ $1.html [L]

# 404 fallback
ErrorDocument 404 /404.html
```

---

## Updating the app

| Part changed | What to do |
|---|---|
| Frontend code | Re-run `./deploy-cpanel.sh` → re-upload `public_html/` contents |
| Backend code | Re-upload changed files in `apps/hamerewegelz/src/` → restart app in cPanel |
| Environment variables | Edit in **Setup Node.js App** panel → **Restart** |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Pages return 404 after upload | Check `.htaccess` was uploaded; confirm Apache `mod_rewrite` is enabled |
| API returns CORS error | Add your domain to `allowedOrigins` in `server/src/index.js` and restart |
| Node.js app won't start | Check the **Error Log** in cPanel → Setup Node.js App — usually a missing env var |
| Images not loading | Check `CLOUDINARY_*` env vars; or confirm the `/uploads` static path is correct |
| MongoDB connection refused | Whitelist your cPanel server's IP in **MongoDB Atlas → Network Access** |

---

## File layout on the server

```
~/
├── public_html/               <- Next.js static files (frontend)
│   ├── .htaccess
│   ├── en/
│   ├── am/
│   ├── _next/
│   └── ...
└── apps/
    └── hamerewegelz/          <- Node.js API app root
        ├── src/
        │   ├── index.js
        │   ├── controllers/
        │   ├── models/
        │   └── routes/
        ├── node_modules/
        └── uploads/           <- local file uploads (if not using Cloudinary)
```
