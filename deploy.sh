#!/usr/bin/env bash

# abort (exit) on errors; built-in cmd (see man bash);
set -e

# put build date in file for App.vue;
CURRDATE=`date "+%a %b %d %Y - %T"`
echo "export const builddate = \"$CURRDATE\"" > src/assets/builddate.js

# build
npm run build

echo "export const builddate = \"date not set\"" > src/assets/builddate.js
echo "Built!"

# for delivery at localhost/
cp dist/index.html /Library/WebServer/Documents/
rm /Library/WebServer/Documents/css/app.*.css
cp dist/css/* /Library/WebServer/Documents/css
rm /Library/WebServer/Documents/js/*
cp dist/js/* /Library/WebServer/Documents/js
echo "Copied to WebServer root"
exit

# copy to serve on localhost and to upload from rumlcomrepo
#  ==> needs to have "vue": { "publicPath": "/timelines/app/" }
#      in package.json
#  rm -rf /Library/WebServer/Documents/timelines/app/*
#  cp -r dist/* /Library/WebServer/Documents/timelines/app/

#  rm -rf /Library/WebServer/Documents/rumlcomrepo/timelines/app/*
#  cp -r dist/* /Library/WebServer/Documents/rumlcomrepo/timelines/app/

#  echo "Copied! and done"
#  exit

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

# to push the dist to github!!
cd dist
git init
git add -A
git commit -m 'deploy'
echo "Commited to new repo in dist"

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:bruml2/studioTimelineView.git master:gh-pages

# return to previous directory
cd -
