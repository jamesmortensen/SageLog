// JSONPDAOSpec.js

describe('JSONPDAO', function() {
	'use strict';

	var jsonpDao,
		httpMethod = 'GET',
		dataPayload,
		requestUrl;

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
	 		expect(1).toEqual(1);
	 		done();
	 	});
	});

	it('should send data to the server and echo a response', function() {
		requestUrl = 'http://localhost:3001/echo.js';
	 	
	 	var observer = jsonpDao.send(requestUrl, null, httpMethod, dataPayload);

	 	observer.done(function(data) {
	 		console.debug('got back the response with handshake id = ' + data.handshake);
	 		console.debug('got back the response with color = ' + data.message.color);
	 	})
	});

	it('should pass in string data to send to the server and echo a response', function() {
		requestUrl = 'http://localhost:3001/echo.js';
	 	dataPayload = JSON.stringify(dataPayload);
	 	var observer = jsonpDao.send(requestUrl, null, httpMethod, dataPayload);

	 	observer.done(function(data) {
	 		console.debug('got back the response with handshake id = ' + data.handshake);
	 		console.debug('got back the response with color = ' + data.message.color);
	 	})
	});
});