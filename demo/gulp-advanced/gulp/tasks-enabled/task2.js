/**
 * Created by alykoshin on 20.01.16.
 */

'use strict';

var gulp = require('gulp');


module.exports = function(config) {

  // Define test task
  gulp.task('task21', function () {
    console.log('task21 is running, config:', config);
  });

  // Define test task
  gulp.task('task22', function () {
    console.log('task22 is running, config:', config);
  });

};
