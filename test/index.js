var
  should = require('chai').should(),
  //should = require('should'),
  require_dir_all = require('../index');

describe('#simple demo test', function() {

  var modules, module1, module2;

  before('before', function() {
    modules = require_dir_all('../demo/simple/modules');

    module1 = require('../demo/simple/modules/module1');
    module2 = require('../demo/simple/modules/module2');
  });

  it('should have all properties corresponding to each module inside require-d directory', function() {
    modules.should.have.all.keys('module1', 'module2');
  });

  it('should have same value for module1 as regular require()', function() {
    modules.should.have.property('module1', module1);
  });

  it('should have same value for module2 as regular require()', function() {
    modules.should.have.property('module2', module2);
  });

});
