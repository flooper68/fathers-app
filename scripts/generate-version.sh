PACKAGE_VERSION="$( jq -r .version package.json )"
DATE="$( date )"

rm ./src/shared/version.ts

echo "Build tag: ${PACKAGE_VERSION}-build.${CIRCLE_BUILD_NUM}"

echo "export const APP_VERSION = {version: \"${PACKAGE_VERSION}-build.${CIRCLE_BUILD_NUM}\", timestamp: \"${DATE}\"}" >> ./src/shared/version.ts