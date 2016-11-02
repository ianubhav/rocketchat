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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:reactions":{"server":{"models":{"Messages.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/rocketchat_reactions/server/models/Messages.js                                                         //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
RocketChat.models.Messages.setReactions = function (messageId, reactions) {                                        // 1
	return this.update({ _id: messageId }, { $set: { reactions: reactions } });                                       // 2
};                                                                                                                 // 3
                                                                                                                   //
RocketChat.models.Messages.unsetReactions = function (messageId) {                                                 // 5
	return this.update({ _id: messageId }, { $unset: { reactions: 1 } });                                             // 6
};                                                                                                                 // 7
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"setReaction.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/rocketchat_reactions/setReaction.js                                                                    //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
/* globals msgStream */                                                                                            // 1
Meteor.methods({                                                                                                   // 2
	setReaction: function () {                                                                                        // 3
		function setReaction(reaction, messageId) {                                                                      // 2
			if (!Meteor.userId()) {                                                                                         // 4
				throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'setReaction' });                       // 5
			}                                                                                                               // 6
                                                                                                                   //
			var message = RocketChat.models.Messages.findOneById(messageId);                                                // 8
                                                                                                                   //
			var room = Meteor.call('canAccessRoom', message.rid, Meteor.userId());                                          // 10
                                                                                                                   //
			if (!room) {                                                                                                    // 12
				throw new Meteor.Error('error-not-allowed', 'Not allowed', { method: 'setReaction' });                         // 13
			}                                                                                                               // 14
                                                                                                                   //
			var user = Meteor.user();                                                                                       // 16
                                                                                                                   //
			if (Array.isArray(room.muted) && room.muted.indexOf(user.username) !== -1) {                                    // 18
				RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {                                              // 19
					_id: Random.id(),                                                                                             // 20
					rid: room._id,                                                                                                // 21
					ts: new Date(),                                                                                               // 22
					msg: TAPi18n.__('You_have_been_muted', {}, user.language)                                                     // 23
				});                                                                                                            // 19
				return false;                                                                                                  // 25
			} else if (!RocketChat.models.Subscriptions.findOne({ rid: message.rid })) {                                    // 26
				return false;                                                                                                  // 27
			}                                                                                                               // 28
                                                                                                                   //
			if (message.reactions && message.reactions[reaction] && message.reactions[reaction].usernames.indexOf(user.username) !== -1) {
				message.reactions[reaction].usernames.splice(message.reactions[reaction].usernames.indexOf(user.username), 1);
                                                                                                                   //
				if (message.reactions[reaction].usernames.length === 0) {                                                      // 33
					delete message.reactions[reaction];                                                                           // 34
				}                                                                                                              // 35
                                                                                                                   //
				if (_.isEmpty(message.reactions)) {                                                                            // 37
					delete message.reactions;                                                                                     // 38
					RocketChat.models.Messages.unsetReactions(messageId);                                                         // 39
				} else {                                                                                                       // 40
					RocketChat.models.Messages.setReactions(messageId, message.reactions);                                        // 41
				}                                                                                                              // 42
			} else {                                                                                                        // 43
				if (!message.reactions) {                                                                                      // 44
					message.reactions = {};                                                                                       // 45
				}                                                                                                              // 46
				if (!message.reactions[reaction]) {                                                                            // 47
					message.reactions[reaction] = {                                                                               // 48
						usernames: []                                                                                                // 49
					};                                                                                                            // 48
				}                                                                                                              // 51
				message.reactions[reaction].usernames.push(user.username);                                                     // 52
                                                                                                                   //
				RocketChat.models.Messages.setReactions(messageId, message.reactions);                                         // 54
			}                                                                                                               // 55
                                                                                                                   //
			msgStream.emit(message.rid, message);                                                                           // 57
                                                                                                                   //
			return;                                                                                                         // 59
		}                                                                                                                // 60
                                                                                                                   //
		return setReaction;                                                                                              // 2
	}()                                                                                                               // 2
});                                                                                                                // 2
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"loadStylesheets.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/rocketchat_reactions/loadStylesheets.js                                                                //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
RocketChat.theme.addPackageAsset(function () {                                                                     // 1
	return Assets.getText('client/stylesheets/reaction.less');                                                        // 2
});                                                                                                                // 3
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/rocketchat:reactions/server/models/Messages.js");
require("./node_modules/meteor/rocketchat:reactions/setReaction.js");
require("./node_modules/meteor/rocketchat:reactions/loadStylesheets.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:reactions'] = {};

})();

//# sourceMappingURL=rocketchat_reactions.js.map
