// ConsoleLogOveridder.js


function ConsoleLogOveridder(logLevel) {

	/**
	 * Default colors to use for the corresponding log levels by index.
	 *
	 *                      DEBUG       LOG       INFO       WARN     ERROR    */
	var logLevelColors = ['#4169E1', '#9400D3', '#006400', '#DAA520', 'red'];

	/**
	 * The numerical weight assigned to each log level that determines the minimum log message type
	 * to be captured. If set to DEBUG, all logs are captured.
	 */
	var LogLevelEnum = {DEBUG: 0, LOG: 1, INFO: 2, WARN: 3, ERROR: 4};

	/**
	 * The log level represening the lowest log level to report. 
	 */
	logLevel = logLevel || LogLevelEnum.INFO;

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
		
			if(logLevelEnum[legacyFn.name.toUpperCase()] >= logLevel()) {
				var args = [];
			    if(typeof(arguments[0]) == "string") {
			        
				    // apply color to console logs
			        args[0] = "%c" + legacyFn.name + " :: " + getLogTimeWithColons() + arguments[0];
					args[1] = "color:" + logLevelColors[LogLevelEnum[legacyFn.name.toUpperCase()]];
				
					// pass in as arguments to original function
					legacyFn.apply(this, args);
                
                    arguments[0] = legacyFn.name + " :: " + getLogTimeWithColons() + arguments[0];
                    processLogs(arguments[0], logLevelColors[LogLevelEnum[legacyFn.name.toUpperCase()]]);
                
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
	
}