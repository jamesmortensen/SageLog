// JsonLogStorer.js

function JsonLogStorer(logBundle, locationPathname) {

	// TODO: Do we really want to do this on the client side? 
	this.storeLog = function(logEntryLevel, consoleLogArguments, color) {

		var data = consoleLogArguments[0];
		
		// HTML-encode '<' and '>'
		var encodedData = data.replace(/</gm,'&lt;').replace(/>/gm,'&gt;');
		
		var logEntry = new LogEntry(color, encodedData, locationPathname, new Date().getTime());

		
		logBundle.push(logEntry);
		
		
	};


};
