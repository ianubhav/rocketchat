(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var meteorInstall = Package.modules.meteorInstall;
var Buffer = Package.modules.Buffer;
var process = Package.modules.process;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:ui-vrecord":{"server":{"settings.coffee.js":function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/rocketchat_ui-vrecord/server/settings.coffee.js          //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.settings.addGroup('Message', function() {                 // 1
  return this.add('Message_VideoRecorderEnabled', true, {            //
    type: 'boolean',                                                 //
    "public": true,                                                  //
    i18nDescription: 'Message_VideoRecorderEnabledDescription'       //
  });                                                                //
});                                                                  // 1
                                                                     //
///////////////////////////////////////////////////////////////////////

}},"loadStylesheet.coffee.js":function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/rocketchat_ui-vrecord/loadStylesheet.coffee.js           //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.theme.addPackageAsset(function() {                        // 1
  return Assets.getText('client/vrecord.less');                      // 2
});                                                                  // 1
                                                                     //
///////////////////////////////////////////////////////////////////////

}}}}},{"extensions":[".js",".json",".coffee"]});
require("./node_modules/meteor/rocketchat:ui-vrecord/server/settings.coffee.js");
require("./node_modules/meteor/rocketchat:ui-vrecord/loadStylesheet.coffee.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:ui-vrecord'] = {};

})();

//# sourceMappingURL=rocketchat_ui-vrecord.js.map
