'use strict';

console.log('array_dir');


var dirs = ['dir1', 'dir2'];

var modules = require('../../index')(dirs);

console.log('modules = ' + JSON.stringify(modules, null, 2) + '\n');
