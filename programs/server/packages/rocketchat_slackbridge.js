(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var Logger = Package['rocketchat:logger'].Logger;
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
var logger;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:slackbridge":{"logger.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_slackbridge/logger.js                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/* globals logger:true */                                                                                             // 1
/* exported logger */                                                                                                 // 2
                                                                                                                      //
logger = new Logger('SlackBridge', {                                                                                  // 4
	sections: {                                                                                                          // 5
		connection: 'Connection',                                                                                           // 6
		events: 'Events',                                                                                                   // 7
		'class': 'Class'                                                                                                    // 8
	}                                                                                                                    // 5
});                                                                                                                   // 4
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"settings.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_slackbridge/settings.js                                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.startup(function () {                                                                                          // 1
	RocketChat.settings.addGroup('SlackBridge', function () {                                                            // 2
		this.add('SlackBridge_Enabled', false, {                                                                            // 3
			type: 'boolean',                                                                                                   // 4
			i18nLabel: 'Enabled',                                                                                              // 5
			'public': true                                                                                                     // 6
		});                                                                                                                 // 3
                                                                                                                      //
		this.add('SlackBridge_APIToken', '', {                                                                              // 9
			type: 'string',                                                                                                    // 10
			enableQuery: {                                                                                                     // 11
				_id: 'SlackBridge_Enabled',                                                                                       // 12
				value: true                                                                                                       // 13
			},                                                                                                                 // 11
			i18nLabel: 'API_Token'                                                                                             // 15
		});                                                                                                                 // 9
                                                                                                                      //
		this.add('SlackBridge_AliasFormat', '', {                                                                           // 18
			type: 'string',                                                                                                    // 19
			enableQuery: {                                                                                                     // 20
				_id: 'SlackBridge_Enabled',                                                                                       // 21
				value: true                                                                                                       // 22
			},                                                                                                                 // 20
			i18nLabel: 'Alias_Format',                                                                                         // 24
			i18nDescription: 'Alias_Format_Description'                                                                        // 25
		});                                                                                                                 // 18
                                                                                                                      //
		this.add('SlackBridge_ExcludeBotnames', '', {                                                                       // 28
			type: 'string',                                                                                                    // 29
			enableQuery: {                                                                                                     // 30
				_id: 'SlackBridge_Enabled',                                                                                       // 31
				value: true                                                                                                       // 32
			},                                                                                                                 // 30
			i18nLabel: 'Exclude_Botnames',                                                                                     // 34
			i18nDescription: 'Exclude_Botnames_Description'                                                                    // 35
		});                                                                                                                 // 28
                                                                                                                      //
		this.add('SlackBridge_Out_Enabled', false, {                                                                        // 38
			type: 'boolean',                                                                                                   // 39
			enableQuery: {                                                                                                     // 40
				_id: 'SlackBridge_Enabled',                                                                                       // 41
				value: true                                                                                                       // 42
			}                                                                                                                  // 40
		});                                                                                                                 // 38
                                                                                                                      //
		this.add('SlackBridge_Out_All', false, {                                                                            // 46
			type: 'boolean',                                                                                                   // 47
			enableQuery: [{                                                                                                    // 48
				_id: 'SlackBridge_Enabled',                                                                                       // 49
				value: true                                                                                                       // 50
			}, {                                                                                                               // 48
				_id: 'SlackBridge_Out_Enabled',                                                                                   // 52
				value: true                                                                                                       // 53
			}]                                                                                                                 // 51
		});                                                                                                                 // 46
                                                                                                                      //
		this.add('SlackBridge_Out_Channels', '', {                                                                          // 57
			type: 'roomPick',                                                                                                  // 58
			enableQuery: [{                                                                                                    // 59
				_id: 'SlackBridge_Enabled',                                                                                       // 60
				value: true                                                                                                       // 61
			}, {                                                                                                               // 59
				_id: 'SlackBridge_Out_Enabled',                                                                                   // 63
				value: true                                                                                                       // 64
			}, {                                                                                                               // 62
				_id: 'SlackBridge_Out_All',                                                                                       // 66
				value: false                                                                                                      // 67
			}]                                                                                                                 // 65
		});                                                                                                                 // 57
	});                                                                                                                  // 70
});                                                                                                                   // 71
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"slackbridge.js":["babel-runtime/helpers/classCallCheck",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_slackbridge/slackbridge.js                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _classCallCheck;module.import('babel-runtime/helpers/classCallCheck',{"default":function(v){_classCallCheck=v}});
                                                                                                                      //
/* globals logger */                                                                                                  // 1
                                                                                                                      //
var SlackBridge = function () {                                                                                       //
	function SlackBridge() {                                                                                             // 4
		var _this = this;                                                                                                   // 4
                                                                                                                      //
		_classCallCheck(this, SlackBridge);                                                                                 // 4
                                                                                                                      //
		this.util = Npm.require('util');                                                                                    // 5
		this.slackClient = Npm.require('slack-client');                                                                     // 6
		this.apiToken = RocketChat.settings.get('SlackBridge_APIToken');                                                    // 7
		this.aliasFormat = RocketChat.settings.get('SlackBridge_AliasFormat');                                              // 8
		this.excludeBotnames = RocketChat.settings.get('SlackBridge_Botnames');                                             // 9
		this.rtm = {};                                                                                                      // 10
		this.connected = false;                                                                                             // 11
		this.userTags = {};                                                                                                 // 12
		this.channelMap = {};                                                                                               // 13
                                                                                                                      //
		RocketChat.settings.get('SlackBridge_APIToken', function (key, value) {                                             // 15
			_this.apiToken = value;                                                                                            // 16
			if (_this.connected) {                                                                                             // 17
				_this.disconnect();                                                                                               // 18
				_this.connect();                                                                                                  // 19
			} else if (RocketChat.settings.get('SlackBridge_Enabled')) {                                                       // 20
				_this.connect();                                                                                                  // 21
			}                                                                                                                  // 22
		});                                                                                                                 // 23
                                                                                                                      //
		RocketChat.settings.get('SlackBridge_Enabled', function (key, value) {                                              // 25
			if (value && _this.apiToken) {                                                                                     // 26
				_this.connect();                                                                                                  // 27
			} else {                                                                                                           // 28
				_this.disconnect();                                                                                               // 29
			}                                                                                                                  // 30
		});                                                                                                                 // 31
                                                                                                                      //
		RocketChat.settings.get('SlackBridge_AliasFormat', function (key, value) {                                          // 33
			_this.aliasFormat = value;                                                                                         // 34
		});                                                                                                                 // 35
                                                                                                                      //
		RocketChat.settings.get('SlackBridge_ExcludeBotnames', function (key, value) {                                      // 37
			_this.excludeBotnames = value;                                                                                     // 38
		});                                                                                                                 // 39
	}                                                                                                                    // 40
                                                                                                                      //
	SlackBridge.prototype.connect = function () {                                                                        //
		function connect() {                                                                                                //
			var _this2 = this;                                                                                                 // 42
                                                                                                                      //
			if (this.connected === false) {                                                                                    // 43
				this.connected = true;                                                                                            // 44
				logger.connection.info('Connecting via token: ', this.apiToken);                                                  // 45
				var RtmClient = this.slackClient.RtmClient;                                                                       // 46
				this.rtm = new RtmClient(this.apiToken);                                                                          // 47
				this.rtm.start();                                                                                                 // 48
				this.setEvents();                                                                                                 // 49
				RocketChat.settings.get('SlackBridge_Out_Enabled', function (key, value) {                                        // 50
					if (value) {                                                                                                     // 51
						RocketChat.callbacks.add('afterSaveMessage', _this2.slackBridgeOut.bind(_this2), RocketChat.callbacks.priority.LOW, 'SlackBridge_Out');
					} else {                                                                                                         // 53
						RocketChat.callbacks.remove('afterSaveMessage', 'SlackBridge_Out');                                             // 54
					}                                                                                                                // 55
				});                                                                                                               // 56
				Meteor.startup(function () {                                                                                      // 57
					_this2.populateChannelMap(); // If run outside of Meteor.startup, HTTP is not defined                            // 58
				});                                                                                                               // 59
			}                                                                                                                  // 60
		}                                                                                                                   // 61
                                                                                                                      //
		return connect;                                                                                                     //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.disconnect = function () {                                                                     //
		function disconnect() {                                                                                             //
			if (this.connected === true) {                                                                                     // 64
				this.connected = false;                                                                                           // 65
				this.rtm.disconnect && this.rtm.disconnect();                                                                     // 66
				logger.connection.info('Disconnected');                                                                           // 67
				RocketChat.callbacks.remove('afterSaveMessage', 'SlackBridge_Out');                                               // 68
			}                                                                                                                  // 69
		}                                                                                                                   // 70
                                                                                                                      //
		return disconnect;                                                                                                  //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.convertSlackMessageToRocketChat = function () {                                                //
		function convertSlackMessageToRocketChat(message) {                                                                 //
			var _this3 = this;                                                                                                 // 72
                                                                                                                      //
			if (!_.isEmpty(message)) {                                                                                         // 73
				message = message.replace(/<!everyone>/g, '@all');                                                                // 74
				message = message.replace(/<!channel>/g, '@all');                                                                 // 75
				message = message.replace(/&gt;/g, '<');                                                                          // 76
				message = message.replace(/&lt;/g, '>');                                                                          // 77
				message = message.replace(/&amp;/g, '&');                                                                         // 78
				message = message.replace(/:simple_smile:/g, ':smile:');                                                          // 79
				message = message.replace(/:memo:/g, ':pencil:');                                                                 // 80
				message = message.replace(/:piggy:/g, ':pig:');                                                                   // 81
				message = message.replace(/:uk:/g, ':gb:');                                                                       // 82
				message = message.replace(/<(http[s]?:[^>]*)>/g, '$1');                                                           // 83
                                                                                                                      //
				message.replace(/(?:<@)([a-zA-Z0-9]+)(?:\|.+)?(?:>)/g, function (match, userId) {                                 // 85
					if (!_this3.userTags[userId]) {                                                                                  // 86
						_this3.findUser(userId) || _this3.addUser(userId); // This adds userTags for the userId                         // 87
					}                                                                                                                // 88
					var userTags = _this3.userTags[userId];                                                                          // 89
					if (userTags) {                                                                                                  // 90
						message = message.replace(userTags.slack, userTags.rocket);                                                     // 91
					}                                                                                                                // 92
				});                                                                                                               // 93
			} else {                                                                                                           // 94
				message = '';                                                                                                     // 95
			}                                                                                                                  // 96
			return message;                                                                                                    // 97
		}                                                                                                                   // 98
                                                                                                                      //
		return convertSlackMessageToRocketChat;                                                                             //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.findChannel = function () {                                                                    //
		function findChannel(channelId) {                                                                                   //
			logger['class'].debug('Searching for Rocket.Chat channel', channelId);                                             // 101
			return RocketChat.models.Rooms.findOneByImportId(channelId);                                                       // 102
		}                                                                                                                   // 103
                                                                                                                      //
		return findChannel;                                                                                                 //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.addChannel = function () {                                                                     //
		function addChannel(channelId) {                                                                                    //
			var hasRetried = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;                        // 105
                                                                                                                      //
			logger['class'].debug('Adding channel from Slack', channelId);                                                     // 106
			var data = null;                                                                                                   // 107
			var isGroup = false;                                                                                               // 108
			if (channelId.charAt(0) === 'C') {                                                                                 // 109
				data = HTTP.get('https://slack.com/api/channels.info', { params: { token: this.apiToken, channel: channelId } });
			} else if (channelId.charAt(0) === 'G') {                                                                          // 111
				data = HTTP.get('https://slack.com/api/groups.info', { params: { token: this.apiToken, channel: channelId } });   // 112
				isGroup = true;                                                                                                   // 113
			}                                                                                                                  // 114
			if (data && data.data && data.data.ok === true) {                                                                  // 115
				var channelData = isGroup ? data.data.group : data.data.channel;                                                  // 116
				var existingRoom = RocketChat.models.Rooms.findOneByName(channelData.name);                                       // 117
                                                                                                                      //
				// If the room exists, make sure we have its id in importIds                                                      // 119
				if (existingRoom || channelData.is_general) {                                                                     // 120
					channelData.rocketId = channelData.is_general ? 'GENERAL' : existingRoom._id;                                    // 121
					RocketChat.models.Rooms.update({ _id: channelData.rocketId }, { $addToSet: { importIds: channelData.id } });     // 122
				} else {                                                                                                          // 123
					var users = [];                                                                                                  // 124
					for (var _iterator = channelData.members, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
						var _ref;                                                                                                       // 125
                                                                                                                      //
						if (_isArray) {                                                                                                 // 125
							if (_i >= _iterator.length) break;                                                                             // 125
							_ref = _iterator[_i++];                                                                                        // 125
						} else {                                                                                                        // 125
							_i = _iterator.next();                                                                                         // 125
							if (_i.done) break;                                                                                            // 125
							_ref = _i.value;                                                                                               // 125
						}                                                                                                               // 125
                                                                                                                      //
						var member = _ref;                                                                                              // 125
                                                                                                                      //
						if (member !== channelData.creator) {                                                                           // 126
							var user = this.findUser(member) || this.addUser(member);                                                      // 127
							if (user && user.username) {                                                                                   // 128
								users.push(user.username);                                                                                    // 129
							}                                                                                                              // 130
						}                                                                                                               // 131
					}                                                                                                                // 132
					var creator = channelData.creator ? this.findUser(channelData.creator) || this.addUser(channelData.creator) : null;
					if (!creator) {                                                                                                  // 134
						logger['class'].error('Could not fetch room creator information', channelData.creator);                         // 135
						return;                                                                                                         // 136
					}                                                                                                                // 137
                                                                                                                      //
					try {                                                                                                            // 139
						var channel = RocketChat.createRoom(isGroup ? 'p' : 'c', channelData.name, creator.username, users);            // 140
						channelData.rocketId = channel.rid;                                                                             // 141
					} catch (e) {                                                                                                    // 142
						if (!hasRetried) {                                                                                              // 143
							logger['class'].debug('Error adding channel from Slack. Will retry in 1s.', e.message);                        // 144
							// If first time trying to create channel fails, could be because of multiple messages received at the same time. Try again once after 1s.
							Meteor._sleepForMs(1000);                                                                                      // 146
							return this.findChannel(channelId) || this.addChannel(channelId, true);                                        // 147
						} else {                                                                                                        // 148
							console.log(e.message);                                                                                        // 149
						}                                                                                                               // 150
					}                                                                                                                // 151
                                                                                                                      //
					var roomUpdate = {                                                                                               // 153
						ts: new Date(channelData.created * 1000)                                                                        // 154
					};                                                                                                               // 153
					var lastSetTopic = 0;                                                                                            // 156
					if (!_.isEmpty(channelData.topic && channelData.topic.value)) {                                                  // 157
						roomUpdate.topic = channelData.topic.value;                                                                     // 158
						lastSetTopic = channelData.topic.last_set;                                                                      // 159
					}                                                                                                                // 160
					if (!_.isEmpty(channelData.purpose && channelData.purpose.value) && channelData.purpose.last_set > lastSetTopic) {
						roomUpdate.topic = channelData.purpose.value;                                                                   // 162
					}                                                                                                                // 163
                                                                                                                      //
					RocketChat.models.Rooms.update({ _id: channelData.rocketId }, { $set: roomUpdate, $addToSet: { importIds: channelData.id } });
					this.channelMap[channelData.rocketId] = { id: channelId, family: channelId.charAt(0) === 'C' ? 'channels' : 'groups' };
				}                                                                                                                 // 167
				return RocketChat.models.Rooms.findOneById(channelData.rocketId);                                                 // 168
			}                                                                                                                  // 169
                                                                                                                      //
			return;                                                                                                            // 171
		}                                                                                                                   // 172
                                                                                                                      //
		return addChannel;                                                                                                  //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.findUser = function () {                                                                       //
		function findUser(userId) {                                                                                         //
			logger['class'].debug('Searching for Rocket.Chat user', userId);                                                   // 175
			var user = RocketChat.models.Users.findOneByImportId(userId);                                                      // 176
			if (user && !this.userTags[userId]) {                                                                              // 177
				this.userTags[userId] = { slack: '<@' + userId + '>', rocket: '@' + user.username };                              // 178
			}                                                                                                                  // 179
			return user;                                                                                                       // 180
		}                                                                                                                   // 181
                                                                                                                      //
		return findUser;                                                                                                    //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.addUser = function () {                                                                        //
		function addUser(userId) {                                                                                          //
			logger['class'].debug('Adding user from Slack', userId);                                                           // 184
			var data = HTTP.get('https://slack.com/api/users.info', { params: { token: this.apiToken, user: userId } });       // 185
			if (data && data.data && data.data.ok === true && data.data.user) {                                                // 186
				var userData = data.data.user;                                                                                    // 187
				var isBot = userData.is_bot === true;                                                                             // 188
				var email = userData.profile && userData.profile.email || '';                                                     // 189
				var existingUser = void 0;                                                                                        // 190
				if (!isBot) {                                                                                                     // 191
					existingUser = RocketChat.models.Users.findOneByEmailAddress(email) || RocketChat.models.Users.findOneByUsername(userData.name);
				} else {                                                                                                          // 193
					existingUser = RocketChat.models.Users.findOneByUsername(userData.name);                                         // 194
				}                                                                                                                 // 195
                                                                                                                      //
				if (existingUser) {                                                                                               // 197
					userData.rocketId = existingUser._id;                                                                            // 198
					userData.name = existingUser.username;                                                                           // 199
				} else {                                                                                                          // 200
					var newUser = { password: Random.id() };                                                                         // 201
					if (isBot || !email) {                                                                                           // 202
						newUser.username = userData.name;                                                                               // 203
					} else {                                                                                                         // 204
						newUser.email = email;                                                                                          // 205
					}                                                                                                                // 206
					userData.rocketId = Accounts.createUser(newUser);                                                                // 207
					var userUpdate = {                                                                                               // 208
						username: userData.name,                                                                                        // 209
						utcOffset: userData.tz_offset / 3600, // Slack's is -18000 which translates to Rocket.Chat's after dividing by 3600,
						roles: isBot ? ['bot'] : ['user']                                                                               // 211
					};                                                                                                               // 208
                                                                                                                      //
					if (userData.profile && userData.profile.real_name) {                                                            // 214
						userUpdate['name'] = userData.profile.real_name;                                                                // 215
					}                                                                                                                // 216
                                                                                                                      //
					if (userData.deleted) {                                                                                          // 218
						userUpdate['active'] = false;                                                                                   // 219
						userUpdate['services.resume.loginTokens'] = [];                                                                 // 220
					}                                                                                                                // 221
                                                                                                                      //
					RocketChat.models.Users.update({ _id: userData.rocketId }, { $set: userUpdate });                                // 223
                                                                                                                      //
					var user = RocketChat.models.Users.findOneById(userData.rocketId);                                               // 225
                                                                                                                      //
					var url = null;                                                                                                  // 227
					if (userData.profile) {                                                                                          // 228
						if (userData.profile.image_original) {                                                                          // 229
							url = userData.profile.image_original;                                                                         // 230
						} else if (userData.profile.image_512) {                                                                        // 231
							url = userData.profile.image_512;                                                                              // 232
						}                                                                                                               // 233
					}                                                                                                                // 234
					if (url) {                                                                                                       // 235
						try {                                                                                                           // 236
							RocketChat.setUserAvatar(user, url, null, 'url');                                                              // 237
						} catch (error) {                                                                                               // 238
							logger['class'].debug('Error setting user avatar', error.message);                                             // 239
						}                                                                                                               // 240
					}                                                                                                                // 241
					RocketChat.addUserToDefaultChannels(user, true);                                                                 // 242
				}                                                                                                                 // 243
                                                                                                                      //
				var importIds = [userData.id];                                                                                    // 245
				if (isBot && userData.profile && userData.profile.bot_id) {                                                       // 246
					importIds.push(userData.profile.bot_id);                                                                         // 247
				}                                                                                                                 // 248
				RocketChat.models.Users.update({ _id: userData.rocketId }, { $addToSet: { importIds: { $each: importIds } } });   // 249
				if (!this.userTags[userId]) {                                                                                     // 250
					this.userTags[userId] = { slack: '<@' + userId + '>', rocket: '@' + userData.name };                             // 251
				}                                                                                                                 // 252
				logger['class'].debug('User: ', userData.rocketId);                                                               // 253
				return RocketChat.models.Users.findOneById(userData.rocketId);                                                    // 254
			}                                                                                                                  // 255
			logger['class'].debug('User not added');                                                                           // 256
			return;                                                                                                            // 257
		}                                                                                                                   // 258
                                                                                                                      //
		return addUser;                                                                                                     //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.addAlias = function () {                                                                       //
		function addAlias(username, msgObj) {                                                                               //
			if (this.aliasFormat) {                                                                                            // 261
				var alias = this.util.format(this.aliasFormat, username);                                                         // 262
                                                                                                                      //
				if (alias !== username) {                                                                                         // 264
					msgObj.alias = alias;                                                                                            // 265
				}                                                                                                                 // 266
			}                                                                                                                  // 267
                                                                                                                      //
			return msgObj;                                                                                                     // 269
		}                                                                                                                   // 270
                                                                                                                      //
		return addAlias;                                                                                                    //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.sendMessage = function () {                                                                    //
		function sendMessage(room, user, message, msgDataDefaults, importing) {                                             //
			if (message.type === 'message') {                                                                                  // 273
				var msgObj = {};                                                                                                  // 274
				if (!_.isEmpty(message.subtype)) {                                                                                // 275
					msgObj = this.processSubtypedMessage(room, user, message, importing);                                            // 276
					if (!msgObj) {                                                                                                   // 277
						return;                                                                                                         // 278
					}                                                                                                                // 279
				} else {                                                                                                          // 280
					msgObj = {                                                                                                       // 281
						msg: this.convertSlackMessageToRocketChat(message.text),                                                        // 282
						rid: room._id,                                                                                                  // 283
						u: {                                                                                                            // 284
							_id: user._id,                                                                                                 // 285
							username: user.username                                                                                        // 286
						}                                                                                                               // 284
					};                                                                                                               // 281
                                                                                                                      //
					this.addAlias(user.username, msgObj);                                                                            // 290
				}                                                                                                                 // 291
				_.extend(msgObj, msgDataDefaults);                                                                                // 292
				if (message.edited) {                                                                                             // 293
					msgObj.ets = new Date(parseInt(message.edited.ts.split('.')[0]) * 1000);                                         // 294
				}                                                                                                                 // 295
				if (message.subtype === 'bot_message') {                                                                          // 296
					user = RocketChat.models.Users.findOneById('rocket.cat', { fields: { username: 1 } });                           // 297
				}                                                                                                                 // 298
                                                                                                                      //
				if (message.pinned_to && message.pinned_to.indexOf(message.channel) !== -1) {                                     // 300
					msgObj.pinned = true;                                                                                            // 301
					msgObj.pinnedAt = Date.now;                                                                                      // 302
					msgObj.pinnedBy = _.pick(user, '_id', 'username');                                                               // 303
				}                                                                                                                 // 304
				RocketChat.sendMessage(user, msgObj, room, true);                                                                 // 305
			}                                                                                                                  // 306
		}                                                                                                                   // 307
                                                                                                                      //
		return sendMessage;                                                                                                 //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.saveMessage = function () {                                                                    //
		function saveMessage(message, importing) {                                                                          //
			var channel = message.channel ? this.findChannel(message.channel) || this.addChannel(message.channel) : null;      // 310
			var user = null;                                                                                                   // 311
			if (message.subtype === 'message_deleted' || message.subtype === 'message_changed') {                              // 312
				user = message.previous_message.user ? this.findUser(message.previous_message.user) || this.addUser(message.previous_message.user) : null;
			} else if (message.subtype === 'bot_message') {                                                                    // 314
				user = RocketChat.models.Users.findOneById('rocket.cat', { fields: { username: 1 } });                            // 315
			} else {                                                                                                           // 316
				user = message.user ? this.findUser(message.user) || this.addUser(message.user) : null;                           // 317
			}                                                                                                                  // 318
			if (channel && user) {                                                                                             // 319
				var msgDataDefaults = {                                                                                           // 320
					_id: 'slack-' + message.channel + '-' + message.ts.replace(/\./g, '-'),                                          // 321
					ts: new Date(parseInt(message.ts.split('.')[0]) * 1000)                                                          // 322
				};                                                                                                                // 320
				if (importing) {                                                                                                  // 324
					msgDataDefaults['imported'] = 'slackbridge';                                                                     // 325
				}                                                                                                                 // 326
				try {                                                                                                             // 327
					this.sendMessage(channel, user, message, msgDataDefaults, importing);                                            // 328
				} catch (e) {                                                                                                     // 329
					// http://www.mongodb.org/about/contributors/error-codes/                                                        // 330
					// 11000 == duplicate key error                                                                                  // 331
					if (e.name === 'MongoError' && e.code === 11000) {                                                               // 332
						return;                                                                                                         // 333
					}                                                                                                                // 334
                                                                                                                      //
					throw e;                                                                                                         // 336
				}                                                                                                                 // 337
			}                                                                                                                  // 338
		}                                                                                                                   // 339
                                                                                                                      //
		return saveMessage;                                                                                                 //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.processSubtypedMessage = function () {                                                         //
		function processSubtypedMessage(room, user, message, importing) {                                                   //
			var msgObj = null;                                                                                                 // 342
			switch (message.subtype) {                                                                                         // 343
				case 'bot_message':                                                                                               // 344
					if (message.username !== undefined && this.excludeBotnames && message.username.match(this.excludeBotnames)) {    // 345
						return;                                                                                                         // 346
					}                                                                                                                // 347
                                                                                                                      //
					msgObj = {                                                                                                       // 349
						msg: this.convertSlackMessageToRocketChat(message.text),                                                        // 350
						rid: room._id,                                                                                                  // 351
						bot: true,                                                                                                      // 352
						attachments: message.attachments,                                                                               // 353
						username: message.username || message.bot_id                                                                    // 354
					};                                                                                                               // 349
					this.addAlias(message.username || message.bot_id, msgObj);                                                       // 356
					if (message.icons) {                                                                                             // 357
						msgObj.emoji = message.icons.emoji;                                                                             // 358
					}                                                                                                                // 359
					return msgObj;                                                                                                   // 360
				case 'me_message':                                                                                                // 361
					return this.addAlias(user.username, {                                                                            // 362
						msg: '_' + this.convertSlackMessageToRocketChat(message.text) + '_'                                             // 363
					});                                                                                                              // 362
				case 'message_changed':                                                                                           // 365
					this.editMessage(room, user, message);                                                                           // 366
					return;                                                                                                          // 367
				case 'message_deleted':                                                                                           // 368
					if (message.previous_message) {                                                                                  // 369
						var _id = 'slack-' + message.channel + '-' + message.previous_message.ts.replace(/\./g, '-');                   // 370
						msgObj = RocketChat.models.Messages.findOneById(_id);                                                           // 371
						if (msgObj) {                                                                                                   // 372
							RocketChat.deleteMessage(msgObj, user);                                                                        // 373
						}                                                                                                               // 374
					}                                                                                                                // 375
					return;                                                                                                          // 376
				case 'channel_join':                                                                                              // 377
					if (importing) {                                                                                                 // 378
						RocketChat.models.Messages.createUserJoinWithRoomIdAndUser(room._id, user, { ts: new Date(parseInt(message.ts.split('.')[0]) * 1000), imported: 'slackbridge' });
					} else {                                                                                                         // 380
						RocketChat.addUserToRoom(room._id, user);                                                                       // 381
					}                                                                                                                // 382
					return;                                                                                                          // 383
				case 'group_join':                                                                                                // 384
					if (message.inviter) {                                                                                           // 385
						var inviter = message.inviter ? this.findUser(message.inviter) || this.addUser(message.inviter) : null;         // 386
						if (importing) {                                                                                                // 387
							RocketChat.models.Messages.createUserAddedWithRoomIdAndUser(room._id, user, {                                  // 388
								ts: new Date(parseInt(message.ts.split('.')[0]) * 1000),                                                      // 389
								u: {                                                                                                          // 390
									_id: inviter._id,                                                                                            // 391
									username: inviter.username                                                                                   // 392
								},                                                                                                            // 390
								imported: 'slackbridge'                                                                                       // 394
							});                                                                                                            // 388
						} else {                                                                                                        // 396
							RocketChat.addUserToRoom(room._id, user, inviter);                                                             // 397
						}                                                                                                               // 398
					}                                                                                                                // 399
					return;                                                                                                          // 400
				case 'channel_leave':                                                                                             // 401
				case 'group_leave':                                                                                               // 402
					if (importing) {                                                                                                 // 403
						RocketChat.models.Messages.createUserLeaveWithRoomIdAndUser(room._id, user, {                                   // 404
							ts: new Date(parseInt(message.ts.split('.')[0]) * 1000),                                                       // 405
							imported: 'slackbridge'                                                                                        // 406
						});                                                                                                             // 404
					} else {                                                                                                         // 408
						RocketChat.removeUserFromRoom(room._id, user);                                                                  // 409
					}                                                                                                                // 410
					return;                                                                                                          // 411
				case 'channel_topic':                                                                                             // 412
				case 'group_topic':                                                                                               // 413
					if (importing) {                                                                                                 // 414
						RocketChat.models.Messages.createRoomSettingsChangedWithTypeRoomIdMessageAndUser('room_changed_topic', room._id, message.topic, user, { ts: new Date(parseInt(message.ts.split('.')[0]) * 1000), imported: 'slackbridge' });
					} else {                                                                                                         // 416
						RocketChat.saveRoomTopic(room._id, message.topic, user, false);                                                 // 417
					}                                                                                                                // 418
					return;                                                                                                          // 419
				case 'channel_purpose':                                                                                           // 420
				case 'group_purpose':                                                                                             // 421
					if (importing) {                                                                                                 // 422
						RocketChat.models.Messages.createRoomSettingsChangedWithTypeRoomIdMessageAndUser('room_changed_topic', room._id, message.purpose, user, { ts: new Date(parseInt(message.ts.split('.')[0]) * 1000), imported: 'slackbridge' });
					} else {                                                                                                         // 424
						RocketChat.saveRoomTopic(room._id, message.purpose, user, false);                                               // 425
					}                                                                                                                // 426
					return;                                                                                                          // 427
				case 'channel_name':                                                                                              // 428
				case 'group_name':                                                                                                // 429
					if (importing) {                                                                                                 // 430
						RocketChat.models.Messages.createRoomRenamedWithRoomIdRoomNameAndUser(room._id, message.name, user, { ts: new Date(parseInt(message.ts.split('.')[0]) * 1000), imported: 'slackbridge' });
					} else {                                                                                                         // 432
						RocketChat.saveRoomName(room._id, message.name, user, false);                                                   // 433
					}                                                                                                                // 434
					return;                                                                                                          // 435
				case 'channel_archive':                                                                                           // 436
				case 'group_archive':                                                                                             // 437
					if (!importing) {                                                                                                // 438
						RocketChat.archiveRoom(room);                                                                                   // 439
					}                                                                                                                // 440
					return;                                                                                                          // 441
				case 'channel_unarchive':                                                                                         // 442
				case 'group_unarchive':                                                                                           // 443
					if (!importing) {                                                                                                // 444
						RocketChat.unarchiveRoom(room);                                                                                 // 445
					}                                                                                                                // 446
					return;                                                                                                          // 447
				case 'file_share':                                                                                                // 448
					if (message.file && message.file.url_private_download !== undefined) {                                           // 449
						var details = {                                                                                                 // 450
							message_id: 'slack-' + message.ts.replace(/\./g, '-'),                                                         // 451
							name: message.file.name,                                                                                       // 452
							size: message.file.size,                                                                                       // 453
							type: message.file.mimetype,                                                                                   // 454
							rid: room._id                                                                                                  // 455
						};                                                                                                              // 450
						return this.uploadFile(details, message.file.url_private_download, user, room, new Date(parseInt(message.ts.split('.')[0]) * 1000), importing);
					}                                                                                                                // 458
					break;                                                                                                           // 459
				case 'file_comment':                                                                                              // 460
					logger['class'].error('File comment not implemented');                                                           // 461
					return;                                                                                                          // 462
				case 'file_mention':                                                                                              // 463
					logger['class'].error('File mentioned not implemented');                                                         // 464
					return;                                                                                                          // 465
				case 'pinned_item':                                                                                               // 466
					if (message.attachments && message.attachments[0] && message.attachments[0].text) {                              // 467
						msgObj = {                                                                                                      // 468
							rid: room._id,                                                                                                 // 469
							t: 'message_pinned',                                                                                           // 470
							msg: '',                                                                                                       // 471
							u: {                                                                                                           // 472
								_id: user._id,                                                                                                // 473
								username: user.username                                                                                       // 474
							},                                                                                                             // 472
							attachments: [{                                                                                                // 476
								'text': this.convertSlackMessageToRocketChat(message.attachments[0].text),                                    // 477
								'author_name': message.attachments[0].author_subname,                                                         // 478
								'author_icon': getAvatarUrlFromUsername(message.attachments[0].author_subname),                               // 479
								'ts': new Date(parseInt(message.attachments[0].ts.split('.')[0]) * 1000)                                      // 480
							}]                                                                                                             // 476
						};                                                                                                              // 468
                                                                                                                      //
						if (!importing) {                                                                                               // 484
							RocketChat.models.Messages.setPinnedByIdAndUserId('slack-' + message.attachments[0].channel_id + '-' + message.attachments[0].ts.replace(/\./g, '-'), msgObj.u, true, new Date(parseInt(message.ts.split('.')[0]) * 1000));
						}                                                                                                               // 486
                                                                                                                      //
						return msgObj;                                                                                                  // 488
					} else {                                                                                                         // 489
						logger['class'].error('Pinned item with no attachment');                                                        // 490
					}                                                                                                                // 491
					return;                                                                                                          // 492
				case 'unpinned_item':                                                                                             // 493
					logger['class'].error('Unpinned item not implemented');                                                          // 494
					return;                                                                                                          // 495
			}                                                                                                                  // 343
		}                                                                                                                   // 497
                                                                                                                      //
		return processSubtypedMessage;                                                                                      //
	}();                                                                                                                 //
                                                                                                                      //
	/**                                                                                                                  // 499
 * Edits a message                                                                                                    //
 **/                                                                                                                  //
                                                                                                                      //
                                                                                                                      //
	SlackBridge.prototype.editMessage = function () {                                                                    //
		function editMessage(room, user, message) {                                                                         //
			var msgObj = {                                                                                                     // 503
				//@TODO _id                                                                                                       // 504
				_id: 'slack-' + message.channel + '-' + message.message.ts.replace(/\./g, '-'),                                   // 505
				rid: room._id,                                                                                                    // 506
				msg: this.convertSlackMessageToRocketChat(message.message.text)                                                   // 507
			};                                                                                                                 // 503
                                                                                                                      //
			RocketChat.updateMessage(msgObj, user);                                                                            // 510
		}                                                                                                                   // 511
                                                                                                                      //
		return editMessage;                                                                                                 //
	}();                                                                                                                 //
                                                                                                                      //
	/**                                                                                                                  // 513
 Uploads the file to the storage.                                                                                     //
 @param [Object] details an object with details about the upload. name, size, type, and rid                           //
 @param [String] fileUrl url of the file to download/import                                                           //
 @param [Object] user the Rocket.Chat user                                                                            //
 @param [Object] room the Rocket.Chat room                                                                            //
 @param [Date] timeStamp the timestamp the file was uploaded                                                          //
 **/                                                                                                                  //
                                                                                                                      //
                                                                                                                      //
	SlackBridge.prototype.uploadFile = function () {                                                                     //
		function uploadFile(details, fileUrl, user, room, timeStamp, importing) {                                           //
			var url = Npm.require('url');                                                                                      // 522
			var requestModule = /https/i.test(fileUrl) ? Npm.require('https') : Npm.require('http');                           // 523
			var parsedUrl = url.parse(fileUrl, true);                                                                          // 524
			parsedUrl.headers = { 'Authorization': 'Bearer ' + this.apiToken };                                                // 525
			requestModule.get(parsedUrl, Meteor.bindEnvironment(function (stream) {                                            // 526
				var fileId = Meteor.fileStore.create(details);                                                                    // 527
				if (fileId) {                                                                                                     // 528
					Meteor.fileStore.write(stream, fileId, function (err, file) {                                                    // 529
						console.log('fileStore.write', file);                                                                           // 530
						if (err) {                                                                                                      // 531
							throw new Error(err);                                                                                          // 532
						} else {                                                                                                        // 533
							var _url = file.url.replace(Meteor.absoluteUrl(), '/');                                                        // 534
							var attachment = {                                                                                             // 535
								title: 'File Uploaded: ' + file.name,                                                                         // 536
								title_link: _url                                                                                              // 537
							};                                                                                                             // 535
                                                                                                                      //
							if (/^image\/.+/.test(file.type)) {                                                                            // 540
								attachment.image_url = _url;                                                                                  // 541
								attachment.image_type = file.type;                                                                            // 542
								attachment.image_size = file.size;                                                                            // 543
								attachment.image_dimensions = file.identify && file.identify.size;                                            // 544
							}                                                                                                              // 545
							if (/^audio\/.+/.test(file.type)) {                                                                            // 546
								attachment.audio_url = _url;                                                                                  // 547
								attachment.audio_type = file.type;                                                                            // 548
								attachment.audio_size = file.size;                                                                            // 549
							}                                                                                                              // 550
							if (/^video\/.+/.test(file.type)) {                                                                            // 551
								attachment.video_url = _url;                                                                                  // 552
								attachment.video_type = file.type;                                                                            // 553
								attachment.video_size = file.size;                                                                            // 554
							}                                                                                                              // 555
                                                                                                                      //
							var msg = {                                                                                                    // 557
								rid: details.rid,                                                                                             // 558
								ts: timeStamp,                                                                                                // 559
								msg: '',                                                                                                      // 560
								file: {                                                                                                       // 561
									_id: file._id                                                                                                // 562
								},                                                                                                            // 561
								groupable: false,                                                                                             // 564
								attachments: [attachment]                                                                                     // 565
							};                                                                                                             // 557
                                                                                                                      //
							if (importing) {                                                                                               // 568
								msg.imported = 'slackbridge';                                                                                 // 569
							}                                                                                                              // 570
                                                                                                                      //
							if (details.message_id && typeof details.message_id === 'string') {                                            // 572
								msg['_id'] = details.message_id;                                                                              // 573
							}                                                                                                              // 574
                                                                                                                      //
							return RocketChat.sendMessage(user, msg, room, true);                                                          // 576
						}                                                                                                               // 577
					});                                                                                                              // 578
				}                                                                                                                 // 579
			}));                                                                                                               // 580
		}                                                                                                                   // 581
                                                                                                                      //
		return uploadFile;                                                                                                  //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.setEvents = function () {                                                                      //
		function setEvents() {                                                                                              //
			var _this4 = this;                                                                                                 // 583
                                                                                                                      //
			var CLIENT_EVENTS = this.slackClient.CLIENT_EVENTS;                                                                // 584
			this.rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function () {                                                         // 585
				logger.connection.info('Connected');                                                                              // 586
			});                                                                                                                // 587
                                                                                                                      //
			this.rtm.on(CLIENT_EVENTS.RTM.UNABLE_TO_RTM_START, function () {                                                   // 589
				_this4.disconnect();                                                                                              // 590
			});                                                                                                                // 591
                                                                                                                      //
			this.rtm.on(CLIENT_EVENTS.RTM.DISCONNECT, function () {                                                            // 593
				_this4.disconnect();                                                                                              // 594
			});                                                                                                                // 595
                                                                                                                      //
			var RTM_EVENTS = this.slackClient.RTM_EVENTS;                                                                      // 597
                                                                                                                      //
			/**                                                                                                                // 599
   * Event fired when someone messages a channel the bot is in                                                        //
   * {                                                                                                                //
   *	type: 'message',                                                                                                 //
   * 	channel: [channel_id],                                                                                          //
   * 	user: [user_id],                                                                                                //
   * 	text: [message],                                                                                                //
   * 	ts: [ts.milli],                                                                                                 //
   * 	team: [team_id],                                                                                                //
   * 	subtype: [message_subtype],                                                                                     //
   * 	inviter: [message_subtype = 'group_join|channel_join' -> user_id]                                               //
   * }                                                                                                                //
   **/                                                                                                                //
			this.rtm.on(RTM_EVENTS.MESSAGE, Meteor.bindEnvironment(function (message) {                                        // 612
				logger.events.debug('MESSAGE: ', message);                                                                        // 613
				if (message) {                                                                                                    // 614
					_this4.saveMessage(message);                                                                                     // 615
				}                                                                                                                 // 616
			}));                                                                                                               // 617
                                                                                                                      //
			/**                                                                                                                // 619
   * Event fired when someone creates a public channel                                                                //
   * {                                                                                                                //
   *	type: 'channel_created',                                                                                         //
   *	channel: {                                                                                                       //
   *		id: [channel_id],                                                                                               //
   *		is_channel: true,                                                                                               //
   *		name: [channel_name],                                                                                           //
   *		created: [ts],                                                                                                  //
   *		creator: [user_id],                                                                                             //
   *		is_shared: false,                                                                                               //
   *		is_org_shared: false                                                                                            //
   *	},                                                                                                               //
   *	event_ts: [ts.milli]                                                                                             //
   * }                                                                                                                //
   **/                                                                                                                //
			this.rtm.on(RTM_EVENTS.CHANNEL_CREATED, Meteor.bindEnvironment(function () {}));                                   // 635
                                                                                                                      //
			/**                                                                                                                // 637
   * Event fired when the bot joins a public channel                                                                  //
   * {                                                                                                                //
   * 	type: 'channel_joined',                                                                                         //
   * 	channel: {                                                                                                      //
   * 		id: [channel_id],                                                                                              //
   * 		name: [channel_name],                                                                                          //
   * 		is_channel: true,                                                                                              //
   * 		created: [ts],                                                                                                 //
   * 		creator: [user_id],                                                                                            //
   * 		is_archived: false,                                                                                            //
   * 		is_general: false,                                                                                             //
   * 		is_member: true,                                                                                               //
   * 		last_read: [ts.milli],                                                                                         //
   * 		latest: [message_obj],                                                                                         //
   * 		unread_count: 0,                                                                                               //
   * 		unread_count_display: 0,                                                                                       //
   * 		members: [ user_ids ],                                                                                         //
   * 		topic: {                                                                                                       //
   * 			value: [channel_topic],                                                                                       //
   * 			creator: [user_id],                                                                                           //
   * 			last_set: 0                                                                                                   //
   * 		},                                                                                                             //
   * 		purpose: {                                                                                                     //
   * 			value: [channel_purpose],                                                                                     //
   * 			creator: [user_id],                                                                                           //
   * 			last_set: 0                                                                                                   //
   * 		}                                                                                                              //
   * 	}                                                                                                               //
   * }                                                                                                                //
   **/                                                                                                                //
			this.rtm.on(RTM_EVENTS.CHANNEL_JOINED, Meteor.bindEnvironment(function () {}));                                    // 668
                                                                                                                      //
			/**                                                                                                                // 670
   * Event fired when the bot leaves (or is removed from) a public channel                                            //
   * {                                                                                                                //
   * 	type: 'channel_left',                                                                                           //
   * 	channel: [channel_id]                                                                                           //
   * }                                                                                                                //
   **/                                                                                                                //
			this.rtm.on(RTM_EVENTS.CHANNEL_LEFT, Meteor.bindEnvironment(function () {}));                                      // 677
                                                                                                                      //
			/**                                                                                                                // 679
   * Event fired when an archived channel is deleted by an admin                                                      //
   * {                                                                                                                //
   * 	type: 'channel_deleted',                                                                                        //
   * 	channel: [channel_id],                                                                                          //
   *	event_ts: [ts.milli]                                                                                             //
   * }                                                                                                                //
   **/                                                                                                                //
			this.rtm.on(RTM_EVENTS.CHANNEL_DELETED, Meteor.bindEnvironment(function () {}));                                   // 687
                                                                                                                      //
			/**                                                                                                                // 689
   * Event fired when the channel has its name changed                                                                //
   * {                                                                                                                //
   * 	type: 'channel_rename',                                                                                         //
   * 	channel: {                                                                                                      //
   * 		id: [channel_id],                                                                                              //
   * 		name: [channel_name],                                                                                          //
   * 		is_channel: true,                                                                                              //
   * 		created: [ts]                                                                                                  //
   * 	},                                                                                                              //
   *	event_ts: [ts.milli]                                                                                             //
   * }                                                                                                                //
   **/                                                                                                                //
			this.rtm.on(RTM_EVENTS.CHANNEL_RENAME, Meteor.bindEnvironment(function () {}));                                    // 702
                                                                                                                      //
			/**                                                                                                                // 704
   * Event fired when the bot joins a private channel                                                                 //
   * {                                                                                                                //
   * 	type: 'group_joined',                                                                                           //
   * 	channel: {                                                                                                      //
   * 		id: [channel_id],                                                                                              //
   * 		name: [channel_name],                                                                                          //
   * 		is_group: true,                                                                                                //
   * 		created: [ts],                                                                                                 //
   * 		creator: [user_id],                                                                                            //
   * 		is_archived: false,                                                                                            //
   * 		is_mpim: false,                                                                                                //
   * 		is_open: true,                                                                                                 //
   * 		last_read: [ts.milli],                                                                                         //
   * 		latest: [message_obj],                                                                                         //
   * 		unread_count: 0,                                                                                               //
   * 		unread_count_display: 0,                                                                                       //
   * 		members: [ user_ids ],                                                                                         //
   * 		topic: {                                                                                                       //
   * 			value: [channel_topic],                                                                                       //
   * 			creator: [user_id],                                                                                           //
   * 			last_set: 0                                                                                                   //
   * 		},                                                                                                             //
   * 		purpose: {                                                                                                     //
   * 			value: [channel_purpose],                                                                                     //
   * 			creator: [user_id],                                                                                           //
   * 			last_set: 0                                                                                                   //
   * 		}                                                                                                              //
   * 	}                                                                                                               //
   * }                                                                                                                //
   **/                                                                                                                //
			this.rtm.on(RTM_EVENTS.GROUP_JOINED, Meteor.bindEnvironment(function () {}));                                      // 735
                                                                                                                      //
			/**                                                                                                                // 737
   * Event fired when the bot leaves (or is removed from) a private channel                                           //
   * {                                                                                                                //
   * 	type: 'group_left',                                                                                             //
   * 	channel: [channel_id]                                                                                           //
   * }                                                                                                                //
   **/                                                                                                                //
			this.rtm.on(RTM_EVENTS.GROUP_LEFT, Meteor.bindEnvironment(function () {}));                                        // 744
                                                                                                                      //
			/**                                                                                                                // 746
   * Event fired when the private channel has its name changed                                                        //
   * {                                                                                                                //
   * 	type: 'group_rename',                                                                                           //
   * 	channel: {                                                                                                      //
   * 		id: [channel_id],                                                                                              //
   * 		name: [channel_name],                                                                                          //
   * 		is_group: true,                                                                                                //
   * 		created: [ts]                                                                                                  //
   * 	},                                                                                                              //
   *	event_ts: [ts.milli]                                                                                             //
   * }                                                                                                                //
   **/                                                                                                                //
			this.rtm.on(RTM_EVENTS.GROUP_RENAME, Meteor.bindEnvironment(function () {}));                                      // 759
                                                                                                                      //
			/**                                                                                                                // 761
   * Event fired when a new user joins the team                                                                       //
   * {                                                                                                                //
   * 	type: 'team_join',                                                                                              //
   * 	user:                                                                                                           //
   * 	{                                                                                                               //
   * 		id: [user_id],                                                                                                 //
   * 		team_id: [team_id],                                                                                            //
   * 		name: [user_name],                                                                                             //
   * 		deleted: false,                                                                                                //
   * 		status: null,                                                                                                  //
   * 		color: [color_code],                                                                                           //
   * 		real_name: '',                                                                                                 //
   * 		tz: [timezone],                                                                                                //
   * 		tz_label: [timezone_label],                                                                                    //
   * 		tz_offset: [timezone_offset],                                                                                  //
   * 		profile:                                                                                                       //
   * 		{                                                                                                              //
   * 			avatar_hash: '',                                                                                              //
   * 			real_name: '',                                                                                                //
   * 			real_name_normalized: '',                                                                                     //
   * 			email: '',                                                                                                    //
   * 			image_24: '',                                                                                                 //
   * 			image_32: '',                                                                                                 //
   * 			image_48: '',                                                                                                 //
   * 			image_72: '',                                                                                                 //
   * 			image_192: '',                                                                                                //
   * 			image_512: '',                                                                                                //
   * 			fields: null                                                                                                  //
   * 		},                                                                                                             //
   * 		is_admin: false,                                                                                               //
   * 		is_owner: false,                                                                                               //
   * 		is_primary_owner: false,                                                                                       //
   * 		is_restricted: false,                                                                                          //
   * 		is_ultra_restricted: false,                                                                                    //
   * 		is_bot: false,                                                                                                 //
   * 		presence: [user_presence]                                                                                      //
   * 	},                                                                                                              //
   * 	cache_ts: [ts]                                                                                                  //
   * }                                                                                                                //
   **/                                                                                                                //
			this.rtm.on(RTM_EVENTS.TEAM_JOIN, Meteor.bindEnvironment(function () {}));                                         // 802
		}                                                                                                                   // 803
                                                                                                                      //
		return setEvents;                                                                                                   //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.findSlackChannel = function () {                                                               //
		function findSlackChannel(name) {                                                                                   //
			logger['class'].debug('Searching for Slack channel or group', name);                                               // 806
			var response = HTTP.get('https://slack.com/api/channels.list', { params: { token: this.apiToken } });              // 807
			if (response && response.data && _.isArray(response.data.channels) && response.data.channels.length > 0) {         // 808
				for (var _iterator2 = response.data.channels, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
					var _ref2;                                                                                                       // 809
                                                                                                                      //
					if (_isArray2) {                                                                                                 // 809
						if (_i2 >= _iterator2.length) break;                                                                            // 809
						_ref2 = _iterator2[_i2++];                                                                                      // 809
					} else {                                                                                                         // 809
						_i2 = _iterator2.next();                                                                                        // 809
						if (_i2.done) break;                                                                                            // 809
						_ref2 = _i2.value;                                                                                              // 809
					}                                                                                                                // 809
                                                                                                                      //
					var channel = _ref2;                                                                                             // 809
                                                                                                                      //
					if (channel.name === name && channel.is_member === true) {                                                       // 810
						return channel;                                                                                                 // 811
					}                                                                                                                // 812
				}                                                                                                                 // 813
			}                                                                                                                  // 814
			response = HTTP.get('https://slack.com/api/groups.list', { params: { token: this.apiToken } });                    // 815
			if (response && response.data && _.isArray(response.data.groups) && response.data.groups.length > 0) {             // 816
				for (var _iterator3 = response.data.groups, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
					var _ref3;                                                                                                       // 817
                                                                                                                      //
					if (_isArray3) {                                                                                                 // 817
						if (_i3 >= _iterator3.length) break;                                                                            // 817
						_ref3 = _iterator3[_i3++];                                                                                      // 817
					} else {                                                                                                         // 817
						_i3 = _iterator3.next();                                                                                        // 817
						if (_i3.done) break;                                                                                            // 817
						_ref3 = _i3.value;                                                                                              // 817
					}                                                                                                                // 817
                                                                                                                      //
					var group = _ref3;                                                                                               // 817
                                                                                                                      //
					if (group.name === name) {                                                                                       // 818
						return group;                                                                                                   // 819
					}                                                                                                                // 820
				}                                                                                                                 // 821
			}                                                                                                                  // 822
		}                                                                                                                   // 823
                                                                                                                      //
		return findSlackChannel;                                                                                            //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.importFromHistory = function () {                                                              //
		function importFromHistory(family, options) {                                                                       //
			logger['class'].debug('Importing messages history');                                                               // 826
			var response = HTTP.get('https://slack.com/api/' + family + '.history', { params: _.extend({ token: this.apiToken }, options) });
			if (response && response.data && _.isArray(response.data.messages) && response.data.messages.length > 0) {         // 828
				var latest = 0;                                                                                                   // 829
				for (var _iterator4 = response.data.messages.reverse(), _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
					var _ref4;                                                                                                       // 830
                                                                                                                      //
					if (_isArray4) {                                                                                                 // 830
						if (_i4 >= _iterator4.length) break;                                                                            // 830
						_ref4 = _iterator4[_i4++];                                                                                      // 830
					} else {                                                                                                         // 830
						_i4 = _iterator4.next();                                                                                        // 830
						if (_i4.done) break;                                                                                            // 830
						_ref4 = _i4.value;                                                                                              // 830
					}                                                                                                                // 830
                                                                                                                      //
					var message = _ref4;                                                                                             // 830
                                                                                                                      //
					logger['class'].debug('MESSAGE: ', message);                                                                     // 831
					if (!latest || message.ts > latest) {                                                                            // 832
						latest = message.ts;                                                                                            // 833
					}                                                                                                                // 834
					message.channel = options.channel;                                                                               // 835
					this.saveMessage(message, true);                                                                                 // 836
				}                                                                                                                 // 837
				return { has_more: response.data.has_more, ts: latest };                                                          // 838
			}                                                                                                                  // 839
		}                                                                                                                   // 840
                                                                                                                      //
		return importFromHistory;                                                                                           //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.copyChannelInfo = function () {                                                                //
		function copyChannelInfo(rid, channelMap) {                                                                         //
			logger['class'].debug('Copying users from Slack channel to Rocket.Chat', channelMap.id, rid);                      // 843
			var response = HTTP.get('https://slack.com/api/' + channelMap.family + '.info', { params: { token: this.apiToken, channel: channelMap.id } });
			if (response && response.data) {                                                                                   // 845
				var data = channelMap.family === 'channels' ? response.data.channel : response.data.group;                        // 846
				if (data && _.isArray(data.members) && data.members.length > 0) {                                                 // 847
					for (var _iterator5 = data.members, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
						var _ref5;                                                                                                      // 848
                                                                                                                      //
						if (_isArray5) {                                                                                                // 848
							if (_i5 >= _iterator5.length) break;                                                                           // 848
							_ref5 = _iterator5[_i5++];                                                                                     // 848
						} else {                                                                                                        // 848
							_i5 = _iterator5.next();                                                                                       // 848
							if (_i5.done) break;                                                                                           // 848
							_ref5 = _i5.value;                                                                                             // 848
						}                                                                                                               // 848
                                                                                                                      //
						var member = _ref5;                                                                                             // 848
                                                                                                                      //
						var user = this.findUser(member) || this.addUser(member);                                                       // 849
						if (user) {                                                                                                     // 850
							logger['class'].debug('Adding user to room', user.username, rid);                                              // 851
							RocketChat.addUserToRoom(rid, user, null, true);                                                               // 852
						}                                                                                                               // 853
					}                                                                                                                // 854
				}                                                                                                                 // 855
                                                                                                                      //
				var topic = '';                                                                                                   // 857
				var topic_last_set = 0;                                                                                           // 858
				var topic_creator = null;                                                                                         // 859
				if (data && data.topic && data.topic.value) {                                                                     // 860
					topic = data.topic.value;                                                                                        // 861
					topic_last_set = data.topic.last_set;                                                                            // 862
					topic_creator = data.topic.creator;                                                                              // 863
				}                                                                                                                 // 864
                                                                                                                      //
				if (data && data.purpose && data.purpose.value) {                                                                 // 866
					if (topic_last_set) {                                                                                            // 867
						if (topic_last_set < data.purpose.last_set) {                                                                   // 868
							topic = data.purpose.topic;                                                                                    // 869
							topic_creator = data.purpose.creator;                                                                          // 870
						}                                                                                                               // 871
					} else {                                                                                                         // 872
						topic = data.purpose.topic;                                                                                     // 873
						topic_creator = data.purpose.creator;                                                                           // 874
					}                                                                                                                // 875
				}                                                                                                                 // 876
                                                                                                                      //
				if (topic) {                                                                                                      // 878
					var creator = this.findUser(topic_creator) || this.addUser(topic_creator);                                       // 879
					logger['class'].debug('Setting room topic', rid, topic, creator.username);                                       // 880
					RocketChat.saveRoomTopic(rid, topic, creator, false);                                                            // 881
				}                                                                                                                 // 882
			}                                                                                                                  // 883
		}                                                                                                                   // 884
                                                                                                                      //
		return copyChannelInfo;                                                                                             //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.copyPins = function () {                                                                       //
		function copyPins(rid, channelMap) {                                                                                //
			var response = HTTP.get('https://slack.com/api/pins.list', { params: { token: this.apiToken, channel: channelMap.id } });
			if (response && response.data && _.isArray(response.data.items) && response.data.items.length > 0) {               // 888
				for (var _iterator6 = response.data.items, _isArray6 = Array.isArray(_iterator6), _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
					var _ref6;                                                                                                       // 889
                                                                                                                      //
					if (_isArray6) {                                                                                                 // 889
						if (_i6 >= _iterator6.length) break;                                                                            // 889
						_ref6 = _iterator6[_i6++];                                                                                      // 889
					} else {                                                                                                         // 889
						_i6 = _iterator6.next();                                                                                        // 889
						if (_i6.done) break;                                                                                            // 889
						_ref6 = _i6.value;                                                                                              // 889
					}                                                                                                                // 889
                                                                                                                      //
					var pin = _ref6;                                                                                                 // 889
                                                                                                                      //
					if (pin.message) {                                                                                               // 890
						var user = this.findUser(pin.message.user);                                                                     // 891
						var msgObj = {                                                                                                  // 892
							rid: rid,                                                                                                      // 893
							t: 'message_pinned',                                                                                           // 894
							msg: '',                                                                                                       // 895
							u: {                                                                                                           // 896
								_id: user._id,                                                                                                // 897
								username: user.username                                                                                       // 898
							},                                                                                                             // 896
							attachments: [{                                                                                                // 900
								'text': this.convertSlackMessageToRocketChat(pin.message.text),                                               // 901
								'author_name': user.username,                                                                                 // 902
								'author_icon': getAvatarUrlFromUsername(user.username),                                                       // 903
								'ts': new Date(parseInt(pin.message.ts.split('.')[0]) * 1000)                                                 // 904
							}]                                                                                                             // 900
						};                                                                                                              // 892
                                                                                                                      //
						RocketChat.models.Messages.setPinnedByIdAndUserId('slack-' + pin.channel + '-' + pin.message.ts.replace(/\./g, '-'), msgObj.u, true, new Date(parseInt(pin.message.ts.split('.')[0]) * 1000));
					}                                                                                                                // 909
				}                                                                                                                 // 910
			}                                                                                                                  // 911
		}                                                                                                                   // 912
                                                                                                                      //
		return copyPins;                                                                                                    //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.importMessages = function () {                                                                 //
		function importMessages(rid, callback) {                                                                            //
			logger['class'].info('importMessages: ', rid);                                                                     // 915
			var rocketchat_room = RocketChat.models.Rooms.findOneById(rid);                                                    // 916
			if (rocketchat_room) {                                                                                             // 917
				if (this.channelMap[rid]) {                                                                                       // 918
					this.copyChannelInfo(rid, this.channelMap[rid]);                                                                 // 919
                                                                                                                      //
					logger['class'].debug('Importing messages from Slack to Rocket.Chat', this.channelMap[rid], rid);                // 921
					var results = this.importFromHistory(this.channelMap[rid].family, { channel: this.channelMap[rid].id, oldest: 1 });
					while (results && results.has_more) {                                                                            // 923
						results = this.importFromHistory(this.channelMap[rid].family, { channel: this.channelMap[rid].id, oldest: results.ts });
					}                                                                                                                // 925
                                                                                                                      //
					logger['class'].debug('Pinning Slack channel messages to Rocket.Chat', this.channelMap[rid], rid);               // 927
					this.copyPins(rid, this.channelMap[rid]);                                                                        // 928
                                                                                                                      //
					return callback();                                                                                               // 930
				} else {                                                                                                          // 931
					var slack_room = this.findSlackChannel(rocketchat_room.name);                                                    // 932
					if (slack_room) {                                                                                                // 933
						this.channelMap[rid] = { id: slack_room.id, family: slack_room.id.charAt(0) === 'C' ? 'channels' : 'groups' };  // 934
						return this.importMessages(rid, callback);                                                                      // 935
					} else {                                                                                                         // 936
						logger['class'].error('Could not find Slack room with specified name', rocketchat_room.name);                   // 937
						return callback(new Meteor.Error('error-slack-room-not-found', 'Could not find Slack room with specified name'));
					}                                                                                                                // 939
				}                                                                                                                 // 940
			} else {                                                                                                           // 941
				logger['class'].error('Could not find Rocket.Chat room with specified id', rid);                                  // 942
				return callback(new Meteor.Error('error-invalid-room', 'Invalid room'));                                          // 943
			}                                                                                                                  // 944
		}                                                                                                                   // 945
                                                                                                                      //
		return importMessages;                                                                                              //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.populateChannelMap = function () {                                                             //
		function populateChannelMap() {                                                                                     //
			logger['class'].debug('Populating channel map');                                                                   // 948
			var response = HTTP.get('https://slack.com/api/channels.list', { params: { token: this.apiToken } });              // 949
			if (response && response.data && _.isArray(response.data.channels) && response.data.channels.length > 0) {         // 950
				for (var _iterator7 = response.data.channels, _isArray7 = Array.isArray(_iterator7), _i7 = 0, _iterator7 = _isArray7 ? _iterator7 : _iterator7[Symbol.iterator]();;) {
					var _ref7;                                                                                                       // 951
                                                                                                                      //
					if (_isArray7) {                                                                                                 // 951
						if (_i7 >= _iterator7.length) break;                                                                            // 951
						_ref7 = _iterator7[_i7++];                                                                                      // 951
					} else {                                                                                                         // 951
						_i7 = _iterator7.next();                                                                                        // 951
						if (_i7.done) break;                                                                                            // 951
						_ref7 = _i7.value;                                                                                              // 951
					}                                                                                                                // 951
                                                                                                                      //
					var channel = _ref7;                                                                                             // 951
                                                                                                                      //
					var rocketchat_room = RocketChat.models.Rooms.findOneByName(channel.name, { fields: { _id: 1 } });               // 952
					if (rocketchat_room) {                                                                                           // 953
						this.channelMap[rocketchat_room._id] = { id: channel.id, family: channel.id.charAt(0) === 'C' ? 'channels' : 'groups' };
					}                                                                                                                // 955
				}                                                                                                                 // 956
			}                                                                                                                  // 957
			response = HTTP.get('https://slack.com/api/groups.list', { params: { token: this.apiToken } });                    // 958
			if (response && response.data && _.isArray(response.data.groups) && response.data.groups.length > 0) {             // 959
				for (var _iterator8 = response.data.groups, _isArray8 = Array.isArray(_iterator8), _i8 = 0, _iterator8 = _isArray8 ? _iterator8 : _iterator8[Symbol.iterator]();;) {
					var _ref8;                                                                                                       // 960
                                                                                                                      //
					if (_isArray8) {                                                                                                 // 960
						if (_i8 >= _iterator8.length) break;                                                                            // 960
						_ref8 = _iterator8[_i8++];                                                                                      // 960
					} else {                                                                                                         // 960
						_i8 = _iterator8.next();                                                                                        // 960
						if (_i8.done) break;                                                                                            // 960
						_ref8 = _i8.value;                                                                                              // 960
					}                                                                                                                // 960
                                                                                                                      //
					var group = _ref8;                                                                                               // 960
                                                                                                                      //
					var _rocketchat_room = RocketChat.models.Rooms.findOneByName(group.name, { fields: { _id: 1 } });                // 961
					if (_rocketchat_room) {                                                                                          // 962
						this.channelMap[_rocketchat_room._id] = { id: group.id, family: group.id.charAt(0) === 'C' ? 'channels' : 'groups' };
					}                                                                                                                // 964
				}                                                                                                                 // 965
			}                                                                                                                  // 966
		}                                                                                                                   // 967
                                                                                                                      //
		return populateChannelMap;                                                                                          //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.slackBridgeOut = function () {                                                                 //
		function slackBridgeOut(message) {                                                                                  //
			// Ignore messages originating from Slack                                                                          // 970
			if (message._id.indexOf('slack-') === 0) {                                                                         // 971
				return message;                                                                                                   // 972
			}                                                                                                                  // 973
			var outChannels = RocketChat.settings.get('SlackBridge_Out_All') ? _.keys(this.channelMap) : _.pluck(RocketChat.settings.get('SlackBridge_Out_Channels'), '_id') || [];
			logger['class'].debug('Out Channels: ', outChannels);                                                              // 975
			if (outChannels.indexOf(message.rid) !== -1) {                                                                     // 976
				logger['class'].debug('Message out', message);                                                                    // 977
				this.postMessage(this.channelMap[message.rid], message);                                                          // 978
			}                                                                                                                  // 979
			return message;                                                                                                    // 980
		}                                                                                                                   // 981
                                                                                                                      //
		return slackBridgeOut;                                                                                              //
	}();                                                                                                                 //
                                                                                                                      //
	SlackBridge.prototype.postMessage = function () {                                                                    //
		function postMessage(room, message) {                                                                               //
			if (room && room.id) {                                                                                             // 984
				var data = {                                                                                                      // 985
					token: this.apiToken,                                                                                            // 986
					text: message.msg,                                                                                               // 987
					channel: room.id,                                                                                                // 988
					username: message.u && message.u.username,                                                                       // 989
					icon_url: getAvatarUrlFromUsername(message.u && message.u.username),                                             // 990
					link_names: 1                                                                                                    // 991
				};                                                                                                                // 985
				logger['class'].debug('Post Message', data);                                                                      // 993
				HTTP.post('https://slack.com/api/chat.postMessage', { params: data });                                            // 994
			}                                                                                                                  // 995
		}                                                                                                                   // 996
                                                                                                                      //
		return postMessage;                                                                                                 //
	}();                                                                                                                 //
                                                                                                                      //
	return SlackBridge;                                                                                                  //
}();                                                                                                                  //
                                                                                                                      //
RocketChat.SlackBridge = new SlackBridge();                                                                           // 999
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"slashcommand":{"slackbridge_import.server.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_slackbridge/slashcommand/slackbridge_import.server.js                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/* globals msgStream */                                                                                               // 1
function SlackBridgeImport(command, params, item) {                                                                   // 2
	var channel, room, user;                                                                                             // 3
	if (command !== 'slackbridge-import' || !Match.test(params, String)) {                                               // 4
		return;                                                                                                             // 5
	}                                                                                                                    // 6
	room = RocketChat.models.Rooms.findOneById(item.rid);                                                                // 7
	channel = room.name;                                                                                                 // 8
	user = Meteor.users.findOne(Meteor.userId());                                                                        // 9
                                                                                                                      //
	msgStream.emit(item.rid, {                                                                                           // 11
		_id: Random.id(),                                                                                                   // 12
		rid: item.rid,                                                                                                      // 13
		u: { username: 'rocket.cat' },                                                                                      // 14
		ts: new Date(),                                                                                                     // 15
		msg: TAPi18n.__('SlackBridge_start', {                                                                              // 16
			postProcess: 'sprintf',                                                                                            // 17
			sprintf: [user.username, channel]                                                                                  // 18
		}, user.language)                                                                                                   // 16
	});                                                                                                                  // 11
                                                                                                                      //
	try {                                                                                                                // 22
		RocketChat.SlackBridge.importMessages(item.rid, function (error) {                                                  // 23
			if (error) {                                                                                                       // 24
				msgStream.emit(item.rid, {                                                                                        // 25
					_id: Random.id(),                                                                                                // 26
					rid: item.rid,                                                                                                   // 27
					u: { username: 'rocket.cat' },                                                                                   // 28
					ts: new Date(),                                                                                                  // 29
					msg: TAPi18n.__('SlackBridge_error', {                                                                           // 30
						postProcess: 'sprintf',                                                                                         // 31
						sprintf: [channel, error.message]                                                                               // 32
					}, user.language)                                                                                                // 30
				});                                                                                                               // 25
			} else {                                                                                                           // 35
				msgStream.emit(item.rid, {                                                                                        // 36
					_id: Random.id(),                                                                                                // 37
					rid: item.rid,                                                                                                   // 38
					u: { username: 'rocket.cat' },                                                                                   // 39
					ts: new Date(),                                                                                                  // 40
					msg: TAPi18n.__('SlackBridge_finish', {                                                                          // 41
						postProcess: 'sprintf',                                                                                         // 42
						sprintf: [channel]                                                                                              // 43
					}, user.language)                                                                                                // 41
				});                                                                                                               // 36
			}                                                                                                                  // 46
		});                                                                                                                 // 47
	} catch (error) {                                                                                                    // 48
		msgStream.emit(item.rid, {                                                                                          // 49
			_id: Random.id(),                                                                                                  // 50
			rid: item.rid,                                                                                                     // 51
			u: { username: 'rocket.cat' },                                                                                     // 52
			ts: new Date(),                                                                                                    // 53
			msg: TAPi18n.__('SlackBridge_error', {                                                                             // 54
				postProcess: 'sprintf',                                                                                           // 55
				sprintf: [channel, error.message]                                                                                 // 56
			}, user.language)                                                                                                  // 54
		});                                                                                                                 // 49
		throw error;                                                                                                        // 59
	}                                                                                                                    // 60
	return SlackBridgeImport;                                                                                            // 61
}                                                                                                                     // 62
                                                                                                                      //
RocketChat.slashCommands.add('slackbridge-import', SlackBridgeImport);                                                // 64
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/rocketchat:slackbridge/logger.js");
require("./node_modules/meteor/rocketchat:slackbridge/settings.js");
require("./node_modules/meteor/rocketchat:slackbridge/slackbridge.js");
require("./node_modules/meteor/rocketchat:slackbridge/slashcommand/slackbridge_import.server.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:slackbridge'] = {};

})();

//# sourceMappingURL=rocketchat_slackbridge.js.map
