'use strict';

var isFunction     = require('es5-ext/function/is-function')
  , isPlainObject  = require('es5-ext/object/is-plain-object')
  , castAttributes = require('dom-ext/element/#/cast-attributes')
  , genScript    = require('dom-ext/html-document/generate-inline-script-text');

exports._construct = function (attrs, src) {
	if (isFunction(attrs)) src = genScript.apply(null, arguments);
	else if (isPlainObject(attrs)) castAttributes.call(this, attrs);
	else src = attrs;

	if (src != null) this.appendChild(this.ownerDocument.createTextNode(src));
	return this;
};
