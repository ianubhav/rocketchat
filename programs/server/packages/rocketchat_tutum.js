(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/rocketchat_tutum/startup.coffee.js                                                          //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                                                                                                        //
/* Examples                                                                                             // 1
                                                                                                        //
DOCKERCLOUD_REDIS_HOST=redis://:password@host:6379                                                      //
DOCKERCLOUD_CLIENT_NAME=mywebsite                                                                       //
DOCKERCLOUD_CLIENT_HOST=mywebsite.dotcloud.com                                                          //
 */                                                                                                     //
var client, port, redis;                                                                                // 1
                                                                                                        //
if (process.env.DOCKERCLOUD_REDIS_HOST != null) {                                                       // 8
  redis = Npm.require('redis');                                                                         //
  client = redis.createClient(process.env.DOCKERCLOUD_REDIS_HOST);                                      //
  client.on('error', function(err) {                                                                    //
    return console.log('Redis error ->', err);                                                          //
  });                                                                                                   //
  client.del("frontend:" + process.env.DOCKERCLOUD_CLIENT_HOST);                                        //
  client.rpush("frontend:" + process.env.DOCKERCLOUD_CLIENT_HOST, process.env.DOCKERCLOUD_CLIENT_NAME);
  port = process.env.PORT || 3000;                                                                      //
  client.rpush("frontend:" + process.env.DOCKERCLOUD_CLIENT_HOST, "http://" + (process.env.DOCKERCLOUD_IP_ADDRESS.split('/')[0]) + ":" + port);
  process.on('SIGTERM', function() {                                                                    //
    return client.expire("frontend:" + process.env.DOCKERCLOUD_CLIENT_HOST, 90);                        //
  });                                                                                                   //
  process.on('SIGINT', function() {                                                                     //
    return client.expire("frontend:" + process.env.DOCKERCLOUD_CLIENT_HOST, 90);                        //
  });                                                                                                   //
}                                                                                                       //
                                                                                                        //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:tutum'] = {};

})();

//# sourceMappingURL=rocketchat_tutum.js.map
