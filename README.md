**This is still in active development and is not quite ready for production.**


# SageLog

This package overrides the console logs in Chrome and stores the logs in an array for uploading
to a third-party server. The console logs are also color coded for easier readability.

## Initialize

To initialize the logger, once logHandler loads, call:

```javascript
logHandler.init({"captureLogs":true});
```


## Set Log Levels:
 
DEBUG - Highest. Everything is logged.
LOG - Default logging level. Everything from here to error is logged.
INFO - Only info, warn, and error messages are logged.
WARN - Only warn and error messages are logged.
ERROR - Lowest. Only errors are logged at this level.
 
To change logging level, pass the level in as another property of the options object:
    
```javascript
logHandler.init({"captureLogs":true, "logLevel":logHandler.logLevels.DEBUG});
```

## Disabling

To disable, simply change captureLogs to "false" or remove the init invocation.


## API

- uploadLogsToServer:  Upload the logs 


# License

Copyright 2014, James Mortensen, MIT License.