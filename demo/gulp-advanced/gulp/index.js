/**
 * Created by alykoshin on 20.01.16.
 */

'use strict';

var gulp = require('gulp');


// Read config
var config = require('./config');


// Load Gulp tasks (option recursive:true is just for example - there is no subdirectories in this demo)

//require('require-dir-all')('tasks-enabled', { recursive: true });
require('../../../index.js')('tasks-enabled', { // as this demo is the part of package itself, require index file of the package
  recursive: true,
  // define function to be post-processed over exported object for each require'd module
  map: function(reqModule) {
    reqModule.exports = // we may omit this assignment as there is nothing to return
      // call exported function to init Gulp task passing the config as parameter
      reqModule.exports( config );
      // We may also pass not the whole config, but only the part appropriate for the task (if config object has property for each task) like following:
      //new reqModule.exports( config[reqModule.name] );
  }

});


