'use strict';

require('./element').ul = {
	_construct: require('./_list-construct')('li',
		require('dom-ext/lib/HTMLLiElement/is-html-li-element'))
};
