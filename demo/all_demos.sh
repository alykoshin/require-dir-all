#!/usr/bin/env bash

echo
echo "* Running all the demos..."
echo

echo "* simple"
node simple/app.js
echo

echo "* same_dir"
node same_dir/app.js
echo

echo "* recursive"
node recursive/app.js
echo

echo "* map"
node map/app.js
echo

echo "* initializers"
node initializers/app.js
echo

echo "* Finished."
