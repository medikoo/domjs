'use strict';

var d    = require('es5-ext/lib/Object/descriptor')
  , noop = require('es5-ext/lib/Function/noop')

  , create = Object.create, defineProperty = Object.defineProperty
  , getPrototypeOf = Object.getPrototypeOf
  , props;

module.exports = exports = function (domjs) {
	return defineProperty(create(getPrototypeOf(domjs.document.createComment('')),
		props), '_domjs', d(domjs));
};

props = exports.properties = { _construct: d(noop) };
