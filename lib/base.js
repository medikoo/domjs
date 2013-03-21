'use strict';

var toArray       = require('es5-ext/lib/Array/from')
  , d             = require('es5-ext/lib/Object/descriptor')
  , extend        = require('es5-ext/lib/Object/extend')
  , validDocument = require('dom-ext/lib/Document/valid-document')
  , normalize     = require('dom-ext/lib/Document/prototype/normalize')
  , isDF          = require('dom-ext/lib/DocumentFragment/is-document-fragment')
  , validNode     = require('dom-ext/lib/Node/valid-node')
  , comment       = require('./base/comment')
  , element       = require('./base/element')
  , text          = require('./base/text')

  , slice = Array.prototype.slice
  , defineProperty = Object.defineProperty
  , Base, setup;

setup = function (name, protoConstructor, methodName) {
	var props = {}, protoName = '_' + name + '_';
	props[protoName] = d.gs(function () {
		defineProperty(this, protoName, d('', protoConstructor(this)));
		return this[protoName];
	});
	props[name] = d.gs((function (f) {
		var fn = function (arg) {
			var el = this._current.appendChild(this.document[methodName](arg));
			el.__proto__ = this[protoName];
			return el._construct.apply(el, slice.call(arguments, 1));
		};
		return function () {
			defineProperty(this, name, d('e', fn.bind(this)));
			return this[name];
		};
	}()));
	return props;
};

Base = function (document) {
	this.document = document;
	defineProperty(this, '_current', d('cw', document.createDocumentFragment()));
};
Object.defineProperties(Base.prototype, extend({
	collect: d(function (fn) {
		var previous = this._current
		  , current = (this._current = this.document.createDocumentFragment());
		fn();
		this._current = previous;
		return current;
	}),
	safeCollect: d(function (fn) {
		var direct, result;
		result = this.collect(function () { direct = fn(); });
		if (direct) result = direct;
		if (isDF(result)) result = toArray(result.childNodes);
		else result = normalize.call(this.document, result);
		if (result.length === 1) result = result[0];
		return result;
	}),
	_element_: d(function (name) {
		var protoName = '_' + name + '_';
		if (this[protoName]) return this[protoName];
		defineProperty(this, protoName, d('', element(this, name)));
		return this[protoName];
	})
}, d.binder({
	normalize: d(function (node) {
		var name = validNode(node).nodeName, proto;
		if (name[0] === '#') {
			name = name.slice(1);
			proto = this['_' + name + '_'];
			if (!proto) throw new Error("Cannot normalize: " + node);
		} else if (!(proto = this['_' + name + '_'])) {
			proto = this._element_(name);
		}
		node.__proto__ = proto;
		return node;
	}),
	element: d('e', function (name) {
		var el = this._current.appendChild(this.document.createElement(name));
		el.__proto__ = this._element_(name);
		return el._construct.apply(el, slice.call(arguments, 1));
	}),
	insert: d('e', function (node/*, …nodes*/) {
		return normalize.apply(this.document, arguments)
			.map(this._current.appendChild, this._current);
	})
}),
	setup('comment', comment, 'createComment'),
	setup('text', text, 'createTextNode')));

module.exports = exports = function (document) {
	return new Base(validDocument(document));
};
exports.prototype = Base.prototype;
