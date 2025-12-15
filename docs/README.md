# 🎵 PlayVibes - Playlist Sharing Platform

A modern web application for sharing and discovering Spotify playlists with the community.

## ✨ Features

- 🎧 **Spotify Integration** - Connect your Spotify account
- 📱 **Responsive Design** - Works on all devices
- 🔍 **Smart Search** - Find playlists by genre, mood, and activity
- ❤️ **Social Features** - Like, comment, and save playlists
- 🎨 **Modern UI** - Built with shadcn/ui and Tailwind CSS
- ⚡ **Fast Performance** - Optimized with Next.js 15

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Spotify Developer Account

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd playvibes
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Set up database**

   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## 🔧 Configuration

### Spotify API Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add redirect URI: `http://localhost:3000/api/auth/callback/spotify`
4. Copy Client ID and Secret to `.env.local`

### Database Setup

See `QUICK_DB_SETUP.md` for detailed database configuration instructions.

## 📦 Deployment

### Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`
3. Set up environment variables in Vercel dashboard
4. Apply database schema: `npm run db:push`

See `DEPLOYMENT_GUIDE.md` for complete deployment instructions.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth with Spotify OAuth
- **Deployment**: Vercel
- **Language**: TypeScript

## 📁 Project Structure

```
playvibes/
├── app/                 # Next.js app directory
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── auth/           # Authentication components
│   ├── playlists/      # Playlist-related components
│   └── layout/         # Layout components
├── lib/                # Utilities and configurations
│   ├── db/             # Database schema and connection
│   └── auth.ts         # Authentication configuration
├── hooks/              # Custom React hooks
└── public/             # Static assets
```

## 🎯 Features Implemented

- ✅ User authentication with Spotify
- ✅ Responsive navigation with mobile menu
- ✅ Playlist browsing and search
- ✅ Like and save functionality
- ✅ Comment system
- ✅ Spotify playback integration
- ✅ Modern UI with animations
- ✅ Optimized images with lazy loading

## 🔄 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Drizzle Studio

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- Check `AUTH_FIX_GUIDE.md` for authentication issues
- See `DEPLOYMENT_GUIDE.md` for deployment help
- Review `QUICK_DB_SETUP.md` for database setup

---

Built with ❤️ using modern web technologies
