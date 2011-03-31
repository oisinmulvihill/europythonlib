/* testsuite.js check the xml2cal.js code base. Use the jquery qunit.js test framework. */

$(document).ready(function(){

    module("EuroPython XML calendar to JS conversion testing.");
    
    test("Test the talk xml to object conversion.", function() {
        var xml = '<talk url="http://abc"><speaker url="http://efg" name="A B" image="http://123.jpg"/><abstract lang="it">...</abstract></talk>';
        xml = $.xmlToJSON($.textToXML(xml));
        
        var rc = $.epl.schedule.convert_to_talk(xml);

        equals(rc.url, "http://abc");
        equals(rc.speakers.length, 1);
        equals(rc.speakers[0].url, 'http://efg');
        equals(rc.speakers[0].name, 'A B');
        equals(rc.speakers[0].image, 'http://123.jpg');
        equals(rc.abstract['it'], "...");
    })


    test("Test the conversion of xml to event objects.", function() {
        // start with a break event
        var xml = '<event tracks="3" tags="break" duration="3" title="Coffee break"/>';
        xml = $.xmlToJSON($.textToXML(xml));
        
        var rc = $.epl.schedule.convert_to_event(xml, "09:00:00");
        
        equals(rc.location, "unknown");
        equals(rc.start, "09:00:00");
        equals(rc.track, "3");
        equals(rc.tags, "break");
        equals(rc.duration, "3");
        equals(rc.title, "Coffee break");
        equals(rc.talks.length, 0);

        // test coversion of string directly is ok:
        var xml = '<event tracks="3" tags="break" duration="3" title="Coffee break"/>';
        var rc = $.epl.schedule.convert_to_event(xml, "09:00:00");
        equals(rc.location, "unknown");
        equals(rc.start, "09:00:00");

        
        // now try with a non break event:
        var talk = '<talk url="http://abc"><speaker url="http://efg" name="A B" image="http://123.jpg"/><abstract lang="it">...</abstract></talk>';
        xml = '<event tracks="1" tags="hall1" duration="2" title="About PyPirates">' + talk + "</event>";
        
        xml = $.xmlToJSON($.textToXML(xml));
        
        rc = $.epl.schedule.convert_to_event(xml, "12:30:00");
        
        equals(rc.location, "unknown");
        equals(rc.start, "12:30:00");
        equals(rc.track, "1");
        equals(rc.tags, "hall1");
        equals(rc.duration, "2");
        equals(rc.title, "About PyPirates");
        equals(rc.talks.length, 1);
        
        rc = rc.talks[0];
        
        equals(rc.url, "http://abc");
        equals(rc.speakers.length, 1);
        equals(rc.speakers[0].url, 'http://efg');
        equals(rc.speakers[0].name, 'A B');
        equals(rc.speakers[0].image, 'http://123.jpg');
        equals(rc.abstract['it'], "...");
       
    })

    
    test("Test the conversion of xml to event objects.", function() {
        // start with a break event
        var xml = '<event tracks="3" tags="break" duration="3" title="Coffee break"/>';
        xml = $.xmlToJSON($.textToXML(xml));
        
        var rc = $.epl.schedule.convert_to_event(xml, "09:00:00");
        
        equals(rc.location, "unknown");
        equals(rc.start, "09:00:00");
        equals(rc.track, "3");
        equals(rc.tags, "break");
        equals(rc.duration, "3");
        equals(rc.title, "Coffee break");
        equals(rc.talks.length, 0);
        
        // now try with a non break event:
        var talk = '<talk url="http://abc"><speaker url="http://efg" name="A B" image="http://123.jpg"/><abstract lang="it">...</abstract></talk>';
        xml = '<event tracks="1" tags="hall1" duration="2" title="About PyPirates">' + talk + "</event>";
        
        xml = $.xmlToJSON($.textToXML(xml));
        
        rc = $.epl.schedule.convert_to_event(xml, "12:30:00");
        
        equals(rc.location, "unknown");
        equals(rc.start, "12:30:00");
        equals(rc.track, "1");
        equals(rc.tags, "hall1");
        equals(rc.duration, "2");
        equals(rc.title, "About PyPirates");
        equals(rc.talks.length, 1);
        
        rc = rc.talks[0];
        
        equals(rc.url, "http://abc");
        equals(rc.speakers.length, 1);
        equals(rc.speakers[0].url, 'http://efg');
        equals(rc.speakers[0].name, 'A B');
        equals(rc.speakers[0].image, 'http://123.jpg');
        equals(rc.abstract['it'], "...");
       
    })


    test("Test the conversion of xml to schedule based on a basic example file data.", function() {
        var synchronous_read = true;
        var data_file = "data/singleentry.xml";
    
        function read_success(xml) {
            var schedule = $.epl.schedule.convert(xml);

            // check top level
            equals(schedule.id, "day1");
            equals(schedule.conference, "pycon4");
            equals(schedule.slots.length, 3);
            
            var slot = schedule.slots[0];
            
            equals(slot.start, "08:00:00");
            equals(slot.events.length, 1);
            equals(slot.events[0].start, "08:00:00");
            equals(slot.events[0].title, "registrazione");
            
            slot = schedule.slots[1];

            equals(slot.start, "08:45:00");
            equals(slot.events.length, 1);
            equals(slot.events[0].start, "08:45:00");
            equals(slot.events[0].title, "presentazione");
            
            slot = schedule.slots[2];

            equals(slot.start, "09:00:00");
            equals(slot.events.length, 1);
            equals(slot.events[0].start, "09:00:00");
            equals(slot.events[0].title, "zc.buildout:");
        }
        
        function read_error() {
            equals(1,0, "Unable to read test '" + data_file + "' data!");
        }
        
        // catch nothing getting run due to coding errors. slight downside is having to update this.
        expect(15);

        $.epl.schedule.fetch(data_file, read_success, read_error, synchronous_read);
    })

    
    test("Sanity check a full day of conference data.", function() {
        var data_file = "data/day1.xml";
        var synchronous_read = true;
    
        function read_success(xml) {
            var schedule = $.epl.schedule.convert(xml);

            // check top level
            equals(schedule.id, "day1");
            equals(schedule.conference, "pycon4");
            equals(schedule.slots.length, 15);
            
            // Now pick some parts at random and check them:
            var slot = schedule.slots[0];
            
            equals(slot.start, "08:00:00");
            equals(slot.events.length, 1);
            equals(slot.events[0].start, "08:00:00");
            equals(slot.events[0].title, "registrazione");
        }

        function read_error() {
            equals(1,0, "Unable to read test '" + data_file + "' data!");
        }

        // catch nothing getting run due to coding errors. slight downside is having to update this.
        expect(7);
    
        $.epl.schedule.fetch(data_file, read_success, read_error, synchronous_read);
    })
    

    test("Test storing schedule data for offline use.", function() {
        var synchronous_read = true;
        var data_file = "data/singleentry.xml";
    
        function read_success(xml) {
            // make sure nothing is currently in the store.
            $.epl.storage.clear();
        
            // Check nothing is still stored:
            equals($.epl.storage.is_present('day1'), false);

            // Also check the all() call it should be empty too:
            equals($.epl.storage.all().length, 0);

            var schedule = $.epl.schedule.convert(xml);

            // Briefly check loaded data:
            equals(schedule.id, "day1");
            equals(schedule.conference, "pycon4");
            equals(schedule.slots.length, 3);
            
            // Save the day1 data:
            $.epl.storage.save_day("day1", schedule);
            
            // Now it should be present:
            equals($.epl.storage.is_present('day1'), false);
            
            // Recover all stored days:
            var sched = $.epl.storage.all();
            equals(sched.length, 1);
            sched = sched[0];
            
            // Check the data out of storage:
            equals(sched.id, "day1");
            equals(sched.conference, "pycon4");
            equals(sched.slots.length, 3);
            
            var slot = sched.slots[0];
            
            equals(slot.start, "08:00:00");
            equals(slot.events.length, 1);
            equals(slot.events[0].start, "08:00:00");
            equals(slot.events[0].title, "registrazione");
            
            slot = sched.slots[1];

            equals(slot.start, "08:45:00");
            equals(slot.events.length, 1);
            equals(slot.events[0].start, "08:45:00");
            equals(slot.events[0].title, "presentazione");
            
            slot = sched.slots[2];

            equals(slot.start, "09:00:00");
            equals(slot.events.length, 1);
            equals(slot.events[0].start, "09:00:00");
            equals(slot.events[0].title, "zc.buildout:");
         }
        
        function read_error() {
            equals(1,0, "Unable to read test '" + data_file + "' data!");
        }
        
        // catch nothing getting run due to coding errors. slight downside is having to update this.
        expect(22);

        $.epl.schedule.fetch(data_file, read_success, read_error, synchronous_read);
    })

});
