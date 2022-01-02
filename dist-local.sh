
echo "› Removing /dist directory"
rm -R dist

echo "› Building..."
tsc

mv dist/events dist/Events

cp package.json dist/package.json
cp ./.bin/cli-prod dist/ecli

echo "› Copied required files to /dist"

cd ../FrameworkScaffold || exit
yarn unlink "@envuso/core"

cd ../Core/dist || exit
yarn link

cd ../../FrameworkScaffold || exit
yarn link "@envuso/core"

