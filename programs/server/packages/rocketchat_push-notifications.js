(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:push-notifications":{"server":{"methods":{"saveNotificationSettings.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/rocketchat_push-notifications/server/methods/saveNotificationSettings.js                          //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
Meteor.methods({                                                                                              // 1
	saveNotificationSettings: function () {                                                                      // 2
		function saveNotificationSettings(rid, field, value) {                                                      // 2
			if (!Meteor.userId()) {                                                                                    // 3
				throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'saveNotificationSettings' });     // 4
			}                                                                                                          // 5
                                                                                                              //
			check(rid, String);                                                                                        // 7
			check(field, String);                                                                                      // 8
			check(value, String);                                                                                      // 9
                                                                                                              //
			if (['desktopNotifications', 'mobilePushNotifications', 'emailNotifications', 'unreadAlert'].indexOf(field) === -1) {
				throw new Meteor.Error('error-invalid-settings', 'Invalid settings field', { method: 'saveNotificationSettings' });
			}                                                                                                          // 13
                                                                                                              //
			if (['all', 'mentions', 'nothing', 'default'].indexOf(value) === -1) {                                     // 15
				throw new Meteor.Error('error-invalid-settings', 'Invalid settings value', { method: 'saveNotificationSettings' });
			}                                                                                                          // 17
                                                                                                              //
			var subscription = RocketChat.models.Subscriptions.findOneByRoomIdAndUserId(rid, Meteor.userId());         // 19
			if (!subscription) {                                                                                       // 20
				throw new Meteor.Error('error-invalid-subscription', 'Invalid subscription', { method: 'saveNotificationSettings' });
			}                                                                                                          // 22
                                                                                                              //
			switch (field) {                                                                                           // 24
				case 'desktopNotifications':                                                                              // 25
					RocketChat.models.Subscriptions.updateDesktopNotificationsById(subscription._id, value);                 // 26
					break;                                                                                                   // 27
				case 'mobilePushNotifications':                                                                           // 28
					RocketChat.models.Subscriptions.updateMobilePushNotificationsById(subscription._id, value);              // 29
					break;                                                                                                   // 30
				case 'emailNotifications':                                                                                // 31
					RocketChat.models.Subscriptions.updateEmailNotificationsById(subscription._id, value);                   // 32
					break;                                                                                                   // 33
				case 'unreadAlert':                                                                                       // 34
					RocketChat.models.Subscriptions.updateUnreadAlertById(subscription._id, value);                          // 35
					break;                                                                                                   // 36
			}                                                                                                          // 24
                                                                                                              //
			return true;                                                                                               // 39
		}                                                                                                           // 40
                                                                                                              //
		return saveNotificationSettings;                                                                            // 2
	}(),                                                                                                         // 2
                                                                                                              //
	saveDesktopNotificationDuration: function () {                                                               // 42
		function saveDesktopNotificationDuration(rid, value) {                                                      // 42
			var subscription = RocketChat.models.Subscriptions.findOneByRoomIdAndUserId(rid, Meteor.userId());         // 43
			if (!subscription) {                                                                                       // 44
				throw new Meteor.Error('error-invalid-subscription', 'Invalid subscription', { method: 'saveDesktopNotificationDuration' });
			}                                                                                                          // 46
			RocketChat.models.Subscriptions.updateDesktopNotificationDurationById(subscription._id, value);            // 47
			return true;                                                                                               // 48
		}                                                                                                           // 49
                                                                                                              //
		return saveDesktopNotificationDuration;                                                                     // 42
	}()                                                                                                          // 42
});                                                                                                           // 1
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"models":{"Subscriptions.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/rocketchat_push-notifications/server/models/Subscriptions.js                                      //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
RocketChat.models.Subscriptions.updateDesktopNotificationsById = function (_id, desktopNotifications) {       // 1
	var query = {                                                                                                // 2
		_id: _id                                                                                                    // 3
	};                                                                                                           // 2
                                                                                                              //
	var update = {                                                                                               // 6
		$set: {                                                                                                     // 7
			desktopNotifications: desktopNotifications                                                                 // 8
		}                                                                                                           // 7
	};                                                                                                           // 6
                                                                                                              //
	return this.update(query, update);                                                                           // 12
};                                                                                                            // 13
                                                                                                              //
RocketChat.models.Subscriptions.updateDesktopNotificationDurationById = function (_id, value) {               // 15
	var query = {                                                                                                // 16
		_id: _id                                                                                                    // 17
	};                                                                                                           // 16
                                                                                                              //
	var update = {                                                                                               // 20
		$set: {                                                                                                     // 21
			desktopNotificationDuration: value - 0                                                                     // 22
		}                                                                                                           // 21
	};                                                                                                           // 20
                                                                                                              //
	return this.update(query, update);                                                                           // 26
};                                                                                                            // 27
                                                                                                              //
RocketChat.models.Subscriptions.updateMobilePushNotificationsById = function (_id, mobilePushNotifications) {
	var query = {                                                                                                // 30
		_id: _id                                                                                                    // 31
	};                                                                                                           // 30
                                                                                                              //
	var update = {                                                                                               // 34
		$set: {                                                                                                     // 35
			mobilePushNotifications: mobilePushNotifications                                                           // 36
		}                                                                                                           // 35
	};                                                                                                           // 34
                                                                                                              //
	return this.update(query, update);                                                                           // 40
};                                                                                                            // 41
                                                                                                              //
RocketChat.models.Subscriptions.updateEmailNotificationsById = function (_id, emailNotifications) {           // 43
	var query = {                                                                                                // 44
		_id: _id                                                                                                    // 45
	};                                                                                                           // 44
                                                                                                              //
	var update = {                                                                                               // 48
		$set: {                                                                                                     // 49
			emailNotifications: emailNotifications                                                                     // 50
		}                                                                                                           // 49
	};                                                                                                           // 48
                                                                                                              //
	return this.update(query, update);                                                                           // 54
};                                                                                                            // 55
                                                                                                              //
RocketChat.models.Subscriptions.updateUnreadAlertById = function (_id, unreadAlert) {                         // 57
	var query = {                                                                                                // 58
		_id: _id                                                                                                    // 59
	};                                                                                                           // 58
                                                                                                              //
	var update = {                                                                                               // 62
		$set: {                                                                                                     // 63
			unreadAlert: unreadAlert                                                                                   // 64
		}                                                                                                           // 63
	};                                                                                                           // 62
                                                                                                              //
	return this.update(query, update);                                                                           // 68
};                                                                                                            // 69
                                                                                                              //
RocketChat.models.Subscriptions.findAlwaysNotifyDesktopUsersByRoomId = function (roomId) {                    // 71
	var query = {                                                                                                // 72
		rid: roomId,                                                                                                // 73
		desktopNotifications: 'all'                                                                                 // 74
	};                                                                                                           // 72
                                                                                                              //
	return this.find(query);                                                                                     // 77
};                                                                                                            // 78
                                                                                                              //
RocketChat.models.Subscriptions.findDontNotifyDesktopUsersByRoomId = function (roomId) {                      // 80
	var query = {                                                                                                // 81
		rid: roomId,                                                                                                // 82
		desktopNotifications: 'nothing'                                                                             // 83
	};                                                                                                           // 81
                                                                                                              //
	return this.find(query);                                                                                     // 86
};                                                                                                            // 87
                                                                                                              //
RocketChat.models.Subscriptions.findAlwaysNotifyMobileUsersByRoomId = function (roomId) {                     // 89
	var query = {                                                                                                // 90
		rid: roomId,                                                                                                // 91
		mobilePushNotifications: 'all'                                                                              // 92
	};                                                                                                           // 90
                                                                                                              //
	return this.find(query);                                                                                     // 95
};                                                                                                            // 96
                                                                                                              //
RocketChat.models.Subscriptions.findDontNotifyMobileUsersByRoomId = function (roomId) {                       // 98
	var query = {                                                                                                // 99
		rid: roomId,                                                                                                // 100
		mobilePushNotifications: 'nothing'                                                                          // 101
	};                                                                                                           // 99
                                                                                                              //
	return this.find(query);                                                                                     // 104
};                                                                                                            // 105
                                                                                                              //
RocketChat.models.Subscriptions.findNotificationPreferencesByRoom = function (roomId) {                       // 107
	var query = {                                                                                                // 108
		rid: roomId,                                                                                                // 109
		'u._id': { $exists: true },                                                                                 // 110
		$or: [{ desktopNotifications: { $exists: true } }, { desktopNotificationDuration: { $exists: true } }, { mobilePushNotifications: { $exists: true } }]
	};                                                                                                           // 108
                                                                                                              //
	return this.find(query);                                                                                     // 118
};                                                                                                            // 119
                                                                                                              //
RocketChat.models.Subscriptions.findWithSendEmailByRoomId = function (roomId) {                               // 121
	var query = {                                                                                                // 122
		rid: roomId,                                                                                                // 123
		emailNotifications: {                                                                                       // 124
			$exists: true                                                                                              // 125
		}                                                                                                           // 124
	};                                                                                                           // 122
                                                                                                              //
	return this.find(query, { fields: { emailNotifications: 1, u: 1 } });                                        // 129
};                                                                                                            // 130
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/rocketchat:push-notifications/server/methods/saveNotificationSettings.js");
require("./node_modules/meteor/rocketchat:push-notifications/server/models/Subscriptions.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:push-notifications'] = {};

})();

//# sourceMappingURL=rocketchat_push-notifications.js.map
