// XMLHttpDAO.js

/**
 * Creates an instance of a XMLHttpDAO object. The purpose of this object is to act as a superclass to
 * other DAO objects to wrap common XMLHttpRequest functionality.
 *
 * @constructor
 * @this {ContactsDAO}
 * @param {} null Nothing
 */
function XMLHttpDAO() {
	this.constructor = function XMLHttpDAO() { };
	XMLHttpDAO.prototype.GET = "GET";
	XMLHttpDAO.prototype.POST = "POST";
	XMLHttpDAO.prototype.PUT = "PUT";
}


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
XMLHttpDAO.prototype.send = function(requestUrl, authorizationKey, httpMethod, dataPayload, observer, _XMLHttpRequest) {
	_XMLHttpRequest = _XMLHttpRequest || XMLHttpRequest;
	httpMethod = httpMethod || 'GET';
	observer = observer || new Observer();

    var xhr = new _XMLHttpRequest();
  	xhr.onreadystatechange = function() {
  		if(xhr.readyState == 4 && xhr.status == 200) {
            var contentType = xhr.getResponseHeader('content-type');
            var results = null;
        if(contentType.match(/text\/plain/) != null) {
            results = xhr.responseText;
        } else { // assume application/json
  			results = JSON.parse(xhr.responseText);
        }
  			observer.resolve(results);
  		}
  	}
  	xhr.open(httpMethod, requestUrl);
  	xhr.setRequestHeader('http_authorization', authorizationKey);
  	xhr.setRequestHeader('Content-Type', 'application/json');
  	xhr.send(JSON.stringify(dataPayload));

  	return observer;
};
