'use strict';

/* globals describe, before, after, it */

var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

var require_dir_all = require('../index');


console.log(
  '* process.version: ' + process.version + '\n' +
  '* __dirname: '+ __dirname + '\n' +
  '* process.cwd(): ' + process.cwd()
);


describe('#simple demo test', function() {

  var root, modules, module1, module2;

  before('before', function() {
    root = '../demo/01_simple/modules/';

    modules = require_dir_all(root);

    module1 = require(root+'module1');
    module2 = require(root+'module2');
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


describe('#same_dir test', function() {

  var root, modules, module1, module2;

  before('before', function() {
    // This test can't use files from demos as we need to require 'require-dir-all' from the same dir
    // while not using the package (as done in demo/*)
    root = '../test_data/02_same_dir/';

    modules = require(root);

    module1 = require(root+'module1');
    module2 = require(root+'module2');
  });

  after(function disableMockery() {
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

  it('should not have property for require\'ing module', function() {
    modules.should.not.have.any.keys('app');
  });

});


describe('#array_dir test', function() {

  var root, modules, module1, module2;

  before('before', function() {
    root = '../test_data/03_array_dir/';

    modules = require(root);

    module1 = require(root+'dir1/module1');
    module2 = require(root+'dir2/module2');
  });

  it('should return array corresponding to number of directories', function() {
    modules.should.be.instanceof(Array);
    modules.should.have.length(2);
  });

  it('should have same value for module1 as regular require()', function() {
    modules[0].should.have.property('module1', module1);
  });

  it('should have same value for module2 as regular require()', function() {
    modules[1].should.have.property('module2', module2);
  });

});


describe('#recursive demo test', function() {

  var root, modules, module1, module2, module3, module4, module5;

  before('before', function() {
    root = '../demo/04_recursive/modules/';

    modules = require_dir_all(
      root, {
        recursive: true,
        excludeDirs: /^excluded.*$/
      } );

    module1 = require(root+'module1');
    module2 = require(root+'module2');
    module3 = require(root+'dir1/module3');
    module4 = require(root+'dir1/dir2/module4');
    module5 = require(root+'dir.a.b.c/module5');

    //console.log('modules:', JSON.stringify(modules, null, 2));
  });

  it(' should have all properties corresponding to each module and directory inside top-level require-d directory', function() {
    modules.should.have.all.keys('module1', 'module2', 'dir1', 'dir.a.b.c');
  });

  it('should have all properties corresponding to each module and directory inside 2nd-level require-d directory', function() {
    modules.dir1.should.have.all.keys('module3', 'dir2');
  });

  it('should have all properties corresponding to each module and directory inside 3rdp-level require-d directory', function() {
    modules.dir1.dir2.should.have.all.keys('module4');
  });

  it('should not have properties corresponding to excluded directories inside top-level require-d directory', function() {
    modules.should.not.have.any.keys('excluded');
  });

  it('should have same value for module1 as regular require()', function() {
    modules.module1.should.eql(module1);
  });

  it('should have same value for module2 as regular require()', function() {
    modules.module2.should.eql(module2);
  });

  it('should have same value for dir1.module3 as regular require()', function() {
    modules.dir1.module3.should.eql(module3);
  });

  it('should have same value for dir1.dir2.module4 as regular require()', function() {
    modules.dir1.dir2.module4.should.eql(module4);
  });

  it('should handle directory name with dots (dir.a.b.c)', function() {
    modules['dir.a.b.c'].module5.should.eql(module5);
  });

});


describe('#map demo test', function() {

  var root, modules, /*module1, module2,*/ obj1, obj2;

  before('before', function() {
    root = '../demo/05_map/modules/';

    var data = {
      module1: 'data for module1',
      module2: 'data for module2'
    };

    modules = require_dir_all(
      root, {
        map: function(reqModule) {
          //reqModule.exports = new reqModule.exports(data[reqModule.name]);
          reqModule.exports = new reqModule.exports(data[reqModule.name]);
          reqModule.name = '_' + reqModule.name;
        }
      }
    );

    console.log('modules = ' + JSON.stringify(modules, null, 2));

    obj1 = new (require(root+'module1'))(data.module1);
    obj2 = new (require(root+'module2'))(data.module2);
  });

  it('should have all properties corresponding to each module inside require\'d directory ' +
    'according to name mapping', function() {
    modules.should.have.all.keys('_module1', '_module2');
  });

  it('should have same value for module1 as regular require()', function() {
    modules._module1.should.eql(obj1);
  });

  it('should have same value for module2 as regular require()', function() {
    modules._module2.should.eql(obj2);
  });

});


describe('#indexAsParent test', function() {

  var root, modules;

  before('before', function() {
    root = '../test_data/07_indexAsParent/';

    modules = require_dir_all(
      root, {
        recursive: true,
        indexAsParent: true
      } );

    console.log('indexAsParent:', JSON.stringify(modules, null, 2));

  });

  it('should have same values as regular require()-s', function() {
    var index0 = require(root+'index');
    var index1 = require(root+'dir1/index');
    var index2 = require(root+'dir2/index');
    var index3 = require(root+'dir3/index');
    var index4 = require(root+'dir4/index');
    var index5 = require(root+'dir5/index');
    var index51 = require(root+'dir5/dir51/index');

    modules.should.contain(index0);
    modules.dir1.should.eql(index1);
    modules.dir2.should.eql(index2);
    modules.dir3.should.eql(index3);
    modules.dir4.should.contain(index4);
    modules.dir4.dir41.should.eql({});
    modules.dir5.should.contain(index5);
    modules.dir5.dir51.should.eql(index51);
  });

});


describe('#throwNoDir test', function() {

  var root = 'no-such-directory-exists';
  var modules;


  it('should throw if throwNoDir is default or true', function() {

    expect(function() {
      modules = require_dir_all(root, {} );
    }).throw();

    expect(function() {
      modules = require_dir_all(root, { throwNoDir: true } );
    }).throw();

  });


  it('should not throw if throwNoDir is false and return empty object', function() {

    expect(function() {
      modules = require_dir_all(root, { throwNoDir: false } );
    }).not.throw();

    expect(modules).deep.equal({});
  });


});


describe('#merge test', function() {

  var root, modules;

  before('before', function() {
    root = '../test_data/08_merge/';

    modules = require_dir_all(
      root, {
        recursive: true,
        indexAsParent: true
      } );

    console.log('merge:', JSON.stringify(modules, null, 2));

  });

  it('should merge .js and .json', function() {
    var js   = require(root+'01_merge_js_json/index.js');
    var json = require(root+'01_merge_js_json/index.json');
    modules['01_merge_js_json'].should.contain.keys(js);
    modules['01_merge_js_json'].prop_js.should.be.eql(js.prop_js);
    modules['01_merge_js_json'].should.contain(json);
  });

  it('should merge dir and file', function() {
    var index0 = require(root+'02_merge_dir_file/test/index');
    var index1 = require(root+'02_merge_dir_file/test');
    modules['02_merge_dir_file'].test.should.contain.keys(index0);
    modules['02_merge_dir_file'].test.prop_test_index.should.be.eql(index0.prop_test_index);
    modules['02_merge_dir_file'].test.should.contain(index1);
  });

  it('should index file returning scalar hide all other content', function() {
    var index0 = require(root+'03_index_hides_dir/index');
    modules['03_index_hides_dir'].should.equal(index0);  // subdirectory content is ignored
  });

  it('should file returning scalar hide content from directory with same name', function() {
    var dir1 = require(root+'04_file_hides_dir/dir1.js');
    modules['04_file_hides_dir'].dir1.should.equal(dir1);  // subdirectory content is ignored
  });

  it('should json hide js returning scalar with same name', function() {
    //var index0 = require(root+'05_json_hides_js/index.js');   // returns scalar (string)
    var index1 = require(root+'05_json_hides_js/index.json'); // returns object which overwrites index0
    modules['05_json_hides_js'].should.equal(index1);  // js content is ignored
  });


});

