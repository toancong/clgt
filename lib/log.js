/* eslint no-process-env: "off" */
/* eslint no-console: "off" */
'use strict';


var colors = require('colors');
var themes = {
  info: 'blue',
  success: 'green',
  error: 'red',
  debug: 'cyan',
  warn: 'yellow'
};
colors.setTheme(themes);


function log() {

  var args = Array.prototype.slice.call(arguments);
  var type = 'info';

  if (args.length >= 2) {
    type = args[0];
    if (themes[type]) {
      args.splice(0, 1);
    } else {
      type = 'info';
    }
  }

  if (process.env.NODE_ENV !== 'test') {
    console.log(colors[type].apply(null, args));
  }
}


module.exports = log;
