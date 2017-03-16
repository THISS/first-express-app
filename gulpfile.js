/********* npm-exec gulp | alias to see alias' ********/


// Dependencies
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const notify = require('gulp-notify');
const livereload = require('gulp-livereload');
const watch = require('gulp-watch');

// Task
gulp.task('default', function() {
	
		// listen for changes
	livereload({start:true});
	// configure nodemon
	let nmon = nodemon({
		// the script to run the app
		script: 'express-server.js',
		ext: 'js'
		// legacyWatch: true
	}).on('restart', function(){
		// log when the app has restarted
		console.log("Server is restarting...");
	});
	gulp.watch(['views/**/*.ejs'], () => {
		// force a reload
		livereload.reload();
		// console.log("livereload reload triggered");
	});
	gulp.watch(['express-server.js', 'gulpfile.js'], () => {
		// Restart the server with nodemon
		nmon.emit('restart');
		livereload.reload('express-server.js');
		// console.log('livereload reload server');
	});
	
	
})