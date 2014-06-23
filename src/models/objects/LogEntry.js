// LogEntry.js

function LogEntry(logEntryLevel, color, encodedData, pathname, timestamp) {
	this.name = 'LogEntry';

	this.getLogEntry = function() {
		return {
			type: logEntryLevel,
			color: color,
			encodedData: encodedData,
			pathname: pathname,
			timestamp: timestamp
		};
	};
};