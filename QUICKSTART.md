# 🚀 Guide de Démarrage Rapide - PlayVibes

## Étape 1 : Configuration de la Base de Données

### Option A : PostgreSQL Local

```bash
# Installer PostgreSQL si nécessaire
sudo apt install postgresql postgresql-contrib

# Créer la base de données
sudo -u postgres createdb playvibes

# Exécuter le schéma
sudo -u postgres psql playvibes < db/schema.sql
```

### Option B : Vercel Postgres (Recommandé pour production)

1. Allez sur [Vercel](https://vercel.com)
2. Créez un nouveau projet
3. Ajoutez Vercel Postgres dans l'onglet Storage
4. Copiez la `DATABASE_URL` fournie

## Étape 2 : Configuration Spotify OAuth

1. Allez sur [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Cliquez sur "Create an App"
3. Remplissez les informations :
   - **App name** : PlayVibes
   - **App description** : Plateforme de partage de playlists
4. Une fois créé, cliquez sur "Edit Settings"
5. Ajoutez dans **Redirect URIs** :
   - `http://localhost:3000/api/auth/callback/spotify`
6. Notez votre **Client ID** et **Client Secret**

## Étape 3 : Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet :

```bash
cp .env.example .env.local
```

Modifiez `.env.local` avec vos valeurs :

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/playvibes

# Spotify OAuth
SPOTIFY_CLIENT_ID=votre_client_id_spotify
SPOTIFY_CLIENT_SECRET=votre_client_secret_spotify
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/callback/spotify

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generer_avec_openssl_rand_base64_32

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Pour générer `NEXTAUTH_SECRET` :

```bash
openssl rand -base64 32
```

## Étape 4 : Lancer l'Application

```bash
# Les dépendances sont déjà installées
# Si besoin : npm install

# Lancer en mode développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Étape 5 : Tester le Flow

1. **Landing Page** : Cliquez sur "Connect with Spotify"
2. **Authentification** : Autorisez l'application Spotify
3. **Dashboard** : Vos playlists Spotify s'affichent
4. **Publier** : Cliquez sur "Publier" pour une playlist
5. **Découvrir** : Allez sur `/browse` pour voir les playlists publiques
6. **Détails** : Cliquez sur une playlist pour voir les détails
7. **Sauvegarder** : Cliquez sur "Sauvegarder dans Spotify"

## 🎨 Personnalisation

### Modifier les Couleurs

Éditez `tailwind.config.ts` :

```typescript
colors: {
  primary: {
    600: '#8B5CF6', // Votre couleur principale
  },
  accent: {
    500: '#EC4899', // Votre couleur d'accent
  },
}
```

### Modifier le Logo

Remplacez les fichiers dans `public/` :
- `logo-full.png`
- `logo-icon.png`
- `og-image.png`

## 🚀 Déploiement sur Vercel

```bash
# Push sur GitHub
git add .
git commit -m "Initial commit"
git push origin main

# Sur Vercel
1. Importez votre repository GitHub
2. Configurez les variables d'environnement
3. Ajoutez Vercel Postgres
4. Déployez !
```

N'oubliez pas de mettre à jour dans Spotify Developer Dashboard :
- Redirect URI : `https://votre-domaine.vercel.app/api/auth/callback/spotify`

## 📝 Commandes Utiles

```bash
npm run dev          # Développement
npm run build        # Build de production
npm run start        # Lancer en production
npm run lint         # Linter
npm run type-check   # Vérification TypeScript
```

## 🐛 Troubleshooting

### Erreur de connexion à la base de données
- Vérifiez que PostgreSQL est lancé
- Vérifiez la `DATABASE_URL` dans `.env.local`

### Erreur Spotify OAuth
- Vérifiez que les Redirect URIs sont corrects
- Vérifiez le Client ID et Client Secret

### Erreur de build
- Supprimez `node_modules` et `.next`
- Relancez `npm install`

## 🎉 C'est Parti !

Votre plateforme PlayVibes est prête ! Amusez-vous bien ! 🎵
