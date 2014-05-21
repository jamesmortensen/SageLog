// ConsoleLogProcessor.js

/**
 * Decorate the log for the Developer Tools console.
 */
function ConsoleLogProcessor(logEmitter, logLevelColors, timestampsEnabled, LOG_LEVELS) {


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


	this.processLog = function(legacyFn, _this, consoleLogArguments) {
		var processedLogArguments = [];
		
		// apply color to console logs
        processedLogArguments[0] = "%c" + legacyFn.name + " :: " + getLogTimeWithColons() + consoleLogArguments[0];
		processedLogArguments[1] = "color:" + logLevelColors[LOG_LEVELS[legacyFn.name.toUpperCase()]];
		
		// pass in as arguments to original function and show message on console
		logEmitter.logMessage(legacyFn, _this, processedLogArguments);

	};
};