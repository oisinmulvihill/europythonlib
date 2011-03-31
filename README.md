EuroPython Javascript Library
=============================

License
-------

Copyright 2011 Oisin Mulvihill

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.


Introduction
------------

This is a set if jquery plugins that are used in the phonegap app for EuroPython
2011.


Namespace
---------

The "js/" folder provides the following functionality and namespaces. Each in
theory can be used on its own.

  jquery.epl.js:

    $.epl

    Top level EuroPython lib namespace.

  jquery.epl.schedule.js:

    $.epl.schedule

    calendar data feed functions

  jquery.epl.storage.js:

    $.epl.storage

    Offline storage and calendar caching.


Unit Tests
----------

To run the tests simple open "runjstest.html" in Chrome or Firefox.

There is a test suite for all the functionality so far. This uses the jquery
qunit. There is not need to download dependancies for testing as they are all
in "deps/". The test code uses XML files it gets from "data/" rather then
download from the internet.
