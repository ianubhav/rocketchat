(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/rocketchat_cors/cors.coffee.js                                                                //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var _staticFilesMiddleware, httpServer, oldHttpServerListeners, url;                                      // 4
                                                                                                          //
WebApp.rawConnectHandlers.use(function(req, res, next) {                                                  // 4
  var buf, ref;                                                                                           // 5
  if (req._body) {                                                                                        //
    return next();                                                                                        // 6
  }                                                                                                       //
  if (req.headers['transfer-encoding'] === void 0 && isNaN(req.headers['content-length'])) {              //
    return next();                                                                                        // 9
  }                                                                                                       //
  if ((ref = req.headers['content-type']) !== '' && ref !== (void 0)) {                                   //
    return next();                                                                                        // 12
  }                                                                                                       //
  if (req.url.indexOf('/ufs/') === 0) {                                                                   //
    return next();                                                                                        // 15
  }                                                                                                       //
  buf = '';                                                                                               //
  req.setEncoding('utf8');                                                                                //
  req.on('data', function(chunk) {                                                                        //
    return buf += chunk;                                                                                  //
  });                                                                                                     //
  return req.on('end', function() {                                                                       //
    var err;                                                                                              // 21
    if (((typeof RocketChat !== "undefined" && RocketChat !== null ? RocketChat.debugLevel : void 0) != null) && RocketChat.debugLevel === 'debug') {
      console.log('[request]'.green, req.method, req.url, '\nheaders ->', req.headers, '\nbody ->', buf);
    }                                                                                                     //
    try {                                                                                                 // 24
      req.body = JSON.parse(buf);                                                                         //
    } catch (error) {                                                                                     //
      err = error;                                                                                        //
      req.body = buf;                                                                                     //
    }                                                                                                     //
    req._body = true;                                                                                     //
    return next();                                                                                        //
  });                                                                                                     //
});                                                                                                       // 4
                                                                                                          //
WebApp.rawConnectHandlers.use(function(req, res, next) {                                                  // 33
  var setHeader;                                                                                          // 34
  if (/^\/(api|_timesync|sockjs|tap-i18n|__cordova)(\/|$)/.test(req.url)) {                               //
    res.setHeader("Access-Control-Allow-Origin", "*");                                                    //
  }                                                                                                       //
  setHeader = res.setHeader;                                                                              //
  res.setHeader = function(key, val) {                                                                    //
    if (key.toLowerCase() === 'access-control-allow-origin' && val === 'http://meteor.local') {           //
      return;                                                                                             // 41
    }                                                                                                     //
    return setHeader.apply(this, arguments);                                                              // 42
  };                                                                                                      //
  return next();                                                                                          // 44
});                                                                                                       // 33
                                                                                                          //
_staticFilesMiddleware = WebAppInternals.staticFilesMiddleware;                                           // 46
                                                                                                          //
WebAppInternals._staticFilesMiddleware = function(staticFiles, req, res, next) {                          // 47
  res.setHeader("Access-Control-Allow-Origin", "*");                                                      //
  return _staticFilesMiddleware(staticFiles, req, res, next);                                             //
};                                                                                                        // 47
                                                                                                          //
url = Npm.require("url");                                                                                 // 52
                                                                                                          //
httpServer = WebApp.httpServer;                                                                           // 54
                                                                                                          //
oldHttpServerListeners = httpServer.listeners('request').slice(0);                                        // 55
                                                                                                          //
httpServer.removeAllListeners('request');                                                                 // 56
                                                                                                          //
httpServer.addListener('request', function(req, res) {                                                    // 58
  var args, host, isLocal, isSsl, localhostRegexp, localhostTest, next, remoteAddress;                    // 59
  args = arguments;                                                                                       //
  next = function() {                                                                                     //
    var i, len, oldListener, results;                                                                     // 61
    results = [];                                                                                         // 61
    for (i = 0, len = oldHttpServerListeners.length; i < len; i++) {                                      //
      oldListener = oldHttpServerListeners[i];                                                            //
      results.push(oldListener.apply(httpServer, args));                                                  //
    }                                                                                                     // 61
    return results;                                                                                       //
  };                                                                                                      //
  if (RocketChat.settings.get('Force_SSL') !== true) {                                                    //
    next();                                                                                               //
    return;                                                                                               // 66
  }                                                                                                       //
  remoteAddress = req.connection.remoteAddress || req.socket.remoteAddress;                               //
  localhostRegexp = /^\s*(127\.0\.0\.1|::1)\s*$/;                                                         //
  localhostTest = function(x) {                                                                           //
    return localhostRegexp.test(x);                                                                       // 72
  };                                                                                                      //
  isLocal = localhostRegexp.test(remoteAddress) && (!req.headers['x-forwarded-for'] || _.all(req.headers['x-forwarded-for'].split(','), localhostTest));
  isSsl = req.connection.pair || (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'].indexOf('https') !== -1);
  if (((typeof RocketChat !== "undefined" && RocketChat !== null ? RocketChat.debugLevel : void 0) != null) && RocketChat.debugLevel === 'debug') {
    console.log('req.url', req.url);                                                                      //
    console.log('remoteAddress', remoteAddress);                                                          //
    console.log('isLocal', isLocal);                                                                      //
    console.log('isSsl', isSsl);                                                                          //
    console.log('req.headers', req.headers);                                                              //
  }                                                                                                       //
  if (!isLocal && !isSsl) {                                                                               //
    host = req.headers['host'] || url.parse(Meteor.absoluteUrl()).hostname;                               //
    host = host.replace(/:\d+$/, '');                                                                     //
    res.writeHead(302, {                                                                                  //
      'Location': 'https://' + host + req.url                                                             //
    });                                                                                                   //
    res.end();                                                                                            //
    return;                                                                                               // 93
  }                                                                                                       //
  return next();                                                                                          //
});                                                                                                       // 58
                                                                                                          //
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/rocketchat_cors/common.coffee.js                                                              //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                                                               // 1
  return RocketChat.settings.onload('Force_SSL', function(key, value) {                                   //
    return Meteor.absoluteUrl.defaultOptions.secure = value;                                              //
  });                                                                                                     //
});                                                                                                       // 1
                                                                                                          //
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:cors'] = {};

})();

//# sourceMappingURL=rocketchat_cors.js.map
