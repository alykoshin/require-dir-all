// See README.md for details.

'use strict';

var modules = require('require-dir-all')(
  'modules',
  { recursive: true }
);

console.log('modules:', JSON.stringify(modules, null, 2));
//console.log('\n');
//console.log('modules.module1:\'',           modules.module1 +           '\'');
//console.log('modules.module2:\'',           modules.module2 +           '\'');
//console.log('modules.dir1.module3:\'',      modules.dir1.module3 +      '\'');
//console.log('modules.dir1.dir2.module4:\'', modules.dir1.dir2.module4 + '\'');
//console.log('\n');

/*
Output:

modules: { module1: 'module1.exports', module2: 'module2.exports' }
modules.module1: modules/module1.exports
modules.module2: modules/module2.exports
modules.module3: modules/more/module3.exports
*/
