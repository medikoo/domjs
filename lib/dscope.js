// Dynamic scope for given function
// Pollutes global scope for time of function call

'use strict';

var keys     = Object.keys
  , global   = require('es5-ext/lib/global')
  , reserved = require('es5-ext/lib/reserved').all

  , set, unset;

set = function (scope, cache) {
	keys(scope).forEach(function (key) {
		if (global.hasOwnProperty(key)) {
			cache[key] = global[key];
		}
		global[key] = scope[key];
	});
};

unset = function (scope, cache) {
	keys(scope).forEach(function (key) {
		if (cache.hasOwnProperty(key)) {
			global[key] = cache[key];
		} else {
			delete global[key];
		}
	});
};

module.exports = function (fn, scope) {
	var result, cache = {};
	set(scope, cache);
	result = fn();
	unset(scope, cache);
	return result;
};
