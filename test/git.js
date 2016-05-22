/* eslint handle-callback-err: "off" */

'use strict';

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


before(function(done) {

  done();
});

after(function(done) {

  done();
});

describe('Test git', function() {

  describe('function getTags', function() {

    it('return empty on error expect', function(done) {

      Sinon.stub(Process, 'exec', function(cmd, callback) {

        callback(null, null, 'Error git');
      });

      git.getTags(function(err, tags) {

        Process.exec.restore();
        expect(err).to.be.not.undefined();
        expect(tags).to.be.an.array();
        expect(tags).to.be.empty();
        done();
      });
    });

    it('return empty on error', function(done) {

      Sinon.stub(Process, 'exec', function(cmd, callback) {

        callback('Error git');
      });

      git.getTags(function(err, tags) {

        Process.exec.restore();
        expect(err).to.be.not.undefined();
        expect(tags).to.be.an.array();
        expect(tags).to.be.empty();
        done();
      });
    });

    it('return empty', function(done) {

      Sinon.stub(Process, 'exec', function(cmd, callback) {

        callback(null, '');
      });

      git.getTags(function(err, tags) {

        Process.exec.restore();
        expect(tags).to.be.an.array();
        expect(tags).to.be.empty();
        done();
      });
    });

    it('return tags', function(done) {

      Sinon.stub(Process, 'exec', function(cmd, callback) {

        callback(null, 'v1.0\nv2.0\nv2.1\n');
      });

      git.getTags(function(err, tags) {

        Process.exec.restore();
        expect(tags).to.be.an.array();
        expect(tags).to.have.length(3);
        done();
      });
    });
  });

  describe('function getLog', function() {

    it('return empty on error expect', function(done) {

      Sinon.stub(Process, 'exec', function(cmd, callback) {

        callback(null, null, 'Error git');
      });

      git.getLogs(function(err, tags) {

        Process.exec.restore();
        expect(err).to.be.not.undefined();
        expect(tags).to.be.an.array();
        expect(tags).to.be.empty();
        done();
      });
    });

    it('return empty on error', function(done) {

      Sinon.stub(Process, 'exec', function(cmd, callback) {

        callback('Error git');
      });

      git.getLogs(function(err, tags) {

        Process.exec.restore();
        expect(err).to.be.not.undefined();
        expect(tags).to.be.an.array();
        expect(tags).to.be.empty();
        done();
      });
    });

    it('return empty', function(done) {

      Sinon.stub(Process, 'exec', function(cmd, callback) {

        callback(null, '');
      });

      git.getLogs(function(err, tags) {

        Process.exec.restore();
        expect(tags).to.be.an.array();
        expect(tags).to.be.empty();
        done();
      });
    });

    it('return logs', function(done) {

      Sinon.stub(Process, 'exec', function(cmd, callback) {

        callback(null, 'a\nb\nc\n');
      });

      git.getLogs(function(err, tags) {

        Process.exec.restore();
        expect(tags).to.be.an.array();
        expect(tags).to.have.length(3);
        done();
      });
    });

    it('return logs with tag', function(done) {

      Sinon.stub(Process, 'exec', function(cmd, callback) {

        callback(null, 'a\nb\nc\n');
      });

      git.getLogs('v1.0', function(err, tags) {

        Process.exec.restore();
        expect(tags).to.be.an.array();
        expect(tags).to.have.length(3);
        done();
      });
    });
  });

  describe('function getLatestCommitDate', function() {

    it('return empty on not found', function(done) {

      var date = git.getLatestCommitDate({});
      expect(date).to.be.empty();
      done();
    });

    it('return date', function(done) {

      var date = git.getLatestCommitDate({
        feat: {
          scope: {
            commit: [
              { date: '2016-01-04' },
              { date: '2016-01-03' }
            ]
          }
        },
        fix: {
          scope: {
            commit: [
              { date: '2016-01-02' },
              { date: '2016-01-01' }
            ]
          }
        }
      });
      expect(date).to.be.equal('(2016-01-04)');
      done();
    });

    it('return date with options', function(done) {

      var date = git.getLatestCommitDate({
        feat: {
          scope: {
            commit: [
              { date: '2016-01-04' },
              { date: '2016-01-03' }
            ]
          }
        },
        fix: {
          scope: {
            commit: [
              { date: '2016-01-02' },
              { date: '2016-01-01' }
            ]
          }
        }
      }, { tag: 'v1.0' });
      expect(date).to.be.equal('v1.0 (2016-01-04)');
      done();
    });
  });
});
