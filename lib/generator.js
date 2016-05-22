'use strict';


var _ = require('lodash');
var sync = require('async');
var config = require('./config');
var File = require('./file');
var git = require('./git');
var log = require('./log');
var util = require('./util');


var internals = {};


/**
 * Parse array logs to new format
 *
 * @param {array} patterns patterns
 * @param {array} logs logs
 * @returns {array} new formated logs
 */
internals.parse = function(patterns, logs) {

  var pattern = '(' + patterns.join('|') + ')';

  var group = _.map(logs, function(item) {

    var data = item.replace(new RegExp(pattern + '(.+)', 'i'), '$1|-|$2').split('|-|');
    if (data.length === 3) {
      data = _.concat([ 'other', false ], data);
    }
    if (data.length === 4) {
      data = _.concat([ data[0] ], data);
      var type = data[2].replace(new RegExp('^\((.*)\):'), '$1|-|').split('|-|');
      if (type.length === 2) {
        data[1] = type[0];
        data[2] = type[1];
        data[1] = data[1].replace(new RegExp('[\(\)]', 'g'), '');
      } else {
        data[2] = data[0] + data[2];
        data[0] = 'other';
        data[1] = false;
      }
    }

    return _.zipObject([ 'type', 'scop', 'subj', 'hash', 'date' ], _.map(data, _.trim));
  });

  group = util.groupByMulti(group, [ 'type', 'scop', 'subj' ]);
  return group;
};


internals.findType = function(source, key) {

  var indexKey = _.findIndex(source, function(item) {

    return item.pattern.match(key);
  });
  return source[indexKey] ? source[indexKey].title : key;
};


internals.writeAType = function(file, options, types, type) {

  file.write('## %s ##', util.capitalize(internals.findType(options.types, type))).writeln().writeln(); // type

  var scopes = types[type];
  _.forOwn(scopes, function(issues, scope) {

    var indent = '';
    if (scope !== 'false') {
      file.write('- **%s:**', scope).writeln(); // scope
      indent = '    ';
    }

    _.forOwn(issues, function(commits, issue) {

      file.write('%s- %s', indent, issue).writeln(); // issue subject
      commits = commits.map(function(item) {

        return file.format('[%s](%s)', item.hash, options.url + '/' + item.hash); // hashes
      }).join(', ');
      file.write(' (%s)', commits).writeln();
    });
  });

  file.writeln().writeln();
};

internals.writeHeader = function(file, options) {

  if (options.name) {
    file.write('__%s__', options.name).writeln().writeln();
  }

  if (options.description) {
    file.write('_%s_', options.description).writeln().writeln();
  }
};

internals.writeBody = function(file, logs, options) {

  file.write('# %s #', git.getLatestCommitDate(logs, options)).writeln().writeln();
  _.forOwn(logs, function(scopes, type) {

    internals.writeAType(file, options, logs, type);
  });
};

internals.writeFooter = function(file) {

  file.end();
};


/**
 * Format logs
 *
 * @param {array} types options
 * @param {function} callback callback
 * @returns {array} generate
 */
exports.format = function(types, callback) {

  var patterns = _.map(_.defaultsDeep(types, config.defaults.types), 'pattern');
  git.getLogs(function(err, logs) {

    callback(err, internals.parse(patterns, logs));
  });
};


exports.generate = function(options, done) {

  options = _.defaults(options || {}, config.defaults);

  sync.waterfall([
    function(callback) {

      log('info', 'Get Tags');
      if (options.tag) {
        return callback(null, [ options.tag ]);
      }
      return git.getTags(callback);
    },
    function(tags, callback) {

      log('info', 'Get Logs');
      if (tags.length) {
        var series = {};
        var prevTagIndex = 1;
        tags.forEach(function(tag) {
          var since = tag;
          if (tags[prevTagIndex]) {
            since = tags[prevTagIndex++] + '..' + tag;
          }
          series[tag] = function(cb) { git.getLogs(since, cb); };
        });
        sync.series(series, callback);
      } else {
        git.getLogs(function(err, logs) {

          callback(err, { '': logs });
        });
      }
    },
    function(logs, callback) {

      log('info', 'Write file ...');
      var patterns = _.map(options.types, 'pattern');
      var file = new File(options.file);
      internals.writeHeader(file, options);

      _.forOwn(logs, function(logsOfTag, tag) {

        options.tag = tag;
        logsOfTag = internals.parse(patterns, logsOfTag);
        internals.writeBody(file, logsOfTag, options);
      });
      internals.writeFooter(file);
      log('info', 'Write file success');
      callback(null, logs);
    }
  ], done);
};
