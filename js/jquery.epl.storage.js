/*jslint white: true, undef: true, newcap: true, nomen: true, regexp: true, plusplus: true, bitwise: true, maxerr: 50, indent: 4 */

/* jquery plugin: EuroPython lib, offline / cached store of day schedule information. 

This module needs json2.js loaded before it. The storage is based around a JSON encoded/decode
list of stored days. I call this the cache. A cache object is stored and has the following 
structure

    cache = [
        {"day_id":"< day string id >", "schedule": schedule object},
        :
        etc
    ]

This is not a very efficient approach. However for the first version it will do.

Oisin Mulvihill
2011-03-20

*/

(function ($) {

    $.epl = $.epl || {};

    function debug_log(msg) { if ($.epl.log) { $.epl.log(msg); } }

    var DATA_KEY = "jquery.epl.storage.cache";

    function is_present(day_id) { 
        /*Check if we are storing some javascript schedule object for the given string
        identifier.
        
        :param day_id: This is a string like 'day1'.
        
        :returns: true if day_id is stored, false otherwise.
        
        */
        return false;
    }
    
    function all() {
        /*Return a list of all stored day schedules.
                
        :returns: a list of schedule objects or [] if
        nothing is present.
        
        */
        var stored = []
        
        if (DATA_KEY in localStorage) {
            // There is some data stored, recover it.
            var cache = localStorage[DATA_KEY];
            console.log("all: cache  "+cache);
            cache = JSON.parse(cache);
            
            $(cache).each(function (i, day) {
                stored.push(day.schedule);
                console.log("all: pushed entry: "+i);
            });
        
        } else {
            // Initial set up store an empty list
            localStorage[DATA_KEY] = JSON.stringify([]);
        }
        
        return stored;
    }
    
    function clear() { 
        /*Remove all stored data from the system.
        */
        localStorage[DATA_KEY] = JSON.stringify([]);
    }
    
    function save_day(day_id, schedule) {
        /*Store a day schedule under the given id. 
        
        This will be added or over-written.
        */
        if (DATA_KEY in localStorage) {
            var found = false;
            var index = null;
            
            // There is some data stored, recover it.
            var cache = localStorage[DATA_KEY];
            cache = JSON.parse(cache);

            // Scan the store looking for the given day_id and its position/order in the list:
            $(cache).each(function (i, day) {
                if (day_id == day.day_id) {
                    found = true;
                    index = i;
                }
            });
            
            if (found) {
                // Update the schedule object at this position:
                cache[index] = schedule;
            }
            else {
                // Add the new day to the end:
                cache.push({
                    "day_id": day_id, 
                    "schedule": schedule
                });
            }

            // Update the localStorage data by dumping the current cache back to JSON.
            localStorage[DATA_KEY] = JSON.stringify(cache);
        
        } else {
            // Initial set up: store with the new item as the initial entry:
            var cache = [{
                "day_id": day_id, 
                "schedule": schedule
            }];

            localStorage[DATA_KEY] = JSON.stringify(cache);
        }
    }
    
    // $.epl.storage.<...>
    $.extend($.epl, {
        "storage": {
            "is_present": is_present,
            "clear": clear,
            "all": all,
            "save_day": save_day
        }
    });

})(jQuery);

