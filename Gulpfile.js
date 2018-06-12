var gulp = require('gulp')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var babel= require('gulp-babel')
var sourcmaps = require('gulp-sourcemaps')
var imagemin = require('gulp-imagemin')
var pngquant = require('imagemin-pngquant')



gulp.task('default', function() {
	//Asagıdakı kod : Eger sass dosyanın içerisinde herhangi bir .scss uzantılı dosyada degisiklik olursa. styles taskini çalıştır.
	
	gulp.watch('js/**/*.js', ['lint'])
	gulp.watch('/index.js', ['copy-html'])
	
})
