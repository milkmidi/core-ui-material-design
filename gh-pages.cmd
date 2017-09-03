cd dist
git rm -rf .git
git init
git add .
git commit -a -m "deploy to Github pages"
git push --force git@github.com:milkmidi/core-ui-material-design.git master:gh-pages
pause