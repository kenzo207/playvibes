# 🔧 Guide de Débogage - Bouton Spotify

## Problème : Le bouton "Connect with Spotify" ne fonctionne pas sur Vercel

### Étape 1 : Vérifier la Console du Navigateur

1. Ouvrez votre site sur Vercel
2. Appuyez sur **F12** pour ouvrir les DevTools
3. Allez dans l'onglet **Console**
4. Cliquez sur le bouton "Connect with Spotify"
5. Notez les erreurs qui apparaissent

### Étape 2 : Vérifier les Variables d'Environnement Vercel

Sur Vercel, vérifiez que TOUTES ces variables sont définies :

```bash
SPOTIFY_CLIENT_ID=xxx
SPOTIFY_CLIENT_SECRET=xxx
SPOTIFY_REDIRECT_URI=https://votre-app.vercel.app/api/auth/callback/spotify
NEXTAUTH_URL=https://votre-app.vercel.app
NEXTAUTH_SECRET=xxx (32+ caractères aléatoires)
DATABASE_URL=xxx (votre URL PostgreSQL)
```

**IMPORTANT** : Après avoir ajouté/modifié des variables, vous DEVEZ redéployer !

### Étape 3 : Vérifier Spotify Developer Dashboard

1. Allez sur https://developer.spotify.com/dashboard
2. Sélectionnez votre app PlayVibes
3. Cliquez sur "Edit Settings"
4. Dans **Redirect URIs**, vérifiez que vous avez EXACTEMENT :
   ```
   https://votre-app.vercel.app/api/auth/callback/spotify
   ```
5. Cliquez sur "Save" en bas

### Étape 4 : Tester l'API NextAuth

Ouvrez dans votre navigateur :
```
https://votre-app.vercel.app/api/auth/providers
```

Vous devriez voir :
```json
{
  "spotify": {
    "id": "spotify",
    "name": "Spotify",
    "type": "oauth",
    "signinUrl": "...",
    "callbackUrl": "..."
  }
}
```

Si vous voyez `{}` ou une erreur, NextAuth n'est pas configuré correctement.

### Étape 5 : Vérifier la Base de Données

Le problème peut venir de la base de données. Si vous n'avez pas encore configuré PostgreSQL sur Vercel :

1. Sur Vercel, allez dans **Storage** → **Create Database**
2. Choisissez **Postgres**
3. Créez la base
4. Vercel ajoutera automatiquement `DATABASE_URL`
5. Connectez-vous à la base et exécutez le schéma :

```bash
# Depuis votre terminal local
psql "votre_database_url_vercel" < db/schema.sql
```

### Étape 6 : Erreurs Communes

#### Erreur : "Configuration invalid"
- Vérifiez que `NEXTAUTH_SECRET` est défini
- Vérifiez que `NEXTAUTH_URL` correspond à votre URL Vercel

#### Erreur : "Redirect URI mismatch"
- L'URL dans Spotify Dashboard doit être EXACTEMENT la même que `SPOTIFY_REDIRECT_URI`
- Pas de slash final `/` à la fin
- Protocole `https://` (pas `http://`)

#### Le bouton ne fait rien
- Ouvrez la console (F12)
- Vérifiez s'il y a des erreurs JavaScript
- Vérifiez que le SessionProvider est bien chargé

### Étape 7 : Test en Local

Pour tester en local et voir les erreurs plus facilement :

```bash
# Copiez vos variables d'environnement Vercel dans .env.local
npm run dev
```

Puis testez le bouton sur `http://localhost:3000`

### Étape 8 : Logs Vercel

1. Sur Vercel, allez dans **Deployments**
2. Cliquez sur votre dernier déploiement
3. Allez dans **Functions**
4. Cliquez sur une fonction API (ex: `/api/auth/[...nextauth]`)
5. Regardez les logs pour voir les erreurs

---

## Solution Rapide

Si rien ne fonctionne, essayez ceci dans l'ordre :

1. **Redéployez** votre app sur Vercel
2. **Videz le cache** du navigateur (Ctrl+Shift+Delete)
3. **Testez en navigation privée**
4. **Vérifiez que la base de données est accessible** depuis Vercel

---

## Besoin d'aide ?

Envoyez-moi :
1. Les erreurs de la console navigateur (F12)
2. Le résultat de `https://votre-app.vercel.app/api/auth/providers`
3. Une capture d'écran de vos variables d'environnement Vercel (masquez les secrets !)
