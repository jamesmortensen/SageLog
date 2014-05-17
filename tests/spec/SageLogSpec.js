// logsSpec.js

describe("Collecting logs", function() {

	function makeFakeConsole(object) {
	  var obj = {};
	  for(var k in object) {
	      if(object[k].name !== undefined) {
	          obj[k] = new Function(
	             "return function " + object[k].name + "(msg){ console."+object[k].name+"(msg);}"
	          )();
	      }
	  }
	  return obj;
	}
	fakeConsole = makeFakeConsole(console);
	 logHandler = new SageLog();

	logHandler.init({
		"captureLogs":true, 
		"logLevel":logHandler.logLevels.DEBUG
	});

    it("Should set the logging level to INFO and no timestamps", function() {

    	fakeConsole.info("hello world");
    	fakeConsole.info("hello test");

    	logHandler.submitLogsToBackgroundPage();
    	setTimeout(function() {
	    	var allLogsAsArray = logHandler.getAllLogsAsArray();
	    	fakeConsole.info("all logs as array = " + JSON.stringify(allLogsAsArray));

	    	/*logHandler.compileLogs();
	    	var allLogs = logHandler.getAllLogs();
			fakeConsole.info("all logs = " + JSON.stringify(allLogs));*/

			fakeConsole.info("logsCollected = " + logHandler.logsCollected[0]);			
	    },1000);
    });

    it("Should throw an error in the console and also store that error", function() {

    	//ttt();

    });

});