// See README.md for details.

'use strict';

var modules = require('require-dir-all')('modules');

console.log('modules:', JSON.stringify(modules, null, 2));

/*
Output:

modules: {
  "module1": "module1.exports",
  "module2": "module2.exports"
}
*/
