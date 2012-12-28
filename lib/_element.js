'use strict';

var d        = require('es5-ext/lib/Object/descriptor')
  , extendEl = require('dom-ext/lib/Element/prototype/extend')

  , prototype;

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
	})
});

module.exports = exports = function (domjs, name, proto) {
	var document = domjs.document;
	return function () {
		var el, self;
		el = domjs.current.appendChild(extendEl.apply(document.createElement(name),
			 arguments));
		self = function () {
			extendEl.apply(el, arguments);
			return self;
		};
		self.__proto__ = proto || prototype;
		self.el = el;
		return self;
	};
};
exports.proto = prototype;
