// LogEmitter.js

function LogEmitter() {}

LogEmitter.prototype.logMessage = function(legacyFn, _this, args) {
	legacyFn.apply(_this, args);
};