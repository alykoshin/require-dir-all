// See README.md for details.

'use strict';

// Store config for each module in config object properties
// with property names corresponding to module names
var config = {
  module1: { value: 'config1' },
  module2: { value: 'config2' }
};

// Require all files in modules subdirectory
var modules = require('require-dir-all')(
  'modules', // Directory to require
  {          // Options
    map: function(reqModule) {
      // define function to be post-processed over exported object for each require-d module
      reqModule.exports =
        // create new object with corresponding config passed to constructor
         new reqModule.exports( config[reqModule.name] );
      // Also may change the property name if needed
      // reqModule.name = 'prefix_'+reqModule.name;
    }
  }
);

console.log('modules:', JSON.stringify(modules, null, 2));

// To iterate through the modules at top level (without recursion):

for (var moduleName in modules) {
  if (modules.hasOwnProperty(moduleName)) {
    console.log('moduleName:', moduleName, '; imported:', modules[moduleName] );
  }
}

