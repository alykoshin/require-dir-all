#!/usr/bin/env bash

echo
echo "* Running all the demos..."
echo


echo "* 01_simple"
node 01_simple/app.js
echo

echo "* 02_same_dir"
node 02_same_dir/app.js
echo

echo "* 03_array_dir"
node 03_array_dir/app.js
echo

echo "* 04_recursive"
node 04_recursive/app.js
echo

echo "* 05_map"
node 05_map/app.js
echo

echo "* 06_initializers"
node 06_initializers/app.js
echo


echo "* 10_config files"
node 10_config/app.js
echo


echo "* 20_gulp_simple"
gulp --cwd 20_gulp_simple
echo

echo "* 21_gulp_advanced"
gulp --cwd 21_gulp_advanced
echo


echo "* Finished."
