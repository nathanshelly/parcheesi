.PHONY: all clean test tar cover

all:
	tsc -p .

clean:
	rm -rf out/ coverage/ .nyc_output/

test:
	npm test

cover:
	npm run cover

tar:
	tar -cvf submission.tgz Makefile src/ test/ package.json tsconfig.json
