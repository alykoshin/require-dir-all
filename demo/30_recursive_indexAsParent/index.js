// See README.md for details.

'use strict';

//var modules = require('require-dir-all')(
var modules = require('../../index.js')( // as this demo is the part of package itself, require index file of the package
  'indexAsParent_false', {
    recursive: true,
    indexAsParent	: false
  }
);

console.log('indexAsParent_false:', JSON.stringify(modules, null, 2));

var modules = require('../../index.js')( // as this demo is the part of package itself, require index file of the package
  'indexAsParent_true', {
    recursive: true,
    indexAsParent	: true
  }
);

console.log('indexAsParent_true:', JSON.stringify(modules, null, 2));

/*

// indexAsParent_false
// In this case export from index.js was taken as property named 'index' of root object:

indexAsParent_false: {
  "index": {
    "index_property": "value exported from index.js"
  },
  "module1": {
    "module1_property": "value exported from module1.js"
  },
  "module2": {
    "module2_property": "string exported from module2.js"
  }
}

// indexAsParent_true
// In this case export from index.js was taken as a root object

indexAsParent_true: {
  "index_property": "value exported from index.js",
  "module1": {
    "module1_property": "value exported from module1.js"
  },
  "module2": {
    "module2_property": "string exported from module2.js"
  }
}

*/
