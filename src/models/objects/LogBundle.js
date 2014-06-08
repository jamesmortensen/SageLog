// LogBundle.js

function LogBundle(maxLogLength) {
	this.name = "LogBundle";
	maxLogLength = maxLogLength || 500;

    var logMessagesArray = [];

    this.length = 0;


    function purgeOldMessages() {
		if(logBundle.length > maxLogLength) {
			logMessagesArray = logMessagesArray.slice(10);
			this.length = logMessagesArray.length;
		}
    };
    

    this.push = function(message) {
        logMessagesArray.push(message);
        this.length = logMessagesArray.length;
    };


    this.getLogBundleAsArray = function() {
    	return logMessagesArray;
    };


    this.getLogBundleAsJson = function() {
        var logEntry;
        var jsonArray = [];
        logMessagesArray.forEach(function(element, index, array) {
            logEntry = element.getLogEntry();
            console.debug('logEntry = ' + logEntry);
            jsonArray.push(logEntry);
        });
        return jsonArray;
    };
};