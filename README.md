# domjs - client and server side dom template engine

Build dom structure easy way with plain JavaScript. Can be used on both client
and server side. Due to its small footprint it's best suited for small projects.

## Instalation

When using node:

	$ npm install domjs

_Instructions for browser side installation on the way._

## Usage

What would be the easiest, most intuitive way to build html5 DOM tree with plain
JavaScript ?

	var mytemplate = function () {
		header(
			h1('Heading'),
			h2('Subheading'));

		nav(
			ul({ 'class': 'breadcrumbs' },
				li(a({ href: '/' }, 'Home')),
				li(a({ href: '/section/'}, 'Section')),
				li(a('Subject'))));

		article(
			p('Lorem ipsum...'));

		footer('Footer stuff');
	};

This is how templates for domjs are written.

To get `mytemplate` function content turned into DOM
(literally _DocumentFragment_):

	var domjs = require('domjs/lib/html5')(document);

	var mydom = domjs(mytemplate);

### Other notes

You can save references to elements and operate on them later:

	var myul = ul(li('one'), li('two'), li('three'));

	// ... some code ...

	// add extra items to myul
	myul(li('four'), li('five));

	// append myul into other element
	div(myul);

You can access DOM elements directly, just invoke returned function with no
arguments

	(myul() instanceof DOMElement) === true

Comment type nodes:

	_comment('my comment');

CDATA type nodes

	_cdata('cdata text');

Text nodes in main scope:

	_text('my text');

Elements with names that are reserved keywords in JavaScript language, like
'var', should be created with preceding underscore added to its name:

	_var('var content');

## Tests

As `jsdom` won't install properly on Windows domjs  can be tested only on *nix systems

	$ npm test
