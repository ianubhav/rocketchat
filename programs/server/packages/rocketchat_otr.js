(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:otr":{"server":{"settings.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/rocketchat_otr/server/settings.js                                                            //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
RocketChat.settings.addGroup('OTR', function () {                                                        // 1
	this.add('OTR_Enable', true, {                                                                          // 2
		type: 'boolean',                                                                                       // 3
		i18nLabel: 'Enabled',                                                                                  // 4
		'public': true                                                                                         // 5
	});                                                                                                     // 2
});                                                                                                      // 7
///////////////////////////////////////////////////////////////////////////////////////////////////////////

},"models":{"Messages.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/rocketchat_otr/server/models/Messages.js                                                     //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
RocketChat.models.Messages.deleteOldOTRMessages = function (roomId, ts) {                                // 1
	var query = { rid: roomId, t: 'otr', ts: { $lte: ts } };                                                // 2
	return this.remove(query);                                                                              // 3
};                                                                                                       // 4
                                                                                                         //
RocketChat.models.Messages.updateOTRAck = function (_id, otrAck) {                                       // 6
	var query = { _id: _id };                                                                               // 7
	var update = { $set: { otrAck: otrAck } };                                                              // 8
	return this.update(query, update);                                                                      // 9
};                                                                                                       // 10
///////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"methods":{"deleteOldOTRMessages.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/rocketchat_otr/server/methods/deleteOldOTRMessages.js                                        //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
Meteor.methods({                                                                                         // 1
	deleteOldOTRMessages: function () {                                                                     // 2
		function deleteOldOTRMessages(roomId) {                                                                // 2
			if (!Meteor.userId()) {                                                                               // 3
				throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'deleteOldOTRMessages' });    // 4
			}                                                                                                     // 5
                                                                                                         //
			var now = new Date();                                                                                 // 7
			var subscription = RocketChat.models.Subscriptions.findOneByRoomIdAndUserId(roomId, Meteor.userId());
			if (subscription && subscription.t === 'd') {                                                         // 9
				RocketChat.models.Messages.deleteOldOTRMessages(roomId, now);                                        // 10
			} else {                                                                                              // 11
				throw new Meteor.Error('error-invalid-room', 'Invalid room', { method: 'deleteOldOTRMessages' });    // 12
			}                                                                                                     // 13
		}                                                                                                      // 14
                                                                                                         //
		return deleteOldOTRMessages;                                                                           // 2
	}()                                                                                                     // 2
});                                                                                                      // 1
///////////////////////////////////////////////////////////////////////////////////////////////////////////

},"updateOTRAck.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/rocketchat_otr/server/methods/updateOTRAck.js                                                //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
Meteor.methods({                                                                                         // 1
	updateOTRAck: function () {                                                                             // 2
		function updateOTRAck(_id, ack) {                                                                      // 2
			if (!Meteor.userId()) {                                                                               // 3
				throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'updateOTRAck' });            // 4
			}                                                                                                     // 5
			RocketChat.models.Messages.updateOTRAck(_id, ack);                                                    // 6
		}                                                                                                      // 7
                                                                                                         //
		return updateOTRAck;                                                                                   // 2
	}()                                                                                                     // 2
});                                                                                                      // 1
///////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/rocketchat:otr/server/settings.js");
require("./node_modules/meteor/rocketchat:otr/server/models/Messages.js");
require("./node_modules/meteor/rocketchat:otr/server/methods/deleteOldOTRMessages.js");
require("./node_modules/meteor/rocketchat:otr/server/methods/updateOTRAck.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:otr'] = {};

})();

//# sourceMappingURL=rocketchat_otr.js.map
