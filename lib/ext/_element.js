'use strict';

var extend   = require('es5-ext/lib/Object/extend')
  , elExtend = require('dom-ext/lib/Element/prototype/extend')
  , exclude  = require('dom-ext/lib/Element/prototype/exclude')
  , include  = require('dom-ext/lib/Element/prototype/include')

  , forEach = Array.prototype.forEach;

exports._construct    = elExtend;
exports._directives   = require('../directives/_element');
exports.after         = require('dom-ext/lib/Element/prototype/after');
exports.append        = require('dom-ext/lib/Element/prototype/append');
exports.before        = require('dom-ext/lib/Element/prototype/before');
exports.castAttribute = require('dom-ext/lib/Element/prototype/cast-attribute');
exports.clear         = require('dom-ext/lib/Element/prototype/clear');
exports.disableControls =
	require('dom-ext/lib/HTMLElement/prototype/disable-controls');
exports.exclude       = exclude;
exports.extend        = elExtend;
exports.getId         = require('dom-ext/lib/HTMLElement/prototype/get-id');
exports.include       = include;
exports.prepend       = require('dom-ext/lib/Element/prototype/prepend');
exports.remove        = require('dom-ext/lib/Element/prototype/remove');
exports.replace       = require('dom-ext/lib/Element/prototype/replace');

exports.toggle = function (value) {
	if (value) include.call(this);
	else exclude.call(this);
};
exports.query = function (selector) {
	return this._domjs.normalize(this.querySelector(selector));
};
exports.queryAll = function (selector) {
	var list = this.querySelectorAll(selector);
	forEach.call(list, this._domjs.normalize, this._domjs);
	return list;
};

extend(exports, require('event-emitter/lib/core').methods);
