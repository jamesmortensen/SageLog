// SageLogController.js


/**
 * Creates an instance of SageLog.
 *
 * @constructor
 * @this {SageLog}
 * @param {} 
 */
function SageLogC(options, _console) {
	this.constructor = function SageLog(options) { init(options); }
	_console = _console || console;


	var consoleLogsAreNowOveridden = false;

	/**
	 * The numerical weight assigned to each log level that determines the minimum log message type
	 * to be captured. If set to DEBUG, all logs are captured.
	 */
	var LogLevelEnum = {DEBUG: 0, LOG: 1, INFO: 2, WARN: 3, ERROR: 4};

	/**
	 * The maximum number of log records to store in the queue at one time.
	 * After maxLogLength, log messages are removed on a FIFO basis.
	 */
	var maxLogLength = 500;


	/**
	 * Default log level is LOG, which also includes INFO, WARN, and ERROR.
	 */
	var logLevel = LogLevelEnum.LOG,


	/**
	 * Initialize the system and load configuration:
	 * 
	 * @example
	 * var sageLog = new SageLogs();
	 * // Options defaults:
	 * var options: {
	 *     "logLevel": logLevel.INFO                  // log at INFO, WARN, and ERROR.
	 *     "logPosterCallback": uploadLogsToMyServer  // your callback function to send logs to remote endpoint.
	 *     "showTimestamps": false 
	 * };
	 * sageLog.init(options);
	 * @param {Object} options The options to pass into the initialize method to configure SageLogs.
	 */
    function init(options) {
		
		_console.log(options.logLevel);
		logLevel = options.logLevel !== undefined ? options.logLevel : logLevel;

		logHandler.timestampsEnabled = options.showTimestamps;
		
		logHandler.logPosterCallback = options.logPosterCallback !== undefined ? options.logPosterCallback : null;
		logHandlerObj.logPosterCallback = options.logPosterCallback !== undefined ? options.logPosterCallback : null;
	        		
		if(!consoleLogsAreNowOveridden) 
            overrideConsoleLogsIfEnabled();

        logHandlerObj.headerProps = {};
    };


    /**
	 * Override all of the different log methods on the console object and delegate to the originals.
	 *
	 * @private
	 */
    function overrideConsoleLogsIfEnabled() {

		_console.trace = logHandler.overrideLogs(_console.trace);
		_console.log = logHandler.overrideLogs(_console.log);
		_console.debug = logHandler.overrideLogs(_console.debug);
		_console.info = logHandler.overrideLogs(_console.info);
		_console.warn = logHandler.overrideLogs(_console.warn);

        window.onerror = logHandler.overrideError(_console.error);
		_console.error = logHandler.overrideLogs(_console.error);
			
        consoleLogsAreNowOveridden = true;
    
	};


	/**
	 * Gets the currently set log level as an integer.
	 *
	 * @return {Number} The log level, represented by an integer.
	 */
	this.getLogLevel = function() { 
		return logLevel;
	},

};