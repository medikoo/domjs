'use strict';

var isFunction    = require('es5-ext/lib/Function/is-function')
  , d             = require('es5-ext/lib/Object/descriptor')
  , extend        = require('es5-ext/lib/Object/extend')
  , validDocument = require('dom-ext/lib/Document/valid-document')
  , makeScript    = require('dom-ext/lib/HTMLDocument/prototype/make-script')
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
	'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'section', 'select',
	'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup',
	'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'tr',
	'track', 'ul', 'var', 'video', 'wbr'].forEach(function (name) {
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

// Special handling of script element
elements._script_ = d.gs(function () {
	defineProperty(this, '_script_', d('', element(this, 'script')));
	return this._script_;
});
elements.script = d.gs((function () {
	var fn = function (fn) {
		var el, custom;
		if (isFunction(fn)) {
			el = this._current.appendChild(makeScript.apply(this.document,
				 arguments));
			custom = true;
		} else {
			el = this._current.appendChild(this.document.createElement('script'));
		}
		el.__proto__ = this._script_;
		if (!custom) el._construct.apply(el, arguments);
		return el;
	};
	return function () {
		defineProperty(this, 'script', d('e', fn.bind(this)));
		return this.script;
	};
}()));

HTML5.prototype = Object.create(Base.prototype, extend({
	constructor: d(HTML5)
}, elements, {
	_var: elements['var']
}));

require('./html5/ul');
require('./html5/ol');
require('./html5/script');

module.exports = exports = function (document) {
	return new HTML5(validDocument(document));
};
exports.prototype = HTML5.prototype;
