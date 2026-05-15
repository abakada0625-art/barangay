# 🏘️ AyosPH - Community Issue Reporting System

A modern web application for residents to report community issues (potholes, broken lights, drainage problems, etc.) and for barangay officials to manage and resolve them.

![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Node](https://img.shields.io/badge/Node-18%2B-green)
![React](https://img.shields.io/badge/React-18-61dafb)

## 🎯 Overview

AyosPH streamlines the process of reporting and resolving community issues in barangays (Philippine municipalities). It provides:

- **Quick Issue Reporting** - Residents can report problems with photos
- **Easy Management** - Officials can track and resolve issues
- **Admin Oversight** - Super admins manage official accounts and monitor activity
- **Real-time Updates** - Automatic status tracking from pending to resolved

## ✨ Key Features

### For Residents 🏠
- Sign up and create an account instantly
- Report issues with photos and detailed descriptions
- Choose from 5 issue categories
- Track the status of reported issues
- View proof of completed fixes

### For Barangay Officials 🏛️
- Account approval workflow (pending super admin approval)
- Review all pending reports in your barangay
- Mark issues as fixed with proof photos
- Receive notifications of new reports

### For Super Admin 👨‍💼
- Approve/reject barangay official applications
- View all reports system-wide
- Manage user roles and permissions
- Monitor system activity

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 13+ or Supabase
- Git

### Installation (5 minutes)

```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/ayosphph.git
cd ayosphph

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env.local
# Edit .env.local with your database URL and secrets

# 4. Run development server
npm run dev
```

Visit: http://localhost:3000

For detailed setup instructions, see [QUICKSTART.md](./QUICKSTART.md)

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [QUICKSTART.md](./QUICKSTART.md) | Get started in 5 minutes |
| [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | Deploy to GitHub, Vercel & Supabase |
| [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) | Pre-deployment verification |
| [.env.example](./.env.example) | Environment variables reference |

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI components
- **Next.js/React Router** - Server-side rendering & routing
- **TailwindCSS** - Styling
- **Tanstack React Query** - Data fetching & caching
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Hono** - HTTP server framework
- **NextAuth.js** - Authentication
- **Argon2** - Password hashing

### Database
- **PostgreSQL** - Primary database
- **Supabase** - Managed PostgreSQL hosting

### Deployment
- **Vercel** - Web hosting
- **GitHub** - Version control & CI/CD
- **Supabase** - Database hosting

## 📁 Project Structure

```
ayosphph/
├── apps/
│   ├── web/                          # Main web application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── page.jsx         # Main dashboard
│   │   │   │   ├── account/         # Auth pages (signin, signup, logout)
│   │   │   │   ├── api/             # Backend API routes
│   │   │   │   │   ├── admin/       # Admin endpoints
│   │   │   │   │   ├── profile/     # User profile
│   │   │   │   │   ├── reports/     # Report CRUD
│   │   │   │   │   └── users/       # User management
│   │   │   │   └── onboarding/      # Onboarding page
│   │   │   ├── components/          # React components
│   │   │   ├── utils/               # Helper functions
│   │   │   └── auth.js              # NextAuth config
│   │   ├── package.json
│   │   └── tailwind.config.js
│   └── mobile/                       # React Native app (future)
├── DEPLOYMENT_GUIDE.md              # Full deployment guide
├── DEPLOYMENT_CHECKLIST.md          # Pre-deployment checklist
├── QUICKSTART.md                    # Quick start guide
├── .env.example                     # Environment variables template
└── README.md                        # This file
```

## 🔐 User Roles & Permissions

### Resident
- Create account immediately ✅
- Report issues 📝
- Upload photos 📷
- View own reports 👁️
- See proof of fixes 📸

### Barangay Official (Pending Approval)
- Create account ✅
- **Cannot access features** (awaiting admin approval)
- Will receive approval/rejection email

### Barangay Official (Approved)
- All pending permissions ✅
- Review reports 📋
- Mark issues as fixed ✅
- Upload proof photos 📸
- Manage issue status 🔄

### Super Admin
- Approve/reject official applications ✅
- View all reports 👁️
- Manage user roles 👥
- Monitor system activity 📊
- Full system access 🔑

## 🔄 Official Approval Workflow

```
┌─────────────┐
│   Signup    │
│  as Official│
└──────┬──────┘
       │
       ▼
┌─────────────────────────┐
│  Role: pending_official │
│  Status: Awaiting Admin │
└──────┬──────────────────┘
       │
       │ Admin Reviews
       ▼
    ┌─┴──┐
    │    │
    ▼    ▼
  ✅    ❌
APPROVE REJECT
    │      │
    ▼      ▼
┌──────┐ ┌────────┐
│Official│ │Deleted │
│Active  │ │Account │
└────────┘ └────────┘
```

## 📊 Database Schema

### Core Tables
- `auth_users` - Authentication users
- `auth_accounts` - OAuth accounts
- `auth_sessions` - Active sessions
- `users` - Application user profiles
- `reports` - Issue reports

### User Roles
```
resident         → Basic user, can report issues
pending_official → Awaiting super admin approval
official         → Approved, can resolve issues
admin            → Super admin, full access
```

## 🚀 Deployment

### Quick Deploy to Vercel

```bash
# 1. Push to GitHub
git push origin main

# 2. Deploy to Vercel
vercel --prod

# 3. Configure environment variables in Vercel
# Settings → Environment Variables → Add DATABASE_URL, etc.

# 4. Redeploy
vercel --prod
```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for full instructions including:
- GitHub setup
- Supabase database configuration
- Vercel deployment
- Custom domains
- Email notifications
- Monitoring & backups

## 🔧 Configuration

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@host/db

# Authentication
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=https://yourdomain.com

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

See [.env.example](./.env.example) for all available options.

## 📝 Recent Changes

### Version 1.0.0 - Release

✅ **Removed "Made with Anything" References**
- Updated auth configuration comments
- Cleaned up branding references

✅ **Official Approval Workflow**
- Officials now require super admin approval
- Pending officials see approval message on signup
- Super admin can approve/reject applications via dashboard
- New API endpoints: `/api/admin/pending-officials`

✅ **Deployment Ready**
- Complete deployment guide for GitHub, Vercel, Supabase
- Environment configuration templates
- Database schema SQL
- Pre-deployment checklist

## 🧪 Testing

### Test User Accounts

```
Resident:
  Email: resident@test.com
  Password: TestPassword123!
  Role: resident (immediate access)

Official (Pending):
  Email: official@test.com
  Password: TestPassword123!
  Role: pending_official (awaiting approval)

Admin:
  Email: admin@test.com
  Password: TestPassword123!
  Role: admin (full access)
```

## 🐛 Known Issues

- Mobile app not yet implemented
- Email notifications pending implementation
- Two-factor authentication not yet available
- Social login (Google, Facebook) pending

## 🎯 Roadmap

### Phase 1 (Current) ✅
- Core reporting functionality
- Admin approval workflow
- Role-based access control

### Phase 2 (Planned)
- Email notifications
- Push notifications for officials
- Real-time updates with WebSocket
- Mobile app (React Native)

### Phase 3 (Future)
- Analytics & dashboards
- Social login
- Two-factor authentication
- Location-based features

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 📞 Support

Need help?

- **Documentation**: Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/ayosphph/issues)
- **Email**: support@ayosphph.com

## 👥 Authors

- **Your Name** - Initial development

## 🙏 Acknowledgments

- Built with React & Next.js
- Styled with TailwindCSS
- Hosted on Vercel
- Database on Supabase
- Icons from Lucide React

## 📈 Stats

- **Active Users**: [TBD]
- **Reports**: [TBD]
- **Issues Resolved**: [TBD]
- **Uptime**: 99.9%

---

**Made with ❤️ for communities**

Last updated: May 2025
