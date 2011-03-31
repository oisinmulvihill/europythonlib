/*jslint white: true, undef: true, newcap: true, nomen: true, regexp: true, plusplus: true, bitwise: true, maxerr: 50, indent: 4 */

/* jquery plugin: EuroPython lib, XML to Schedule converter and utility functions. */

(function ($) {

    $.epl = $.epl || {};

    function debug_log(msg) { if ($.epl.log) { $.epl.log(msg); } }


    function fetch(URL, ok_callback, error_callback, block) {
        /* Recover the XML day data from a location.
        
        If successful then ok_callback will be called with an XML Document.
        
        :param URL: local / remote address of the XML day data. The
        file recovered needs to be in the EuroPython day format.
        
        */

        // do a sychronous get if block = true (handy for tests).
        var async = true;
        if (block) {
            async = false;
        }
        
        function ok(response, textStatus, XMLHttpRequest) { 
            //debug_log("ok: received response from server '" + textStatus + "' looking at data.");
            try {
                ok_callback(response);
            } catch (e) {
                debug_log("Error fetching server response: " + e, true);
            }
        }
        
        function error(XMLHttpRequest, textStatus, errorThrown) { 
            debug_log('Error saving: check server.' + textStatus);
            if (error_callback) {
                error_callback();
            }
        }

        $.ajax({
            type: "GET",
            url: URL,
            dataType: "xml",
            success: ok,
            error: error,
            async: async
        });
    }


    function convert_to_talk(xml) {
        /*Recover a complete talk entry from talk xml node.
        
            Example xml node converted from text:
            
              <talk url="http://..."><speaker url="..." name="..." image="..."/>
                <abstract lang="it">...</abstract>
                <abstract lang="en">...</abstract>
              </talk>
        
            returned = {
                "url": " ..URL for more details.. ",
                "conference": "...",
                "speakers": [
                    {"name": "...", "image": "...", "url": "..."},
                    :
                    etc
                ],
                "abstract": {
                    "country code": " ..text.. "
                }
            }    
        */
        var talk = {"url": '', "conference": '', "speakers": [], "abstract": {}};
        
        if (!xml) {
            debug_log("convert_to_talk: No XML object given!");
            throw "No XML object given!";
        }
        
        talk.url = xml.url || '';
        talk.conference = xml.conference || '';

        talk.speakers = [];
        if (xml.speaker) {
            $.each(xml.speaker, function (i, speaker) {
                talk.speakers.push({
                    "name": speaker.name || '',
                    "image": speaker.image || '',
                    "url": speaker.url || ''
                });
            });
        }
        
        talk.abstract = {};
        if (xml.abstract) {
            $.each(xml.abstract, function (i, abstract) {
                talk.abstract[abstract.lang] = abstract.Text;
            });
        }
        
        return talk;
    }
    
    
    function convert_to_event(xml, start) {
        /*Recover a complete event object and all contained information.
        
            Example xml node converted from text:
            
                <event tracks="1" tags="imparare" duration="3" title="...">
                    <talk ... /talk>
                    :
                </event>
                
            start: This is the iso8601 time at which the event begins.
        
            returned = {
                "location": " ..?.. ",
                "start": " is08601 time recovered from our parent 'slot'.",
                "track": "1 | 2 | ...",
                "tags": " ..?.. ",
                "duration": "1 | 2 | ...",
                "title": " ... ",
                "talks": [ see convert_to_talk(...) ]
            }
        */
        var event = {
            "location": '', 
            "start": '', 
            "track": '', 
            "tags": '', 
            "duration": '', 
            "title": '', 
            "talks": []
        };
        
        if (!xml) {
            debug_log("convert_to_event: No XML object given!");
            throw "No XML object given!";
        }
        
        // work out where in real terms this item is actually on.
        event.location = 'unknown';
        event.start = start || '';
        event.track = xml.tracks || '';
        event.tags = xml.tags || '';
        // convert this to minutes somehow...
        event.duration = xml.duration || '';
        event.title = xml.title || '';
        
        // convert any contained talks.
        event.talks = [];
        if (xml.talk) {
            $.each(xml.talk, function (i, talk) {
                event.talks.push(convert_to_talk(talk));
            });
        }
        
        return event;
    }
    

    function convert(raw) {
        /* Given the XML day data, recover the day schedule object

        :returns: Schedule object in the form 
        
            rc = {
                "id": 'day1' | 'day2' | ... ,
                "slots": [
                    { ..slot.. },
                    :
                    etc
                ]
            }
        
            slot = {
                "start": "HH:MM:SS",
                "events": [ see convert_to_event() ]
            }
        
        */
        var xml = null, slot = null;
        
        var schedule = {
            "id": '', 
            "conference": '', 
            "slots": []
        };
        
        if (!raw) {
            debug_log("convert: No data given!");
            throw "No data given!";
        }
        
        if (typeof (raw) === 'string') {
            xml = $.textToXML(raw);
        } else {
            xml = raw;
        }
        
        xml = $.xmlToJSON(xml);

        if (!xml) {
            debug_log("convert: No XML parsed and recovered correctly!");
            throw "No XML parsed and recovered correctly!";
        }
        
        schedule.id = xml.id || '';
        schedule.conference = xml.conference || '';
        
        // convert any contained slots and their information.
        schedule.slots = [];
        if (xml.slot) {
            $.each(xml.slot, function (i, xml_slot) {
                // Recover the slot and contained events:
                slot = {"start": "", "events": []};
                slot.start = xml_slot.time || '';
                
                if (xml_slot.event) {
                    $.each(xml_slot.event, function (i, xml_event) {
                        slot.events.push(
                            convert_to_event(xml_event, slot.start)
                        );
                    });
                    
                    // Only bother add the slot if it contains events.
                    schedule.slots.push(slot);
                }
            });
        }
        
        return schedule;
    }
    
    // $.epl.schedule.<fetch | convert | etc>
    $.extend($.epl, {
        "schedule": {
            "fetch": fetch,
            "convert_to_talk": convert_to_talk,
            "convert_to_event": convert_to_event,
            "convert": convert 
        }
    });

})(jQuery);
