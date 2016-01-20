/**
 * Created by alykoshin on 20.01.16.
 */

'use strict';

var gulp = require('gulp');


module.exports = function(config) {

  // Define test task
  gulp.task('task1', function () {
    console.log('task1 is running, config:', config);
  });

};
