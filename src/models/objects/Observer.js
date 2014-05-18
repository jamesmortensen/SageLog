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
	var data = {};
	var notify = null;


	/**
	 * Stores a data object and sends it to the done handler.
	 *
	 * @this {Observer}
	 * @param {Object} dataObj The object retrieved from the asynchronous operation.
	 * @throws {Error} error The done callback method is required and must be set prior to setting the data object.
	 */
	this.resolve = function(dataObj) {
		data = dataObj;
		if(notify)
		    notify(data);
		else
			throw new Error("Must set a 'done' callback prior to setting data.");
	}


	/**
	 * Registers a callback handler, which fires as soon as the data object is stored. This notifies listeners
	 * that data is available.
	 *
	 * @this {Observer}
	 * @param {Function} callback The function to be called when the data object becomes available.
	 */
	this.done = function(callback) {
		if(callback) notify = callback;
	}
};