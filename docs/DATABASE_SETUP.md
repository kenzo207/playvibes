# Database Setup Instructions

This document provides instructions for setting up the PostgreSQL database and Drizzle ORM for the PlayVibes playlist sharing platform.

## Prerequisites

1. **Node.js** (v18 or higher)
2. **PostgreSQL** (v14 or higher)
3. **npm** or **yarn** package manager

## Required Dependencies

Install the following dependencies:

```bash
npm install drizzle-orm pg @types/pg drizzle-kit better-auth nanoid tsx postgres
```

## Database Setup

### 1. Create PostgreSQL Database

```sql
-- Connect to PostgreSQL as superuser
CREATE DATABASE playvibes;
CREATE USER playvibes_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE playvibes TO playvibes_user;
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and update the values:

```bash
cp .env.example .env.local
```

Update the following variables in `.env.local`:

```env
# Database
DATABASE_URL="postgresql://playvibes_user:your_secure_password@localhost:5432/playvibes"

# Spotify API (get from https://developer.spotify.com/)
SPOTIFY_CLIENT_ID="your_spotify_client_id"
SPOTIFY_CLIENT_SECRET="your_spotify_client_secret"

# Better Auth (generate a secure random string)
BETTER_AUTH_SECRET="your_better_auth_secret_key_here_make_it_long_and_secure"
BETTER_AUTH_URL="http://localhost:3000"
```

### 3. Generate and Run Migrations

```bash
# Generate migration files
npm run db:generate

# Apply migrations to database
npm run db:migrate

# Alternative: Push schema directly (for development)
npm run db:push
```

### 4. Seed Database (Optional)

```bash
# Add sample data to the database
npm run db:seed
```

## Database Schema

The database includes the following tables:

- **users**: User accounts and profiles
- **accounts**: OAuth tokens and provider information
- **shared_playlists**: Public playlists shared by users
- **playlist_likes**: User likes on playlists
- **playlist_comments**: Comments on playlists
- **saved_playlists**: Playlists saved by users

## Available Scripts

- `npm run db:generate` - Generate migration files from schema
- `npm run db:migrate` - Apply migrations to database
- `npm run db:push` - Push schema directly to database (development)
- `npm run db:studio` - Open Drizzle Studio for database management
- `npm run db:seed` - Seed database with sample data

## Spotify API Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add redirect URI: `http://localhost:3000/api/auth/callback/spotify`
4. Copy Client ID and Client Secret to your `.env.local` file

## Troubleshooting

### Connection Issues

- Ensure PostgreSQL is running
- Verify database credentials in `.env.local`
- Check that the database exists and user has proper permissions

### Migration Issues

- If migrations fail, check the database connection
- Ensure the database user has CREATE/ALTER privileges
- Try `npm run db:push` for development environments

### Dependency Issues

- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then reinstall
- Ensure you're using Node.js v18 or higher

## Production Considerations

- Use connection pooling for production databases
- Set up proper database backups
- Use environment-specific configuration
- Enable SSL for database connections
- Monitor database performance and optimize queries

## Next Steps

After completing the database setup:

1. Start the development server: `npm run dev`
2. Configure Spotify OAuth in your app settings
3. Test the authentication flow
4. Begin implementing the playlist sharing features
