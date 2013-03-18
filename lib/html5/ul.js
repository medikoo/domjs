'use strict';

var toArray        = require('es5-ext/lib/Array/from')
  , isFunction     = require('es5-ext/lib/Function/is-function')
  , d              = require('es5-ext/lib/Object/descriptor')
  , isList         = require('es5-ext/lib/Object/is-list')
  , isPlainObject  = require('es5-ext/lib/Object/is-plain-object')
  , isDF          = require('dom-ext/lib/DocumentFragment/is-document-fragment')
  , castAttributes = require('dom-ext/lib/Element/prototype/cast-attributes')
  , elExtend       = require('dom-ext/lib/Element/prototype/extend')
  , replaceContent = require('dom-ext/lib/Element/prototype/replace-content')
  , isNode         = require('dom-ext/lib/Node/is-node')
  , memoize        = require('memoizee/lib/regular')

  , map = Array.prototype.map;

module.exports = require('../base/element').extProperties.ul = {
	_construct: d(function (list/*, renderItem, thisArg*/) {
		var attrs, renderItem, render, thisArg, cb;
		if (isPlainObject(list) && !isFunction(arguments[1])) {
			attrs = list;
			list = arguments[1];
			renderItem = arguments[2];
			thisArg = arguments[3];
		} else {
			renderItem = arguments[1];
			thisArg = arguments[2];
		}
		if (isNode(list) || !isList(list) || !isFunction(renderItem)) {
			return elExtend.apply(this, arguments);
		}
		if (attrs) castAttributes.call(this, attrs);
		cb = function (item, index, list) {
			var direct, result;
			result = this.collect(function () {
				direct = renderItem.call(thisArg, item, index, list);
			});
			if (direct) result = direct;
			return isDF(result) ? toArray(result.childNodes) : result;
		};
		render = function () {
			replaceContent.call(this, map.call(list, cb, this._domjs));
		}.bind(this);
		if (typeof list.on === 'function') {
			cb = memoize(cb);
			list.on('change', render);
		}
		render();
		return this;
	})
};
