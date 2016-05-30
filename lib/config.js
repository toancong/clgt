'use strict';


var defaults = {
  file: 'CHANGELOG.md',
  name: '',
  description: '',
  types: [
    {
      'title': 'Bug Fixes',
      'pattern': '^fix|^bug'
    },
    {
      'title': 'Features',
      'pattern': '^feat'
    },
    {
      'title': 'Documentation',
      'pattern': '^docs'
    },
    {
      'title': 'Breaking changes',
      'pattern': 'BREAKING'
    },
    {
      'title': 'Refactor',
      'pattern': '^refactor'
    },
    {
      'title': 'Style',
      'pattern': '^style'
    },
    {
      'title': 'Test',
      'pattern': '^test'
    },
    {
      'title': 'Chore',
      'pattern': '^chore'
    },
    {
      'title': 'Branchs merged',
      'pattern': '^Merge branch'
    },
    {
      'title': 'Pull requests merged',
      'pattern': '^Merged in'
    }
  ]
};


var cmdOptions = {
  d: {
    alias: 'description',
    describe: 'Description',
    require: false,
    type: 'string'
  },
  f: {
    alias: 'file',
    default: 'CHANGELOG.md',
    describe: 'File ouput',
    require: false,
    type: 'string'
  },
  n: {
    alias: 'name',
    describe: 'App Name',
    require: false,
    type: 'string'
  },
  t: {
    alias: 'tag',
    describe: 'Tag revision git',
    require: false,
    type: 'string'
  },
  u: {
    alias: 'url',
    describe: 'Url commit repository git',
    require: true,
    type: 'string'
  },
  h: {
    alias: 'help',
    describe: 'Show this help'
  },
  r: {
    alias: 'report',
    describe: 'Export the report'
  }
};

exports.defaults = defaults;
exports.cmdOptions = cmdOptions;
