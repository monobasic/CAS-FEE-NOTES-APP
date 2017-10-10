'use strict';

/*
* Dependencies
*/
import fs from 'fs';
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import babel from 'gulp-babel';
import sass from 'gulp-sass';
import watch from 'gulp-watch';
import browserSync from 'browser-sync';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import cleanCSS from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import runSequence from 'run-sequence';
import clean from 'gulp-clean';
import hb from 'gulp-hb';
import webpack from 'webpack-stream';
import jasmine from 'gulp-jasmine';

/*
* Configuration Options
*/
const config = {
  // General
  'projectTitle': 'CAS-FEE-NOTES-APP',
  'basePath': './',     // Base path (relative from gulpfile.babel.js)
  'srcPath': './src/',    // Src path (relative from gulpfile.babel.js)
  'distPath': './dist/',     // Dist path (relative from gulpfile.babel.js)
  'serverPath': './dist/', // Server path for local on-demand server (relative from gulpfile.babel.js)

  // JS
  'jsFiles': [
    'src/js/app.js',
  ],
  'jsDistPath': 'dist/js/',
  'jsDistFileName': 'all.js',
  'jsDistFileNameMin': 'all.min.js',

  // SASS/SCSS/CSS
  'themes': fs.readdirSync('src/scss/themes'),
  "themesPath": 'src/scss/themes/',
  "scssSrc": 'styles.scss',
  'cssDistPath': 'dist/css/',
  'cssDistFileName': 'styles.css',
  'cssDistFileNameMin': 'styles.min.css',

  // Partials
  "partialsSrc": 'src/*.html',
  "partials": './src/partials/**/*.hbs',

  // Templates
  "templatesSrc": './src/templates/**/*.hbs',

  // Files
  "filesSrc": ['src/.htpasswd', 'src/.htaccess', 'src/templates/**'],
  'filesDistPath': 'dist/',

  // Fonts
  'fontsSrcPath': [
    './node_modules/font-awesome/fonts/*.*'
  ],
  'fontsDistPath': 'dist/fonts/',

  // Images
  "imagesSrc" : 'src/images/**/*',
  'imagesDistPath': 'dist/images/',

  // Clean
  'cleanStuff': [
    'dist'
  ],

  // Jasmine Testing
  'specs': 'spec/**/*[sS]pec.js'
};

/*
* Custom Error Logging
*/
function logError(error) {
  notify.onError({
    title:    "Gulp Error",
    message:  "<%= error.message %>"
  })(error);

  this.emit('end'); // emit the end event, to properly end the task
}


/*
* Gulp Tasks
*/
gulp.task('browser-sync', () => {
  return browserSync.init({
    logLevel: 'info',
    open: true,
    notify: true, // browser popover notifications
    server: {
      baseDir: config.serverPath
    }
  });
});

gulp.task('sass', () => {
  config.themes.map((theme) => {
    let themeDistPath = config.cssDistPath + '/' + theme;

    gulp.src(config.themesPath + theme + '/' + config.scssSrc)
      .pipe(plumber({errorHandler: logError}))
      .pipe(sass())
      .pipe(autoprefixer({
        browsers: ['last 3 versions'],
      }))
      .pipe(gulp.dest(themeDistPath)) // Write out un-minified version of the CSS
      .pipe(sourcemaps.init())
      .pipe(cleanCSS())
      .pipe(rename(config.cssDistFileNameMin))
      .pipe(sourcemaps.write(".")) // Write out sourcemap files for browser debugging
      .pipe(gulp.dest(themeDistPath)) // Write out minified version of the CSS
      .pipe(browserSync.stream({match: '**/*.css'}));
  });
});

gulp.task("images", () => {
  return gulp.src(config.imagesSrc)
    .pipe(plumber({errorHandler: logError}))
    .pipe(gulp.dest(config.imagesDistPath));
});

gulp.task('clean', () => {
  return gulp.src(config.cleanStuff, {read: false})
    .pipe(plumber({errorHandler: logError}))
    .pipe(clean({
      force: true
    }));
});

gulp.task("files", () => {
  gulp.src(config.filesSrc, { base: './src/' })
    .pipe(plumber({errorHandler: logError}))
    .pipe(gulp.dest(config.filesDistPath));
});

gulp.task("fonts", function() {
  return gulp.src(config.fontsSrcPath)
    .pipe(plumber({errorHandler: logError}))
    .pipe(gulp.dest(config.fontsDistPath));
});

gulp.task("partials", function() {
  gulp.src(config.partialsSrc)
    .pipe(plumber({errorHandler: logError}))
    .pipe(hb({
      partials: config.partials,
      data: config.partialsData,
      helpers: {
        ifvalue: function (conditional, options) {
          if (conditional == options.hash.equals) {
            return options.fn(this);
          } else {
            return options.inverse(this);
          }
        }
      }
    }))
    .pipe(gulp.dest("./dist"));
});

gulp.task("js", () => {
  return gulp.src(config.jsFiles)
    .pipe(plumber({errorHandler: logError}))
    .pipe(webpack({
      // Any configuration options...
    }))
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(concat(config.jsDistFileName))
    .pipe(gulp.dest(config.jsDistPath))
    .pipe(sourcemaps.init())
    .pipe(uglify({
      compress: {
        drop_console: false
      }
    }))
    .pipe(rename(config.jsDistFileNameMin))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(config.jsDistPath))
    .pipe(browserSync.stream({match: '**/*.js'}));
});

gulp.task('test', () =>
  gulp.src(config.specs)
    .pipe(plumber({errorHandler: logError}))
    .pipe(jasmine({
      verbose: true
    }))
);

gulp.task('watch', ['browser-sync'], () => {
  gulp.watch([
    config.srcPath + 'scss/**/*.scss',
  ], ['sass']);

  gulp.watch([
    config.srcPath + 'js/**/*.js'
  ], ['js']);

  gulp.watch([
    config.srcPath + 'images/**/*'
  ], ['images']);

  gulp.watch([
    config.partialsSrc + '**/*.{html,hbs}'
  ], ['partials']).on('change', () => {
    setTimeout(browserSync.reload, 1000);
  });

  gulp.watch([
    config.templatesSrc
  ], ['files']).on('change', () => {
    setTimeout(browserSync.reload, 1000);
  });
});


/*
* Build Tasks
*/
gulp.task('default', (callback) => runSequence('build', 'watch', callback));
gulp.task('build', (callback) => runSequence('clean', ['partials', 'files', 'fonts', 'images', 'sass', 'js'], callback));

