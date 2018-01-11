[![npm version](https://badge.fury.io/js/require-dir-all.svg)](https://badge.fury.io/js/require-dir-all)
[![Build Status](https://travis-ci.org/alykoshin/require-dir-all.svg)](https://travis-ci.org/alykoshin/require-dir-all)
[![Coverage Status](https://coveralls.io/repos/alykoshin/require-dir-all/badge.svg?branch=master&service=github)](https://coveralls.io/github/alykoshin/require-dir-all?branch=master)
[![Code Climate](https://codeclimate.com/github/alykoshin/require-dir-all/badges/gpa.svg)](https://codeclimate.com/github/alykoshin/require-dir-all)
[![Inch CI](https://inch-ci.org/github/alykoshin/require-dir-all.svg?branch=master)](https://inch-ci.org/github/alykoshin/require-dir-all)

[![Dependency Status](https://david-dm.org/alykoshin/require-dir-all/status.svg)](https://david-dm.org/alykoshin/require-dir-all#info=dependencies)
[![devDependency Status](https://david-dm.org/alykoshin/require-dir-all/dev-status.svg)](https://david-dm.org/alykoshin/require-dir-all#info=devDependencies)

[![Known Vulnerabilities](https://snyk.io/test/github/alykoshin/require-dir-all/badge.svg)](https://snyk.io/test/github/alykoshin/require-dir-all)


# require-dir-all

Yet another Node.js helper to `require` all files in directory. Useful when needed to `require` group of files in same directory(-ies) with similar functionality, like routes, controllers, middlewares, models, config, gulp tasks etc. 

Inspired by [require-all](https://www.npmjs.com/package/require-all) and [require-dir](https://www.npmjs.com/package/require-dir) packages. Both of them are good, but the first of them lacks relative paths support (need to use `__dirname`) ~~and always recursive~~, while the second one lacks file/dir filtering, ~~for some reason store modules in non-hierarchical structure, taking only one file from several ones with the same name~~ and it is not possible to automatically run function on each require'd file.


If you have different needs regarding the functionality, please add a [feature request](https://github.com/alykoshin/require-dir-all/issues).


# Installation

```sh
npm install --save require-dir-all
```


# Usage

## Upgrade 0.2.x to 0.3

For the files and directories with the same name behavior is changed from overwrite to merge. That means if you have in the same directory file and subdirectory with any content, this content wll be merged with the content of the file. If the file contains object, then keys of object will be merged. 
However, if the file returns non-object, for example string, it will completely hide the content of the directory with same name.
If you set `indexAsParent: true`, index file returning non-object will hide all subdirectories.

## Use cases

There are several most common cases to use this module. In all of them some part of the application is splitted into several smaller modules with the same initialization logic and similar functionality. Modules may be grouped into subdirectories. Typical examples are
- Routes (controllers, middlewares) for `express` application, models and datasources;
- Gulp tasks. If you want to see an examples how to use `require-dir-all` in Gulp files, you may look to `gulp-simple` and `gulp-advanced` in `demo` subdirectory of the module.
- Config files. If your need is to structure one huge config file into several smaller config files, while keeping your code clean, you may go directly to separate article [config files how-to](https://github.com/alykoshin/require-dir-all/wiki/Config-files-how-to) illustrating the idea.
- etc


## Basic usage

```js
var modules = require('require-dir-all')('directory_to_require');
```

Now variable `modules` will contain exported values 
from all the modules `.js`, `.json`, `.coffee` in directory 
accessible by its properties, for example `modules.module1` as if they were require'd like:

```js
modules = {
  module1: require('module1')
  module2: require('module2')
}
```

If you need more than one directory to `require`, you can provide array of directories:

```js
var modules = require('require-dir-all')(['dir1', 'dir2']);
```

Resulting variable `modules` will be array of objects with module's exports, equivalent to:

```js
modules = [
  { module1: require('dir1/module1') },
  { module2: require('dir2/module2') }
]
```


# Parameters

```js
var modules = require('require-dir-all')(
  'directory_to_require', // relative or absolute directory 
  { // options
    recursive:     false,                          // recursively go through subdirectories; default value shown
    indexAsParent: false,                          // add content of index.js/index.json files to parent object, not to parent.index
    includeFiles:  /^.*\.(js|json|coffee)$/,       // RegExp to select files; default value shown
    excludeDirs:   /^(\.git|\.svn|node_modules)$/  // RegExp to ignore subdirectories; default value shown
    map: function(reqModule) { /* you may postprocess the name of property the module will be stored and exported object */ return reqModule; }
   }
);
```

## relOrAbsDir

Relative or absolute directory to start from.
If array is provided, the result will be array of objects corresponding to each directory.


## Options

You may provide additional options using second optional parameter:

Options:    
- `recursive`  - recursively go through subdirectories; optional; default: `false`
- `indexAsParent` - exports of 'index' files will be added directly to object corresponding to directory with this 'index' file, not to its child object named 'index' (as by default); optional; default: `false`
- `throwNoDir` - throw exception if require'ing directory does not exists; optional; default: `true`
- `includeFiles` - reg exp to include files; optional;
  default: `/^.*\.(js|json|coffee)$/`, 
  which means to `require` only `.js`, `.json`, `.coffee` files
- `excludeDirs` - reg exp to exclude subdirectories (when `recursive: true` ); optional; 
  default: `/^(\.(git|svn)|(node_modules))$/`,  which means to exclude directories `.git`, `.svn`, `node_modules` while going recursively 
- `_parentsToSkip`: number of parent modules to skip in order to find calling module; optional; default: 0 (i.e.consider parent as calling)
- `map`: function to postprocess each `require`'d file (for more details see [map option descripion](#map) below); optional; default: `null`


# Tips

Typical task is to run the function for each module required from the directory (like init or shutdown routines).
With this module it is needed to reqursively go through all the properties (i.e.module's exports) 
and run the function for each of them

If you need to wait until the end of initialization of all the modules, using `async` 
(assuming each module's initialize method accepts callback as a parameter).

Please, be aware, that the examples below iterates only files at top level (as there is no recursion)

Require'd files `modules/module1.js` and  `modules/module2.js`

```js
var path = require('path'),
  fileExt = path.extname(module.filename),
  fileBase  = path.basename(module.filename, fileExt);

module.exports = {
  initialize: function(cb) {
    console.log('module ' + fileBase + ' initialized');
    return cb(false, 'result from '+fileBase);
  }
};
```

Require'ing file `index.js`:

```js
var _ = require('lodash');
var async = require('async');
var modules = require('require-dir-all')('modules');

var initialize = function(callback) {
  var initializers = [];

  _.forOwn(modules, function(module) {
    initializers.push( function(cb) { return module.initialize(cb); } );
  });

  async.parallel(initializers, callback);
};

initialize(function(err, results) {
  console.log('initialize done; results:', results);
});

/*
Output:

module module1 initialized
module module2 initialized
initialize done; results: [ 'result from module1', 'result from module2' ]
*/

```

If you do not need to wait till the finish of initialization of both modules:

```js
var _ = require('lodash');
var modules = require('require-dir-all')('modules');

module.exports.initialize = function() {
  _.forOwn(modules, function(module) {
      module.initialize(); ;
  });
};
```

See `demo/06_initializers` for an example



## Simple 

If you need to require all the `.js`, `.json`, `.coffee` files in the directory `modules`, add following line:

```js
var modules = require('require-dir-all')('modules');
```
    
or if you like:
    
```js
var require_dir_all = require('require-dir-all');
var modules = require_dir_all('modules');
```

Object `modules` will be populated with properties which names will correspond to module names and values - to exported 
objects. 
Traditional equivalent:

```js
modules = {
  module1: require('module1')
  module2: require('module2')
}
```
                      
By default directories `.git`, `.svn`, `node_modules` are excluded.


### Example 
 
Assume you have following structure:

```
modules/
    module1.js
    module2.js
app.js
```

File `module1.js` exports:

```
module.exports = 'string exported from module 1';
```

File `module2.js` exports:

```
module.exports = 'string exported from module 2';
```

In `app.js`:

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

You can find this example in `demo/01_simple/`
To run it: 

```js
cd demo/01_simple/
npm install
node app
```


## Recursive

Option `recursive: true` allows to require recursively the directory and all its subdirectories.


### Example

You can find this example in `demo/04_recursive/`

Directory structure:

```sh
$ ls -R demo/04_recursive/modules/
demo/04_recursive/modules/:
dir1  dir.a.b.c  excluded  excluded.2  module1.js  module2.js

demo/04_recursive/modules/dir1:
dir2  module3.js

demo/04_recursive/modules/dir1/dir2:
module4.js

demo/04_recursive/modules/dir.a.b.c:
module5.js

demo/04_recursive/modules/excluded:
excluded.js

demo/04_recursive/modules/excluded.2:
excluded.js
```

File `app.js`:

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


## Map

Option `map` allows to define function to run for each `require`'d file.

Object properties.

These properties may be changed:
- `name` - module name to be stored in result object 
- `exports` - module's exports value 

These properties are read-only:
- `filepath` - full filename with absolute path,
- `base` - base part of file name,
- `ext` - file extension


Assume you have following structure:

```
modules/
  module1
  module2
```

If each file `module1.js`, `module2.js` in `modules` directory exports a constructor to which the some config parameters are passed like this:
 
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

and the code which `require`'s these files in `app_old.js` is like following:

```js
// configs for each module
var config1 = { value: 'config1' },
  config2 = 'config2';

// require all the needed files
var module1 = new (require('./modules/module1'))(config1),
  module2 = new (require('./modules/module2'))(config2);

console.log('object from module1:', module1);
console.log('object from module2:', module2);
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
      // define function to be post-processed over exported object for each require'd module
      reqModule.exports =
        // create new object with corresponding config passed to constructor
         new reqModule.exports( config[reqModule.name] );
      // Also you may change the property name if needed
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

You can find this example in ```demo/05_map/```
To run it: 

```sh
cd demo/05_map/
npm install
node app
```


# Run all demos:

```
cd demo
./all_demos.sh
```


# Run tests (and other checks):

```
npm test
```

## Run tests only:

```
npm _test
```



# TODO

- Add support for glob-like definitions?

```js
// from http://stackoverflow.com/a/28976201/2774010
var glob = require( 'glob' )
  , path = require( 'path' );

glob.sync( './routes/**/*.js' ).forEach( function( file ) {
  require( path.resolve( file ) );
});
```

- Restructure README.md to make it more readable.


# Credits
[Alexander](https://github.com/alykoshin/)


# Links to package pages:

[github.com](https://github.com/alykoshin/require-dir-all) &nbsp; [npmjs.com](https://www.npmjs.com/package/require-dir-all) &nbsp; [travis-ci.org](https://travis-ci.org/alykoshin/require-dir-all) &nbsp; [coveralls.io](https://coveralls.io/github/alykoshin/require-dir-all) &nbsp; [inch-ci.org](https://inch-ci.org/github/alykoshin/require-dir-all)


# License

MIT
