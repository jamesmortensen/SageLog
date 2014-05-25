// LogEntry.js

function LogEntry(color, encodedData, pathname, timestamp) {
	this.name = 'LogEntry';

	this.getLogEntry = function() {
		return {
			color: color,
			encodedData: encodedData,
			pathname: pathname,
			timestamp: timestamp
		};
	};
};