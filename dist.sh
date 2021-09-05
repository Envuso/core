
echo "› Removing /dist directory"
rm -R dist

echo "› Building..."
yarn build

echo "› What did you change in this update?"
read commitMessage

if [ "$(git status --porcelain | wc -l)" -eq "0" ]; then
  echo "› 🟢 Git repo is clean."
else
  echo "› Repo is dirty, committing changes"
  git add .
  git commit -m ":package: $commitMessage"
fi

echo "› Incrementing version"
npm version patch

git add .
git commit -m ":package: $commitMessage"
git push origin main

echo "› Committed and pushed changes"

cp package.json dist/package.json

echo "› Copied package.json to /dist"

cd dist || exit

npm publish --access=public

echo "› Published changes to npm"

