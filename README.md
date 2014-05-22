**This is still in active development and is not quite ready for production.**


# SageLog

This package overrides the console logs in Chrome and stores the logs in an array for uploading
to a third-party server. The console logs are also color coded for easier readability.


## Testing

First, install all dependencies:

```
$ npm install
```

Then to test from the terminal, run:

```
$ npm test
```

## Develop

To rerun tests continuously while watching for changes, run:

```
$ npm run watch
```

And, to view the tests in the browser, start the http server:

```
$ npm start
```

Then in your browser, go to [http://localhost:8090/tests/_SpecRunner.html](http://localhost:8090/tests/_SpecRunner.html). This page also live reloads when making changes.


## Documentation

To see project documentation, run the following commands:

```
$ npm run jsdoc && npm start
```

Then see [http://localhost:8090/doc/](http://localhost:8090/doc/).

## Getting Started

To use SageLog in your project, build it with the following command:

```
$ npm run min
```

This minifies and bundles the sources in dist/SageLog.js and dist/SageLog.min.js. Include one of the two files in all of your Web pages where you intend to capture logs.


### Initialize

To initialize the logger, once logHandler loads, call:

```javascript
logHandler.init({"captureLogs":true});
```


### Set Log Levels:
 
- DEBUG - Highest. Everything is logged.
- LOG - Default logging level. Everything from here to error is logged.
- INFO - Only info, warn, and error messages are logged.
- WARN - Only warn and error messages are logged.
- ERROR - Lowest. Only errors are logged at this level.
 
To change logging level, pass the level in as another property of the options object:
    
```javascript
logHandler.init({"captureLogs":true, "logLevel":logHandler.logLevels.DEBUG});
```


### API

- uploadLogsToServer:  Upload the logs 


## License

Copyright 2014, James Mortensen ([@jmort253](https://twitter.com/jmort253)), MIT License.
