// SageLogController.js

/**
 * Creates an instance of SageLogs.
 *
 * @constructor
 * @this {SageLog}
 * @param {} 
 */
(function() {

	/**
	 * Creates an instance of SageLogs.
	 *
	 * @constructor
	 * @this {SageLog}
	 * @param {} 
	 */
	function SageLogs(_console) {
		//this.constructor = function SageLogs(options) { init(options); }
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

		/**
		 * Default colors to use for the corresponding log levels by index.
		 *
		 *                      DEBUG       LOG       INFO       WARN     ERROR    */
		var logLevelColors = ['#4169E1', '#9400D3', '#006400', '#DAA520', 'red'];

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

		var consoleLogsAreNowOveridden = false;

		//var consoleLogOverridder;
		var sageHeaderProps;

		var logBundle;
		var logStorer;
		var dao;


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
		 * SageLogs.init(options);
		 * @param {Object} options The options to pass into the initialize method to configure SageLogs.
		 */
	    this.init = function(options) {

	    	logBundle = new LogBundle();

	    	var logStorerClassName = 
	    		options.logStorerClassName === undefined 
	    		? 'LogStorer'
	    		: options.logStorerClassName;

		    logStorer = new window[logStorerClassName](logBundle, window.location.pathname);
			
			_console.log("Log level set to " + options.logLevel);
			logLevel = options.logLevel !== undefined ? options.logLevel : logLevel;
			timestampsEnabled = options.showTimestamps !== undefined ? options.showTimestamps : timestampsEnabled;
			
			/*logHandler.logPosterCallback = options.logPosterCallback !== undefined ? options.logPosterCallback : null;
			logHandlerObj.logPosterCallback = options.logPosterCallback !== undefined ? options.logPosterCallback : null;*/
		        		
			if(!consoleLogsAreNowOveridden) 
	            overrideConsoleLogsIfEnabled();

	        logHeaderProperties = new LogHeaderProperties();

	        var SenderDao = 
	        	options.logSenderDao === undefined
	        	? 'JSONPDAO'
	        	: options.logSenderDao;
	        	
	        dao = new window[SenderDao]();
	        //logHandlerObj.headerProps = {};
	    };


	    /**
		 * Override all of the different log methods on the console object and delegate to the originals.
		 *
		 * @private
		 */
	    function overrideConsoleLogsIfEnabled() {
	    	
	    	var logEmitter = new LogEmitter();
	    	var consoleLogProcessor = new ConsoleLogProcessor(logEmitter, logLevelColors, timestampsEnabled, LOG_LEVELS);
	    	var storedLogProcessor = new StoredLogProcessor(logStorer, logLevelColors, timestampsEnabled, LOG_LEVELS);
	    	var consoleLogOverridder = new ConsoleLogOverridder(consoleLogProcessor, storedLogProcessor, logLevel, timestampsEnabled);

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


		/**
		 * Send the logs from this context to the server.
		 */
		 this.sendLogsToServer = function() {

		 };


		 this.getLogBundleAsArray = function() {
		 	if(logBundle) {
		 		return logBundle.getLogBundleAsArray();
		 	}
		 };

	};


	/**
	 * The numerical weight assigned to each log level that determines the minimum log message type
	 * to be captured. If set to DEBUG, all logs are captured.
	 */
	SageLogs.prototype.DEBUG = SageLogs.DEBUG = 0;
	SageLogs.prototype.LOG = SageLogs.LOG = 1;
	SageLogs.prototype.INFO = SageLogs.INFO = 2;
	SageLogs.prototype.WARN = SageLogs.WARN = 3;
	SageLogs.prototype.ERROR = SageLogs.ERROR = 4;


	window.SageLog = SageLogs;

})();