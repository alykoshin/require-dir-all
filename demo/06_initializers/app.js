// See README.md for details.

'use strict';

var _ = require('lodash');
var async = require('async');
//var modules = require('require-dir-all')('modules');
var modules = require('../../index.js')('modules'); // as this demo is the part of package itself, require index file of the package

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
