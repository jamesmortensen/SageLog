// LogEntry.js

function LogEntry(color, encodedData, pathname) {
	this.name = 'LogEntry';

	this.getLogEntry = function() {
		return {
			color: color,
			encodedData: encodedData,
			pathname: pathname
		};
	};
};