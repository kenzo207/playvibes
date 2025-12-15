# ⚡ Déploiement Express - 5 Minutes

## 🎯 Objectif

Héberger PlayVibes rapidement pour partager le lien.

## 🚀 Solution Recommandée: Vercel + Neon

### Étape 1: Base de Données (2 minutes)

1. **Aller sur [neon.tech](https://neon.tech)**
2. **Créer un compte** (gratuit)
3. **Nouveau projet** → "PlayVibes"
4. **Copier la connection string** (commence par `postgresql://`)

### Étape 2: Déploiement (2 minutes)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Répondre aux questions:
# - Set up and deploy? → Y
# - Which scope? → (ton compte)
# - Link to existing project? → N
# - Project name? → playvibes
# - Directory? → ./
# - Override settings? → N
```

### Étape 3: Configuration (1 minute)

1. **Aller dans le dashboard Vercel** (lien affiché après déploiement)
2. **Settings → Environment Variables**
3. **Ajouter ces variables** :

```
DATABASE_URL = postgresql://[ta_connection_string_neon]
BETTER_AUTH_SECRET = playvibes_secret_key_production_2024_secure
BETTER_AUTH_URL = https://[ton-domaine].vercel.app
NEXTAUTH_URL = https://[ton-domaine].vercel.app
NEXT_PUBLIC_BETTER_AUTH_URL = https://[ton-domaine].vercel.app
SPOTIFY_CLIENT_ID = placeholder_for_now
SPOTIFY_CLIENT_SECRET = placeholder_for_now
```

4. **Redéployer** : `vercel --prod`

### Étape 4: Base de Données

```bash
# Appliquer le schéma
DATABASE_URL="[ta_connection_string_neon]" npm run db:push
```

## ✅ Résultat

- **URL publique** : `https://[ton-domaine].vercel.app`
- **App fonctionnelle** (sans Spotify pour l'instant)
- **Prêt à partager** !

## 🎵 Bonus: Ajouter Spotify Plus Tard

1. Créer app sur [developer.spotify.com](https://developer.spotify.com/dashboard)
2. Ajouter redirect URI: `https://[ton-domaine].vercel.app/api/auth/callback/spotify`
3. Mettre à jour les variables Vercel avec les vraies clés
4. Redéployer

## 🆘 Problèmes Courants

**Erreur de build** → Vérifier que `npm run build` fonctionne localement

**Variables non trouvées** → Redéployer après avoir ajouté les variables

**Base de données** → Vérifier la connection string Neon

## 📱 Test Rapide

Après déploiement, vérifier:

- [ ] Page d'accueil charge
- [ ] Design responsive fonctionne
- [ ] Navigation mobile fonctionne
- [ ] Pas d'erreurs dans la console

**Temps total: ~5 minutes** ⏱️
