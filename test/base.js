'use strict';

var isDF = require('dom-ext/lib/DocumentFragment/is-document-fragment');

module.exports = function (t, a) {
	var dom, el1, el2, domjs, ns;

	if (typeof document === 'undefined') return;

	domjs = t(document, ['foo', 'bar', 'var']);

	ns = domjs.ns;
	dom = domjs.collect(function () {
		var late;

		ns.foo("foo text");

		late = ns.bar({ 'class': "test-class", other: "test-other",
			id: "internal" },
			ns.foo("raz"),
			ns.foo("dwa"),
			ns.foo("trzy"));

		ns._var();

		late(ns.foo("cztery"));
		late(ns.foo("pięć"));

		late.el.setAttribute("foo", "bar");

		ns._element('not-standard', { foo: true, bar: false },
			"not standard content");

		ns._insert(el1 = document.createElement('div'),
			el2 = document.createElement('p'));
		el2.setAttribute('id', 'external');

		ns._text("text sibling");

		ns._comment("comment sibling");

		ns._cdata("cdata sibling");

	});

	a(isDF(dom), true, "Expect document fragment");

	dom = dom.firstChild;
	a(dom.nodeName, 'foo', "Match firstChild");
	a(dom.childNodes.length, 1, "ChildNodes length");
	a(dom.firstChild.nodeType, 3, "Append text node");
	a(dom.firstChild.data, 'foo text', "Append text node content");

	dom = dom.nextSibling;
	a(dom.nodeType, 1, "Sibling element");
	a(dom.nodeName, 'bar', "Sibling element name");
	a(dom.getAttribute('class'), 'test-class', "Element attribute");
	a(dom.getAttribute('other'), 'test-other', "Element other attribute");
	a(dom.childNodes.length, 5, "Late children");
	a(dom.firstChild.nodeType, 1, "Element child type");
	a(dom.firstChild.nodeName, 'foo', "Element child name");
	a(dom.lastChild.textContent, 'pięć', "Late child content");
	a(dom.getAttribute('foo'), 'bar', "Direct attribute");

	dom = dom.nextSibling;
	a(dom.nodeName, 'var', "Reserved element name");

	dom  = dom.nextSibling;
	a(dom.nodeName, 'not-standard', "Not standard element");
	a(dom.firstChild.data, 'not standard content',
		"Not standard element content");
	a(dom.getAttribute('foo'), 'foo', "Atribute set with boolean true");
	a(dom.hasAttribute('bar'), false, "Atribute set with boolean false");

	dom  = dom.nextSibling;
	a(dom, el1, "Insert append #1");

	dom  = dom.nextSibling;
	a(dom, el2, "Insert append #2");

	dom  = dom.nextSibling;
	a(dom.nodeType, 3, "Sibling text node");
	a(dom.data, 'text sibling', "Sibling text node content");

	dom = dom.nextSibling;
	a(dom.nodeType, 8, "Sibling comment");
	a(dom.data, 'comment sibling', "Sibling comment content");

	dom = dom.nextSibling;
	a(dom.nodeType, 4, "Sibling CDATA");
	a(dom.data, 'cdata sibling', "Sibling CDATA content");

	a(dom.nextSibling, null, "No unexpected DOM elements");
};
