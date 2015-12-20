'use strict';

var GulpConfig = (function(){
    function GulpConfig(){
        this.source  = './src/';
        this.debug   = './debug/';
        this.dist    = './dist/';
        this.application = this.source + 'main.js';
        this.javascript = [
            this.source + 'main.js',
            this.source + '**/*.js'
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
