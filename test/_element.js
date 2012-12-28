'use strict';

var toArray   = require('es5-ext/lib/Array/from')
  , isElement = require('dom-ext/lib/Element/is-element');

module.exports = function (t, a) {
	var el1, el2, el3, el4, fn = function () {}, domjs;

	if (typeof document === 'undefined') return;

	domjs = { document: document, current: document.createDocumentFragment() };

	el1 = document.createElement('p');
	el2 = document.createElement('div');
	el3 = document.createElement('form');

	t = t(domjs, 'section');
	el4 = t({ 'class': 'bar', onclick: fn }, el1, el2);

	a(typeof el4, 'function', "Function returned");
	a(isElement(el4.el), true, ".el");
	a(el4.el.nodeName.toLowerCase(), 'section', "Section element");
	a(el4.toDOM(), el4.el, "toDOM");

	a(el4.el.getAttribute('class'), 'bar', "With attrs & children: Attribute");
	a(el4.el.onclick, fn, "Listener attribute");

	a.deep(toArray(el4.el.childNodes), [el1, el2],
		"Children");
	el4({ foo: 'other' }, el3);
	a(el4.el.getAttribute('foo'), 'other', "Attribute added later");
	a.deep(toArray(el4.el.childNodes), [el1, el2, el3],
		"Children");
};
