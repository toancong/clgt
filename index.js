#!/usr/bin/env node

(function() {
  var _ = require('lodash');
  var cmdOptions = require('./lib/config').cmdOptions;
  var generator = require('./lib/generate');
  var nconf = require('nconf');
  var log = require('./lib/log');

  if (!module.parent) {
    var file = _.cloneDeep(nconf.file('.clgtrc').stores.file.store);
    if (file.url) {
      cmdOptions.u.default = file.url;
    }
    var args = nconf.argv(cmdOptions,
      'Change Log GiT\nA tool generate changelog file.\nUsage: clgt <option>');

    if (args.get('help')) {
      args.stores.argv.showHelp();
      return;
    }

    var argv = _.pick(args.stores.argv.store, [ 'description', 'file', 'name', 'tag', 'url' ]);

    var options = _.defaultsDeep(argv, file);
    generator.generate(options, function(err) {

      if (err) {
        log('error', err);
      } else {
        log('success', 'Done generating to', options.file);
      }
    });
  }
})();
