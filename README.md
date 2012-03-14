# domjs - client and server side dom template engine

Build dom structure easy way with plain JavaScript. Can be used on both client
and server side.

## Instalation

### Node.js

In your project path:

	$ npm install domjs

### Browser

You can easily create browser bundle with help of [modules-webmake](https://github.com/medikoo/modules-webmake). Mind that it relies on some EcmaScript5 features, so for older browsers you need as well [es5-shim](https://github.com/kriskowal/es5-shim)

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

This is how templates for domjs are written.

To get `mytemplate` function content turned into DOM
(literally _DocumentFragment_):

```javascript
var domjs = require('domjs/lib/html5')(document);

var mydom = domjs.build(mytemplate);
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
_comment('my comment');
```

CDATA type nodes

```javascript
_cdata('cdata text');
```

Text nodes in main scope:

```javascript
_text('my text');
```

Elements with names that are reserved keywords in JavaScript language, like
'var', should be created with preceding underscore added to its name:

```javascript
_var('var content');
```

## Tests [![Build Status](https://secure.travis-ci.org/medikoo/domjs.png?branch=master)](https://secure.travis-ci.org/medikoo/domjs)

As `jsdom` won't install properly on Windows domjs can only be tested only on _*nix_ systems

	$ npm test
