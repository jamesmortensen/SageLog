// JSONPDAO.js

function JSONPDAO() {

};


/**
 * send data to a server.
 *
 * @this {XMLHttpDAO}
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
	var jsonPayload;
	if(typeof dataPayload === 'undefined') throw new TypeError('dataPayload must be a JSON object.');
	if(typeof dataPayload == 'object') {
		payloadString = JSON.stringify(dataPayload);
	} else {
		payloadString = dataPayload;
	}

	var fullUrl = requestUrl + callback + payloadString;
	
	var script = document.createElement("script");
	script.setAttribute("type", "text/javascript");
	script.setAttribute("src", fullUrl);
	document.body.appendChild(script);

};