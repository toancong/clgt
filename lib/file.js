'use strict';


var fs = require('fs');
var format = require('util').format;


function File(path) {

  this.path = path;
  fs.writeFileSync(path, '');
}


File.prototype.format = function() {

  return format.apply(this, arguments);
};


File.prototype.writeln = function() {

  this.write('\n');
  return this;
};


File.prototype.write = function() {

  fs.appendFileSync(this.path, this.format.apply(this, arguments));
  return this;
};


File.prototype.end = function() {

  // do nothing, this just for compatibility api
};


module.exports = File;
