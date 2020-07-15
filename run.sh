if [ "$1" = "" ]; then
  echo "No test found"
  exit 1
fi

./node_modules/mocha/bin/mocha $1