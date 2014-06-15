// JSONPDAO.js

function JSONPDAO() {
};


/**
 * send data to a server using JavaScript script tag remoting / JSONP.
 *
 * @this {JSONPDAO}
 * @param {String} requestUrl The location of the resource represented by a url.
 * @param {String} authorizationKey Key used to authenticate the request.
 * @param {String} httpMethod The HTTP method, one of GET, POST, PUT, HEAD, DELETE, CREATE, UPDATE. Default is GET.
 * @param {Object} dataPayload The object to send, if doing a POST or PUT operation.
 * @param {Observer} observer The container returned back to the service layer with data used to execute business logic.
 * @param {XMLHttpRequest} _XMLHttpRequest The XMLHttpRequest object used to make the request (or simulate it for testing).
 * @return {Deferred} promise The object containing done, fail, and always callback handlers.
 */
JSONPDAO.prototype.send = function(requestUrl, authorizationKey, httpMethod, dataPayload, observer) {
	observer = observer || new Observer();
	var callbackObserver = new Observer();
	var jsonPayload = { handshake: new Date().getTime() };
	if(typeof dataPayload === 'undefined') throw new TypeError('dataPayload must be a JSON object.');
	if(typeof dataPayload == 'object') {
		jsonPayload.message = dataPayload;
	} else {
		jsonPayload.message = JSON.parse(dataPayload);
	}
	var payloadString = JSON.stringify(jsonPayload);
	var uriEncodedPayloadString = encodeURIComponent(payloadString);
	//var uriEncodedPayloadString = encodeURI(payloadString);

	/**
	 * Using time as handshake id leads to collisions if 2 requests are made within a millisecond, so
	 * account for collisions by adding an extra meta id.
	 */
	var handleCollisions = function(handshake, count) {
		var global_observer = 'global_observer' + handshake + '_' + count;
	    if(JSONPDAO[global_observer] !== undefined) {
			return handleCollisions(handshake, ++count);
		} else {
			return global_observer;
		}
	};

	//var global_observer = 'global_observer' + jsonPayload.handshake;
	var global_observer = handleCollisions(jsonPayload.handshake, 0);
	var callback = 'JSONPDAO.' + global_observer + '.resolve';
	var fullUrl = requestUrl + '?callback=' + callback + '&json=' + uriEncodedPayloadString;
	
	var script = document.createElement("script");
	script.setAttribute("type", "text/javascript");
	script.setAttribute("src", fullUrl);
	document.body.appendChild(script);

	/**
	 * Make sure other callbacks are called first, prior to clearing out the global callback scope.
	 */
	JSONPDAO[global_observer] = callbackObserver;
	JSONPDAO[global_observer].done(function(data) {
		observer.resolve(data).done(function() {
			delete JSONPDAO[global_observer];
		});
	});

	return observer;

};


//JSONPDAO.global_observer = {};