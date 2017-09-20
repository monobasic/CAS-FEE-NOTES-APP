'use strict';

/*
  Grab Gulp packages
*/
const gulp  = require('gulp'),
  util = require('gulp-util'),
  plumber = require('gulp-plumber'),
  notify = require('gulp-notify'),
  babel = require('gulp-babel'),
  sass = require('gulp-sass'),
  watch = require('gulp-watch'),
  browserSync = require('browser-sync').create(),
  rsync = require('gulp-rsync'),
  rename = require('gulp-rename'),
  sourcemaps = require('gulp-sourcemaps'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  minifyCss = require('gulp-minify-css'),
  exec = require('child_process').exec,
  execSync = require('child_process').execSync,
  autoprefixer = require('gulp-autoprefixer'),
  runSequence = require('run-sequence'),
  clean = require('gulp-clean'),
  fs = require('fs'),
  path = require('path'),
  prompt = require('gulp-prompt'),
  mustache = require("gulp-mustache"),
  mockServer = require('gulp-mock-server'),
  ftp = require('vinyl-ftp');


const env = {
  dev: {
    user: 'andreabt',
    host: 's005.cyon.net',
    // this path MUST end with a trailing slash
    path: '/home/andreabt/public_html/notes-ap/',
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
const config = {
  // General
  'projectTitle': 'CAS-FEE-NOTES-APP',
  'basePath': './',     // Base path (relative from gulpfile.js)
  'srcPath': './src/',    // Src path (relative from gulpfile.js)
  'distPath': './dist/',     // Dist path (relative from gulpfile.js)
  'serverPath': './dist/', // Server path for local on-demand server (relative from gulpfile.js)

  // JS
  'jsFiles': [
    'node_modules/jquery/dist/jquery.js',
    'src/js/app.js',
  ],
  'jsDistPath': 'dist/js/',
  'jsDistFileName': 'all.js',
  'jsDistFileNameMin': 'all.min.js',

  // Export
  'exportPath': '/Users/monobasic/Sites/CanBeAnotherFolderOutsideProject/',

  // SASS/SCSS
  'scssSrcFiles': 'src/scss/styles.scss',

  // CSS (notice: order is important here)
  'cssPath': 'src/css/',
  'cssFiles': [
    'src/css/styles.css'
  ],
  'cssDistPath': 'dist/css/',
  'cssDistFileName': 'styles.css',
  'cssDistFileNameMin': 'styles.min.css',

  // Templates
  'templatesSrcPath': 'src/**/*.mustache',
  'templatesImagePath': 'images/',
  'templatesPages': [
    {
      pageTitle: 'Home',
      pageUrl: 'index.html'
    },
  ],

  // Files
  'filesSrcPath': ['src/.htpasswd', 'src/.htaccess', 'src/data/**'],
  'filesDistPath': 'dist/',

  // Images
  'imagesSrcPath' : 'src/images/**/*',
  'imagesDistPath': 'dist/images/',

  // Clean
  'cleanStuff': [
    'dist'
  ],

  'deployment': {
    paths: {
      webroot: 'dist/',
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
        '*.idea'
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
        '*.idea'
      ]
    },
  },

  'deploymentFtp': {
    'host': 'ftp.example.ch',
    'user': 'ftp@example.ch',
    'password': 'showme',
    'parallel': 10,
  }
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

gulp.task('deploy-ftp', function () {
  var conn = ftp.create({
    host: config.deploymentFtp.host,
    user: config.deploymentFtp.user,
    password: config.deploymentFtp.password,
    parallel: config.deploymentFtp.parallel,
    log: util.log
  });

  // using base = '.' will transfer everything to /public_html correctly
  // turn off buffering in gulp.src for best performance
  return gulp.src( config.distPath + '/**', { base: './dist', buffer: false })
  //.pipe( conn.newer( '/public_html' ) ) // only upload newer files
    .pipe( conn.dest('./'));
});


/*
  Gulp Tasks
*/

gulp.task('browser-sync', function() {
  return browserSync.init({
    logLevel: 'info',
    open: true,
    notify: true, // browser popover notifications
    server: {
      baseDir: config.serverPath
    }
  });
});

gulp.task('mock', function() {
  gulp.src('.')
    .pipe(mockServer({
      port: 8090,
      mockDir: './dist/data',
      allowCrossOrigin: true
    }));
});

gulp.task("export", ['build'], function () {
  return gulp.src([
    config.distPath + '**/*',
    // Add exludes like this:
    //'!' + config.distPath + '/foldername{,/**}',
  ])
    .pipe(plumber({errorHandler: logError}))
    .pipe(gulp.dest(config.exportPath))
});

gulp.task('sass', function() {
  gulp.src(config.scssSrcFiles)
    .pipe(plumber({errorHandler: logError}))
    .pipe(sass())
    .pipe(gulp.dest(config.cssPath))
});

gulp.task("images", function() {
  return gulp.src(config.imagesSrcPath)
    .pipe(plumber({errorHandler: logError}))
    .pipe(gulp.dest(config.imagesDistPath))
});

gulp.task('clean', function() {
  return gulp.src(config.cleanStuff, {read: false})
    .pipe(plumber({errorHandler: logError}))
    .pipe(clean({
      force: true
    }));
});

gulp.task("files", function() {
  gulp.src(config.filesSrcPath, { base: './src/' })
    .pipe(plumber({errorHandler: logError}))
    .pipe(gulp.dest(config.filesDistPath))
});

gulp.task("templates", function() {
  gulp.src(config.templatesSrcPath)
    .pipe(plumber({errorHandler: logError}))
    .pipe(mustache({
      imagePath: config.templatesImagePath,
      projectTitle: config.projectTitle,
      pages: config.templatesPages
    }, {
      extension: '.html'
    }))
    .pipe(gulp.dest("./dist"));
});

gulp.task("js", function () {
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
    .pipe(browserSync.stream({match: '**/*.css'}))
});

gulp.task('watch', ['browser-sync'], function () {
  gulp.watch([
    config.srcPath + 'scss/**/*.scss',
  ], ['sass']);

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
    config.srcPath + '**/*.mustache'
  ], ['templates']).on('change', function() {
    setTimeout(browserSync.reload, 1000);
  });;
});

gulp.task('default', function(callback) {
  runSequence('build', 'watch', callback);
});

gulp.task('build', function(callback) {
  runSequence('clean', ['templates', 'files', 'images', 'sass', 'js'], 'css', 'mock', callback);
});


/**
 * Dynamically defines deployment tasks for each environment found in the 'env' variable.
 */
for (var target in env) {

  loopTask(['deploy', target].join(':'), env[target], (target, callback) => {
    var opts = Object.assign({}, config.deployment.gulpRsyncOptions, {
      root: (config.deployment.paths.webroot),
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
