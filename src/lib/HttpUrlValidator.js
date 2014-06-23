// HttpUrlValidator.js


function HttpUrlValidator() {};


/**
 * See http://stackoverflow.com/a/14582229/552792
 */
HttpUrlValidator.isUrlValid = function(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' +              // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' +   // domain name, no TLD required
	    '((\\d{1,3}\\.){3}\\d{1,3}))' +                         // OR ip (v4) address
	    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +                     // port and path
	    '(\\?[;&a-z\\d%_.~+=-]*)?' +                            // query string
	    '(\\#[-a-z\\d_]*)?$','i');                              // fragment locator
    if(!pattern.test(str)) {
        return false;
    } else {
        return true;
    }
};