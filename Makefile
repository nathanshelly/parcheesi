all:
	tsc -p .

.PHONY: clean test tar

clean:
	rm -rf out/

test:
	npm test

tar:
	tar -czvf submission.tgz Makefile src/ test/ package.json tsconfig.json
