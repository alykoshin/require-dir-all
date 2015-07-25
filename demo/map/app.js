// See README.md for details.

'use strict';

var config = {
  module1: { value: 'config1' },
  module2: 'config2'
};

var modules = require('require-dir-all')(
  'modules', // Directory to require
  {          // Options
    map: function(req) {
      req.exported = function(module) { return new module( config[req.name] ); };
      // Also may change the property name if needed
      // req.name = 'prefix_'+req.name;
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


