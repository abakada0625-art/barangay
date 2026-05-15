# AyosPH Deployment Guide

Complete guide to deploy AyosPH to GitHub, Vercel, and Supabase.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [GitHub Setup](#github-setup)
3. [Supabase Database Setup](#supabase-database-setup)
4. [Vercel Deployment](#vercel-deployment)
5. [Environment Variables](#environment-variables)
6. [Database Schema](#database-schema)
7. [Email Service Setup](#email-service-setup)
8. [Post-Deployment](#post-deployment)

---

## Prerequisites

You'll need:
- GitHub account (https://github.com)
- Vercel account (https://vercel.com)
- Supabase account (https://supabase.com)
- Node.js 18+ and npm/yarn installed
- Git installed

---

## GitHub Setup

### Step 1: Create a New Repository

1. Go to GitHub (https://github.com)
2. Click **"New"** to create a new repository
3. Name it: `ayosphph` (or your preferred name)
4. Choose **Private** (recommended for production)
5. Click **Create repository**

### Step 2: Push Your Code to GitHub

```bash
# Navigate to your project
cd /path/to/anything-modified

# Initialize git (if not already done)
git init

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/ayosphph.git

# Create initial commit
git add .
git commit -m "Initial commit: AyosPH - Community Issue Reporting System"

# Push to GitHub (use 'main' as default branch)
git branch -M main
git push -u origin main
```

### Step 3: Create `.gitignore`

```bash
# Add to your project root if not already present
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Environment
.env
.env.local
.env.*.local

# Build outputs
.next
out
dist
build

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*

# Cache
.cache/
.turbo/
EOF

git add .gitignore
git commit -m "Add .gitignore"
git push
```

---

## Supabase Database Setup

### Step 1: Create a Supabase Project

1. Go to https://supabase.com
2. Click **"Start your project"**
3. Sign in or create an account
4. Click **"Create a new project"**
5. Fill in:
   - **Name**: `ayosphph` (or your preference)
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your location (Asia: Singapore)
6. Click **"Create new project"** and wait for setup (~2 min)

### Step 2: Get Connection String

1. Go to **Settings** → **Database**
2. Copy the **Connection string** under "URI"
3. The format is: `postgresql://user:password@host:port/dbname`
4. **Note**: Replace `[YOUR-PASSWORD]` with your actual password

### Step 3: Create Database Tables

Use the Supabase SQL Editor to run these queries:

```sql
-- Create auth_users table
CREATE TABLE auth_users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  "emailVerified" TIMESTAMPTZ,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create auth_accounts table
CREATE TABLE auth_accounts (
  id TEXT PRIMARY KEY,
  "userId" TEXT REFERENCES auth_users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  password TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider, "providerAccountId")
);

-- Create auth_sessions table
CREATE TABLE auth_sessions (
  id TEXT PRIMARY KEY,
  "sessionToken" TEXT UNIQUE NOT NULL,
  "userId" TEXT REFERENCES auth_users(id) ON DELETE CASCADE,
  expires TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create auth_verification_token table
CREATE TABLE auth_verification_token (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- Create users table (for app-specific data)
CREATE TABLE users (
  id TEXT PRIMARY KEY REFERENCES auth_users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'resident' CHECK (role IN ('resident', 'pending_official', 'official', 'admin')),
  email_verified BOOLEAN DEFAULT FALSE,
  profile_photo_url TEXT,
  barangay TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create reports table
CREATE TABLE reports (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('lighting', 'road', 'water', 'garbage', 'other')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved')),
  address TEXT,
  location TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  image_url TEXT,
  proof_image_url TEXT,
  reporter_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  reporter_name TEXT,
  official_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  official_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_auth_accounts_userId ON auth_accounts("userId");
CREATE INDEX idx_auth_sessions_userId ON auth_sessions("userId");
CREATE INDEX idx_auth_sessions_sessionToken ON auth_sessions("sessionToken");
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_reports_reporter_id ON reports(reporter_id);
CREATE INDEX idx_reports_official_id ON reports(official_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);

-- Enable RLS (Row Level Security) for production
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (optional, adjust based on your needs)
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id);
```

### Step 4: Verify Tables

In Supabase Dashboard:
1. Go to **Table Editor**
2. Verify all tables are created:
   - `auth_users`
   - `auth_accounts`
   - `auth_sessions`
   - `auth_verification_token`
   - `users`
   - `reports`

---

## Vercel Deployment

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Step 2: Deploy Initial Version

```bash
cd /path/to/anything-modified

# Login to Vercel (opens browser)
vercel login

# Deploy to Vercel
vercel
```

When prompted:
- **Project name**: `ayosphph`
- **Directory**: `.`
- **Build command**: Leave as default (or `npm run build`)
- **Output directory**: `.next`

### Step 3: Configure Environment Variables

In Vercel Dashboard:

1. Go to your project
2. Click **Settings** → **Environment Variables**
3. Add the following variables:

```
DATABASE_URL=postgresql://user:password@host:5432/postgres

NEXTAUTH_SECRET=<generate-strong-random-string>
NEXTAUTH_URL=https://your-vercel-app.vercel.app

# Optional: For email notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SENDER_EMAIL=noreply@ayosphph.com
```

**To generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Step 4: Redeploy with Environment Variables

```bash
vercel env pull              # Pull variables locally
vercel --prod               # Deploy to production
```

---

## Environment Variables

Create `.env.local` in your project root:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/dbname

# NextAuth.js
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000  # For local development

# API URLs
NEXT_PUBLIC_API_URL=http://localhost:3000  # Local
# Change to: NEXT_PUBLIC_API_URL=https://your-vercel-app.vercel.app for production

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SENDER_EMAIL=noreply@ayosphph.com

# File Upload
NEXT_PUBLIC_UPLOAD_BUCKET=ayosphph-uploads
UPLOAD_API_KEY=your-upload-api-key
```

---

## Database Schema Notes

### User Roles

- **resident**: Regular users who report issues
- **pending_official**: Barangay officials awaiting super admin approval
- **official**: Approved barangay officials
- **admin**: Super admin with full access

### Approval Workflow

When a user signs up as "official":

```
1. User fills signup form → role = 'pending_official'
2. Super Admin reviews in dashboard → /api/admin/pending-officials
3. Admin approves → PUT /api/admin/approve-official (role = 'official')
4. User receives approval email (feature to implement)
5. User can now resolve reports
```

---

## Email Service Setup

### Option 1: Gmail (Free)

1. Enable 2-Factor Authentication on Gmail
2. Create App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Generate and copy the password
3. Use the App Password in `.env.local`

### Option 2: SendGrid

1. Create SendGrid account: https://sendgrid.com
2. Generate API key
3. Use in environment variables:
   ```env
   SENDGRID_API_KEY=your-api-key
   SENDER_EMAIL=noreply@yourdomain.com
   ```

### Option 3: Resend (Recommended for Next.js)

```bash
npm install resend
```

Create email service in `/apps/web/src/app/api/send-email/route.js`:

```javascript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { to, subject, html } = await req.json();

    const data = await resend.emails.send({
      from: 'AyosPH <noreply@ayosphph.com>',
      to,
      subject,
      html,
    });

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

---

## Post-Deployment

### 1. Test in Production

```bash
# Visit your deployed URL
https://your-vercel-app.vercel.app

# Test the following:
- Create resident account
- Create official account (should show pending message)
- Login with both accounts
- Submit a report as resident
- View reports as official/admin
```

### 2. Setup Custom Domain (Optional)

In Vercel Dashboard:
1. Go to **Settings** → **Domains**
2. Enter your domain: `ayosphph.com`
3. Follow instructions to update DNS records with your registrar
4. Update `NEXTAUTH_URL` in environment variables

### 3. Enable Monitoring

In Vercel Dashboard:
1. Go to **Monitoring** to track performance
2. Set up alerts for errors and slowdowns

### 4. Setup CI/CD

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

Get tokens from Vercel Settings.

### 5. Database Backups

In Supabase Dashboard:
1. Go to **Settings** → **Backups**
2. Enable automatic daily backups
3. Download backups regularly

### 6. Create Super Admin User

Once deployed, you need to manually create the first super admin in your database:

```sql
-- Create super admin user
INSERT INTO users (id, name, email, role, email_verified)
VALUES ('admin-uuid', 'Super Admin', 'admin@ayosphph.com', 'admin', true);
```

---

## Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED
```

**Solution**: Check DATABASE_URL is correct and Supabase IP whitelist includes Vercel IPs.

In Supabase:
1. **Settings** → **Network** → **Add whitelist IP**
2. Add: `0.0.0.0/0` (or specific Vercel IPs)

### Build Fails on Vercel

```
Error: Cannot find module '@auth/create'
```

**Solution**: Ensure `package.json` has all dependencies:

```bash
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

Then redeploy on Vercel.

### Email Not Sending

1. Check SMTP credentials in environment variables
2. Verify sender email is authorized
3. Check spam folder
4. Use Vercel logs: `vercel logs` to debug

---

## Next Steps

1. ✅ Deploy code to Vercel
2. ✅ Setup Supabase database
3. ⬜ Configure email notifications
4. ⬜ Setup admin approval workflow UI
5. ⬜ Add password reset functionality
6. ⬜ Implement two-factor authentication
7. ⬜ Add user analytics
8. ⬜ Setup customer support system

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/YOUR_USERNAME/ayosphph/issues
- Vercel Support: https://vercel.com/support
- Supabase Docs: https://supabase.com/docs

---

**Last Updated**: May 2025
