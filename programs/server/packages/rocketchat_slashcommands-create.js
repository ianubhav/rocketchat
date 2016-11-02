(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var check = Package.check.check;
var Match = Package.check.Match;
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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:slashcommands-create":{"server.js":function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/rocketchat_slashcommands-create/server.js                //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
function Create(command, params, item) {                             // 1
	var channel, room, user;                                            // 2
	if (command !== 'create' || !Match.test(params, String)) {          // 3
		return;                                                            // 4
	}                                                                   // 5
	channel = params.trim();                                            // 6
	if (channel === '') {                                               // 7
		return;                                                            // 8
	}                                                                   // 9
                                                                     //
	user = Meteor.users.findOne(Meteor.userId());                       // 11
	room = RocketChat.models.Rooms.findOneByName(channel);              // 12
	if (room != null) {                                                 // 13
		RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {  // 14
			_id: Random.id(),                                                 // 15
			rid: item.rid,                                                    // 16
			ts: new Date(),                                                   // 17
			msg: TAPi18n.__('Channel_already_exist', {                        // 18
				postProcess: 'sprintf',                                          // 19
				sprintf: [channel]                                               // 20
			}, user.language)                                                 // 18
		});                                                                // 14
		return;                                                            // 23
	}                                                                   // 24
	Meteor.call('createChannel', channel, []);                          // 25
}                                                                    // 26
                                                                     //
RocketChat.slashCommands.add('create', Create);                      // 28
///////////////////////////////////////////////////////////////////////

}}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/rocketchat:slashcommands-create/server.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:slashcommands-create'] = {};

})();

//# sourceMappingURL=rocketchat_slashcommands-create.js.map
