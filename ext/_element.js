'use strict';

var assign  = require('es5-ext/object/assign')
  , extend  = require('dom-ext/element/#/extend')
  , exclude = require('dom-ext/element/#/exclude')
  , include = require('dom-ext/element/#/include')

  , forEach = Array.prototype.forEach;

exports._construct      = extend;
exports.after           = require('dom-ext/element/#/after');
exports.append          = require('dom-ext/element/#/append');
exports.before          = require('dom-ext/element/#/before');
exports.castAttribute   = require('dom-ext/element/#/cast-attribute');
exports.clear           = require('dom-ext/element/#/clear');
exports.disableControls = require('dom-ext/html-element/#/disable-controls');
exports.exclude         = exclude;
exports.extend          = extend;
exports.getId           = require('dom-ext/html-element/#/get-id');
exports.include         = include;
exports.prepend         = require('dom-ext/element/#/prepend');
exports.remove          = require('dom-ext/element/#/remove');
exports.replace         = require('dom-ext/element/#/replace');

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

assign(exports, require('event-emitter').methods);
