// See README.md for details.

// Inspired by require-all and require-dir packages:
// https://github.com/felixge/node-require-all
// https://github.com/aseemk/requireDir

'use strict';

var fs = require('fs'),
  path = require('path');

var parentModule = module.parent;
var parentFile = parentModule.filename;
var parentDir = path.dirname(parentFile);

// Trick taken from https://github.com/aseemk/requireDir/blob/master/index.js
//
// make a note of the calling file's path, so that we can resolve relative
// paths. this only works if a fresh version of this module is run on every
// require(), so important: we clear the require() cache each time!
delete require.cache[__filename];
//
//////////////// ////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = function requireDirAll(relOrAbsDir, options) {

  relOrAbsDir = relOrAbsDir || '.';
  options = options || {};
  options.recursive    = options.recursive    || false;
  options.includeFiles = options.includeFiles || /^.*\.(js|json|coffee)$/;
  options.excludeDirs  = options.excludeDirs  || /^(\.git|\.svn|node_modules)$/;
  options.map          = options.map          || null;

  var modules = {};

  var absDir = path.resolve(parentDir, relOrAbsDir);
  var files = fs.readdirSync(absDir);

  for (var length=files.length, i=0; i<length; ++i) {

    var reqModule = {};
    reqModule.filename = files[i];
    reqModule.ext      = path.extname(reqModule.filename);
    reqModule.base     = path.basename(reqModule.filename, reqModule.ext);
    reqModule.filepath = path.join(absDir, reqModule.filename);

    // Exclude require'ing file
    if (path === parentFile) {
      continue;
    }

    // Is it directory?
    if (fs.statSync(reqModule.filepath).isDirectory()) {
      // Go recursively into subdirectory excluding matching patter excludeDirs
      if (options.recursive) {
        if ( !options.excludeDirs || !reqModule.filename.match(options.excludeDirs) ) {
          // use filename instead of base to keep full directory name for directories with '.', like 'dir.1.2.3'
          reqModule.name = reqModule.filename;
          modules[reqModule.name] = requireDirAll(reqModule.filepath, options);
        }
      }
    } else {

      // Exclude files non-matched to patter includeFiles
      if (options.includeFiles && !reqModule.filename.match(options.includeFiles)) {
        continue;
      }

      reqModule.name = reqModule.base;
      reqModule.exports = require(reqModule.filepath);
      if (options.map) { options.map(reqModule); }

      modules[reqModule.name] = reqModule.exports;
    }

  }

  return modules;

};
