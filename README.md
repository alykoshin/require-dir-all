require-dir-all
=================

Yet another Node.js helper to require all files in directory

Inspired by require-all and require-dir packages

## Installation

    npm install require-dir-all --save

## Usage

### Simple
Assume you have following structure:

    dir1/
        file1.js
        file2.js
    app.js
        
In app.js:

    var dir1 = require('dir1');
    console.log(dir1);

Example located in demo/simple/
To run: cd to dir, run ```npm install```, then ```node app```

### Map
Option property map allows to run function for each require'd file.

Assume you have following structure:

    datasources/
      redis
      sql

And there are different configs for each datasource:

    var config = {
      redis: require('../../config/redis'),
      sql: require('../../config/sql')
    };
    
    var ds = require('require-dir-all')(
      'datasources', 
      {
        map: function(req) { 
          req.exported = new req.exported( config[req.name] );
        }
      }
    );
    
