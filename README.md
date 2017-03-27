# domjs
## Client and server side dom template engine

Build dom structure easy way with plain JavaScript. Can be used on both client
and server side.

### Installation

	$ npm install domjs

To port it to Browser or any other (non CJS) environment, use your favorite CJS bundler. No favorite yet? Try: [Browserify](http://browserify.org/), [Webmake](https://github.com/medikoo/modules-webmake) or [Webpack](http://webpack.github.io/)

## Usage

What would be the easiest, most intuitive way to build html5 DOM tree with plain
JavaScript ?

```javascript
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
```

This is how templates for domjs can be written.

Plain `domjs` usage example:

```javascript
var domjs = require('domjs')(document);

var ns = domjs.ns;
var dom = domjs.collect(function () {
	ns.header(
    ns.h1('Heading'),
    ns.h2('Subheading'));

  ns.nav(
    ns.ul({ 'class': 'breadcrumbs' },
      ns.li(a({ href: '/' }, 'Home')),
      ns.li(a({ href: '/section/'}, 'Section')),
      ns.li(a('Subject'))));

  ns.article(
    ns.p('Lorem ipsum...'));

  ns.footer('Footer stuff');
});

document.body.appendChild(dom); // Insert generated DOM into document body
```

To use domjs functions literally as in first example, you will need to prepare dedicated function wrapper
(either programmatically or manually) as e.g. following:

```javascript
var myTemplate = (function () {}
  var { article, footer, h1, h2, header, li, nav, p, ul } = ns;
  return function () {
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
}());
var dom = domjs.collect(myTemplate);
```

### Other notes

You can save references to elements and operate on them later:

```javascript
var myul = ul(li('one'), li('two'), li('three'));

// ... some code ...

// add extra items to myul
myul(li('four'), li('five'));

// append myul into other element
div(myul);
```

You can access DOM elements directly, just invoke returned function with no
arguments

```javascript
(myul() instanceof DOMElement) === true
```

Comment type nodes:

```javascript
comment('my comment');
```

CDATA type nodes

```javascript
cdata('cdata text');
```

Text nodes in main scope:

```javascript
text('my text');
```

Elements with names that are reserved keywords in JavaScript language, like
'var', should be created with preceding underscore added to its name:

```javascript
_var('var content');
```

## Tests [![Build Status](https://secure.travis-ci.org/medikoo/domjs.png?branch=master)](https://secure.travis-ci.org/medikoo/domjs)

	$ npm test
