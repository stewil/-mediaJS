'use strict';

var gulp            =   require('gulp'),
    watch           =   require('gulp-watch'),
    sass            =   require('gulp-sass'),
    sourcemaps      =   require('gulp-sourcemaps'),
    concat          =   require('gulp-concat'),
    uglify          =   require('gulp-uglify'),
    del             =   require('del'),
    Config          =   require('./gulpfile.config');

var bundle          =       require('./package.json'),
    config          =       new Config(bundle),
    names = {
        "js":"atMedia"
    };

/*========================================================================
    TASKS
 ========================================================================*/
gulp.task("default",["js", "scss", "html"]);
gulp.task("watch", ["default"], watchSrc);
gulp.task("js", compileJS);
gulp.task("scss", compileSCSS);
gulp.task("html", copyHtml);

/*========================================================================
    FUNCTIONS
 ========================================================================*/

function copyHtml(){
    return gulp.src(config.html)
        .pipe(gulp.dest(config.dist));
}

function compileJS() {
    return gulp.src(config.javascript)
        .pipe(sourcemaps.init())
        .pipe(concat(names.js + '.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.dist + 'js/'));
}

function compileSCSS() {
    return gulp.src(config.scss)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.dist + 'css'));
}

function watchSrc(){
    watch(config.scss, compileSCSS);
    watch(config.javascript, compileJS);
    watch(config.html, copyHtml);
}

