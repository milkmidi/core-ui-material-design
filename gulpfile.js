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
// const ejs = require("gulp-ejs");
const pug = require('gulp-pug');

gulp.paths = {
  dist: 'dist',
};

var paths = gulp.paths;

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function () {
  browserSync.init({
    server: "./dist",
    open: false
  });

  gulp.watch('src/scss/**/*.scss', ['sass']);
  // gulp.watch('src/html/*.ejs' , ['html']);
  gulp.watch('src/html/**/*.pug' , ['html']);
  // gulp.watch('src/**/*.html').on('change', browserSync.reload);
  gulp.watch('src/js/**/*.js',['js']);

});


gulp.task('sass', function () {
  return gulp.src('src/scss/style.scss')
    .pipe(gulpPlumber())
    .pipe(rename({
      basename: "core-ui-custom",
      suffix: '.min'
    }))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
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

gulp.task('css', function () {
  return gulp.src('src/css/**/*')
    .pipe(gulp.dest('./dist/css'))
    .on('end',()=>{
      browserSync.reload();
    })
});

gulp.task('img', function () {
  return gulp.src('src/img/**/*')
    .pipe(gulp.dest('./dist/img'))
    .on('end',()=>{
      browserSync.reload();
    })
});

gulp.task('fonts', function () {
  return gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('./dist/fonts'))
    .on('end',()=>{
      browserSync.reload();
    })
});

gulp.task('js', function () {
  return gulp.src('src/js/**/*')
    .pipe(gulp.dest('./dist/js'))
    .on('end',()=>{
      browserSync.reload();
    })
});

gulp.task('html', function (){
  const SOURCE = [
    'src/html/**/*.pug',
    '!*src/html/**/_*.pug',
    '!*src/html/include/*.pug',
    '!*src/html/component/*.pug',
  ];
  const config = {
    pretty: true
  };
  return gulp.src(SOURCE)
    .pipe(pug(config).on('error', console.log))
    .pipe(gulp.dest('./dist'))
    .on('end',()=>{
      browserSync.reload();
    })
});
/* gulp.task('html', function (){
  let data = {};
  let options = {};
  let settings = {
      ext: '.html'
  };
  return gulp.src('src/html/*.ejs')
    .pipe(ejs(data, options, settings).on('error', console.log))
    .pipe(gulp.dest('./dist'))
    .on('end',()=>{
      browserSync.reload();
    })
}); */


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

gulp.task('vendor', () => {
  const VENDOR_ARR = [
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/popper.js/index.js',
    'bower_components/bootstrap/dist/js/bootstrap.min.js',
    'bower_components/pace/pace.min.js',
    'bower_components/chart.js/dist/Chart.min.js',
  ];
  return gulp.src(VENDOR_ARR)
        .pipe(concat('vender.js', { newLine: ';\n\n' }))
        .pipe(gulp.dest('dist/js'));
});


// gulp.task

const defaultTasks = ['html', 'css', 'js', 'fonts', 'sass', 'img'];

gulp.task('p', (cb)=> runSequence.apply(null ,['clean:dist',...defaultTasks, ()=> cb()] ));

gulp.task('d', (cb)=> runSequence.apply(null ,[ ...defaultTasks ,()=> cb()]  ));
gulp.task('default', ['d','serve']);