# Quick Database Setup for Development

## Option 1: Local PostgreSQL (Recommended)

### Install PostgreSQL

```bash
# macOS with Homebrew
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/
```

### Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database and user
CREATE DATABASE playvibes;
CREATE USER playvibes_user WITH PASSWORD 'dev_password';
GRANT ALL PRIVILEGES ON DATABASE playvibes TO playvibes_user;
\q
```

### Update Environment

Update `.env.local`:

```env
DATABASE_URL="postgresql://playvibes_user:dev_password@localhost:5432/playvibes"
```

### Apply Schema

```bash
npm run db:push
```

## Option 2: Docker PostgreSQL (Easy)

### Create docker-compose.yml

```yaml
version: "3.8"
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: playvibes
      POSTGRES_USER: playvibes_user
      POSTGRES_PASSWORD: dev_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Start Database

```bash
docker-compose up -d
```

### Update Environment

Same as Option 1 - update `.env.local` with the connection string.

## Option 3: Cloud Database (Neon/Supabase)

### Neon (Free tier)

1. Go to https://neon.tech
2. Create account and database
3. Copy connection string to `.env.local`

### Supabase (Free tier)

1. Go to https://supabase.com
2. Create project
3. Get connection string from Settings > Database
4. Update `.env.local`

## Verify Setup

```bash
# Test connection
npm run db:push

# Start development server
npm run dev
```

## Troubleshooting

### Connection refused

- Ensure PostgreSQL is running
- Check port 5432 is available
- Verify credentials in DATABASE_URL

### Permission denied

- Ensure user has proper privileges
- Try connecting with psql first

### Tables not found

- Run `npm run db:push` to create tables
- Check migration files in `drizzle/` folder
