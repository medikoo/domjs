'use strict';

var isFunction          = require('es5-ext/function/is-function')
  , isArrayLike         = require('es5-ext/object/is-array-like')
  , isPlainObject       = require('es5-ext/object/is-plain-object')
  , isIterable          = require('es6-iterator/is-iterable')
  , isMap               = require('es6-map/is-map')
  , isObservable        = require('observable-value/is-observable')
  , makeElement         = require('dom-ext/document/#/make-element')
  , normalize           = require('dom-ext/document/#/normalize')
  , castAttributes      = require('dom-ext/element/#/cast-attributes')
  , elExtend            = require('dom-ext/element/#/extend')
  , remove              = require('dom-ext/element/#/remove')
  , replaceContent      = require('dom-ext/element/#/replace-content')
  , isNode              = require('dom-ext/node/is-node')
  , memoize             = require('memoizee/plain')
  , getOneArgNormalizer = require('memoizee/normalizers/get-1')
  , getNormalizer       = require('memoizee/normalizers/get-fixed')
  , isObservableValue   = require('observable-value/is-observable-value')

  , map = Array.prototype.map;

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
		if (isNode(list) || !isFunction(renderItem)) return elExtend.apply(this, arguments);
		arrayLike = isArrayLike(list);
		if (!arrayLike && !isIterable(list)) {
			if (typeof renderItem.toDOM !== 'function') return elExtend.apply(this, arguments);
			throw new TypeError(list + " is not an array-like or iterable");
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
			result = this.safeCollectRaw(renderItem.bind(thisArg, item, index, list));
			if (result == null) return null;
			if (isObservableValue(result)) {
				return normalize.call(this.document, result.map(function (result) {
					result = normalize.call(this.document, result);
					if (result == null) return null;
					if (!isChildNode(result)) result = makeElement.call(this.document, childName, result);
					return result;
				}, this));
			}
			result = normalize.call(this.document, result);
			if (!isChildNode(result)) result = makeElement.call(this.document, childName, result);
			return result;
		};
		render = function () {
			var content;
			if (arrayLike) {
				content = map.call(list, cb, this.domjs);
			} else if (list.forEach) {
				content = [];
				list.forEach(function (item, key) {
					content.push(cb.call(this.domjs, item, key, list));
				}, this);
			}
			if (!content.length && onEmpty) content = onEmpty;
			replaceContent.call(this, content);
		}.bind(this);
		if (isObservable(list)) {
			cb = memoize(cb, { normalizer: isMap(list) ? getNormalizer(2) : getOneArgNormalizer() });
			list.on('change', render);
		}
		render();
		return this;
	};
};
