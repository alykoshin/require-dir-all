require-dir-all
=================

Yet another Node.js helper to require all files in directory

[Link to package page in npm repository](https://www.npmjs.com/package/require-dir-all)

Inspired by [require-all](https://github.com/felixge/node-require-all) and 
[require-dir](https://github.com/aseemk/requireDir) packages.

!! WARNING: the package is in alpha state, it may be unstable and change its API  !!!

## Installation

```sh
npm install require-dir-all --save
```

## Usage

### Basic usage

```js
var modules = require('require-dir-all')('directory_to_require');
```

Afterwards variable ```modules``` will contain exports from all the files in directory accessible as its properties, for 
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
- ```map```: function to postprocess each require-d file (see example below); default: ```null```
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
module.exports = 'module1.exports';
```

File ```module2.js``` exports:

```
module.exports = 'module2.exports';
```

In ```app.js```:

```js
var modules = require('require-dir-all')('modules');

console.log('modules:', modules);
console.log('modules.module1:', modules.module1);
console.log('modules.module2:', modules.module2);
```
    
Result:

```
modules: { module1: 'module1.exports', module2: 'module2.exports' }
modules.module1: module1.exports
modules.module2: module2.exports
```

Example located in ```demo/simple/```
To run: ```cd demo/simple/```, then run ```npm install```, then ```node app```

### Map

Option ```map``` allows to define function to run for each require'd file.

Assume you have following structure:

```
modules/
  module1
  module2
```

If each file in modules directory exports a constructor to which the some config parameters are passed and the code 
in ```app.js``` is like following:

```js
var config1 = { value: 'config1' },
  config2 = 'config2';
  
var module1 = new require('modules/module1')(config1),
  module2 = new require('module/module2')(config2);
```

You may replace this with following code:

```js
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
```
    
Result:

```
modules: { module1: { name: 'Object1', config: { value: 'config1' } }, module2: { name: 'Object2', config: 'config2' } }
module: module1 ; imported: { name: 'Object1', config: { value: 'config1' } }
module: module2 ; imported: { name: 'Object2', config: 'config2' }
```

Example located in ```demo/map/```
To run: ```cd demo/map/```, then run ```npm install```, then ```node app```
