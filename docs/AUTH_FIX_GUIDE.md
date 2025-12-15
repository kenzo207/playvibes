# Authentication Fix Guide

## Problem

The Better Auth library is missing the "verification" table in the database schema, causing authentication errors.

## Solution Applied

### 1. Updated Database Schema

Added the missing tables to `lib/db/schema.ts`:

- `sessions` table for session management
- `verification` table for email verification and other verification processes

### 2. Updated Auth Configuration

Modified `lib/auth.ts` to include all required tables in the Drizzle adapter schema.

### 3. Database Migration Required

To fix the authentication errors, you need to apply the database changes:

#### Option A: Using Drizzle (Recommended)

```bash
# Generate migration
npm run db:generate

# Apply migration (requires valid DATABASE_URL)
npm run db:migrate
```

#### Option B: Manual SQL (If no database configured)

```bash
# Run the initialization script
node scripts/init-dev-db.js

# Then apply the generated SQL to your database
psql $DATABASE_URL -f init-dev.sql
```

#### Option C: Quick Development Setup

1. Install PostgreSQL locally
2. Create database:
   ```sql
   CREATE DATABASE playvibes;
   CREATE USER playvibes_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE playvibes TO playvibes_user;
   ```
3. Update `.env.local`:
   ```env
   DATABASE_URL="postgresql://playvibes_user:secure_password@localhost:5432/playvibes"
   ```
4. Run migrations:
   ```bash
   npm run db:push
   ```

## Tables Added

### sessions

- `id` (TEXT, PRIMARY KEY)
- `user_id` (TEXT, FOREIGN KEY to users.id)
- `expires_at` (TIMESTAMP)
- `token` (TEXT, UNIQUE)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### verification

- `id` (TEXT, PRIMARY KEY)
- `identifier` (TEXT)
- `value` (TEXT)
- `expires_at` (TIMESTAMP)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Verification

After applying the fix:

1. Restart the development server
2. Try signing in with Spotify
3. Check that no "verification model not found" errors appear

## Troubleshooting

### If you still get errors:

1. Ensure all tables exist in your database
2. Check that the DATABASE_URL is correct
3. Verify that the database user has proper permissions
4. Clear browser cache and cookies
5. Restart the development server

### For production deployment:

1. Apply migrations to production database
2. Ensure all environment variables are set
3. Test authentication flow thoroughly
