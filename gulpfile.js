// Dependencies
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const notify = require('gulp-notify');
const livereload = require('gulp-livereload');
const watch = require('gulp-watch');

// Task
gulp.task('default', function() {
	
		// listen for changes
	livereload.listen();
	// configure nodemon
	let nmon = nodemon({
		// the script to run the app
		script: 'express-server.js',
		ext: 'js'
		// legacyWatch: true
	}).on('restart', function(){
		// when the app has restarted, run livereload.
		gulp.src('express-server.js')
		.pipe(livereload());
		console.log("Server is restarting...");
	});
	gulp.watch(['/views/**/*', 'express-server.js'], () => {
		// force a restart
		nmon.emit('restart');
	});
	
	
})