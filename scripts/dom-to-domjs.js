'use strict';

var compact    = require('es5-ext/array/#/compact')
  , startsWith = require('es5-ext/string/#/starts-with')
  , repeat     = require('es5-ext/string/#/repeat')

  , map = Array.prototype.map
  , childNodes, attributes, element, text, text2

  , re = /^[a-zA-z][a-zA-Z0-9]*$/;

text = function (str) {
	return '\'' + str.replace(/\\/g, '\\\\').replace(/\n/g, '\\n')
		.replace(/'/g, '\\\'') + '\'';
};
text2 = function (str) {
	return '"' + str.replace(/\\/g, '\\\\').replace(/\n/g, '\\n')
		.replace(/"/g, '\\"') + '"';
};

attributes = function (attrs) {
	attrs = compact.call(map.call(attrs, function (attr) {
		if (startsWith.call(attr.name, 'data-')) return null;
		return (!re.test(attr.name) ? ('\'' + attr.name + '\'') : attr.name) +
			': ' + text(attr.value);
	}));

	if (!attrs.length) return null;
	return '{ ' + attrs.join(', ') + ' }';
};

childNodes = function (nodes, nest, doBreak) {
	var firstDone;
	return compact.call(map.call(nodes, function (node, idx) {
		var str, type = node.nodeType;
		if (type === 1) {
			str = ((doBreak || firstDone) ? ('\n' + repeat.call('\t', nest)) : '') +
				element(node, nest + 1);
			firstDone = true;
			return str;
		}
		if ((type === 3) || (type === 4)) {
			if (node.data.trim()) {
				str = (idx ? ' ' : '') + text2(node.data.trim());
				firstDone = true;
				return str;
			}
			return null;
		}
		if (type === 8) return null;
		throw new Error("Unrecognized type " + type);
	})).join(', ');
};

element = function (dom, nest) {
	return dom.nodeName.toLowerCase() + '(' +
		compact.call([dom.attributes.length ? attributes(dom.attributes) : null,
			dom.childNodes.length ? childNodes(dom.childNodes, nest,
				dom.attributes.length) : null]).join(', ') + ')';
};

module.exports = function (dom) {
	if (dom.nodeType === 9) dom = dom.documentElement;
	return element(dom, 1).replace(/\s+\n/g, '\n');
};
