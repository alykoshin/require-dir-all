var path = require('path'),
  fileExt = path.extname(module.filename),
  fileBase  = path.basename(module.filename, fileExt);

module.exports = {
  initialize: function(cb) {
    console.log('module ' + fileBase + ' initialized');
    return cb(false, 'result from '+fileBase+'');
  }
};
