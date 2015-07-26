// See README.md for details.

// Inspired by require-all and require-dir packages:
// https://github.com/felixge/node-require-all
// https://github.com/aseemk/requireDir

'use strict';

var fs = require('fs'),
  path = require('path');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Trick taken from https://github.com/aseemk/requireDir/blob/master/index.js
//
// make a note of the calling file's path, so that we can resolve relative
// paths. this only works if a fresh version of this module is run on every
// require(), so important: we clear the require() cache each time!
//
var parentModule = module.parent;
var parentFile = parentModule.filename;
var parentDir = path.dirname(parentFile);
delete require.cache[__filename];
//
//////////////// ////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = function requireDirAll(relOrAbsDir, options) {

  relOrAbsDir = relOrAbsDir || '.';
  options = options || {};
  options.recursive   = options.recursive || false;
  options.excludeDirs = options.excludeDirs || /^(\.git|\.svn|node_modules)$/;
  options.map         = options.map || null;

  var modules = {};

  var absDir = path.resolve(parentDir, relOrAbsDir);
  var files = fs.readdirSync(absDir);

  for (var length=files.length, i=0; i<length; ++i) {

    var reqModule = {};
    reqModule.filename = files[i];
    reqModule.filepath = path.join(absDir, reqModule.filename);
    reqModule.ext      = path.extname(reqModule.filename);
    reqModule.base     = path.basename(reqModule.filename, reqModule.ext);

    // Exclude require'ing file
    if (path === parentFile) {
      continue;
    }

    if (fs.statSync(reqModule.filepath).isDirectory()) {
      if (options.recursive) {
        if ( !options.excludeDirs || !reqModule.filename.match(options.excludeDirs) ) {
          // use filename instead of base to keep full directory name for directories with '.', like 'dir.1.2.3'
          reqModule.name = reqModule.filename;
          modules[reqModule.name] = requireDirAll(reqModule.filepath, options);
        }
      }
    } else {
      reqModule.name = reqModule.base;
      reqModule.exports = require(reqModule.filepath);
      if (options.map) { options.map(reqModule); }
      //modules[req.name] = req.exported ? req.exported(require(filepath)) : require(filepath);
      modules[reqModule.name] = reqModule.exports;
    }

  }

  return modules;

};
