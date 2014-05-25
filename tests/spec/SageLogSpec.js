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
    var logHandler;
    

    describe("Collecting logs", function() {


        beforeEach(function() {
    	    fakeConsole = FakeConsoleHelper.makeFakeConsole(masterFakeConsole);     // make fake console copy
    	    logHandler = new SageLog(fakeConsole);
    	});


        it("should log and collect everything", function(done) {
            
            logHandler.init({
                "captureLogs": true, 
                "logLevel": SageLog.DEBUG
            });

            fakeConsole.info('hello world');
            fakeConsole.error('hello test');       // only ERROR is logged
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
    			"logLevel": SageLog.INFO
    		});
        	
        	fakeConsole.info('hello world');
        	fakeConsole.error('hello test');
        	fakeConsole.log('hello nobody');
        	fakeConsole.debug('hello invisible');
        	fakeConsole.warn('hello careful');

        	logHandler.sendLogsToServer();
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
    			"logLevel": SageLog.ERROR
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
    			"logLevel": 0
    		});
        	
        	fakeConsole.info({name: "James"});
        	var logArray = logHandler.getLogBundleAsArray();

    		console.debug("logsCollected length = " + logArray.length + " (should be 0)");
        	expect(logArray.length).toEqual(0);
        });


        /*it("Should throw an error in the console and also store that error", function() {
        	// TODO: Need to get this working
        	//ttt();
        	//console.log('logs after error = ' + logHandler.getLogBundleAsArray().length);
        });

        it("should show an error in the logs", function() {
    		//console.log('logs after error = ' + logHandler.getLogBundleAsArray().length);
        });*/

        // Uncomment to run performance tests
        /*it("Should be able to handle 10000 log entries without performance degradation", function() {

            var start = new Date().getTime();
            logHandler.init({
                "captureLogs": true, 
                "logLevel": 0
            });

            for(var i = 0; i < 10000; i++) {
                fakeConsole.info("This is an automated test message number " + i);
            }

            var stop = new Date().getTime();
            console.debug("Total Run Time = " + (stop - start) + "ms");
        });*/

    });

    describe("Collecting Logs as JSON objects", function() {

        beforeEach(function() {
            fakeConsole = FakeConsoleHelper.makeFakeConsole(masterFakeConsole);     // make fake console copy
            logHandler = new SageLog(fakeConsole);
        });

        it("should store INFO logs only, and 2 entries", function() {
            logHandler.init({
                "captureLogs": true,
                "logStorerClassName" : "JsonLogStorer",
                "logLevel": SageLog.INFO
            });

            fakeConsole.info('hello world');
            fakeConsole.error('hello test');       // only ERROR is logged
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
            fakeConsole.error('hello test');       // only ERROR is logged
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
    });
});