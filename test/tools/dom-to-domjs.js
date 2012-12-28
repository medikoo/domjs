'use strict';

module.exports = function (t, a) {
	var html, body;
	if (typeof document === 'undefined') return;
	while (document.firstChild) document.removeChild(document.firstChild);

	html = document.appendChild(document.createElement('html'));
	body = html.appendChild(document.createElement('body'));

	body.setAttribute('foo', 'bar');
	body.appendChild(document.createTextNode('elo'));

	a(t(html), 'html(body({ foo: \'bar\' }, \'elo\'))');
};
