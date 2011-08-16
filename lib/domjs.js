'use strict';

var reserved      = require('es5-ext/lib/reserved').all
  , isFunction    = require('es5-ext/lib/Function/is-function')
  , dscope        = require('es5-ext/lib/Function/dscope').call
  , slice         = require('es5-ext/lib/List/slice').call
  , toArray       = require('es5-ext/lib/List/to-array').call
  , bindMethods   = require('es5-ext/lib/Object/bind-methods').call
  , link          = require('es5-ext/lib/Object/plain/link').bind
  , isPlainObject = require('es5-ext/lib/Object/plain/is-plain-object').call

  , renameReserved, nodeMap, nextInit;

renameReserved = (function (rename) {
	return function (scope) {
		Object.keys(scope).forEach(rename, scope);
	};
}(function (key) {
	if (reserved[key]) {
		this['_' + key] = this[key];
		delete this[key];
	}
}));

nodeMap =  (function (create) {
	return {
		_cdata: create('createCDATASection'),
		_comment: create('createComment'),
		_text: create('createTextNode')
	};
}(function (method) {
	return function (str) {
		return this.df.appendChild(this.document[method](str));
	};
}));

nextInit = function (document) {
	this.document = document;
	Object.freeze(bindMethods(this.map, this));
	return this;
};

Object.freeze(module.exports = {
	init: (function (setCreate) {
		return function (elMap) {
			this.map = {};
			// attach node methods
			Object.keys(nodeMap).forEach(link(this.map, nodeMap));
			// attach element methods
			elMap.forEach(setCreate, this);
			renameReserved(this.map);

			this.init = nextInit;
			return this;
		};
	}(function (name) {
		this.map[name] = this.getCreate(name);
	})),
	build: function (f) {
		this.df = this.document.createDocumentFragment();
		dscope(f, this.map);
		return this.df;
	},
	processArguments: (function (getDOM) {
		return function (args) {
			args = toArray(args);
			return [isPlainObject(args[0]) ? args.shift() : {}, args.map(getDOM)];
		};
	}(function (obj) {
		return isFunction(obj) ? obj() : obj;
	})),
	getCreate: function (name) {
		return function () {
			return this.getUpdate(
				this.createElement(name, this.processArguments(arguments)));
		};
	},
	getUpdate: function (el) {
		return function f () {
			if (!arguments.length) {
				return el;
			}
			this.updateElement(el, this.processArguments(arguments));
			return f;
		}.bind(this);
	},
	createElement: function (name, data) {
		return this.updateElement(
			this.df.appendChild(this.document.createElement(name)), data);
	},
	updateElement: function (el, data) {
		var attrs = data[0], children = data[1];
		Object.keys(attrs).forEach(function (name) {
			this.setAttribute(el, name, attrs[name]);
		}, this);
		children.forEach(function (child) {
			if (typeof child === "string") {
				child = this.document.createTextNode(child);
			}
			el.appendChild(child);
		}, this);
		return el;
	},
	setAttribute: function (el, name, value) {
		el.setAttribute(name, value);
	}
});
