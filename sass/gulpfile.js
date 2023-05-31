const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const imagemin = require('gulp-imagemin');

const purgecss = require('gulp-purgecss');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

const browserSync = require('browser-sync').create();
//exporting src js file to dist js file
gulp.task("folder", function(){
    return gulp.src("src/js/script.js").pipe(gulp.dest("dist/js"))
})

//exporting images from src to dist --imagemin
exports.default = () => (
    gulp.src('src/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
);

//scss to css
gulp.task('compileSass', function () {
    return gulp.src('src/scss/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/css'));
});

// watch
gulp.task('watch', function () {
    gulp.watch('src/scss/style.scss', gulp.series('compileSass'));
});


// remove unused CSS
gulp.task('css', function () {
    return gulp.src('dist/css/**/*.css')
      .pipe(purgecss({
        content: ['src/**/*.html', 'src/**/*.js'],
        safelist: [/^swiper-/, /^aos-/] // Add any classes or patterns you want to keep here
      }))
      .pipe(gulp.dest('dist/css'));
  });
 

// Clear the dist folder
gulp.task('clean', function () {
  return del('dist');
});


// Concatenate and minify JS files
gulp.task('js', function () {
  return gulp.src('src/js/**/*.js')
    .pipe(concat('scripts.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

// Development task
gulp.task('dev', function () {
// Start the server
  browserSync.init({
    server: './'
  });
//Watch for changes in JS and SCSS files
  gulp.watch('src/js/**/*.js', gulp.series('folder'));
  gulp.watch('src/scss/**/*.scss', gulp.series('compileSass'));

// Reload the HTML page
  gulp.watch('index.html').on('change', browserSync.reload);
});

// Building task
gulp.task('build', gulp.series( 'css','compileSass', 'js', 'folder', 'dev'));


// Clean the dist folder
gulp.task('clean', function () {
  return gulp.src('dist', { read: false, allowEmpty: true })
    .pipe(clean());
});

// Copy HTML file to the dist folder
gulp.task('copyHtml', function () {
  return gulp.src('index.html')
    .pipe(gulp.dest('dist'));
});
