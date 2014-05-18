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

};