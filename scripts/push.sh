

if [ $CIRCLE_BRANCH = "dev" ]
then
    docker build -t flooper68/fathers:latest -t flooper68/fathers:"$( jq -r .version package.json )-build.${CIRCLE_BUILD_NUM}" .
else
    docker build -t flooper68/fathers:"$( jq -r .version package.json )-build.${CIRCLE_BUILD_NUM}" .
fi

docker login -u "${DOCKERHUB_USER}" --password-stdin "${DOCKERHUB_PASS}"

docker push flooper68/fathers