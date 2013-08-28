'use strict';

var join = Array.prototype.join;

exports._construct = function (data/* …data*/) {
	this.data += join.call(arguments, '');
	return this;
};

exports.exclude = require('dom-ext/text/#/exclude');
exports.include = require('dom-ext/text/#/include');
exports.remove = require('dom-ext/text/#/remove');
