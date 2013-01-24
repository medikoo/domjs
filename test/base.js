'use strict';

var isDF = require('dom-ext/lib/DocumentFragment/is-document-fragment');

module.exports = function (t, a) {
	var dom, domjs, ns;

	if (typeof document === 'undefined') return;

	domjs = t(document);

	ns = domjs;
	dom = domjs.collect(function () {
		var late;

		ns.element('foo', "foo text");

		late = ns.element('bar', { 'class': "test-class", other: "test-other",
			id: "internal" },
			ns.element('foo', "raz"),
			ns.element('foo', "dwa"),
			ns.element('foo', "trzy"));

		late.extend(ns.element('foo', "cztery"));
		late.extend(ns.element('foo', "pięć"));

		late.setAttribute("foo", "bar");

		ns.text("text sibling");

		ns.comment("comment sibling");
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

	dom  = dom.nextSibling;
	a(dom.nodeType, 3, "Sibling text node");
	a(dom.data, 'text sibling', "Sibling text node content");

	dom = dom.nextSibling;
	a(dom.nodeType, 8, "Sibling comment");
	a(dom.data, 'comment sibling', "Sibling comment content");

	a(dom.nextSibling, null, "No unexpected DOM elements");
};
