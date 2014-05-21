// StoredLogProcessor.js

/**
 * Decorate the captured log.
 */
function StoredLogProcessor(logStorer, logLevelColors, timestampsEnabled, LOG_LEVELS) {


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
		consoleLogArguments[0] = legacyFn.name + " :: " + getLogTimeWithColons() + consoleLogArguments[0];
        logStorer.storeLog(consoleLogArguments[0], logLevelColors[LOG_LEVELS[legacyFn.name.toUpperCase()]]);
	};
};
