// SageLogController.js

/**
 * Creates an instance of SageLog.
 *
 * @constructor
 * @this {SageLog}
 * @param {} 
 */
(function() {

	/**
	 * Creates an instance of SageLog.
	 *
	 * @constructor
	 * @this {SageLog}
	 * @param {} 
	 */
	function SageLog(options, _console) {
		//this.constructor = function SageLog(options) { init(options); }
		//this.name = "SageLog";
		_console = _console || console;


		/**
		 * The numerical weight assigned to each log level that determines the minimum log message type
		 * to be captured. If set to DEBUG, all logs are captured.
		 */
		var LOG_LEVELS = {
		 	DEBUG: 0,
		 	LOG: 1,
		 	INFO: 2,
		 	WARN: 3,
		 	ERROR: 4
		};
		
		var consoleLogsAreNowOveridden = false;

		/**
		 * The maximum number of log records to store in the queue at one time.
		 * After maxLogLength, log messages are removed on a FIFO basis.
		 */
		var maxLogLength = 500;

		/**
		 * Default log level is LOG, which also includes INFO, WARN, and ERROR.
		 */
		var logLevel = LOG_LEVELS.LOG;

		/**
		 * Include timestamps in log messages if true. Defaults to false.
		 */
		var timestampsEnabled = false;

		//var consoleLogOverridder;
		var sageHeaderProps;


		/**
		 * Initialize the system and load configuration:
		 * 
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
	    this.init = function(options) {
			
			_console.log(options.logLevel);
			logLevel = options.logLevel !== undefined ? options.logLevel : logLevel;
			timestampsEnabled = options.showTimestamps !== undefined ? options.showTimestamps : timestampsEnabled;
			
			/*logHandler.logPosterCallback = options.logPosterCallback !== undefined ? options.logPosterCallback : null;
			logHandlerObj.logPosterCallback = options.logPosterCallback !== undefined ? options.logPosterCallback : null;*/
		        		
			if(!consoleLogsAreNowOveridden) 
	            overrideConsoleLogsIfEnabled();

	        logHeaderProperties = new LogHeaderProperties();
	        //logHandlerObj.headerProps = {};
	    };


	    /**
		 * Override all of the different log methods on the console object and delegate to the originals.
		 *
		 * @private
		 */
	    function overrideConsoleLogsIfEnabled() {

	    	var logBundle = new LogBundle();
	    	var logProcessor = new LogProcessor(logBundle);
	    	var consoleLogOverridder = new ConsoleLogOverridder(logProcessor, logLevel, timestampsEnabled);

			_console.trace = consoleLogOverridder.overrideLogs(_console.trace);
			_console.log = consoleLogOverridder.overrideLogs(_console.log);
			_console.debug = consoleLogOverridder.overrideLogs(_console.debug);
			_console.info = consoleLogOverridder.overrideLogs(_console.info);
			_console.warn = consoleLogOverridder.overrideLogs(_console.warn);

	        window.onerror = consoleLogOverridder.overrideError(_console.error);
			_console.error = consoleLogOverridder.overrideLogs(_console.error);
				
	        consoleLogsAreNowOveridden = true;

	        consoleLogOverridder = null;
	    
		};


		/**
		 * Gets the currently set log level as an integer.
		 *
		 * @return {Number} The log level, represented by an integer.
		 */
		this.getLogLevel = function() { 
			return logLevel;
		};

	};


	/**
	 * The numerical weight assigned to each log level that determines the minimum log message type
	 * to be captured. If set to DEBUG, all logs are captured.
	 */
	SageLog.prototype.DEBUG = SageLog.DEBUG = 0;
	SageLog.prototype.LOG = SageLog.LOG = 1;
	SageLog.prototype.INFO = SageLog.INFO = 2;
	SageLog.prototype.WARN = SageLog.WARN = 3;
	SageLog.prototype.ERROR = SageLog.ERROR = 4;


	window.SageLog = SageLog;

})();