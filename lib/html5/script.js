'use strict';

var isDate        = require('es5-ext/lib/Date/is-date')
  , d             = require('es5-ext/lib/Object/descriptor')
  , mapToArray    = require('es5-ext/lib/Object/map-to-array')
  , isPlainObject = require('es5-ext/lib/Object/is-plain-object')
  , isRegExp      = require('es5-ext/lib/RegExp/is-reg-exp')
  , repeat        = require('es5-ext/lib/String/prototype/repeat')

  , min = Math.min, match = String.prototype.match, stringify = JSON.stringify
  , functionRe = new RegExp('^\\s*function[\\0-\'\\)-\\uffff]*' +
		'\\(([\\0-\\(\\*-\\uffff]*)\\)\\s*\\{([\\0-\\uffff]*)\\}\\s*$')
  , setNest, convertValue;

setNest = function (str, nest, tabWidth) {
	var data, current, tabs = true, add, remove;
	data = str.split('\n');
	current = min.apply(null, data.map(function (str) {
		if (!str) return Infinity;
		return str.match(/^(\t*)/)[1].length;
	}));
	if (current === Infinity) current = 0;

	if (nest > current) {
		if (tabs) add = repeat.call('\t', nest - current);
		else add = repeat.call(' ', (nest - current) * tabWidth);
	} else {
		remove = current - nest;
		if (!tabs) remove *= tabWidth;
	}
	return data.map(function (str) {
		if (!str) return str;
		if (add) return add + str;
		return str.slice(remove);
	}).join('\n');
};

convertValue = function (value, nest) {
	var type = typeof value, data;
	if ((type === 'boolean') || (type === 'number') || isRegExp(value)) {
		return String(value);
	}
	if (type === 'function') {
		data = match.call(value, functionRe);
		return 'function (' + data[1] + ') {' + setNest(data[2], nest) +
			repeat.call('\t', nest) + '}';
	}
	if (isDate(value)) return 'new Date(' + value.getTime() + ')';
	if (isPlainObject(value)) {
		data = '{\n' + repeat.call('\t', nest + 1);
		data += mapToArray(value, function (value, name) {
			return stringify(name) + ': ' + convertValue(value, nest + 1);
		}).join(',\n' + repeat.call('\t', nest + 1)) + '\n' +
			repeat.call('\t', nest) + '}';
		return data;
	}
	return stringify(String(value));
};

module.exports = require('../base/element').extProperties.script = {
	_construct: d(function (fn, locals) {
		var str;
		if (typeof fn !== 'function') {
			str = String(fn);
		} else {
			str = '(function () { \'use strict\';';
			if (locals) {
				locals = mapToArray(locals, function (value, name) {
					return name + ' = ' + convertValue(value, 1);
				});
				str += '\n\tvar ' + locals.join(',\n\t') + ';\n';
			}
			str += setNest(match.call(fn, functionRe)[2], 0) + '}());';
		}
		this.appendChild(this.ownerDocument.createTextNode(str));
		return this;
	})
};
