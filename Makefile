.PHONY: all clean test tar cover

all:
	tsc -p .

clean:
	rm -rf out/ coverage/ .nyc_output/

test: clean all
	npm test

cover: clean all
	npm run cover

tar:
	tar -cvf submission.tgz Makefile src/ test/ package.json tsconfig.json

server: clean all
	ts-node src/server/server.ts
