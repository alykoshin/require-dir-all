// See README.md for details.

'use strict';

var gulp = require('gulp');

// Load Gulp tasks (no need to store the result object as modules just calls gulp.task() and exports nothing)
//require('require-dir-all')('gulp-tasks', { recursive: true });
require('../../index.js')('gulp-tasks', { recursive: true }); // as this demo is the part of package itself, require index file of the package


// Define default test task
gulp.task('default', ['task1', 'task2']);

/*
Run:

$ gulp

Output:

$ gulp
[22:48:51] Using gulpfile <...>/demo/gulp1/gulpfile.js
[22:48:51] Starting 'task1'...
task1 is running
[22:48:51] Finished 'task1' after 108 μs
[22:48:51] Starting 'task2'...
task2 is running
[22:48:51] Finished 'task2' after 36 μs
[22:48:51] Starting 'default'...
[22:48:51] Finished 'default' after 3.51 μs

*/
