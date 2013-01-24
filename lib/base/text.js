'use strict';

var d       = require('es5-ext/lib/Object/descriptor')
  , exclude = require('dom-ext/lib/Text/prototype/exclude')
  , include = require('dom-ext/lib/Text/prototype/include')
  , remove  = require('dom-ext/lib/Text/prototype/remove')

  , join = Array.prototype.join
  , create = Object.create, defineProperty = Object.defineProperty
  , getPrototypeOf = Object.getPrototypeOf
  , props;

module.exports = exports = function (domjs) {
	return defineProperty(create(getPrototypeOf(domjs.document
		.createTextNode('')), props), '_domjs', d(domjs));
};

props = exports.properties = {
	_construct: d(function () {
		if (!arguments.length) return this;
		this.data += join.call(arguments, '');
		return this;
	}),
	exclude: d(exclude),
	include: d(include),
	remove: d(remove)
};
