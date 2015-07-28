// See README.md for details.

'use strict';

var modules = require('require-dir-all')(
  'modules', {
    recursive: true,
    excludeDirs: /^excluded.*$/
  }
);

console.log('modules:', JSON.stringify(modules, null, 2));

/*
Output:

modules: {
  "dir.a.b.c": {
    "module5": "string exported from module 5"
  },
  "dir1": {
    "dir2": {
      "module4": "string exported from module 4"
    },
    "module3": "string exported from module 3"
  },
  "module1": "string exported from module 1",
  "module2": "string exported from module 2"
}
*/

// Iterate through all the modules

var iterate = function(modules) {
  for (var m in modules) {
    if (modules.hasOwnProperty(m)) {
      if (typeof modules[m] === 'string') {
        console.log('module:', m,'; exports:', modules[m]);
      } else {
        console.log('subdir:', m);
        iterate (modules[m]);
      }
    }
  }
};
iterate(modules);

