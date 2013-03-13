'use strict';

var d             = require('es5-ext/lib/Object/descriptor')
  , extend        = require('es5-ext/lib/Object/extend')
  , validDocument = require('dom-ext/lib/Document/valid-document')
  , Base          = require('./base').prototype.constructor
  , element       = require('./base/element')

  , defineProperty = Object.defineProperty
  , HTML5 = function (document) { Base.call(this, document); }
  , elements;

['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio',
	'b', 'bdi', 'bdo', 'blockquote', 'br', 'button', 'canvas', 'caption', 'cite',
	'code', 'col', 'colgroup', 'command', 'datalist', 'dd', 'del', 'details',
	'device', 'dfn', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption',
	'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header',
	'hgroup', 'hr', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen',
	'label', 'legend', 'li', 'link', 'map', 'mark', 'menu', 'meter', 'nav',
	'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param',
	'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'script', 'samp', 'section',
	'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary',
	'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time',
	'tr', 'track', 'ul', 'var', 'video', 'wbr'].forEach(function (name) {
	var protoName = '_' + name + '_';
	this[protoName] = d.gs(function () {
		defineProperty(this, protoName, d('', element(this, name)));
		return this[protoName];
	});
	this[name] = d.gs((function () {
		var fn = function () {
			var el = this._current.appendChild(this.document.createElement(name));
			el.__proto__ = this[protoName];
			return el._construct.apply(el, arguments);
		};
		return function () {
			defineProperty(this, name, d('e', fn.bind(this)));
			return this[name];
		};
	}()));
}, elements = {});

HTML5.prototype = Object.create(Base.prototype, extend({
	constructor: d(HTML5)
}, elements, {
	_var: elements['var']
}));

require('./html5/ul');
require('./html5/script');

module.exports = exports = function (document) {
	return new HTML5(validDocument(document));
};
exports.prototype = HTML5.prototype;
