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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:action-links":{"loadStylesheets.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/rocketchat_action-links/loadStylesheets.js                                                          //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
RocketChat.theme.addPackageAsset(function () {                                                                  // 1
	return Assets.getText('client/stylesheets/actionLinks.less');                                                  // 2
});                                                                                                             // 3
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"server":{"registerActionLinkFuncts.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/rocketchat_action-links/server/registerActionLinkFuncts.js                                          //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
//Action Links namespace creation.                                                                              // 1
                                                                                                                //
RocketChat.actionLinks = {                                                                                      // 3
	register: function () {                                                                                        // 4
		function register(name, funct) {                                                                              // 4
			RocketChat.actionLinks[name] = funct;                                                                        // 5
		}                                                                                                             // 6
                                                                                                                //
		return register;                                                                                              // 4
	}()                                                                                                            // 4
};                                                                                                              // 3
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"actionLinkHandler.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/rocketchat_action-links/server/actionLinkHandler.js                                                 //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
//Action Links Handler. This method will be called off the client.                                              // 1
                                                                                                                //
Meteor.methods({                                                                                                // 3
	actionLinkHandler: function () {                                                                               // 4
		function actionLinkHandler(name, messageId) {                                                                 // 3
			if (!Meteor.userId()) {                                                                                      // 5
				throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'actionLinkHandler' });              // 6
			}                                                                                                            // 7
                                                                                                                //
			var message = RocketChat.models.Messages.findOne({ _id: messageId });                                        // 9
			if (!message) {                                                                                              // 10
				throw new Meteor.Error('error-invalid-message', 'Invalid message', { method: 'actionLinkHandler' });        // 11
			}                                                                                                            // 12
                                                                                                                //
			var actionLink = message.actionLinks[name];                                                                  // 14
			if (!message.actionLinks || !actionLink || !RocketChat.actionLinks || !RocketChat.actionLinks[actionLink.method_id]) {
				throw new Meteor.Error('error-invalid-actionlink', 'Invalid action link', { method: 'actionLinkHandler' });
			}                                                                                                            // 17
                                                                                                                //
			var room = RocketChat.models.Rooms.findOne({ _id: message.rid });                                            // 19
			if (Array.isArray(room.usernames) && room.usernames.indexOf(Meteor.user().username) === -1) {                // 20
				throw new Meteor.Error('error-not-allowed', 'Not allowed', { method: 'actionLinkHandler' });                // 21
			}                                                                                                            // 22
                                                                                                                //
			RocketChat.actionLinks[actionLink.method_id](message, actionLink.params);                                    // 24
		}                                                                                                             // 25
                                                                                                                //
		return actionLinkHandler;                                                                                     // 3
	}()                                                                                                            // 3
});                                                                                                             // 3
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/rocketchat:action-links/loadStylesheets.js");
require("./node_modules/meteor/rocketchat:action-links/server/registerActionLinkFuncts.js");
require("./node_modules/meteor/rocketchat:action-links/server/actionLinkHandler.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:action-links'] = {};

})();

//# sourceMappingURL=rocketchat_action-links.js.map
