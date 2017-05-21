.PHONY: all clean test tar cover

all: clean
	tsc -p .

clean:
	rm -rf out/ coverage/ .nyc_output/

test: all
	npm test

cover: all
	npm run cover

tar:
	tar -cvf submission.tgz Makefile README.md src/ test/ package.json tsconfig.json

game_server:
	ts-node src/server/GameServer.ts

player_server:
	ts-node src/server/PlayerServer.ts
