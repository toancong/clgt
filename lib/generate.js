'use strict';


var _ = require('lodash');
var async = require('async');
var config = require('./config');
var File = require('./file');
var git = require('./git');
var log = require('./log');
var util = require('./util');


function Generator(options) {

  this.options = options;
}

/**
 * Parse array logs to new format
 *
 * @param {array} patterns patterns
 * @param {array} logs logs
 * @returns {array} new formated logs
 */
Generator.prototype.parse = function(patterns, logs) {

  var pattern = '(' + patterns.join('|') + ')';

  if (this.options.ignore) {
    var self = this;
    logs = logs.filter(function(item) {

      return !item.match(new RegExp(self.options.ignore, 'i'));
    });
  }

  var group = _.map(logs, function(item) {

    var data = item.replace(new RegExp(pattern + '(.+)', 'i'), '$1|-|$2').split('|-|');
    if (data.length === 3) {
      data.unshift('', '');
    }
    if (data.length === 4) {
      data.unshift(data[0]);
      var type = data[2].replace(new RegExp('^\((.*)\):'), '$1|-|').split('|-|');
      if (type.length === 2) {
        data[1] = type[0];
        data[2] = type[1];
        data[1] = data[1].replace(new RegExp('[\(\)]', 'g'), '');
      } else {
        data[2] = data[0] + data[2];
        data[1] = '';
      }
    }
    data = _.map(data, _.trim);
    if (data[1].length === 0) {
      data[1] = 'false';
    }
    if (data[0].length === 0) {
      data[0] = 'other';
    }

    return _.zipObject([ 'type', 'scop', 'subj', 'hash', 'date' ], _.map(data, _.trim));
  });

  group = util.groupByMulti(group, [ 'type', 'scop', 'subj' ]);
  return group;
};


Generator.prototype.findType = function(source, key) {

  var indexKey = _.findIndex(source, function(item) {

    return item.pattern.match(key);
  });
  return source[indexKey] ? source[indexKey].title : key;
};


Generator.prototype.writeAType = function(file, options, types, type) {

  file.write('## %s ##', util.capitalize(this.findType(options.types, type))).writeln().writeln(); // type

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

Generator.prototype.writeHeader = function(file, options) {

  if (options.name) {
    file.write('__%s__', options.name).writeln().writeln();
  }

  if (options.description) {
    file.write('_%s_', options.description).writeln().writeln();
  }
};

Generator.prototype.writeBody = function(file, logs, options) {

  file.write('# %s #', git.getLatestCommitDate(logs, options)).writeln().writeln();
  var self = this;
  _.forOwn(logs, function(scopes, type) {

    self.writeAType(file, options, logs, type);
  });
};

Generator.prototype.writeFooter = function(file) {

  file.end();
};


/**
 * Format logs
 *
 * @param {array} types options
 * @param {function} callback callback
 * @returns {array} generate
 */
Generator.prototype.format = function(types, callback) {

  var patterns = _.map(_.defaultsDeep(types, config.defaults.types), 'pattern');
  var self = this;
  git.getLogs(function(err, logs) {

    callback(err, self.parse(patterns, logs));
  });
};


exports.Generator = Generator;


exports.generate = function(options, done) {

  options = _.defaults(options || {}, config.defaults);

  var generator = new Generator(options);
  async.waterfall([
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
        async.series(series, callback);
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
      generator.writeHeader(file, options);

      _.forOwn(logs, function(logsOfTag, tag) {

        options.tag = tag;
        logsOfTag = generator.parse(patterns, logsOfTag);
        generator.writeBody(file, logsOfTag, options);
      });
      generator.writeFooter(file);
      log('info', 'Write file success');
      callback(null, logs);
    },
    function(logs, callback) {

      // @TODO
      // this is just hot fix because fs.createWriteStream is not an asynchronous
      // fs.access(options.file, fs.R_OK | fs.W_OK, callback);
      callback();
    }
  ], done);
};
