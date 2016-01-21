// See README.md for details.

'use strict';

// configs for each module
var config1 = { value: 'config1' },
  config2 = 'config2';

// require all the needed files
var module1 = new (require('./modules/module1'))(config1),
  module2 = new (require('./modules/module2'))(config2);

console.log('object from module1:', module1);
console.log('object from module2:', module2);

