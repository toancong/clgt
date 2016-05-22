'use strict';


var _ = require('lodash');


exports.groupByMulti = function(obj, values) {

  if (!values.length) {
    return obj;
  }
  var byFirst = _.groupBy(obj, values[0]),
    rest = values.slice(1);

  _.forOwn(byFirst, function(value, prop) {
    byFirst[prop] = exports.groupByMulti(byFirst[prop], rest);
  });
  return byFirst;
};


exports.capitalize = function(str) {

  return str.charAt(0).toUpperCase() + str.slice(1);
};
