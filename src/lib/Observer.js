// Observer.js

/**
 * Creates an instance of an Observer object. The purpose of this object is to act as a container for
 * transporting data asynchronously from the model to the controller, or from lower level model services
 * to higher level model services.
 *
 * @constructor
 * @this {Observer}
 * @param {} null Nothing
 */
function Observer() {
	this.constructor = function Observer() { };
	var alwaysCallbacks = [];
	var data = {};
	var errors = [];
	var notify = [];
	var internalState = 'pending';


	this.always = function(callback) {
		if(callback) alwaysCallbacks.push(callback);
	};


	/**
	 * Registers a callback handler, which fires as soon as the data object is stored. This notifies listeners
	 * that data is available.
	 *
	 * @this {Observer}
	 * @param {Function} callback The function to be called when the data object becomes available.
	 */
	this.done = function(callback) {
		if(callback)
			internalState == 'pending' ? notify.push(callback) : callback(data);
	};


	/**
	 * Registers a callback handler, which fires as soon as an error condition is met. This notifies listeners
	 * that there was an error.
	 *
	 * @this {Observer}
	 * @param {Function} callback The function to be called when an error condition occurs.
	 */
	 this.fail = function(callback) {
	 	if(callback)
	 		internalState == 'pending' ? errors.push(callback) : callback(data);
	 };


	 function fireAlways() {
	 	if(alwaysCallbacks.length > 0) {
		    alwaysCallbacks.forEach(function(element, index, array) {
		        element();
		    });
		}
	 };


	/**
	 * Stores a data object and sends it to the fail handler.
	 *
	 * @this {Observer}
	 * @param {Object} dataObj The object containing information about the error.
	 * @throws {Error} error The fail callback method is optional, and should be set prior to setting the data object.
	 */
	this.reject = function(dataObj) {
		data = dataObj;
		if(errors.length > 0) {
		    errors.forEach(function(element, index, array) {
		        element(data);
		    });
		    fireAlways();
		}
		else
			throw new Error("An unknown error occurred, but there are no handlers to process the error.");
		internalState = 'rejected';
		return this;
	};


	/**
	 * Stores a data object and sends it to the done handler.
	 *
	 * @this {Observer}
	 * @param {Object} dataObj The object retrieved from the asynchronous operation.
	 * @throws {Error} error The done callback method is required and must be set prior to setting the data object.
	 */
	this.resolve = function(dataObj) {
		data = dataObj;
		if(notify.length > 0) {
		    notify.forEach(function(element, index, array) {
		        element(data);
		    });
		    fireAlways();
		}
		else
			throw new Error("Must set a 'done' callback prior to setting data.");
		internalState = 'resolved';
		return this;
	};


	this.state = function() {
		return internalState;
	};


	this.then = function(callback) {
		if(callback) notify = callback;	
	};
};
