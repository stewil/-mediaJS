'use strict';

var gulp            =   require('gulp'),
    watch           =   require('gulp-watch'),
    sass            =   require('gulp-sass'),
    sourcemaps      =   require('gulp-sourcemaps'),
    rename          =   require('gulp-rename'),
    uglify          =   require('gulp-uglify'),
    del             =   require('del'),
    fs              =   require('fs'),
    bump            =   require('gulp-bump'),
    ifElse          =   require('gulp-if-else'),
    runSequence     =   require('run-sequence'),
    streamify       =   require('gulp-streamify'),
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
gulp.task("bumpBowerPackage", bumpBowerPackage);

//  JAVASCRIPT
//-----------------------------------------------------------------------
gulp.task("debugJS", debugJS);
gulp.task("buildJS", buildJS);
gulp.task('reloadJS', ['debug'], reloadBrowser);

//  SASS
//-----------------------------------------------------------------------
gulp.task("buildSASS", buildSASS);
gulp.task("debugSASS", debugSASS);
gulp.task('reloadSASS', ['debug'], reloadBrowser);

//  HTML
//-----------------------------------------------------------------------
gulp.task("debugHTML", debugHTML);
gulp.task("buildHTML", buildHTML);
gulp.task('reloadHTML', ['debug'], reloadBrowser);

/*========================================================================
    FUNCTIONS
 ========================================================================*/

function bundle(dir, taskPrefix){

    var tasks = [],
        config;

    return clearDistFiles(dir, function() {
        if (taskPrefix === 'build') {
            tasks.push([
                'bumpPackage',
                'bumpBowerPackage'
            ]);
        }
        tasks.push([
            taskPrefix + 'JS',
            taskPrefix + 'SASS',
            taskPrefix + 'HTML'
        ]);
        config = fs.readFileSync('./package.json', 'utf-8');
        packageJson = JSON.parse(config);
        return runSequence.apply(null, tasks);
    });
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

    var jsBundle    = browserify(config.application).bundle(),
        jsFileName  = packageJson.name + '-v' + packageJson.version;

    return jsBundle
        .pipe(source(config.application))
        .pipe(streamify(sourcemaps.init()))
        .pipe(rename(jsFileName + '.js'))
        .pipe(gulp.dest(dir + 'js/'))
        .pipe(streamify(uglify()))
        .pipe(rename(jsFileName + '.min.js'))
        .pipe(streamify(sourcemaps.write('.')))
        .pipe(gulp.dest(dir + 'js/'));
}

function debugJS(){
    return compileJS(config.debug);
}
function buildJS(){
    return compileJS(config.dist);
}

function compileSASS(dir) {

    var cssFileName = packageJson.name + '-v' + packageJson.version;

    return gulp.src(config.scss)
        .pipe(sass())
        .pipe(rename(cssFileName + '.min.css'))
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
        .pipe(gulp.dest('./'));
}

function bumpBowerPackage(){
    return gulp.src('./bower.json')
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
        .pipe(gulp.dest('./'));
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
