#!/bin/bash

VERSION="$(node -p "require('./package.json').version")"
CDATE="$(date +"%Y-%m-%d %T")"

COMMENT="v: $VERSION from $CDATE"

echo
echo 'git commit message:'
echo "\"$COMMENT\""
echo

npm run build
firebase deploy --only hosting
npx quasar clean

git checkout main
git add .
git commit -m "$COMMENT"
git push
