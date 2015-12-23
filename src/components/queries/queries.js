(function(){
    module.exports = evaluation;

    function evaluation(_settings){
        return {
            closestInRange      :closestInRange,
            currentLargerThan   :currentLargerThan,
            findCurrent         :findCurrent
        };

        function findCurrent() {
            if(_settings.element){
                return (window.getComputedStyle(_settings.element, ':after').getPropertyValue('content').replace(/'|"/g, '') || "default");
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
    }
})();