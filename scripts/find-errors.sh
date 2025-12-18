#!/bin/bash

# Script pour identifier les erreurs JavaScript en production
echo "🔍 Analyse des erreurs potentielles..."
echo ""

# Chercher tous les .map() sans vérification
echo "📍 Recherche des .map() potentiellement dangereux:"
grep -rn "\.map(" app/ components/ --include="*.tsx" --include="*.ts" | grep -v "|| \[\]" | grep -v "?" | head -20

echo ""
echo "📍 Recherche des accès à des index [0] sans vérification:"
grep -rn "\[0\]" app/ components/ --include="*.tsx" --include="*.ts" | grep -v "?." | head -20

echo ""
echo "✅ Analyse terminée"
