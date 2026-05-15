# AyosPH - Quick Start Guide

Get AyosPH running on your local machine in 5 minutes!

## Prerequisites

- **Node.js 18+**: Download from https://nodejs.org
- **npm or yarn**: Comes with Node.js
- **PostgreSQL 13+** or **Supabase** account (free tier available)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/ayosphph.git
cd ayosphph
```

### 2. Install Dependencies

```bash
# Install all dependencies
npm install
# or
yarn install
```

### 3. Setup Database

#### Option A: Use Supabase (Recommended)

1. Create free account at https://supabase.com
2. Create a new project
3. Go to **Settings** → **Database** → Copy the connection string
4. Run the SQL schema (see DEPLOYMENT_GUIDE.md for SQL)

#### Option B: Local PostgreSQL

```bash
# Create database
createdb ayosphph

# Run migrations
psql -U postgres -d ayosphph -f schema.sql
```

### 4. Create Environment File

Create `.env.local` in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ayosphph

# NextAuth
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000

# API
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 5. Run Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

## Project Structure

```
ayosphph/
├── apps/
│   ├── web/                 # Main web application
│   │   ├── src/
│   │   │   ├── app/         # Pages and routes
│   │   │   ├── utils/       # Utilities and hooks
│   │   │   └── auth.js      # Authentication config
│   │   └── package.json
│   └── mobile/              # Mobile app (React Native)
└── DEPLOYMENT_GUIDE.md      # Deployment instructions
```

## Available Scripts

```bash
# Development server
npm run dev

# Type checking
npm run typecheck

# Build for production
npm run build

# Start production server
npm start
```

## Features

### User Roles

1. **Residents** 🏠
   - Report community issues
   - View report status
   - Upload photos

2. **Barangay Officials** 🏛️
   - Review reports
   - Mark issues as resolved
   - Upload proof of fix

3. **Super Admin** 👨‍💼
   - Approve official accounts
   - Manage all reports
   - View user analytics

### Issue Categories

- 💡 Lighting
- 🛣️ Road / Pavement
- 💧 Water / Drainage
- 🗑️ Garbage / Waste
- ⚠️ Other

## Testing Accounts

After setup, create test accounts:

```bash
# Test Resident
Email: resident@test.com
Password: TestPassword123!

# Test Official (pending approval)
Email: official@test.com
Password: TestPassword123!
```

## Workflow

1. **Resident reports** an issue with photo
2. **Official reviews** the report
3. **Official marks as fixed** with proof photo
4. **Resident sees** the resolution

## Common Issues

### Port 3000 Already in Use

```bash
# Use different port
PORT=3001 npm run dev

# Or kill the process
lsof -ti:3000 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :3000   # Windows
```

### Database Connection Error

Check `.env.local`:
- ✅ DATABASE_URL is correct
- ✅ Database is running
- ✅ Credentials are correct

### Dependencies Not Installing

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. **Customize** styling in `tailwind.config.js`
2. **Add** email notifications (see DEPLOYMENT_GUIDE.md)
3. **Deploy** to Vercel (see DEPLOYMENT_GUIDE.md)
4. **Enable** admin approval workflow
5. **Add** user authentication via social providers

## Documentation

- 📖 [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- 📚 [API Documentation](./docs/API.md)
- 🏗️ [Architecture](./docs/ARCHITECTURE.md)

## Support

- GitHub Issues: Open an issue on the repository
- Email: support@ayosphph.com

## License

MIT License - See LICENSE file for details

---

Happy coding! 🚀
