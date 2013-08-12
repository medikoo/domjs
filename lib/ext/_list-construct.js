'use strict';

var isFunction     = require('es5-ext/lib/Function/is-function')
  , isList         = require('es5-ext/lib/Object/is-list')
  , isPlainObject  = require('es5-ext/lib/Object/is-plain-object')
  , makeElement    = require('dom-ext/lib/Document/prototype/make-element')
  , castAttributes = require('dom-ext/lib/Element/prototype/cast-attributes')
  , elExtend       = require('dom-ext/lib/Element/prototype/extend')
  , remove         = require('dom-ext/lib/Element/prototype/remove')
  , replaceContent = require('dom-ext/lib/Element/prototype/replace-content')
  , isNode         = require('dom-ext/lib/Node/is-node')
  , isText         = require('dom-ext/lib/Text/is-text')
  , memoize        = require('memoizee/lib/regular')

  , map = Array.prototype.map;

module.exports = function (name, childName, isChildNode) {
	return function (list/*, renderItem, thisArg*/) {
		var attrs, renderItem, render, thisArg, cb, onEmpty;
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
		if (attrs) {
			if (attrs.onEmpty) {
				onEmpty = attrs.onEmpty;
				delete attrs.onEmpty;
				if (isNode(onEmpty)) remove.call(onEmpty);
			}
			castAttributes.call(this, attrs);
		}
		cb = function (item, index, list) {
			var result;
			result = this.safeCollect(renderItem.bind(thisArg, item, index, list));
			if (result == null) return null;
			if (isText(result) && !result.data && result._isDomExtLocation_) {
				return result;
			}
			if (!isChildNode(result)) {
				result = makeElement.call(this.document, childName, result);
			}
			return result;
		};
		render = function () {
			var content = map.call(list, cb, this._domjs);
			if (!content.length && onEmpty) content = onEmpty;
			replaceContent.call(this, content);
		}.bind(this);
		if (typeof list.on === 'function') {
			cb = memoize(cb, { length: 1 });
			list.on('change', render);
		}
		render();
		return this;
	};
};
