'use strict';

var d              = require('es5-ext/lib/Object/descriptor')
  , extend         = require('es5-ext/lib/Object/extend')
  , validDocument  = require('dom-ext/lib/Document/valid-document')
  , Base           = require('./base')
  , construct      = require('./_construct-element')

  , elements = {}, HTML5;

['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio',
	'b', 'bdi', 'bdo', 'blockquote', 'br', 'button', 'canvas', 'caption', 'cite',
	'code', 'col', 'colgroup', 'command', 'datalist', 'dd', 'del', 'details',
	'device', 'dfn', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption',
	'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header',
	'hgroup', 'hr', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen',
	'label', 'legend', 'li', 'link', 'map', 'mark', 'menu', 'meter', 'nav',
	'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param',
	'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section',
	'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary',
	'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time',
	'tr', 'track', 'ul', 'var', 'video', 'wbr'].forEach(function (name) {
	elements[name] = d(function () {
		var el = this._current.appendChild(this.document.createElement(name));
		el.__proto__ = this._elementProto(name);
		construct(el, arguments);
		return el;
	});
});
elements._var = elements['var'];

module.exports = HTML5 = function (document) {
	if (!(this instanceof HTML5)) return new HTML5(document);
	Base.call(this, validDocument(document));
};

HTML5.prototype = Object.create(Base.prototype, extend({
	constructor: d(HTML5),
	ns: d(Object.create(Base.prototype.ns, d.binder(elements, '_domjs')))
}));

extend(require('./ext'), {
	ul:     require('./ext/html5/ul'),
	ol:     require('./ext/html5/ol'),
	tbody:  require('./ext/html5/tbody'),
	script: require('./ext/html5/script')
});
