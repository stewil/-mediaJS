(function () {
    'use strict';

    window['atMedia'] = atMedia || new AtMedia();

    function AtMedia() {

        /*========================================================================
            PRIVATE VARIABLES
        ========================================================================*/
        var service         =       this,
            body            =       document.querySelector('body'),
            element         =       document.querySelector("[data-breakpoints]"),
            breakpoints     =       ["default", "xs", "sm", "md", "lg"],
            onChangeQueue   =       [];

        if (!element) {
            element = document.createElement('div');
            element.setAttribute('data-breakpoints', '');
            body.appendChild(element);
        }
        /*========================================================================
            PUBLIC METHODS
        ========================================================================*/
        this.closestInRange         =       closestInRange;
        this.current                =       findCurrent();
        this.currentLargerThan      =       currentLargerThan;
        this.subscribe              =       subscribe;

        /*========================================================================
            LISTENERS / OBSERVERS / INIT
        ========================================================================*/

        window.addEventListener('load', onViewportChange);
        window.addEventListener('resize', onViewportChange);

        /*========================================================================
            PRIVATE METHODS
        ========================================================================*/

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
                var index = breakpoints.indexOf(current);

                checkForBp : while(index--){
                    for (var size in sizes) {
                        if (size === breakpoints[index]) {
                            found = size;
                            break checkForBp;
                        }
                    }
                }
            }
            return found || "default";
        }

        function currentLargerThan(bp) {
            var idx = breakpoints.indexOf(findCurrent()) + 1;

            while (idx--) {
                if (bp === breakpoints[idx]) {
                    return true;
                }
            }
            return false;
        }

        function findCurrent() {
            return (window.getComputedStyle(element[0], ':after').getPropertyValue('content').replace(/'|"/g, '') || "default");
        }

        return service;
    }
})();
