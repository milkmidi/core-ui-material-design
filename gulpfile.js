'use strict'

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const filter = require('gulp-filter');
const mainBowerFiles = require('main-bower-files');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const del = require('del');
const runSequence = require('run-sequence');
const replace = require('gulp-replace');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const gulpPlumber = require('gulp-plumber');

gulp.paths = {
  dist: 'dist',
};

var paths = gulp.paths;

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function () {
  browserSync.init({
    server: "./",
    open: false
  });

  gulp.watch('scss/**/*.scss', ['sass']);
  gulp.watch('**/*.html').on('change', browserSync.reload);
  gulp.watch('js/**/*.js').on('change', browserSync.reload);

});

// Static Server without watching scss files
gulp.task('serve:lite', function () {
  browserSync.init({
    server: "./"
  });
  gulp.watch('**/*.css').on('change', browserSync.reload);
  gulp.watch('**/*.html').on('change', browserSync.reload);
  gulp.watch('js/**/*.js').on('change', browserSync.reload);
});

gulp.task('sass', function () {
  return gulp.src('./scss/style.scss')
    .pipe(gulpPlumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(rename({
      basename: "core-ui-material",
      suffix: '.min'
    }))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream());
});

gulp.task('sass:watch', function () {
  gulp.watch('./scss/**/*.scss');
});

gulp.task('clean:dist', function () {
  return del(paths.dist);
});

gulp.task('copy:bower', function () {
  return gulp.src(mainBowerFiles(['**/*.js', '!**/*.min.js']))
    .pipe(gulp.dest(paths.dist + '/js/libs'))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.dist + '/js/libs'));
});

gulp.task('copy:css', function () {
  gulp.src('./css/**/*')
    .pipe(gulp.dest(paths.dist + '/css'));
});

gulp.task('copy:img', function () {
  return gulp.src('./img/**/*')
    .pipe(gulp.dest(paths.dist + '/img'));
});

gulp.task('copy:fonts', function () {
  return gulp.src('./fonts/**/*')
    .pipe(gulp.dest(paths.dist + '/fonts'));
});

gulp.task('copy:js', function () {
  return gulp.src('./js/**/*')
    .pipe(gulp.dest(paths.dist + '/js'));
});

gulp.task('copy:html', function () {
  return gulp.src('./**/*.html')
    .pipe(gulp.dest(paths.dist + '/'));
});

gulp.task('replace:bower', function () {
  return gulp.src([
      './dist/*.html',
      './dist/**/*.js',
    ], {
      base: './'
    })
    .pipe(replace(/bower_components+.+(\/[a-z0-9][^/]*\.[a-z0-9]+(\'|\"))/ig, 'js/libs$1'))
    .pipe(gulp.dest('./'));
});

gulp.task('p', function (callback) {
  runSequence('clean:dist', 'copy:bower', 'copy:css', 'copy:img', 'copy:fonts', 'copy:js', 'copy:html', 'replace:bower', callback);
});

gulp.task('default', ['serve']);