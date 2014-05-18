// LogProcessor.js


function LogProcessor(logBundle) {

	// TODO: Do we really want to do this on the client side? 
	this.processLogs = function(data, color) {

		var prefix = "";
		prefix = window.location.pathname + " :: ";
		
		// HTML-encode '<' and '>'
		logBundle.push('<font color="'+color+'"><pre>' + prefix + data.replace(/</gm,'&lt;').replace(/>/gm,'&gt;') + "</pre></font>");
		
		
	};


};


