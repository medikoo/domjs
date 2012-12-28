#!/usr/bin/env node

'use strict';

var writeFile  = require('fs').writeFile
  , resolve    = require('path').resolve
  , jsdom      = require('jsdom')
  , domToDomJS = require('../lib/tools/dom-to-domjs')

  , optimist = require('optimist')
	.usage("usage: $0 [options] <input>", {
		help: {
			boolean: true,
			desription: "Show this help"
		},
		output: {
			default: 'result.js',
			description: "Filename at which result should be saved"
		}
	}).demand(1)
  , options = optimist.argv;

if (options.help) {
	console.log(optimist.help());
	process.exit(0);
}

jsdom.env(resolve(options._[0]), function (errors, window) {
	if (errors) throw errors;
	writeFile(resolve(options.output), domToDomJS(window.document.body),
		function (err) {
			if (err) throw err;
		});
});
