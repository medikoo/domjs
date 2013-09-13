'use strict';

var isOptGroup
	= require('dom-ext/html-opt-group-element/is-html-opt-group-element')
  , isOption = require('dom-ext/html-option-element/is-html-option-element');

exports._construct = require('./_list-construct')('option',
	function (el) { return isOption(el) || isOptGroup(el); });
