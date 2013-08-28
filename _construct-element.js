'use strict';

var copy          = require('es5-ext/object/copy')
  , forEach       = require('es5-ext/object/for-each')
  , isPlainObject = require('es5-ext/object/is-plain-object')

  , slice = Array.prototype.slice, keys = Object.keys;

module.exports = function (el, args) {
	var directives, attrs = args[0];
	if (isPlainObject(attrs) && (typeof attrs.toDOM !== 'function')) {
		forEach(attrs, function (value, name) {
			if (el._directives[name]) {
				if (!directives) directives = {};
				directives[name] = value;
			}
		});
		if (directives) {
			attrs = copy(attrs);
			keys(directives).forEach(function (name) { delete attrs[name]; });
			args = slice.call(args, 1);
			args.unshift(attrs);
		}
	}

	// run constructors
	el._construct.apply(el, args);

	if (!directives) return;

	// Apply directives
	forEach(directives, function (value, name) {
		el._directives[name].call(el, value);
	});
};
