'use strict';

var document = new (require('jsdom/lib/jsdom/level3/core')
	.dom.level3.core.Document)();

module.exports = function (t, a) {
	a(t(null), false, "Null");
	a(t("test"), false, "Primitive");
	a(t({}), false, "Any object");
	a(t(document.createDocumentFragment()), true, "DocumentFragment");
	a(t(document.createElement('div')), true, "DocumentFragment");
	a(t(document.createTextNode('content')), true, "Text node");
	a(t(document.createComment('content')), true, "Comment node");
	a(t(document), true, "Document node");
};
