var gulp = require('gulp'),
	 connect = require('gulp-connect');

gulp.task('reload', function() {
	return gulp.src('bin/**/*.js')
		.pipe(connect.reload());
})

gulp.task('host', function() {
	connect.server({
		root: 'bin',
		port: 8000,
		livereload: true
	});
});

gulp.task('watch', function() {
	gulp.watch('bin/**/*.js', ['reload']);
});

gulp.task('default', ['host', 'watch']);
