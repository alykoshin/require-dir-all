/**
 * Created by alykoshin on 21.01.16.
 */

'use strict';

var gulp = require('gulp');


module.exports = function(config) {

  // Define default test task
  gulp.task('default', [ 'task1', 'task21', 'task22' ], function() {
    console.log('default task is running, config:', config);
  });

};
