'use strict';

var directives = Object.create(null)

  , create = Object.create
  , base = create(null);

directives._element = base;

module.exports = function (name) {
	if (directives[name]) return directives[name];
	return (directives[name] = create(base));
};
