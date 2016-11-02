(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:tooltip":{"loadStylesheet.js":function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/rocketchat_tooltip/loadStylesheet.js                     //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
RocketChat.theme.addPackageAsset(function () {                       // 1
	return Assets.getText('tooltip.less');                              // 2
});                                                                  // 3
///////////////////////////////////////////////////////////////////////

}}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/rocketchat:tooltip/loadStylesheet.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:tooltip'] = {};

})();

//# sourceMappingURL=rocketchat_tooltip.js.map
