// logsSpec.js


describe("SageLog", function() {
    "use strict";

    /**
     * PhantomJS doesn't like overridding console in beforeEach and it blocks, so we create a masterFakeConsole 
     * copy to use instead. The master works just as well as the original. If one attempts to make 
     * copies of the actual native console object inside the beforeEach and it blocks, Jasmine responds with
     * "SyntaxError: Parse error (line 1) (1)".
     */
    var masterFakeConsole = FakeConsoleHelper.makeFakeConsole(console);
    
    /**
     * fakeConsole acts as the copy of console used in each test. Prior to being overridden, it functions 
     * exactly like the default console, but afterwards is decorated by the SageLog library.
     */
    var fakeConsole;

    /**
     * logHandler is reinstantiated with a new SageLog after each test, and it uses a fresh console copy so
     * every test starts with fresh data and a fresh context.
     */
    var logHandler,
        requestUrl;
    

    describe("Collecting logs", function() {


        beforeEach(function() {
    	    fakeConsole = FakeConsoleHelper.makeFakeConsole(masterFakeConsole);     // make fake console copy
    	    logHandler = new SageLog(fakeConsole);
            requestUrl = 'http://localhost:3001/sagelog.js';
    	});


        it("should log and collect everything", function(done) {
            
            logHandler.init({
                "captureLogs": true, 
                "logLevel": SageLog.DEBUG,
                "logStorerClassName": "LogStorer",
                "server": requestUrl
            });

            fakeConsole.info('hello world');
            fakeConsole.error('hello test');
            fakeConsole.log('hello nobody');
            fakeConsole.debug('hello invisible');
            fakeConsole.warn('hello careful');

            setTimeout(function() {
                var logArray = logHandler.getLogBundleAsArray();

                console.debug("logsCollected = " + logArray);
                expect(logArray[0].match(/hello world/)).toEqual(['hello world']);
                expect(logArray[1].match(/hello test/)).toEqual(['hello test']);
                expect(logArray[2].match(/hello nobody/)).toEqual(['hello nobody']);
                expect(logArray[3].match(/hello invisible/)).toEqual(['hello invisible']);
                expect(logArray[4].match(/hello careful/)).toEqual(['hello careful']);
                expect(logArray.length).toEqual(5);
                done();         
            },1000);
        });


        it("Should set the logging level to INFO and not collect LOG or DEBUG logs", function(done) {
    		
        	logHandler.init({
    			"captureLogs": true, 
    			"logLevel": SageLog.INFO,
                "logStorerClassName": "LogStorer",
                "server": requestUrl
    		});
        	
        	fakeConsole.info('hello world');
        	fakeConsole.error('hello test');
        	fakeConsole.log('hello nobody');
        	fakeConsole.debug('hello invisible');
        	fakeConsole.warn('hello careful');

        	//logHandler.sendLogsToServer();
        	setTimeout(function() {
    	    	var logArray = logHandler.getLogBundleAsArray();

    			console.debug("logsCollected = " + logArray);
    			expect(logArray[0].match(/hello world/)).toEqual(['hello world']);
    			expect(logArray[1].match(/hello test/)).toEqual(['hello test']);
    			expect(logArray[2].match(/hello careful/)).toEqual(['hello careful']);
    			expect(logArray.length).toEqual(3);
    			done();			
    	    },1000);
        });


        it("should only log errors and nothing else", function(done) {
       	    
        	logHandler.init({
    			"captureLogs": true, 
    			"logLevel": SageLog.ERROR,
                "logStorerClassName": "LogStorer",
                "server": requestUrl
    		});

        	fakeConsole.info('hello world');
        	fakeConsole.error('hello test');       // only ERROR is logged
        	fakeConsole.log('hello nobody');
        	fakeConsole.debug('hello invisible');
        	fakeConsole.warn('hello careful');

        	setTimeout(function() {
    	    	var logArray = logHandler.getLogBundleAsArray();

    			console.debug("logsCollected = " + logArray);
    			expect(logArray[0].match(/hello test/)).toEqual(['hello test']);
    			expect(logArray.length).toEqual(1);
    			done();			
    	    },1000);
        });


        it("Should print out an object passed into a log function, without any processing or storing", function() {

        	logHandler.init({
    			"captureLogs": true, 
    			"logLevel": 0,
                "logStorerClassName": "LogStorer",
                "server": requestUrl
    		});
        	
        	fakeConsole.info({name: "James"});
        	var logArray = logHandler.getLogBundleAsArray();

    		console.debug("logsCollected length = " + logArray.length + " (should be 0)");
        	expect(logArray.length).toEqual(0);
        });

        
        it("Should throw an uncaught exception in the console and also store it", function(done) {
        	
            logHandler.init({
                "captureLogs": true, 
                "logLevel": 0,
                "logStorerClassName": "JsonLogStorer",
                "server": requestUrl
            });

            /**
             * Generate an uncaught exception
             */
            setTimeout(function() {
                thisGeneratesAnUncaughtException_AndIs_A_NormalErrorYouCanIgnoreInTheLogs();    
            },500);

            /**
             * Verify uncaught exception is stored in captured logs
             */
        	setTimeout(function() {
        	   console.log('logs after error = ' + logHandler.getLogBundleAsArray().length);
               var logJson = logHandler.getLogBundleAsJson();
               var exception = logJson.logEntries[0].encodedData;
               console.debug(exception);
               expect(exception.match(/Uncaught ReferenceError/).length).toEqual(1);
               done();
            },1000);
        });


        /**
         * Remove "x" to run performance tests.
         */
        xit("Should be able to handle 10000 log entries without performance degradation", function() {

            var start = new Date().getTime();
            logHandler.init({
                "captureLogs": true, 
                "logLevel": 0,
                "logStorerClassName": "LogStorer",
                "server": requestUrl
            });

            for(var i = 0; i < 10000; i++) {
                fakeConsole.info("This is an automated test message number " + i);
            }

            var stop = new Date().getTime();
            console.debug("Total Run Time = " + (stop - start) + "ms");
        });
    });

    describe("Collecting Logs as JSON objects", function() {

        beforeEach(function() {
            fakeConsole = FakeConsoleHelper.makeFakeConsole(masterFakeConsole);     // make fake console copy
            logHandler = new SageLog(fakeConsole);
            requestUrl = 'http://localhost:3001/sagelog.js';
        });

        it("should store INFO logs only, and 2 entries", function() {
            logHandler.init({
                "captureLogs": true,
                "logStorerClassName" : "JsonLogStorer",
                "logLevel": SageLog.INFO,
                "server": requestUrl
            });

            fakeConsole.info('hello world');
            fakeConsole.error('hello test');
            fakeConsole.log('hello nobody');
            fakeConsole.debug('hello invisible');
            fakeConsole.warn('hello careful');

            var logArray = logHandler.getLogBundleAsArray();

            expect(logArray.length).toEqual(3);
        });

        it("should store INFO logs only, and verify data is correct", function() {
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

            var logArray = logHandler.getLogBundleAsArray();

            var logEntry;
            logArray.forEach(function(element, index, array) {
                logEntry = element.getLogEntry();
                console.debug('logEntry = ' + logEntry.color);
                if(index == 0)
                    expect(logEntry.color).toEqual('#006400');
                if(index == 1)
                    expect(logEntry.color).toEqual('red');
                if(index == 2)
                    expect(logEntry.color).toEqual('#DAA520');
            });
        });

        it("should attempt to send error logs to a server.", function(done) {
            logHandler.init({
                "captureLogs": true,
                "logStorerClassName" : "JsonLogStorer",
                "logLevel": SageLog.ERROR,
                "server": requestUrl
            });

            fakeConsole.info('hello world');
            fakeConsole.error('hello test');              // only ERROR is logged
            fakeConsole.log('hello nobody');
            fakeConsole.debug('hello invisible');
            fakeConsole.error('hello error');             // only ERROR is logged
            fakeConsole.warn('hello careful');
            fakeConsole.error('hello more errors');       // only ERROR is logged
            fakeConsole.error('~`!@#$%^&*()_+-=;":/?.>,<[]{}|\'\\\n <div>Test & test</div>');

            var logArray = logHandler.getLogBundleAsArray();
            console.debug(JSON.stringify(logArray));
            var observer = logHandler.sendLogsToServer(/** debug*/ true);

            observer.done(function(result) {
                console.debug('result = ' + result);
                expect(observer.payload).toBeDefined();
                var logEntries = observer.payload.logBundles[0].logEntries;
                expect(logEntries[0].color).toEqual('red');
                expect(logEntries[1].color).toEqual('red');
                expect(logEntries[2].color).toEqual('red');
                expect(logEntries[0].encodedData).toEqual('hello test');
                expect(logEntries[1].encodedData).toEqual('hello error');
                expect(logEntries[2].encodedData).toEqual('hello more errors');
                var unencodedData = HTMLDecodeHelper.htmlDecode(logEntries[3].encodedData);
                expect(unencodedData).toEqual('~`!@#$%^&*()_+-=;":/?.>,<[]{}|\'\\\n <div>Test & test</div>');
                done();
            });


        });

        it("should attempt to send error logs to a server twice!", function(done) {
            logHandler.init({
                "captureLogs": true,
                "logStorerClassName" : "JsonLogStorer",
                "logLevel": SageLog.ERROR,
                "server": requestUrl
            });

            fakeConsole.error('hello error');             // only ERROR is logged

            var logArray = logHandler.getLogBundleAsArray();
            console.debug(JSON.stringify(logArray));
            var observer = logHandler.sendLogsToServer(/** debug*/ true);

            observer.done(function(result) {
                console.debug('result = ' + result);
                expect(observer.payload).toBeDefined();
                var logEntries = observer.payload.logBundles[0].logEntries;
                expect(logEntries[0].color).toEqual('red');
                expect(logEntries[0].encodedData).toEqual('hello error');
                
                var observer2 = logHandler.sendLogsToServer(/** debug*/ true);
                observer2.done(function(result) {
                    console.debug('result2 = ' + result);
                    var logEntries2 = observer2.payload.logBundles[0].logEntries;
                    expect(logEntries[0].color).toEqual('red');
                    expect(logEntries[0].encodedData).toEqual('hello error');
                    done();
                });
            });
        });
    });
});