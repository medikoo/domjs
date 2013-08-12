'use strict';

var toArray       = require('es5-ext/lib/Array/from')
  , d             = require('es5-ext/lib/Object/descriptor')
  , extend        = require('es5-ext/lib/Object/extend')
  , forEach       = require('es5-ext/lib/Object/for-each')
  , memoize       = require('memoizee/lib/primitive')
  , validDocument = require('dom-ext/lib/Document/valid-document')
  , normalize     = require('dom-ext/lib/Document/prototype/normalize')
  , isDF          = require('dom-ext/lib/DocumentFragment/is-document-fragment')
  , isNode        = require('dom-ext/lib/Node/is-node')
  , validNode     = require('dom-ext/lib/Node/valid-node')
  , commentExt    = require('./ext/comment')
  , textExt       = require('./ext/text')
  , elementExt    = require('./ext/element')

  , slice = Array.prototype.slice
  , create = Object.create, defineProperty = Object.defineProperty
  , getPrototypeOf = Object.getPrototypeOf, Base;

require('memoizee/lib/ext/method');

module.exports = Base = function (document) {
	if (!(this instanceof Base)) return new Base(document);
	this.document = validDocument(document);
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
		var direct, result, l;
		result = this.collect(function () { direct = fn(); });
		if (direct) result = direct;
		if (result == null) return null;
		if (!isNode(result)) result = normalize.call(this.document, result);
		if (!isDF(result)) return result;
		l = result.childNodes.length;
		if (!l) return null;
		if (l === 1) return result.childNodes[0];
		return toArray(result.childNodes);
	})
}, d.lazy({
	_commentProto: d(function self() {
		var proto = create(getPrototypeOf(this.document.createComment('')), {
			domjs: d(this)
		});
		forEach(commentExt, function (value, name) {
			defineProperty(proto, name, d(value));
		});
		return proto;
	}),
	_textProto: d(function () {
		var proto = create(getPrototypeOf(this.document.createTextNode('')), {
			domjs: d(this)
		});
		forEach(textExt, function (value, name) {
			defineProperty(proto, name, d(value));
		});
		return proto;
	})
}), memoize(function (name) {
	var proto = create(getPrototypeOf(this.document.createElement(name)), {
		domjs: d(this)
	});
	forEach(elementExt._element, function (value, name) {
		defineProperty(proto, name, d(value));
	});
	if (elementExt[name]) {
		forEach(elementExt[name], function (value, name) {
			defineProperty(proto, name, d(value));
		});
	}
	return proto;
}, { method: '_elementProto' }), d.binder({
	comment: d(function (data) {
		var el = this._current.appendChild(this.document.createComment(data));
		el.__proto__ = this._commentProto;
		if (el._construct) el._construct.apply(el, slice.call(arguments, 1));
		return el;
	}),
	text: d(function (data) {
		var el = this._current.appendChild(this.document.createTextNode(data));
		el.__proto__ = this._textProto;
		if (el._construct) el._construct.apply(el, slice.call(arguments, 1));
		return el;
	}),
	element: d(function (name) {
		var el = this._current.appendChild(this.document.createElement(name));
		el.__proto__ = this._elementProto(name);
		if (el._construct) el._construct.apply(el, slice.call(arguments, 1));
		return el;
	}),
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
	insert: d(function (node/*, …nodes*/) {
		var dom = normalize.apply(this.document, arguments), result;
		if (isDF(dom)) result = toArray(dom.childNodes);
		else result = dom;
		this._current.appendChild(dom);
		return result;
	})
})));
