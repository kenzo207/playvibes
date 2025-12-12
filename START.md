# Getting Started Guide

Follow this guide to set up the **PlayVibes** development environment on your local machine.

## Prerequisites

Ensure you have the following installed:

- **Node.js 18+**
- **Docker** & **Docker Compose**
- **Git**

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/kenzo207/playvibes.git
cd playvibes
```

### 2. Configure Environment

Create your local environment file:

```bash
cp .env.example .env.local
```

**Required Variables**:

- `DATABASE_URL`: Connection string for PostgreSQL (defaults work with the provided Docker setup).
- `SPOTIFY_CLIENT_ID`: Available in the [Spotify Dashboard](https://developer.spotify.com/dashboard).
- `SPOTIFY_CLIENT_SECRET`: Available in the [Spotify Dashboard](https://developer.spotify.com/dashboard).
- `BETTER_AUTH_SECRET`: A random string for session security.

### 3. Start Database

Start the PostgreSQL instance:

```bash
docker compose up -d
npm run db:push
```

### 4. Run the Application

We provided a script to handle dependencies and port conflicts automatically.

```bash
./start.sh
```

Alternatively, you can run manually:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Spotify Integration Setup

To enable authentication and playback, configure your Spotify App in the [Developer Dashboard](https://developer.spotify.com/dashboard):

1.  **Create App**: Name it "PlayVibes Dev".
2.  **Redirect URIs**: Add these **exact** URLs:
    - `http://localhost:3000/api/auth/callback/spotify`
    - `http://localhost:3001/api/auth/callback/spotify`
3.  **Credentials**: Copy `Client ID` and `Client Secret` to your `.env.local` file.

---

## Useful Commands

| Command             | Description                        |
| :------------------ | :--------------------------------- |
| `npm run dev`       | Start development server           |
| `npm run db:studio` | Open Drizzle Studio (Database GUI) |
| `npm run lint`      | Check for code issues              |
| `npm test`          | Run test suite                     |
