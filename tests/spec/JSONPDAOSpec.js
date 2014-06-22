// JSONPDAOSpec.js

describe('JSONPDAO', function() {
	'use strict';

	var jsonpDao,
		httpMethod = 'GET',
		dataPayload,
		requestUrl;

	/**
     * PhantomJS doesn't like overridding console in beforeEach and it blocks, so we create a masterFakeConsole 
     * copy to use instead. The master works just as well as the original. If one attempts to make 
     * copies of the actual native console object inside the beforeEach and it blocks, Jasmine responds with
     * "SyntaxError: Parse error (line 1) (1)".
     */
	var masterFakeConsole = FakeConsoleHelper.makeFakeConsole(console);

	beforeEach(function() {
		jsonpDao = new JSONPDAO();
		dataPayload = {
	 		color: "red",
	 		encodedData: "encodedData",
			pathname: "pathname"
	 	};
	});

	it('should send data to the server and run a response', function(done) {
		requestUrl = 'http://localhost:3001/sagelog.js';

	 	var observer = jsonpDao.send(requestUrl, null, httpMethod, dataPayload);

	 	observer.done(function(data) {
	 		console.debug('got back the response with handshake id = ' + data.handshake);
	 		expect(typeof data.handshake).toEqual('number');
	 		done();
	 	});
	});

	it('should send data to the server and echo a response', function() {
		requestUrl = 'http://localhost:3001/echo.js';
	 	
	 	var observer = jsonpDao.send(requestUrl, null, httpMethod, dataPayload);

	 	observer.done(function(data) {
	 		console.debug('got back the response with handshake id = ' + data.handshake);
	 		console.debug('got back the response with color = ' + data.message.color);
	 		expect(data.message.color).toEqual('red');
	 	});
	});

	it('should pass actual log data to the server and echo the response', function(done) {
		
		// http://stackoverflow.com/a/1249234/552792
		function htmlDecode(input){
		    var e = document.createElement('div');
		    e.innerHTML = input;
		    return e.childNodes[0].nodeValue;
		};

		requestUrl = 'http://localhost:3001/echo.js';

		/**
	     * fakeConsole acts as the copy of console used in each test. Prior to being overridden, it functions 
	     * exactly like the default console, but afterwards is decorated by the SageLog library.
	     */
        var fakeConsole = FakeConsoleHelper.makeFakeConsole(masterFakeConsole);
        
        var logHandler = new SageLog(fakeConsole);
    
        logHandler.init({
            "captureLogs": true,
            "logStorerClassName" : "JsonLogStorer",
            "logLevel": SageLog.INFO
        });

        fakeConsole.info('hello world');
        fakeConsole.error('hello test');
        fakeConsole.log('hello nobody');
        fakeConsole.debug('hello invisible');
        fakeConsole.warn('hello careful');
        fakeConsole.error('~`!@#$%^&*()_+-=;":/?.>,<[]{}|\'\\\n <div>Test & test</div>');

        var logJson = logHandler.getLogBundleAsJson();
        var logArray = logJson.logEntries;

        expect(logArray.length).toEqual(4);
    
	 	dataPayload = JSON.stringify({logBundles:[logJson]});
	 	var observer = jsonpDao.send(requestUrl, null, httpMethod, dataPayload);

	 	observer.done(function(data) {
	 		console.debug('got back the response with handshake id = ' + data.handshake);
	 		console.debug('got back the response with handshake id = ' + data.message.logBundles[0].bundleName);
	 		console.debug('got back the response with color = ' + data.message.logBundles[0].logEntries[0].color);
	 		var logEntries = data.message.logBundles[0].logEntries;
	 		expect(logEntries[0].color).toEqual('#006400');
	 		expect(logEntries[1].color).toEqual('red');
	 		expect(logEntries[2].color).toEqual('#DAA520');
	 		expect(logEntries[0].encodedData).toEqual('hello world');
	 		expect(logEntries[1].encodedData).toEqual('hello test');
	 		expect(logEntries[2].encodedData).toEqual('hello careful');
	 		var unencodedData = HTMLDecodeHelper.htmlDecode(logEntries[3].encodedData);
	 		expect(unencodedData).toEqual('~`!@#$%^&*()_+-=;":/?.>,<[]{}|\'\\\n <div>Test & test</div>');
	 		done();
	 	});
	});
});