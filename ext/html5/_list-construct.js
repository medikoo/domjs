'use strict';

var isFunction     = require('es5-ext/function/is-function')
  , isArrayLike    = require('es5-ext/object/is-array-like')
  , isPlainObject  = require('es5-ext/object/is-plain-object')
  , isIterable     = require('es6-iterator/is-iterable')
  , isObservable   = require('observable-value/is-observable')
  , makeElement    = require('dom-ext/document/#/make-element')
  , castAttributes = require('dom-ext/element/#/cast-attributes')
  , elExtend       = require('dom-ext/element/#/extend')
  , remove         = require('dom-ext/element/#/remove')
  , replaceContent = require('dom-ext/element/#/replace-content')
  , isNode         = require('dom-ext/node/is-node')
  , isText         = require('dom-ext/text/is-text')
  , memoize        = require('memoizee/lib/regular')

  , map = Array.prototype.map, call = Function.prototype.call;

module.exports = function (childName, isChildNode) {
	return function (listArg/*, renderItem, thisArg*/) {
		var attrs, renderItem, render, thisArg, cb, onEmpty, arrayLike
		  , list = listArg;
		if (isPlainObject(list) && !isFunction(arguments[1])) {
			attrs = list;
			list = arguments[1];
			renderItem = arguments[2];
			thisArg = arguments[3];
		} else {
			renderItem = arguments[1];
			thisArg = arguments[2];
		}
		if (isNode(list) || !isFunction(renderItem)) {
			return elExtend.apply(this, arguments);
		}
		arrayLike = isArrayLike(list);
		if (!arrayLike && !isIterable(list)) {
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
			var content;
			if (arrayLike) {
				content = map.call(list, cb, this.domjs);
			} else if (list.forEach) {
				content = [];
				list.forEach(function (item, key) {
					content.push(call.call(cb, this.domjs, item, key, list));
				}, this);
			}
			if (!content.length && onEmpty) content = onEmpty;
			replaceContent.call(this, content);
		}.bind(this);
		if (isObservable(list)) {
			cb = memoize(cb, { length: 1 });
			list.on('change', render);
		}
		render();
		return this;
	};
};
