'use strict';

var indirectEval = eval;
var global = indirectEval('this');

global.assert = require('assert');
global.document = new (require('jsdom/lib/jsdom/level3/core')
		.dom.level3.core.Document)();

require.paths.push(__dirname + '/../lib');

// move on expresso
exports.ignore = function () {};