/* settings and utils for unit tests */

window.debug_output = function(msg) {
    if (window.console && window.console.log)
    {
        window.console.log(msg);
    }
};


QUnit.log = function(result)
{
    var msg = "actual '" + result.actual + "' expected '" + result.expected + "'";
    
    if (result.message) {
        msg += " message '" + result.message + "'";
    }

    window.debug_output(msg);
};
