'use strict';

var aFrom               = require('es5-ext/array/from')
  , isFunction          = require('es5-ext/function/is-function')
  , isPlainObject       = require('es5-ext/object/is-plain-object')
  , iterable            = require('es5-ext/iterable/validate-object')
  , isMap               = require('es6-map/is-map')
  , isObservable        = require('observable-value/is-observable')
  , isObservableValue   = require('observable-value/is-observable-value')
  , makeElement         = require('dom-ext/document/#/make-element')
  , normalize           = require('dom-ext/document/#/normalize')
  , castAttributes      = require('dom-ext/element/#/cast-attributes')
  , elExtend            = require('dom-ext/element/#/extend')
  , remove              = require('dom-ext/element/#/remove')
  , replaceContent      = require('dom-ext/element/#/replace-content')
  , isNode              = require('dom-ext/node/is-node')
  , memoize             = require('memoizee/plain')
  , getOneArgNormalizer = require('memoizee/normalizers/get-1')
  , getNormalizer       = require('memoizee/normalizers/get-fixed');

module.exports = function (childName, isChildNode) {
	return function (listArg/*, renderItem, thisArg*/) {
		var attrs, renderItem, render, thisArg, cb, onEmpty, listValue = listArg, list;
		if (isPlainObject(listValue) && !isFunction(arguments[1])) {
			attrs = listValue;
			listValue = arguments[1];
			renderItem = arguments[2];
			thisArg = arguments[3];
		} else {
			renderItem = arguments[1];
			thisArg = arguments[2];
		}
		if (isNode(listValue) || !isFunction(renderItem)) return elExtend.apply(this, arguments);
		list = listValue;
		iterable(list);
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
			content = aFrom(list, cb, this.domjs);
			if (!content.length && onEmpty) content = onEmpty;
			replaceContent.call(this, content);
		}.bind(this);
		if (attrs) {
			if (attrs.onEmpty) {
				onEmpty = attrs.onEmpty;
				delete attrs.onEmpty;
				if (isNode(onEmpty)) remove.call(onEmpty);
			}
			castAttributes.call(this, attrs);
		}
		if (isObservable(list)) {
			cb = memoize(cb, { normalizer: isMap(list) ? getNormalizer(2) : getOneArgNormalizer() });
			list.on('change', render);
		}
		render();
		return this;
	};
};
