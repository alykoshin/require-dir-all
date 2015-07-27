[![npm version](https://badge.fury.io/js/require-dir-all.svg)](http://badge.fury.io/js/require-dir-all)
[![Build Status](https://travis-ci.org/alykoshin/require-dir-all.svg)](https://travis-ci.org/alykoshin/require-dir-all)
[![Coverage Status](http://coveralls.io/repos/alykoshin/require-dir-all/badge.svg?branch=master&service=github)](http://coveralls.io/github/alykoshin/require-dir-all?branch=master)
[![Code Climate](https://codeclimate.com/github/alykoshin/require-dir-all/badges/gpa.svg)](https://codeclimate.com/github/alykoshin/require-dir-all)

[![Dependency Status](https://david-dm.org/alykoshin/require-dir-all.svg)](https://david-dm.org/alykoshin/require-dir-all)
[![devDependency Status](https://david-dm.org/alykoshin/require-dir-all/dev-status.svg)](https://david-dm.org/alykoshin/require-dir-all#info=devDependencies)

require-dir-all
=================

Yet another Node.js helper to ```require``` all files in directory.
Useful when needed to ```require``` group of files in same directory(-ies) with similar functionality, 
like routes, controllers, middlewares, models, etc. 

Inspired by [require-all](https://github.com/felixge/node-require-all) and 
[require-dir](https://github.com/aseemk/requireDir) packages. 
Both of them are good, but the first of them lacks relative paths support (need to use ```__dirname```) and always recursive, 
while the second one lacks file/dir filtering and for some reason store modules in non-hierarchical structure, taking only 
one file from several ones with the same name. 

## Installation

```sh
npm install require-dir-all --save
```

## Usage

### Basic usage

```js
var modules = require('require-dir-all')('directory_to_require');
```

Now variable ```modules``` will contain exported values 
from all the modules ```.js```, ```.json```, ```.coffee``` in directory 
accessible by its properties, for example ```modules.module1``` as if they were require'd like:

```js
modules = {
  module1: require('module1')
  module2: require('module2')
}
```

## Options

You may provide additional options using second optional parameter:

```js
var modules = require('require-dir-all')(
  'directory_to_require', // relative or absolute directory 
  { // options
    map: function(reqModule) { /* you may postprocess the name of property the module will be stored and exported object */ }
    recursive:    false,                          // recursively go through subdirectories; default value shown
    includeFiles: /^.*\.(js|json|coffee)$/,       // RegExp to select files; default value shown
    excludeDirs:   /^(\.git|\.svn|node_modules)$/  // RegExp to ignore subdirectories; default value shown
  }
);
```

Options:    
- ```map```: function to postprocess each ```require```'d file (see example below); default: ```null```
- ```recursive```  - recursively go through subdirectories; default: ```false```
- ```includeFiles``` - reg exp to include files,
  default: ```/^.*\.(js|json|coffee)$/```, 
  which means to ```require``` only ```.js```, ```.json```, ```.coffee``` files
- ```excludeDirs``` - reg exp to exclude subdirectories (when ```recursive: true``` ), 
  default: ```/^(\.(git|svn)|(node_modules))$/```, 
  which means to exclude directories ```.git```, ```.svn```, ```node_modules``` while going recursively 

## Tips

Typical task is to run the function for each module required from the directory (like init or shutdown routines).
With this module it is needed to reqursively go through all the properties (i.e.module's exports) 
and run the function for each of tehm

If you need to wait until the end of initialization of all the modules, using ```async``` 
(assuming each module's initialize method accepts callback as a parameter).

Require'd file ```modules/module.js```

```js
module.exports = { 
  initialize: function(cb) {
    return cb(false, 'some result');
  }
};
```

Require'ing file ```index.js```:

```js
var _ = require('lodash');
var async = require('async');
var modules = require('require-dir-all')('modules');

module.exports.initialize = function(cb) {
  var initializers = [];
  _.forOwn(modules, function(module) {
//  for (var module in modules) { if (modules.hasOwnProperty(module)) {
      initializers.push( function(cb) { return module.initialize(cb); } );
//  } }
  });
  async.parallel(initializers, cb);
};
```

If you do not need to wait till the finish of initialization of both modules:

```js
var _ = require('lodash');
var modules = require('require-dir-all')('modules');

module.exports.initialize = function(cb) {
  _.forOwn(modules, function(module) {
//  for (var module in modules) { if (modules.hasOwnProperty(module)) {
      module.initialize(cb); ;
//  } }
  });
};
```

### Simple 

If you need to require all the ```.js```, ```.json```, ```.coffee``` files in the directory ```modules```, add following line:

```js
var modules = require('require-dir-all')('modules');
```
    
or if you like:
    
```js
var require_dir_all = require('require-dir-all');
var modules = require_dir_all('modules');
```

Object ```modules``` will be populated with properties which names will correspond to module names and values - to exported 
objects. 
Traditional equivalent:

```js
modules = {
  module1: require('module1')
  module2: require('module2')
}
```
                      
By default directories ```.git```, ```.svn```, ```node_modules``` are excluded.

#### Example 
 
Assume you have following structure:

```
modules/
    module1.js
    module2.js
app.js
```

File ```module1.js``` exports:

```
module.exports = 'string exported from module 1';
```

File ```module2.js``` exports:

```
module.exports = 'string exported from module 2';
```

In ```app.js```:

```js
var modules = require('require-dir-all')('modules');

console.log('modules:', modules);
```
    
Result:

```js
modules: { 
  module1: 'string exported from module 1', 
  module2: 'string exported from module 2' 
}
```

You can find this example in ```demo/simple/```
To run it: 

```js
cd demo/simple/
npm install
node app
```

### Recursive

Option ```recursive: true``` allows to require recursively the directory and all its subdirectories.

#### Example

You can find this example in ```demo/recursive/```

Directory structure:
```sh
$ ls -R demo/recursive/modules/
demo/recursive/modules/:
dir1  dir.a.b.c  excluded  excluded.2  module1.js  module2.js

demo/recursive/modules/dir1:
dir2  module3.js

demo/recursive/modules/dir1/dir2:
module4.js

demo/recursive/modules/dir.a.b.c:
module5.js

demo/recursive/modules/excluded:
excluded.js

demo/recursive/modules/excluded.2:
excluded.js
```

File app.js:

```js
'use strict';

var modules = require('require-dir-all')(
  'modules', {
    recursive: true,
    excludeDirs: /^excluded.*$/
  }
);

console.log('modules:', JSON.stringify(modules, null, 2));
```

Output:

```
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
```

### Map

Option ```map``` allows to define function to run for each ```require```'d file.

Object properties.
These properties may be changed:
- ```name``` - module name to be stored in result object 
- ```exports``` - module's exports value 
These properties are read-only:
- ```path``` - filepath,
- ```base``` - base part of file name,
- ```ext``` - file extension


Assume you have following structure:

```
modules/
  module1
  module2
```

If each file ```module1.js```, ```module2.js``` in ```modules``` directory exports a constructor
 to which the some config parameters are passed like this:
```js
'use strict';

// Object constructor
var Object1 = function(config) {
  this.name = 'Object1';
  this.config = config;
};

// Exporting constructor function
module.exports = Object1;
```

and the code which ```require```'s these files in ```app_old.js``` is like following:

```js
// For 
var config1 = { value: 'config1' },
  config2 = 'config2';
  
var module1 = new (require('modules/module1'))(config1),
  module2 = new ()require('module/module2'))(config2);
```

You may replace this with following code:

```js
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
```
    
Result:

```js
modules: {
  "module1": {
    "name": "Object1",
    "config": {
      "value": "config1"
    }
  },
  "module2": {
    "name": "Object2",
    "config": {
      "value": "config2"
    }
  }
}
```

You can find this example in ```demo/map/```
To run it: 
```sh
cd demo/map/
npm install
node app
```

## Links to package pages:

[github.com](https://github.com/alykoshin/require-dir-all)
[npmjs.com](https://www.npmjs.com/package/require-dir-all)
[travis-ci.org](https://travis-ci.org/alykoshin/require-dir-all)
[coveralls.io](https://coveralls.io/github/alykoshin/require-dir-all)
