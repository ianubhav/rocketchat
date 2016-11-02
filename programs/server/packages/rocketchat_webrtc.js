(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var __coffeescriptShare, WebRTC;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/rocketchat_webrtc/server/settings.coffee.js              //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.settings.addGroup('WebRTC', function() {                  // 1
  this.add('WebRTC_Enable_Channel', false, {                         //
    type: 'boolean',                                                 //
    group: 'WebRTC',                                                 //
    "public": true                                                   //
  });                                                                //
  this.add('WebRTC_Enable_Private', true, {                          //
    type: 'boolean',                                                 //
    group: 'WebRTC',                                                 //
    "public": true                                                   //
  });                                                                //
  this.add('WebRTC_Enable_Direct', true, {                           //
    type: 'boolean',                                                 //
    group: 'WebRTC',                                                 //
    "public": true                                                   //
  });                                                                //
  return this.add('WebRTC_Servers', 'stun:stun.l.google.com:19302, stun:23.21.150.121, team%40rocket.chat:demo@turn:numb.viagenie.ca:3478', {
    type: 'string',                                                  //
    group: 'WebRTC',                                                 //
    "public": true                                                   //
  });                                                                //
});                                                                  // 1
                                                                     //
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['rocketchat:webrtc'] = {}, {
  WebRTC: WebRTC
});

})();

//# sourceMappingURL=rocketchat_webrtc.js.map
