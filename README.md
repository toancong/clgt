# CLGT #

[![Build Status](https://img.shields.io/travis/toancong/clgt/master.svg)](https://travis-ci.org/toancong/clgt)
[![Coverage Status](https://img.shields.io/coveralls/toancong/clgt/master.svg)](https://coveralls.io/github/toancong/clgt?branch=master)
[![Stable Version](https://img.shields.io/npm/v/clgt.svg)](https://www.npmjs.com/package/clgt)
[![Download Status](https://img.shields.io/npm/dt/clgt.svg)](https://www.npmjs.com/package/clgt)
[![License](https://img.shields.io/github/license/toancong/clgt.svg)](https://github.com/toancong/clgt/blob/master/LICENSE)

Change Log GiT

A tool generate git changelog file.
It help you generate change logs for specific version, from version to version.
Allow ignore some commits you don't like included in logs.
History with markdown output.

## Installation ##

``` bash
npm install -g clgt
```

## Usage ##

``` bash
$ clgt --help

Change Log GiT
A tool generate changelog file.
Usage: clgt <option>

Options:
  -d, --description  Description  [string]
  -f, --file         File ouput  [string] [default: "CHANGELOG.md"]
  -n, --name         App Name  [string]
  -t, --tag          Tag revision git  [string]
  -u, --url          Url commit repository git  [string] [required]
  -h, --help         Show this help
```

## FAQ ##

1.  How do I generate changelog to other file name?

    Answer: `clgt -n othername.md`

2.  How do I generate changelog for a specific version?

    Answer: `clgt -t v1.0`

3.  How do I generate changelog from a version to an other one?

    Answer: `clgt -t v1.0..v2.0` will generate logs from after v1.0 to v2.0:
    logs without v1.0, include v2.0 and between them.

4.  How do I generate changelog from a version to now?

    Answer: `clgt -t v1.0..`

5.  I want to ignore some commits in change logs.

    Answer: Please add regex pattern in `ignore` field to configuration file.

6.  Where is the configuration file?

    Answer: It's `.clgtrc`, located at root repository.
