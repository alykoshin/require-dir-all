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
      required.exported = function(moduleClass) { return new moduleClass( config[required.name] ); };
      // Also may change the property name if needed
      // required.name = 'prefix_'+required.name;
    }
  }
);

console.log('modules:', JSON.stringify(modules, null, 2));

// To iterate through the modules at top level:

for (var moduleName in modules) {
  if (modules.hasOwnProperty(moduleName)) {
    console.log('moduleName:', moduleName, '; imported:', modules[moduleName] );
  }
}


