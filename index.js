// See README.md for details.

'use strict';

var fs = require('fs'),
  path = require('path');

module.exports = function requireDirAll(dir, opts) {

  dir = dir || '.';
  opts = opts || {
      recurse: false,
      excludeDirs: /^\.(git|svn)$/
    };

  var modules = {};
  var files = fs.readdirSync(dir);

  files.forEach(function (filename) {

    var filepath = path.join(dir, filename),
      ext = path.extname(filename),
      base = path.basename(filename, ext);

    if (fs.statSync(filepath).isDirectory()) {
      if (opts.recurse) {
        if ( !opts.excludeDirs && !filepath.match(opts.excludeDirs)) {
          modules[base] = requireDirAll(filepath, opts);
        }
      }
    } else {
      modules[base] = require(filepath);
    }

  });

  return modules;

};
