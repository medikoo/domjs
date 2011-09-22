'use strict';

var reserved      = require('es5-ext/lib/reserved').all
  , isFunction    = require('es5-ext/lib/Function/is-function')
  , curry         = require('es5-ext/lib/Function/curry').call
  , dscope        = require('es5-ext/lib/Function/dscope').call
  , compact       = require('es5-ext/lib/List/compact').call
  , flatten       = require('es5-ext/lib/List/flatten').call
  , forEach       = require('es5-ext/lib/List/for-each/call')
  , map           = require('es5-ext/lib/List/map/call')
  , slice         = require('es5-ext/lib/List/slice/call')
  , toArray       = require('es5-ext/lib/List/to-array').call
  , isList        = require('es5-ext/lib/List/is-list-object')
  , bindMethods   = require('es5-ext/lib/Object/bind-methods').call
  , link          = require('es5-ext/lib/Object/plain/link').bind
  , isPlainObject = require('es5-ext/lib/Object/plain/is-plain-object').call
  , oForEach      = require('es5-ext/lib/Object/plain/for-each').call
  , isNode        = require('dom-ext/lib/core/Node/is-node')

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

nodeMap = (function (create) {
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

nodeMap._element = function (name) {
	this.createElement(name, this.processArguments(slice(arguments, 1)));
};
nodeMap._direct = function () {
	forEach(arguments, this.df.appendChild, this.df);
};
nodeMap._detached = function () {
	return this.processChildren(toArray(arguments));
};

nextInit = function (document, extRequire) {
	this.document = document;
	this.require = extRequire || require;
	Object.freeze(bindMethods(this.map, this));
	return this;
};

module.exports = {
	init: (function (setCreate) {
		return function (elMap) {
			this.map = {};
			// attach node methods
			Object.keys(nodeMap).forEach(link(this.map, nodeMap));
			// attach element methods
			elMap.forEach(setCreate, this);
			renameReserved(this.map);
			this.map._map = this.map;

			this.init = nextInit;
			this.idMap = {};
			return this;
		};
	}(function (name) {
		this.map[name] = this.getCreate(name);
	})),
	build: function (f) {
		var df, predf;
		predf = this.df;
		df = this.df = this.document.createDocumentFragment();
		dscope(isFunction(f) ? f : curry(this.require, f), this.map);
		if (predf) {
			this.df = predf;
		}
		return df;
	},
	processArguments: function (args) {
		args = toArray(args);
		return [isPlainObject(args[0]) ? args.shift() : {}, args];
	},
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
	processChildren: function (children) {
		return compact(flatten(children.map(function self (child) {
			if (isFunction(child)) {
				child = child();
			} else if (!isNode(child) && isList(child)) {
				return map(child, self, this);
			} else if ((typeof child === "string") || (typeof child === "number")) {
				child = this.document.createTextNode(child);
			}
			return child;
		}, this)));
	},
	updateElement: function (el, data) {
		var attrs = data[0], children = data[1];
		oForEach(attrs, function (value, name) {
			this.setAttribute(el, name, value);
		}, this);
		this.processChildren(children).forEach(el.appendChild, el);
		return el;
	},
	setAttribute: function (el, name, value) {
		if ((value == null) || (value === false)) {
			return;
		} else if (value === true) {
			value = name;
		}
		el.setAttribute(name, value);
		if (name === 'id') {
			this.idMap[value] = el;
		}
	},
	getById: function (id) {
		return this.idMap[id] ||
			(this.idMap[id] = this.document.getElementById(id));
	}
};
