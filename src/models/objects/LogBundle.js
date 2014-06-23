// LogBundle.js

function LogBundle(maxLogLength) {
	this.name = "LogBundle";
	maxLogLength = maxLogLength || 500;

    var logMessagesArray = [];

    /**
     * The number of logs in this collection.
     */
    this.length = 0;

    /**
     * The name of the log collection. Not currently used but here for future expansion.
     */
    this.bundleName = 'default';


    /**
     * Purge old log messages when the collection size exceeds maxLogLength.
     */
    function purgeOldMessages() {
		if(logBundle.length > maxLogLength) {
			logMessagesArray = logMessagesArray.slice(10);
			this.length = logMessagesArray.length;
		}
    };
    

    /**
     * Add a new logEntry message to the collection.
     *
     * @param {} message The LogEntry to push into the LogBundle.
     */
    this.push = function(message) {
        logMessagesArray.push(message);
        this.length = logMessagesArray.length;
    };


    /**
     * Retrieve the contents as an array
     *
     * @return {Array} The raw underlying array object containing the LogEntry messages.
     */
    this.getLogBundleAsArray = function() {
    	return logMessagesArray;
    };


    /**
     * Retrieve the entire LogBundle as a serialized JSON object.
     *
     * @return {Object} The JSON representation
     */
    this.getLogBundleAsJson = function() {
        var logEntry;
        var jsonArray = [];
        var jsonObject = {};
        logMessagesArray.forEach(function(element, index, array) {
            logEntry = element.getLogEntry();
            jsonArray.push(logEntry);
        });
        jsonObject = {
            bundleName: this.bundleName,
            logEntries: jsonArray
        };
        return jsonObject;
    };
};