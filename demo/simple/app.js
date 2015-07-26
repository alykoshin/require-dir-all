// See README.md for details.

'use strict';

var modules = require('require-dir-all')('modules');

console.log('modules:', JSON.stringify(modules, null, 2));
console.log('modules.module1:', modules.module1);
console.log('modules.module2:', modules.module2);

/*
Output:

modules: { module1: 'module1.exports', module2: 'module2.exports' }
modules.module1: module1.exports
modules.module2: module2.exports
*/
