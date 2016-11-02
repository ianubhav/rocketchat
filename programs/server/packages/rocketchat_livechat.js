(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var Autoupdate = Package.autoupdate.Autoupdate;
var ECMAScript = Package.ecmascript.ECMAScript;
var s = Package['underscorestring:underscore.string'].s;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var Logger = Package['rocketchat:logger'].Logger;
var UserPresence = Package['konecty:user-presence'].UserPresence;
var UserPresenceMonitor = Package['konecty:user-presence'].UserPresenceMonitor;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;
var check = Package.check.check;
var Match = Package.check.Match;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var DDPRateLimiter = Package['ddp-rate-limiter'].DDPRateLimiter;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
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
var emailSettings, self, exports;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:livechat":{"livechat.js":["url",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/livechat.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var url;module.import('url',{"default":function(v){url=v}});/* globals WebApp:true */                                  // 1
                                                                                                                       // 2
                                                                                                                       //
WebApp = Package.webapp.WebApp;                                                                                        // 4
var Autoupdate = Package.autoupdate.Autoupdate;                                                                        // 5
                                                                                                                       //
WebApp.connectHandlers.use('/livechat', Meteor.bindEnvironment(function (req, res, next) {                             // 7
	var reqUrl = url.parse(req.url);                                                                                      // 8
	if (reqUrl.pathname !== '/') {                                                                                        // 9
		return next();                                                                                                       // 10
	}                                                                                                                     // 11
	res.setHeader('content-type', 'text/html; charset=utf-8');                                                            // 12
                                                                                                                       //
	var head = Assets.getText('public/head.html');                                                                        // 14
                                                                                                                       //
	var html = '<html>\n\t\t<head>\n\t\t\t<link rel="stylesheet" type="text/css" class="__meteor-css__" href="/livechat/livechat.css?_dc=' + Autoupdate.autoupdateVersion + '">\n\t\t\t<script type="text/javascript">\n\t\t\t\t__meteor_runtime_config__ = ' + JSON.stringify(__meteor_runtime_config__) + ';\n\t\t\t</script>\n\n\t\t\t' + head + '\n\t\t</head>\n\t\t<body>\n\t\t\t<script type="text/javascript" src="/livechat/livechat.js?_dc=' + Autoupdate.autoupdateVersion + '"></script>\n\t\t</body>\n\t</html>';
                                                                                                                       //
	res.write(html);                                                                                                      // 30
	res.end();                                                                                                            // 31
}));                                                                                                                   // 32
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"server":{"startup.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/startup.js                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.startup(function () {                                                                                           // 1
	RocketChat.roomTypes.setPublish('l', function (code) {                                                                // 2
		return RocketChat.models.Rooms.findLivechatByCode(code, {                                                            // 3
			name: 1,                                                                                                            // 4
			t: 1,                                                                                                               // 5
			cl: 1,                                                                                                              // 6
			u: 1,                                                                                                               // 7
			label: 1,                                                                                                           // 8
			usernames: 1,                                                                                                       // 9
			v: 1,                                                                                                               // 10
			livechatData: 1,                                                                                                    // 11
			topic: 1,                                                                                                           // 12
			tags: 1,                                                                                                            // 13
			sms: 1,                                                                                                             // 14
			code: 1,                                                                                                            // 15
			open: 1                                                                                                             // 16
		});                                                                                                                  // 3
	});                                                                                                                   // 18
                                                                                                                       //
	RocketChat.authz.addRoomAccessValidator(function (room, user) {                                                       // 20
		return room.t === 'l' && RocketChat.authz.hasPermission(user._id, 'view-livechat-rooms');                            // 21
	});                                                                                                                   // 22
                                                                                                                       //
	RocketChat.callbacks.add('beforeLeaveRoom', function (user, room) {                                                   // 24
		if (room.t !== 'l') {                                                                                                // 25
			return user;                                                                                                        // 26
		}                                                                                                                    // 27
		throw new Meteor.Error(TAPi18n.__('You_cant_leave_a_livechat_room_Please_use_the_close_button', {                    // 28
			lng: user.language || RocketChat.settings.get('language') || 'en'                                                   // 29
		}));                                                                                                                 // 28
	}, RocketChat.callbacks.priority.LOW, 'cant-leave-room');                                                             // 31
});                                                                                                                    // 32
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"hooks":{"externalMessage.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/hooks/externalMessage.js                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals HTTP, SystemLogger */                                                                                       // 1
                                                                                                                       //
var knowledgeEnabled = false;                                                                                          // 3
var apiaiKey = '';                                                                                                     // 4
var apiaiLanguage = 'en';                                                                                              // 5
RocketChat.settings.get('Livechat_Knowledge_Enabled', function (key, value) {                                          // 6
	knowledgeEnabled = value;                                                                                             // 7
});                                                                                                                    // 8
RocketChat.settings.get('Livechat_Knowledge_Apiai_Key', function (key, value) {                                        // 9
	apiaiKey = value;                                                                                                     // 10
});                                                                                                                    // 11
RocketChat.settings.get('Livechat_Knowledge_Apiai_Language', function (key, value) {                                   // 12
	apiaiLanguage = value;                                                                                                // 13
});                                                                                                                    // 14
                                                                                                                       //
RocketChat.callbacks.add('afterSaveMessage', function (message, room) {                                                // 16
	// skips this callback if the message was edited                                                                      // 17
	if (message.editedAt) {                                                                                               // 18
		return message;                                                                                                      // 19
	}                                                                                                                     // 20
                                                                                                                       //
	if (!knowledgeEnabled) {                                                                                              // 22
		return message;                                                                                                      // 23
	}                                                                                                                     // 24
                                                                                                                       //
	if (!(typeof room.t !== 'undefined' && room.t === 'l' && room.v && room.v.token)) {                                   // 26
		return message;                                                                                                      // 27
	}                                                                                                                     // 28
                                                                                                                       //
	// if the message hasn't a token, it was not sent by the visitor, so ignore it                                        // 30
	if (!message.token) {                                                                                                 // 31
		return message;                                                                                                      // 32
	}                                                                                                                     // 33
                                                                                                                       //
	Meteor.defer(function () {                                                                                            // 35
		try {                                                                                                                // 36
			var response = HTTP.post('https://api.api.ai/api/query?v=20150910', {                                               // 37
				data: {                                                                                                            // 38
					query: message.msg,                                                                                               // 39
					lang: apiaiLanguage                                                                                               // 40
				},                                                                                                                 // 38
				headers: {                                                                                                         // 42
					'Content-Type': 'application/json; charset=utf-8',                                                                // 43
					'Authorization': 'Bearer ' + apiaiKey                                                                             // 44
				}                                                                                                                  // 42
			});                                                                                                                 // 37
                                                                                                                       //
			if (response.data && response.data.status.code === 200 && !_.isEmpty(response.data.result.fulfillment.speech)) {    // 48
				RocketChat.models.LivechatExternalMessage.insert({                                                                 // 49
					rid: message.rid,                                                                                                 // 50
					msg: response.data.result.fulfillment.speech,                                                                     // 51
					orig: message._id,                                                                                                // 52
					ts: new Date()                                                                                                    // 53
				});                                                                                                                // 49
			}                                                                                                                   // 55
		} catch (e) {                                                                                                        // 56
			SystemLogger.error('Error using Api.ai ->', e);                                                                     // 57
		}                                                                                                                    // 58
	});                                                                                                                   // 59
                                                                                                                       //
	return message;                                                                                                       // 61
}, RocketChat.callbacks.priority.LOW, 'externalWebHook');                                                              // 62
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"markRoomResponded.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/hooks/markRoomResponded.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.callbacks.add('afterSaveMessage', function (message, room) {                                                // 1
	// skips this callback if the message was edited                                                                      // 2
	if (message.editedAt) {                                                                                               // 3
		return message;                                                                                                      // 4
	}                                                                                                                     // 5
                                                                                                                       //
	// check if room is yet awaiting for response                                                                         // 7
	if (!(typeof room.t !== 'undefined' && room.t === 'l' && room.waitingResponse)) {                                     // 8
		return message;                                                                                                      // 9
	}                                                                                                                     // 10
                                                                                                                       //
	// if the message has a token, it was sent by the visitor, so ignore it                                               // 12
	if (message.token) {                                                                                                  // 13
		return message;                                                                                                      // 14
	}                                                                                                                     // 15
                                                                                                                       //
	Meteor.defer(function () {                                                                                            // 17
		var now = new Date();                                                                                                // 18
		RocketChat.models.Rooms.setResponseByRoomId(room._id, {                                                              // 19
			user: {                                                                                                             // 20
				_id: message.u._id,                                                                                                // 21
				username: message.u.username                                                                                       // 22
			},                                                                                                                  // 20
			responseDate: now,                                                                                                  // 24
			responseTime: (now.getTime() - room.ts) / 1000                                                                      // 25
		});                                                                                                                  // 19
	});                                                                                                                   // 27
                                                                                                                       //
	return message;                                                                                                       // 29
}, RocketChat.callbacks.priority.LOW, 'markRoomResponded');                                                            // 30
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"offlineMessage.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/hooks/offlineMessage.js                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.callbacks.add('livechat.offlineMessage', function (data) {                                                  // 1
	if (!RocketChat.settings.get('Livechat_webhook_on_offline_msg')) {                                                    // 2
		return data;                                                                                                         // 3
	}                                                                                                                     // 4
                                                                                                                       //
	var postData = {                                                                                                      // 6
		type: 'LivechatOfflineMessage',                                                                                      // 7
		sentAt: new Date(),                                                                                                  // 8
		visitor: {                                                                                                           // 9
			name: data.name,                                                                                                    // 10
			email: data.email                                                                                                   // 11
		},                                                                                                                   // 9
		message: data.message                                                                                                // 13
	};                                                                                                                    // 6
                                                                                                                       //
	RocketChat.Livechat.sendRequest(postData);                                                                            // 16
}, RocketChat.callbacks.priority.MEDIUM, 'livechat-send-email-offline-message');                                       // 17
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"sendToCRM.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/hooks/sendToCRM.js                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
function sendToCRM(hook, room) {                                                                                       // 1
	if (!RocketChat.settings.get('Livechat_webhook_on_close')) {                                                          // 2
		return room;                                                                                                         // 3
	}                                                                                                                     // 4
                                                                                                                       //
	var postData = RocketChat.Livechat.getLivechatRoomGuestInfo(room);                                                    // 6
	if (hook === 'closeRoom') {                                                                                           // 7
		postData.type = 'LivechatSession';                                                                                   // 8
	} else if (hook === 'saveLivechatInfo') {                                                                             // 9
		postData.type = 'LivechatEdit';                                                                                      // 10
	}                                                                                                                     // 11
                                                                                                                       //
	postData.messages = [];                                                                                               // 13
                                                                                                                       //
	RocketChat.models.Messages.findVisibleByRoomId(room._id, { sort: { ts: 1 } }).forEach(function (message) {            // 15
		if (message.t) {                                                                                                     // 16
			return;                                                                                                             // 17
		}                                                                                                                    // 18
		var msg = {                                                                                                          // 19
			username: message.u.username,                                                                                       // 20
			msg: message.msg,                                                                                                   // 21
			ts: message.ts                                                                                                      // 22
		};                                                                                                                   // 19
                                                                                                                       //
		if (message.u.username !== postData.visitor.username) {                                                              // 25
			msg.agentId = message.u._id;                                                                                        // 26
		}                                                                                                                    // 27
		postData.messages.push(msg);                                                                                         // 28
	});                                                                                                                   // 29
                                                                                                                       //
	var response = RocketChat.Livechat.sendRequest(postData);                                                             // 31
                                                                                                                       //
	if (response && response.data && response.data.data) {                                                                // 33
		RocketChat.models.Rooms.saveCRMDataByRoomId(room._id, response.data.data);                                           // 34
	}                                                                                                                     // 35
                                                                                                                       //
	return room;                                                                                                          // 37
}                                                                                                                      // 38
                                                                                                                       //
RocketChat.callbacks.add('livechat.closeRoom', function (room) {                                                       // 40
	return sendToCRM('closeRoom', room);                                                                                  // 41
}, RocketChat.callbacks.priority.MEDIUM, 'livechat-send-crm-close-room');                                              // 42
                                                                                                                       //
RocketChat.callbacks.add('livechat.saveInfo', function (room) {                                                        // 44
	return sendToCRM('saveLivechatInfo', room);                                                                           // 45
}, RocketChat.callbacks.priority.MEDIUM, 'livechat-send-crm-save-info');                                               // 46
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"methods":{"addAgent.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/addAgent.js                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:addAgent': function () {                                                                                    // 2
		function livechatAddAgent(username) {                                                                                // 1
			if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-livechat-manager')) {                // 3
				throw new Meteor.Error('error-not-allowed', 'Not allowed', { method: 'livechat:addAgent' });                       // 4
			}                                                                                                                   // 5
                                                                                                                       //
			return RocketChat.Livechat.addAgent(username);                                                                      // 7
		}                                                                                                                    // 8
                                                                                                                       //
		return livechatAddAgent;                                                                                             // 1
	}()                                                                                                                   // 1
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"addManager.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/addManager.js                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:addManager': function () {                                                                                  // 2
		function livechatAddManager(username) {                                                                              // 1
			if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-livechat-manager')) {                // 3
				throw new Meteor.Error('error-not-allowed', 'Not allowed', { method: 'livechat:addManager' });                     // 4
			}                                                                                                                   // 5
                                                                                                                       //
			return RocketChat.Livechat.addManager(username);                                                                    // 7
		}                                                                                                                    // 8
                                                                                                                       //
		return livechatAddManager;                                                                                           // 1
	}()                                                                                                                   // 1
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"changeLivechatStatus.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/changeLivechatStatus.js                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:changeLivechatStatus': function () {                                                                        // 2
		function livechatChangeLivechatStatus() {                                                                            // 1
			if (!Meteor.userId()) {                                                                                             // 3
				throw new Meteor.Error('error-not-allowed', 'Not allowed', { method: 'livechat:changeLivechatStatus' });           // 4
			}                                                                                                                   // 5
                                                                                                                       //
			var user = Meteor.user();                                                                                           // 7
                                                                                                                       //
			var newStatus = user.statusLivechat === 'available' ? 'not-available' : 'available';                                // 9
                                                                                                                       //
			return RocketChat.models.Users.setLivechatStatus(user._id, newStatus);                                              // 11
		}                                                                                                                    // 12
                                                                                                                       //
		return livechatChangeLivechatStatus;                                                                                 // 1
	}()                                                                                                                   // 1
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"closeByVisitor.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/closeByVisitor.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:closeByVisitor': function () {                                                                              // 2
		function livechatCloseByVisitor() {                                                                                  // 1
			if (!Meteor.userId()) {                                                                                             // 3
				throw new Meteor.Error('error-not-authorized', 'Not authorized', { method: 'livechat:closeByVisitor' });           // 4
			}                                                                                                                   // 5
                                                                                                                       //
			var room = RocketChat.models.Rooms.findOneOpenByVisitorId(Meteor.userId());                                         // 7
                                                                                                                       //
			if (!room || !room.open) {                                                                                          // 9
				return false;                                                                                                      // 10
			}                                                                                                                   // 11
                                                                                                                       //
			var user = Meteor.user();                                                                                           // 13
                                                                                                                       //
			var language = user && user.language || RocketChat.settings.get('language') || 'en';                                // 15
                                                                                                                       //
			return RocketChat.Livechat.closeRoom({                                                                              // 17
				user: user,                                                                                                        // 18
				room: room,                                                                                                        // 19
				comment: TAPi18n.__('Closed_by_visitor', { lng: language })                                                        // 20
			});                                                                                                                 // 17
		}                                                                                                                    // 22
                                                                                                                       //
		return livechatCloseByVisitor;                                                                                       // 1
	}()                                                                                                                   // 1
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"closeRoom.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/closeRoom.js                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:closeRoom': function () {                                                                                   // 2
		function livechatCloseRoom(roomId, comment) {                                                                        // 1
			if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'close-livechat-room')) {                  // 3
				throw new Meteor.Error('error-not-authorized', 'Not authorized', { method: 'livechat:closeRoom' });                // 4
			}                                                                                                                   // 5
                                                                                                                       //
			var room = RocketChat.models.Rooms.findOneById(roomId);                                                             // 7
                                                                                                                       //
			var user = Meteor.user();                                                                                           // 9
                                                                                                                       //
			if (room.usernames.indexOf(user.username) === -1 && !RocketChat.authz.hasPermission(Meteor.userId(), 'close-others-livechat-room')) {
				throw new Meteor.Error('error-not-authorized', 'Not authorized', { method: 'livechat:closeRoom' });                // 12
			}                                                                                                                   // 13
                                                                                                                       //
			return RocketChat.Livechat.closeRoom({                                                                              // 15
				user: user,                                                                                                        // 16
				room: room,                                                                                                        // 17
				comment: comment                                                                                                   // 18
			});                                                                                                                 // 15
		}                                                                                                                    // 20
                                                                                                                       //
		return livechatCloseRoom;                                                                                            // 1
	}()                                                                                                                   // 1
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getCustomFields.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/getCustomFields.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:getCustomFields': function () {                                                                             // 2
		function livechatGetCustomFields() {                                                                                 // 1
			return RocketChat.models.LivechatCustomField.find().fetch();                                                        // 3
		}                                                                                                                    // 4
                                                                                                                       //
		return livechatGetCustomFields;                                                                                      // 1
	}()                                                                                                                   // 1
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getInitialData.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/getInitialData.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:getInitialData': function () {                                                                              // 2
		function livechatGetInitialData(visitorToken) {                                                                      // 1
			var info = {                                                                                                        // 3
				enabled: null,                                                                                                     // 4
				title: null,                                                                                                       // 5
				color: null,                                                                                                       // 6
				registrationForm: null,                                                                                            // 7
				room: null,                                                                                                        // 8
				triggers: [],                                                                                                      // 9
				departments: [],                                                                                                   // 10
				online: true,                                                                                                      // 11
				offlineColor: null,                                                                                                // 12
				offlineMessage: null,                                                                                              // 13
				offlineSuccessMessage: null,                                                                                       // 14
				offlineUnavailableMessage: null,                                                                                   // 15
				displayOfflineForm: null,                                                                                          // 16
				videoCall: null                                                                                                    // 17
			};                                                                                                                  // 3
                                                                                                                       //
			var room = RocketChat.models.Rooms.findOpenByVisitorToken(visitorToken, {                                           // 20
				fields: {                                                                                                          // 21
					name: 1,                                                                                                          // 22
					t: 1,                                                                                                             // 23
					cl: 1,                                                                                                            // 24
					u: 1,                                                                                                             // 25
					usernames: 1,                                                                                                     // 26
					v: 1                                                                                                              // 27
				}                                                                                                                  // 21
			}).fetch();                                                                                                         // 20
                                                                                                                       //
			if (room && room.length > 0) {                                                                                      // 31
				info.room = room[0];                                                                                               // 32
			}                                                                                                                   // 33
                                                                                                                       //
			var initSettings = RocketChat.Livechat.getInitSettings();                                                           // 35
                                                                                                                       //
			info.title = initSettings.Livechat_title;                                                                           // 37
			info.color = initSettings.Livechat_title_color;                                                                     // 38
			info.enabled = initSettings.Livechat_enabled;                                                                       // 39
			info.registrationForm = initSettings.Livechat_registration_form;                                                    // 40
			info.offlineTitle = initSettings.Livechat_offline_title;                                                            // 41
			info.offlineColor = initSettings.Livechat_offline_title_color;                                                      // 42
			info.offlineMessage = initSettings.Livechat_offline_message;                                                        // 43
			info.offlineSuccessMessage = initSettings.Livechat_offline_success_message;                                         // 44
			info.offlineUnavailableMessage = initSettings.Livechat_offline_form_unavailable;                                    // 45
			info.displayOfflineForm = initSettings.Livechat_display_offline_form;                                               // 46
			info.language = initSettings.Language;                                                                              // 47
			info.videoCall = initSettings.Livechat_videocall_enabled === true && initSettings.Jitsi_Enabled === true;           // 48
			info.transcript = initSettings.Livechat_enable_transcript;                                                          // 49
			info.transcriptMessage = initSettings.Livechat_transcript_message;                                                  // 50
                                                                                                                       //
			RocketChat.models.LivechatTrigger.find().forEach(function (trigger) {                                               // 53
				info.triggers.push(trigger);                                                                                       // 54
			});                                                                                                                 // 55
                                                                                                                       //
			RocketChat.models.LivechatDepartment.findEnabledWithAgents().forEach(function (department) {                        // 57
				info.departments.push(department);                                                                                 // 58
			});                                                                                                                 // 59
                                                                                                                       //
			info.online = RocketChat.models.Users.findOnlineAgents().count() > 0;                                               // 61
                                                                                                                       //
			return info;                                                                                                        // 63
		}                                                                                                                    // 64
                                                                                                                       //
		return livechatGetInitialData;                                                                                       // 1
	}()                                                                                                                   // 1
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"loginByToken.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/loginByToken.js                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:loginByToken': function () {                                                                                // 2
		function livechatLoginByToken(token) {                                                                               // 1
			var user = RocketChat.models.Users.getVisitorByToken(token, { fields: { _id: 1 } });                                // 3
                                                                                                                       //
			if (!user) {                                                                                                        // 5
				return;                                                                                                            // 6
			}                                                                                                                   // 7
                                                                                                                       //
			var stampedToken = Accounts._generateStampedLoginToken();                                                           // 9
			var hashStampedToken = Accounts._hashStampedToken(stampedToken);                                                    // 10
                                                                                                                       //
			var updateUser = {                                                                                                  // 12
				$set: {                                                                                                            // 13
					services: {                                                                                                       // 14
						resume: {                                                                                                        // 15
							loginTokens: [hashStampedToken]                                                                                 // 16
						}                                                                                                                // 15
					}                                                                                                                 // 14
				}                                                                                                                  // 13
			};                                                                                                                  // 12
                                                                                                                       //
			Meteor.users.update(user._id, updateUser);                                                                          // 22
                                                                                                                       //
			return {                                                                                                            // 24
				token: stampedToken.token                                                                                          // 25
			};                                                                                                                  // 24
		}                                                                                                                    // 27
                                                                                                                       //
		return livechatLoginByToken;                                                                                         // 1
	}()                                                                                                                   // 1
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"pageVisited.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/pageVisited.js                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:pageVisited': function () {                                                                                 // 2
		function livechatPageVisited(token, pageInfo) {                                                                      // 1
			return RocketChat.Livechat.savePageHistory(token, pageInfo);                                                        // 3
		}                                                                                                                    // 4
                                                                                                                       //
		return livechatPageVisited;                                                                                          // 1
	}()                                                                                                                   // 1
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"registerGuest.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/registerGuest.js                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:registerGuest': function () {                                                                               // 2
		function livechatRegisterGuest() {                                                                                   // 2
			var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};                                  // 2
                                                                                                                       //
			var token = _ref.token;                                                                                             // 2
			var name = _ref.name;                                                                                               // 2
			var email = _ref.email;                                                                                             // 2
			var department = _ref.department;                                                                                   // 2
                                                                                                                       //
			var stampedToken = Accounts._generateStampedLoginToken();                                                           // 3
			var hashStampedToken = Accounts._hashStampedToken(stampedToken);                                                    // 4
                                                                                                                       //
			var userId = RocketChat.Livechat.registerGuest.call(this, {                                                         // 6
				token: token,                                                                                                      // 7
				name: name,                                                                                                        // 8
				email: email,                                                                                                      // 9
				department: department,                                                                                            // 10
				loginToken: hashStampedToken                                                                                       // 11
			});                                                                                                                 // 6
                                                                                                                       //
			// update visited page history to not expire                                                                        // 14
			RocketChat.models.LivechatPageVisited.keepHistoryForToken(token);                                                   // 15
                                                                                                                       //
			return {                                                                                                            // 17
				userId: userId,                                                                                                    // 18
				token: stampedToken.token                                                                                          // 19
			};                                                                                                                  // 17
		}                                                                                                                    // 21
                                                                                                                       //
		return livechatRegisterGuest;                                                                                        // 2
	}()                                                                                                                   // 2
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"removeAgent.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/removeAgent.js                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:removeAgent': function () {                                                                                 // 2
		function livechatRemoveAgent(username) {                                                                             // 1
			if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-livechat-manager')) {                // 3
				throw new Meteor.Error('error-not-allowed', 'Not allowed', { method: 'livechat:removeAgent' });                    // 4
			}                                                                                                                   // 5
                                                                                                                       //
			return RocketChat.Livechat.removeAgent(username);                                                                   // 7
		}                                                                                                                    // 8
                                                                                                                       //
		return livechatRemoveAgent;                                                                                          // 1
	}()                                                                                                                   // 1
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"removeCustomField.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/removeCustomField.js                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:removeCustomField': function () {                                                                           // 2
		function livechatRemoveCustomField(_id) {                                                                            // 1
			if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-livechat-manager')) {                // 3
				throw new Meteor.Error('error-not-allowed', 'Not allowed', { method: 'livechat:removeCustomField' });              // 4
			}                                                                                                                   // 5
                                                                                                                       //
			check(_id, String);                                                                                                 // 7
                                                                                                                       //
			var customField = RocketChat.models.LivechatCustomField.findOneById(_id, { fields: { _id: 1 } });                   // 9
                                                                                                                       //
			if (!customField) {                                                                                                 // 11
				throw new Meteor.Error('error-invalid-custom-field', 'Custom field not found', { method: 'livechat:removeCustomField' });
			}                                                                                                                   // 13
                                                                                                                       //
			return RocketChat.models.LivechatCustomField.removeById(_id);                                                       // 15
		}                                                                                                                    // 16
                                                                                                                       //
		return livechatRemoveCustomField;                                                                                    // 1
	}()                                                                                                                   // 1
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"removeDepartment.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/removeDepartment.js                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:removeDepartment': function () {                                                                            // 2
		function livechatRemoveDepartment(_id) {                                                                             // 1
			if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-livechat-manager')) {                // 3
				throw new Meteor.Error('error-not-allowed', 'Not allowed', { method: 'livechat:removeDepartment' });               // 4
			}                                                                                                                   // 5
                                                                                                                       //
			return RocketChat.Livechat.removeDepartment(_id);                                                                   // 7
		}                                                                                                                    // 8
                                                                                                                       //
		return livechatRemoveDepartment;                                                                                     // 1
	}()                                                                                                                   // 1
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"removeManager.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/removeManager.js                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:removeManager': function () {                                                                               // 2
		function livechatRemoveManager(username) {                                                                           // 1
			if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-livechat-manager')) {                // 3
				throw new Meteor.Error('error-not-allowed', 'Not allowed', { method: 'livechat:removeManager' });                  // 4
			}                                                                                                                   // 5
                                                                                                                       //
			return RocketChat.Livechat.removeManager(username);                                                                 // 7
		}                                                                                                                    // 8
                                                                                                                       //
		return livechatRemoveManager;                                                                                        // 1
	}()                                                                                                                   // 1
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"removeTrigger.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/removeTrigger.js                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:removeTrigger': function () {                                                                               // 2
		function livechatRemoveTrigger() /*trigger*/{                                                                        // 1
			if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-livechat-manager')) {                // 3
				throw new Meteor.Error('error-not-allowed', 'Not allowed', { method: 'livechat:removeTrigger' });                  // 4
			}                                                                                                                   // 5
                                                                                                                       //
			return RocketChat.models.LivechatTrigger.removeAll();                                                               // 7
		}                                                                                                                    // 8
                                                                                                                       //
		return livechatRemoveTrigger;                                                                                        // 1
	}()                                                                                                                   // 1
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"saveCustomField.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/saveCustomField.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* eslint new-cap: [2, {"capIsNewExceptions": ["Match.ObjectIncluding", "Match.Optional"]}] */                         // 1
                                                                                                                       //
Meteor.methods({                                                                                                       // 3
	'livechat:saveCustomField': function () {                                                                             // 4
		function livechatSaveCustomField(_id, customFieldData) {                                                             // 3
			if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-livechat-manager')) {                // 5
				throw new Meteor.Error('error-not-allowed', 'Not allowed', { method: 'livechat:saveCustomField' });                // 6
			}                                                                                                                   // 7
                                                                                                                       //
			if (_id) {                                                                                                          // 9
				check(_id, String);                                                                                                // 10
			}                                                                                                                   // 11
                                                                                                                       //
			check(customFieldData, Match.ObjectIncluding({ field: String, label: String, scope: String, visibility: String }));
                                                                                                                       //
			if (!/^[0-9a-zA-Z-_]+$/.test(customFieldData.field)) {                                                              // 15
				throw new Meteor.Error('error-invalid-custom-field-nmae', 'Invalid custom field name. Use only letters, numbers, hyphens and underscores.', { method: 'livechat:saveCustomField' });
			}                                                                                                                   // 17
                                                                                                                       //
			if (_id) {                                                                                                          // 19
				var customField = RocketChat.models.LivechatCustomField.findOneById(_id);                                          // 20
				if (!customField) {                                                                                                // 21
					throw new Meteor.Error('error-invalid-custom-field', 'Custom Field Not found', { method: 'livechat:saveCustomField' });
				}                                                                                                                  // 23
			}                                                                                                                   // 24
                                                                                                                       //
			return RocketChat.models.LivechatCustomField.createOrUpdateCustomField(_id, customFieldData.field, customFieldData.label, customFieldData.scope, customFieldData.visibility);
		}                                                                                                                    // 27
                                                                                                                       //
		return livechatSaveCustomField;                                                                                      // 3
	}()                                                                                                                   // 3
});                                                                                                                    // 3
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"saveDepartment.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/saveDepartment.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:saveDepartment': function () {                                                                              // 2
		function livechatSaveDepartment(_id, departmentData, departmentAgents) {                                             // 1
			if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-livechat-manager')) {                // 3
				throw new Meteor.Error('error-not-allowed', 'Not allowed', { method: 'livechat:saveDepartment' });                 // 4
			}                                                                                                                   // 5
                                                                                                                       //
			return RocketChat.Livechat.saveDepartment(_id, departmentData, departmentAgents);                                   // 7
		}                                                                                                                    // 8
                                                                                                                       //
		return livechatSaveDepartment;                                                                                       // 1
	}()                                                                                                                   // 1
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"saveInfo.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/saveInfo.js                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* eslint new-cap: [2, {"capIsNewExceptions": ["Match.ObjectIncluding", "Match.Optional"]}] */                         // 1
                                                                                                                       //
Meteor.methods({                                                                                                       // 3
	'livechat:saveInfo': function () {                                                                                    // 4
		function livechatSaveInfo(guestData, roomData) {                                                                     // 4
			if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-l-room')) {                          // 5
				throw new Meteor.Error('error-not-allowed', 'Not allowed', { method: 'livechat:saveInfo' });                       // 6
			}                                                                                                                   // 7
                                                                                                                       //
			check(guestData, Match.ObjectIncluding({                                                                            // 9
				_id: String,                                                                                                       // 10
				name: Match.Optional(String),                                                                                      // 11
				email: Match.Optional(String),                                                                                     // 12
				phone: Match.Optional(String)                                                                                      // 13
			}));                                                                                                                // 9
                                                                                                                       //
			check(roomData, Match.ObjectIncluding({                                                                             // 16
				_id: String,                                                                                                       // 17
				topic: Match.Optional(String),                                                                                     // 18
				tags: Match.Optional(String)                                                                                       // 19
			}));                                                                                                                // 16
                                                                                                                       //
			var ret = RocketChat.Livechat.saveGuest(guestData) && RocketChat.Livechat.saveRoomInfo(roomData, guestData);        // 22
                                                                                                                       //
			Meteor.defer(function () {                                                                                          // 24
				RocketChat.callbacks.run('livechat.saveInfo', RocketChat.models.Rooms.findOneById(roomData._id));                  // 25
			});                                                                                                                 // 26
                                                                                                                       //
			return ret;                                                                                                         // 28
		}                                                                                                                    // 29
                                                                                                                       //
		return livechatSaveInfo;                                                                                             // 4
	}()                                                                                                                   // 4
});                                                                                                                    // 3
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"saveIntegration.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/saveIntegration.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:saveIntegration': function () {                                                                             // 2
		function livechatSaveIntegration(values) {                                                                           // 1
			if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-livechat-manager')) {                // 3
				throw new Meteor.Error('error-not-allowed', 'Not allowed', { method: 'livechat:saveIntegration' });                // 4
			}                                                                                                                   // 5
                                                                                                                       //
			if (typeof values['Livechat_webhookUrl'] !== 'undefined') {                                                         // 7
				RocketChat.settings.updateById('Livechat_webhookUrl', s.trim(values['Livechat_webhookUrl']));                      // 8
			}                                                                                                                   // 9
                                                                                                                       //
			if (typeof values['Livechat_secret_token'] !== 'undefined') {                                                       // 11
				RocketChat.settings.updateById('Livechat_secret_token', s.trim(values['Livechat_secret_token']));                  // 12
			}                                                                                                                   // 13
                                                                                                                       //
			if (typeof values['Livechat_webhook_on_close'] !== 'undefined') {                                                   // 15
				RocketChat.settings.updateById('Livechat_webhook_on_close', !!values['Livechat_webhook_on_close']);                // 16
			}                                                                                                                   // 17
                                                                                                                       //
			if (typeof values['Livechat_webhook_on_offline_msg'] !== 'undefined') {                                             // 19
				RocketChat.settings.updateById('Livechat_webhook_on_offline_msg', !!values['Livechat_webhook_on_offline_msg']);    // 20
			}                                                                                                                   // 21
                                                                                                                       //
			return;                                                                                                             // 23
		}                                                                                                                    // 24
                                                                                                                       //
		return livechatSaveIntegration;                                                                                      // 1
	}()                                                                                                                   // 1
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"saveSurveyFeedback.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/saveSurveyFeedback.js                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* eslint new-cap: [2, {"capIsNewExceptions": ["Match.ObjectIncluding"]}] */                                           // 1
                                                                                                                       //
Meteor.methods({                                                                                                       // 3
	'livechat:saveSurveyFeedback': function () {                                                                          // 4
		function livechatSaveSurveyFeedback(visitorToken, visitorRoom, formData) {                                           // 3
			check(visitorToken, String);                                                                                        // 5
			check(visitorRoom, String);                                                                                         // 6
			check(formData, [Match.ObjectIncluding({ name: String, value: String })]);                                          // 7
                                                                                                                       //
			var visitor = RocketChat.models.Users.getVisitorByToken(visitorToken);                                              // 9
			var room = RocketChat.models.Rooms.findOneById(visitorRoom);                                                        // 10
                                                                                                                       //
			if (visitor !== undefined && room !== undefined && room.v !== undefined && visitor.profile !== undefined && room.v.token === visitor.profile.token) {
				var updateData = {};                                                                                               // 13
				for (var _iterator = formData, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
					var _ref;                                                                                                         // 14
                                                                                                                       //
					if (_isArray) {                                                                                                   // 14
						if (_i >= _iterator.length) break;                                                                               // 14
						_ref = _iterator[_i++];                                                                                          // 14
					} else {                                                                                                          // 14
						_i = _iterator.next();                                                                                           // 14
						if (_i.done) break;                                                                                              // 14
						_ref = _i.value;                                                                                                 // 14
					}                                                                                                                 // 14
                                                                                                                       //
					var item = _ref;                                                                                                  // 14
                                                                                                                       //
					if (_.contains(['satisfaction', 'agentKnowledge', 'agentResposiveness', 'agentFriendliness'], item.name) && _.contains(['1', '2', '3', '4', '5'], item.value)) {
						updateData[item.name] = item.value;                                                                              // 16
					} else if (item.name === 'additionalFeedback') {                                                                  // 17
						updateData[item.name] = item.value;                                                                              // 18
					}                                                                                                                 // 19
				}                                                                                                                  // 20
				if (!_.isEmpty(updateData)) {                                                                                      // 21
					return RocketChat.models.Rooms.updateSurveyFeedbackById(room._id, updateData);                                    // 22
				}                                                                                                                  // 23
			}                                                                                                                   // 24
		}                                                                                                                    // 25
                                                                                                                       //
		return livechatSaveSurveyFeedback;                                                                                   // 3
	}()                                                                                                                   // 3
});                                                                                                                    // 3
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"saveTrigger.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/saveTrigger.js                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:saveTrigger': function () {                                                                                 // 2
		function livechatSaveTrigger(trigger) {                                                                              // 1
			if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-livechat-manager')) {                // 3
				throw new Meteor.Error('error-not-allowed', 'Not allowed', { method: 'livechat:saveTrigger' });                    // 4
			}                                                                                                                   // 5
                                                                                                                       //
			return RocketChat.models.LivechatTrigger.save(trigger);                                                             // 7
		}                                                                                                                    // 8
                                                                                                                       //
		return livechatSaveTrigger;                                                                                          // 1
	}()                                                                                                                   // 1
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"searchAgent.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/searchAgent.js                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:searchAgent': function () {                                                                                 // 2
		function livechatSearchAgent(username) {                                                                             // 1
			if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-livechat-manager')) {                // 3
				throw new Meteor.Error('error-not-allowed', 'Not allowed', { method: 'livechat:searchAgent' });                    // 4
			}                                                                                                                   // 5
                                                                                                                       //
			if (!username || !_.isString(username)) {                                                                           // 7
				throw new Meteor.Error('error-invalid-arguments', 'Invalid arguments', { method: 'livechat:searchAgent' });        // 8
			}                                                                                                                   // 9
                                                                                                                       //
			var user = RocketChat.models.Users.findOneByUsername(username, { fields: { _id: 1, username: 1 } });                // 11
                                                                                                                       //
			if (!user) {                                                                                                        // 13
				throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'livechat:searchAgent' });                  // 14
			}                                                                                                                   // 15
                                                                                                                       //
			return user;                                                                                                        // 17
		}                                                                                                                    // 18
                                                                                                                       //
		return livechatSearchAgent;                                                                                          // 1
	}()                                                                                                                   // 1
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"sendMessageLivechat.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/sendMessageLivechat.js                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	sendMessageLivechat: function () {                                                                                    // 2
		function sendMessageLivechat(message) {                                                                              // 2
			var guest;                                                                                                          // 3
                                                                                                                       //
			check(message.rid, String);                                                                                         // 5
			check(message.token, String);                                                                                       // 6
                                                                                                                       //
			guest = Meteor.users.findOne(Meteor.userId(), {                                                                     // 8
				fields: {                                                                                                          // 9
					name: 1,                                                                                                          // 10
					username: 1,                                                                                                      // 11
					department: 1                                                                                                     // 12
				}                                                                                                                  // 9
			});                                                                                                                 // 8
                                                                                                                       //
			return RocketChat.Livechat.sendMessage({ guest: guest, message: message });                                         // 16
		}                                                                                                                    // 17
                                                                                                                       //
		return sendMessageLivechat;                                                                                          // 2
	}()                                                                                                                   // 2
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"sendOfflineMessage.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/sendOfflineMessage.js                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals DDPRateLimiter */                                                                                           // 1
Meteor.methods({                                                                                                       // 2
	'livechat:sendOfflineMessage': function () {                                                                          // 3
		function livechatSendOfflineMessage(data) {                                                                          // 2
			check(data, {                                                                                                       // 4
				name: String,                                                                                                      // 5
				email: String,                                                                                                     // 6
				message: String                                                                                                    // 7
			});                                                                                                                 // 4
                                                                                                                       //
			var header = RocketChat.placeholders.replace(RocketChat.settings.get('Email_Header') || '');                        // 10
			var footer = RocketChat.placeholders.replace(RocketChat.settings.get('Email_Footer') || '');                        // 11
                                                                                                                       //
			var message = (data.message + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');                   // 13
                                                                                                                       //
			var html = '\n\t\t\t<h1>New livechat message</h1>\n\t\t\t<p><strong>Visitor name:</strong> ' + data.name + '</p>\n\t\t\t<p><strong>Visitor email:</strong> ' + data.email + '</p>\n\t\t\t<p><strong>Message:</strong><br>' + message + '</p>';
                                                                                                                       //
			var fromEmail = RocketChat.settings.get('From_Email').match(/\b[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,4}\b/i);     // 21
                                                                                                                       //
			if (fromEmail) {                                                                                                    // 23
				fromEmail = fromEmail[0];                                                                                          // 24
			} else {                                                                                                            // 25
				fromEmail = RocketChat.settings.get('From_Email');                                                                 // 26
			}                                                                                                                   // 27
                                                                                                                       //
			Meteor.defer(function () {                                                                                          // 29
				Email.send({                                                                                                       // 30
					to: RocketChat.settings.get('Livechat_offline_email'),                                                            // 31
					from: data.name + ' - ' + data.email + ' <' + fromEmail + '>',                                                    // 32
					replyTo: data.name + ' <' + data.email + '>',                                                                     // 33
					subject: 'Livechat offline message from ' + data.name + ': ' + (data.message + '').substring(0, 20),              // 34
					html: header + html + footer                                                                                      // 35
				});                                                                                                                // 30
			});                                                                                                                 // 37
                                                                                                                       //
			Meteor.defer(function () {                                                                                          // 39
				RocketChat.callbacks.run('livechat.offlineMessage', data);                                                         // 40
			});                                                                                                                 // 41
                                                                                                                       //
			return true;                                                                                                        // 43
		}                                                                                                                    // 44
                                                                                                                       //
		return livechatSendOfflineMessage;                                                                                   // 2
	}()                                                                                                                   // 2
});                                                                                                                    // 2
                                                                                                                       //
DDPRateLimiter.addRule({                                                                                               // 47
	type: 'method',                                                                                                       // 48
	name: 'livechat:sendOfflineMessage',                                                                                  // 49
	connectionId: function () {                                                                                           // 50
		function connectionId() {                                                                                            // 47
			return true;                                                                                                        // 51
		}                                                                                                                    // 52
                                                                                                                       //
		return connectionId;                                                                                                 // 47
	}()                                                                                                                   // 47
}, 1, 5000);                                                                                                           // 47
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"setCustomField.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/setCustomField.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:setCustomField': function () {                                                                              // 2
		function livechatSetCustomField(token, key, value) {                                                                 // 1
			var customField = RocketChat.models.LivechatCustomField.findOneById(key);                                           // 3
			if (customField) {                                                                                                  // 4
				if (customField.scope === 'room') {                                                                                // 5
					return RocketChat.models.Rooms.updateLivechatDataByToken(token, key, value);                                      // 6
				} else {                                                                                                           // 7
					// Save in user                                                                                                   // 8
					return RocketChat.models.Users.updateLivechatDataByToken(token, key, value);                                      // 9
				}                                                                                                                  // 10
			}                                                                                                                   // 11
                                                                                                                       //
			return true;                                                                                                        // 13
		}                                                                                                                    // 14
                                                                                                                       //
		return livechatSetCustomField;                                                                                       // 1
	}()                                                                                                                   // 1
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"startVideoCall.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/startVideoCall.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* eslint new-cap: [2, {"capIsNewExceptions": ["MD5"]}] */                                                             // 1
Meteor.methods({                                                                                                       // 2
	'livechat:startVideoCall': function () {                                                                              // 3
		function livechatStartVideoCall(roomId) {                                                                            // 2
			if (!Meteor.userId()) {                                                                                             // 4
				throw new Meteor.Error('error-not-authorized', 'Not authorized', { method: 'livechat:closeByVisitor' });           // 5
			}                                                                                                                   // 6
                                                                                                                       //
			var guest = Meteor.user();                                                                                          // 8
                                                                                                                       //
			var message = {                                                                                                     // 10
				_id: Random.id(),                                                                                                  // 11
				rid: roomId || Random.id(),                                                                                        // 12
				msg: '',                                                                                                           // 13
				ts: new Date()                                                                                                     // 14
			};                                                                                                                  // 10
                                                                                                                       //
			var _RocketChat$Livechat$ = RocketChat.Livechat.getRoom(guest, message, { jitsiTimeout: new Date(Date.now() + 3600 * 1000) });
                                                                                                                       //
			var room = _RocketChat$Livechat$.room;                                                                              // 3
                                                                                                                       //
			message.rid = room._id;                                                                                             // 18
                                                                                                                       //
			RocketChat.models.Messages.createWithTypeRoomIdMessageAndUser('livechat_video_call', room._id, '', guest, {         // 20
				actionLinks: [{ icon: 'icon-videocam', i18nLabel: 'Accept', method_id: 'createLivechatCall', params: '' }, { icon: 'icon-cancel', i18nLabel: 'Decline', method_id: 'denyLivechatCall', params: '' }]
			});                                                                                                                 // 20
                                                                                                                       //
			return {                                                                                                            // 27
				roomId: room._id,                                                                                                  // 28
				domain: RocketChat.settings.get('Jitsi_Domain'),                                                                   // 29
				jitsiRoom: 'RocketChat' + CryptoJS.MD5(RocketChat.settings.get('uniqueID') + roomId).toString()                    // 30
			};                                                                                                                  // 27
		}                                                                                                                    // 32
                                                                                                                       //
		return livechatStartVideoCall;                                                                                       // 2
	}()                                                                                                                   // 2
});                                                                                                                    // 2
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"transfer.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/transfer.js                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* eslint new-cap: [2, {"capIsNewExceptions": ["Match.Optional"]}] */                                                  // 1
Meteor.methods({                                                                                                       // 2
	'livechat:transfer': function () {                                                                                    // 3
		function livechatTransfer(transferData) {                                                                            // 2
			if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-l-room')) {                          // 4
				throw new Meteor.Error('error-not-allowed', 'Not allowed', { method: 'livechat:transfer' });                       // 5
			}                                                                                                                   // 6
                                                                                                                       //
			check(transferData, {                                                                                               // 8
				roomId: String,                                                                                                    // 9
				userId: Match.Optional(String),                                                                                    // 10
				deparmentId: Match.Optional(String)                                                                                // 11
			});                                                                                                                 // 8
                                                                                                                       //
			var room = RocketChat.models.Rooms.findOneById(transferData.roomId);                                                // 14
                                                                                                                       //
			var guest = RocketChat.models.Users.findOneById(room.v._id);                                                        // 16
                                                                                                                       //
			var user = Meteor.user();                                                                                           // 18
                                                                                                                       //
			if (room.usernames.indexOf(user.username) === -1) {                                                                 // 20
				throw new Meteor.Error('error-not-authorized', 'Not authorized', { method: 'livechat:transfer' });                 // 21
			}                                                                                                                   // 22
                                                                                                                       //
			return RocketChat.Livechat.transfer(room, guest, transferData);                                                     // 24
		}                                                                                                                    // 25
                                                                                                                       //
		return livechatTransfer;                                                                                             // 2
	}()                                                                                                                   // 2
});                                                                                                                    // 2
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"webhookTest.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/webhookTest.js                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals HTTP */                                                                                                     // 1
var postCatchError = Meteor.wrapAsync(function (url, options, resolve) {                                               // 2
	HTTP.post(url, options, function (err, res) {                                                                         // 3
		if (err) {                                                                                                           // 4
			resolve(null, err.response);                                                                                        // 5
		} else {                                                                                                             // 6
			resolve(null, res);                                                                                                 // 7
		}                                                                                                                    // 8
	});                                                                                                                   // 9
});                                                                                                                    // 10
                                                                                                                       //
Meteor.methods({                                                                                                       // 12
	'livechat:webhookTest': function () {                                                                                 // 13
		function livechatWebhookTest() {                                                                                     // 12
			this.unblock();                                                                                                     // 14
                                                                                                                       //
			var sampleData = {                                                                                                  // 16
				type: 'LivechatSession',                                                                                           // 17
				_id: 'fasd6f5a4sd6f8a4sdf',                                                                                        // 18
				label: 'title',                                                                                                    // 19
				topic: 'asiodojf',                                                                                                 // 20
				code: 123123,                                                                                                      // 21
				createdAt: new Date(),                                                                                             // 22
				lastMessageAt: new Date(),                                                                                         // 23
				tags: ['tag1', 'tag2', 'tag3'],                                                                                    // 24
				customFields: {                                                                                                    // 29
					productId: '123456'                                                                                               // 30
				},                                                                                                                 // 29
				visitor: {                                                                                                         // 32
					_id: '',                                                                                                          // 33
					name: 'visitor name',                                                                                             // 34
					username: 'visitor-username',                                                                                     // 35
					department: 'department',                                                                                         // 36
					email: 'email@address.com',                                                                                       // 37
					phone: '192873192873',                                                                                            // 38
					ip: '123.456.7.89',                                                                                               // 39
					browser: 'Chrome',                                                                                                // 40
					os: 'Linux',                                                                                                      // 41
					customFields: {                                                                                                   // 42
						customerId: '123456'                                                                                             // 43
					}                                                                                                                 // 42
				},                                                                                                                 // 32
				agent: {                                                                                                           // 46
					_id: 'asdf89as6df8',                                                                                              // 47
					username: 'agent.username',                                                                                       // 48
					name: 'Agent Name',                                                                                               // 49
					email: 'agent@email.com'                                                                                          // 50
				},                                                                                                                 // 46
				messages: [{                                                                                                       // 52
					username: 'visitor-username',                                                                                     // 53
					msg: 'message content',                                                                                           // 54
					ts: new Date()                                                                                                    // 55
				}, {                                                                                                               // 52
					username: 'agent.username',                                                                                       // 57
					agentId: 'asdf89as6df8',                                                                                          // 58
					msg: 'message content from agent',                                                                                // 59
					ts: new Date()                                                                                                    // 60
				}]                                                                                                                 // 56
			};                                                                                                                  // 16
                                                                                                                       //
			var options = {                                                                                                     // 64
				headers: {                                                                                                         // 65
					'X-RocketChat-Livechat-Token': RocketChat.settings.get('Livechat_secret_token')                                   // 66
				},                                                                                                                 // 65
				data: sampleData                                                                                                   // 68
			};                                                                                                                  // 64
                                                                                                                       //
			var response = postCatchError(RocketChat.settings.get('Livechat_webhookUrl'), options);                             // 71
                                                                                                                       //
			console.log('response ->', response);                                                                               // 73
                                                                                                                       //
			if (response && response.statusCode && response.statusCode === 200) {                                               // 75
				return true;                                                                                                       // 76
			} else {                                                                                                            // 77
				throw new Meteor.Error('error-invalid-webhook-response');                                                          // 78
			}                                                                                                                   // 79
		}                                                                                                                    // 80
                                                                                                                       //
		return livechatWebhookTest;                                                                                          // 12
	}()                                                                                                                   // 12
});                                                                                                                    // 12
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"takeInquiry.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/takeInquiry.js                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:takeInquiry': function () {                                                                                 // 2
		function livechatTakeInquiry(inquiryId) {                                                                            // 1
			if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-l-room')) {                          // 3
				throw new Meteor.Error('error-not-allowed', 'Not allowed', { method: 'livechat:takeInquiry' });                    // 4
			}                                                                                                                   // 5
                                                                                                                       //
			var inquiry = RocketChat.models.LivechatInquiry.findOneById(inquiryId);                                             // 7
                                                                                                                       //
			if (!inquiry || inquiry.status === 'taken') {                                                                       // 9
				throw new Meteor.Error('error-not-allowed', 'Inquiry already taken', { method: 'livechat:takeInquiry' });          // 10
			}                                                                                                                   // 11
                                                                                                                       //
			var user = RocketChat.models.Users.findOneById(Meteor.userId());                                                    // 13
                                                                                                                       //
			var agent = {                                                                                                       // 15
				agentId: user._id,                                                                                                 // 16
				username: user.username                                                                                            // 17
			};                                                                                                                  // 15
                                                                                                                       //
			// add subscription                                                                                                 // 20
			var subscriptionData = {                                                                                            // 21
				rid: inquiry.rid,                                                                                                  // 22
				name: inquiry.name,                                                                                                // 23
				alert: true,                                                                                                       // 24
				open: true,                                                                                                        // 25
				unread: 1,                                                                                                         // 26
				code: inquiry.code,                                                                                                // 27
				u: {                                                                                                               // 28
					_id: agent.agentId,                                                                                               // 29
					username: agent.username                                                                                          // 30
				},                                                                                                                 // 28
				t: 'l',                                                                                                            // 32
				desktopNotifications: 'all',                                                                                       // 33
				mobilePushNotifications: 'all',                                                                                    // 34
				emailNotifications: 'all'                                                                                          // 35
			};                                                                                                                  // 21
			RocketChat.models.Subscriptions.insert(subscriptionData);                                                           // 37
                                                                                                                       //
			// update room                                                                                                      // 39
			var room = RocketChat.models.Rooms.findOneById(inquiry.rid);                                                        // 40
			var usernames = room.usernames.concat(agent.username);                                                              // 41
                                                                                                                       //
			RocketChat.models.Rooms.changeAgentByRoomId(inquiry.rid, usernames, agent);                                         // 43
                                                                                                                       //
			room.usernames = usernames;                                                                                         // 45
			room.servedBy = {                                                                                                   // 46
				_id: agent.agentId,                                                                                                // 47
				username: agent.username                                                                                           // 48
			};                                                                                                                  // 46
                                                                                                                       //
			// mark inquiry as taken                                                                                            // 51
			RocketChat.models.LivechatInquiry.takeInquiry(inquiry._id);                                                         // 52
                                                                                                                       //
			// return room corresponding to inquiry (for redirecting agent to the room route)                                   // 54
			return room;                                                                                                        // 55
		}                                                                                                                    // 56
                                                                                                                       //
		return livechatTakeInquiry;                                                                                          // 1
	}()                                                                                                                   // 1
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"returnAsInquiry.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/returnAsInquiry.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:returnAsInquiry': function () {                                                                             // 2
		function livechatReturnAsInquiry(rid) {                                                                              // 1
			if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'view-l-room')) {                          // 3
				throw new Meteor.Error('error-not-allowed', 'Not allowed', { method: 'livechat:saveDepartment' });                 // 4
			}                                                                                                                   // 5
                                                                                                                       //
			// //delete agent and room subscription                                                                             // 7
			RocketChat.models.Subscriptions.removeByRoomId(rid);                                                                // 8
                                                                                                                       //
			// remove user from room                                                                                            // 10
			var username = Meteor.user().username;                                                                              // 11
                                                                                                                       //
			RocketChat.models.Rooms.removeUsernameById(rid, username);                                                          // 13
                                                                                                                       //
			// find inquiry corresponding to room                                                                               // 15
			var inquiry = RocketChat.models.LivechatInquiry.findOne({ rid: rid });                                              // 16
                                                                                                                       //
			// mark inquiry as open                                                                                             // 18
			return RocketChat.models.LivechatInquiry.openInquiry(inquiry._id);                                                  // 19
		}                                                                                                                    // 20
                                                                                                                       //
		return livechatReturnAsInquiry;                                                                                      // 1
	}()                                                                                                                   // 1
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"saveOfficeHours.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/saveOfficeHours.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'livechat:saveOfficeHours': function () {                                                                             // 2
		function livechatSaveOfficeHours(day, start, finish, open) {                                                         // 1
			RocketChat.models.LivechatOfficeHour.updateHours(day, start, finish, open);                                         // 3
		}                                                                                                                    // 4
                                                                                                                       //
		return livechatSaveOfficeHours;                                                                                      // 1
	}()                                                                                                                   // 1
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"sendTranscript.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/methods/sendTranscript.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals emailSettings, DDPRateLimiter */                                                                            // 1
/* Send a transcript of the room converstation to the given email */                                                   // 2
Meteor.methods({                                                                                                       // 3
	'livechat:sendTranscript': function () {                                                                              // 4
		function livechatSendTranscript(rid, email) {                                                                        // 3
			check(rid, String);                                                                                                 // 5
			check(email, String);                                                                                               // 6
                                                                                                                       //
			var room = RocketChat.models.Rooms.findOneById(rid);                                                                // 8
			var user = Meteor.user();                                                                                           // 9
			var userLanguage = user.language || RocketChat.settings.get('language') || 'en';                                    // 10
                                                                                                                       //
			// allow to only user to send transcripts from their own chats                                                      // 12
			if (!room || room.t !== 'l' || !room.v || !user.profile || room.v.token !== user.profile.token) {                   // 13
				throw new Meteor.Error('error-invalid-room', 'Invalid room');                                                      // 14
			}                                                                                                                   // 15
                                                                                                                       //
			var messages = RocketChat.models.Messages.findVisibleByRoomId(rid, { sort: { 'ts': 1 } });                          // 17
			var header = RocketChat.placeholders.replace(RocketChat.settings.get('Email_Header') || '');                        // 18
			var footer = RocketChat.placeholders.replace(RocketChat.settings.get('Email_Footer') || '');                        // 19
                                                                                                                       //
			var html = '<div> <hr>';                                                                                            // 21
			messages.forEach(function (message) {                                                                               // 22
				if (message.t && ['command', 'livechat-close', 'livechat_video_call'].indexOf(message.t) !== -1) {                 // 23
					return;                                                                                                           // 24
				}                                                                                                                  // 25
                                                                                                                       //
				var author;                                                                                                        // 27
				if (message.u._id === Meteor.userId()) {                                                                           // 28
					author = TAPi18n.__('You', { lng: userLanguage });                                                                // 29
				} else {                                                                                                           // 30
					author = message.u.username;                                                                                      // 31
				}                                                                                                                  // 32
                                                                                                                       //
				var datetime = moment(message.ts).locale(userLanguage).format('LLL');                                              // 34
				var singleMessage = '\n\t\t\t\t<p><strong>' + author + '</strong>  <em>' + datetime + '</em></p>\n\t\t\t\t<p>' + message.msg + '</p>\n\t\t\t';
				html = html + singleMessage;                                                                                       // 39
			});                                                                                                                 // 40
                                                                                                                       //
			html = html + '</div>';                                                                                             // 42
                                                                                                                       //
			var fromEmail = RocketChat.settings.get('From_Email').match(/\b[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,4}\b/i);     // 44
                                                                                                                       //
			if (fromEmail) {                                                                                                    // 46
				fromEmail = fromEmail[0];                                                                                          // 47
			} else {                                                                                                            // 48
				fromEmail = RocketChat.settings.get('From_Email');                                                                 // 49
			}                                                                                                                   // 50
                                                                                                                       //
			emailSettings = {                                                                                                   // 52
				to: email,                                                                                                         // 53
				from: fromEmail,                                                                                                   // 54
				replyTo: fromEmail,                                                                                                // 55
				subject: TAPi18n.__('Transcript_of_your_livechat_conversation', { lng: userLanguage }),                            // 56
				html: header + html + footer                                                                                       // 57
			};                                                                                                                  // 52
                                                                                                                       //
			Meteor.defer(function () {                                                                                          // 60
				Email.send(emailSettings);                                                                                         // 61
			});                                                                                                                 // 62
                                                                                                                       //
			Meteor.defer(function () {                                                                                          // 64
				RocketChat.callbacks.run('livechat.sendTranscript', messages, email);                                              // 65
			});                                                                                                                 // 66
                                                                                                                       //
			return true;                                                                                                        // 68
		}                                                                                                                    // 69
                                                                                                                       //
		return livechatSendTranscript;                                                                                       // 3
	}()                                                                                                                   // 3
});                                                                                                                    // 3
                                                                                                                       //
DDPRateLimiter.addRule({                                                                                               // 72
	type: 'method',                                                                                                       // 73
	name: 'livechat:sendTranscript',                                                                                      // 74
	connectionId: function () {                                                                                           // 75
		function connectionId() {                                                                                            // 72
			return true;                                                                                                        // 76
		}                                                                                                                    // 77
                                                                                                                       //
		return connectionId;                                                                                                 // 72
	}()                                                                                                                   // 72
}, 1, 5000);                                                                                                           // 72
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"models":{"Users.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/models/Users.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * Sets an user as (non)operator                                                                                       //
 * @param {string} _id - User's _id                                                                                    //
 * @param {boolean} operator - Flag to set as operator or not                                                          //
 */                                                                                                                    //
RocketChat.models.Users.setOperator = function (_id, operator) {                                                       // 6
	var update = {                                                                                                        // 7
		$set: {                                                                                                              // 8
			operator: operator                                                                                                  // 9
		}                                                                                                                    // 8
	};                                                                                                                    // 7
                                                                                                                       //
	return this.update(_id, update);                                                                                      // 13
};                                                                                                                     // 14
                                                                                                                       //
/**                                                                                                                    // 16
 * Gets all online agents                                                                                              //
 * @return                                                                                                             //
 */                                                                                                                    //
RocketChat.models.Users.findOnlineAgents = function () {                                                               // 20
	var query = {                                                                                                         // 21
		statusConnection: {                                                                                                  // 22
			$exists: true,                                                                                                      // 23
			$ne: 'offline'                                                                                                      // 24
		},                                                                                                                   // 22
		statusLivechat: 'available',                                                                                         // 26
		roles: 'livechat-agent'                                                                                              // 27
	};                                                                                                                    // 21
                                                                                                                       //
	return this.find(query);                                                                                              // 30
};                                                                                                                     // 31
                                                                                                                       //
/**                                                                                                                    // 33
 * Gets all agents                                                                                                     //
 * @return                                                                                                             //
 */                                                                                                                    //
RocketChat.models.Users.findAgents = function () {                                                                     // 37
	var query = {                                                                                                         // 38
		roles: 'livechat-agent'                                                                                              // 39
	};                                                                                                                    // 38
                                                                                                                       //
	return this.find(query);                                                                                              // 42
};                                                                                                                     // 43
                                                                                                                       //
/**                                                                                                                    // 45
 * Find online users from a list                                                                                       //
 * @param {array} userList - array of usernames                                                                        //
 * @return                                                                                                             //
 */                                                                                                                    //
RocketChat.models.Users.findOnlineUserFromList = function (userList) {                                                 // 50
	var query = {                                                                                                         // 51
		statusConnection: {                                                                                                  // 52
			$exists: true,                                                                                                      // 53
			$ne: 'offline'                                                                                                      // 54
		},                                                                                                                   // 52
		statusLivechat: 'available',                                                                                         // 56
		roles: 'livechat-agent',                                                                                             // 57
		username: {                                                                                                          // 58
			$in: [].concat(userList)                                                                                            // 59
		}                                                                                                                    // 58
	};                                                                                                                    // 51
                                                                                                                       //
	return this.find(query);                                                                                              // 63
};                                                                                                                     // 64
                                                                                                                       //
/**                                                                                                                    // 66
 * Get next user agent in order                                                                                        //
 * @return {object} User from db                                                                                       //
 */                                                                                                                    //
RocketChat.models.Users.getNextAgent = function () {                                                                   // 70
	var query = {                                                                                                         // 71
		statusConnection: {                                                                                                  // 72
			$exists: true,                                                                                                      // 73
			$ne: 'offline'                                                                                                      // 74
		},                                                                                                                   // 72
		statusLivechat: 'available',                                                                                         // 76
		roles: 'livechat-agent'                                                                                              // 77
	};                                                                                                                    // 71
                                                                                                                       //
	var collectionObj = this.model.rawCollection();                                                                       // 80
	var findAndModify = Meteor.wrapAsync(collectionObj.findAndModify, collectionObj);                                     // 81
                                                                                                                       //
	var sort = {                                                                                                          // 83
		livechatCount: 1,                                                                                                    // 84
		username: 1                                                                                                          // 85
	};                                                                                                                    // 83
                                                                                                                       //
	var update = {                                                                                                        // 88
		$inc: {                                                                                                              // 89
			livechatCount: 1                                                                                                    // 90
		}                                                                                                                    // 89
	};                                                                                                                    // 88
                                                                                                                       //
	var user = findAndModify(query, sort, update);                                                                        // 94
	if (user && user.value) {                                                                                             // 95
		return {                                                                                                             // 96
			agentId: user.value._id,                                                                                            // 97
			username: user.value.username                                                                                       // 98
		};                                                                                                                   // 96
	} else {                                                                                                              // 100
		return null;                                                                                                         // 101
	}                                                                                                                     // 102
};                                                                                                                     // 103
                                                                                                                       //
/**                                                                                                                    // 105
 * Gets visitor by token                                                                                               //
 * @param {string} token - Visitor token                                                                               //
 */                                                                                                                    //
RocketChat.models.Users.getVisitorByToken = function (token, options) {                                                // 109
	var query = {                                                                                                         // 110
		'profile.guest': true,                                                                                               // 111
		'profile.token': token                                                                                               // 112
	};                                                                                                                    // 110
                                                                                                                       //
	return this.findOne(query, options);                                                                                  // 115
};                                                                                                                     // 116
                                                                                                                       //
/**                                                                                                                    // 118
 * Gets visitor by token                                                                                               //
 * @param {string} token - Visitor token                                                                               //
 */                                                                                                                    //
RocketChat.models.Users.findVisitorByToken = function (token) {                                                        // 122
	var query = {                                                                                                         // 123
		'profile.guest': true,                                                                                               // 124
		'profile.token': token                                                                                               // 125
	};                                                                                                                    // 123
                                                                                                                       //
	return this.find(query);                                                                                              // 128
};                                                                                                                     // 129
                                                                                                                       //
/**                                                                                                                    // 131
 * Change user's livechat status                                                                                       //
 * @param {string} token - Visitor token                                                                               //
 */                                                                                                                    //
RocketChat.models.Users.setLivechatStatus = function (userId, status) {                                                // 135
	var query = {                                                                                                         // 136
		'_id': userId                                                                                                        // 137
	};                                                                                                                    // 136
                                                                                                                       //
	var update = {                                                                                                        // 140
		$set: {                                                                                                              // 141
			'statusLivechat': status                                                                                            // 142
		}                                                                                                                    // 141
	};                                                                                                                    // 140
                                                                                                                       //
	return this.update(query, update);                                                                                    // 146
};                                                                                                                     // 147
                                                                                                                       //
/**                                                                                                                    // 149
 * change all livechat agents livechat status to "not-available"                                                       //
 */                                                                                                                    //
RocketChat.models.Users.closeOffice = function () {                                                                    // 152
	self = this;                                                                                                          // 153
	self.findAgents().forEach(function (agent) {                                                                          // 154
		self.setLivechatStatus(agent._id, 'not-available');                                                                  // 155
	});                                                                                                                   // 156
};                                                                                                                     // 157
                                                                                                                       //
/**                                                                                                                    // 159
 * change all livechat agents livechat status to "available"                                                           //
 */                                                                                                                    //
RocketChat.models.Users.openOffice = function () {                                                                     // 162
	self = this;                                                                                                          // 163
	self.findAgents().forEach(function (agent) {                                                                          // 164
		self.setLivechatStatus(agent._id, 'available');                                                                      // 165
	});                                                                                                                   // 166
};                                                                                                                     // 167
                                                                                                                       //
RocketChat.models.Users.updateLivechatDataByToken = function (token, key, value) {                                     // 169
	var _$set;                                                                                                            // 169
                                                                                                                       //
	var query = {                                                                                                         // 170
		'profile.token': token                                                                                               // 171
	};                                                                                                                    // 170
                                                                                                                       //
	var update = {                                                                                                        // 174
		$set: (_$set = {}, _$set['livechatData.' + key] = value, _$set)                                                      // 175
	};                                                                                                                    // 174
                                                                                                                       //
	return this.update(query, update);                                                                                    // 180
};                                                                                                                     // 181
                                                                                                                       //
/**                                                                                                                    // 183
 * Find a visitor by their phone number                                                                                //
 * @return {object} User from db                                                                                       //
 */                                                                                                                    //
RocketChat.models.Users.findOneVisitorByPhone = function (phone) {                                                     // 187
	var query = {                                                                                                         // 188
		'phone.phoneNumber': phone                                                                                           // 189
	};                                                                                                                    // 188
                                                                                                                       //
	return this.findOne(query);                                                                                           // 192
};                                                                                                                     // 193
                                                                                                                       //
/**                                                                                                                    // 195
 * Get the next visitor name                                                                                           //
 * @return {string} The next visitor name                                                                              //
 */                                                                                                                    //
RocketChat.models.Users.getNextVisitorUsername = function () {                                                         // 199
	var settingsRaw = RocketChat.models.Settings.model.rawCollection();                                                   // 200
	var findAndModify = Meteor.wrapAsync(settingsRaw.findAndModify, settingsRaw);                                         // 201
                                                                                                                       //
	var query = {                                                                                                         // 203
		_id: 'Livechat_guest_count'                                                                                          // 204
	};                                                                                                                    // 203
                                                                                                                       //
	var update = {                                                                                                        // 207
		$inc: {                                                                                                              // 208
			value: 1                                                                                                            // 209
		}                                                                                                                    // 208
	};                                                                                                                    // 207
                                                                                                                       //
	var livechatCount = findAndModify(query, null, update);                                                               // 213
                                                                                                                       //
	return 'guest-' + (livechatCount.value.value + 1);                                                                    // 215
};                                                                                                                     // 216
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Rooms.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/models/Rooms.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * Gets visitor by token                                                                                               //
 * @param {string} token - Visitor token                                                                               //
 */                                                                                                                    //
RocketChat.models.Rooms.updateSurveyFeedbackById = function (_id, surveyFeedback) {                                    // 5
	var query = {                                                                                                         // 6
		_id: _id                                                                                                             // 7
	};                                                                                                                    // 6
                                                                                                                       //
	var update = {                                                                                                        // 10
		$set: {                                                                                                              // 11
			surveyFeedback: surveyFeedback                                                                                      // 12
		}                                                                                                                    // 11
	};                                                                                                                    // 10
                                                                                                                       //
	return this.update(query, update);                                                                                    // 16
};                                                                                                                     // 17
                                                                                                                       //
RocketChat.models.Rooms.updateLivechatDataByToken = function (token, key, value) {                                     // 19
	var _$set;                                                                                                            // 19
                                                                                                                       //
	var query = {                                                                                                         // 20
		'v.token': token,                                                                                                    // 21
		open: true                                                                                                           // 22
	};                                                                                                                    // 20
                                                                                                                       //
	var update = {                                                                                                        // 25
		$set: (_$set = {}, _$set['livechatData.' + key] = value, _$set)                                                      // 26
	};                                                                                                                    // 25
                                                                                                                       //
	return this.update(query, update);                                                                                    // 31
};                                                                                                                     // 32
                                                                                                                       //
RocketChat.models.Rooms.findLivechat = function () {                                                                   // 34
	var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};                                  // 34
	var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;                                   // 34
	var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 20;                                   // 34
                                                                                                                       //
	var query = _.extend(filter, {                                                                                        // 35
		t: 'l'                                                                                                               // 36
	});                                                                                                                   // 35
                                                                                                                       //
	return this.find(query, { sort: { ts: -1 }, offset: offset, limit: limit });                                          // 39
};                                                                                                                     // 40
                                                                                                                       //
RocketChat.models.Rooms.findLivechatByCode = function (code, fields) {                                                 // 42
	code = parseInt(code);                                                                                                // 43
                                                                                                                       //
	var options = {};                                                                                                     // 45
                                                                                                                       //
	var query = {                                                                                                         // 47
		t: 'l',                                                                                                              // 48
		code: code                                                                                                           // 49
	};                                                                                                                    // 47
                                                                                                                       //
	if (fields) {                                                                                                         // 52
		options.fields = fields;                                                                                             // 53
	}                                                                                                                     // 54
                                                                                                                       //
	return this.find(query, options);                                                                                     // 56
};                                                                                                                     // 57
                                                                                                                       //
/**                                                                                                                    // 59
 * Get the next visitor name                                                                                           //
 * @return {string} The next visitor name                                                                              //
 */                                                                                                                    //
RocketChat.models.Rooms.getNextLivechatRoomCode = function () {                                                        // 63
	var settingsRaw = RocketChat.models.Settings.model.rawCollection();                                                   // 64
	var findAndModify = Meteor.wrapAsync(settingsRaw.findAndModify, settingsRaw);                                         // 65
                                                                                                                       //
	var query = {                                                                                                         // 67
		_id: 'Livechat_Room_Count'                                                                                           // 68
	};                                                                                                                    // 67
                                                                                                                       //
	var update = {                                                                                                        // 71
		$inc: {                                                                                                              // 72
			value: 1                                                                                                            // 73
		}                                                                                                                    // 72
	};                                                                                                                    // 71
                                                                                                                       //
	var livechatCount = findAndModify(query, null, update);                                                               // 77
                                                                                                                       //
	return livechatCount.value.value;                                                                                     // 79
};                                                                                                                     // 80
                                                                                                                       //
RocketChat.models.Rooms.findOpenByVisitorToken = function (visitorToken, options) {                                    // 82
	var query = {                                                                                                         // 83
		open: true,                                                                                                          // 84
		'v.token': visitorToken                                                                                              // 85
	};                                                                                                                    // 83
                                                                                                                       //
	return this.find(query, options);                                                                                     // 88
};                                                                                                                     // 89
                                                                                                                       //
RocketChat.models.Rooms.findByVisitorToken = function (visitorToken) {                                                 // 91
	var query = {                                                                                                         // 92
		'v.token': visitorToken                                                                                              // 93
	};                                                                                                                    // 92
                                                                                                                       //
	return this.find(query);                                                                                              // 96
};                                                                                                                     // 97
                                                                                                                       //
RocketChat.models.Rooms.findByVisitorId = function (visitorId) {                                                       // 99
	var query = {                                                                                                         // 100
		'v._id': visitorId                                                                                                   // 101
	};                                                                                                                    // 100
                                                                                                                       //
	return this.find(query);                                                                                              // 104
};                                                                                                                     // 105
                                                                                                                       //
RocketChat.models.Rooms.findOneOpenByVisitorId = function (visitorId) {                                                // 107
	var query = {                                                                                                         // 108
		open: true,                                                                                                          // 109
		'v._id': visitorId                                                                                                   // 110
	};                                                                                                                    // 108
                                                                                                                       //
	return this.findOne(query);                                                                                           // 113
};                                                                                                                     // 114
                                                                                                                       //
RocketChat.models.Rooms.setResponseByRoomId = function (roomId, response) {                                            // 116
	return this.update({                                                                                                  // 117
		_id: roomId                                                                                                          // 118
	}, {                                                                                                                  // 117
		$set: {                                                                                                              // 120
			responseBy: {                                                                                                       // 121
				_id: response.user._id,                                                                                            // 122
				username: response.user.username                                                                                   // 123
			},                                                                                                                  // 121
			responseDate: response.responseDate,                                                                                // 125
			responseTime: response.responseTime                                                                                 // 126
		},                                                                                                                   // 120
		$unset: {                                                                                                            // 128
			waitingResponse: 1                                                                                                  // 129
		}                                                                                                                    // 128
	});                                                                                                                   // 119
};                                                                                                                     // 132
                                                                                                                       //
RocketChat.models.Rooms.closeByRoomId = function (roomId, closeInfo) {                                                 // 134
	return this.update({                                                                                                  // 135
		_id: roomId                                                                                                          // 136
	}, {                                                                                                                  // 135
		$set: {                                                                                                              // 138
			closedBy: {                                                                                                         // 139
				_id: closeInfo.user._id,                                                                                           // 140
				username: closeInfo.user.username                                                                                  // 141
			},                                                                                                                  // 139
			closedAt: closeInfo.closedAt,                                                                                       // 143
			chatDuration: closeInfo.chatDuration                                                                                // 144
		},                                                                                                                   // 138
		$unset: {                                                                                                            // 146
			open: 1                                                                                                             // 147
		}                                                                                                                    // 146
	});                                                                                                                   // 137
};                                                                                                                     // 150
                                                                                                                       //
RocketChat.models.Rooms.setLabelByRoomId = function (roomId, label) {                                                  // 152
	return this.update({ _id: roomId }, { $set: { label: label } });                                                      // 153
};                                                                                                                     // 154
                                                                                                                       //
RocketChat.models.Rooms.findOpenByAgent = function (userId) {                                                          // 156
	var query = {                                                                                                         // 157
		open: true,                                                                                                          // 158
		'servedBy._id': userId                                                                                               // 159
	};                                                                                                                    // 157
                                                                                                                       //
	return this.find(query);                                                                                              // 162
};                                                                                                                     // 163
                                                                                                                       //
RocketChat.models.Rooms.changeAgentByRoomId = function (roomId, newUsernames, newAgent) {                              // 165
	var query = {                                                                                                         // 166
		_id: roomId                                                                                                          // 167
	};                                                                                                                    // 166
	var update = {                                                                                                        // 169
		$set: {                                                                                                              // 170
			usernames: newUsernames,                                                                                            // 171
			servedBy: {                                                                                                         // 172
				_id: newAgent.agentId,                                                                                             // 173
				username: newAgent.username                                                                                        // 174
			}                                                                                                                   // 172
		}                                                                                                                    // 170
	};                                                                                                                    // 169
                                                                                                                       //
	this.update(query, update);                                                                                           // 179
};                                                                                                                     // 180
                                                                                                                       //
RocketChat.models.Rooms.saveCRMDataByRoomId = function (roomId, crmData) {                                             // 182
	var query = {                                                                                                         // 183
		_id: roomId                                                                                                          // 184
	};                                                                                                                    // 183
	var update = {                                                                                                        // 186
		$set: {                                                                                                              // 187
			crmData: crmData                                                                                                    // 188
		}                                                                                                                    // 187
	};                                                                                                                    // 186
                                                                                                                       //
	return this.update(query, update);                                                                                    // 192
};                                                                                                                     // 193
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"LivechatExternalMessage.js":["babel-runtime/helpers/classCallCheck","babel-runtime/helpers/possibleConstructorReturn","babel-runtime/helpers/inherits",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/models/LivechatExternalMessage.js                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck;module.import('babel-runtime/helpers/classCallCheck',{"default":function(v){_classCallCheck=v}});var _possibleConstructorReturn;module.import('babel-runtime/helpers/possibleConstructorReturn',{"default":function(v){_possibleConstructorReturn=v}});var _inherits;module.import('babel-runtime/helpers/inherits',{"default":function(v){_inherits=v}});
                                                                                                                       //
                                                                                                                       //
                                                                                                                       //
var LivechatExternalMessage = function (_RocketChat$models$_B) {                                                       //
	_inherits(LivechatExternalMessage, _RocketChat$models$_B);                                                            //
                                                                                                                       //
	function LivechatExternalMessage() {                                                                                  // 2
		_classCallCheck(this, LivechatExternalMessage);                                                                      // 2
                                                                                                                       //
		return _possibleConstructorReturn(this, _RocketChat$models$_B.call(this, 'livechat_external_message'));              // 2
	}                                                                                                                     // 4
                                                                                                                       //
	// FIND                                                                                                               // 6
                                                                                                                       //
                                                                                                                       //
	LivechatExternalMessage.prototype.findByRoomId = function () {                                                        //
		function findByRoomId(roomId) {                                                                                      //
			var sort = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { ts: -1 };                          // 7
                                                                                                                       //
			var query = { rid: roomId };                                                                                        // 8
                                                                                                                       //
			return this.find(query, { sort: sort });                                                                            // 10
		}                                                                                                                    // 11
                                                                                                                       //
		return findByRoomId;                                                                                                 //
	}();                                                                                                                  //
                                                                                                                       //
	return LivechatExternalMessage;                                                                                       //
}(RocketChat.models._Base);                                                                                            //
                                                                                                                       //
RocketChat.models.LivechatExternalMessage = new LivechatExternalMessage();                                             // 14
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"LivechatCustomField.js":["babel-runtime/helpers/classCallCheck","babel-runtime/helpers/possibleConstructorReturn","babel-runtime/helpers/inherits",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/models/LivechatCustomField.js                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck;module.import('babel-runtime/helpers/classCallCheck',{"default":function(v){_classCallCheck=v}});var _possibleConstructorReturn;module.import('babel-runtime/helpers/possibleConstructorReturn',{"default":function(v){_possibleConstructorReturn=v}});var _inherits;module.import('babel-runtime/helpers/inherits',{"default":function(v){_inherits=v}});
                                                                                                                       //
                                                                                                                       //
                                                                                                                       //
/**                                                                                                                    // 1
 * Livechat Custom Fields model                                                                                        //
 */                                                                                                                    //
var LivechatCustomField = function (_RocketChat$models$_B) {                                                           //
	_inherits(LivechatCustomField, _RocketChat$models$_B);                                                                //
                                                                                                                       //
	function LivechatCustomField() {                                                                                      // 5
		_classCallCheck(this, LivechatCustomField);                                                                          // 5
                                                                                                                       //
		return _possibleConstructorReturn(this, _RocketChat$models$_B.call(this, 'livechat_custom_field'));                  // 5
	}                                                                                                                     // 7
                                                                                                                       //
	// FIND                                                                                                               // 9
                                                                                                                       //
                                                                                                                       //
	LivechatCustomField.prototype.findOneById = function () {                                                             //
		function findOneById(_id, options) {                                                                                 //
			var query = { _id: _id };                                                                                           // 11
                                                                                                                       //
			return this.findOne(query, options);                                                                                // 13
		}                                                                                                                    // 14
                                                                                                                       //
		return findOneById;                                                                                                  //
	}();                                                                                                                  //
                                                                                                                       //
	LivechatCustomField.prototype.createOrUpdateCustomField = function () {                                               //
		function createOrUpdateCustomField(_id, field, label, scope, visibility, extraData) {                                //
			var record = {                                                                                                      // 17
				label: label,                                                                                                      // 18
				scope: scope,                                                                                                      // 19
				visibility: visibility                                                                                             // 20
			};                                                                                                                  // 17
                                                                                                                       //
			_.extend(record, extraData);                                                                                        // 23
                                                                                                                       //
			if (_id) {                                                                                                          // 25
				this.update({ _id: _id }, { $set: record });                                                                       // 26
			} else {                                                                                                            // 27
				record._id = field;                                                                                                // 28
				_id = this.insert(record);                                                                                         // 29
			}                                                                                                                   // 30
                                                                                                                       //
			return record;                                                                                                      // 32
		}                                                                                                                    // 33
                                                                                                                       //
		return createOrUpdateCustomField;                                                                                    //
	}();                                                                                                                  //
                                                                                                                       //
	// REMOVE                                                                                                             // 35
                                                                                                                       //
                                                                                                                       //
	LivechatCustomField.prototype.removeById = function () {                                                              //
		function removeById(_id) {                                                                                           //
			var query = { _id: _id };                                                                                           // 37
                                                                                                                       //
			return this.remove(query);                                                                                          // 39
		}                                                                                                                    // 40
                                                                                                                       //
		return removeById;                                                                                                   //
	}();                                                                                                                  //
                                                                                                                       //
	return LivechatCustomField;                                                                                           //
}(RocketChat.models._Base);                                                                                            //
                                                                                                                       //
RocketChat.models.LivechatCustomField = new LivechatCustomField();                                                     // 43
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"LivechatDepartment.js":["babel-runtime/helpers/classCallCheck","babel-runtime/helpers/possibleConstructorReturn","babel-runtime/helpers/inherits",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/models/LivechatDepartment.js                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck;module.import('babel-runtime/helpers/classCallCheck',{"default":function(v){_classCallCheck=v}});var _possibleConstructorReturn;module.import('babel-runtime/helpers/possibleConstructorReturn',{"default":function(v){_possibleConstructorReturn=v}});var _inherits;module.import('babel-runtime/helpers/inherits',{"default":function(v){_inherits=v}});
                                                                                                                       //
                                                                                                                       //
                                                                                                                       //
/**                                                                                                                    // 1
 * Livechat Department model                                                                                           //
 */                                                                                                                    //
var LivechatDepartment = function (_RocketChat$models$_B) {                                                            //
	_inherits(LivechatDepartment, _RocketChat$models$_B);                                                                 //
                                                                                                                       //
	function LivechatDepartment() {                                                                                       // 5
		_classCallCheck(this, LivechatDepartment);                                                                           // 5
                                                                                                                       //
		return _possibleConstructorReturn(this, _RocketChat$models$_B.call(this, 'livechat_department'));                    // 5
	}                                                                                                                     // 7
                                                                                                                       //
	// FIND                                                                                                               // 9
                                                                                                                       //
                                                                                                                       //
	LivechatDepartment.prototype.findOneById = function () {                                                              //
		function findOneById(_id, options) {                                                                                 //
			var query = { _id: _id };                                                                                           // 11
                                                                                                                       //
			return this.findOne(query, options);                                                                                // 13
		}                                                                                                                    // 14
                                                                                                                       //
		return findOneById;                                                                                                  //
	}();                                                                                                                  //
                                                                                                                       //
	LivechatDepartment.prototype.findByDepartmentId = function () {                                                       //
		function findByDepartmentId(_id, options) {                                                                          //
			var query = { _id: _id };                                                                                           // 17
                                                                                                                       //
			return this.find(query, options);                                                                                   // 19
		}                                                                                                                    // 20
                                                                                                                       //
		return findByDepartmentId;                                                                                           //
	}();                                                                                                                  //
                                                                                                                       //
	LivechatDepartment.prototype.createOrUpdateDepartment = function () {                                                 //
		function createOrUpdateDepartment(_id, enabled, name, description, agents, extraData) {                              //
			agents = [].concat(agents);                                                                                         // 23
                                                                                                                       //
			var record = {                                                                                                      // 25
				enabled: enabled,                                                                                                  // 26
				name: name,                                                                                                        // 27
				description: description,                                                                                          // 28
				numAgents: agents.length                                                                                           // 29
			};                                                                                                                  // 25
                                                                                                                       //
			_.extend(record, extraData);                                                                                        // 32
                                                                                                                       //
			if (_id) {                                                                                                          // 34
				this.update({ _id: _id }, { $set: record });                                                                       // 35
			} else {                                                                                                            // 36
				_id = this.insert(record);                                                                                         // 37
			}                                                                                                                   // 38
                                                                                                                       //
			var savedAgents = _.pluck(RocketChat.models.LivechatDepartmentAgents.findByDepartmentId(_id).fetch(), 'agentId');   // 40
			var agentsToSave = _.pluck(agents, 'agentId');                                                                      // 41
                                                                                                                       //
			// remove other agents                                                                                              // 43
			_.difference(savedAgents, agentsToSave).forEach(function (agentId) {                                                // 44
				RocketChat.models.LivechatDepartmentAgents.removeByDepartmentIdAndAgentId(_id, agentId);                           // 45
			});                                                                                                                 // 46
                                                                                                                       //
			agents.forEach(function (agent) {                                                                                   // 48
				RocketChat.models.LivechatDepartmentAgents.saveAgent({                                                             // 49
					agentId: agent.agentId,                                                                                           // 50
					departmentId: _id,                                                                                                // 51
					username: agent.username,                                                                                         // 52
					count: agent.count ? parseInt(agent.count) : 0,                                                                   // 53
					order: agent.order ? parseInt(agent.order) : 0                                                                    // 54
				});                                                                                                                // 49
			});                                                                                                                 // 56
                                                                                                                       //
			return _.extend(record, { _id: _id });                                                                              // 58
		}                                                                                                                    // 59
                                                                                                                       //
		return createOrUpdateDepartment;                                                                                     //
	}();                                                                                                                  //
                                                                                                                       //
	// REMOVE                                                                                                             // 61
                                                                                                                       //
                                                                                                                       //
	LivechatDepartment.prototype.removeById = function () {                                                               //
		function removeById(_id) {                                                                                           //
			var query = { _id: _id };                                                                                           // 63
                                                                                                                       //
			return this.remove(query);                                                                                          // 65
		}                                                                                                                    // 66
                                                                                                                       //
		return removeById;                                                                                                   //
	}();                                                                                                                  //
                                                                                                                       //
	LivechatDepartment.prototype.findEnabledWithAgents = function () {                                                    //
		function findEnabledWithAgents() {                                                                                   //
			var query = {                                                                                                       // 69
				numAgents: { $gt: 0 },                                                                                             // 70
				enabled: true                                                                                                      // 71
			};                                                                                                                  // 69
			return this.find(query);                                                                                            // 73
		}                                                                                                                    // 74
                                                                                                                       //
		return findEnabledWithAgents;                                                                                        //
	}();                                                                                                                  //
                                                                                                                       //
	return LivechatDepartment;                                                                                            //
}(RocketChat.models._Base);                                                                                            //
                                                                                                                       //
RocketChat.models.LivechatDepartment = new LivechatDepartment();                                                       // 77
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"LivechatDepartmentAgents.js":["babel-runtime/helpers/classCallCheck","babel-runtime/helpers/possibleConstructorReturn","babel-runtime/helpers/inherits",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/models/LivechatDepartmentAgents.js                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck;module.import('babel-runtime/helpers/classCallCheck',{"default":function(v){_classCallCheck=v}});var _possibleConstructorReturn;module.import('babel-runtime/helpers/possibleConstructorReturn',{"default":function(v){_possibleConstructorReturn=v}});var _inherits;module.import('babel-runtime/helpers/inherits',{"default":function(v){_inherits=v}});
                                                                                                                       //
                                                                                                                       //
                                                                                                                       //
/**                                                                                                                    // 1
 * Livechat Department model                                                                                           //
 */                                                                                                                    //
var LivechatDepartmentAgents = function (_RocketChat$models$_B) {                                                      //
	_inherits(LivechatDepartmentAgents, _RocketChat$models$_B);                                                           //
                                                                                                                       //
	function LivechatDepartmentAgents() {                                                                                 // 5
		_classCallCheck(this, LivechatDepartmentAgents);                                                                     // 5
                                                                                                                       //
		return _possibleConstructorReturn(this, _RocketChat$models$_B.call(this, 'livechat_department_agents'));             // 5
	}                                                                                                                     // 7
                                                                                                                       //
	LivechatDepartmentAgents.prototype.findByDepartmentId = function () {                                                 //
		function findByDepartmentId(departmentId) {                                                                          //
			return this.find({ departmentId: departmentId });                                                                   // 10
		}                                                                                                                    // 11
                                                                                                                       //
		return findByDepartmentId;                                                                                           //
	}();                                                                                                                  //
                                                                                                                       //
	LivechatDepartmentAgents.prototype.saveAgent = function () {                                                          //
		function saveAgent(agent) {                                                                                          //
			return this.upsert({                                                                                                // 14
				agentId: agent.agentId,                                                                                            // 15
				departmentId: agent.departmentId                                                                                   // 16
			}, {                                                                                                                // 14
				$set: {                                                                                                            // 18
					username: agent.username,                                                                                         // 19
					count: parseInt(agent.count),                                                                                     // 20
					order: parseInt(agent.order)                                                                                      // 21
				}                                                                                                                  // 18
			});                                                                                                                 // 17
		}                                                                                                                    // 24
                                                                                                                       //
		return saveAgent;                                                                                                    //
	}();                                                                                                                  //
                                                                                                                       //
	LivechatDepartmentAgents.prototype.removeByDepartmentIdAndAgentId = function () {                                     //
		function removeByDepartmentIdAndAgentId(departmentId, agentId) {                                                     //
			this.remove({ departmentId: departmentId, agentId: agentId });                                                      // 27
		}                                                                                                                    // 28
                                                                                                                       //
		return removeByDepartmentIdAndAgentId;                                                                               //
	}();                                                                                                                  //
                                                                                                                       //
	LivechatDepartmentAgents.prototype.getNextAgentForDepartment = function () {                                          //
		function getNextAgentForDepartment(departmentId) {                                                                   //
			var agents = this.findByDepartmentId(departmentId).fetch();                                                         // 31
                                                                                                                       //
			if (agents.length === 0) {                                                                                          // 33
				return;                                                                                                            // 34
			}                                                                                                                   // 35
                                                                                                                       //
			var onlineUsers = RocketChat.models.Users.findOnlineUserFromList(_.pluck(agents, 'username'));                      // 37
                                                                                                                       //
			var onlineUsernames = _.pluck(onlineUsers.fetch(), 'username');                                                     // 39
                                                                                                                       //
			var query = {                                                                                                       // 41
				departmentId: departmentId,                                                                                        // 42
				username: {                                                                                                        // 43
					$in: onlineUsernames                                                                                              // 44
				}                                                                                                                  // 43
			};                                                                                                                  // 41
                                                                                                                       //
			var sort = {                                                                                                        // 48
				count: 1,                                                                                                          // 49
				order: 1,                                                                                                          // 50
				username: 1                                                                                                        // 51
			};                                                                                                                  // 48
			var update = {                                                                                                      // 53
				$inc: {                                                                                                            // 54
					count: 1                                                                                                          // 55
				}                                                                                                                  // 54
			};                                                                                                                  // 53
                                                                                                                       //
			var collectionObj = this.model.rawCollection();                                                                     // 59
			var findAndModify = Meteor.wrapAsync(collectionObj.findAndModify, collectionObj);                                   // 60
                                                                                                                       //
			var agent = findAndModify(query, sort, update);                                                                     // 62
			if (agent && agent.value) {                                                                                         // 63
				return {                                                                                                           // 64
					agentId: agent.value.agentId,                                                                                     // 65
					username: agent.value.username                                                                                    // 66
				};                                                                                                                 // 64
			} else {                                                                                                            // 68
				return null;                                                                                                       // 69
			}                                                                                                                   // 70
		}                                                                                                                    // 71
                                                                                                                       //
		return getNextAgentForDepartment;                                                                                    //
	}();                                                                                                                  //
                                                                                                                       //
	LivechatDepartmentAgents.prototype.getOnlineForDepartment = function () {                                             //
		function getOnlineForDepartment(departmentId) {                                                                      //
			var agents = this.findByDepartmentId(departmentId).fetch();                                                         // 74
                                                                                                                       //
			if (agents.length === 0) {                                                                                          // 76
				return;                                                                                                            // 77
			}                                                                                                                   // 78
                                                                                                                       //
			var onlineUsers = RocketChat.models.Users.findOnlineUserFromList(_.pluck(agents, 'username'));                      // 80
                                                                                                                       //
			var onlineUsernames = _.pluck(onlineUsers.fetch(), 'username');                                                     // 82
                                                                                                                       //
			var query = {                                                                                                       // 84
				departmentId: departmentId,                                                                                        // 85
				username: {                                                                                                        // 86
					$in: onlineUsernames                                                                                              // 87
				}                                                                                                                  // 86
			};                                                                                                                  // 84
                                                                                                                       //
			var depAgents = this.find(query);                                                                                   // 91
                                                                                                                       //
			if (depAgents) {                                                                                                    // 93
				return depAgents;                                                                                                  // 94
			} else {                                                                                                            // 95
				return null;                                                                                                       // 96
			}                                                                                                                   // 97
		}                                                                                                                    // 98
                                                                                                                       //
		return getOnlineForDepartment;                                                                                       //
	}();                                                                                                                  //
                                                                                                                       //
	LivechatDepartmentAgents.prototype.findUsersInQueue = function () {                                                   //
		function findUsersInQueue(usersList) {                                                                               //
			var query = {};                                                                                                     // 101
                                                                                                                       //
			if (!_.isEmpty(usersList)) {                                                                                        // 103
				query.username = {                                                                                                 // 104
					$in: usersList                                                                                                    // 105
				};                                                                                                                 // 104
			}                                                                                                                   // 107
                                                                                                                       //
			var options = {                                                                                                     // 109
				sort: {                                                                                                            // 110
					departmentId: 1,                                                                                                  // 111
					count: 1,                                                                                                         // 112
					order: 1,                                                                                                         // 113
					username: 1                                                                                                       // 114
				}                                                                                                                  // 110
			};                                                                                                                  // 109
                                                                                                                       //
			return this.find(query, options);                                                                                   // 118
		}                                                                                                                    // 119
                                                                                                                       //
		return findUsersInQueue;                                                                                             //
	}();                                                                                                                  //
                                                                                                                       //
	return LivechatDepartmentAgents;                                                                                      //
}(RocketChat.models._Base);                                                                                            //
                                                                                                                       //
RocketChat.models.LivechatDepartmentAgents = new LivechatDepartmentAgents();                                           // 122
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"LivechatPageVisited.js":["babel-runtime/helpers/classCallCheck","babel-runtime/helpers/possibleConstructorReturn","babel-runtime/helpers/inherits",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/models/LivechatPageVisited.js                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck;module.import('babel-runtime/helpers/classCallCheck',{"default":function(v){_classCallCheck=v}});var _possibleConstructorReturn;module.import('babel-runtime/helpers/possibleConstructorReturn',{"default":function(v){_possibleConstructorReturn=v}});var _inherits;module.import('babel-runtime/helpers/inherits',{"default":function(v){_inherits=v}});
                                                                                                                       //
                                                                                                                       //
                                                                                                                       //
/**                                                                                                                    // 1
 * Livechat Page Visited model                                                                                         //
 */                                                                                                                    //
var LivechatPageVisited = function (_RocketChat$models$_B) {                                                           //
	_inherits(LivechatPageVisited, _RocketChat$models$_B);                                                                //
                                                                                                                       //
	function LivechatPageVisited() {                                                                                      // 5
		_classCallCheck(this, LivechatPageVisited);                                                                          // 5
                                                                                                                       //
		var _this = _possibleConstructorReturn(this, _RocketChat$models$_B.call(this, 'livechat_page_visited'));             // 5
                                                                                                                       //
		_this.tryEnsureIndex({ 'token': 1 });                                                                                // 8
		_this.tryEnsureIndex({ 'ts': 1 });                                                                                   // 9
                                                                                                                       //
		// keep history for 1 month if the visitor does not register                                                         // 11
		_this.tryEnsureIndex({ 'expireAt': 1 }, { sparse: 1, expireAfterSeconds: 0 });                                       // 12
		return _this;                                                                                                        // 5
	}                                                                                                                     // 13
                                                                                                                       //
	LivechatPageVisited.prototype.saveByToken = function () {                                                             //
		function saveByToken(token, pageInfo) {                                                                              //
			// keep history of unregistered visitors for 1 month                                                                // 16
			var keepHistoryMiliseconds = 2592000000;                                                                            // 17
                                                                                                                       //
			return this.insert({                                                                                                // 19
				token: token,                                                                                                      // 20
				page: pageInfo,                                                                                                    // 21
				ts: new Date(),                                                                                                    // 22
				expireAt: new Date().getTime() + keepHistoryMiliseconds                                                            // 23
			});                                                                                                                 // 19
		}                                                                                                                    // 25
                                                                                                                       //
		return saveByToken;                                                                                                  //
	}();                                                                                                                  //
                                                                                                                       //
	LivechatPageVisited.prototype.findByToken = function () {                                                             //
		function findByToken(token) {                                                                                        //
			return this.find({ token: token }, { sort: { ts: -1 }, limit: 20 });                                                // 28
		}                                                                                                                    // 29
                                                                                                                       //
		return findByToken;                                                                                                  //
	}();                                                                                                                  //
                                                                                                                       //
	LivechatPageVisited.prototype.keepHistoryForToken = function () {                                                     //
		function keepHistoryForToken(token) {                                                                                //
			return this.update({                                                                                                // 32
				token: token,                                                                                                      // 33
				expireAt: {                                                                                                        // 34
					$exists: true                                                                                                     // 35
				}                                                                                                                  // 34
			}, {                                                                                                                // 32
				$unset: {                                                                                                          // 38
					expireAt: 1                                                                                                       // 39
				}                                                                                                                  // 38
			}, {                                                                                                                // 37
				multi: true                                                                                                        // 42
			});                                                                                                                 // 41
		}                                                                                                                    // 44
                                                                                                                       //
		return keepHistoryForToken;                                                                                          //
	}();                                                                                                                  //
                                                                                                                       //
	return LivechatPageVisited;                                                                                           //
}(RocketChat.models._Base);                                                                                            //
                                                                                                                       //
RocketChat.models.LivechatPageVisited = new LivechatPageVisited();                                                     // 47
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"LivechatTrigger.js":["babel-runtime/helpers/classCallCheck","babel-runtime/helpers/possibleConstructorReturn","babel-runtime/helpers/inherits",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/models/LivechatTrigger.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck;module.import('babel-runtime/helpers/classCallCheck',{"default":function(v){_classCallCheck=v}});var _possibleConstructorReturn;module.import('babel-runtime/helpers/possibleConstructorReturn',{"default":function(v){_possibleConstructorReturn=v}});var _inherits;module.import('babel-runtime/helpers/inherits',{"default":function(v){_inherits=v}});
                                                                                                                       //
                                                                                                                       //
                                                                                                                       //
/**                                                                                                                    // 1
 * Livechat Trigger model                                                                                              //
 */                                                                                                                    //
var LivechatTrigger = function (_RocketChat$models$_B) {                                                               //
	_inherits(LivechatTrigger, _RocketChat$models$_B);                                                                    //
                                                                                                                       //
	function LivechatTrigger() {                                                                                          // 5
		_classCallCheck(this, LivechatTrigger);                                                                              // 5
                                                                                                                       //
		return _possibleConstructorReturn(this, _RocketChat$models$_B.call(this, 'livechat_trigger'));                       // 5
	}                                                                                                                     // 7
                                                                                                                       //
	// FIND                                                                                                               // 9
                                                                                                                       //
                                                                                                                       //
	LivechatTrigger.prototype.save = function () {                                                                        //
		function save(data) {                                                                                                //
			var trigger = this.findOne();                                                                                       // 11
                                                                                                                       //
			if (trigger) {                                                                                                      // 13
				return this.update({ _id: trigger._id }, { $set: data });                                                          // 14
			} else {                                                                                                            // 15
				return this.insert(data);                                                                                          // 16
			}                                                                                                                   // 17
		}                                                                                                                    // 18
                                                                                                                       //
		return save;                                                                                                         //
	}();                                                                                                                  //
                                                                                                                       //
	LivechatTrigger.prototype.removeAll = function () {                                                                   //
		function removeAll() {                                                                                               //
			this.remove({});                                                                                                    // 21
		}                                                                                                                    // 22
                                                                                                                       //
		return removeAll;                                                                                                    //
	}();                                                                                                                  //
                                                                                                                       //
	return LivechatTrigger;                                                                                               //
}(RocketChat.models._Base);                                                                                            //
                                                                                                                       //
RocketChat.models.LivechatTrigger = new LivechatTrigger();                                                             // 25
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"indexes.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/models/indexes.js                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.startup(function () {                                                                                           // 1
	RocketChat.models.Rooms.tryEnsureIndex({ code: 1 });                                                                  // 2
	RocketChat.models.Rooms.tryEnsureIndex({ open: 1 }, { sparse: 1 });                                                   // 3
});                                                                                                                    // 4
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"LivechatInquiry.js":["babel-runtime/helpers/classCallCheck","babel-runtime/helpers/possibleConstructorReturn","babel-runtime/helpers/inherits",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/models/LivechatInquiry.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck;module.import('babel-runtime/helpers/classCallCheck',{"default":function(v){_classCallCheck=v}});var _possibleConstructorReturn;module.import('babel-runtime/helpers/possibleConstructorReturn',{"default":function(v){_possibleConstructorReturn=v}});var _inherits;module.import('babel-runtime/helpers/inherits',{"default":function(v){_inherits=v}});
                                                                                                                       //
                                                                                                                       //
                                                                                                                       //
var LivechatInquiry = function (_RocketChat$models$_B) {                                                               //
	_inherits(LivechatInquiry, _RocketChat$models$_B);                                                                    //
                                                                                                                       //
	function LivechatInquiry() {                                                                                          // 2
		_classCallCheck(this, LivechatInquiry);                                                                              // 2
                                                                                                                       //
		var _this = _possibleConstructorReturn(this, _RocketChat$models$_B.call(this, 'livechat_inquiry'));                  // 2
                                                                                                                       //
		_this.tryEnsureIndex({ 'rid': 1 }); // room id corresponding to this inquiry                                         // 5
		_this.tryEnsureIndex({ 'name': 1 }); // name of the inquiry (client name for now)                                    // 6
		_this.tryEnsureIndex({ 'message': 1 }); // message sent by the client                                                // 7
		_this.tryEnsureIndex({ 'ts': 1 }); // timestamp                                                                      // 8
		_this.tryEnsureIndex({ 'code': 1 }); // (for routing)                                                                // 9
		_this.tryEnsureIndex({ 'agents': 1 }); // Id's of the agents who can see the inquiry (handle departments)            // 10
		_this.tryEnsureIndex({ 'status': 1 }); // 'open', 'taken'                                                            // 11
		return _this;                                                                                                        // 2
	}                                                                                                                     // 12
                                                                                                                       //
	LivechatInquiry.prototype.findOneById = function () {                                                                 //
		function findOneById(inquiryId) {                                                                                    //
			return this.findOne({ _id: inquiryId });                                                                            // 15
		}                                                                                                                    // 16
                                                                                                                       //
		return findOneById;                                                                                                  //
	}();                                                                                                                  //
                                                                                                                       //
	/*                                                                                                                    // 18
  * mark the inquiry as taken                                                                                          //
  */                                                                                                                   //
                                                                                                                       //
                                                                                                                       //
	LivechatInquiry.prototype.takeInquiry = function () {                                                                 //
		function takeInquiry(inquiryId) {                                                                                    //
			this.update({                                                                                                       // 22
				'_id': inquiryId                                                                                                   // 23
			}, {                                                                                                                // 22
				$set: { status: 'taken' }                                                                                          // 25
			});                                                                                                                 // 24
		}                                                                                                                    // 27
                                                                                                                       //
		return takeInquiry;                                                                                                  //
	}();                                                                                                                  //
                                                                                                                       //
	/*                                                                                                                    // 29
  * mark inquiry as open                                                                                               //
  */                                                                                                                   //
                                                                                                                       //
                                                                                                                       //
	LivechatInquiry.prototype.openInquiry = function () {                                                                 //
		function openInquiry(inquiryId) {                                                                                    //
			this.update({                                                                                                       // 33
				'_id': inquiryId                                                                                                   // 34
			}, {                                                                                                                // 33
				$set: { status: 'open' }                                                                                           // 36
			});                                                                                                                 // 35
		}                                                                                                                    // 38
                                                                                                                       //
		return openInquiry;                                                                                                  //
	}();                                                                                                                  //
                                                                                                                       //
	/*                                                                                                                    // 40
  * return the status of the inquiry (open or taken)                                                                   //
  */                                                                                                                   //
                                                                                                                       //
                                                                                                                       //
	LivechatInquiry.prototype.getStatus = function () {                                                                   //
		function getStatus(inquiryId) {                                                                                      //
			return this.findOne({ '_id': inquiryId }).status;                                                                   // 44
		}                                                                                                                    // 45
                                                                                                                       //
		return getStatus;                                                                                                    //
	}();                                                                                                                  //
                                                                                                                       //
	return LivechatInquiry;                                                                                               //
}(RocketChat.models._Base);                                                                                            //
                                                                                                                       //
RocketChat.models.LivechatInquiry = new LivechatInquiry();                                                             // 48
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"LivechatOfficeHour.js":["babel-runtime/helpers/classCallCheck","babel-runtime/helpers/possibleConstructorReturn","babel-runtime/helpers/inherits",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/models/LivechatOfficeHour.js                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck;module.import('babel-runtime/helpers/classCallCheck',{"default":function(v){_classCallCheck=v}});var _possibleConstructorReturn;module.import('babel-runtime/helpers/possibleConstructorReturn',{"default":function(v){_possibleConstructorReturn=v}});var _inherits;module.import('babel-runtime/helpers/inherits',{"default":function(v){_inherits=v}});
                                                                                                                       //
                                                                                                                       //
                                                                                                                       //
var LivechatOfficeHour = function (_RocketChat$models$_B) {                                                            //
	_inherits(LivechatOfficeHour, _RocketChat$models$_B);                                                                 //
                                                                                                                       //
	function LivechatOfficeHour() {                                                                                       // 2
		_classCallCheck(this, LivechatOfficeHour);                                                                           // 2
                                                                                                                       //
		var _this = _possibleConstructorReturn(this, _RocketChat$models$_B.call(this, 'livechat_office_hour'));              // 2
                                                                                                                       //
		_this.tryEnsureIndex({ 'day': 1 }); // the day of the week monday - sunday                                           // 5
		_this.tryEnsureIndex({ 'start': 1 }); // the opening hours of the office                                             // 6
		_this.tryEnsureIndex({ 'finish': 1 }); // the closing hours of the office                                            // 7
		_this.tryEnsureIndex({ 'open': 1 }); // whether or not the offices are open on this day                              // 8
                                                                                                                       //
		// if there is nothing in the collection, add defaults                                                               // 10
		if (_this.find().count() === 0) {                                                                                    // 11
			_this.insert({ 'day': 'Monday', 'start': '08:00', 'finish': '20:00', 'code': 1, 'open': true });                    // 12
			_this.insert({ 'day': 'Tuesday', 'start': '08:00', 'finish': '20:00', 'code': 2, 'open': true });                   // 13
			_this.insert({ 'day': 'Wednesday', 'start': '08:00', 'finish': '20:00', 'code': 3, 'open': true });                 // 14
			_this.insert({ 'day': 'Thursday', 'start': '08:00', 'finish': '20:00', 'code': 4, 'open': true });                  // 15
			_this.insert({ 'day': 'Friday', 'start': '08:00', 'finish': '20:00', 'code': 5, 'open': true });                    // 16
			_this.insert({ 'day': 'Saturday', 'start': '08:00', 'finish': '20:00', 'code': 6, 'open': false });                 // 17
			_this.insert({ 'day': 'Sunday', 'start': '08:00', 'finish': '20:00', 'code': 0, 'open': false });                   // 18
		}                                                                                                                    // 20
		return _this;                                                                                                        // 2
	}                                                                                                                     // 21
                                                                                                                       //
	/*                                                                                                                    // 23
  * update the given days start and finish times and whether the office is open on that day                            //
  */                                                                                                                   //
                                                                                                                       //
                                                                                                                       //
	LivechatOfficeHour.prototype.updateHours = function () {                                                              //
		function updateHours(day, newStart, newFinish, newOpen) {                                                            //
			this.update({                                                                                                       // 27
				'day': day                                                                                                         // 28
			}, {                                                                                                                // 27
				$set: {                                                                                                            // 30
					start: newStart,                                                                                                  // 31
					finish: newFinish,                                                                                                // 32
					open: newOpen                                                                                                     // 33
				}                                                                                                                  // 30
			});                                                                                                                 // 29
		}                                                                                                                    // 36
                                                                                                                       //
		return updateHours;                                                                                                  //
	}();                                                                                                                  //
                                                                                                                       //
	/*                                                                                                                    // 38
  * Check if the current server time (utc) is within the office hours of that day                                      //
  * returns true or false                                                                                              //
  */                                                                                                                   //
                                                                                                                       //
                                                                                                                       //
	LivechatOfficeHour.prototype.isNowWithinHours = function () {                                                         //
		function isNowWithinHours() {                                                                                        //
			// get current time on server in utc                                                                                // 43
			// var ct = moment().utc();                                                                                         // 44
			var currentTime = moment.utc(moment().utc().format('dddd:HH:mm'), 'dddd:HH:mm');                                    // 45
                                                                                                                       //
			// get todays office hours from db                                                                                  // 47
			var todaysOfficeHours = this.findOne({ day: currentTime.format('dddd') });                                          // 48
			if (!todaysOfficeHours) {                                                                                           // 49
				return false;                                                                                                      // 50
			}                                                                                                                   // 51
                                                                                                                       //
			// check if offices are open today                                                                                  // 53
			if (todaysOfficeHours.open === false) {                                                                             // 54
				return false;                                                                                                      // 55
			}                                                                                                                   // 56
                                                                                                                       //
			var start = moment.utc(todaysOfficeHours.day + ':' + todaysOfficeHours.start, 'dddd:HH:mm');                        // 58
			var finish = moment.utc(todaysOfficeHours.day + ':' + todaysOfficeHours.finish, 'dddd:HH:mm');                      // 59
                                                                                                                       //
			// console.log(finish.isBefore(start));                                                                             // 61
			if (finish.isBefore(start)) {                                                                                       // 62
				// finish.day(finish.day()+1);                                                                                     // 63
				finish.add(1, 'days');                                                                                             // 64
			}                                                                                                                   // 65
                                                                                                                       //
			var result = currentTime.isBetween(start, finish);                                                                  // 67
                                                                                                                       //
			// inBetween  check                                                                                                 // 69
			return result;                                                                                                      // 70
		}                                                                                                                    // 71
                                                                                                                       //
		return isNowWithinHours;                                                                                             //
	}();                                                                                                                  //
                                                                                                                       //
	LivechatOfficeHour.prototype.isOpeningTime = function () {                                                            //
		function isOpeningTime() {                                                                                           //
			// get current time on server in utc                                                                                // 74
			var currentTime = moment.utc(moment().utc().format('dddd:HH:mm'), 'dddd:HH:mm');                                    // 75
                                                                                                                       //
			// get todays office hours from db                                                                                  // 77
			var todaysOfficeHours = this.findOne({ day: currentTime.format('dddd') });                                          // 78
			if (!todaysOfficeHours) {                                                                                           // 79
				return false;                                                                                                      // 80
			}                                                                                                                   // 81
                                                                                                                       //
			// check if offices are open today                                                                                  // 83
			if (todaysOfficeHours.open === false) {                                                                             // 84
				return false;                                                                                                      // 85
			}                                                                                                                   // 86
                                                                                                                       //
			var start = moment.utc(todaysOfficeHours.day + ':' + todaysOfficeHours.start, 'dddd:HH:mm');                        // 88
                                                                                                                       //
			return start.isSame(currentTime, 'minute');                                                                         // 90
		}                                                                                                                    // 91
                                                                                                                       //
		return isOpeningTime;                                                                                                //
	}();                                                                                                                  //
                                                                                                                       //
	LivechatOfficeHour.prototype.isClosingTime = function () {                                                            //
		function isClosingTime() {                                                                                           //
			// get current time on server in utc                                                                                // 94
			var currentTime = moment.utc(moment().utc().format('dddd:HH:mm'), 'dddd:HH:mm');                                    // 95
                                                                                                                       //
			// get todays office hours from db                                                                                  // 97
			var todaysOfficeHours = this.findOne({ day: currentTime.format('dddd') });                                          // 98
			if (!todaysOfficeHours) {                                                                                           // 99
				return false;                                                                                                      // 100
			}                                                                                                                   // 101
                                                                                                                       //
			var finish = moment.utc(todaysOfficeHours.day + ':' + todaysOfficeHours.finish, 'dddd:HH:mm');                      // 103
                                                                                                                       //
			return finish.isSame(currentTime, 'minute');                                                                        // 105
		}                                                                                                                    // 106
                                                                                                                       //
		return isClosingTime;                                                                                                //
	}();                                                                                                                  //
                                                                                                                       //
	return LivechatOfficeHour;                                                                                            //
}(RocketChat.models._Base);                                                                                            //
                                                                                                                       //
RocketChat.models.LivechatOfficeHour = new LivechatOfficeHour();                                                       // 109
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]},"lib":{"Livechat.js":["ua-parser-js",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/lib/Livechat.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var UAParser;module.import('ua-parser-js',{"default":function(v){UAParser=v}});/* globals HTTP */                      // 1
                                                                                                                       // 2
                                                                                                                       //
RocketChat.Livechat = {                                                                                                // 4
	historyMonitorType: 'url',                                                                                            // 5
                                                                                                                       //
	logger: new Logger('Livechat', {                                                                                      // 7
		sections: {                                                                                                          // 8
			webhook: 'Webhook'                                                                                                  // 9
		}                                                                                                                    // 8
	}),                                                                                                                   // 7
                                                                                                                       //
	getNextAgent: function () {                                                                                           // 13
		function getNextAgent(department) {                                                                                  // 4
			if (department) {                                                                                                   // 14
				return RocketChat.models.LivechatDepartmentAgents.getNextAgentForDepartment(department);                           // 15
			} else {                                                                                                            // 16
				return RocketChat.models.Users.getNextAgent();                                                                     // 17
			}                                                                                                                   // 18
		}                                                                                                                    // 19
                                                                                                                       //
		return getNextAgent;                                                                                                 // 4
	}(),                                                                                                                  // 4
	getAgents: function () {                                                                                              // 20
		function getAgents(department) {                                                                                     // 4
			if (department) {                                                                                                   // 21
				return RocketChat.models.LivechatDepartmentAgents.findByDepartmentId(department);                                  // 22
			} else {                                                                                                            // 23
				return RocketChat.models.Users.findAgents();                                                                       // 24
			}                                                                                                                   // 25
		}                                                                                                                    // 26
                                                                                                                       //
		return getAgents;                                                                                                    // 4
	}(),                                                                                                                  // 4
	getOnlineAgents: function () {                                                                                        // 27
		function getOnlineAgents(department) {                                                                               // 4
			if (department) {                                                                                                   // 28
				return RocketChat.models.LivechatDepartmentAgents.getOnlineForDepartment(department);                              // 29
			} else {                                                                                                            // 30
				return RocketChat.models.Users.findOnlineAgents();                                                                 // 31
			}                                                                                                                   // 32
		}                                                                                                                    // 33
                                                                                                                       //
		return getOnlineAgents;                                                                                              // 4
	}(),                                                                                                                  // 4
	getRoom: function () {                                                                                                // 34
		function getRoom(guest, message, roomInfo) {                                                                         // 4
			var room = RocketChat.models.Rooms.findOneById(message.rid);                                                        // 35
			var newRoom = false;                                                                                                // 36
                                                                                                                       //
			if (room && !room.open) {                                                                                           // 38
				message.rid = Random.id();                                                                                         // 39
				room = null;                                                                                                       // 40
			}                                                                                                                   // 41
                                                                                                                       //
			if (room == null) {                                                                                                 // 43
				// if no department selected verify if there is at least one active and choose one randomly                        // 44
				if (!guest.department) {                                                                                           // 45
					var departments = RocketChat.models.LivechatDepartment.findEnabledWithAgents();                                   // 46
					if (departments.count() > 0) {                                                                                    // 47
						guest.department = departments.fetch()[0]._id;                                                                   // 48
					}                                                                                                                 // 49
				}                                                                                                                  // 50
                                                                                                                       //
				// delegate room creation to QueueMethods                                                                          // 52
				var routingMethod = RocketChat.settings.get('Livechat_Routing_Method');                                            // 53
				room = RocketChat.QueueMethods[routingMethod](guest, message, roomInfo);                                           // 54
                                                                                                                       //
				newRoom = true;                                                                                                    // 56
			} else {                                                                                                            // 57
				room = Meteor.call('canAccessRoom', message.rid, guest._id);                                                       // 58
			}                                                                                                                   // 59
			if (!room) {                                                                                                        // 60
				throw new Meteor.Error('cannot-acess-room');                                                                       // 61
			}                                                                                                                   // 62
                                                                                                                       //
			return { room: room, newRoom: newRoom };                                                                            // 64
		}                                                                                                                    // 65
                                                                                                                       //
		return getRoom;                                                                                                      // 4
	}(),                                                                                                                  // 4
	sendMessage: function () {                                                                                            // 66
		function sendMessage(_ref) {                                                                                         // 4
			var guest = _ref.guest;                                                                                             // 66
			var message = _ref.message;                                                                                         // 66
			var roomInfo = _ref.roomInfo;                                                                                       // 66
                                                                                                                       //
			var _getRoom = this.getRoom(guest, message, roomInfo);                                                              // 66
                                                                                                                       //
			var room = _getRoom.room;                                                                                           // 66
			var newRoom = _getRoom.newRoom;                                                                                     // 66
                                                                                                                       //
			if (guest.name) {                                                                                                   // 68
				message.alias = guest.name;                                                                                        // 69
			}                                                                                                                   // 70
			return _.extend(RocketChat.sendMessage(guest, message, room), { newRoom: newRoom });                                // 71
		}                                                                                                                    // 72
                                                                                                                       //
		return sendMessage;                                                                                                  // 4
	}(),                                                                                                                  // 4
	registerGuest: function () {                                                                                          // 73
		function registerGuest() {                                                                                           // 4
			var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};                                 // 73
                                                                                                                       //
			var token = _ref2.token;                                                                                            // 73
			var name = _ref2.name;                                                                                              // 73
			var email = _ref2.email;                                                                                            // 73
			var department = _ref2.department;                                                                                  // 73
			var phone = _ref2.phone;                                                                                            // 73
			var loginToken = _ref2.loginToken;                                                                                  // 73
			var username = _ref2.username;                                                                                      // 73
                                                                                                                       //
			check(token, String);                                                                                               // 74
                                                                                                                       //
			var userId = void 0;                                                                                                // 76
			var updateUser = {                                                                                                  // 77
				$set: {                                                                                                            // 78
					profile: {                                                                                                        // 79
						guest: true,                                                                                                     // 80
						token: token                                                                                                     // 81
					}                                                                                                                 // 79
				}                                                                                                                  // 78
			};                                                                                                                  // 77
                                                                                                                       //
			var user = RocketChat.models.Users.getVisitorByToken(token, { fields: { _id: 1 } });                                // 86
                                                                                                                       //
			if (user) {                                                                                                         // 88
				userId = user._id;                                                                                                 // 89
				if (loginToken) {                                                                                                  // 90
					if (!updateUser.$addToSet) {                                                                                      // 91
						updateUser.$addToSet = {};                                                                                       // 92
					}                                                                                                                 // 93
					updateUser.$addToSet['services.resume.loginTokens'] = loginToken;                                                 // 94
				}                                                                                                                  // 95
			} else {                                                                                                            // 96
				if (!username) {                                                                                                   // 97
					username = RocketChat.models.Users.getNextVisitorUsername();                                                      // 98
				}                                                                                                                  // 99
                                                                                                                       //
				var existingUser = null;                                                                                           // 101
                                                                                                                       //
				if (s.trim(email) !== '' && (existingUser = RocketChat.models.Users.findOneByEmailAddress(email))) {               // 103
					if (existingUser.type !== 'visitor') {                                                                            // 104
						throw new Meteor.Error('error-invalid-user', 'This email belongs to a registered user.');                        // 105
					}                                                                                                                 // 106
                                                                                                                       //
					updateUser.$addToSet = {                                                                                          // 108
						globalRoles: 'livechat-guest'                                                                                    // 109
					};                                                                                                                // 108
                                                                                                                       //
					if (loginToken) {                                                                                                 // 112
						updateUser.$addToSet['services.resume.loginTokens'] = loginToken;                                                // 113
					}                                                                                                                 // 114
                                                                                                                       //
					userId = existingUser._id;                                                                                        // 116
				} else {                                                                                                           // 117
					updateUser.$set.name = name;                                                                                      // 118
                                                                                                                       //
					var userData = {                                                                                                  // 120
						username: username,                                                                                              // 121
						globalRoles: ['livechat-guest'],                                                                                 // 122
						department: department,                                                                                          // 123
						type: 'visitor'                                                                                                  // 124
					};                                                                                                                // 120
                                                                                                                       //
					if (this.connection) {                                                                                            // 127
						userData.userAgent = this.connection.httpHeaders['user-agent'];                                                  // 128
						userData.ip = this.connection.httpHeaders['x-real-ip'] || this.connection.clientAddress;                         // 129
						userData.host = this.connection.httpHeaders.host;                                                                // 130
					}                                                                                                                 // 131
                                                                                                                       //
					userId = Accounts.insertUserDoc({}, userData);                                                                    // 133
                                                                                                                       //
					if (loginToken) {                                                                                                 // 135
						updateUser.$set.services = {                                                                                     // 136
							resume: {                                                                                                       // 137
								loginTokens: [loginToken]                                                                                      // 138
							}                                                                                                               // 137
						};                                                                                                               // 136
					}                                                                                                                 // 141
				}                                                                                                                  // 142
			}                                                                                                                   // 143
                                                                                                                       //
			if (phone) {                                                                                                        // 145
				updateUser.$set.phone = [{ phoneNumber: phone.number }];                                                           // 146
			}                                                                                                                   // 149
                                                                                                                       //
			if (email && email.trim() !== '') {                                                                                 // 151
				updateUser.$set.emails = [{ address: email }];                                                                     // 152
			}                                                                                                                   // 155
                                                                                                                       //
			Meteor.users.update(userId, updateUser);                                                                            // 157
                                                                                                                       //
			return userId;                                                                                                      // 159
		}                                                                                                                    // 160
                                                                                                                       //
		return registerGuest;                                                                                                // 4
	}(),                                                                                                                  // 4
	saveGuest: function () {                                                                                              // 162
		function saveGuest(_ref3) {                                                                                          // 4
			var _id = _ref3._id;                                                                                                // 162
			var name = _ref3.name;                                                                                              // 162
			var email = _ref3.email;                                                                                            // 162
			var phone = _ref3.phone;                                                                                            // 162
                                                                                                                       //
			var updateData = {};                                                                                                // 163
                                                                                                                       //
			if (name) {                                                                                                         // 165
				updateData.name = name;                                                                                            // 166
			}                                                                                                                   // 167
			if (email) {                                                                                                        // 168
				updateData.email = email;                                                                                          // 169
			}                                                                                                                   // 170
			if (phone) {                                                                                                        // 171
				updateData.phone = phone;                                                                                          // 172
			}                                                                                                                   // 173
			var ret = RocketChat.models.Users.saveUserById(_id, updateData);                                                    // 174
                                                                                                                       //
			Meteor.defer(function () {                                                                                          // 176
				RocketChat.callbacks.run('livechat.saveGuest', updateData);                                                        // 177
			});                                                                                                                 // 178
                                                                                                                       //
			return ret;                                                                                                         // 180
		}                                                                                                                    // 181
                                                                                                                       //
		return saveGuest;                                                                                                    // 4
	}(),                                                                                                                  // 4
	closeRoom: function () {                                                                                              // 183
		function closeRoom(_ref4) {                                                                                          // 4
			var user = _ref4.user;                                                                                              // 183
			var room = _ref4.room;                                                                                              // 183
			var comment = _ref4.comment;                                                                                        // 183
                                                                                                                       //
			var now = new Date();                                                                                               // 184
			RocketChat.models.Rooms.closeByRoomId(room._id, {                                                                   // 185
				user: {                                                                                                            // 186
					_id: user._id,                                                                                                    // 187
					username: user.username                                                                                           // 188
				},                                                                                                                 // 186
				closedAt: now,                                                                                                     // 190
				chatDuration: (now.getTime() - room.ts) / 1000                                                                     // 191
			});                                                                                                                 // 185
                                                                                                                       //
			var message = {                                                                                                     // 194
				t: 'livechat-close',                                                                                               // 195
				msg: comment,                                                                                                      // 196
				groupable: false                                                                                                   // 197
			};                                                                                                                  // 194
                                                                                                                       //
			RocketChat.sendMessage(user, message, room);                                                                        // 200
                                                                                                                       //
			RocketChat.models.Subscriptions.hideByRoomIdAndUserId(room._id, user._id);                                          // 202
                                                                                                                       //
			RocketChat.models.Messages.createCommandWithRoomIdAndUser('promptTranscript', room._id, user);                      // 204
                                                                                                                       //
			Meteor.defer(function () {                                                                                          // 206
				RocketChat.callbacks.run('livechat.closeRoom', room);                                                              // 207
			});                                                                                                                 // 208
                                                                                                                       //
			return true;                                                                                                        // 210
		}                                                                                                                    // 211
                                                                                                                       //
		return closeRoom;                                                                                                    // 4
	}(),                                                                                                                  // 4
	getInitSettings: function () {                                                                                        // 213
		function getInitSettings() {                                                                                         // 4
			var settings = {};                                                                                                  // 214
                                                                                                                       //
			RocketChat.models.Settings.findNotHiddenPublic(['Livechat_title', 'Livechat_title_color', 'Livechat_enabled', 'Livechat_registration_form', 'Livechat_offline_title', 'Livechat_offline_title_color', 'Livechat_offline_message', 'Livechat_offline_success_message', 'Livechat_offline_form_unavailable', 'Livechat_display_offline_form', 'Livechat_videocall_enabled', 'Jitsi_Enabled', 'Language', 'Livechat_enable_transcript', 'Livechat_transcript_message']).forEach(function (setting) {
				settings[setting._id] = setting.value;                                                                             // 233
			});                                                                                                                 // 234
                                                                                                                       //
			return settings;                                                                                                    // 236
		}                                                                                                                    // 237
                                                                                                                       //
		return getInitSettings;                                                                                              // 4
	}(),                                                                                                                  // 4
	saveRoomInfo: function () {                                                                                           // 239
		function saveRoomInfo(roomData, guestData) {                                                                         // 4
			if (!RocketChat.models.Rooms.saveRoomById(roomData._id, roomData)) {                                                // 240
				return false;                                                                                                      // 241
			}                                                                                                                   // 242
                                                                                                                       //
			Meteor.defer(function () {                                                                                          // 244
				RocketChat.callbacks.run('livechat.saveRoom', roomData);                                                           // 245
			});                                                                                                                 // 246
                                                                                                                       //
			if (!_.isEmpty(guestData.name)) {                                                                                   // 248
				return RocketChat.models.Rooms.setLabelByRoomId(roomData._id, guestData.name) && RocketChat.models.Subscriptions.updateNameByRoomId(roomData._id, guestData.name);
			}                                                                                                                   // 250
		}                                                                                                                    // 251
                                                                                                                       //
		return saveRoomInfo;                                                                                                 // 4
	}(),                                                                                                                  // 4
	closeOpenChats: function () {                                                                                         // 253
		function closeOpenChats(userId, comment) {                                                                           // 4
			var _this = this;                                                                                                   // 253
                                                                                                                       //
			var user = RocketChat.models.Users.findOneById(userId);                                                             // 254
			RocketChat.models.Rooms.findOpenByAgent(userId).forEach(function (room) {                                           // 255
				_this.closeRoom({ user: user, room: room, comment: comment });                                                     // 256
			});                                                                                                                 // 257
		}                                                                                                                    // 258
                                                                                                                       //
		return closeOpenChats;                                                                                               // 4
	}(),                                                                                                                  // 4
	forwardOpenChats: function () {                                                                                       // 260
		function forwardOpenChats(userId) {                                                                                  // 4
			var _this2 = this;                                                                                                  // 260
                                                                                                                       //
			RocketChat.models.Rooms.findOpenByAgent(userId).forEach(function (room) {                                           // 261
				var guest = RocketChat.models.Users.findOneById(room.v._id);                                                       // 262
				_this2.transfer(room, guest, { departmentId: guest.department });                                                  // 263
			});                                                                                                                 // 264
		}                                                                                                                    // 265
                                                                                                                       //
		return forwardOpenChats;                                                                                             // 4
	}(),                                                                                                                  // 4
	savePageHistory: function () {                                                                                        // 267
		function savePageHistory(token, pageInfo) {                                                                          // 4
			if (pageInfo.change === RocketChat.Livechat.historyMonitorType) {                                                   // 268
				return RocketChat.models.LivechatPageVisited.saveByToken(token, pageInfo);                                         // 269
			}                                                                                                                   // 270
                                                                                                                       //
			return;                                                                                                             // 272
		}                                                                                                                    // 273
                                                                                                                       //
		return savePageHistory;                                                                                              // 4
	}(),                                                                                                                  // 4
	transfer: function () {                                                                                               // 275
		function transfer(room, guest, transferData) {                                                                       // 4
			var agent = void 0;                                                                                                 // 276
                                                                                                                       //
			if (transferData.userId) {                                                                                          // 278
				var user = RocketChat.models.Users.findOneById(transferData.userId);                                               // 279
				agent = {                                                                                                          // 280
					agentId: user._id,                                                                                                // 281
					username: user.username                                                                                           // 282
				};                                                                                                                 // 280
			} else {                                                                                                            // 284
				agent = RocketChat.Livechat.getNextAgent(transferData.departmentId);                                               // 285
			}                                                                                                                   // 286
                                                                                                                       //
			if (agent && agent.agentId !== room.servedBy._id) {                                                                 // 288
				room.usernames = _.without(room.usernames, room.servedBy.username).concat(agent.username);                         // 289
                                                                                                                       //
				RocketChat.models.Rooms.changeAgentByRoomId(room._id, room.usernames, agent);                                      // 291
                                                                                                                       //
				var subscriptionData = {                                                                                           // 293
					rid: room._id,                                                                                                    // 294
					name: guest.name || guest.username,                                                                               // 295
					alert: true,                                                                                                      // 296
					open: true,                                                                                                       // 297
					unread: 1,                                                                                                        // 298
					code: room.code,                                                                                                  // 299
					u: {                                                                                                              // 300
						_id: agent.agentId,                                                                                              // 301
						username: agent.username                                                                                         // 302
					},                                                                                                                // 300
					t: 'l',                                                                                                           // 304
					desktopNotifications: 'all',                                                                                      // 305
					mobilePushNotifications: 'all',                                                                                   // 306
					emailNotifications: 'all'                                                                                         // 307
				};                                                                                                                 // 293
				RocketChat.models.Subscriptions.removeByRoomIdAndUserId(room._id, room.servedBy._id);                              // 309
                                                                                                                       //
				RocketChat.models.Subscriptions.insert(subscriptionData);                                                          // 311
                                                                                                                       //
				RocketChat.models.Messages.createUserLeaveWithRoomIdAndUser(room._id, { _id: room.servedBy._id, username: room.servedBy.username });
				RocketChat.models.Messages.createUserJoinWithRoomIdAndUser(room._id, { _id: agent.agentId, username: agent.username });
                                                                                                                       //
				return true;                                                                                                       // 316
			}                                                                                                                   // 317
                                                                                                                       //
			return false;                                                                                                       // 319
		}                                                                                                                    // 320
                                                                                                                       //
		return transfer;                                                                                                     // 4
	}(),                                                                                                                  // 4
	sendRequest: function () {                                                                                            // 322
		function sendRequest(postData, callback) {                                                                           // 4
			var trying = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;                                 // 322
                                                                                                                       //
			try {                                                                                                               // 323
				var options = {                                                                                                    // 324
					headers: {                                                                                                        // 325
						'X-RocketChat-Livechat-Token': RocketChat.settings.get('Livechat_secret_token')                                  // 326
					},                                                                                                                // 325
					data: postData                                                                                                    // 328
				};                                                                                                                 // 324
				return HTTP.post(RocketChat.settings.get('Livechat_webhookUrl'), options);                                         // 330
			} catch (e) {                                                                                                       // 331
				RocketChat.Livechat.logger.webhook.error('Response error on ' + trying + ' try ->', e);                            // 332
				// try 10 times after 10 seconds each                                                                              // 333
				if (trying < 10) {                                                                                                 // 334
					RocketChat.Livechat.logger.webhook.warn('Will try again in 10 seconds ...');                                      // 335
					trying++;                                                                                                         // 336
					setTimeout(Meteor.bindEnvironment(function () {                                                                   // 337
						RocketChat.Livechat.sendRequest(postData, callback, trying);                                                     // 338
					}), 10000);                                                                                                       // 339
				}                                                                                                                  // 340
			}                                                                                                                   // 341
		}                                                                                                                    // 342
                                                                                                                       //
		return sendRequest;                                                                                                  // 4
	}(),                                                                                                                  // 4
	getLivechatRoomGuestInfo: function () {                                                                               // 344
		function getLivechatRoomGuestInfo(room) {                                                                            // 4
			var visitor = RocketChat.models.Users.findOneById(room.v._id);                                                      // 345
			var agent = RocketChat.models.Users.findOneById(room.servedBy._id);                                                 // 346
                                                                                                                       //
			var ua = new UAParser();                                                                                            // 348
			ua.setUA(visitor.userAgent);                                                                                        // 349
                                                                                                                       //
			var postData = {                                                                                                    // 351
				_id: room._id,                                                                                                     // 352
				label: room.label,                                                                                                 // 353
				topic: room.topic,                                                                                                 // 354
				code: room.code,                                                                                                   // 355
				createdAt: room.ts,                                                                                                // 356
				lastMessageAt: room.lm,                                                                                            // 357
				tags: room.tags,                                                                                                   // 358
				customFields: room.livechatData,                                                                                   // 359
				visitor: {                                                                                                         // 360
					_id: visitor._id,                                                                                                 // 361
					name: visitor.name,                                                                                               // 362
					username: visitor.username,                                                                                       // 363
					email: null,                                                                                                      // 364
					phone: null,                                                                                                      // 365
					department: visitor.department,                                                                                   // 366
					ip: visitor.ip,                                                                                                   // 367
					os: ua.getOS().name && ua.getOS().name + ' ' + ua.getOS().version,                                                // 368
					browser: ua.getBrowser().name && ua.getBrowser().name + ' ' + ua.getBrowser().version,                            // 369
					customFields: visitor.livechatData                                                                                // 370
				},                                                                                                                 // 360
				agent: {                                                                                                           // 372
					_id: agent._id,                                                                                                   // 373
					username: agent.username,                                                                                         // 374
					name: agent.name,                                                                                                 // 375
					email: null                                                                                                       // 376
				}                                                                                                                  // 372
			};                                                                                                                  // 351
                                                                                                                       //
			if (room.crmData) {                                                                                                 // 380
				postData.crmData = room.crmData;                                                                                   // 381
			}                                                                                                                   // 382
                                                                                                                       //
			if (visitor.emails && visitor.emails.length > 0) {                                                                  // 384
				postData.visitor.email = visitor.emails[0].address;                                                                // 385
			}                                                                                                                   // 386
			if (visitor.phone && visitor.phone.length > 0) {                                                                    // 387
				postData.visitor.phone = visitor.phone[0].phoneNumber;                                                             // 388
			}                                                                                                                   // 389
                                                                                                                       //
			if (agent.emails && agent.emails.length > 0) {                                                                      // 391
				postData.agent.email = agent.emails[0].address;                                                                    // 392
			}                                                                                                                   // 393
                                                                                                                       //
			return postData;                                                                                                    // 395
		}                                                                                                                    // 396
                                                                                                                       //
		return getLivechatRoomGuestInfo;                                                                                     // 4
	}(),                                                                                                                  // 4
	addAgent: function () {                                                                                               // 398
		function addAgent(username) {                                                                                        // 4
			check(username, String);                                                                                            // 399
                                                                                                                       //
			var user = RocketChat.models.Users.findOneByUsername(username, { fields: { _id: 1, username: 1 } });                // 401
                                                                                                                       //
			if (!user) {                                                                                                        // 403
				throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'livechat:addAgent' });                     // 404
			}                                                                                                                   // 405
                                                                                                                       //
			if (RocketChat.authz.addUserRoles(user._id, 'livechat-agent')) {                                                    // 407
				RocketChat.models.Users.setOperator(user._id, true);                                                               // 408
				RocketChat.models.Users.setLivechatStatus(user._id, 'available');                                                  // 409
				return user;                                                                                                       // 410
			}                                                                                                                   // 411
                                                                                                                       //
			return false;                                                                                                       // 413
		}                                                                                                                    // 414
                                                                                                                       //
		return addAgent;                                                                                                     // 4
	}(),                                                                                                                  // 4
	addManager: function () {                                                                                             // 416
		function addManager(username) {                                                                                      // 4
			check(username, String);                                                                                            // 417
                                                                                                                       //
			var user = RocketChat.models.Users.findOneByUsername(username, { fields: { _id: 1, username: 1 } });                // 419
                                                                                                                       //
			if (!user) {                                                                                                        // 421
				throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'livechat:addManager' });                   // 422
			}                                                                                                                   // 423
                                                                                                                       //
			if (RocketChat.authz.addUserRoles(user._id, 'livechat-manager')) {                                                  // 425
				return user;                                                                                                       // 426
			}                                                                                                                   // 427
                                                                                                                       //
			return false;                                                                                                       // 429
		}                                                                                                                    // 430
                                                                                                                       //
		return addManager;                                                                                                   // 4
	}(),                                                                                                                  // 4
	removeAgent: function () {                                                                                            // 432
		function removeAgent(username) {                                                                                     // 4
			check(username, String);                                                                                            // 433
                                                                                                                       //
			var user = RocketChat.models.Users.findOneByUsername(username, { fields: { _id: 1 } });                             // 435
                                                                                                                       //
			if (!user) {                                                                                                        // 437
				throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'livechat:removeAgent' });                  // 438
			}                                                                                                                   // 439
                                                                                                                       //
			if (RocketChat.authz.removeUserFromRoles(user._id, 'livechat-agent')) {                                             // 441
				RocketChat.models.Users.setOperator(user._id, false);                                                              // 442
				RocketChat.models.Users.setLivechatStatus(user._id, 'not-available');                                              // 443
				return true;                                                                                                       // 444
			}                                                                                                                   // 445
                                                                                                                       //
			return false;                                                                                                       // 447
		}                                                                                                                    // 448
                                                                                                                       //
		return removeAgent;                                                                                                  // 4
	}(),                                                                                                                  // 4
	removeManager: function () {                                                                                          // 450
		function removeManager(username) {                                                                                   // 4
			check(username, String);                                                                                            // 451
                                                                                                                       //
			var user = RocketChat.models.Users.findOneByUsername(username, { fields: { _id: 1 } });                             // 453
                                                                                                                       //
			if (!user) {                                                                                                        // 455
				throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'livechat:removeManager' });                // 456
			}                                                                                                                   // 457
                                                                                                                       //
			return RocketChat.authz.removeUserFromRoles(user._id, 'livechat-manager');                                          // 459
		}                                                                                                                    // 460
                                                                                                                       //
		return removeManager;                                                                                                // 4
	}(),                                                                                                                  // 4
	saveDepartment: function () {                                                                                         // 462
		function saveDepartment(_id, departmentData, departmentAgents) {                                                     // 4
			check(_id, Match.Maybe(String));                                                                                    // 463
                                                                                                                       //
			check(departmentData, {                                                                                             // 465
				enabled: Boolean,                                                                                                  // 466
				name: String,                                                                                                      // 467
				description: Match.Optional(String)                                                                                // 468
			});                                                                                                                 // 465
                                                                                                                       //
			check(departmentAgents, [Match.ObjectIncluding({                                                                    // 471
				agentId: String,                                                                                                   // 473
				username: String                                                                                                   // 474
			})]);                                                                                                               // 472
                                                                                                                       //
			if (_id) {                                                                                                          // 478
				var department = RocketChat.models.LivechatDepartment.findOneById(_id);                                            // 479
				if (!department) {                                                                                                 // 480
					throw new Meteor.Error('error-department-not-found', 'Department not found', { method: 'livechat:saveDepartment' });
				}                                                                                                                  // 482
			}                                                                                                                   // 483
                                                                                                                       //
			return RocketChat.models.LivechatDepartment.createOrUpdateDepartment(_id, departmentData.enabled, departmentData.name, departmentData.description, departmentAgents);
		}                                                                                                                    // 486
                                                                                                                       //
		return saveDepartment;                                                                                               // 4
	}(),                                                                                                                  // 4
	removeDepartment: function () {                                                                                       // 488
		function removeDepartment(_id) {                                                                                     // 4
			check(_id, String);                                                                                                 // 489
                                                                                                                       //
			var department = RocketChat.models.LivechatDepartment.findOneById(_id, { fields: { _id: 1 } });                     // 491
                                                                                                                       //
			if (!department) {                                                                                                  // 493
				throw new Meteor.Error('department-not-found', 'Department not found', { method: 'livechat:removeDepartment' });   // 494
			}                                                                                                                   // 495
                                                                                                                       //
			return RocketChat.models.LivechatDepartment.removeById(_id);                                                        // 497
		}                                                                                                                    // 498
                                                                                                                       //
		return removeDepartment;                                                                                             // 4
	}()                                                                                                                   // 4
};                                                                                                                     // 4
                                                                                                                       //
RocketChat.settings.get('Livechat_history_monitor_type', function (key, value) {                                       // 501
	RocketChat.Livechat.historyMonitorType = value;                                                                       // 502
});                                                                                                                    // 503
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"QueueMethods.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/lib/QueueMethods.js                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.QueueMethods = {                                                                                            // 1
	/* Least Amount Queuing method:                                                                                       // 2
  *                                                                                                                    //
  * default method where the agent with the least number                                                               //
  * of open chats is paired with the incoming livechat                                                                 //
  */                                                                                                                   //
	'Least_Amount': function () {                                                                                         // 7
		function Least_Amount(guest, message, roomInfo) {                                                                    // 7
			var agent = RocketChat.Livechat.getNextAgent(guest.department);                                                     // 8
			if (!agent) {                                                                                                       // 9
				throw new Meteor.Error('no-agent-online', 'Sorry, no online agents');                                              // 10
			}                                                                                                                   // 11
                                                                                                                       //
			var roomCode = RocketChat.models.Rooms.getNextLivechatRoomCode();                                                   // 13
                                                                                                                       //
			var room = _.extend({                                                                                               // 15
				_id: message.rid,                                                                                                  // 16
				msgs: 1,                                                                                                           // 17
				lm: new Date(),                                                                                                    // 18
				code: roomCode,                                                                                                    // 19
				label: guest.name || guest.username,                                                                               // 20
				usernames: [agent.username, guest.username],                                                                       // 21
				t: 'l',                                                                                                            // 22
				ts: new Date(),                                                                                                    // 23
				v: {                                                                                                               // 24
					_id: guest._id,                                                                                                   // 25
					token: message.token                                                                                              // 26
				},                                                                                                                 // 24
				servedBy: {                                                                                                        // 28
					_id: agent.agentId,                                                                                               // 29
					username: agent.username                                                                                          // 30
				},                                                                                                                 // 28
				cl: false,                                                                                                         // 32
				open: true,                                                                                                        // 33
				waitingResponse: true                                                                                              // 34
			}, roomInfo);                                                                                                       // 15
			var subscriptionData = {                                                                                            // 36
				rid: message.rid,                                                                                                  // 37
				name: guest.name || guest.username,                                                                                // 38
				alert: true,                                                                                                       // 39
				open: true,                                                                                                        // 40
				unread: 1,                                                                                                         // 41
				code: roomCode,                                                                                                    // 42
				u: {                                                                                                               // 43
					_id: agent.agentId,                                                                                               // 44
					username: agent.username                                                                                          // 45
				},                                                                                                                 // 43
				t: 'l',                                                                                                            // 47
				desktopNotifications: 'all',                                                                                       // 48
				mobilePushNotifications: 'all',                                                                                    // 49
				emailNotifications: 'all'                                                                                          // 50
			};                                                                                                                  // 36
                                                                                                                       //
			RocketChat.models.Rooms.insert(room);                                                                               // 53
			RocketChat.models.Subscriptions.insert(subscriptionData);                                                           // 54
                                                                                                                       //
			return room;                                                                                                        // 56
		}                                                                                                                    // 57
                                                                                                                       //
		return Least_Amount;                                                                                                 // 7
	}(),                                                                                                                  // 7
	/* Guest Pool Queuing Method:                                                                                         // 58
  *                                                                                                                    //
  * An incomming livechat is created as an Inquiry                                                                     //
  * which is picked up from an agent.                                                                                  //
  * An Inquiry is visible to all agents (TODO: in the correct department)                                              //
     *                                                                                                                 //
  * A room is still created with the initial message, but it is occupied by                                            //
  * only the client until paired with an agent                                                                         //
  */                                                                                                                   //
	'Guest_Pool': function () {                                                                                           // 67
		function Guest_Pool(guest, message, roomInfo) {                                                                      // 67
			var agents = RocketChat.Livechat.getOnlineAgents(guest.department);                                                 // 68
                                                                                                                       //
			if (agents.count() === 0 && RocketChat.settings.get('Livechat_guest_pool_with_no_agents')) {                        // 70
				agents = RocketChat.Livechat.getAgents(guest.department);                                                          // 71
			}                                                                                                                   // 72
                                                                                                                       //
			if (agents.count() === 0) {                                                                                         // 74
				throw new Meteor.Error('no-agent-online', 'Sorry, no online agents');                                              // 75
			}                                                                                                                   // 76
                                                                                                                       //
			var roomCode = RocketChat.models.Rooms.getNextLivechatRoomCode();                                                   // 78
                                                                                                                       //
			var agentIds = [];                                                                                                  // 80
                                                                                                                       //
			agents.forEach(function (agent) {                                                                                   // 82
				if (guest.department) {                                                                                            // 83
					agentIds.push(agent.agentId);                                                                                     // 84
				} else {                                                                                                           // 85
					agentIds.push(agent._id);                                                                                         // 86
				}                                                                                                                  // 87
			});                                                                                                                 // 88
                                                                                                                       //
			var inquiry = {                                                                                                     // 90
				rid: message.rid,                                                                                                  // 91
				message: message.msg,                                                                                              // 92
				name: guest.name || guest.username,                                                                                // 93
				ts: new Date(),                                                                                                    // 94
				code: roomCode,                                                                                                    // 95
				department: guest.department,                                                                                      // 96
				agents: agentIds,                                                                                                  // 97
				status: 'open',                                                                                                    // 98
				t: 'l'                                                                                                             // 99
			};                                                                                                                  // 90
			var room = _.extend({                                                                                               // 101
				_id: message.rid,                                                                                                  // 102
				msgs: 1,                                                                                                           // 103
				lm: new Date(),                                                                                                    // 104
				code: roomCode,                                                                                                    // 105
				label: guest.name || guest.username,                                                                               // 106
				usernames: [guest.username],                                                                                       // 107
				t: 'l',                                                                                                            // 108
				ts: new Date(),                                                                                                    // 109
				v: {                                                                                                               // 110
					_id: guest._id,                                                                                                   // 111
					token: message.token                                                                                              // 112
				},                                                                                                                 // 110
				cl: false,                                                                                                         // 114
				open: true,                                                                                                        // 115
				waitingResponse: true                                                                                              // 116
			}, roomInfo);                                                                                                       // 101
			RocketChat.models.LivechatInquiry.insert(inquiry);                                                                  // 118
			RocketChat.models.Rooms.insert(room);                                                                               // 119
                                                                                                                       //
			return room;                                                                                                        // 121
		}                                                                                                                    // 122
                                                                                                                       //
		return Guest_Pool;                                                                                                   // 67
	}()                                                                                                                   // 67
};                                                                                                                     // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"OfficeClock.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/lib/OfficeClock.js                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// Every minute check if office closed                                                                                 // 1
Meteor.setInterval(function () {                                                                                       // 2
	if (RocketChat.settings.get('Livechat_enable_office_hours')) {                                                        // 3
		if (RocketChat.models.LivechatOfficeHour.isOpeningTime()) {                                                          // 4
			RocketChat.models.Users.openOffice();                                                                               // 5
		} else if (RocketChat.models.LivechatOfficeHour.isClosingTime()) {                                                   // 6
			RocketChat.models.Users.closeOffice();                                                                              // 7
		}                                                                                                                    // 8
	}                                                                                                                     // 9
}, 60000);                                                                                                             // 10
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"sendMessageBySMS.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/sendMessageBySMS.js                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.callbacks.add('afterSaveMessage', function (message, room) {                                                // 1
	// skips this callback if the message was edited                                                                      // 2
	if (message.editedAt) {                                                                                               // 3
		return message;                                                                                                      // 4
	}                                                                                                                     // 5
                                                                                                                       //
	if (!RocketChat.SMS.enabled) {                                                                                        // 7
		return message;                                                                                                      // 8
	}                                                                                                                     // 9
                                                                                                                       //
	// only send the sms by SMS if it is a livechat room with SMS set to true                                             // 11
	if (!(typeof room.t !== 'undefined' && room.t === 'l' && room.sms && room.v && room.v.token)) {                       // 12
		return message;                                                                                                      // 13
	}                                                                                                                     // 14
                                                                                                                       //
	// if the message has a token, it was sent from the visitor, so ignore it                                             // 16
	if (message.token) {                                                                                                  // 17
		return message;                                                                                                      // 18
	}                                                                                                                     // 19
                                                                                                                       //
	// if the message has a type means it is a special message (like the closing comment), so skips                       // 21
	if (message.t) {                                                                                                      // 22
		return message;                                                                                                      // 23
	}                                                                                                                     // 24
                                                                                                                       //
	var SMSService = RocketChat.SMS.getService(RocketChat.settings.get('SMS_Service'));                                   // 26
                                                                                                                       //
	if (!SMSService) {                                                                                                    // 28
		return message;                                                                                                      // 29
	}                                                                                                                     // 30
                                                                                                                       //
	var visitor = RocketChat.models.Users.getVisitorByToken(room.v.token);                                                // 32
                                                                                                                       //
	if (!visitor || !visitor.profile || !visitor.phone || visitor.phone.length === 0) {                                   // 34
		return message;                                                                                                      // 35
	}                                                                                                                     // 36
                                                                                                                       //
	SMSService.send(room.sms.from, visitor.phone[0].phoneNumber, message.msg);                                            // 38
                                                                                                                       //
	return message;                                                                                                       // 40
}, RocketChat.callbacks.priority.LOW, 'sendMessageBySms');                                                             // 42
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"unclosedLivechats.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/unclosedLivechats.js                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals UserPresenceMonitor */                                                                                      // 1
                                                                                                                       //
var agentsHandler = void 0;                                                                                            // 3
var monitorAgents = false;                                                                                             // 4
var actionTimeout = 60000;                                                                                             // 5
                                                                                                                       //
var onlineAgents = {                                                                                                   // 7
	users: {},                                                                                                            // 8
	queue: {},                                                                                                            // 9
                                                                                                                       //
	add: function () {                                                                                                    // 11
		function add(userId) {                                                                                               // 7
			if (this.queue[userId]) {                                                                                           // 12
				clearTimeout(this.queue[userId]);                                                                                  // 13
				delete this.queue[userId];                                                                                         // 14
			}                                                                                                                   // 15
			this.users[userId] = 1;                                                                                             // 16
		}                                                                                                                    // 17
                                                                                                                       //
		return add;                                                                                                          // 7
	}(),                                                                                                                  // 7
	remove: function () {                                                                                                 // 19
		function remove(userId, callback) {                                                                                  // 7
			var _this = this;                                                                                                   // 19
                                                                                                                       //
			if (this.queue[userId]) {                                                                                           // 20
				clearTimeout(this.queue[userId]);                                                                                  // 21
			}                                                                                                                   // 22
			this.queue[userId] = setTimeout(Meteor.bindEnvironment(function () {                                                // 23
				callback();                                                                                                        // 24
                                                                                                                       //
				delete _this.users[userId];                                                                                        // 26
				delete _this.queue[userId];                                                                                        // 27
			}), actionTimeout);                                                                                                 // 28
		}                                                                                                                    // 29
                                                                                                                       //
		return remove;                                                                                                       // 7
	}(),                                                                                                                  // 7
	exists: function () {                                                                                                 // 31
		function exists(userId) {                                                                                            // 7
			return !!this.users[userId];                                                                                        // 32
		}                                                                                                                    // 33
                                                                                                                       //
		return exists;                                                                                                       // 7
	}()                                                                                                                   // 7
};                                                                                                                     // 7
                                                                                                                       //
function runAgentLeaveAction(userId) {                                                                                 // 36
	var action = RocketChat.settings.get('Livechat_agent_leave_action');                                                  // 37
	if (action === 'close') {                                                                                             // 38
		return RocketChat.Livechat.closeOpenChats(userId, RocketChat.settings.get('Livechat_agent_leave_comment'));          // 39
	} else if (action === 'forward') {                                                                                    // 40
		return RocketChat.Livechat.forwardOpenChats(userId);                                                                 // 41
	}                                                                                                                     // 42
}                                                                                                                      // 43
                                                                                                                       //
RocketChat.settings.get('Livechat_agent_leave_action_timeout', function (key, value) {                                 // 45
	actionTimeout = value * 1000;                                                                                         // 46
});                                                                                                                    // 47
                                                                                                                       //
RocketChat.settings.get('Livechat_agent_leave_action', function (key, value) {                                         // 49
	monitorAgents = value;                                                                                                // 50
	if (value !== 'none') {                                                                                               // 51
		if (!agentsHandler) {                                                                                                // 52
			agentsHandler = RocketChat.models.Users.findOnlineAgents().observeChanges({                                         // 53
				added: function () {                                                                                               // 54
					function added(id) {                                                                                              // 53
						onlineAgents.add(id);                                                                                            // 55
					}                                                                                                                 // 56
                                                                                                                       //
					return added;                                                                                                     // 53
				}(),                                                                                                               // 53
				changed: function () {                                                                                             // 57
					function changed(id, fields) {                                                                                    // 53
						if (fields.statusLivechat && fields.statusLivechat === 'not-available') {                                        // 58
							onlineAgents.remove(id, function () {                                                                           // 59
								runAgentLeaveAction(id);                                                                                       // 60
							});                                                                                                             // 61
						} else {                                                                                                         // 62
							onlineAgents.add(id);                                                                                           // 63
						}                                                                                                                // 64
					}                                                                                                                 // 65
                                                                                                                       //
					return changed;                                                                                                   // 53
				}(),                                                                                                               // 53
				removed: function () {                                                                                             // 66
					function removed(id) {                                                                                            // 53
						onlineAgents.remove(id, function () {                                                                            // 67
							runAgentLeaveAction(id);                                                                                        // 68
						});                                                                                                              // 69
					}                                                                                                                 // 70
                                                                                                                       //
					return removed;                                                                                                   // 53
				}()                                                                                                                // 53
			});                                                                                                                 // 53
		}                                                                                                                    // 72
	} else if (agentsHandler) {                                                                                           // 73
		agentsHandler.stop();                                                                                                // 74
		agentsHandler = null;                                                                                                // 75
	}                                                                                                                     // 76
});                                                                                                                    // 77
                                                                                                                       //
UserPresenceMonitor.onSetUserStatus(function (user, status, statusConnection) {                                        // 79
	if (!monitorAgents) {                                                                                                 // 80
		return;                                                                                                              // 81
	}                                                                                                                     // 82
	if (onlineAgents.exists(user._id)) {                                                                                  // 83
		if (statusConnection === 'offline' || user.statusLivechat === 'not-available') {                                     // 84
			onlineAgents.remove(user._id, function () {                                                                         // 85
				runAgentLeaveAction(user._id);                                                                                     // 86
			});                                                                                                                 // 87
		}                                                                                                                    // 88
	}                                                                                                                     // 89
});                                                                                                                    // 90
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"publications":{"customFields.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/publications/customFields.js                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.publish('livechat:customFields', function (_id) {                                                               // 1
	if (!this.userId) {                                                                                                   // 2
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', { publish: 'livechat:customFields' }));
	}                                                                                                                     // 4
                                                                                                                       //
	if (!RocketChat.authz.hasPermission(this.userId, 'view-l-room')) {                                                    // 6
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', { publish: 'livechat:customFields' }));
	}                                                                                                                     // 8
                                                                                                                       //
	if (s.trim(_id)) {                                                                                                    // 10
		return RocketChat.models.LivechatCustomField.find({ _id: _id });                                                     // 11
	}                                                                                                                     // 12
                                                                                                                       //
	return RocketChat.models.LivechatCustomField.find();                                                                  // 14
});                                                                                                                    // 16
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"departmentAgents.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/publications/departmentAgents.js                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.publish('livechat:departmentAgents', function (departmentId) {                                                  // 1
	if (!this.userId) {                                                                                                   // 2
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', { publish: 'livechat:departmentAgents' }));
	}                                                                                                                     // 4
                                                                                                                       //
	if (!RocketChat.authz.hasPermission(this.userId, 'view-livechat-rooms')) {                                            // 6
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', { publish: 'livechat:departmentAgents' }));
	}                                                                                                                     // 8
                                                                                                                       //
	return RocketChat.models.LivechatDepartmentAgents.find({ departmentId: departmentId });                               // 10
});                                                                                                                    // 11
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"externalMessages.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/publications/externalMessages.js                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.publish('livechat:externalMessages', function (roomId) {                                                        // 1
	return RocketChat.models.LivechatExternalMessage.findByRoomId(roomId);                                                // 2
});                                                                                                                    // 3
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"livechatAgents.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/publications/livechatAgents.js                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.publish('livechat:agents', function () {                                                                        // 1
	if (!this.userId) {                                                                                                   // 2
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', { publish: 'livechat:agents' }));       // 3
	}                                                                                                                     // 4
                                                                                                                       //
	if (!RocketChat.authz.hasPermission(this.userId, 'view-l-room')) {                                                    // 6
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', { publish: 'livechat:agents' }));       // 7
	}                                                                                                                     // 8
                                                                                                                       //
	var self = this;                                                                                                      // 10
                                                                                                                       //
	var handle = RocketChat.authz.getUsersInRole('livechat-agent').observeChanges({                                       // 12
		added: function () {                                                                                                 // 13
			function added(id, fields) {                                                                                        // 12
				self.added('agentUsers', id, fields);                                                                              // 14
			}                                                                                                                   // 15
                                                                                                                       //
			return added;                                                                                                       // 12
		}(),                                                                                                                 // 12
		changed: function () {                                                                                               // 16
			function changed(id, fields) {                                                                                      // 12
				self.changed('agentUsers', id, fields);                                                                            // 17
			}                                                                                                                   // 18
                                                                                                                       //
			return changed;                                                                                                     // 12
		}(),                                                                                                                 // 12
		removed: function () {                                                                                               // 19
			function removed(id) {                                                                                              // 12
				self.removed('agentUsers', id);                                                                                    // 20
			}                                                                                                                   // 21
                                                                                                                       //
			return removed;                                                                                                     // 12
		}()                                                                                                                  // 12
	});                                                                                                                   // 12
                                                                                                                       //
	self.ready();                                                                                                         // 24
                                                                                                                       //
	self.onStop(function () {                                                                                             // 26
		handle.stop();                                                                                                       // 27
	});                                                                                                                   // 28
});                                                                                                                    // 29
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"livechatDepartments.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/publications/livechatDepartments.js                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.publish('livechat:departments', function (_id) {                                                                // 1
	if (!this.userId) {                                                                                                   // 2
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', { publish: 'livechat:agents' }));       // 3
	}                                                                                                                     // 4
                                                                                                                       //
	if (!RocketChat.authz.hasPermission(this.userId, 'view-l-room')) {                                                    // 6
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', { publish: 'livechat:agents' }));       // 7
	}                                                                                                                     // 8
                                                                                                                       //
	if (_id !== undefined) {                                                                                              // 10
		return RocketChat.models.LivechatDepartment.findByDepartmentId(_id);                                                 // 11
	} else {                                                                                                              // 12
		return RocketChat.models.LivechatDepartment.find();                                                                  // 13
	}                                                                                                                     // 14
});                                                                                                                    // 16
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"livechatIntegration.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/publications/livechatIntegration.js                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.publish('livechat:integration', function () {                                                                   // 1
	if (!this.userId) {                                                                                                   // 2
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', { publish: 'livechat:integration' }));  // 3
	}                                                                                                                     // 4
                                                                                                                       //
	if (!RocketChat.authz.hasPermission(this.userId, 'view-livechat-manager')) {                                          // 6
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', { publish: 'livechat:integration' }));  // 7
	}                                                                                                                     // 8
                                                                                                                       //
	var self = this;                                                                                                      // 10
                                                                                                                       //
	var handle = RocketChat.models.Settings.findByIds(['Livechat_webhookUrl', 'Livechat_secret_token', 'Livechat_webhook_on_close', 'Livechat_webhook_on_offline_msg']).observeChanges({
		added: function () {                                                                                                 // 13
			function added(id, fields) {                                                                                        // 12
				self.added('livechatIntegration', id, fields);                                                                     // 14
			}                                                                                                                   // 15
                                                                                                                       //
			return added;                                                                                                       // 12
		}(),                                                                                                                 // 12
		changed: function () {                                                                                               // 16
			function changed(id, fields) {                                                                                      // 12
				self.changed('livechatIntegration', id, fields);                                                                   // 17
			}                                                                                                                   // 18
                                                                                                                       //
			return changed;                                                                                                     // 12
		}(),                                                                                                                 // 12
		removed: function () {                                                                                               // 19
			function removed(id) {                                                                                              // 12
				self.removed('livechatIntegration', id);                                                                           // 20
			}                                                                                                                   // 21
                                                                                                                       //
			return removed;                                                                                                     // 12
		}()                                                                                                                  // 12
	});                                                                                                                   // 12
                                                                                                                       //
	self.ready();                                                                                                         // 24
                                                                                                                       //
	self.onStop(function () {                                                                                             // 26
		handle.stop();                                                                                                       // 27
	});                                                                                                                   // 28
});                                                                                                                    // 29
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"livechatManagers.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/publications/livechatManagers.js                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.publish('livechat:managers', function () {                                                                      // 1
	if (!this.userId) {                                                                                                   // 2
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', { publish: 'livechat:managers' }));     // 3
	}                                                                                                                     // 4
                                                                                                                       //
	if (!RocketChat.authz.hasPermission(this.userId, 'view-livechat-rooms')) {                                            // 6
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', { publish: 'livechat:managers' }));     // 7
	}                                                                                                                     // 8
                                                                                                                       //
	var self = this;                                                                                                      // 10
                                                                                                                       //
	var handle = RocketChat.authz.getUsersInRole('livechat-manager').observeChanges({                                     // 12
		added: function () {                                                                                                 // 13
			function added(id, fields) {                                                                                        // 12
				self.added('managerUsers', id, fields);                                                                            // 14
			}                                                                                                                   // 15
                                                                                                                       //
			return added;                                                                                                       // 12
		}(),                                                                                                                 // 12
		changed: function () {                                                                                               // 16
			function changed(id, fields) {                                                                                      // 12
				self.changed('managerUsers', id, fields);                                                                          // 17
			}                                                                                                                   // 18
                                                                                                                       //
			return changed;                                                                                                     // 12
		}(),                                                                                                                 // 12
		removed: function () {                                                                                               // 19
			function removed(id) {                                                                                              // 12
				self.removed('managerUsers', id);                                                                                  // 20
			}                                                                                                                   // 21
                                                                                                                       //
			return removed;                                                                                                     // 12
		}()                                                                                                                  // 12
	});                                                                                                                   // 12
                                                                                                                       //
	self.ready();                                                                                                         // 24
                                                                                                                       //
	self.onStop(function () {                                                                                             // 26
		handle.stop();                                                                                                       // 27
	});                                                                                                                   // 28
});                                                                                                                    // 29
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"livechatRooms.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/publications/livechatRooms.js                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.publish('livechat:rooms', function () {                                                                         // 1
	var filter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};                                  // 1
	var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;                                   // 1
	var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 20;                                   // 1
                                                                                                                       //
	if (!this.userId) {                                                                                                   // 2
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', { publish: 'livechat:rooms' }));        // 3
	}                                                                                                                     // 4
                                                                                                                       //
	if (!RocketChat.authz.hasPermission(this.userId, 'view-livechat-rooms')) {                                            // 6
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', { publish: 'livechat:rooms' }));        // 7
	}                                                                                                                     // 8
                                                                                                                       //
	check(filter, {                                                                                                       // 10
		name: Match.Maybe(String), // room name to filter                                                                    // 11
		agent: Match.Maybe(String), // agent _id who is serving                                                              // 12
		status: Match.Maybe(String), // either 'opened' or 'closed'                                                          // 13
		from: Match.Maybe(String),                                                                                           // 14
		to: Match.Maybe(String)                                                                                              // 15
	});                                                                                                                   // 10
                                                                                                                       //
	var query = {};                                                                                                       // 18
	if (filter.name) {                                                                                                    // 19
		query.label = new RegExp(filter.name, 'i');                                                                          // 20
	}                                                                                                                     // 21
	if (filter.agent) {                                                                                                   // 22
		query['servedBy._id'] = filter.agent;                                                                                // 23
	}                                                                                                                     // 24
	if (filter.status) {                                                                                                  // 25
		if (filter.status === 'opened') {                                                                                    // 26
			query.open = true;                                                                                                  // 27
		} else {                                                                                                             // 28
			query.open = { $exists: false };                                                                                    // 29
		}                                                                                                                    // 30
	}                                                                                                                     // 31
	if (filter.from && filter.to) {                                                                                       // 32
		var StartDate = new Date(filter.from);                                                                               // 33
		var ToDate = new Date(filter.to);                                                                                    // 34
		ToDate.setDate(ToDate.getDate() + 1);                                                                                // 35
		query['ts'] = { $gt: StartDate, $lt: ToDate };                                                                       // 36
	}                                                                                                                     // 37
                                                                                                                       //
	return RocketChat.models.Rooms.findLivechat(query, offset, limit);                                                    // 39
});                                                                                                                    // 40
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"livechatQueue.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/publications/livechatQueue.js                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.publish('livechat:queue', function () {                                                                         // 1
	if (!this.userId) {                                                                                                   // 2
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', { publish: 'livechat:queue' }));        // 3
	}                                                                                                                     // 4
                                                                                                                       //
	if (!RocketChat.authz.hasPermission(this.userId, 'view-l-room')) {                                                    // 6
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', { publish: 'livechat:queue' }));        // 7
	}                                                                                                                     // 8
                                                                                                                       //
	// let sort = { count: 1, sort: 1, username: 1 };                                                                     // 10
	// let onlineUsers = {};                                                                                              // 11
                                                                                                                       //
	// let handleUsers = RocketChat.models.Users.findOnlineAgents().observeChanges({                                      // 13
	// 	added(id, fields) {                                                                                               // 14
	// 		onlineUsers[fields.username] = 1;                                                                                // 15
	// 		// this.added('livechatQueueUser', id, fields);                                                                  // 16
	// 	},                                                                                                                // 17
	// 	changed(id, fields) {                                                                                             // 18
	// 		onlineUsers[fields.username] = 1;                                                                                // 19
	// 		// this.changed('livechatQueueUser', id, fields);                                                                // 20
	// 	},                                                                                                                // 21
	// 	removed(id) {                                                                                                     // 22
	// 		this.removed('livechatQueueUser', id);                                                                           // 23
	// 	}                                                                                                                 // 24
	// });                                                                                                                // 25
                                                                                                                       //
	var self = this;                                                                                                      // 27
                                                                                                                       //
	var handleDepts = RocketChat.models.LivechatDepartmentAgents.findUsersInQueue().observeChanges({                      // 29
		added: function () {                                                                                                 // 30
			function added(id, fields) {                                                                                        // 29
				self.added('livechatQueueUser', id, fields);                                                                       // 31
			}                                                                                                                   // 32
                                                                                                                       //
			return added;                                                                                                       // 29
		}(),                                                                                                                 // 29
		changed: function () {                                                                                               // 33
			function changed(id, fields) {                                                                                      // 29
				self.changed('livechatQueueUser', id, fields);                                                                     // 34
			}                                                                                                                   // 35
                                                                                                                       //
			return changed;                                                                                                     // 29
		}(),                                                                                                                 // 29
		removed: function () {                                                                                               // 36
			function removed(id) {                                                                                              // 29
				self.removed('livechatQueueUser', id);                                                                             // 37
			}                                                                                                                   // 38
                                                                                                                       //
			return removed;                                                                                                     // 29
		}()                                                                                                                  // 29
	});                                                                                                                   // 29
                                                                                                                       //
	this.ready();                                                                                                         // 41
                                                                                                                       //
	this.onStop(function () {                                                                                             // 43
		// handleUsers.stop();                                                                                               // 44
		handleDepts.stop();                                                                                                  // 45
	});                                                                                                                   // 46
});                                                                                                                    // 47
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"visitorHistory.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/publications/visitorHistory.js                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.publish('livechat:visitorHistory', function (_ref) {                                                            // 1
	var roomId = _ref.rid;                                                                                                // 1
                                                                                                                       //
	if (!this.userId) {                                                                                                   // 2
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', { publish: 'livechat:visitorHistory' }));
	}                                                                                                                     // 4
                                                                                                                       //
	if (!RocketChat.authz.hasPermission(this.userId, 'view-l-room')) {                                                    // 6
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', { publish: 'livechat:visitorHistory' }));
	}                                                                                                                     // 8
                                                                                                                       //
	var room = RocketChat.models.Rooms.findOneById(roomId);                                                               // 10
                                                                                                                       //
	var user = RocketChat.models.Users.findOneById(this.userId);                                                          // 12
                                                                                                                       //
	if (room.usernames.indexOf(user.username) === -1) {                                                                   // 14
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', { publish: 'livechat:visitorHistory' }));
	}                                                                                                                     // 16
                                                                                                                       //
	if (room && room.v && room.v._id) {                                                                                   // 18
		return RocketChat.models.Rooms.findByVisitorId(room.v._id);                                                          // 19
	} else {                                                                                                              // 20
		return this.ready();                                                                                                 // 21
	}                                                                                                                     // 22
});                                                                                                                    // 23
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"visitorInfo.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/publications/visitorInfo.js                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.publish('livechat:visitorInfo', function (_ref) {                                                               // 1
	var roomId = _ref.rid;                                                                                                // 1
                                                                                                                       //
	if (!this.userId) {                                                                                                   // 2
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', { publish: 'livechat:visitorInfo' }));  // 3
	}                                                                                                                     // 4
                                                                                                                       //
	if (!RocketChat.authz.hasPermission(this.userId, 'view-l-room')) {                                                    // 6
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', { publish: 'livechat:visitorInfo' }));  // 7
	}                                                                                                                     // 8
                                                                                                                       //
	var room = RocketChat.models.Rooms.findOneById(roomId);                                                               // 10
                                                                                                                       //
	if (room && room.v && room.v._id) {                                                                                   // 12
		return RocketChat.models.Users.findById(room.v._id);                                                                 // 13
	} else {                                                                                                              // 14
		return this.ready();                                                                                                 // 15
	}                                                                                                                     // 16
});                                                                                                                    // 17
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"visitorPageVisited.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/publications/visitorPageVisited.js                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.publish('livechat:visitorPageVisited', function (_ref) {                                                        // 1
	var roomId = _ref.rid;                                                                                                // 1
                                                                                                                       //
	if (!this.userId) {                                                                                                   // 2
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', { publish: 'livechat:visitorPageVisited' }));
	}                                                                                                                     // 4
                                                                                                                       //
	if (!RocketChat.authz.hasPermission(this.userId, 'view-l-room')) {                                                    // 6
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', { publish: 'livechat:visitorPageVisited' }));
	}                                                                                                                     // 8
                                                                                                                       //
	var room = RocketChat.models.Rooms.findOneById(roomId);                                                               // 10
                                                                                                                       //
	if (room && room.v && room.v.token) {                                                                                 // 12
		return RocketChat.models.LivechatPageVisited.findByToken(room.v.token);                                              // 13
	} else {                                                                                                              // 14
		return this.ready();                                                                                                 // 15
	}                                                                                                                     // 16
});                                                                                                                    // 17
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"livechatInquiries.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/publications/livechatInquiries.js                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.publish('livechat:inquiry', function () {                                                                       // 1
	if (!this.userId) {                                                                                                   // 2
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', { publish: 'livechat:inquiry' }));      // 3
	}                                                                                                                     // 4
                                                                                                                       //
	if (!RocketChat.authz.hasPermission(this.userId, 'view-l-room')) {                                                    // 6
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', { publish: 'livechat:inquiry' }));      // 7
	}                                                                                                                     // 8
                                                                                                                       //
	return RocketChat.models.LivechatInquiry.find();                                                                      // 11
});                                                                                                                    // 12
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"livechatOfficeHours.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/publications/livechatOfficeHours.js                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.publish('livechat:officeHour', function () {                                                                    // 1
	if (!RocketChat.authz.hasPermission(this.userId, 'view-l-room')) {                                                    // 2
		return this.error(new Meteor.Error('error-not-authorized', 'Not authorized', { publish: 'livechat:agents' }));       // 3
	}                                                                                                                     // 4
                                                                                                                       //
	return RocketChat.models.LivechatOfficeHour.find();                                                                   // 6
});                                                                                                                    // 7
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"api.js":["../imports/server/rest/departments.js","../imports/server/rest/sms.js","../imports/server/rest/users.js",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/server/api.js                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.import('../imports/server/rest/departments.js');module.import('../imports/server/rest/sms.js');module.import('../imports/server/rest/users.js');
                                                                                                                       // 2
                                                                                                                       // 3
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]},"permissions.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/permissions.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.startup(function () {                                                                                           // 1
	var roles = _.pluck(RocketChat.models.Roles.find().fetch(), 'name');                                                  // 2
	if (roles.indexOf('livechat-agent') === -1) {                                                                         // 3
		RocketChat.models.Roles.createOrUpdate('livechat-agent');                                                            // 4
	}                                                                                                                     // 5
	if (roles.indexOf('livechat-manager') === -1) {                                                                       // 6
		RocketChat.models.Roles.createOrUpdate('livechat-manager');                                                          // 7
	}                                                                                                                     // 8
	if (roles.indexOf('livechat-guest') === -1) {                                                                         // 9
		RocketChat.models.Roles.createOrUpdate('livechat-guest');                                                            // 10
	}                                                                                                                     // 11
	if (RocketChat.models && RocketChat.models.Permissions) {                                                             // 12
		RocketChat.models.Permissions.createOrUpdate('view-l-room', ['livechat-agent', 'livechat-manager', 'admin']);        // 13
		RocketChat.models.Permissions.createOrUpdate('view-livechat-manager', ['livechat-manager', 'admin']);                // 14
		RocketChat.models.Permissions.createOrUpdate('view-livechat-rooms', ['livechat-manager', 'admin']);                  // 15
		RocketChat.models.Permissions.createOrUpdate('close-livechat-room', ['livechat-agent', 'livechat-manager', 'admin']);
		RocketChat.models.Permissions.createOrUpdate('close-others-livechat-room', ['livechat-manager', 'admin']);           // 17
	}                                                                                                                     // 18
});                                                                                                                    // 19
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"messageTypes.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/messageTypes.js                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.MessageTypes.registerType({                                                                                 // 1
	id: 'livechat_video_call',                                                                                            // 2
	system: true,                                                                                                         // 3
	message: 'New_videocall_request'                                                                                      // 4
});                                                                                                                    // 1
                                                                                                                       //
RocketChat.actionLinks.register('createLivechatCall', function () /*message, params*/{                                 // 7
	if (Meteor.isClient) {                                                                                                // 8
		RocketChat.TabBar.setTemplate('videoFlexTab');                                                                       // 9
                                                                                                                       //
		// calling openFlex should set the width instead of having to do this.                                               // 11
		$('.flex-tab').css('max-width', '790px');                                                                            // 12
                                                                                                                       //
		RocketChat.TabBar.openFlex();                                                                                        // 14
	}                                                                                                                     // 15
});                                                                                                                    // 16
                                                                                                                       //
RocketChat.actionLinks.register('denyLivechatCall', function (message /*, params*/) {                                  // 18
	if (Meteor.isServer) {                                                                                                // 19
		var user = Meteor.user();                                                                                            // 20
                                                                                                                       //
		RocketChat.models.Messages.createWithTypeRoomIdMessageAndUser('command', message.rid, 'endCall', user);              // 22
		RocketChat.Notifications.notifyRoom(message.rid, 'deleteMessage', { _id: message._id });                             // 23
                                                                                                                       //
		var language = user.language || RocketChat.settings.get('language') || 'en';                                         // 25
                                                                                                                       //
		RocketChat.Livechat.closeRoom({                                                                                      // 27
			user: user,                                                                                                         // 28
			room: RocketChat.models.Rooms.findOneById(message.rid),                                                             // 29
			comment: TAPi18n.__('Videocall_declined', { lng: language })                                                        // 30
		});                                                                                                                  // 27
		Meteor.defer(function () {                                                                                           // 32
			RocketChat.models.Messages.setHiddenById(message._id);                                                              // 33
		});                                                                                                                  // 34
	}                                                                                                                     // 35
});                                                                                                                    // 36
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"roomType.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/roomType.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals openRoom */                                                                                                 // 1
                                                                                                                       //
RocketChat.roomTypes.add('l', 5, {                                                                                     // 3
	template: 'livechat',                                                                                                 // 4
	icon: 'icon-chat-empty',                                                                                              // 5
	route: {                                                                                                              // 6
		name: 'live',                                                                                                        // 7
		path: '/live/:code(\\d+)',                                                                                           // 8
		action: function () {                                                                                                // 9
			function action(params /*, queryParams*/) {                                                                         // 6
				openRoom('l', params.code);                                                                                        // 10
				RocketChat.TabBar.showGroup('livechat', 'search');                                                                 // 11
			}                                                                                                                   // 12
                                                                                                                       //
			return action;                                                                                                      // 6
		}(),                                                                                                                 // 6
		link: function () {                                                                                                  // 13
			function link(sub) {                                                                                                // 6
				return {                                                                                                           // 14
					code: sub.code                                                                                                    // 15
				};                                                                                                                 // 14
			}                                                                                                                   // 17
                                                                                                                       //
			return link;                                                                                                        // 6
		}()                                                                                                                  // 6
	},                                                                                                                    // 6
                                                                                                                       //
	findRoom: function () {                                                                                               // 20
		function findRoom(identifier) {                                                                                      // 3
			return ChatRoom.findOne({ code: parseInt(identifier) });                                                            // 21
		}                                                                                                                    // 22
                                                                                                                       //
		return findRoom;                                                                                                     // 3
	}(),                                                                                                                  // 3
	roomName: function () {                                                                                               // 24
		function roomName(roomData) {                                                                                        // 3
			if (!roomData.name) {                                                                                               // 25
				return roomData.label;                                                                                             // 26
			} else {                                                                                                            // 27
				return roomData.name;                                                                                              // 28
			}                                                                                                                   // 29
		}                                                                                                                    // 30
                                                                                                                       //
		return roomName;                                                                                                     // 3
	}(),                                                                                                                  // 3
	condition: function () {                                                                                              // 32
		function condition() {                                                                                               // 3
			return RocketChat.settings.get('Livechat_enabled') && RocketChat.authz.hasAllPermission('view-l-room');             // 33
		}                                                                                                                    // 34
                                                                                                                       //
		return condition;                                                                                                    // 3
	}(),                                                                                                                  // 3
	canSendMessage: function () {                                                                                         // 36
		function canSendMessage(roomId) {                                                                                    // 3
			var room = ChatRoom.findOne({ _id: roomId }, { fields: { open: 1 } });                                              // 37
			return room && room.open === true;                                                                                  // 38
		}                                                                                                                    // 39
                                                                                                                       //
		return canSendMessage;                                                                                               // 3
	}(),                                                                                                                  // 3
                                                                                                                       //
                                                                                                                       //
	notSubscribedTpl: {                                                                                                   // 41
		template: 'livechatNotSubscribed'                                                                                    // 42
	}                                                                                                                     // 41
});                                                                                                                    // 3
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"config.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/config.js                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.startup(function () {                                                                                           // 1
	RocketChat.settings.addGroup('Livechat');                                                                             // 2
                                                                                                                       //
	RocketChat.settings.add('Livechat_enabled', false, { type: 'boolean', group: 'Livechat', 'public': true });           // 4
                                                                                                                       //
	RocketChat.settings.add('Livechat_title', 'Rocket.Chat', { type: 'string', group: 'Livechat', 'public': true });      // 6
	RocketChat.settings.add('Livechat_title_color', '#C1272D', { type: 'color', group: 'Livechat', 'public': true });     // 7
                                                                                                                       //
	RocketChat.settings.add('Livechat_display_offline_form', true, {                                                      // 9
		type: 'boolean',                                                                                                     // 10
		group: 'Livechat',                                                                                                   // 11
		'public': true,                                                                                                      // 12
		section: 'Offline',                                                                                                  // 13
		i18nLabel: 'Display_offline_form'                                                                                    // 14
	});                                                                                                                   // 9
                                                                                                                       //
	RocketChat.settings.add('Livechat_offline_form_unavailable', '', {                                                    // 17
		type: 'string',                                                                                                      // 18
		group: 'Livechat',                                                                                                   // 19
		'public': true,                                                                                                      // 20
		section: 'Offline',                                                                                                  // 21
		i18nLabel: 'Offline_form_unavailable_message'                                                                        // 22
	});                                                                                                                   // 17
                                                                                                                       //
	RocketChat.settings.add('Livechat_offline_title', 'Leave a message', {                                                // 25
		type: 'string',                                                                                                      // 26
		group: 'Livechat',                                                                                                   // 27
		'public': true,                                                                                                      // 28
		section: 'Offline',                                                                                                  // 29
		i18nLabel: 'Title'                                                                                                   // 30
	});                                                                                                                   // 25
	RocketChat.settings.add('Livechat_offline_title_color', '#666666', {                                                  // 32
		type: 'color',                                                                                                       // 33
		group: 'Livechat',                                                                                                   // 34
		'public': true,                                                                                                      // 35
		section: 'Offline',                                                                                                  // 36
		i18nLabel: 'Color'                                                                                                   // 37
	});                                                                                                                   // 32
	RocketChat.settings.add('Livechat_offline_message', 'We are not online right now. Please leave us a message:', {      // 39
		type: 'string',                                                                                                      // 40
		group: 'Livechat',                                                                                                   // 41
		'public': true,                                                                                                      // 42
		section: 'Offline',                                                                                                  // 43
		i18nLabel: 'Instructions',                                                                                           // 44
		i18nDescription: 'Instructions_to_your_visitor_fill_the_form_to_send_a_message'                                      // 45
	});                                                                                                                   // 39
	RocketChat.settings.add('Livechat_offline_email', '', {                                                               // 47
		type: 'string',                                                                                                      // 48
		group: 'Livechat',                                                                                                   // 49
		i18nLabel: 'Email_address_to_send_offline_messages',                                                                 // 50
		section: 'Offline'                                                                                                   // 51
	});                                                                                                                   // 47
	RocketChat.settings.add('Livechat_offline_success_message', '', {                                                     // 53
		type: 'string',                                                                                                      // 54
		group: 'Livechat',                                                                                                   // 55
		'public': true,                                                                                                      // 56
		section: 'Offline',                                                                                                  // 57
		i18nLabel: 'Offline_success_message'                                                                                 // 58
	});                                                                                                                   // 53
                                                                                                                       //
	RocketChat.settings.add('Livechat_registration_form', true, { type: 'boolean', group: 'Livechat', 'public': true, i18nLabel: 'Show_preregistration_form' });
	RocketChat.settings.add('Livechat_guest_count', 1, { type: 'int', group: 'Livechat' });                               // 62
                                                                                                                       //
	RocketChat.settings.add('Livechat_Room_Count', 1, {                                                                   // 64
		type: 'int',                                                                                                         // 65
		group: 'Livechat',                                                                                                   // 66
		i18nLabel: 'Livechat_room_count'                                                                                     // 67
	});                                                                                                                   // 64
                                                                                                                       //
	RocketChat.settings.add('Livechat_agent_leave_action', 'none', {                                                      // 70
		type: 'select',                                                                                                      // 71
		group: 'Livechat',                                                                                                   // 72
		values: [{ key: 'none', i18nLabel: 'None' }, { key: 'forward', i18nLabel: 'Forward' }, { key: 'close', i18nLabel: 'Close' }],
		i18nLabel: 'How_to_handle_open_sessions_when_agent_goes_offline'                                                     // 78
	});                                                                                                                   // 70
                                                                                                                       //
	RocketChat.settings.add('Livechat_agent_leave_action_timeout', 60, {                                                  // 81
		type: 'int',                                                                                                         // 82
		group: 'Livechat',                                                                                                   // 83
		enableQuery: { _id: 'Livechat_agent_leave_action', value: { $ne: 'none' } },                                         // 84
		i18nLabel: 'How_long_to_wait_after_agent_goes_offline',                                                              // 85
		i18nDescription: 'Time_in_seconds'                                                                                   // 86
	});                                                                                                                   // 81
                                                                                                                       //
	RocketChat.settings.add('Livechat_agent_leave_comment', '', {                                                         // 89
		type: 'string',                                                                                                      // 90
		group: 'Livechat',                                                                                                   // 91
		enableQuery: { _id: 'Livechat_agent_leave_action', value: 'close' },                                                 // 92
		i18nLabel: 'Comment_to_leave_on_closing_session'                                                                     // 93
	});                                                                                                                   // 89
                                                                                                                       //
	RocketChat.settings.add('Livechat_webhookUrl', false, {                                                               // 96
		type: 'string',                                                                                                      // 97
		group: 'Livechat',                                                                                                   // 98
		section: 'CRM Integration',                                                                                          // 99
		i18nLabel: 'Webhook_URL'                                                                                             // 100
	});                                                                                                                   // 96
                                                                                                                       //
	RocketChat.settings.add('Livechat_secret_token', false, {                                                             // 103
		type: 'string',                                                                                                      // 104
		group: 'Livechat',                                                                                                   // 105
		section: 'CRM Integration',                                                                                          // 106
		i18nLabel: 'Secret_token'                                                                                            // 107
	});                                                                                                                   // 103
                                                                                                                       //
	RocketChat.settings.add('Livechat_webhook_on_close', false, {                                                         // 110
		type: 'boolean',                                                                                                     // 111
		group: 'Livechat',                                                                                                   // 112
		section: 'CRM Integration',                                                                                          // 113
		i18nLabel: 'Send_request_on_chat_close'                                                                              // 114
	});                                                                                                                   // 110
                                                                                                                       //
	RocketChat.settings.add('Livechat_webhook_on_offline_msg', false, {                                                   // 117
		type: 'boolean',                                                                                                     // 118
		group: 'Livechat',                                                                                                   // 119
		section: 'CRM Integration',                                                                                          // 120
		i18nLabel: 'Send_request_on_offline_messages'                                                                        // 121
	});                                                                                                                   // 117
                                                                                                                       //
	RocketChat.settings.add('Livechat_Knowledge_Enabled', false, {                                                        // 124
		type: 'boolean',                                                                                                     // 125
		group: 'Livechat',                                                                                                   // 126
		section: 'Knowledge Base',                                                                                           // 127
		'public': true,                                                                                                      // 128
		i18nLabel: 'Enabled'                                                                                                 // 129
	});                                                                                                                   // 124
                                                                                                                       //
	RocketChat.settings.add('Livechat_Knowledge_Apiai_Key', '', {                                                         // 132
		type: 'string',                                                                                                      // 133
		group: 'Livechat',                                                                                                   // 134
		section: 'Knowledge Base',                                                                                           // 135
		'public': true,                                                                                                      // 136
		i18nLabel: 'Apiai_Key'                                                                                               // 137
	});                                                                                                                   // 132
                                                                                                                       //
	RocketChat.settings.add('Livechat_Knowledge_Apiai_Language', 'en', {                                                  // 140
		type: 'string',                                                                                                      // 141
		group: 'Livechat',                                                                                                   // 142
		section: 'Knowledge Base',                                                                                           // 143
		'public': true,                                                                                                      // 144
		i18nLabel: 'Apiai_Language'                                                                                          // 145
	});                                                                                                                   // 140
                                                                                                                       //
	RocketChat.settings.add('Livechat_history_monitor_type', 'url', {                                                     // 148
		type: 'select',                                                                                                      // 149
		group: 'Livechat',                                                                                                   // 150
		i18nLabel: 'Monitor_history_for_changes_on',                                                                         // 151
		values: [{ key: 'url', i18nLabel: 'Page_URL' }, { key: 'title', i18nLabel: 'Page_title' }]                           // 152
	});                                                                                                                   // 148
                                                                                                                       //
	RocketChat.settings.add('Livechat_Routing_Method', 'Least_Amount', {                                                  // 158
		type: 'select',                                                                                                      // 159
		group: 'Livechat',                                                                                                   // 160
		'public': true,                                                                                                      // 161
		values: [{ key: 'Least_Amount', i18nLabel: 'Least_Amount' }, { key: 'Guest_Pool', i18nLabel: 'Guest_Pool' }]         // 162
	});                                                                                                                   // 158
                                                                                                                       //
	RocketChat.settings.add('Livechat_guest_pool_with_no_agents', false, {                                                // 168
		type: 'boolean',                                                                                                     // 169
		group: 'Livechat',                                                                                                   // 170
		i18nLabel: 'Accept_with_no_online_agents',                                                                           // 171
		i18nDescription: 'Accept_incoming_livechat_requests_even_if_there_are_no_online_agents',                             // 172
		enableQuery: { _id: 'Livechat_Routing_Method', value: 'Guest_Pool' }                                                 // 173
	});                                                                                                                   // 168
                                                                                                                       //
	RocketChat.settings.add('Livechat_show_queue_list_link', false, {                                                     // 176
		type: 'boolean',                                                                                                     // 177
		group: 'Livechat',                                                                                                   // 178
		'public': true,                                                                                                      // 179
		i18nLabel: 'Show_queue_list_to_all_agents'                                                                           // 180
	});                                                                                                                   // 176
                                                                                                                       //
	RocketChat.settings.add('Livechat_enable_office_hours', false, {                                                      // 183
		type: 'boolean',                                                                                                     // 184
		group: 'Livechat',                                                                                                   // 185
		'public': true,                                                                                                      // 186
		i18nLabel: 'Office_Hours_Enabled'                                                                                    // 187
	});                                                                                                                   // 183
                                                                                                                       //
	RocketChat.settings.add('Livechat_videocall_enabled', false, {                                                        // 190
		type: 'boolean',                                                                                                     // 191
		group: 'Livechat',                                                                                                   // 192
		'public': true,                                                                                                      // 193
		i18nLabel: 'Videocall_enabled',                                                                                      // 194
		i18nDescription: 'Beta_feature_Depends_on_Video_Conference_to_be_enabled',                                           // 195
		enableQuery: { _id: 'Jitsi_Enabled', value: true }                                                                   // 196
	});                                                                                                                   // 190
                                                                                                                       //
	RocketChat.settings.add('Livechat_enable_transcript', false, {                                                        // 199
		type: 'boolean',                                                                                                     // 200
		group: 'Livechat',                                                                                                   // 201
		'public': true,                                                                                                      // 202
		i18nLabel: 'Transcript_Enabled'                                                                                      // 203
	});                                                                                                                   // 199
                                                                                                                       //
	RocketChat.settings.add('Livechat_transcript_message', 'Would you like a copy of this chat emailed?', {               // 206
		type: 'string',                                                                                                      // 207
		group: 'Livechat',                                                                                                   // 208
		'public': true,                                                                                                      // 209
		i18nLabel: 'Transcript_message',                                                                                     // 210
		enableQuery: { _id: 'Livechat_enable_transcript', value: true }                                                      // 211
	});                                                                                                                   // 206
});                                                                                                                    // 214
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"client":{"stylesheets":{"load.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/client/stylesheets/load.js                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.theme.addPackageAsset(function () {                                                                         // 1
	return Assets.getText('client/stylesheets/livechat.less');                                                            // 2
});                                                                                                                    // 3
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"imports":{"server":{"rest":{"departments.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/imports/server/rest/departments.js                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.API.v1.addRoute('livechat/department', { authRequired: true }, {                                            // 1
	get: function () {                                                                                                    // 2
		function get() {                                                                                                     // 1
			if (!RocketChat.authz.hasPermission(this.userId, 'view-livechat-manager')) {                                        // 3
				return RocketChat.API.v1.unauthorized();                                                                           // 4
			}                                                                                                                   // 5
                                                                                                                       //
			return RocketChat.API.v1.success({                                                                                  // 7
				departments: RocketChat.models.LivechatDepartment.find().fetch()                                                   // 8
			});                                                                                                                 // 7
		}                                                                                                                    // 10
                                                                                                                       //
		return get;                                                                                                          // 1
	}(),                                                                                                                  // 1
	post: function () {                                                                                                   // 11
		function post() {                                                                                                    // 1
			if (!RocketChat.authz.hasPermission(this.userId, 'view-livechat-manager')) {                                        // 12
				return RocketChat.API.v1.unauthorized();                                                                           // 13
			}                                                                                                                   // 14
                                                                                                                       //
			try {                                                                                                               // 16
				check(this.bodyParams, {                                                                                           // 17
					department: Object,                                                                                               // 18
					agents: Array                                                                                                     // 19
				});                                                                                                                // 17
                                                                                                                       //
				var department = RocketChat.Livechat.saveDepartment(null, this.bodyParams.department, this.bodyParams.agents);     // 22
                                                                                                                       //
				if (department) {                                                                                                  // 24
					return RocketChat.API.v1.success({                                                                                // 25
						department: department,                                                                                          // 26
						agents: RocketChat.models.LivechatDepartmentAgents.find({ departmentId: department._id }).fetch()                // 27
					});                                                                                                               // 25
				}                                                                                                                  // 29
                                                                                                                       //
				RocketChat.API.v1.failure();                                                                                       // 31
			} catch (e) {                                                                                                       // 32
				return RocketChat.API.v1.failure(e);                                                                               // 33
			}                                                                                                                   // 34
		}                                                                                                                    // 35
                                                                                                                       //
		return post;                                                                                                         // 1
	}()                                                                                                                   // 1
});                                                                                                                    // 1
                                                                                                                       //
RocketChat.API.v1.addRoute('livechat/department/:_id', { authRequired: true }, {                                       // 38
	get: function () {                                                                                                    // 39
		function get() {                                                                                                     // 38
			if (!RocketChat.authz.hasPermission(this.userId, 'view-livechat-manager')) {                                        // 40
				return RocketChat.API.v1.unauthorized();                                                                           // 41
			}                                                                                                                   // 42
                                                                                                                       //
			try {                                                                                                               // 44
				check(this.urlParams, {                                                                                            // 45
					_id: String                                                                                                       // 46
				});                                                                                                                // 45
                                                                                                                       //
				return RocketChat.API.v1.success({                                                                                 // 49
					department: RocketChat.models.LivechatDepartment.findOneById(this.urlParams._id),                                 // 50
					agents: RocketChat.models.LivechatDepartmentAgents.find({ departmentId: this.urlParams._id }).fetch()             // 51
				});                                                                                                                // 49
			} catch (e) {                                                                                                       // 53
				return RocketChat.API.v1.failure(e.error);                                                                         // 54
			}                                                                                                                   // 55
		}                                                                                                                    // 56
                                                                                                                       //
		return get;                                                                                                          // 38
	}(),                                                                                                                  // 38
	put: function () {                                                                                                    // 57
		function put() {                                                                                                     // 38
			if (!RocketChat.authz.hasPermission(this.userId, 'view-livechat-manager')) {                                        // 58
				return RocketChat.API.v1.unauthorized();                                                                           // 59
			}                                                                                                                   // 60
                                                                                                                       //
			try {                                                                                                               // 62
				check(this.urlParams, {                                                                                            // 63
					_id: String                                                                                                       // 64
				});                                                                                                                // 63
                                                                                                                       //
				check(this.bodyParams, {                                                                                           // 67
					department: Object,                                                                                               // 68
					agents: Array                                                                                                     // 69
				});                                                                                                                // 67
                                                                                                                       //
				if (RocketChat.Livechat.saveDepartment(this.urlParams._id, this.bodyParams.department, this.bodyParams.agents)) {  // 72
					return RocketChat.API.v1.success({                                                                                // 73
						department: RocketChat.models.LivechatDepartment.findOneById(this.urlParams._id),                                // 74
						agents: RocketChat.models.LivechatDepartmentAgents.find({ departmentId: this.urlParams._id }).fetch()            // 75
					});                                                                                                               // 73
				}                                                                                                                  // 77
                                                                                                                       //
				return RocketChat.API.v1.failure();                                                                                // 79
			} catch (e) {                                                                                                       // 80
				return RocketChat.API.v1.failure(e.error);                                                                         // 81
			}                                                                                                                   // 82
		}                                                                                                                    // 83
                                                                                                                       //
		return put;                                                                                                          // 38
	}(),                                                                                                                  // 38
	'delete': function () {                                                                                               // 38
		function _delete() {                                                                                                 // 38
			if (!RocketChat.authz.hasPermission(this.userId, 'view-livechat-manager')) {                                        // 85
				return RocketChat.API.v1.unauthorized();                                                                           // 86
			}                                                                                                                   // 87
                                                                                                                       //
			try {                                                                                                               // 89
				check(this.urlParams, {                                                                                            // 90
					_id: String                                                                                                       // 91
				});                                                                                                                // 90
                                                                                                                       //
				if (RocketChat.Livechat.removeDepartment(this.urlParams._id)) {                                                    // 94
					return RocketChat.API.v1.success();                                                                               // 95
				}                                                                                                                  // 96
                                                                                                                       //
				return RocketChat.API.v1.failure();                                                                                // 98
			} catch (e) {                                                                                                       // 99
				return RocketChat.API.v1.failure(e.error);                                                                         // 100
			}                                                                                                                   // 101
		}                                                                                                                    // 102
                                                                                                                       //
		return _delete;                                                                                                      // 38
	}()                                                                                                                   // 38
});                                                                                                                    // 38
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"sms.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/imports/server/rest/sms.js                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.API.v1.addRoute('livechat/sms-incoming/:service', {                                                         // 1
	post: function () {                                                                                                   // 2
		function post() {                                                                                                    // 1
			var SMSService = RocketChat.SMS.getService(this.urlParams.service);                                                 // 3
                                                                                                                       //
			var sms = SMSService.parse(this.bodyParams);                                                                        // 5
                                                                                                                       //
			var visitor = RocketChat.models.Users.findOneVisitorByPhone(sms.from);                                              // 7
                                                                                                                       //
			var sendMessage = {                                                                                                 // 9
				message: {                                                                                                         // 10
					_id: Random.id()                                                                                                  // 11
				},                                                                                                                 // 10
				roomInfo: {                                                                                                        // 13
					sms: {                                                                                                            // 14
						from: sms.to                                                                                                     // 15
					}                                                                                                                 // 14
				}                                                                                                                  // 13
			};                                                                                                                  // 9
                                                                                                                       //
			if (visitor) {                                                                                                      // 20
				var rooms = RocketChat.models.Rooms.findOpenByVisitorToken(visitor.profile.token).fetch();                         // 21
                                                                                                                       //
				if (rooms && rooms.length > 0) {                                                                                   // 23
					sendMessage.message.rid = rooms[0]._id;                                                                           // 24
				} else {                                                                                                           // 25
					sendMessage.message.rid = Random.id();                                                                            // 26
				}                                                                                                                  // 27
				sendMessage.message.token = visitor.profile.token;                                                                 // 28
			} else {                                                                                                            // 29
				sendMessage.message.rid = Random.id();                                                                             // 30
				sendMessage.message.token = Random.id();                                                                           // 31
                                                                                                                       //
				var userId = RocketChat.Livechat.registerGuest({                                                                   // 33
					username: sms.from.replace(/[^0-9]/g, ''),                                                                        // 34
					token: sendMessage.message.token,                                                                                 // 35
					phone: {                                                                                                          // 36
						number: sms.from                                                                                                 // 37
					}                                                                                                                 // 36
				});                                                                                                                // 33
                                                                                                                       //
				visitor = RocketChat.models.Users.findOneById(userId);                                                             // 41
			}                                                                                                                   // 42
                                                                                                                       //
			sendMessage.message.msg = sms.body;                                                                                 // 44
			sendMessage.guest = visitor;                                                                                        // 45
                                                                                                                       //
			try {                                                                                                               // 47
				var message = SMSService.response.call(this, RocketChat.Livechat.sendMessage(sendMessage));                        // 48
                                                                                                                       //
				Meteor.defer(function () {                                                                                         // 50
					if (sms.extra) {                                                                                                  // 51
						if (sms.extra.fromCountry) {                                                                                     // 52
							Meteor.call('livechat:setCustomField', sendMessage.message.token, 'country', sms.extra.fromCountry);            // 53
						}                                                                                                                // 54
						if (sms.extra.fromState) {                                                                                       // 55
							Meteor.call('livechat:setCustomField', sendMessage.message.token, 'state', sms.extra.fromState);                // 56
						}                                                                                                                // 57
						if (sms.extra.fromCity) {                                                                                        // 58
							Meteor.call('livechat:setCustomField', sendMessage.message.token, 'city', sms.extra.fromCity);                  // 59
						}                                                                                                                // 60
					}                                                                                                                 // 61
				});                                                                                                                // 62
                                                                                                                       //
				return message;                                                                                                    // 64
			} catch (e) {                                                                                                       // 65
				return SMSService.error.call(this, e);                                                                             // 66
			}                                                                                                                   // 67
		}                                                                                                                    // 68
                                                                                                                       //
		return post;                                                                                                         // 1
	}()                                                                                                                   // 1
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"users.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_livechat/imports/server/rest/users.js                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.API.v1.addRoute('livechat/users/:type', { authRequired: true }, {                                           // 1
	get: function () {                                                                                                    // 2
		function get() {                                                                                                     // 1
			if (!RocketChat.authz.hasPermission(this.userId, 'view-livechat-manager')) {                                        // 3
				return RocketChat.API.v1.unauthorized();                                                                           // 4
			}                                                                                                                   // 5
                                                                                                                       //
			try {                                                                                                               // 7
				check(this.urlParams, {                                                                                            // 8
					type: String                                                                                                      // 9
				});                                                                                                                // 8
                                                                                                                       //
				var role = void 0;                                                                                                 // 12
				if (this.urlParams.type === 'agent') {                                                                             // 13
					role = 'livechat-agent';                                                                                          // 14
				} else if (this.urlParams.type === 'manager') {                                                                    // 15
					role = 'livechat-manager';                                                                                        // 16
				} else {                                                                                                           // 17
					throw 'Invalid type';                                                                                             // 18
				}                                                                                                                  // 19
                                                                                                                       //
				var users = RocketChat.authz.getUsersInRole(role);                                                                 // 21
                                                                                                                       //
				return RocketChat.API.v1.success({                                                                                 // 23
					users: users.fetch().map(function (user) {                                                                        // 24
						return { _id: user._id, username: user.username };                                                               // 24
					})                                                                                                                // 24
				});                                                                                                                // 23
			} catch (e) {                                                                                                       // 26
				return RocketChat.API.v1.failure(e.error);                                                                         // 27
			}                                                                                                                   // 28
		}                                                                                                                    // 29
                                                                                                                       //
		return get;                                                                                                          // 1
	}(),                                                                                                                  // 1
	post: function () {                                                                                                   // 30
		function post() {                                                                                                    // 1
			if (!RocketChat.authz.hasPermission(this.userId, 'view-livechat-manager')) {                                        // 31
				return RocketChat.API.v1.unauthorized();                                                                           // 32
			}                                                                                                                   // 33
			try {                                                                                                               // 34
				check(this.urlParams, {                                                                                            // 35
					type: String                                                                                                      // 36
				});                                                                                                                // 35
                                                                                                                       //
				check(this.bodyParams, {                                                                                           // 39
					username: String                                                                                                  // 40
				});                                                                                                                // 39
                                                                                                                       //
				if (this.urlParams.type === 'agent') {                                                                             // 43
					var user = RocketChat.Livechat.addAgent(this.bodyParams.username);                                                // 44
					if (user) {                                                                                                       // 45
						return RocketChat.API.v1.success({ user: user });                                                                // 46
					}                                                                                                                 // 47
				} else if (this.urlParams.type === 'manager') {                                                                    // 48
					var _user = RocketChat.Livechat.addManager(this.bodyParams.username);                                             // 49
					if (_user) {                                                                                                      // 50
						return RocketChat.API.v1.success({ user: _user });                                                               // 51
					}                                                                                                                 // 52
				} else {                                                                                                           // 53
					throw 'Invalid type';                                                                                             // 54
				}                                                                                                                  // 55
                                                                                                                       //
				return RocketChat.API.v1.failure();                                                                                // 57
			} catch (e) {                                                                                                       // 58
				return RocketChat.API.v1.failure(e.error);                                                                         // 59
			}                                                                                                                   // 60
		}                                                                                                                    // 61
                                                                                                                       //
		return post;                                                                                                         // 1
	}()                                                                                                                   // 1
});                                                                                                                    // 1
                                                                                                                       //
RocketChat.API.v1.addRoute('livechat/users/:type/:_id', { authRequired: true }, {                                      // 64
	get: function () {                                                                                                    // 65
		function get() {                                                                                                     // 64
			if (!RocketChat.authz.hasPermission(this.userId, 'view-livechat-manager')) {                                        // 66
				return RocketChat.API.v1.unauthorized();                                                                           // 67
			}                                                                                                                   // 68
                                                                                                                       //
			try {                                                                                                               // 70
				check(this.urlParams, {                                                                                            // 71
					type: String,                                                                                                     // 72
					_id: String                                                                                                       // 73
				});                                                                                                                // 71
                                                                                                                       //
				var user = RocketChat.models.Users.findOneById(this.urlParams._id);                                                // 76
                                                                                                                       //
				if (!user) {                                                                                                       // 78
					return RocketChat.API.v1.failure('User not found');                                                               // 79
				}                                                                                                                  // 80
                                                                                                                       //
				var role = void 0;                                                                                                 // 82
                                                                                                                       //
				if (this.urlParams.type === 'agent') {                                                                             // 84
					role = 'livechat-agent';                                                                                          // 85
				} else if (this.urlParams.type === 'manager') {                                                                    // 86
					role = 'livechat-manager';                                                                                        // 87
				} else {                                                                                                           // 88
					throw 'Invalid type';                                                                                             // 89
				}                                                                                                                  // 90
                                                                                                                       //
				if (user.roles.indexOf(role) !== -1) {                                                                             // 92
					return RocketChat.API.v1.success({                                                                                // 93
						user: _.pick(user, '_id', 'username')                                                                            // 94
					});                                                                                                               // 93
				}                                                                                                                  // 96
                                                                                                                       //
				return RocketChat.API.v1.success({                                                                                 // 98
					user: null                                                                                                        // 99
				});                                                                                                                // 98
			} catch (e) {                                                                                                       // 101
				return RocketChat.API.v1.failure(e.error);                                                                         // 102
			}                                                                                                                   // 103
		}                                                                                                                    // 104
                                                                                                                       //
		return get;                                                                                                          // 64
	}(),                                                                                                                  // 64
	'delete': function () {                                                                                               // 64
		function _delete() {                                                                                                 // 64
			if (!RocketChat.authz.hasPermission(this.userId, 'view-livechat-manager')) {                                        // 106
				return RocketChat.API.v1.unauthorized();                                                                           // 107
			}                                                                                                                   // 108
                                                                                                                       //
			try {                                                                                                               // 110
				check(this.urlParams, {                                                                                            // 111
					type: String,                                                                                                     // 112
					_id: String                                                                                                       // 113
				});                                                                                                                // 111
                                                                                                                       //
				var user = RocketChat.models.Users.findOneById(this.urlParams._id);                                                // 116
                                                                                                                       //
				if (!user) {                                                                                                       // 118
					return RocketChat.API.v1.failure();                                                                               // 119
				}                                                                                                                  // 120
                                                                                                                       //
				if (this.urlParams.type === 'agent') {                                                                             // 122
					if (RocketChat.Livechat.removeAgent(user.username)) {                                                             // 123
						return RocketChat.API.v1.success();                                                                              // 124
					}                                                                                                                 // 125
				} else if (this.urlParams.type === 'manager') {                                                                    // 126
					if (RocketChat.Livechat.removeManager(user.username)) {                                                           // 127
						return RocketChat.API.v1.success();                                                                              // 128
					}                                                                                                                 // 129
				} else {                                                                                                           // 130
					throw 'Invalid type';                                                                                             // 131
				}                                                                                                                  // 132
                                                                                                                       //
				return RocketChat.API.v1.failure();                                                                                // 134
			} catch (e) {                                                                                                       // 135
				return RocketChat.API.v1.failure(e.error);                                                                         // 136
			}                                                                                                                   // 137
		}                                                                                                                    // 138
                                                                                                                       //
		return _delete;                                                                                                      // 64
	}()                                                                                                                   // 64
});                                                                                                                    // 64
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"node_modules":{"ua-parser-js":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// .npm/package/node_modules/ua-parser-js/package.json                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
exports.name = "ua-parser-js";
exports.version = "0.7.10";
exports.main = "src/ua-parser.js";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"src":{"ua-parser.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/rocketchat:livechat/node_modules/ua-parser-js/src/ua-parser.js                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**
 * UAParser.js v0.7.10
 * Lightweight JavaScript-based User-Agent string parser
 * https://github.com/faisalman/ua-parser-js
 *
 * Copyright © 2012-2015 Faisal Salman <fyzlman@gmail.com>
 * Dual licensed under GPLv2 & MIT
 */

(function (window, undefined) {

    'use strict';

    //////////////
    // Constants
    /////////////


    var LIBVERSION  = '0.7.10',
        EMPTY       = '',
        UNKNOWN     = '?',
        FUNC_TYPE   = 'function',
        UNDEF_TYPE  = 'undefined',
        OBJ_TYPE    = 'object',
        STR_TYPE    = 'string',
        MAJOR       = 'major', // deprecated
        MODEL       = 'model',
        NAME        = 'name',
        TYPE        = 'type',
        VENDOR      = 'vendor',
        VERSION     = 'version',
        ARCHITECTURE= 'architecture',
        CONSOLE     = 'console',
        MOBILE      = 'mobile',
        TABLET      = 'tablet',
        SMARTTV     = 'smarttv',
        WEARABLE    = 'wearable',
        EMBEDDED    = 'embedded';


    ///////////
    // Helper
    //////////


    var util = {
        extend : function (regexes, extensions) {
            for (var i in extensions) {
                if ("browser cpu device engine os".indexOf(i) !== -1 && extensions[i].length % 2 === 0) {
                    regexes[i] = extensions[i].concat(regexes[i]);
                }
            }
            return regexes;
        },
        has : function (str1, str2) {
          if (typeof str1 === "string") {
            return str2.toLowerCase().indexOf(str1.toLowerCase()) !== -1;
          } else {
            return false;
          }
        },
        lowerize : function (str) {
            return str.toLowerCase();
        },
        major : function (version) {
            return typeof(version) === STR_TYPE ? version.split(".")[0] : undefined;
        }
    };


    ///////////////
    // Map helper
    //////////////


    var mapper = {

        rgx : function () {

            var result, i = 0, j, k, p, q, matches, match, args = arguments;

            // loop through all regexes maps
            while (i < args.length && !matches) {

                var regex = args[i],       // even sequence (0,2,4,..)
                    props = args[i + 1];   // odd sequence (1,3,5,..)

                // construct object barebones
                if (typeof result === UNDEF_TYPE) {
                    result = {};
                    for (p in props) {
                        if (props.hasOwnProperty(p)){
                            q = props[p];
                            if (typeof q === OBJ_TYPE) {
                                result[q[0]] = undefined;
                            } else {
                                result[q] = undefined;
                            }
                        }
                    }
                }

                // try matching uastring with regexes
                j = k = 0;
                while (j < regex.length && !matches) {
                    matches = regex[j++].exec(this.getUA());
                    if (!!matches) {
                        for (p = 0; p < props.length; p++) {
                            match = matches[++k];
                            q = props[p];
                            // check if given property is actually array
                            if (typeof q === OBJ_TYPE && q.length > 0) {
                                if (q.length == 2) {
                                    if (typeof q[1] == FUNC_TYPE) {
                                        // assign modified match
                                        result[q[0]] = q[1].call(this, match);
                                    } else {
                                        // assign given value, ignore regex match
                                        result[q[0]] = q[1];
                                    }
                                } else if (q.length == 3) {
                                    // check whether function or regex
                                    if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {
                                        // call function (usually string mapper)
                                        result[q[0]] = match ? q[1].call(this, match, q[2]) : undefined;
                                    } else {
                                        // sanitize match using given regex
                                        result[q[0]] = match ? match.replace(q[1], q[2]) : undefined;
                                    }
                                } else if (q.length == 4) {
                                        result[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined;
                                }
                            } else {
                                result[q] = match ? match : undefined;
                            }
                        }
                    }
                }
                i += 2;
            }
            return result;
        },

        str : function (str, map) {

            for (var i in map) {
                // check if array
                if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
                    for (var j = 0; j < map[i].length; j++) {
                        if (util.has(map[i][j], str)) {
                            return (i === UNKNOWN) ? undefined : i;
                        }
                    }
                } else if (util.has(map[i], str)) {
                    return (i === UNKNOWN) ? undefined : i;
                }
            }
            return str;
        }
    };


    ///////////////
    // String map
    //////////////


    var maps = {

        browser : {
            oldsafari : {
                version : {
                    '1.0'   : '/8',
                    '1.2'   : '/1',
                    '1.3'   : '/3',
                    '2.0'   : '/412',
                    '2.0.2' : '/416',
                    '2.0.3' : '/417',
                    '2.0.4' : '/419',
                    '?'     : '/'
                }
            }
        },

        device : {
            amazon : {
                model : {
                    'Fire Phone' : ['SD', 'KF']
                }
            },
            sprint : {
                model : {
                    'Evo Shift 4G' : '7373KT'
                },
                vendor : {
                    'HTC'       : 'APA',
                    'Sprint'    : 'Sprint'
                }
            }
        },

        os : {
            windows : {
                version : {
                    'ME'        : '4.90',
                    'NT 3.11'   : 'NT3.51',
                    'NT 4.0'    : 'NT4.0',
                    '2000'      : 'NT 5.0',
                    'XP'        : ['NT 5.1', 'NT 5.2'],
                    'Vista'     : 'NT 6.0',
                    '7'         : 'NT 6.1',
                    '8'         : 'NT 6.2',
                    '8.1'       : 'NT 6.3',
                    '10'        : ['NT 6.4', 'NT 10.0'],
                    'RT'        : 'ARM'
                }
            }
        }
    };


    //////////////
    // Regex map
    /////////////


    var regexes = {

        browser : [[

            // Presto based
            /(opera\smini)\/([\w\.-]+)/i,                                       // Opera Mini
            /(opera\s[mobiletab]+).+version\/([\w\.-]+)/i,                      // Opera Mobi/Tablet
            /(opera).+version\/([\w\.]+)/i,                                     // Opera > 9.80
            /(opera)[\/\s]+([\w\.]+)/i                                          // Opera < 9.80

            ], [NAME, VERSION], [

            /\s(opr)\/([\w\.]+)/i                                               // Opera Webkit
            ], [[NAME, 'Opera'], VERSION], [

            // Mixed
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]+)*/i,
                                                                                // Lunascape/Maxthon/Netfront/Jasmine/Blazer

            // Trident based
            /(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i,
                                                                                // Avant/IEMobile/SlimBrowser/Baidu
            /(?:ms|\()(ie)\s([\w\.]+)/i,                                        // Internet Explorer

            // Webkit/KHTML based
            /(rekonq)\/([\w\.]+)*/i,                                            // Rekonq
            /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs)\/([\w\.-]+)/i
                                                                                // Chromium/Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS
            ], [NAME, VERSION], [

            /(trident).+rv[:\s]([\w\.]+).+like\sgecko/i                         // IE11
            ], [[NAME, 'IE'], VERSION], [

            /(edge)\/((\d+)?[\w\.]+)/i                                          // Microsoft Edge
            ], [NAME, VERSION], [

            /(yabrowser)\/([\w\.]+)/i                                           // Yandex
            ], [[NAME, 'Yandex'], VERSION], [

            /(comodo_dragon)\/([\w\.]+)/i                                       // Comodo Dragon
            ], [[NAME, /_/g, ' '], VERSION], [

            /(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i,
                                                                                // Chrome/OmniWeb/Arora/Tizen/Nokia
            /(qqbrowser)[\/\s]?([\w\.]+)/i
                                                                                // QQBrowser
            ], [NAME, VERSION], [

            /(uc\s?browser)[\/\s]?([\w\.]+)/i,
            /ucweb.+(ucbrowser)[\/\s]?([\w\.]+)/i,
            /JUC.+(ucweb)[\/\s]?([\w\.]+)/i
                                                                                // UCBrowser
            ], [[NAME, 'UCBrowser'], VERSION], [

            /(dolfin)\/([\w\.]+)/i                                              // Dolphin
            ], [[NAME, 'Dolphin'], VERSION], [

            /((?:android.+)crmo|crios)\/([\w\.]+)/i                             // Chrome for Android/iOS
            ], [[NAME, 'Chrome'], VERSION], [

            /XiaoMi\/MiuiBrowser\/([\w\.]+)/i                                   // MIUI Browser
            ], [VERSION, [NAME, 'MIUI Browser']], [

            /android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)/i         // Android Browser
            ], [VERSION, [NAME, 'Android Browser']], [

            /FBAV\/([\w\.]+);/i                                                 // Facebook App for iOS
            ], [VERSION, [NAME, 'Facebook']], [

            /fxios\/([\w\.-]+)/i                                                // Firefox for iOS
            ], [VERSION, [NAME, 'Firefox']], [

            /version\/([\w\.]+).+?mobile\/\w+\s(safari)/i                       // Mobile Safari
            ], [VERSION, [NAME, 'Mobile Safari']], [

            /version\/([\w\.]+).+?(mobile\s?safari|safari)/i                    // Safari & Safari Mobile
            ], [VERSION, NAME], [

            /webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i                     // Safari < 3.0
            ], [NAME, [VERSION, mapper.str, maps.browser.oldsafari.version]], [

            /(konqueror)\/([\w\.]+)/i,                                          // Konqueror
            /(webkit|khtml)\/([\w\.]+)/i
            ], [NAME, VERSION], [

            // Gecko based
            /(navigator|netscape)\/([\w\.-]+)/i                                 // Netscape
            ], [[NAME, 'Netscape'], VERSION], [
            /(swiftfox)/i,                                                      // Swiftfox
            /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,
                                                                                // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror
            /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix)\/([\w\.-]+)/i,
                                                                                // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
            /(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i,                          // Mozilla

            // Other
            /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i,
                                                                                // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Sleipnir
            /(links)\s\(([\w\.]+)/i,                                            // Links
            /(gobrowser)\/?([\w\.]+)*/i,                                        // GoBrowser
            /(ice\s?browser)\/v?([\w\._]+)/i,                                   // ICE Browser
            /(mosaic)[\/\s]([\w\.]+)/i                                          // Mosaic
            ], [NAME, VERSION]

            /* /////////////////////
            // Media players BEGIN
            ////////////////////////

            , [

            /(apple(?:coremedia|))\/((\d+)[\w\._]+)/i,                          // Generic Apple CoreMedia
            /(coremedia) v((\d+)[\w\._]+)/i
            ], [NAME, VERSION], [

            /(aqualung|lyssna|bsplayer)\/((\d+)?[\w\.-]+)/i                     // Aqualung/Lyssna/BSPlayer
            ], [NAME, VERSION], [

            /(ares|ossproxy)\s((\d+)[\w\.-]+)/i                                 // Ares/OSSProxy
            ], [NAME, VERSION], [

            /(audacious|audimusicstream|amarok|bass|core|dalvik|gnomemplayer|music on console|nsplayer|psp-internetradioplayer|videos)\/((\d+)[\w\.-]+)/i,
                                                                                // Audacious/AudiMusicStream/Amarok/BASS/OpenCORE/Dalvik/GnomeMplayer/MoC
                                                                                // NSPlayer/PSP-InternetRadioPlayer/Videos
            /(clementine|music player daemon)\s((\d+)[\w\.-]+)/i,               // Clementine/MPD
            /(lg player|nexplayer)\s((\d+)[\d\.]+)/i,
            /player\/(nexplayer|lg player)\s((\d+)[\w\.-]+)/i                   // NexPlayer/LG Player
            ], [NAME, VERSION], [
            /(nexplayer)\s((\d+)[\w\.-]+)/i                                     // Nexplayer
            ], [NAME, VERSION], [

            /(flrp)\/((\d+)[\w\.-]+)/i                                          // Flip Player
            ], [[NAME, 'Flip Player'], VERSION], [

            /(fstream|nativehost|queryseekspider|ia-archiver|facebookexternalhit)/i
                                                                                // FStream/NativeHost/QuerySeekSpider/IA Archiver/facebookexternalhit
            ], [NAME], [

            /(gstreamer) souphttpsrc (?:\([^\)]+\)){0,1} libsoup\/((\d+)[\w\.-]+)/i
                                                                                // Gstreamer
            ], [NAME, VERSION], [

            /(htc streaming player)\s[\w_]+\s\/\s((\d+)[\d\.]+)/i,              // HTC Streaming Player
            /(java|python-urllib|python-requests|wget|libcurl)\/((\d+)[\w\.-_]+)/i,
                                                                                // Java/urllib/requests/wget/cURL
            /(lavf)((\d+)[\d\.]+)/i                                             // Lavf (FFMPEG)
            ], [NAME, VERSION], [

            /(htc_one_s)\/((\d+)[\d\.]+)/i                                      // HTC One S
            ], [[NAME, /_/g, ' '], VERSION], [

            /(mplayer)(?:\s|\/)(?:(?:sherpya-){0,1}svn)(?:-|\s)(r\d+(?:-\d+[\w\.-]+){0,1})/i
                                                                                // MPlayer SVN
            ], [NAME, VERSION], [

            /(mplayer)(?:\s|\/|[unkow-]+)((\d+)[\w\.-]+)/i                      // MPlayer
            ], [NAME, VERSION], [

            /(mplayer)/i,                                                       // MPlayer (no other info)
            /(yourmuze)/i,                                                      // YourMuze
            /(media player classic|nero showtime)/i                             // Media Player Classic/Nero ShowTime
            ], [NAME], [

            /(nero (?:home|scout))\/((\d+)[\w\.-]+)/i                           // Nero Home/Nero Scout
            ], [NAME, VERSION], [

            /(nokia\d+)\/((\d+)[\w\.-]+)/i                                      // Nokia
            ], [NAME, VERSION], [

            /\s(songbird)\/((\d+)[\w\.-]+)/i                                    // Songbird/Philips-Songbird
            ], [NAME, VERSION], [

            /(winamp)3 version ((\d+)[\w\.-]+)/i,                               // Winamp
            /(winamp)\s((\d+)[\w\.-]+)/i,
            /(winamp)mpeg\/((\d+)[\w\.-]+)/i
            ], [NAME, VERSION], [

            /(ocms-bot|tapinradio|tunein radio|unknown|winamp|inlight radio)/i  // OCMS-bot/tap in radio/tunein/unknown/winamp (no other info)
                                                                                // inlight radio
            ], [NAME], [

            /(quicktime|rma|radioapp|radioclientapplication|soundtap|totem|stagefright|streamium)\/((\d+)[\w\.-]+)/i
                                                                                // QuickTime/RealMedia/RadioApp/RadioClientApplication/
                                                                                // SoundTap/Totem/Stagefright/Streamium
            ], [NAME, VERSION], [

            /(smp)((\d+)[\d\.]+)/i                                              // SMP
            ], [NAME, VERSION], [

            /(vlc) media player - version ((\d+)[\w\.]+)/i,                     // VLC Videolan
            /(vlc)\/((\d+)[\w\.-]+)/i,
            /(xbmc|gvfs|xine|xmms|irapp)\/((\d+)[\w\.-]+)/i,                    // XBMC/gvfs/Xine/XMMS/irapp
            /(foobar2000)\/((\d+)[\d\.]+)/i,                                    // Foobar2000
            /(itunes)\/((\d+)[\d\.]+)/i                                         // iTunes
            ], [NAME, VERSION], [

            /(wmplayer)\/((\d+)[\w\.-]+)/i,                                     // Windows Media Player
            /(windows-media-player)\/((\d+)[\w\.-]+)/i
            ], [[NAME, /-/g, ' '], VERSION], [

            /windows\/((\d+)[\w\.-]+) upnp\/[\d\.]+ dlnadoc\/[\d\.]+ (home media server)/i
                                                                                // Windows Media Server
            ], [VERSION, [NAME, 'Windows']], [

            /(com\.riseupradioalarm)\/((\d+)[\d\.]*)/i                          // RiseUP Radio Alarm
            ], [NAME, VERSION], [

            /(rad.io)\s((\d+)[\d\.]+)/i,                                        // Rad.io
            /(radio.(?:de|at|fr))\s((\d+)[\d\.]+)/i
            ], [[NAME, 'rad.io'], VERSION]

            //////////////////////
            // Media players END
            ////////////////////*/

        ],

        cpu : [[

            /(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i                     // AMD64
            ], [[ARCHITECTURE, 'amd64']], [

            /(ia32(?=;))/i                                                      // IA32 (quicktime)
            ], [[ARCHITECTURE, util.lowerize]], [

            /((?:i[346]|x)86)[;\)]/i                                            // IA32
            ], [[ARCHITECTURE, 'ia32']], [

            // PocketPC mistakenly identified as PowerPC
            /windows\s(ce|mobile);\sppc;/i
            ], [[ARCHITECTURE, 'arm']], [

            /((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i                           // PowerPC
            ], [[ARCHITECTURE, /ower/, '', util.lowerize]], [

            /(sun4\w)[;\)]/i                                                    // SPARC
            ], [[ARCHITECTURE, 'sparc']], [

            /((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+;))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i
                                                                                // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
            ], [[ARCHITECTURE, util.lowerize]]
        ],

        device : [[

            /\((ipad|playbook);[\w\s\);-]+(rim|apple)/i                         // iPad/PlayBook
            ], [MODEL, VENDOR, [TYPE, TABLET]], [

            /applecoremedia\/[\w\.]+ \((ipad)/                                  // iPad
            ], [MODEL, [VENDOR, 'Apple'], [TYPE, TABLET]], [

            /(apple\s{0,1}tv)/i                                                 // Apple TV
            ], [[MODEL, 'Apple TV'], [VENDOR, 'Apple']], [

            /(archos)\s(gamepad2?)/i,                                           // Archos
            /(hp).+(touchpad)/i,                                                // HP TouchPad
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /\s(nook)[\w\s]+build\/(\w+)/i,                                     // Nook
            /(dell)\s(strea[kpr\s\d]*[\dko])/i                                  // Dell Streak
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /(kf[A-z]+)\sbuild\/[\w\.]+.*silk\//i                               // Kindle Fire HD
            ], [MODEL, [VENDOR, 'Amazon'], [TYPE, TABLET]], [
            /(sd|kf)[0349hijorstuw]+\sbuild\/[\w\.]+.*silk\//i                  // Fire Phone
            ], [[MODEL, mapper.str, maps.device.amazon.model], [VENDOR, 'Amazon'], [TYPE, MOBILE]], [

            /\((ip[honed|\s\w*]+);.+(apple)/i                                   // iPod/iPhone
            ], [MODEL, VENDOR, [TYPE, MOBILE]], [
            /\((ip[honed|\s\w*]+);/i                                            // iPod/iPhone
            ], [MODEL, [VENDOR, 'Apple'], [TYPE, MOBILE]], [

            /(blackberry)[\s-]?(\w+)/i,                                         // BlackBerry
            /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|huawei|meizu|motorola|polytron)[\s_-]?([\w-]+)*/i,
                                                                                // BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Huawei/Meizu/Motorola/Polytron
            /(hp)\s([\w\s]+\w)/i,                                               // HP iPAQ
            /(asus)-?(\w+)/i                                                    // Asus
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /\(bb10;\s(\w+)/i                                                   // BlackBerry 10
            ], [MODEL, [VENDOR, 'BlackBerry'], [TYPE, MOBILE]], [
                                                                                // Asus Tablets
            /android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7)/i
            ], [MODEL, [VENDOR, 'Asus'], [TYPE, TABLET]], [

            /(sony)\s(tablet\s[ps])\sbuild\//i,                                  // Sony
            /(sony)?(?:sgp.+)\sbuild\//i
            ], [[VENDOR, 'Sony'], [MODEL, 'Xperia Tablet'], [TYPE, TABLET]], [
            /(?:sony)?(?:(?:(?:c|d)\d{4})|(?:so[-l].+))\sbuild\//i
            ], [[VENDOR, 'Sony'], [MODEL, 'Xperia Phone'], [TYPE, MOBILE]], [

            /\s(ouya)\s/i,                                                      // Ouya
            /(nintendo)\s([wids3u]+)/i                                          // Nintendo
            ], [VENDOR, MODEL, [TYPE, CONSOLE]], [

            /android.+;\s(shield)\sbuild/i                                      // Nvidia
            ], [MODEL, [VENDOR, 'Nvidia'], [TYPE, CONSOLE]], [

            /(playstation\s[34portablevi]+)/i                                   // Playstation
            ], [MODEL, [VENDOR, 'Sony'], [TYPE, CONSOLE]], [

            /(sprint\s(\w+))/i                                                  // Sprint Phones
            ], [[VENDOR, mapper.str, maps.device.sprint.vendor], [MODEL, mapper.str, maps.device.sprint.model], [TYPE, MOBILE]], [

            /(lenovo)\s?(S(?:5000|6000)+(?:[-][\w+]))/i                         // Lenovo tablets
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i,                               // HTC
            /(zte)-(\w+)*/i,                                                    // ZTE
            /(alcatel|geeksphone|huawei|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]+)*/i
                                                                                // Alcatel/GeeksPhone/Huawei/Lenovo/Nexian/Panasonic/Sony
            ], [VENDOR, [MODEL, /_/g, ' '], [TYPE, MOBILE]], [
                
            /(nexus\s9)/i                                                       // HTC Nexus 9
            ], [MODEL, [VENDOR, 'HTC'], [TYPE, TABLET]], [

            /[\s\(;](xbox(?:\sone)?)[\s\);]/i                                   // Microsoft Xbox
            ], [MODEL, [VENDOR, 'Microsoft'], [TYPE, CONSOLE]], [
            /(kin\.[onetw]{3})/i                                                // Microsoft Kin
            ], [[MODEL, /\./g, ' '], [VENDOR, 'Microsoft'], [TYPE, MOBILE]], [

                                                                                // Motorola
            /\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?(:?\s4g)?)[\w\s]+build\//i,
            /mot[\s-]?(\w+)*/i,
            /(XT\d{3,4}) build\//i,
            /(nexus\s[6])/i
            ], [MODEL, [VENDOR, 'Motorola'], [TYPE, MOBILE]], [
            /android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i
            ], [MODEL, [VENDOR, 'Motorola'], [TYPE, TABLET]], [

            /android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n8000|sgh-t8[56]9|nexus 10))/i,
            /((SM-T\w+))/i
            ], [[VENDOR, 'Samsung'], MODEL, [TYPE, TABLET]], [                  // Samsung
            /((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-n900))/i,
            /(sam[sung]*)[\s-]*(\w+-?[\w-]*)*/i,
            /sec-((sgh\w+))/i
            ], [[VENDOR, 'Samsung'], MODEL, [TYPE, MOBILE]], [
            /(samsung);smarttv/i
            ], [VENDOR, MODEL, [TYPE, SMARTTV]], [

            /\(dtv[\);].+(aquos)/i                                              // Sharp
            ], [MODEL, [VENDOR, 'Sharp'], [TYPE, SMARTTV]], [
            /sie-(\w+)*/i                                                       // Siemens
            ], [MODEL, [VENDOR, 'Siemens'], [TYPE, MOBILE]], [

            /(maemo|nokia).*(n900|lumia\s\d+)/i,                                // Nokia
            /(nokia)[\s_-]?([\w-]+)*/i
            ], [[VENDOR, 'Nokia'], MODEL, [TYPE, MOBILE]], [

            /android\s3\.[\s\w;-]{10}(a\d{3})/i                                 // Acer
            ], [MODEL, [VENDOR, 'Acer'], [TYPE, TABLET]], [

            /android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i                     // LG Tablet
            ], [[VENDOR, 'LG'], MODEL, [TYPE, TABLET]], [
            /(lg) netcast\.tv/i                                                 // LG SmartTV
            ], [VENDOR, MODEL, [TYPE, SMARTTV]], [
            /(nexus\s[45])/i,                                                   // LG
            /lg[e;\s\/-]+(\w+)*/i
            ], [MODEL, [VENDOR, 'LG'], [TYPE, MOBILE]], [

            /android.+(ideatab[a-z0-9\-\s]+)/i                                  // Lenovo
            ], [MODEL, [VENDOR, 'Lenovo'], [TYPE, TABLET]], [

            /linux;.+((jolla));/i                                               // Jolla
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /((pebble))app\/[\d\.]+\s/i                                         // Pebble
            ], [VENDOR, MODEL, [TYPE, WEARABLE]], [

            /android.+;\s(glass)\s\d/i                                          // Google Glass
            ], [MODEL, [VENDOR, 'Google'], [TYPE, WEARABLE]], [

            /android.+(\w+)\s+build\/hm\1/i,                                        // Xiaomi Hongmi 'numeric' models
            /android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i,                   // Xiaomi Hongmi
            /android.+(mi[\s\-_]*(?:one|one[\s_]plus)?[\s_]*(?:\d\w)?)\s+build/i    // Xiaomi Mi
            ], [[MODEL, /_/g, ' '], [VENDOR, 'Xiaomi'], [TYPE, MOBILE]], [

            /\s(tablet)[;\/\s]/i,                                               // Unidentifiable Tablet
            /\s(mobile)[;\/\s]/i                                                // Unidentifiable Mobile
            ], [[TYPE, util.lowerize], VENDOR, MODEL]

            /*//////////////////////////
            // TODO: move to string map
            ////////////////////////////

            /(C6603)/i                                                          // Sony Xperia Z C6603
            ], [[MODEL, 'Xperia Z C6603'], [VENDOR, 'Sony'], [TYPE, MOBILE]], [
            /(C6903)/i                                                          // Sony Xperia Z 1
            ], [[MODEL, 'Xperia Z 1'], [VENDOR, 'Sony'], [TYPE, MOBILE]], [

            /(SM-G900[F|H])/i                                                   // Samsung Galaxy S5
            ], [[MODEL, 'Galaxy S5'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-G7102)/i                                                       // Samsung Galaxy Grand 2
            ], [[MODEL, 'Galaxy Grand 2'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-G530H)/i                                                       // Samsung Galaxy Grand Prime
            ], [[MODEL, 'Galaxy Grand Prime'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-G313HZ)/i                                                      // Samsung Galaxy V
            ], [[MODEL, 'Galaxy V'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-T805)/i                                                        // Samsung Galaxy Tab S 10.5
            ], [[MODEL, 'Galaxy Tab S 10.5'], [VENDOR, 'Samsung'], [TYPE, TABLET]], [
            /(SM-G800F)/i                                                       // Samsung Galaxy S5 Mini
            ], [[MODEL, 'Galaxy S5 Mini'], [VENDOR, 'Samsung'], [TYPE, MOBILE]], [
            /(SM-T311)/i                                                        // Samsung Galaxy Tab 3 8.0
            ], [[MODEL, 'Galaxy Tab 3 8.0'], [VENDOR, 'Samsung'], [TYPE, TABLET]], [

            /(R1001)/i                                                          // Oppo R1001
            ], [MODEL, [VENDOR, 'OPPO'], [TYPE, MOBILE]], [
            /(X9006)/i                                                          // Oppo Find 7a
            ], [[MODEL, 'Find 7a'], [VENDOR, 'Oppo'], [TYPE, MOBILE]], [
            /(R2001)/i                                                          // Oppo YOYO R2001
            ], [[MODEL, 'Yoyo R2001'], [VENDOR, 'Oppo'], [TYPE, MOBILE]], [
            /(R815)/i                                                           // Oppo Clover R815
            ], [[MODEL, 'Clover R815'], [VENDOR, 'Oppo'], [TYPE, MOBILE]], [
             /(U707)/i                                                          // Oppo Find Way S
            ], [[MODEL, 'Find Way S'], [VENDOR, 'Oppo'], [TYPE, MOBILE]], [

            /(T3C)/i                                                            // Advan Vandroid T3C
            ], [MODEL, [VENDOR, 'Advan'], [TYPE, TABLET]], [
            /(ADVAN T1J\+)/i                                                    // Advan Vandroid T1J+
            ], [[MODEL, 'Vandroid T1J+'], [VENDOR, 'Advan'], [TYPE, TABLET]], [
            /(ADVAN S4A)/i                                                      // Advan Vandroid S4A
            ], [[MODEL, 'Vandroid S4A'], [VENDOR, 'Advan'], [TYPE, MOBILE]], [

            /(V972M)/i                                                          // ZTE V972M
            ], [MODEL, [VENDOR, 'ZTE'], [TYPE, MOBILE]], [

            /(i-mobile)\s(IQ\s[\d\.]+)/i                                        // i-mobile IQ
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /(IQ6.3)/i                                                          // i-mobile IQ IQ 6.3
            ], [[MODEL, 'IQ 6.3'], [VENDOR, 'i-mobile'], [TYPE, MOBILE]], [
            /(i-mobile)\s(i-style\s[\d\.]+)/i                                   // i-mobile i-STYLE
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /(i-STYLE2.1)/i                                                     // i-mobile i-STYLE 2.1
            ], [[MODEL, 'i-STYLE 2.1'], [VENDOR, 'i-mobile'], [TYPE, MOBILE]], [
            
            /(mobiistar touch LAI 512)/i                                        // mobiistar touch LAI 512
            ], [[MODEL, 'Touch LAI 512'], [VENDOR, 'mobiistar'], [TYPE, MOBILE]], [

            /////////////
            // END TODO
            ///////////*/

        ],

        engine : [[

            /windows.+\sedge\/([\w\.]+)/i                                       // EdgeHTML
            ], [VERSION, [NAME, 'EdgeHTML']], [

            /(presto)\/([\w\.]+)/i,                                             // Presto
            /(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i,     // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m
            /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i,                          // KHTML/Tasman/Links
            /(icab)[\/\s]([23]\.[\d\.]+)/i                                      // iCab
            ], [NAME, VERSION], [

            /rv\:([\w\.]+).*(gecko)/i                                           // Gecko
            ], [VERSION, NAME]
        ],

        os : [[

            // Windows based
            /microsoft\s(windows)\s(vista|xp)/i                                 // Windows (iTunes)
            ], [NAME, VERSION], [
            /(windows)\snt\s6\.2;\s(arm)/i,                                     // Windows RT
            /(windows\sphone(?:\sos)*|windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i
            ], [NAME, [VERSION, mapper.str, maps.os.windows.version]], [
            /(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i
            ], [[NAME, 'Windows'], [VERSION, mapper.str, maps.os.windows.version]], [

            // Mobile/Embedded OS
            /\((bb)(10);/i                                                      // BlackBerry 10
            ], [[NAME, 'BlackBerry'], VERSION], [
            /(blackberry)\w*\/?([\w\.]+)*/i,                                    // Blackberry
            /(tizen)[\/\s]([\w\.]+)/i,                                          // Tizen
            /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]+)*/i,
                                                                                // Android/WebOS/Palm/QNX/Bada/RIM/MeeGo/Contiki
            /linux;.+(sailfish);/i                                              // Sailfish OS
            ], [NAME, VERSION], [
            /(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]+)*/i                 // Symbian
            ], [[NAME, 'Symbian'], VERSION], [
            /\((series40);/i                                                    // Series 40
            ], [NAME], [
            /mozilla.+\(mobile;.+gecko.+firefox/i                               // Firefox OS
            ], [[NAME, 'Firefox OS'], VERSION], [

            // Console
            /(nintendo|playstation)\s([wids34portablevu]+)/i,                   // Nintendo/Playstation

            // GNU/Linux based
            /(mint)[\/\s\(]?(\w+)*/i,                                           // Mint
            /(mageia|vectorlinux)[;\s]/i,                                       // Mageia/VectorLinux
            /(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?([\w\.-]+)*/i,
                                                                                // Joli/Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware
                                                                                // Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus
            /(hurd|linux)\s?([\w\.]+)*/i,                                       // Hurd/Linux
            /(gnu)\s?([\w\.]+)*/i                                               // GNU
            ], [NAME, VERSION], [

            /(cros)\s[\w]+\s([\w\.]+\w)/i                                       // Chromium OS
            ], [[NAME, 'Chromium OS'], VERSION],[

            // Solaris
            /(sunos)\s?([\w\.]+\d)*/i                                           // Solaris
            ], [[NAME, 'Solaris'], VERSION], [

            // BSD based
            /\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i                   // FreeBSD/NetBSD/OpenBSD/PC-BSD/DragonFly
            ], [NAME, VERSION],[

            /(ip[honead]+)(?:.*os\s([\w]+)*\slike\smac|;\sopera)/i              // iOS
            ], [[NAME, 'iOS'], [VERSION, /_/g, '.']], [

            /(mac\sos\sx)\s?([\w\s\.]+\w)*/i,
            /(macintosh|mac(?=_powerpc)\s)/i                                    // Mac OS
            ], [[NAME, 'Mac OS'], [VERSION, /_/g, '.']], [

            // Other
            /((?:open)?solaris)[\/\s-]?([\w\.]+)*/i,                            // Solaris
            /(haiku)\s(\w+)/i,                                                  // Haiku
            /(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i,                               // AIX
            /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)/i,
                                                                                // Plan9/Minix/BeOS/OS2/AmigaOS/MorphOS/RISCOS/OpenVMS
            /(unix)\s?([\w\.]+)*/i                                              // UNIX
            ], [NAME, VERSION]
        ]
    };


    /////////////////
    // Constructor
    ////////////////


    var UAParser = function (uastring, extensions) {

        if (!(this instanceof UAParser)) {
            return new UAParser(uastring, extensions).getResult();
        }

        var ua = uastring || ((window && window.navigator && window.navigator.userAgent) ? window.navigator.userAgent : EMPTY);
        var rgxmap = extensions ? util.extend(regexes, extensions) : regexes;

        this.getBrowser = function () {
            var browser = mapper.rgx.apply(this, rgxmap.browser);
            browser.major = util.major(browser.version);
            return browser;
        };
        this.getCPU = function () {
            return mapper.rgx.apply(this, rgxmap.cpu);
        };
        this.getDevice = function () {
            return mapper.rgx.apply(this, rgxmap.device);
        };
        this.getEngine = function () {
            return mapper.rgx.apply(this, rgxmap.engine);
        };
        this.getOS = function () {
            return mapper.rgx.apply(this, rgxmap.os);
        };
        this.getResult = function() {
            return {
                ua      : this.getUA(),
                browser : this.getBrowser(),
                engine  : this.getEngine(),
                os      : this.getOS(),
                device  : this.getDevice(),
                cpu     : this.getCPU()
            };
        };
        this.getUA = function () {
            return ua;
        };
        this.setUA = function (uastring) {
            ua = uastring;
            return this;
        };
        this.setUA(ua);
        return this;
    };

    UAParser.VERSION = LIBVERSION;
    UAParser.BROWSER = {
        NAME    : NAME,
        MAJOR   : MAJOR, // deprecated
        VERSION : VERSION
    };
    UAParser.CPU = {
        ARCHITECTURE : ARCHITECTURE
    };
    UAParser.DEVICE = {
        MODEL   : MODEL,
        VENDOR  : VENDOR,
        TYPE    : TYPE,
        CONSOLE : CONSOLE,
        MOBILE  : MOBILE,
        SMARTTV : SMARTTV,
        TABLET  : TABLET,
        WEARABLE: WEARABLE,
        EMBEDDED: EMBEDDED
    };
    UAParser.ENGINE = {
        NAME    : NAME,
        VERSION : VERSION
    };
    UAParser.OS = {
        NAME    : NAME,
        VERSION : VERSION
    };


    ///////////
    // Export
    //////////


    // check js environment
    if (typeof(exports) !== UNDEF_TYPE) {
        // nodejs env
        if (typeof module !== UNDEF_TYPE && module.exports) {
            exports = module.exports = UAParser;
        }
        exports.UAParser = UAParser;
    } else {
        // requirejs env (optional)
        if (typeof(define) === FUNC_TYPE && define.amd) {
            define(function () {
                return UAParser;
            });
        } else {
            // browser env
            window.UAParser = UAParser;
        }
    }

    // jQuery/Zepto specific (optional)
    // Note: 
    //   In AMD env the global scope should be kept clean, but jQuery is an exception.
    //   jQuery always exports to global scope, unless jQuery.noConflict(true) is used,
    //   and we should catch that.
    var $ = window.jQuery || window.Zepto;
    if (typeof $ !== UNDEF_TYPE) {
        var parser = new UAParser();
        $.ua = parser.getResult();
        $.ua.get = function() {
            return parser.getUA();
        };
        $.ua.set = function (uastring) {
            parser.setUA(uastring);
            var result = parser.getResult();
            for (var prop in result) {
                $.ua[prop] = result[prop];
            }
        };
    }

})(typeof window === 'object' ? window : this);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/rocketchat:livechat/livechat.js");
require("./node_modules/meteor/rocketchat:livechat/server/startup.js");
require("./node_modules/meteor/rocketchat:livechat/permissions.js");
require("./node_modules/meteor/rocketchat:livechat/messageTypes.js");
require("./node_modules/meteor/rocketchat:livechat/roomType.js");
require("./node_modules/meteor/rocketchat:livechat/config.js");
require("./node_modules/meteor/rocketchat:livechat/client/stylesheets/load.js");
require("./node_modules/meteor/rocketchat:livechat/server/hooks/externalMessage.js");
require("./node_modules/meteor/rocketchat:livechat/server/hooks/markRoomResponded.js");
require("./node_modules/meteor/rocketchat:livechat/server/hooks/offlineMessage.js");
require("./node_modules/meteor/rocketchat:livechat/server/hooks/sendToCRM.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/addAgent.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/addManager.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/changeLivechatStatus.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/closeByVisitor.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/closeRoom.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/getCustomFields.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/getInitialData.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/loginByToken.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/pageVisited.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/registerGuest.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/removeAgent.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/removeCustomField.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/removeDepartment.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/removeManager.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/removeTrigger.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/saveCustomField.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/saveDepartment.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/saveInfo.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/saveIntegration.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/saveSurveyFeedback.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/saveTrigger.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/searchAgent.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/sendMessageLivechat.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/sendOfflineMessage.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/setCustomField.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/startVideoCall.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/transfer.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/webhookTest.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/takeInquiry.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/returnAsInquiry.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/saveOfficeHours.js");
require("./node_modules/meteor/rocketchat:livechat/server/methods/sendTranscript.js");
require("./node_modules/meteor/rocketchat:livechat/server/models/Users.js");
require("./node_modules/meteor/rocketchat:livechat/server/models/Rooms.js");
require("./node_modules/meteor/rocketchat:livechat/server/models/LivechatExternalMessage.js");
require("./node_modules/meteor/rocketchat:livechat/server/models/LivechatCustomField.js");
require("./node_modules/meteor/rocketchat:livechat/server/models/LivechatDepartment.js");
require("./node_modules/meteor/rocketchat:livechat/server/models/LivechatDepartmentAgents.js");
require("./node_modules/meteor/rocketchat:livechat/server/models/LivechatPageVisited.js");
require("./node_modules/meteor/rocketchat:livechat/server/models/LivechatTrigger.js");
require("./node_modules/meteor/rocketchat:livechat/server/models/indexes.js");
require("./node_modules/meteor/rocketchat:livechat/server/models/LivechatInquiry.js");
require("./node_modules/meteor/rocketchat:livechat/server/models/LivechatOfficeHour.js");
require("./node_modules/meteor/rocketchat:livechat/server/lib/Livechat.js");
require("./node_modules/meteor/rocketchat:livechat/server/lib/QueueMethods.js");
require("./node_modules/meteor/rocketchat:livechat/server/lib/OfficeClock.js");
require("./node_modules/meteor/rocketchat:livechat/server/sendMessageBySMS.js");
require("./node_modules/meteor/rocketchat:livechat/server/unclosedLivechats.js");
require("./node_modules/meteor/rocketchat:livechat/server/publications/customFields.js");
require("./node_modules/meteor/rocketchat:livechat/server/publications/departmentAgents.js");
require("./node_modules/meteor/rocketchat:livechat/server/publications/externalMessages.js");
require("./node_modules/meteor/rocketchat:livechat/server/publications/livechatAgents.js");
require("./node_modules/meteor/rocketchat:livechat/server/publications/livechatDepartments.js");
require("./node_modules/meteor/rocketchat:livechat/server/publications/livechatIntegration.js");
require("./node_modules/meteor/rocketchat:livechat/server/publications/livechatManagers.js");
require("./node_modules/meteor/rocketchat:livechat/server/publications/livechatRooms.js");
require("./node_modules/meteor/rocketchat:livechat/server/publications/livechatQueue.js");
require("./node_modules/meteor/rocketchat:livechat/server/publications/visitorHistory.js");
require("./node_modules/meteor/rocketchat:livechat/server/publications/visitorInfo.js");
require("./node_modules/meteor/rocketchat:livechat/server/publications/visitorPageVisited.js");
require("./node_modules/meteor/rocketchat:livechat/server/publications/livechatInquiries.js");
require("./node_modules/meteor/rocketchat:livechat/server/publications/livechatOfficeHours.js");
require("./node_modules/meteor/rocketchat:livechat/server/api.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:livechat'] = {};

})();

//# sourceMappingURL=rocketchat_livechat.js.map
