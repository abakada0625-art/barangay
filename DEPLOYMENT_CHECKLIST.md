# 🚀 AyosPH Deployment Checklist

Complete this checklist to ensure successful deployment!

## Phase 1: Code Preparation ✓

- [ ] Removed "made with anything" references from auth.js comment
- [ ] Updated signup page with pending approval message
- [ ] Created API endpoint: `/api/admin/approve-official`
- [ ] Created API endpoint: `/api/admin/pending-officials`
- [ ] Created `PendingOfficialsList` component
- [ ] Committed all changes to git
- [ ] Created `.gitignore` file

## Phase 2: GitHub Setup

- [ ] Created GitHub repository
- [ ] Verified remote is added: `git remote -v`
- [ ] Pushed code to GitHub: `git push -u origin main`
- [ ] Repository is visible at `https://github.com/YOUR_USERNAME/ayosphph`

### Commands to Run:
```bash
# Verify GitHub connection
git remote -v

# Should output:
# origin  https://github.com/YOUR_USERNAME/ayosphph.git (fetch)
# origin  https://github.com/YOUR_USERNAME/ayosphph.git (push)
```

## Phase 3: Supabase Database Setup

- [ ] Created Supabase project
- [ ] Got PostgreSQL connection string
- [ ] Created all required tables using SQL schema
- [ ] Verified tables exist in Supabase dashboard:
  - [ ] `auth_users`
  - [ ] `auth_accounts`
  - [ ] `auth_sessions`
  - [ ] `auth_verification_token`
  - [ ] `users`
  - [ ] `reports`
- [ ] Created all indexes
- [ ] Set up Row Level Security (RLS) policies
- [ ] Whitelist Vercel IPs in **Settings** → **Network**

### Database Verification:
```sql
-- Run in Supabase SQL Editor
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

Should return all 6 tables listed above.

## Phase 4: Vercel Deployment

- [ ] Created Vercel account
- [ ] Installed Vercel CLI: `npm i -g vercel`
- [ ] Logged in to Vercel: `vercel login`
- [ ] Deployed initial version: `vercel`
- [ ] Verified deployment at `https://your-vercel-app.vercel.app`

### Environment Variables in Vercel:

- [ ] `DATABASE_URL` - Set and verified
- [ ] `NEXTAUTH_SECRET` - Generated and set
- [ ] `NEXTAUTH_URL` - Set to your Vercel URL
- [ ] `NEXT_PUBLIC_API_URL` - Set to your Vercel URL

### Commands to Check:
```bash
# Verify environment variables
vercel env ls

# Pull latest env vars
vercel env pull

# Check deployment logs
vercel logs
```

## Phase 5: Local Testing

- [ ] Installed dependencies: `npm install`
- [ ] Created `.env.local` with correct values
- [ ] Started dev server: `npm run dev`
- [ ] Verified app runs at `http://localhost:3000`

### Test Cases:

- [ ] Sign up as resident
  - Email: resident@test.com
  - Password: TestPassword123!
  - Expected: Should redirect to onboarding immediately

- [ ] Sign up as barangay official
  - Email: official@test.com
  - Password: TestPassword123!
  - Expected: Should show "Account Created - Pending Approval" message

- [ ] Login with both accounts
  - [ ] Resident can view dashboard
  - [ ] Official sees pending message (cannot access dashboard yet)

- [ ] Test report creation (as resident)
  - [ ] Create new report
  - [ ] Upload photo
  - [ ] Choose category
  - [ ] Submit successfully

- [ ] Verify database entries
  ```sql
  SELECT * FROM users;
  SELECT * FROM reports;
  ```

## Phase 6: Admin Approval Workflow

- [ ] Created super admin user in database:
  ```sql
  INSERT INTO users (id, name, email, role, email_verified)
  VALUES ('admin-uuid', 'Super Admin', 'admin@email.com', 'admin', true);
  ```

- [ ] Admin can view pending officials:
  - [ ] GET `/api/admin/pending-officials` returns pending users

- [ ] Admin can approve official:
  - [ ] POST `/api/admin/approve-official` with userId
  - [ ] User role changes from `pending_official` to `official`

- [ ] Admin can reject official:
  - [ ] DELETE `/api/admin/pending-officials` with userId
  - [ ] User is removed from system

## Phase 7: Production Testing

- [ ] Visit your Vercel URL in production
- [ ] Sign up as resident (production test)
- [ ] Sign up as official (production test)
- [ ] Login and verify roles work correctly
- [ ] Check database for new records
- [ ] Verify all database connections work

### Production Checklist:

```bash
# Check production logs
vercel logs --prod

# Get deployment information
vercel inspect
```

## Phase 8: Domain Setup (Optional)

- [ ] Purchased custom domain (e.g., ayosphph.com)
- [ ] Added domain to Vercel:
  - Go to **Settings** → **Domains**
  - Enter domain name
  - Update DNS records with registrar
- [ ] Verified domain is working
- [ ] Updated `NEXTAUTH_URL` to custom domain
- [ ] Redeployed on Vercel

## Phase 9: Email Notifications (TODO)

- [ ] Set up email service (Gmail/SendGrid/Resend)
- [ ] Created email template for approval notification
- [ ] Configured SMTP settings in environment variables
- [ ] Tested email sending
- [ ] Official receives approval email

## Phase 10: Security Checklist

- [ ] All sensitive data in environment variables (not in code)
- [ ] Database passwords are strong and stored securely
- [ ] GitHub repository is private (for production)
- [ ] Supabase RLS policies are enabled
- [ ] CORS is configured properly
- [ ] NEXTAUTH_SECRET is secure random string

```bash
# Generate secure secret
openssl rand -base64 32
```

## Phase 11: Monitoring & Alerts

- [ ] Enabled Vercel error tracking
- [ ] Set up error notifications
- [ ] Enabled Supabase auto-backups
- [ ] Downloaded test backup from Supabase
- [ ] Set up uptime monitoring (optional)

## Phase 12: Documentation & Handover

- [ ] README.md is complete and accurate
- [ ] DEPLOYMENT_GUIDE.md is up to date
- [ ] QUICKSTART.md for new developers
- [ ] Added comments to new API endpoints
- [ ] Created CHANGELOG.md
- [ ] Documented database schema

## Final Verification

### Test All Roles:

```bash
# 1. Resident Flow
# - Sign up as resident
# - Create report
# - View own reports
# ✅ Should work immediately

# 2. Official Flow (Pending)
# - Sign up as official
# - See "Pending Approval" message
# - Cannot access dashboard
# ✅ Should show approval pending

# 3. Admin Flow
# - Login as admin
# - View pending officials
# - Approve/reject officials
# ✅ Should manage approvals

# 4. Official Flow (Approved)
# - Admin approves official
# - Official can now login normally
# - Can view and resolve reports
# ✅ Should access dashboard
```

### Performance Checks:

- [ ] Page load time < 2 seconds
- [ ] No console errors in browser
- [ ] Database queries are optimized
- [ ] Images are properly compressed
- [ ] API responses are < 1 second

## Deployment Commands Summary

```bash
# GitHub
git push origin main

# Vercel
vercel --prod

# Check status
vercel status

# View logs
vercel logs --prod --limit=50
```

## Rollback Instructions

If something goes wrong:

```bash
# Revert to previous deployment
vercel rollback

# Or deploy specific commit
vercel --prod --commit [commit-hash]

# Check deployment history
vercel deployments
```

## Important URLs

- **App**: https://your-vercel-app.vercel.app
- **GitHub**: https://github.com/YOUR_USERNAME/ayosphph
- **Supabase**: https://app.supabase.com
- **Vercel Dashboard**: https://vercel.com/dashboard

## Next Steps After Deployment

- [ ] Monitor performance metrics
- [ ] Gather user feedback
- [ ] Set up analytics
- [ ] Plan feature releases
- [ ] Scale database as needed
- [ ] Add automated tests
- [ ] Implement CI/CD pipeline

## Support Contacts

- Vercel Support: https://vercel.com/support
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs

---

## Sign-Off

- [ ] All items checked off
- [ ] Deployment tested in production
- [ ] Team notified of deployment
- [ ] Monitoring is active
- [ ] Documentation is complete

**Deployment Date**: _______________

**Deployed By**: _______________

**Notes**:
```
_______________________________
_______________________________
_______________________________
```

---

✅ **Ready to Deploy!**
