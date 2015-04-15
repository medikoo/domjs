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
		var attrs, renderItem, render, thisArg, cb, onEmpty, listValue = listArg, list
		  , onNewList;
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
		if (!isObservableValue(listValue)) iterable(listValue);
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
			var content, isKeyValue;
			if (list) {
				isKeyValue = isMap(list);
				content = aFrom(list, function (item, index) {
					return isKeyValue ? cb.call(this, item[1], item[0]) : cb.call(this, item, index);
				}, this.domjs);
			} else {
				list = [];
			}
			if (!content.length && onEmpty) content = onEmpty;
			replaceContent.call(this, content);
		}.bind(this);
		onNewList = function (newList) {
			if (isObservable(list)) list.off('change', render);
			if (isObservable(newList)) {
				cb = memoize(cb, { normalizer: isMap(newList) ? getNormalizer(2) : getOneArgNormalizer() });
				newList.on('change', render);
			}
			list = newList;
			render();
		};
		if (isObservableValue(listValue)) {
			onNewList(listValue.value);
			listValue.on('change', function (event) { onNewList(event.newValue); });
		} else {
			onNewList(listValue);
		}
		return this;
	};
};
