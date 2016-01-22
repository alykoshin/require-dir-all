'use strict';

//console.log('array_dir');


var dirs = ['dir1', 'dir2'];

var modules = require('../../index')(dirs);

module.exports = modules;


//console.log('modules = ' + JSON.stringify(module.exports, null, 2) + '\n');
