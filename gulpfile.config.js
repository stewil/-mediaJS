'use strict';

var GulpConfig = (function(){
    function GulpConfig(){
        this.source = './src/';
        this.dist   = './dist/';
        this.javascript = [
            this.source + 'main.js',
            this.source + 'js/*.js'
        ];
        this.html = [
            this.source + "index.html"
        ];
        this.scss = [
            this.source + "*.scss",
            this.source + "scss/*.scss"
        ];
    }
    return GulpConfig;
})();
module.exports = GulpConfig;
