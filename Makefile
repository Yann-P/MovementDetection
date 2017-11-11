all: compile uglify
	rm dist/movdet.js

compile:
	browserify -d src/main.js -o dist/movdet.js

uglify:
	uglifyjs dist/movdet.js -o dist/movdet.min.js # needs es6compatible release.

clean:
	rm dist/*.js