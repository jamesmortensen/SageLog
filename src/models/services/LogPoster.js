// LogPoster.js


/**
 * This handles sending the logs to a third party server.
 *
 */
function LogPoster() {
	this.name = "LogPoster";

	var requestUrl = "",
		authorizationKey = "",
		httpMethod = "POST",
		payload = "";


	/**
	 * Submit the collection of logs to server.
	 * 
	 * @public
	 */
	this.submitLogsAsFeedback = function() {

		if(logHandler.allLogs == null || logBundleCollection.isEmpty()) {
			_console.warn("logHandler.submitLogsAsFeedback :: No logs from open windows have been collected.");
			return;
		}

		payload = { 
			message: "This is a test message due to a test error.",
			email: "test@example.com",
			name: "John Doe",
			device: "chrome",
			version: navigator.userAgent,
			op: "0",
			log_messages: logHandler.allLogs // TODO: Replace this with real data
		};

		var xmlHttpDao = new XMLHttpDAO();
		var observer = xmlHttpDao.fetchFromServer(requestUrl, authorizationKey, httpMethod, payload);



	};

};