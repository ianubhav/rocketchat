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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:autolinker":{"settings.js":function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/rocketchat_autolinker/settings.js                        //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
Meteor.startup(function () {                                         // 1
	RocketChat.settings.add('AutoLinker_StripPrefix', false, { type: 'boolean', group: 'Message', section: 'AutoLinker', 'public': true, i18nDescription: 'AutoLinker_StripPrefix_Description' });
	RocketChat.settings.add('AutoLinker_Urls_Scheme', true, { type: 'boolean', group: 'Message', section: 'AutoLinker', 'public': true });
	RocketChat.settings.add('AutoLinker_Urls_www', true, { type: 'boolean', group: 'Message', section: 'AutoLinker', 'public': true });
	RocketChat.settings.add('AutoLinker_Urls_TLD', true, { type: 'boolean', group: 'Message', section: 'AutoLinker', 'public': true });
	RocketChat.settings.add('AutoLinker_UrlsRegExp', '(://|www\\.).+', { type: 'string', group: 'Message', section: 'AutoLinker', 'public': true });
	RocketChat.settings.add('AutoLinker_Email', true, { type: 'boolean', group: 'Message', section: 'AutoLinker', 'public': true });
	RocketChat.settings.add('AutoLinker_Phone', true, { type: 'boolean', group: 'Message', section: 'AutoLinker', 'public': true, i18nDescription: 'AutoLinker_Phone_Description' });
});                                                                  // 9
///////////////////////////////////////////////////////////////////////

}}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/rocketchat:autolinker/settings.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:autolinker'] = {};

})();

//# sourceMappingURL=rocketchat_autolinker.js.map
