.PHONY: all clean test tar cover

all:
	tsc -p .

clean:
	rm -rf out/ coverage/ .nyc_output/

test: all
	npm test

cover: all
	npm run cover

tar:
	tar -cvf submission.tgz Makefile README.md parcheesi/ src/ test/ package.json tsconfig.json

player_server:
	ts-node src/server/PlayerServer.ts
