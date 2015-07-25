// See README.md for details.

'use strict';

var config = {
  module1: { value: 'config1' },
  module2: 'config2'
};

var modules = require('require-dir-all')(
  'modules', // Directory to require
  {          // Options
    map: function(required) {
      required.exported = function(module) { return new module( config[required.name] ); };
      // Also may change the property name if needed
      // required.name = 'prefix_'+required.name;
    }
  }
);

console.log('modules:', modules);

// To iterate through the modules:

for (var module in modules) {
  if (modules.hasOwnProperty(module)) {
    console.log('module:', module, '; imported:', modules[module] );
  }
}


