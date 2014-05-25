// LogStorer.js


function LogStorer(logBundle, locationPathname) {

	/**
	 * Creates a timestamp if the enableTimestamps option is set upon initialization.
	 *
	 * @private
	 * @return {String} A string containing a timestamp; otherwise, it returns the empty string.
	 */
	function getLogTimeWithColons(timestampsEnabled) {
		if(!timestampsEnabled) return "";
		var d = new Date();
		var hours = d.getHours() < 10 ? 0 + "" + d.getHours() : d.getHours()+"";
		var minutes = d.getMinutes() < 10 ? 0 + "" + d.getMinutes() : d.getMinutes()+"";
		var seconds = d.getSeconds() < 10 ? 0 + "" + d.getSeconds() : d.getSeconds()+"";
		var logTime = hours + ":" + minutes + ":" + seconds;
		return logTime + " :: ";
	};

	// store the logs in the bundle
	this.storeLog = function(logEntryLevel, consoleLogArguments, color, timestampsEnabled, LOG_LEVELS) {

		consoleLogArguments[0] = logEntryLevel + " :: " + getLogTimeWithColons() + consoleLogArguments[0];

		var data = consoleLogArguments[0];
		var prefix = "";
		prefix = locationPathname + " :: ";
		
		// HTML-encode '<' and '>'
		logBundle.push('<font color="'+color+'"><pre>' + prefix + data.replace(/</gm,'&lt;').replace(/>/gm,'&gt;') + "</pre></font>");
		
		
	};


};


