/* eslint handle-callback-err: "off" */

'use strict';

var generate = require('../lib/generate.js');
var Generator = generate.Generator;
var git = require('../lib/git.js');
var Process = require('child_process');

// Load external modules
var Lab = require('lab');
var Code = require('code');
var Sinon = require('sinon');

// Test shortcuts
var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;

var exampleLogs = function() {

  return [
    'feat(abc): cde|-|56448a5|-|2016-01-01',
    'feat(abc): cde|-|84e7c3e|-|2016-01-01',
    'feat(abc): cde|-|1c4b2f6|-|2016-01-01',
    'feat(bca): cde|-|b6b4052|-|2016-01-01',
    'abc2|-|0814ad4|-|2016-01-01',
    'abc|-|51203ad|-|2016-01-01',
    'abc|-|345aded|-|2016-01-01'
  ];
};

before(function(done) {

  done();
});

after(function(done) {

  done();
});

describe('Test generator', function() {

  describe('func format', function() {

    var generator;

    before(function(done) {

      generator = new Generator({});
      done();
    });

    it('return empty', function(done) {

      Sinon.stub(git, 'getLogs', function(callback) {

        callback(null, []);
      });
      generator.format({}, function(err, logs) {

        git.getLogs.restore();
        expect(logs).to.be.an.object();
        expect(logs).to.be.empty();
        done();
      });
    });

    it('return new format', function(done) {

      Sinon.stub(git, 'getLogs', function(callback) {

        callback(null, exampleLogs());
      });
      generator.format({}, function(err, logs) {

        git.getLogs.restore();
        expect(logs).to.be.an.object();
        expect(logs.other).to.be.an.object();
        expect(logs.other.false).to.be.an.object();
        expect(logs.other.false).to.equal({
          abc2: [
            {
              type: 'other',
              scop: 'false',
              subj: 'abc2',
              hash: '0814ad4',
              date: '2016-01-01'
            }
          ],
          abc: [
            {
              type: 'other',
              scop: 'false',
              subj: 'abc',
              hash: '51203ad',
              date: '2016-01-01'
            },
            {
              type: 'other',
              scop: 'false',
              subj: 'abc',
              hash: '345aded',
              date: '2016-01-01'
            }
          ]
        });

        expect(logs.feat).to.be.an.object();
        expect(logs.feat.abc).to.be.an.object();
        expect(logs.feat.bca).to.be.an.object();

        done();
      });
    });

    it('return new format with defaults', function(done) {

      Sinon.stub(git, 'getLogs', function(callback) {

        callback(null, exampleLogs());
      });
      generator.format({}, function(err, logs) {

        git.getLogs.restore();
        expect(logs).to.be.an.object();
        expect(logs.other).to.be.an.object();
        expect(logs.other.false).to.be.an.object();
        expect(logs.other.false).to.equal({
          abc2: [
            {
              type: 'other',
              scop: 'false',
              subj: 'abc2',
              hash: '0814ad4',
              date: '2016-01-01'
            }
          ],
          abc: [
            {
              type: 'other',
              scop: 'false',
              subj: 'abc',
              hash: '51203ad',
              date: '2016-01-01'
            },
            {
              type: 'other',
              scop: 'false',
              subj: 'abc',
              hash: '345aded',
              date: '2016-01-01'
            }
          ]
        });
        expect(logs.feat).to.be.an.object();
        expect(logs.feat.abc).to.be.an.object();
        expect(logs.feat.bca).to.be.an.object();

        done();
      });
    });

    it('return new format with defaults', function(done) {

      generator = new Generator({
        ignore: '^ignore me|.*and other.*'
      });

      Sinon.stub(git, 'getLogs', function(callback) {

        var logs = exampleLogs();
        logs.push('ignore me abc|-|345addd|-|2016-01-01');
        logs.push('abc and other|-|345adef|-|2016-01-01');
        callback(null, logs);
      });
      generator.format({ }, function(err, logs) {

        git.getLogs.restore();
        expect(logs).to.be.an.object();
        expect(logs.other).to.be.an.object();
        expect(logs.other.false).to.be.an.object();
        expect(logs.other.false).to.equal({
          abc2: [
            {
              type: 'other',
              scop: 'false',
              subj: 'abc2',
              hash: '0814ad4',
              date: '2016-01-01'
            }
          ],
          abc: [
            {
              type: 'other',
              scop: 'false',
              subj: 'abc',
              hash: '51203ad',
              date: '2016-01-01'
            },
            {
              type: 'other',
              scop: 'false',
              subj: 'abc',
              hash: '345aded',
              date: '2016-01-01'
            }
          ]
        });
        expect(logs.feat).to.be.an.object();
        expect(logs.feat.abc).to.be.an.object();
        expect(logs.feat.bca).to.be.an.object();

        done();
      });
    });
  });

  describe('func generate', function() {

    it('empty', function(done) {

      Sinon.stub(git, 'getTags', function(callback) {

        callback(null, []);
      });
      Sinon.stub(git, 'getLogs', function(callback) {

        callback(null, []);
      });
      generate.generate(null, function(err) {

        git.getLogs.restore();
        git.getTags.restore();
        done(err);
      });
    });

    it('without tag', function(done) {

      Sinon.stub(git, 'getTags', function(callback) {

        callback(null, []);
      });
      Sinon.stub(git, 'getLogs', function(callback) {

        callback(null, exampleLogs());
      });
      generate.generate({}, function(err) {

        git.getLogs.restore();
        git.getTags.restore();
        done(err);
      });
    });

    it('with tag', function(done) {

      Sinon.stub(git, 'getTags', function(callback) {

        callback(null, [ 'v2.0', 'v1.0' ]);
      });
      Sinon.stub(git, 'getLogs', function(tag, callback) {

        callback(null, exampleLogs());
      });
      generate.generate({}, function(err) {

        git.getLogs.restore();
        git.getTags.restore();
        done(err);
      });
    });

    it('with tag config', function(done) {

      Sinon.stub(git, 'getTags', function(callback) {

        callback(null, []);
      });
      Sinon.stub(git, 'getLogs', function(tag, callback) {

        callback(null, []);
      });
      Sinon.stub(Process, 'execSync', function(cmd) {

        // this is not really return cmd
        // I like return to bypass linter
        return cmd;
      });
      generate.generate({ tag: 'v1.0' }, function(err) {

        git.getLogs.restore();
        git.getTags.restore();
        Process.execSync.restore();
        done(err);
      });
    });

    it('with config', function(done) {

      Sinon.stub(git, 'getTags', function(callback) {

        callback(null, [ 'v2.0', 'v1.0' ]);
      });
      Sinon.stub(git, 'getLogs', function(tag, callback) {

        var logs = exampleLogs();
        logs.push('feature bca cde|-|b6b4052|-|2016-01-01');
        callback(null, logs);
      });

      var options = {
        name: 'test name',
        description: 'test description'
      };

      generate.generate(options, function(err) {

        git.getLogs.restore();
        git.getTags.restore();
        done(err);
      });
    });
  });
});
