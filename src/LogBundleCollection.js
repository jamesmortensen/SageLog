// LogBundleCollection.js


/**
 * This holds a collection of logs from different contexts. A context is 
 * a parent window, iframe, or a child window.
 *
 */
 function LogBundleCollection() {
 	this.name = "LogBundleCollection";

 	var logBundleCollection = {};


	/**
	 * Get the number of log bundles collected and currently stored.
	 *
	 * @return {number} The number of different pages from which logs have been collected.
	 */
	function size() {
	    return logHandler.logBundleCollection.length;
	};
	

 	this.addLogBundleCollection = function(collectionName, logCollection) {
 		logBundleCollection[collectionName] = logCollection;
 	};
 }