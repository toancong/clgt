'use strict';


var fs = require('fs');
var format = require('util').format;


function File(path) {

  this.wstream = fs.createWriteStream(path);
}


File.prototype.format = function() {

  return format.apply(this, arguments);
};


File.prototype.writeln = function() {

  this.write('\n');
  return this;
};


File.prototype.write = function() {

  this.wstream.write(this.format.apply(this, arguments));
  return this;
};


File.prototype.end = function() {

  this.wstream.end();
};


module.exports = File;
