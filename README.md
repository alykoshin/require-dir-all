require-dir-all
=================

Yet another Node.js helper to ```require``` all files in directory

[Link to package page in npm repository](https://www.npmjs.com/package/require-dir-all)

Inspired by [require-all](https://github.com/felixge/node-require-all) and 
[require-dir](https://github.com/aseemk/requireDir) packages.

!!! WARNING: the package is in alpha state, it may be unstable and it may change its API  !!!

## Installation

```sh
npm install require-dir-all --save
```

## Usage

### Basic usage

```js
var modules = require('require-dir-all')('directory_to_require');
```

Afterwards variable ```modules``` will contain exported values from all the files in directory accessible as its properties, for 
example ```modules.module1```
    
You may provide additional options using second optional parameter:

```js
var modules = require('require-dir-all')(
  'directory_to_require', // directory
  { // options
    map: function( ) { /* you may postprocess the name of property the module will be stored and exported object */ }
    recursive: false, // recursively go through subdirectories; default: false
    excludeDir: /^(\.(git|svn)|(node_modules))$/ // default value - reg exp to exclude subdirectories
  }
);
```

Options:    
- ```map```: function to postprocess each ```require```'d file (see example below); default: ```null```
- ```recursive```  - recursively go through subdirectories; default: ```false```
- ```excludeDir``` - reg exp to exclude subdirectories, default: ```/^(\.(git|svn)|(node_modules))$/```

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

Example located in ```demo/simple/```
To run: ```cd demo/simple/```, then run ```npm install```, then ```node app```

### Recursive

Option ```recursive: true``` allows to require recursively the directory and all its subdirectories.

#### Example

You can find an example in ```demo/recursive/```

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

If each file ```module1.js```, ```module2.js``` in ```modules``` directory exports a constructor to which the some config parameters are passed like this:
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

Example located in ```demo/map/```
To run: ```cd demo/map/```, then run ```npm install```, then ```node app```
