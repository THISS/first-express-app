// Dependencies
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const notify = require('gulp-notify');
const livereload = require('gulp-livereload');

// Task
gulp.task('default', function() {
	// listen for changes
	livereload.listen();
	// configure nodemon
	nodemon({
		// the script to run the app
		script: 'express-server.js',
		ext: 'js',
		// watch: [
		// 	"views/"
		// ],
		legacyWatch: true

	}).on('restart', function(){
		// when the app has restarted, run livereload.
		gulp.src('express-server.js')
			.pipe(livereload());
		console.log("Server is restarting...");
	})
})