'use strict';

var gulp            =   require('gulp'),
    watch           =   require('gulp-watch'),
    sass            =   require('gulp-sass'),
    sourcemaps      =   require('gulp-sourcemaps'),
    rename          =   require('gulp-rename'),
    uglify          =   require('gulp-uglify'),
    del             =   require('del'),
    bump            =   require('gulp-bump'),
    ifElse          =   require('gulp-if-else'),
    runSequence     =   require('run-sequence'),
    source          =   require('vinyl-source-stream'),
    browserify      =   require('browserify'),
    browserSync     =   require('browser-sync').create(),
    argv            =   require('yargs').argv,
    Config          =   require('./gulpfile.config');

var packageJson     =   require('./package.json'),
    config          =   new Config(packageJson);

/*========================================================================
    TASKS
 ========================================================================*/

//  BUILD
//-----------------------------------------------------------------------
gulp.task('debug', bundleDebug);
gulp.task('build', bundleBuild);
gulp.task('watch', ['debug'], serve);
gulp.task("bumpPackage", bumpPackage);

//  JAVASCRIPT
//-----------------------------------------------------------------------
gulp.task("debugJS", debugJS);
gulp.task("buildJS", buildJS);
gulp.task('reloadJS', ['debugJS'], reloadBrowser);

//  SASS
//-----------------------------------------------------------------------
gulp.task("buildSASS", buildSASS);
gulp.task("debugSASS", debugSASS);
gulp.task('reloadSASS', ['debugSASS'], reloadBrowser);

//  HTML
//-----------------------------------------------------------------------
gulp.task("debugHTML", debugHTML);
gulp.task("buildHTML", buildHTML);
gulp.task('reloadHTML', ['debugHTML'], reloadBrowser);

/*========================================================================
    FUNCTIONS
 ========================================================================*/

function bundle(dir, taskPrefix){
    return clearDistFiles(dir, function(){
        runSequence([
            taskPrefix + 'JS',
            taskPrefix + 'SASS',
            taskPrefix + 'HTML']);
    })
}

function bundleBuild(){
    return bundle(config.dist, 'build')
}
function bundleDebug(){
    return bundle(config.debug, 'debug')
}

function copyHtml(dir){
    return gulp.src(config.html)
        .pipe(gulp.dest(dir));
}

function buildHTML(){
    return copyHtml(config.dist);
}
function debugHTML(){
    return copyHtml(config.debug);
}

function compileJS(dir) {

    var jsBundle = browserify(config.application).bundle();

    return jsBundle
        .pipe(source(config.application))
        .pipe(rename(packageJson.name + '-v' + packageJson.version + '.js'))
        .pipe(gulp.dest(dir + 'js/'));
}

function debugJS(){
    return compileJS(config.debug);
}
function buildJS(){
    return compileJS(config.dist);
}

function compileSASS(dir) {
    return gulp.src(config.scss)
        .pipe(sass())
        .pipe(gulp.dest(dir + 'css'));
}

function buildSASS(){
    return compileSASS(config.dist);
}

function debugSASS(){
    return compileSASS(config.debug);
}

function bumpPackage(){
    return gulp.src('./package.json')
        .pipe(bump({type:(function(){
            if(argv.major){
                return 'major';
            }
            if(argv.minor){
                return 'minor';
            }
            if(argv.patch){
                return 'patch';
            }
        })()}))
        .pipe(gulp.dest(config.dist));
}

function serve(){
    if (browserSync != null) {
        browserSync.init({
            server: config.debug
        });
    }else{
        console.warn("Browser sync not available in your environment.");
    }
    gulp.watch(config.scss,       ['reloadSASS']);
    gulp.watch(config.html,       ['reloadHTML']);
    gulp.watch(config.javascript, ['reloadJS']);
}

function reloadBrowser(){
    if (browserSync != null) {
        browserSync.reload();
    }
}

function clearDistFiles(dir, fn){
    return del(dir + '/*').then(function() {
        if (fn) {
            fn();
        }
    });
}
