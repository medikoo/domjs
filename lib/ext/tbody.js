'use strict';

require('./element').tbody = {
	_construct: require('./_list-construct')('tr',
		require('dom-ext/lib/HTMLTableRowElement/is-html-table-row-element'))
};
