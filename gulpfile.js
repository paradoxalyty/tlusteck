const project_folder = 'dist';
const source_folder = '#src';


const fs = require('fs');

const path = {
  bootstrap: './node_modules/bootstrap/dist/**/*',

  build: {
    html: project_folder + '/',
    css: project_folder + '/css/',
    img: project_folder + '/img/',
    fonts: project_folder + '/fonts/',
    bootstrap: project_folder + '/vendor/bootstrap/',
  },

  src: {
    html: source_folder + '/*.html',
    css: source_folder + '/scss/style.scss',
    img: source_folder + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
    fonts: source_folder + '/fonts/*.ttf',
  },

  watch: {
    html: source_folder + '/**/*.html',
    css: source_folder + '/scss/**/*.scss',
    img: source_folder + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
  },

  clean: './' + project_folder + '/',
};

const { src, dest } = require('gulp'),
  gulp = require('gulp'),
  browsersync = require('browser-sync').create(),
  del = require('del'),
  sass = require('gulp-sass')(require('sass')),
  autoprefixer = require('gulp-autoprefixer');

function browserSync() {
  browsersync.init({
    server: {
      baseDir: './' + project_folder + '/',
    },
    port: 3000,
    notify: false,
  });
}

function html() {
  return src(path.src.html).pipe(dest(path.build.html)).pipe(browsersync.stream());
}

function css() {
  return src(path.src.css)
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 5 version'],
        cascade: true,
      })
    )
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
}

function img() {
  return src(path.src.img).pipe(dest(path.build.img)).pipe(browsersync.stream());
}

function fonts() {
  return src(path.src.fonts).pipe(dest(path.build.fonts));
}



function bootstrap() {
  return src(path.bootstrap)
    .pipe(dest(path.build.bootstrap));
}

function watchFiles() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.img], img);
}

function clean() {
  return del(path.clean);
}

const build = gulp.series(clean, gulp.parallel(html, css, img, fonts, bootstrap));
const watch = gulp.parallel(build, watchFiles, browserSync);

exports.html = html;
exports.css = css;
exports.img = img;
exports.fonts = fonts;
exports.bootstrap = bootstrap;
exports.build = build;
exports.watch = watch;
exports.default = watch;
