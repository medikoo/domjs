SHELL = bash

install:
	npm install

test:
	npm test

test-cov:
	./node_modules/expresso/bin/expresso -c -q test/setup.js test/index.js

.PHONY: install test
