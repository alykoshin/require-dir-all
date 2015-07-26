'use strict';

/* globals describe, before, it */

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

describe('#recursive demo test', function() {

  var modules, module1, module2, module3, module4;

  before('before', function() {
    modules = require_dir_all('../demo/recursive/modules', { recursive: true } );

    module1 = require('../demo/recursive/modules/module1');
    module2 = require('../demo/recursive/modules/module2');
    module3 = require('../demo/recursive/modules/dir1/module3');
    module4 = require('../demo/recursive/modules/dir1/dir2/module4');
  });

  console.log('modules:', modules);

  it(' should have all properties corresponding to each module and directory inside top-level require-d directory', function() {
    modules.should.have.all.keys('module1', 'module2', 'dir1');
  });

  it('should have all properties corresponding to each module and directory inside 2nd-level require-d directory', function() {
    modules.dir1.should.have.all.keys('module3', 'dir2');
  });

  it('should have all properties corresponding to each module and directory inside 3rdp-level require-d directory', function() {
    modules.dir1.dir2.should.have.all.keys('module4');
  });

  it('should have same value for module1 as regular require()', function() {
    modules.should.have.property('module1', module1);
  });

  it('should have same value for module2 as regular require()', function() {
    modules.should.have.property('module2', module2);
  });

  it('should have same value for dir1.module3 as regular require()', function() {
    modules.should.have.deep.property('dir1.module3', module3);
  });

  it('should have same value for dir1.dir2.module4 as regular require()', function() {
    modules.should.have.deep.property('dir1.dir2.module4', module4);
  });

});
