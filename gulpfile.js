// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-ruby-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var fs = require('fs');


var paths = {
  scripts: ['src/js/app.js','src/js/controllers.js','src/js/bindings.js','src/js/**/*.js'],
  styles: 'src/scss/**/*.scss',
  index: 'src/index.html',
  templates: 'src/templates/**/*.html'
};

gulp.task('index', function() {
  return gulp.src(paths.index)
    .pipe(replace(/<link href=[\'"]?(.*?)[\'"]?>/g, function(match, p1) {
      return fs.readFileSync(paths.templates + p1, 'utf8');
    }))
    .pipe(gulp.dest('dist/'))
});

// Lint Task
gulp.task('lint', function() {
  return gulp.src('src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Compile Our Sass

gulp.task('sass', function () {
  return sass('src/scss/')
    .on('error', function (err) {
    console.error('Error!', err.message);
  })
    .pipe(gulp.dest('dist/css'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(uglify())
    .pipe(concat('jqbound.js'))
    .pipe(gulp.dest('dist/js'))
});

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch(paths.index, ['index'])
  gulp.watch(paths.templates, ['index'])
  gulp.watch(paths.scripts, ['lint', 'scripts']);
  gulp.watch(paths.styles, ['sass']);
});

// Default Task
gulp.task('default', ['index','lint', 'sass', 'scripts', 'watch']);
