'use strict';

var join = Array.prototype.join;

exports._construct = function (data/* …data*/) {
	this.data += join.call(arguments, '');
	return this;
};

exports.exclude = require('dom-ext/lib/Text/prototype/exclude');
exports.include = require('dom-ext/lib/Text/prototype/include');
exports.remove = require('dom-ext/lib/Text/prototype/remove');
