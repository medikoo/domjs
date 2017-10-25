'use strict';

var jsdomDocument;

try {
	jsdomDocument = new (require('jsdom')).JSDOM().window.document;
} catch (ignore) {}

exports.context = jsdomDocument ? { document: jsdomDocument } : {};
