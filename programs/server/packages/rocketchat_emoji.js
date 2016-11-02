(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var renderMessageBody = Package['rocketchat:ui-message'].renderMessageBody;
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
var renderEmoji;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:emoji":{"loadStylesheet.js":function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/rocketchat_emoji/loadStylesheet.js                       //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
RocketChat.theme.addPackageAsset(function () {                       // 1
	return Assets.getText('emojiPicker.less');                          // 2
});                                                                  // 3
///////////////////////////////////////////////////////////////////////

}}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/rocketchat:emoji/loadStylesheet.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['rocketchat:emoji'] = {}, {
  renderEmoji: renderEmoji
});

})();

//# sourceMappingURL=rocketchat_emoji.js.map
