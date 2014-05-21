// LogStorer.js


function LogStorer(logBundle, locationPathname) {

	// TODO: Do we really want to do this on the client side? 
	this.storeLog = function(data, color) {

		var prefix = "";
		prefix = locationPathname + " :: ";
		
		// HTML-encode '<' and '>'
		logBundle.push('<font color="'+color+'"><pre>' + prefix + data.replace(/</gm,'&lt;').replace(/>/gm,'&gt;') + "</pre></font>");
		
		
	};


};


