(function () {
    'use strict';

    window['atMedia'] = new AtMedia();

    function AtMedia() {

        /*========================================================================
            PRIVATE VARIABLES
         ========================================================================*/

        var _settings = {
            element     :   null,
            breakpoints :   ["default", "xs", "sm", "md", "lg"],
            debounce    :   50,
            debug       :   false
        };

        var service,
            body            =   document.querySelector('body');
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
        var debounce    = require('./components/debounce/debounce.js'),
            queries     = require('./components/queries/queries.js')(_settings),
            onChange    = require('./components/on-change/on-change.js')(_settings, queries.findCurrent, debounce);

        function create(settings){
            service = this;

            for(var prop in settings){
                _settings[prop] = prop;
            }

            if (!_settings.element || document.contains(_settings.element)) {
                createBreakpointElement();
            }

            this.closestInRange    = queries.closestInRange;
            this.current           = queries.findCurrent();
            this.currentLargerThan = queries.currentLargerThan;
            this.onChange          = onChange.subscribe;
            this.remove            = remove;

        }

        function remove(){
            onChange.destroy();
            service         = null;
        }

        function createBreakpointElement(){
            _settings.element = document.querySelector("[data-breakpoints]");
            if(!_settings.element){
                _settings.element = document.createElement('div');
                _settings.element.setAttribute('data-breakpoints', '');
                body.appendChild(_settings.element);
            }
        }

    }
})();