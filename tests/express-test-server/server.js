// server.js

/**
 * Module dependencies.
 */
var express = require('express');
var logger = require('morgan');
var api = express();


/**
 * api middleware
 */
api.use(logger('dev'));


/**
 * CORS support. For possibly expanding tests to include AJAX.
 */
api.all('*', function(req, res, next){
  if (!req.get('Origin')) return next();
  // use "*" here to accept any origin
  res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  // res.set('Access-Control-Allow-Max-Age', 3600);
  if ('OPTIONS' == req.method) return res.send(200);
  next();
});


/**
 * Simulates receiving logs in JSON format and returns a handshake/200 OK.
 */
api.get('/sagelog.js', function(req, res) {
  if(req.query.callback === undefined) throw Error('query parameter "callback" is missing.');
  if(req.query.json === undefined) throw Error('query parameter "json" is missing.');
  var callback = req.query.callback;
  var jsonObject = JSON.parse(req.query.json);
  res.jsonp({
    handshake: jsonObject.handshake
  });
});


/**
 * Echo server to respond with whatever data is sent.
 */
api.get('/echo.js', function(req, res) {
  if(req.query.callback === undefined) throw Error('query parameter "callback" is missing.');
  if(req.query.json === undefined) throw Error('query parameter "json" is missing.');
  var jsonObject = JSON.parse(req.query.json);
  res.jsonp(jsonObject);
});


api.listen(3001);

console.log('express JSONP test server listening on 3001');
