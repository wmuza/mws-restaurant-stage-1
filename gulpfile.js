// generated on <%= date %> using <%= name %> <%= version %>
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync').create();
const del = require('del');
const wiredep = require('wiredep').stream;
const runSequence = require('run-sequence');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

let dev = true;

gulp.task('styles', () => {<% if (includeSass) { %>
  return gulp.src('app/css/*.scss')
    .pipe($.plumber())
    .pipe($.if(dev, $.sourcemaps.init()))
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))<% } else { %>
  return gulp.src('app/css/*.css')
    .pipe($.if(dev, $.sourcemaps.init()))<% } %>
    .pipe($.postcss([
      autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']})
    ]))
    .pipe($.if(dev, $.sourcemaps.write()))
    .pipe(gulp.dest('.tmp/css'))
    .pipe(reload({stream: true}));
});

<% if (includeBabel) { -%>
gulp.task('scripts', () => {
  return gulp.src('app/js/**/*.js')
    .pipe($.plumber())
    .pipe($.if(dev, $.sourcemaps.init()))
    .pipe($.babel())
    .pipe($.if(dev, $.sourcemaps.write('.')))
    .pipe(gulp.dest('.tmp/js'))
    .pipe(reload({stream: true}));
});
<% } -%>

function lint(files) {
  return gulp.src(files)
    .pipe($.eslint({ fix: true }))
    .pipe(reload({stream: true, once: true}))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

gulp.task('lint', () => {
  return lint('app/js/**/*.js')
    .pipe(gulp.dest('app/js'));
});
gulp.task('lint:test', () => {
  return lint('test/spec/**/*.js')
    .pipe(gulp.dest('test/spec'));
});

<% if (includeBabel) { -%>
gulp.task('html', ['styles', 'scripts'], () => {
<% } else { -%>
gulp.task('html', ['styles'], () => {
<% } -%>
  return gulp.src('app/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.if(/\.js$/, $.uglify({compress: {drop_console: true}})))
    .pipe($.if(/\.css$/, $.postcss([cssnano({safe: true, autoprefixer: false})])))
    .pipe($.if(/\.html$/, $.htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: {compress: {drop_console: true}},
      processConditionalComments: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    })))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
  return gulp.src('app/img/**/*')
    .pipe($.cache($.imagemin()))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', () => {})
    .concat('app/fonts/**/*'))
    .pipe($.if(dev, gulp.dest('.tmp/fonts'), gulp.dest('dist/fonts')));
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', () => {
  runSequence(['clean', 'wiredep'], ['styles'<% if (includeBabel) { %>, 'scripts'<% } %>, 'fonts'], () => {
    browserSync.init({
      notify: false,
      port: 9000,
      server: {
        baseDir: ['.tmp', 'app'],
        routes: {
          '/bower_components': 'bower_components'
        }
      }
    });

    gulp.watch([
      'app/*.html',
<% if (!includeBabel) { -%>
      'app/js/**/*.js',
<% } -%>
      'app/img/**/*',
      '.tmp/fonts/**/*'
    ]).on('change', reload);

    gulp.watch('app/css/**/*.<%= includeSass ? 'scss' : 'css' %>', ['styles']);
<% if (includeBabel) { -%>
    gulp.watch('app/js/**/*.js', ['scripts']);
<% } -%>
    gulp.watch('app/fonts/**/*', ['fonts']);
    gulp.watch('bower.json', ['wiredep', 'fonts']);
  });
});

gulp.task('serve:dist', ['default'], () => {
  browserSync.init({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
  });
});

<% if (includeBabel) { -%>
gulp.task('serve:test', ['scripts'], () => {
<% } else { -%>
gulp.task('serve:test', () => {
<% } -%>
  browserSync.init({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
<% if (includeBabel) { -%>
        '/js': '.tmp/js',
<% } else { -%>
        '/js': 'app/js',
<% } -%>
        '/bower_components': 'bower_components'
      }
    }
  });

<% if (includeBabel) { -%>
  gulp.watch('app/js/**/*.js', ['scripts']);
<% } -%>
	gulp.watch(['app/*.html'], ['html', reload]);
    gulp.watch(['app/css/*.css'], ['html', reload]);
    gulp.watch(['app/js/*.js'], ['lint', 'html', reload]);
    gulp.watch(['app/sw.js'], ['lint', 'sw', reload]);

});

// inject bower components
gulp.task('wiredep', () => {<% if (includeSass) { %>
  gulp.src('app/css/*.scss')
    .pipe($.filter(file => file.stat && file.stat.size))
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/css'));
<% } %>
  gulp.src('app/*.html')
    .pipe(wiredep({<% if (includeBootstrap) { if (includeSass) { %>
      exclude: ['bootstrap<% if (legacyBootstrap) { %>-sass<% } %>'],<% } else { %>
      exclude: ['bootstrap.js'],<% }} %>
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('build', ['lint', 'html', 'images', 'fonts', 'extras'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', () => {
  return new Promise(resolve => {
    dev = false;
    runSequence(['clean', 'wiredep'], 'build', resolve);
  });
});