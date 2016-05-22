'use strict';


var _ = require('lodash');
var child = require('child_process');
var format = require('util').format;


exports.commands = {
  listLogs: 'git log --no-merges --date=short --format="%s|-|%h|-|%cd" ',
  listTags: 'git tag --sort=-taggerdate '
};


/**
 * Get tags of repository
 *
 * @param {function} callback callback
 * @return {function} callback
 */
exports.getTags = function(callback) {

  child.exec(this.commands.listTags, function(err, stdout, stderr) {

    return callback(err || stderr, stdout ? _.compact(stdout.split('\n')) : []);
  });
};


/**
 * Get logs of repository
 *
 * @param {function} callback callback
 * @return {function} callback
 */
exports.getLogs = function() {

  var args = arguments;
  var since = '';
  var callback = args[args.length - 1];

  if (args.length > 1) {
    since = args[0];
  }

  child.exec(this.commands.listLogs + since, function(err, stdout, stderr) {

    return callback(err || stderr, stdout ? _.compact(stdout.split('\n')) : []);
  });
};


/**
 * Get latest commit date
 *
 * @param {array} logs logs
 * @param {object} options options
 * @returns {string} date
 */
exports.getLatestCommitDate = function(logs, options) {

  var types = logs[Object.keys(logs)[0]];
  if (!types) {
    return '';
  }
  var scopes = types[Object.keys(types)[0]];
  var commits = scopes[Object.keys(scopes)[0]];
  if (options && options.tag) {
    return format('%s (%s)', options.tag, commits[0].date);
  }
  return format('(%s)', commits[0].date);
};
