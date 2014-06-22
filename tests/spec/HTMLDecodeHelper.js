// HTMLDecodeHelper.js


(function() {

	function HTMLDecodeHelper() {};


	/**
	 * Decode encoded HTML by using the DOM as an actual decoding tool. 
	 * See http://stackoverflow.com/a/1249234/552792 for details.
	 *
	 * @param {String} input The encoded HTML to decode.
	 * @return {String} The decoded HTML.
	 */
	HTMLDecodeHelper.htmlDecode = function(input){
	    var e = document.createElement('div');
	    e.innerHTML = input;
	    return e.childNodes[0].nodeValue;
	};


	window.HTMLDecodeHelper = HTMLDecodeHelper;
})();