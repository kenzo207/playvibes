#!/bin/bash

# Script pour initialiser la base de données Vercel Postgres
# Usage: ./scripts/setup-vercel-db.sh "votre_connection_string"

if [ -z "$1" ]; then
    echo "❌ Erreur: Connection string manquante"
    echo ""
    echo "Usage: ./scripts/setup-vercel-db.sh \"postgres://...\""
    echo ""
    echo "Pour obtenir votre connection string:"
    echo "1. Allez sur Vercel → Storage → Votre base Postgres"
    echo "2. Copiez la 'Connection String'"
    exit 1
fi

CONNECTION_STRING="$1"

echo "🚀 Initialisation de la base de données PlayVibes..."
echo ""

# Exécuter le schéma
psql "$CONNECTION_STRING" < db/schema.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Base de données initialisée avec succès!"
    echo ""
    echo "Tables créées:"
    echo "  - users"
    echo "  - playlists"
    echo "  - playlist_likes"
    echo ""
    echo "Vous pouvez maintenant tester votre application sur Vercel!"
else
    echo ""
    echo "❌ Erreur lors de l'initialisation"
    echo ""
    echo "Vérifiez que:"
    echo "1. psql est installé (sudo apt install postgresql-client)"
    echo "2. La connection string est correcte"
    echo "3. Vous avez accès à Internet"
fi
