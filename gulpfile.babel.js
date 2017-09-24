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
import minifyCss from 'gulp-minify-css';
import autoprefixer from 'gulp-autoprefixer';
import runSequence from 'run-sequence';
import clean from 'gulp-clean';
import hb from 'gulp-hb';

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
    'node_modules/jquery/dist/jquery.js',
    'src/js/app.js',
    'src/js/style-switch.js'
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

  // Templates
  "templatesSrc": 'src/*.html',
  "templatesPartials": './src/partials/**/*.hbs',
  "templatesData": './src/data/**/*.{js,json}',

  // Files
  "filesSrc": ['src/.htpasswd', 'src/.htaccess', 'src/data/**'],
  'filesDistPath': 'dist/',

  // Images
  "imagesSrc" : 'src/images/**/*',
  'imagesDistPath': 'dist/images/',

  // Clean
  'cleanStuff': [
    'dist'
  ]
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
      .pipe(minifyCss())
      .pipe(rename(config.cssDistFileNameMin))
      .pipe(sourcemaps.write(".")) // Write out sourcemap files for browser debugging
      .pipe(gulp.dest(themeDistPath)) // Write out minified version of the CSS
      .pipe(browserSync.stream({match: '**/*.css'}))
  });
});

gulp.task("images", () => {
  return gulp.src(config.imagesSrc)
    .pipe(plumber({errorHandler: logError}))
    .pipe(gulp.dest(config.imagesDistPath))
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
    .pipe(gulp.dest(config.filesDistPath))
});

gulp.task("templates", function() {
  gulp.src(config.templatesSrc)
    .pipe(plumber({errorHandler: logError}))
    .pipe(hb({
      partials: config.templatesPartials,
      data: config.templatesData,
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
    .pipe(concat(config.jsDistFileName))
    .pipe(babel({
      presets: ['env']
    }))
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
    .pipe(browserSync.stream({match: '**/*.js'}))
});

gulp.task('watch', ['browser-sync'], () => {
  gulp.watch([
    config.srcPath + 'scss/**/*.scss',
  ], ['sass']);

  gulp.watch([
    config.srcPath + 'js/*.js'
  ], ['js']);

  gulp.watch([
    config.srcPath + 'images/**/*'
  ], ['images']);

  gulp.watch([
    config.srcPath + '**/*.{html,hbs}'
  ], ['templates']).on('change', () => {
    setTimeout(browserSync.reload, 1000);
  });
});


/*
* Build Tasks
*/
gulp.task('default', (callback) => runSequence('build', 'watch', callback));
gulp.task('build', (callback) => runSequence('clean', ['templates', 'files', 'images', 'sass', 'js'], callback));

