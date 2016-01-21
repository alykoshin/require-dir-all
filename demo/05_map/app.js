// See README.md for details.

'use strict';

// Store config for each module in config object properties
// with property names corresponding to module names
var config = {
  module1: { value: 'config1' },
  module2: { value: 'config2' }
};

// Require all files in modules subdirectory
//var modules = require('require-dir-all')(
var modules = require('../../index.js')( // as this demo is the part of package itself, require index file of the package
  'modules', // Directory to require
  {          // Options
    // define function to be post-processed over exported object for each require-d module
    map: function(reqModule) {
      // take the require'd module's exports value,
      // create using it a new object using corresponding config as a parameter to constructor function
      // and replace exported value with this object
      reqModule.exports =
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


