/* eslint handle-callback-err: "off" */

'use strict';

var generator = require('../lib/generator.js');
var git = require('../lib/git.js');

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

var exampleLogs = [
  'feat(abc): cde|-|56448a5|-|2016-01-01',
  'feat(abc): cde|-|84e7c3e|-|2016-01-01',
  'feat(abc): cde|-|1c4b2f6|-|2016-01-01',
  'feat(bca): cde|-|b6b4052|-|2016-01-01',
  'abc2|-|0814ad4|-|2016-01-01',
  'abc|-|51203ad|-|2016-01-01',
  'abc|-|345aded|-|2016-01-01'
];

before(function(done) {

  done();
});

after(function(done) {

  done();
});

describe('Test generator', function() {

  describe('func format', function() {

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

        callback(null, exampleLogs);
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

        callback(null, exampleLogs);
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
  });

  describe('func generate', function() {

    it('empty', function(done) {

      Sinon.stub(git, 'getTags', function(callback) {

        callback(null, []);
      });
      Sinon.stub(git, 'getLogs', function(callback) {

        callback(null, []);
      });
      generator.generate(null, function(err) {

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

        callback(null, exampleLogs);
      });
      generator.generate({}, function(err) {

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

        callback(null, exampleLogs);
      });
      generator.generate({}, function(err) {

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
      generator.generate({ tag: 'v1.0' }, function(err) {

        git.getLogs.restore();
        git.getTags.restore();
        done(err);
      });
    });

    it('with config', function(done) {

      Sinon.stub(git, 'getTags', function(callback) {

        callback(null, [ 'v2.0', 'v1.0' ]);
      });
      Sinon.stub(git, 'getLogs', function(tag, callback) {

        exampleLogs.push('feature bca cde|-|b6b4052|-|2016-01-01');
        callback(null, exampleLogs);
      });

      var options = {
        name: 'test name',
        description: 'test description'
      };

      generator.generate(options, function(err) {

        git.getLogs.restore();
        git.getTags.restore();
        done(err);
      });
    });
  });
});
