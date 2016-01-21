/**
 * Created by alykoshin on 20.01.16.
 */

'use strict';

var gulp = require('gulp');


module.exports = function(config) {

  // Define test task
  gulp.task('task3', function () {
    console.log('task3 is running, config:', config);
  });

};
