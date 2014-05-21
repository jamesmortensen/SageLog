// LogEmitter.js

function LogEmitter() {}

LogEmitter.prototype.logMessage = function(legacyFn, _this, consoleLogArguments) {
	legacyFn.apply(_this, consoleLogArguments);
};