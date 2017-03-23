# Logentries Logger

[![Build Status](https://travis-ci.org/Reekoh/logentries-logger.svg)](https://travis-ci.org/Reekoh/logentries-logger)
![Dependencies](https://img.shields.io/david/Reekoh/logentries-logger.svg)
![Dependencies](https://img.shields.io/david/dev/Reekoh/logentries-logger.svg)
![Built With](https://img.shields.io/badge/built%20with-gulp-red.svg)

Logentries Logger Plugin for the Reekoh IoT Platform. Connects a Reekoh instance to Logentries to synchronize log data.

## Configuration Parameters

* Token (String) - The Logentries token to use for sending log data.
* *Log Level (String) - Optional, the default log level to use. Default: debug*

## Input Data

* logData (String) - String containing the data to be logged. Can also be a JSON String. If data is JSON String, it will get parsed before it is sent. To customize log level, simply include a level field on the log data JSON String.
