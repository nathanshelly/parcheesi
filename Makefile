.PHONY: all clean test tar

all:
	tsc -p .

clean:
	rm -rf out/

test:
	npm test

tar:
	tar -cvf submission.tgz Makefile src/ test/ package.json tsconfig.json
