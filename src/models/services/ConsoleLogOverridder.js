// ConsoleLogOveridder.js


function ConsoleLogOverridder(logProcessor, logLevel, timestampsEnabled) {

	/**
	 * Default colors to use for the corresponding log levels by index.
	 *
	 *                      DEBUG       LOG       INFO       WARN     ERROR    */
	var logLevelColors = ['#4169E1', '#9400D3', '#006400', '#DAA520', 'red'];

	/**
	 * The numerical weight assigned to each log level that determines the minimum log message type
	 * to be captured. If set to DEBUG, all logs are captured.
	 */
	var LOG_LEVEL = {DEBUG: 0, LOG: 1, INFO: 2, WARN: 3, ERROR: 4};

	/**
	 * The log level represening the lowest log level to report. 
	 */
	logLevel = logLevel || LOG_LEVEL.INFO;

	/**
	 * If true, show timestamps in console logs and log bundles.
	 */
	timestampsEnabled = timestampsEnabled || false;


	/**
	 * Creates a timestamp if the enableTimestamps option is set upon initialization.
	 *
	 * @private
	 * @return {String} A string containing a timestamp; otherwise, it returns the empty string.
	 */
	function getLogTimeWithColons() {
		if(!timestampsEnabled) return "";
		var d = new Date();
		var hours = d.getHours() < 10 ? 0 + "" + d.getHours() : d.getHours()+"";
		var minutes = d.getMinutes() < 10 ? 0 + "" + d.getMinutes() : d.getMinutes()+"";
		var seconds = d.getSeconds() < 10 ? 0 + "" + d.getSeconds() : d.getSeconds()+"";
		var logTime = hours + ":" + minutes + ":" + seconds;
		return logTime + " :: ";
	};


	/**
	 * Overrides/extends the console logs with a log processor
	 *
	 * @private
	 * @param {Function} legacyFn The original function, which becomes a delegate in the new one.
	 * @return {Function} The new overridden function, which delegates to the legacyFn. 
	 */
	this.overrideLogs = function(legacyFn) {  
			
		/** arguments for original fn **/
		return function() {
		
			if(LOG_LEVEL[legacyFn.name.toUpperCase()] >= logLevel) {
				var args = [];
			    if(typeof(arguments[0]) == "string") {
			        
				    // apply color to console logs
			        args[0] = "%c" + legacyFn.name + " :: " + getLogTimeWithColons() + arguments[0];
					args[1] = "color:" + logLevelColors[LOG_LEVEL[legacyFn.name.toUpperCase()]];
				
					// pass in as arguments to original function
					legacyFn.apply(this, args);
                
                    arguments[0] = legacyFn.name + " :: " + getLogTimeWithColons() + arguments[0];
                    logProcessor.processLogs(arguments[0], logLevelColors[LOG_LEVEL[legacyFn.name.toUpperCase()]]);
                
                } else {
                
                    // if not a string, don't manipulate the arguments, as it corrupts objects being printed
                    legacyFn.apply(this, arguments);
                    

                	/**
                	 * Disabling converting object logs to strings for the moment. Not sure how helpful it is
                	 * and it just seems to keep breaking the logHander....
                	 *
                	 */

                    /*
                     * TODO:
                     * 
                     * If a JSON object is circular, we cannot stringify it. A possible solution 
                     * exists, but for now, we're limited to non-circular object.
                     *
                     * http://stackoverflow.com/q/7582001/552792
                     */
                    ///args[0] = legacyFn.name + " :: " + JSON.stringify(arguments[0]);

					///processLogs(args[0], logLevelColors[LogLevelEnum[legacyFn.name.toUpperCase()]]);
                    
                }
				
			} 
			
		};

	};


	/**
	 * Overriddes/extends window.onerror with a log processor. This captures line numbers, as well as the 
	 * name of the file where the error occurs. See http://stackoverflow.com/q/17712995/552792
	 *
	 * @param {Function} legacyFn The original onerror function, which becomes a delegate in the new one.
	 * @return {Function} The new overridden function, which delegates to the legacyFn. 
	 */
	this.overrideError = function(legacyFn) {  
			
		/** arguments for original fn **/
		return function() {

			var message = arguments[0];
			var file = arguments[1];
			var line = arguments[2];
			var position = arguments[3];
			var error = arguments[4];

			//_console.log(arguments[0] + " : " + arguments[1] + " : " + arguments[2] + " : " + arguments[3] + " : " + arguments[4]);		
			var args = [];
			if(typeof(arguments[0]) == "string") {
				
				// apply color to console logs
				args[0] = legacyFn.name + " :: " + arguments[0];
				args[1] = "color:" + logHandler.logLevelColors[LOG_LEVEL[legacyFn.name.toUpperCase()]];
			
				// pass in as arguments to original function
				//legacyFn.apply(this, args);		
				//args[0] += "\n" + logHandler.getStackTrace();   
			    var fileArr = file.split("\/");
			    var filePath = fileArr[fileArr.length-1];

			    args[0] += "  ("+filePath+":"+line+")";
				logProcessor.processLogs(args[0], logHandler.logLevelColors[LOG_LEVEL[legacyFn.name.toUpperCase()]]);
				//_console.error("E : " + arguments[0] + " : " + arguments[1] + " : " + arguments[2] + " : " + arguments[3] + " : " + arguments[4]);		

			} else {
			
				// if not a string, don't manipulate the arguments, as it corrupts objects being printed
				legacyFn.apply(this, arguments);
				
				args[0] = legacyFn.name + " :: " + JSON.stringify(arguments[0]);
				
			}			
			//return legacyFn.apply(this, arguments);
		};

	};
	
}