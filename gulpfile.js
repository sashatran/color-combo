var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

gulp.task('styles', function(){
	gulp.src('./scss/*.scss')
	.pipe(sass())
	.pipe(gulp.dest('./dist'))
	.pipe(browserSync.reload({stream:true}));
});

gulp.task('scripts', function(){
	gulp.src('./js/*.js').
	pipe(gulp.dest('./dist'));
})

gulp.task('serve', function(){
	browserSync.init({
		server: {
			baseDir: './dist'
		}
	});

	gulp.watch('./scss/*.scss', ['styles']);
	gulp.watch('./js/*.js', ['scripts']);
	gulp.watch('./**/*.html').on('change',browserSync.reload);
	gulp.watch('./**/*.js').on('change',browserSync.reload);
});

gulp.task('default', ['styles','scripts','serve']);

gulp.task('deploy', ['styles','scripts']);