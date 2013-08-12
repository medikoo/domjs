'use strict';

var isFunction     = require('es5-ext/lib/Function/is-function')
  , isPlainObject  = require('es5-ext/lib/Object/is-plain-object')
  , castAttributes = require('dom-ext/lib/Element/prototype/cast-attributes')
  , genScript = require('dom-ext/lib/HTMLDocument/generate-inline-script-text');

require('./element').script = {
	_construct: function (attrs, src) {
		if (isFunction(attrs)) src = genScript.apply(null, arguments);
		else if (isPlainObject(attrs)) castAttributes.call(this, attrs);
		else src = attrs;

		if (src != null) this.appendChild(this.ownerDocument.createTextNode(src));
		return this;
	}
};
