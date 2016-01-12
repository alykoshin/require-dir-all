// See README.md for details.

'use strict';

//var modules = require('require-dir-all')();
var modules = require('../../index.js')(); // as this demo is the part of package itself, require index file of the package

console.log('modules:', JSON.stringify(modules, null, 2));

/*
Output:

modules: {
  "module1": "string exported from module 1",
  "module2": "string exported from module 2"
}
 */
