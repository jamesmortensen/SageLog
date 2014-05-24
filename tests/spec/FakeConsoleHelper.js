// FakeConsoleHelper.js


(function() {

	function FakeConsoleHelper() {};


	/**
	 * Takes the console object as an argument and creates a copy that can be overridden without
	 * affecting the default console object and its methods.
	 *
	 * @param {Object} _console The native console object containing log, info, warn, error, etc. methods.
	 * @return A cloned object containing the same functionality and properties as console.
	 */
	FakeConsoleHelper.makeFakeConsole = function(_console) {
	  var clonedConsole = new function FakeConsole(){};
	  for(var k in _console) {
	  	  if(typeof _console[k] == 'function') {
	  	  	  //console.debug("override function: " + _console[k]);
	  	  	  var matchedNativeCodeArray = _console[k].toString().match(/function\s(.*?)\(\)\s{(\s*?)\[native\scode](\s.*?)\}$/);
	  	  	  var matchedFakeConsoleArray = _console[k].toString().match(/function\s(.*?)\(\)\s{\sconsole\.(.*?)\.apply\(console,\sarguments\);\s\}/);
	  	  	  if(matchedNativeCodeArray == null && matchedFakeConsoleArray == null) {
	  	  	      throw new TypeError("Can't clone an object with non-native methods like " + _console[k] + ". The object to clone must contain only native code.");
	  	  	  }
	  	  }
	      if(_console[k].name !== undefined) {
	          clonedConsole[k] = new Function(
	             "return function " + _console[k].name + "() { console."+_console[k].name+".apply(console, arguments); }"
	          )();
	      }
	  }
	  return clonedConsole;
	};


	window.FakeConsoleHelper = FakeConsoleHelper;
})();