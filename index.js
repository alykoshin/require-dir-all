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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Require Module definition (passed to map function)
 *
 * @typedef {object} RequireModule
 * @property {string} filename     - filename with extension, without path
 * @property {string} ext          - file extension
 * @property {string} base         - filename without extension
 * @property {string} filepath     - full file path
 * @property {string} name         - module name
 * @property {{}} exports          - module's exports
 */

/**
 * Map function
 *
 * @callback RequireMap
 * @param {RequireModule} requireModule
 */

/**
 * Options for require-dir-all
 *
 * @typedef {object} RequireOptions
 * @property {boolean} recursive    - go recursively into subdirectories
 * @property {RegExp} excludeDirs   - RegExp to exclude directories
 * @property {RegExp} includeFiles  - RegExp to include files
 * @property {RequireMap} map       - map function to be called for each required module
 */

/**
 * Check if the module to be excluded
 *
 * @param {RequireModule} reqModule
 * @param {RegExp} reIncludeFiles
 * @returns {boolean}
 */
function isExcludedFile(reqModule, reIncludeFiles) {
  return !! ( (reqModule.filepath === parentFile) ||   // Exclude require'ing file
    (reIncludeFiles && !reqModule.filename.match(reIncludeFiles)) ); // Exclude files non-matched to pattern includeFiles
}

/**
 * Check if the directory to be excluded
 *
 * @param {RequireModule} reqModule
 * @param {RegExp} reExcludeDirs
 * @returns {boolean}
 */
function isExcludedDir(reqModule, reExcludeDirs) {
  return  !! ( reExcludeDirs && reqModule.filename.match(reExcludeDirs) );
}

/**
 * Main function. Recursively go through directories and require modules according to options
 *
 * @param   {string}  absDir
 * @param   {RequireOptions} options
 * @returns {object}
 * @private
 */
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

      // use filename (with extension) instead of base name (without extension)
      // to keep complete directory name for directories with '.', like 'dir.1.2.3'
      reqModule.name = reqModule.filename;

      // go recursively into subdirectory
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
 * Main entry point. Analyse input parameters and invoke main function _requireDirAll()
 *
 * @param { string||string[] } [relOrAbsDir]  - Directory or array of directories to 'require'
 * @param {RequireOptions} [options]                        - Set of options
 * @returns {object || object[]}                        - Returns object with require'd modules or array of such objects
 * @public
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
