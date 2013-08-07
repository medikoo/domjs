'use strict';

var document;

try {
	document = new (require('jsdom/lib/jsdom/level3/core')
		.dom.level3.core.Document)();
} catch (ignore) {}

exports.context = document ? { document: document } : {};
