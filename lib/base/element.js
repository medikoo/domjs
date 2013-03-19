'use strict';

var copy        = require('es5-ext/lib/Object/copy')
  , d           = require('es5-ext/lib/Object/descriptor')
  , extend      = require('es5-ext/lib/Object/extend')
  , map         = require('es5-ext/lib/Object/map')
  , ee          = require('event-emitter/lib/core').methods
  , after       = require('dom-ext/lib/Element/prototype/after')
  , append      = require('dom-ext/lib/Element/prototype/append')
  , before      = require('dom-ext/lib/Element/prototype/before')
  , clear       = require('dom-ext/lib/Element/prototype/clear')
  , exclude     = require('dom-ext/lib/Element/prototype/exclude')
  , elExtend    = require('dom-ext/lib/Element/prototype/extend')
  , include     = require('dom-ext/lib/Element/prototype/include')
  , prepend     = require('dom-ext/lib/Element/prototype/prepend')
  , remove      = require('dom-ext/lib/Element/prototype/remove')
  , replace     = require('dom-ext/lib/Element/prototype/replace')
  , disControls = require('dom-ext/lib/HTMLElement/prototype/disable-controls')

  , forEach = Array.prototype.forEach
  , create = Object.create, defineProperty = Object.defineProperty
  , getPrototypeOf = Object.getPrototypeOf
  , core, ext;

module.exports = exports = function (domjs, name) {
	var props = core;
	if (ext.hasOwnProperty(name)) props = extend(copy(props), ext[name]);
	return defineProperty(create(getPrototypeOf(domjs.document
		.createElement(name)), props), '_domjs', d(domjs));
};

core = exports.properties = extend({
	_construct: d(elExtend),
	after: d(after),
	append: d(append),
	before: d(before),
	clear: d(clear),
	disableControls: d(disControls),
	exclude: d(exclude),
	extend: d(elExtend),
	include: d(include),
	prepend: d(prepend),
	toggle: d(function (value) {
		if (value) include.call(this);
		else exclude.call(this);
	}),
	query: d(function (selector) {
		return this._domjs.normalize(this.querySelector(selector));
	}),
	queryAll: d(function (selector) {
		var list = this.querySelectorAll(selector);
		forEach.call(list, this._domjs.normalize, this._domjs);
		return list;
	}),
	remove: d(remove),
	replace: d(replace)
}, map(ee, function (method) { return d(method); }));

ext = exports.extProperties = {};
