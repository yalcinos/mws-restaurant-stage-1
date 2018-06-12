var gulp = require('gulp')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var babel= require('gulp-babel')
var imagemin = require('gulp-imagemin')
var jpgtran = require('imagemin-jpegtran')
var uglifyEs = require('gulp-uglify-es').default;


gulp.task('default',['scripts-dist','scripts-dist-rest-info'], function() {

	console.log('Success!');
})
gulp.task('scripts-dist',function(){
	gulp.src(['js/dbhelper.js','js/idb.js','js/main.js'])
		.pipe(concat('mainpage.min.js'))
		.pipe(uglifyEs())
		.pipe(gulp.dest('dist/js'))
})

gulp.task('scripts-dist-rest-info',function(){
	gulp.src(['js/dbhelper.js','js/restaurant_info.js'])
		.pipe(concat('rest-page.min.js'))
		.pipe(uglifyEs())
		.pipe(gulp.dest('dist/js'))
})
gulp.task('crunch-images', function() {
	return gulp.src('images/**/*.jpg')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/img'))
})