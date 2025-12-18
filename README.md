# PlayVibes

![PlayVibes Banner](./public/og-image.png)

**Découvrez, partagez et vibrez avec les meilleures playlists Spotify.**

PlayVibes est une plateforme musicale sociale moderne qui permet aux utilisateurs de découvrir, partager et sauvegarder des playlists Spotify. Connectez-vous avec une communauté passionnée de musique et partagez vos vibes !

## ✨ Fonctionnalités

- 🎵 **Connexion Spotify** - Authentification OAuth sécurisée
- 📱 **Synchronisation** - Chargez vos playlists Spotify en un clic
- 🌍 **Découverte** - Explorez des milliers de playlists créées par la communauté
- 💾 **Sauvegarde** - Ajoutez des playlists directement dans votre Spotify
- ❤️ **Likes** - Aimez vos playlists préférées
- 🔍 **Recherche** - Trouvez des playlists par nom, artiste ou genre
- 🎨 **Design Moderne** - Interface glassmorphism avec gradients vibrants

## 🚀 Technologies

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **API**: Spotify Web API
- **Animations**: Framer Motion

## 📦 Installation

### Prérequis

- Node.js 18+ 
- PostgreSQL
- Compte Spotify Developer

### 1. Cloner le repository

\`\`\`bash
git clone <repository-url>
cd playvibes
\`\`\`

### 2. Installer les dépendances

\`\`\`bash
npm install
\`\`\`

### 3. Configuration Spotify OAuth

1. Allez sur [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Créez une nouvelle application
3. Ajoutez \`http://localhost:3000/api/auth/callback/spotify\` dans les Redirect URIs
4. Notez votre Client ID et Client Secret

### 4. Configuration de la base de données

Créez une base de données PostgreSQL et exécutez le schéma :

\`\`\`bash
psql -U your_user -d playvibes -f db/schema.sql
\`\`\`

### 5. Variables d'environnement

Copiez \`.env.example\` vers \`.env.local\` et remplissez les valeurs :

\`\`\`bash
cp .env.example .env.local
\`\`\`

Modifiez \`.env.local\` :

\`\`\`env
DATABASE_URL=postgresql://user:password@localhost:5432/playvibes
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/callback/spotify
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

Pour générer \`NEXTAUTH_SECRET\` :

\`\`\`bash
openssl rand -base64 32
\`\`\`

### 6. Lancer l'application

\`\`\`bash
npm run dev
\`\`\`

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🎨 Identité Visuelle

PlayVibes utilise une identité visuelle moderne et dynamique :

- **Couleurs principales** : Violet électrique (#8B5CF6) et Rose vibrant (#EC4899)
- **Typographie** : Inter (UI) et Outfit (Titres)
- **Style** : Glassmorphism avec gradients animés
- **Animations** : Transitions fluides et micro-interactions

## 📁 Structure du Projet

\`\`\`
playvibes/
├── app/                    # Pages Next.js (App Router)
│   ├── api/               # API Routes
│   ├── browse/            # Page découverte
│   ├── dashboard/         # Dashboard utilisateur
│   ├── playlist/[id]/     # Détail playlist
│   └── page.tsx           # Landing page
├── components/            # Composants React
│   ├── ui/               # Composants UI de base
│   └── layout/           # Layout components
├── lib/                   # Utilitaires et services
│   ├── auth/             # Configuration NextAuth
│   ├── db/               # Fonctions database
│   └── spotify/          # Client Spotify API
├── db/                    # Schéma database
└── public/               # Assets statiques
\`\`\`

## 🔐 Authentification

PlayVibes utilise NextAuth.js avec le provider Spotify OAuth. Les scopes demandés :

- \`user-read-email\`
- \`user-read-private\`
- \`playlist-read-private\`
- \`playlist-read-collaborative\`
- \`playlist-modify-public\`
- \`playlist-modify-private\`

## 🗄️ Base de Données

### Tables

- **users** - Informations utilisateurs
- **playlists** - Playlists publiées
- **playlist_likes** - Likes des playlists

Voir \`db/schema.sql\` pour le schéma complet.

## 🚀 Déploiement

### Vercel (Recommandé)

1. Push votre code sur GitHub
2. Importez le projet sur [Vercel](https://vercel.com)
3. Configurez les variables d'environnement
4. Utilisez Vercel Postgres pour la base de données
5. Déployez !

### Variables d'environnement en production

N'oubliez pas de mettre à jour :
- \`NEXTAUTH_URL\` avec votre domaine de production
- \`SPOTIFY_REDIRECT_URI\` avec l'URL de callback de production
- \`NEXT_PUBLIC_APP_URL\` avec votre domaine

## 📝 License

MIT

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

---

Fait avec ❤️ et 🎵 par l'équipe PlayVibes
\`\`\`
