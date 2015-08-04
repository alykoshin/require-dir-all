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

function isExcludedFile(reqModule, reIncludeFiles) {
  return (reqModule.filepath === parentFile) ||   // Exclude require'ing file
    (reIncludeFiles && !reqModule.filename.match(reIncludeFiles)); // Exclude files non-matched to patter includeFiles
}

function isExcludedDir(reqModule, reExcludeDirs) {
  return  reExcludeDirs && reqModule.filename.match(reExcludeDirs);
}

function _requireDirAll(absDir, options) {
  var modules = {};

  var files = fs.readdirSync(absDir);

  for (var length=files.length, i=0; i<length; ++i) {

    var reqModule = {};
    reqModule.filename = files[i];                                         // full filename without path
    reqModule.ext      = path.extname(reqModule.filename);                 // file extension
    reqModule.base     = path.basename(reqModule.filename, reqModule.ext); // filename without extension
    reqModule.filepath = path.join(absDir, reqModule.filename);            // full filename with absolute path

    //console.log('reqModule:', reqModule);

    // If this is subdirectory, then descend recursively into it (excluding matching patter excludeDirs)
    if (fs.statSync(reqModule.filepath).isDirectory() &&
      options.recursive &&
      ! isExcludedDir(reqModule, options.excludeDirs) ) {

      // use filename instead of base to keep complete directory name for directories with '.', like 'dir.1.2.3'
      reqModule.name = reqModule.filename;
      modules[reqModule.name] = _requireDirAll(reqModule.filepath, options);

    } else if ( ! isExcludedFile(reqModule, options.includeFiles)) {
      reqModule.name = reqModule.base;
      reqModule.exports = require(reqModule.filepath);
      if (options.map) {
        options.map(reqModule);
      }
      modules[reqModule.name] = reqModule.exports;
    }

  }

  return modules;
}

/**
 *
 * @param relOrAbsDir String || [] - Directory or array of directories to 'require'
 * @param options {{}}             - Set of options
 * @returns {{} || []}             - Returns object with require'd modules or array of such objects
 */
module.exports = function requireDirAll(relOrAbsDir, options) {

  relOrAbsDir = relOrAbsDir || '.';
  options = options || {};
  options.recursive    = options.recursive    || false;
  options.includeFiles = options.includeFiles || /^.*\.(js|json|coffee)$/;
  options.excludeDirs  = options.excludeDirs  || /^(\.git|\.svn|node_modules)$/;
  options.map          = options.map          || null;

  var absDir;
  if (typeof relOrAbsDir === 'string') {
    absDir = path.resolve(parentDir, relOrAbsDir);
    //console.log('relOrAbsDir:', relOrAbsDir, '; options:', options);
    return _requireDirAll(absDir, options);

  } else { // Assume it is array
    var modulesArray = [];
    for (var length=relOrAbsDir.length, i=0; i<length; ++i) {
      //console.log('relOrAbsDir:', relOrAbsDir, '; options:', options);
      absDir = path.resolve(parentDir, relOrAbsDir[i]);
      modulesArray.push(_requireDirAll(absDir, options));
    }
    return modulesArray;

  }
};
