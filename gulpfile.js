'use strict';

var gulp            =       require('gulp'),
    del             =       require('del'),
    sourcemaps      =       require('gulp-sourcemaps'),
    uglify          =       require('gulp-uglify'),
    concat          =       require('gulp-concat'),
    Config          =       require('./gulpfile.config');

var bundle          =       require('./package.json'),
    config          =       new Config(bundle);

/*========================================================================
    TASKS
 ========================================================================*/
gulp.task("default",['js'], build);
gulp.task("js", compileJavascript);

/*========================================================================
    FUNCTIONS
 ========================================================================*/
function build(){

}

function compileJavascript(){
    return gulp.src(config.javascript)
        .pipe(concat(bundle.name))
        .pipe(gulp.dest(config.dist));
}

function compileSCSS(){

}

function compileLESS(){

}
