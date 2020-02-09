const { src, dest, series, task, watch } = require('gulp');

// Plugins

const css_scss =        require('gulp-sass');
const css_clean =       require('gulp-clean-css');
const css_ap =          require('gulp-autoprefixer');

const js_uglify =       require('gulp-uglify');
const js_babel =        require('gulp-babel');

const rename =          require('gulp-rename');
const rimraf =          require('rimraf');

//
// Styles
//

task('styles-global', () =>
{
    return src('site/_styles/global.scss')
        .pipe(css_scss())
        .pipe(css_clean())
        .pipe(css_ap())
        .pipe(rename('global.min.css'))
        .pipe(dest('out'));
});

task('styles-pages', () =>
{
    return src('site/_styles/pages/**/*.scss')
        .pipe(css_scss())
        .pipe(css_clean())
        .pipe(css_ap())
        .pipe(rename( function (path) { path.extname = '.min.css'; } ))
        .pipe(dest('out/styles'));
});

//
// Scripts
//

task('scripts', () => 
{
    return src('site/_scripts/**/*.js')
        .pipe(js_babel( { presets: ['@babel/preset-env'] } ))
        .pipe(js_uglify())
        .pipe(rename( function (path) { path.extname = '.min.js'; } ))
        .pipe(dest('out/scripts'));
});

//
// Files
//

task('move-files', () =>
{
    return src(
        [
            'site/**/*',
            '!site/**/_*/',
            '!site/**/_*/**/*',
            '!site/**/_*'
        ], { nodir: true }
    ).pipe(dest('out'));
});

//
// Engine
//

task('build-pages', (done) =>
{
    let build = require('./engine/build');

    build.buildAll();

    done();
});

task('build-rest', (done) =>
{
    // Generate with Mustache

    // sitemap
    // robots
    // ...

    done();
});

//
// Misc
//

task('clear', (done) => 
{
    rimraf.sync('out/*');
    done();
});

//
// General
//

task('watch', () =>
{
    watch([
        'site/**/*',
        'books/**/*'
    ], series('build'));
});

task('build', (done) =>
{
    series(
        'clear',
        'styles-global',
        'styles-pages',
        'build-pages',
        'build-rest',
        'move-files',
        'scripts'
    )();

    done();
});