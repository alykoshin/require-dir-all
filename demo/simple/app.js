// See README.md for details.

'use strict';

var modules = require('require-dir-all')('modules');

console.log('modules:', modules);
console.log('modules.module1:', modules.module1);
console.log('modules.module2:', modules.module2);
