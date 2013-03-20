'use strict';

var d              = require('es5-ext/lib/Object/descriptor')
  , isPlainObject  = require('es5-ext/lib/Object/is-plain-object')
  , castAttributes = require('dom-ext/lib/Element/prototype/cast-attributes');

require('../base/element').extProperties.script = {
	_construct: d(function (attrs, src) {
		if (isPlainObject(attrs)) castAttributes.call(this, attrs);
		else src = attrs;

		if (src != null) this.appendChild(this.ownerDocument.createTextNode(src));
		return this;
	})
};
