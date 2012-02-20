'use strict';

var document = new (require('jsdom/lib/jsdom/level3/core')
		.dom.level3.core.Document)()
  , pg = __dirname + '/__playground';

module.exports = function (t, a) {
	var dom, el1, el2, builder;
	builder = Object.create(t).init(['foo', 'bar', 'var'])
		.init(document, require);
	dom = builder.build(function () {
		var late;

		foo("foo text");

		late = bar({ 'class': "test-class", other: "test-other", id: "internal" },
			foo("raz"),
			foo("dwa"),
			foo("trzy"));

		_var();

		late(foo("cztery"));
		late(foo("pięć"));

		late().setAttribute("foo", "bar");

		_element('not-standard', { foo: true, bar: false },
			"not standard content");

		_direct(el1 = document.createElement('div'),
			el2 = document.createElement('p'));
		el2.setAttribute('id', 'external');

		_text("text sibling");

		_comment("comment sibling");

		_cdata("cdata sibling");

	});

	a(dom && dom.nodeType, 11, "Expect document fragment");

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
	a(builder.getById('internal'),
		dom.parentNode.removeChild(dom.previousSibling), "Internal id");
	a(dom.nodeName, 'var', "Reserved element name");

	dom  = dom.nextSibling;
	a(dom.nodeName, 'not-standard', "Not standard element");
	a(dom.firstChild.data, 'not standard content',
		"Not standard element content");
	a(dom.getAttribute('foo'), 'foo', "Atribute set with boolean true");
	a(dom.hasAttribute('bar'), false, "Atribute set with boolean false");

	dom  = dom.nextSibling;
	a(dom, el1, "Direct append #1");

	dom  = dom.nextSibling;
	a(dom, el2, "Direct append #2");
	// a(builder.getById('external'), el2, "External id");

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

	a(builder.build('./__playground/tpl').firstChild.textContent, 'By require',
		"By require");
};
