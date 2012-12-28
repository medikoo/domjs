'use strict';

var isDate        = require('es5-ext/lib/Date/is-date')
  , mapToArray    = require('es5-ext/lib/Object/map-to-array')
  , isPlainObject = require('es5-ext/lib/Object/is-plain-object')
  , isRegExp      = require('es5-ext/lib/RegExp/is-reg-exp')
  , repeat        = require('es5-ext/lib/String/prototype/repeat')
  , validDocument = require('dom-ext/lib/Document/valid-document')
  , element       = require('./_element')
  , Base          = require('./base').Base

  , min = Math.min
  , match = String.prototype.match
  , stringify = JSON.stringify
  , functionRe = new RegExp('^\\s*function[\\0-\'\\)-\\uffff]*' +
		'\\(([\\0-\\(\\*-\\uffff]*)\\)\\s*\\{([\\0-\\uffff]*)\\}\\s*$')

  , names, setNest, convertValue;

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
			return name + ': ' + convertValue(value, nest + 1);
		}).join(',\n' + repeat.call('\t', nest + 1)) + '\n' +
			repeat.call('\t', nest) + '}';
		return data;
	}
	return stringify(String(value));
};

names = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio',
	'b', 'bdi', 'bdo', 'blockquote', 'br', 'button', 'canvas', 'caption', 'cite',
	'code', 'col', 'colgroup', 'command', 'datalist', 'dd', 'del', 'details',
	'device', 'dfn', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption',
	'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header',
	'hgroup', 'hr', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen',
	'label', 'legend', 'li', 'link', 'map', 'mark', 'menu', 'meter', 'nav',
	'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param',
	'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'section',
	'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary',
	'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time',
	'tr', 'track', 'ul', 'var', 'video', 'wbr'];

module.exports = function (document) {
	var domjs, script;
	validDocument(document);
	domjs = new Base(document, names);
	script = element(domjs, 'script');
	domjs.ns.script = function (fn, locals) {
		var str;
		if (typeof fn !== 'function') return script(String(fn));
		str = '(function () { \'use strict\';';
		if (locals) {
			locals = mapToArray(locals, function (value, name) {
				return name + ' = ' + convertValue(value, 1);
			});
			str += '\n\tvar ' + locals.join(',\n\t') + ';\n';
		}
		return script(str + setNest(match.call(fn, functionRe)[2], 0) + '}());');
	};
	return domjs;
};
