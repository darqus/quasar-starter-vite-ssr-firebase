#!/bin/bash

VERSION=`grep -o '"version": "[^"]*' package.json | grep -o '[^"]*$'`
CDATE=`date +"%Y-%m-%d %T"`

sed -i "s/^VITE_BUILD_DATE.*/VITE_BUILD_DATE=$CDATE/g" .env

prop="version"
VERSION="$(node -e "console.log(require('./package.json')['$prop'])")"
echo "$prop: '$VERSION'"
sed -i "s/^VITE_VERSION.*/VITE_VERSION=$VERSION/g" .env

COMMENT='v: '$VERSION' from '$CDATE

echo
echo 'git commit message:'
echo '"'$COMMENT'"'
echo

quasar build

git checkout main
git add .
git commit -m "$COMMENT"
git push

firebase deploy --only hosting
quasar clean
