// See README.md for details.

'use strict';

var modules = require('require-dir-all')();

// console.log('modules:', JSON.stringify(modules, null, 2));

// For tests:
module.exports = modules;

/*
Output:

modules: {
  "module1": "string exported from module 1",
  "module2": "string exported from module 2"
}
 */
