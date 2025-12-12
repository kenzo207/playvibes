# PlayVibes

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white)

**A modern web application for discovering, sharing, and managing Spotify playlists.**

[Features](#features) • [Tech Stack](#tech-stack) • [Quick Start](#quick-start) • [Documentation](#documentation)

</div>

---

## Features

- **Secure Authentication**: Seamless integration with Spotify OAuth.
- **Playlist Discovery**: Advanced filters and search.
- **Social Interactions**: Share, like, and comment on playlists.
- **Integrated Playback**: Listen to tracks directly within the app (Spotify Premium required).
- **Responsive Design**: Optimized for Mobile, Tablet, and Desktop.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Neon](https://neon.tech/) or Docker)
- **ORM**: [Drizzle](https://orm.drizzle.team/)
- **Authentication**: [Better Auth](https://www.better-auth.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide Icons](https://lucide.dev/)

## Quick Start

### Prerequisites

- Node.js 18+
- Docker (for local database)
- Spotify Developer Account

### Usage

1.  **Clone the repository**

    ```bash
    git clone https://github.com/kenzo207/playvibes.git
    cd playvibes
    ```

2.  **Environment Setup**

    ```bash
    cp .env.example .env.local
    # Edit .env.local with your Spotify Credentials
    ```

3.  **Start Services**

    ```bash
    ./start.sh
    ```

    _This script handles dependencies, database migrations, and starts the development server._

4.  **Explore**
    Open [http://localhost:3000](http://localhost:3000)

## Documentation

- [Start Guide](./START.md) - Detailed local development setup.
- [Deployment Guide](./DEPLOYMENT.md) - Deploying to Vercel.
- [Testing Guide](./TESTING.md) - Running and writing tests.

## Contributing

Contributions are welcome. Please follow these steps:

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/NewFeature`)
3.  Commit your changes (`git commit -m 'feat: Add NewFeature'`)
4.  Push to the branch (`git push origin feature/NewFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
