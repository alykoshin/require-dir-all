// See README.md for details.

'use strict';

var modules;

if (process.env.NODE_ENV !== 'test') {

  modules = require('require-dir-all')();

  console.log('modules:', JSON.stringify(modules, null, 2));

} else { // For tests:

  modules = require('../../index')();
  module.exports = modules;

}
/*
Output:

modules: {
  "module1": "string exported from module 1",
  "module2": "string exported from module 2"
}
 */
