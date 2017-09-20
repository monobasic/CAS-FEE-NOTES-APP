/*
  Grab Gulp packages
*/
var gulp  = require('gulp'),
  util = require('gulp-util'),
  plumber = require('gulp-plumber'),
  notify = require("gulp-notify"),
  less = require('gulp-less'),
  sass = require('gulp-sass'),
  watch = require('gulp-watch'),
  browserSync = require('browser-sync').create(),
  php = require('gulp-connect-php'),
  rsync = require('gulp-rsync'),
  replace = require('gulp-replace'),
  rename = require('gulp-rename'),
  sourcemaps = require("gulp-sourcemaps"),
  babel = require("gulp-babel"),
  concat = require("gulp-concat"),
  uglify = require('gulp-uglify'),
  minifyCss = require('gulp-minify-css'),
  htmlreplace = require('gulp-html-replace'),
  exec = require('child_process').exec,
  execSync = require('child_process').execSync,
  autoprefixer = require('gulp-autoprefixer'),
  runSequence = require('run-sequence'),
  clean = require('gulp-clean'),
  fs = require('fs'),
  path = require('path'),
  prompt = require('gulp-prompt');


var env = {
  dev: {
    user: 'andreabt',
    host: 's005.cyon.net',
    // this path MUST end with a trailing slash
    path: '/home/andreabt/public_html/test/',
  },
  // prod: {
  //   user: 'andreabt',
  //   host: 's005.cyon.net',
  //   path: '/home/andreabt/public_html/myprojectname/',
  //   prompt: true,
  // },
};


/*
  Configuration Options
*/
var config = {
  // General
  'basePath': './',     // Base path (relative from gulpfile.js)
  'srcPath': './src/',    // Src path (relative from gulpfile.js)
  'distPath': './dist/',     // Dist path (relative from gulpfile.js)
  'serverPath': './dist/', // Server path for local PHP on-demand server (relative from gulpfile.js)

  // HTML (notice: name of the PHP/HTML file without suffix)
  'htmlFiles': [
    'index',
    'demo',
    'ui_basic_page',
    'ui_components',
    'ui_design_pattern',
    'ui_landing_page'
  ],

  // JS
  'jsFiles': [
    'bower_components/eventEmitter/EventEmitter.js',
    'bower_components/jquery/dist/jquery.js',
    'bower_components/jquery.easing/jquery.easing.js',
    'bower_components/bootstrap/dist/js/bootstrap.js',
    'bower_components/Anzeixer/dist/anzeixer.js',
    'bower_components/svg-injector/svg-injector.js',
    'bower_components/selectize/dist/js/standalone/selectize.js',
    'bower_components/slick-carousel/slick/slick.js',
    'bower_components/equalizer/js/jquery.equalizer.js',
    'src/js/app.js',
    'src/js/anzeixer_module.js',
    'src/js/bootstrap_init.js',
    'src/js/equalizer.js',
    'src/js/fullscreen_jumbo.js',
    'src/js/live_search.js',
    'src/js/responsive_images.js',
    'src/js/responsive_tables.js',
    'src/js/selectize.js',
    //'src/js/sidebar_scrollspy.js',
    'src/js/slick_carousel.js',
    'src/js/smooth_scroll_anchors.js',
    'src/js/section_images.js',
    'src/js/svg_injector.js'
  ],
  'jsDistPath': 'dist/js/',
  'jsDistPathKirby': 'kirby/assets/js/',
  'jsDistFileName': 'all.js',
  'jsDistFileNameMin': 'all.min.js',

  // Export
  'exportPath': '/Users/monobasic/Sites/CanBeAnotherFolderOutsideProject/',

  // LESS
  'lessSrcFiles': 'src/less/styles.less',

  // SASS/SCSS
  'scssSrcFilesBootstrap4': 'src/scss/bootstrap4/styles.scss',
  'scssSrcFilesFoundation': 'src/scss/foundation/styles.scss',
  'scssSrcFilesVanilla': 'src/scss/vanilla/styles.scss',

  // CSS (notice: order is important here)
  'cssPath': 'src/css/',
  'cssFiles': [
    'src/css/styles.css'
  ],
  'cssDistPath': 'dist/css/',
  'cssDistPathKirby': 'kirby/assets/css/',
  'cssDistFileName': 'styles.css',
  'cssDistFileNameMin': 'styles.min.css',

    // Files
  'filesSrcPath': 'src/scss/bootstrap4/**/*',
  'filesDistPath': 'dist/scss/',

  // Fonts
  'fontsSrcPath': 'src/fonts/**/*',
  'fontsDistPath': 'dist/fonts/',
  'fontsDistPathKirby': 'kirby/assets/fonts/',

  // Images
  'imagesSrcPath' : 'src/images/**/*',
  'imagesDistPath': 'dist/images/',
  'imagesDistPathKirby': 'kirby/assets/images/',

  // Clean
  'cleanStuff': [
    'dist'
  ],

  'deployment': {
    paths: {
      webroot: 'dist/',
      webrootKirby: 'kirby/',
      content: 'kirby/content/',
      accounts: 'kirby/site/accounts/',
    },
    plainRsyncOptions: {
      'r': true, // recursive
      'd': true, // transfer directories without recursing
      't': true, // preserve modification times
      'z': true, // compression
      delete: false,
      progress: true,
      exclude: [
        '.DS_Store',
        '.git',
        '.gitignore',
        '.gitmodules',
      ]
    },
    gulpRsyncOptions: {
      progress: true,
      recursive: true,
      clean: true,
      emptyDirectories: true,
      times: true,
      compress: true,
      exclude: [
        '.DS_Store',
        '.git',
        '.gitignore',
        '.gitmodules',
        'content/',
        'site/accounts/',
        'site/cache/',
        'thumbs'
      ]
    },
  },
}


/*
  Custom Error Logging
*/
function logError(error) {
  notify.onError({
        title:    "Gulp Error",
        message:  "<%= error.message %>"
    })(error);

  this.emit('end'); // emit the end event, to properly end the task
}

/**
 * Executes an rsync job with the given configuration and calls the
 * callback function when done.
 */
function rsyncJob(jobConfig, callback) {
  // using gulp-rsync internals here to avoid even more dependencies
  var log = require('gulp-rsync/log'),
      rsync = require('gulp-rsync/rsync'),
      handler = function(data) {
        data.toString().split('\r').forEach(function(chunk) {
          chunk.split('\n').forEach(function(line, j, lines) {
            log('rsync:', line, (j < lines.length - 1 ? '\n' : ''));
          });
        });
      };

  // default options for rsync
  var job = rsync({
    options: Object.assign({}, config.deployment.plainRsyncOptions, {
      delete: jobConfig.clean,
    }),
    source: jobConfig.source,
    destination: jobConfig.destination,
    stdoutHandler: handler,
    stderrHandler: handler,
  });

  job.execute(callback);
}

/**
 * Helper function to create tasks within JS loops. It binds the given data
 * to the task function closure.
 */
function loopTask(name, data, task) {
  gulp.task(name, (callback) => task(data, callback));
}

/**
 * Helper function to make paths relative to the declared deployment webroot
 */
function pathFromWebroot(origPath) {
  return path.relative((config.deployment.paths.webroot), origPath) + '/';
}


/*
  Gulp Tasks
*/

// Local Server Stuff
gulp.task('php', function() {
    return php.server({
      base: config.serverPath,
      port: 8010,
      keepalive: true
    });
});

gulp.task('browser-sync',['php'], function() {
    return browserSync.init({
    logLevel: 'info',
        proxy: '127.0.0.1:8010',
        port: 3000,
        open: true,
        notify: true // browser popover notifications
    });
});

gulp.task("export", ['build'], function () {
  return gulp.src([
      config.distPath + '**/*',
      //'!' + config.distPath + '/wcs.dksh.com{,/**}',
      //'!' + config.distPath + '/www.dksh.com{,/**}'
    ])
    .pipe(plumber({errorHandler: logError}))
      .pipe(gulp.dest(config.exportPath))
});

gulp.task('sass', function() {
  gulp.src(config.scssSrcFilesVanilla)
    .pipe(plumber({errorHandler: logError}))
    .pipe(sass())
    .pipe(gulp.dest(config.cssPath))
});

gulp.task("images", function() {
  return gulp.src(config.imagesSrcPath)
    .pipe(plumber({errorHandler: logError}))
    .pipe(gulp.dest(config.imagesDistPath))
    .pipe(gulp.dest(config.imagesDistPathKirby))
});

gulp.task('html', function() {
  if (!fs.existsSync(config.distPath)){
      fs.mkdirSync(config.distPath);
  }

  for (var i=0; i<config.htmlFiles.length; i++) {
    execSync('php ' + config.srcPath + config.htmlFiles[i] +'.php > dist/' + config.htmlFiles[i] + '.html');
  }

  // Files need some time to be written, this is a workaround...
  browserSync.reload()
});

gulp.task('clean', function() {
  return gulp.src(config.cleanStuff, {read: false})
  .pipe(plumber({errorHandler: logError}))
  .pipe(clean({
    force: true
  }));
});

gulp.task('kirby', function() {
  // Files need some time to be written, this is a workaround...
  setTimeout(function() {
    browserSync.reload()
  }, 500);
});

gulp.task("files", function() {
  gulp.src(config.filesSrcPath)
    .pipe(plumber({errorHandler: logError}))
    .pipe(gulp.dest(config.filesDistPath))
});

gulp.task("fonts", function() {
  return gulp.src([
      config.fontsSrcPath,
      'bower_components/bootstrap/fonts/*.*',
      'bower_components/font-awesome/fonts/*.*',
    ])
    .pipe(plumber({errorHandler: logError}))
    .pipe(gulp.dest(config.fontsDistPath))
    .pipe(gulp.dest(config.fontsDistPathKirby))
});

gulp.task("js", function () {
  return gulp.src(config.jsFiles)
    .pipe(plumber({errorHandler: logError}))
      //.pipe(babel())
      .pipe(concat(config.jsDistFileName))
      .pipe(gulp.dest(config.jsDistPath))
      .pipe(gulp.dest(config.jsDistPathKirby))
      .pipe(sourcemaps.init())
      .pipe(uglify({
        compress: {
          drop_console: false
        }
      }))
      .pipe(rename(config.jsDistFileNameMin))
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest(config.jsDistPath))
      .pipe(gulp.dest(config.jsDistPathKirby))
      .pipe(browserSync.stream({match: '**/*.js'}))
});

gulp.task("css", function () {
  return gulp.src(config.cssFiles)
    .pipe(plumber({errorHandler: logError}))
      .pipe(concat(config.cssDistFileName))
      .pipe(autoprefixer({
       browsers: ['last 3 versions'],
      }))
      .pipe(gulp.dest(config.cssDistPath))
      .pipe(sourcemaps.init())
      .pipe(minifyCss())
      .pipe(rename(config.cssDistFileNameMin))
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest(config.cssDistPath))
      .pipe(gulp.dest(config.cssDistPathKirby))
      .pipe(browserSync.stream({match: '**/*.css'}))
});

gulp.task('watch', ['browser-sync'], function () {
    gulp.watch([
      config.srcPath + 'less/*.less'
    ], ['less']);

    gulp.watch([
      config.srcPath + 'scss/bootstrap4/**/*.scss',
    ], ['sass-bootstrap4']);

    gulp.watch([
      config.srcPath + 'scss/foundation/**/*.scss'
    ], ['sass-foundation']);


    gulp.watch([
      config.srcPath + 'scss/vanilla/**/*.scss'
    ], ['sass-vanilla']);

    gulp.watch([
      config.srcPath + 'css/*.css'
    ], ['css']);

    gulp.watch([
      config.srcPath + 'js/*.js'
    ], ['js']);

    gulp.watch([
      config.srcPath + 'images/**/*'
    ], ['images']);

    gulp.watch([
      config.srcPath + '*.php',
      config.srcPath + 'includes/**/*.php'
    ], ['html']);

    gulp.watch([
      config.basePath + 'kirby/site/**/*'
    ], ['kirby']);
});

gulp.task('default', function(callback) {
    runSequence('build', 'watch', callback);
});

gulp.task('build', function(callback) {
    runSequence('clean', ['html', 'images', 'thumbs', 'fonts', 'less', 'js'], 'css', callback);
});


/**
 * Dynamically defines deployment tasks for each environment found in the 'env' variable.
 */
for (var target in env) {

  loopTask(['deploy', target].join(':'), env[target], (target, callback) => {
    var opts = Object.assign({}, config.deployment.gulpRsyncOptions, {
      root: config.deployment.paths.webroot,
      hostname: target.host,
      username: target.user,
      destination: target.path,
    });

    return gulp.src(config.distPath + '.')
      .pipe(target.prompt ? prompt.confirm('You are about to deploy to the PRODUCTION server. Are you sure?') : util.noop())
      .pipe(plumber({errorHandler: logError}))
      .pipe(rsync(opts));
  });

}
