// Whether object is DOM node

'use strict';

module.exports = function (x) {
	return (x && (typeof x.nodeType === "number") &&
		(typeof x.nodeName === "string")) || false;
};
