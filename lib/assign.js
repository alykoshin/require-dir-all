/**
 * Created by alykoshin on 22.01.16.
 */

'use strict';

/**
 * Node 0.9-0.12 does not supports Object.assign()
 * Instead of modifying Object with polyfill we define private function object_assign()
 *
 * Source below is based upon
 * https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
 *
 * @param {object} target - target object, followed by list of source objects
 * @returns {object}
 */
var object_assign = function (target) {
  if (target === undefined || target === null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  var output = Object(target);
  for (var index = 1; index < arguments.length; index++) {
    var source = arguments[index];
    if (source !== undefined && source !== null) {
      for (var nextKey in source) {
        if (source.hasOwnProperty(nextKey)) {
          output[nextKey] = source[nextKey];
        }
      }
    }
  }
  return output;
};


module.exports = object_assign;
