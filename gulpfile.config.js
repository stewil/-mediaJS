'use strict';

var GulpConfig = (function(){
    function GulpConfig(){
        this.source = './src/';
        this.dist   = './dist';
        this.javascript = [
            this.source + 'main.js',
            this.source + 'components/*.js'
        ];
    }
    return GulpConfig;
})();
module.exports = GulpConfig;
