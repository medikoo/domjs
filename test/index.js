'use strict';

var dom, d, t, handler;

handler = function () {};

dom = require('html5')(document)(function () {
	var late;

	h1("header");

	ul({ 'class': "test-list", onclick: handler },
		li("raz"),
		li("dwa"),
		li("trzy"));

	_var();

	late = ul({ 'class' : "test-list"},
		li("raz"),
		li("dwa"),
		li("trzy"));

	late(li("cztery"));
	late(li("pięć"));

	late().setAttribute("data-test", "test");

	_text("text sibling");

	_comment("comment sibling");

	_cdata("cdata sibling");

});

['el', 'next', 'reserved', 'late', 'text', 'comment', 'cdata']
	.reduce(function (el, key) {
		return (this[key] = el).nextSibling;
	}.bind(d = {}), dom.firstChild);

Object.keys(t = {
	"Expect document fragment": function () {
		assert.equal(dom && dom.nodeType, 11, this);
	},
	"Match firstChild": function () {
		assert.equal(d.el.nodeName, 'h1', this);
	},
	"ChildNodes length": function () {
		assert.equal(d.el.childNodes.length, 1, this);
	},
	"Append text node": function () {
		assert.equal(d.el.firstChild.nodeType, 3, this);
	},
	"Append text node content": function () {
		assert.equal(d.el.firstChild.data, 'header', this);
	},
	"Sibling element": function () {
		assert.equal(d.next.nodeType, 1, this);
	},
	"Sibling element name": function () {
		assert.equal(d.next.nodeName, 'ul', this);
	},
	"Element attribute": function () {
		assert.equal(d.next.getAttribute('class'), 'test-list', this);
	},
	"Element event handler attribute": function () {
		assert.equal(d.next.onclick, handler, this);
	},
	"Element children": function () {
		assert.equal(d.next.childNodes.length, 3, this);
	},
	"Element child type": function () {
		assert.equal(d.next.firstChild.nodeType, 1, this);
	},
	"Element child name": function () {
		assert.equal(d.next.firstChild.nodeName, 'li', this);
	},
	"Reserved element name": function () {
		assert.equal(d.reserved.nodeName, 'var', this);
	},
	"Late children": function () {
		assert.equal(d.late.childNodes.length, 5, this);
	},
	"Late child type": function () {
		assert.equal(d.late.lastChild.nodeType, 1, this);
	},
	"Late child name": function () {
		assert.equal(d.late.lastChild.nodeName, 'li', this);
	},
	"Late child content": function () {
		assert.equal(d.late.lastChild.textContent, 'pięć', this);
	},
	"Direct attribute": function () {
		assert.equal(d.late.getAttribute('data-test'), 'test', this);
	},
	"Sibling text node": function () {
		assert.equal(d.text.nodeType, 3, this);
	},
	"Sibling text node content": function () {
		assert.equal(d.text.data, 'text sibling', this);
	},
	"Sibling comment": function () {
		assert.equal(d.comment.nodeType, 8, this);
	},
	"Sibling comment content": function () {
		assert.equal(d.comment.data, 'comment sibling', this);
	},
	"Sibling CDATA": function () {
		assert.equal(d.cdata.nodeType, 4, this);
	},
	"Sibling CDATA content": function () {
		assert.equal(d.cdata.data, 'cdata sibling', this);
	}
}).forEach(function (m) {
	exports['test ' + m] = t[m].bind(m);
});
