'use strict';

/* globals describe, before, after, it */

var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

var object_assign = require('../lib/assign');


describe('#object_assign()', function() {


  it('should object_assign() copy properties', function() {
    var obj1 = {
      prop1: 'prop1',
      prop2: 'prop2',
      prop3: {
        prop31: 'prop31'
      }
    };
    var obj2 = {
      prop2: 'prop2',
      prop4: {
        prop41: 'prop41'
      }
    };
    var obj3 = {}
    object_assign(obj3, obj1);
    expect(obj3).eql(obj1);

    object_assign(obj3, obj2);
    expect(obj3).contains(obj2);

  });

  it('should object_assign() throw if object null or undefined', function() {

    expect(function(){
      object_assign(null);
    }).throw(TypeError);

    expect(function(){
      object_assign(undefined);
    }).throw(TypeError);

  });


});
