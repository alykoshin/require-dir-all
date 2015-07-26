test:
	./node_modules/.bin/mocha --reporter spec
.PHONY: test

test-travis:
	./node_modules/istanbul/lib/cli.js cover ./node_modules/mocha/bin/_mocha -- -R spec ./test/*
.PHONY: test-travis
