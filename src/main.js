(function () {
    'use strict';

    window['atMedia'] = new AtMedia();


    function AtMedia() {

        /*========================================================================
            PRIVATE VARIABLES
         ========================================================================*/

        var _settings = {
            element:null,
            breakpoints:["default", "xs", "sm", "md", "lg"],
            debug:false
        };

        var service,
            body            =   document.querySelector('body'),
            onChangeQueue   =   [];

        /*========================================================================
            PUBLIC METHODS
         ========================================================================*/
        this.create = create;

        /*========================================================================
            LISTENERS / OBSERVERS / INIT
         ========================================================================*/

        /*========================================================================
            PRIVATE METHODS
        ========================================================================*/

        function create(settings){

            service = this;

            for(var prop in settings){
                _settings[prop] = prop;
            }

            if (!_settings.element || document.contains(_settings.element)) {
                createBreakpointElement();
            }

            onViewportChange();

            window.addEventListener('resize', onViewportChange);

            this.closestInRange         =       closestInRange;
            this.current                =       findCurrent();
            this.currentLargerThan      =       currentLargerThan;
            this.onChange               =       subscribe;
            this.remove                 =       remove;

            function createBreakpointElement(){
                _settings.element = document.querySelector("[data-breakpoints]");
                if(!_settings.element){
                    _settings.element = document.createElement('div');
                    _settings.element.setAttribute('data-breakpoints', '');
                    body.appendChild(_settings.element);
                }
            }
        }

        function remove(){
            window.removeEventListener('resize', onViewportChange);
            service         = null;
            onChangeQueue   = [];
        }

        function onViewportChange(){
            if (findCurrent() !== service.current) {
                service.current = findCurrent();
                notify();
            }
        }

        /**
         * Accepts a Function to be executed on breakpoint change
         * @param fn
         * @returns {Subscriber}
         */
        function subscribe (fn){
            onChangeQueue.push(fn);

            return new Subscriber(fn);

            function Subscriber(fn){
                this.remove = function(){
                    if(onChangeQueue.indexOf(fn) > -1){
                        onChangeQueue.splice(onChangeQueue.indexOf(fn), 1);
                    }
                }
            }
        }

        /**
         * Executes all stored subribers
         */
        function notify(){
            var l = onChangeQueue.length;

            while(l--){
                try{
                    onChangeQueue[l](service.current);
                }catch(err){
                    onChangeQueue.splice(l, 1);
                }
            }
        }

        /**
         * Returns the breakpoint to match the current breakpoint in a range
         * @param sizes
         * @returns {*|string}
         */
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

        /**
         * Returns true/false if the current breakpoint is larger the value supplied
         * @param bp
         * @returns {boolean}
         */
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
            return (window.getComputedStyle(_settings.element, ':after').getPropertyValue('content').replace(/'|"/g, '') || "default");
        }

    }
})();