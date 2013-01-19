'use strict';

var d        = require('es5-ext/lib/Object/descriptor')
  , extendEl = require('dom-ext/lib/Element/prototype/extend')

  , some = Array.prototype.some
  , defineProperty = Object.defineProperty

  , prototype, domify;

domify = function (el, proto) {
	var self;
	if (el._domjs) return el._domjs;
	self = function () {
		extendEl.apply(el, arguments);
		return self;
	};
	self.__proto__ = proto || prototype;
	self.el = defineProperty(el, '_domjs', d(self));
	return self;
};

prototype = Object.create(Function.prototype, {
	remove: d(function () {
		var parent = this.el.parentNode;
		if (!parent) return;
		parent.removeChild(this.el);
	}),
	takeOut: d(function () {
		if (this._isTakenOut || !this.el.parentNode) return;
		if (!this._domLocation) {
			this._domLocation =
				this.el.parentNode.insertBefore(
					this.el.ownerDocument.createTextNode(''),
					this.el.nextSibling
				);
		}
		this.remove();
		this._isTakenOut = true;
	}),
	takeIn: d(function () {
		if (!this._isTakenOut) return;
		this._domLocation.parentNode.insertBefore(this.el, this._domLocation);
		delete this._isTakenOut;
	}),
	toDOM: d(function () {
		return this.el;
	}),
	getById: d(function (id) {
		var target, fn;
		id = String(id);
		fn = function (el) {
			if (el.getAttribute('id') === id) return (target = el);
			return some.call(el.children, fn);
		};
		if (some.call(this.el.children, fn)) {
			return target._domjs || domify(target);
		}
		return null;
	})
});

module.exports = exports = function (domjs, name, proto) {
	var document = domjs.document;
	return function () {
		return domify(domjs.current.appendChild(extendEl.apply(document
			.createElement(name), arguments)), proto);
	};
};
exports.proto = prototype;
exports.domify = domify;
