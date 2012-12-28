'use strict';

var reserved      = require('es5-ext/lib/reserved')
  , contains      = require('es5-ext/lib/Array/prototype/contains')
  , validDocument = require('dom-ext/lib/Document/valid-document')
  , dfExtend      = require('dom-ext/lib/DocumentFragment/prototype/extend')
  , element       = require('./_element')

  , forEach = Array.prototype.forEach, slice = Array.prototype.slice
  , Base;

Base = function (document, names) {
	var domjs = this;

	this.document = document;
	this.current = document.createDocumentFragment();
	this.ns = {
		_cdata: function (str) {
			return domjs.current.appendChild(document.createCDATASection(str));
		},
		_comment: function (str) {
			return domjs.current.appendChild(document.createComment(str));
		},
		_insert: function () {
			dfExtend.apply(domjs.current, arguments);
		},
		_text: function (str) {
			return domjs.current.appendChild(document.createTextNode(str));
		},
		_element: function (name) {
			return element(domjs, name).apply(null, slice.call(arguments, 1));
		}
	};
	forEach.call(names, function (name) {
		var el = element(this, name);
		if (contains.call(reserved, name)) (name = '_' + name);
		this.ns[name] = el;
	}, this);
};

Base.prototype = {
	collect: function (fn) {
		var previous = this.current
		  , current = (this.current = this.document.createDocumentFragment());
		fn();
		this.current = previous;
		return current;
	}
};

module.exports = exports = function (document, names) {
	validDocument(document);
	return new Base(document, (names == null) ? [] : names);
};
exports.Base = Base;
