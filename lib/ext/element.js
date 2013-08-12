'use strict';

var extend      = require('es5-ext/lib/Object/extend')
  , elExtend = require('dom-ext/lib/Element/prototype/extend')
  , exclude = require('dom-ext/lib/Element/prototype/exclude')
  , include = require('dom-ext/lib/Element/prototype/include')

  , forEach = Array.prototype.forEach;

exports._element = extend({
	_construct:    elExtend,
	after:         require('dom-ext/lib/Element/prototype/after'),
	append:        require('dom-ext/lib/Element/prototype/append'),
	before:        require('dom-ext/lib/Element/prototype/before'),
	castAttribute: require('dom-ext/lib/Element/prototype/cast-attribute'),
	clear:         require('dom-ext/lib/Element/prototype/clear'),
	disableControls:
		require('dom-ext/lib/HTMLElement/prototype/disable-controls'),
	exclude:       exclude,
	extend:        elExtend,
	getId:         require('dom-ext/lib/HTMLElement/prototype/get-id'),
	include:       include,
	prepend:       require('dom-ext/lib/Element/prototype/prepend'),
	remove: require('dom-ext/lib/Element/prototype/remove'),
	replace: require('dom-ext/lib/Element/prototype/replace'),

	toggle: function (value) {
		if (value) include.call(this);
		else exclude.call(this);
	},
	query: function (selector) {
		return this._domjs.normalize(this.querySelector(selector));
	},
	queryAll: function (selector) {
		var list = this.querySelectorAll(selector);
		forEach.call(list, this._domjs.normalize, this._domjs);
		return list;
	}
}, require('event-emitter/lib/core').methods);
