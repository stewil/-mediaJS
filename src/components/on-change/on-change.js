(function(){
    module.exports = onChange;

    function onChange(_settings, findCurrent, debounce){

        var onChangeQueue   = [],
            onResize        = debounce(onViewportChange, _settings['debounce']),
            cachedCurrent;

        window.addEventListener('resize', onResize);

        return {
            subscribe   :subscribe,
            destroy     :destroy
        };

        function onViewportChange(){
            if (findCurrent() !== cachedCurrent) {
                cachedCurrent = findCurrent();
                notify();
            }
        }

        /**
         * Executes all stored subscribers
         */
        function notify(){
            var l       = onChangeQueue.length,
                current = findCurrent();

            while(l--){
                try{
                    onChangeQueue[l](current);
                }catch(err){
                    onChangeQueue.splice(l, 1);
                }
            }
        }

        function destroy(){
            window.removeEventListener('resize', onResize);
            onChangeQueue   = [];
        }

        /**
         * Accepts a Function to be executed on breakpoint change
         * @param fn
         * @returns {Subscriber}
         */
        function subscribe (fn){

            var current = findCurrent();
            onChangeQueue.push(fn);
            fn(current);

            return function(fn){
                this.remove = function(){
                    if(onChangeQueue.indexOf(fn) > -1){
                        onChangeQueue.splice(onChangeQueue.indexOf(fn), 1);
                    }
                }
            }
        }
    }

})();