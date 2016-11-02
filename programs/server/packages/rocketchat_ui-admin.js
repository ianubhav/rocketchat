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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:ui-admin":{"publications":{"adminRooms.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////
//                                                                                       //
// packages/rocketchat_ui-admin/publications/adminRooms.js                               //
//                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////
                                                                                         //
Meteor.publish('adminRooms', function (filter, types, limit) {                           // 1
	var options;                                                                            // 2
	if (!this.userId) {                                                                     // 3
		return this.ready();                                                                   // 4
	}                                                                                       // 5
	if (RocketChat.authz.hasPermission(this.userId, 'view-room-administration') !== true) {
		return this.ready();                                                                   // 7
	}                                                                                       // 8
	if (!_.isArray(types)) {                                                                // 9
		types = [];                                                                            // 10
	}                                                                                       // 11
	options = {                                                                             // 12
		fields: {                                                                              // 13
			name: 1,                                                                              // 14
			t: 1,                                                                                 // 15
			cl: 1,                                                                                // 16
			u: 1,                                                                                 // 17
			usernames: 1,                                                                         // 18
			muted: 1,                                                                             // 19
			ro: 1,                                                                                // 20
			'default': 1,                                                                         // 21
			topic: 1,                                                                             // 22
			msgs: 1,                                                                              // 23
			archived: 1                                                                           // 24
		},                                                                                     // 13
		limit: limit,                                                                          // 26
		sort: {                                                                                // 27
			'default': -1,                                                                        // 28
			name: 1                                                                               // 29
		}                                                                                      // 27
	};                                                                                      // 12
	filter = _.trim(filter);                                                                // 32
	if (filter && types.length) {                                                           // 33
		return RocketChat.models.Rooms.findByNameContainingAndTypes(filter, types, options);   // 34
	} else if (types.length) {                                                              // 35
		return RocketChat.models.Rooms.findByTypes(types, options);                            // 36
	} else {                                                                                // 37
		return RocketChat.models.Rooms.findByNameContaining(filter, options);                  // 38
	}                                                                                       // 39
});                                                                                      // 40
///////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{"extensions":[".js",".json",".coffee"]});
require("./node_modules/meteor/rocketchat:ui-admin/publications/adminRooms.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:ui-admin'] = {};

})();

//# sourceMappingURL=rocketchat_ui-admin.js.map
