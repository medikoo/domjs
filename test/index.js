'use strict';

var isDF = require('dom-ext/document-fragment/is-document-fragment');

module.exports = function (t, a) {
	var dom, domjs, ns;

	if (typeof document === 'undefined') return;

	domjs = t(document);

	ns = domjs.ns;
	dom = domjs.collect(function () {
		ns.div("foo text");

		ns.p({ class: "test-class", other: "test-other", id: "internal" },
			ns.span("raz"),
			ns.span("dwa"),
			ns.text("trzy"));
	});

	a(isDF(dom), true, "Expect document fragment");

	dom = dom.firstChild;
	a(dom.nodeName, 'div', "Match firstChild");
	a(dom.childNodes.length, 1, "ChildNodes length");
	a(dom.firstChild.nodeType, 3, "Append text node");
	a(dom.firstChild.data, 'foo text', "Append text node content");

	dom = dom.nextSibling;
	a(dom.nodeType, 1, "Sibling element");
	a(dom.nodeName, 'p', "Sibling element name");
	a(dom.getAttribute('class'), 'test-class', "Element attribute");
	a(dom.getAttribute('other'), 'test-other', "Element other attribute");
	a(dom.childNodes.length, 3, "Children");
	a(dom.firstChild.nodeType, 1, "Element child type");
	a(dom.firstChild.nodeName, 'span', "Element child name");
	a(dom.lastChild.textContent, 'trzy', "Last child content");
};
