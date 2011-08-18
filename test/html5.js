'use strict';

var document = new (require('jsdom/lib/jsdom/level3/core')
		.dom.level3.core.Document)();

module.exports = function (t, a) {
	var dom, handler = function () { };
	a(t(document).build(function () {
		div({ onclick: handler });
	}).firstChild.onclick, handler, "Function event handler");
};
