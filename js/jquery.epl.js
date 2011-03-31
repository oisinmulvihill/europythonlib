/*jslint white: true, undef: true, newcap: true, nomen: true, regexp: true, plusplus: true, bitwise: true, maxerr: 50, indent: 4 */

/* jquery plugin: EuroPython lib, handy common utils and top level epl namespace init. */

(function ($) {

    $.epl = $.epl || {};

    function debug_logger(msg) { 
        if (window.debug_output) {
            // Running unit tests / qunit-settings.js:debug_output is present.
            window.debug_output(msg);
        }
    }

    $.extend($.epl, {
        "log": debug_logger
    });

})(jQuery);
