require-dir-all
=================

Yet another Node.js helper to require all files in directory

Inspired by 
(require-all)[https://github.com/felixge/node-require-all] and 
(require-dir)[https://github.com/aseemk/requireDir] packages

# WARNING: THE PACKAGE IS IN ALPHA STATE

## Installation

    npm install require-dir-all --save

## Usage

### Simple
If you need to require all the ```.js```, ```.json```, ```.coffee``` files in the directory, add following line:

    var req = require('require-dir-all')('directory');
    
or if you like:
    
    var require_dir_all = require('require-dir-all');
    var directory = require_dir_all('directory');

Object ```req``` will be populated with properties which names will correspond to module names and values - to exported 
objects. 

#### Example 
 
Assume you have following structure:

    dir1/
        file1.js
        file2.js
    app.js

File file1.js exports:

    module.exports = 'file1 exports';

File file2.js exports:

    module.exports = 'file2 exports';

In app.js:

    var dir1 = require('dir1');
    console.log('dir1:', dir1);
    console.log('dir1.file1:', dir1.file1);
    console.log('dir1.file2:', dir1.file2);
    
Result:

    { file1: 'file1 exports', file2: 'file2 exports' }

Example located in ```demo/simple/```
To run: cd to dir, run ```npm install```, then ```node app```

### Map
Option map allows to define function for each require'd file to be able to process .

Assume you have following structure:

    datasources/
      redis
      sql

If each file in datasources directory exports a constructor to which the config is passed and the code in app.js is like 
following:

    var configRedis = require('../../config/redis'),
      configSql = require('../../config/sql');
      
    var redis = new require('datasources/redis')(configRedis),
      sql = new require('datasources/sql')(configSql);

You may replace this with following code:

    var config = {
      redis: require('../../config/redis'),
      sql: require('../../config/sql')
    };
    
    var ds = require('require-dir-all')(
      'datasources', 
      { // options
        map: function(req) { 
          // replace exported constructor function with newly constructed object
          // with appropriate config as a parameter to constructor
          req.exported = new req.exported( config[req.name] );
          // No need to change the property name
          // req.name = req.name;
        }
      }
    );
    
