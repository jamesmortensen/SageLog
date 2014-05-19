// logsSpec.js

describe("Collecting logs", function() {

    /**
     * Takes the console object as an argument and creates a copy that can be overridden without
     * affecting the default console object and its methods.
     *
     * @param {Object} _console The native console object containing log, info, warn, error, etc. methods.
     * @return A cloned object containing the same functionality and properties as console.
     */
	function makeFakeConsole(_console) {
	  var clonedConsole = {};
	  for(var k in _console) {
	  	  if(typeof _console[k] == 'function') {
	  	  	  var matchedNativeCodeArray = _console[k].toString().match(/function\s(.*?)\(\)\s{\s\[native\scode]\s\}$/);
	  	  	  if(matchedNativeCodeArray == null) {
	  	  	      throw new TypeError("Can't clone an object with non-native methods. The object to clone must contain only native code.");
	  	  	  }
	  	  }
	      if(_console[k].name !== undefined) {
	          clonedConsole[k] = new Function(
	             "return function " + _console[k].name + "(msg){ console."+_console[k].name+".apply(console, arguments);}"
	          )();
	      }
	  }
	  return clonedConsole;
	};


	var fakeConsole = makeFakeConsole(console);
	var logHandler = new SageLog(fakeConsole);

	logHandler.init({
		"captureLogs":true, 
		"logLevel":SageLog.DEBUG
	});

    it("Should set the logging level to INFO and no timestamps", function(done) {

    	fakeConsole.info('hello world');
    	fakeConsole.info('hello test');
    	fakeConsole.debug('hello invisible');

    	logHandler.sendLogsToServer();
    	setTimeout(function() {
	    	///var allLogsAsArray = logHandler.getAllLogsAsArray();
	    	///fakeConsole.info("all logs as array = " + JSON.stringify(allLogsAsArray));
	    	var logArray = logHandler.getLogBundleAsArray();

			console.debug("logsCollected = " + logArray);
			expect(logArray[0].match(/hello world/)).toEqual(['hello world']);
			expect(logArray[1].match(/hello test/)).toEqual(['hello test']);
			expect(logArray.length).toEqual(2);
			done();			
	    },1000);
    });

    it("Should throw an error in the console and also store that error", function() {
    	// TODO: Need to get this working
    	//ttt();
    	console.log('logs after error = ' + logHandler.getLogBundleAsArray().length);
    });

    it("should show an error in the logs", function() {
		console.log('logs after error = ' + logHandler.getLogBundleAsArray().length);
    });

});