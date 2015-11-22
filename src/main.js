(function () {
    'use strict';

    window['atMedia'] = atMedia || new AtMedia();

    function AtMedia() {

        /*========================================================================
         PRIVATE VARIABLES
         ========================================================================*/

        var _settings = {
            element:null,
            breakpoints:["default", "xs", "sm", "md", "lg"]
        };

        var service,
            body            =       document.querySelector('body'),
            onChangeQueue   =       [];

        /*========================================================================
         PUBLIC METHODS
         ========================================================================*/
        this.create = init;
        this.remove = remove;

        /*========================================================================
         LISTENERS / OBSERVERS / INIT
         ========================================================================*/

        var onResize;

        /*========================================================================
         PRIVATE METHODS
         ========================================================================*/

        function init(settings){

            for(var prop in settings){
                _settings[prop] = prop;
            }

            if (!_settings.element) {
                _settings.element = document.querySelector("[data-breakpoints]");
                if(!_settings.element){
                    _settings.element = document.createElement('div');
                    _settings.element.setAttribute('data-breakpoints', '');
                    body.appendChild(_settings.element);
                }
            }

            onViewportChange();

            onResize = new onViewportChange;
            window.addEventListener('resize', onResize);

            service = this;

            this.closestInRange         =       closestInRange;
            this.current                =       findCurrent();
            this.currentLargerThan      =       currentLargerThan;
            this.subscribe              =       subscribe;
        }

        function remove(){
            window.removeEventListener('resize', onResize);
            service         = null;
            onChangeQueue   = [];
        }

        function onViewportChange(){
            if (findCurrent() !== service.current) {
                service.current = findCurrent();
                notify();
            }
        }

        function subscribe (fn){
            onChangeQueue.push(fn);
        }

        function notify(){
            var l = onChangeQueue.length;

            while(l--){
                onChangeQueue[l](service.current);
            }
        }

        function closestInRange(sizes) {
            var current = findCurrent(),
                found;

            if (sizes[current]) {
                found = current;
            } else {
                var index = _settings.breakpoints.indexOf(current);

                checkForBp : while(index--){
                    for (var size in sizes) {
                        if (size === _settings.breakpoints[index]) {
                            found = size;
                            break checkForBp;
                        }
                    }
                }
            }
            return found || "default";
        }

        function currentLargerThan(bp) {
            var idx = _settings.breakpoints.indexOf(findCurrent()) + 1;

            while (idx--) {
                if (bp === _settings.breakpoints[idx]) {
                    return true;
                }
            }
            return false;
        }

        function findCurrent() {
            return (window.getComputedStyle(_settings.element[0], ':after').getPropertyValue('content').replace(/'|"/g, '') || "default");
        }

    }
})();