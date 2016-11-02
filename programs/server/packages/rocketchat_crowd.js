(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var Logger = Package['rocketchat:logger'].Logger;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var ECMAScript = Package.ecmascript.ECMAScript;
var SHA256 = Package.sha.SHA256;
var Accounts = Package['accounts-base'].Accounts;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var meteorInstall = Package.modules.meteorInstall;
var Buffer = Package.modules.Buffer;
var process = Package.modules.process;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var CROWD;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:crowd":{"server":{"crowd.js":["babel-runtime/helpers/classCallCheck",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_crowd/server/crowd.js                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _classCallCheck;module.import('babel-runtime/helpers/classCallCheck',{"default":function(v){_classCallCheck=v}});
/* globals:CROWD:true */                                                                                              // 1
/* eslint new-cap: [2, {"capIsNewExceptions": ["SHA256"]}] */                                                         // 2
var logger = new Logger('CROWD', {});                                                                                 // 3
                                                                                                                      //
function fallbackDefaultAccountSystem(bind, username, password) {                                                     // 5
	if (typeof username === 'string') {                                                                                  // 6
		if (username.indexOf('@') === -1) {                                                                                 // 7
			username = { username: username };                                                                                 // 8
		} else {                                                                                                            // 9
			username = { email: username };                                                                                    // 10
		}                                                                                                                   // 11
	}                                                                                                                    // 12
                                                                                                                      //
	logger.info('Fallback to default account system', username);                                                         // 14
                                                                                                                      //
	var loginRequest = {                                                                                                 // 16
		user: username,                                                                                                     // 17
		password: {                                                                                                         // 18
			digest: SHA256(password),                                                                                          // 19
			algorithm: 'sha-256'                                                                                               // 20
		}                                                                                                                   // 18
	};                                                                                                                   // 16
                                                                                                                      //
	return Accounts._runLoginHandlers(bind, loginRequest);                                                               // 24
}                                                                                                                     // 25
                                                                                                                      //
var CROWD = function () {                                                                                             // 27
	function CROWD() {                                                                                                   // 28
		_classCallCheck(this, CROWD);                                                                                       // 28
                                                                                                                      //
		var AtlassianCrowd = Npm.require('atlassian-crowd');                                                                // 29
                                                                                                                      //
		var url = RocketChat.settings.get('CROWD_URL');                                                                     // 31
		var urlLastChar = url.slice(-1);                                                                                    // 32
                                                                                                                      //
		if (urlLastChar !== '/') {                                                                                          // 34
			url += '/';                                                                                                        // 35
		}                                                                                                                   // 36
                                                                                                                      //
		this.options = {                                                                                                    // 38
			crowd: {                                                                                                           // 39
				base: url                                                                                                         // 40
			},                                                                                                                 // 39
			application: {                                                                                                     // 42
				name: RocketChat.settings.get('CROWD_APP_USERNAME'),                                                              // 43
				password: RocketChat.settings.get('CROWD_APP_PASSWORD')                                                           // 44
			},                                                                                                                 // 42
			rejectUnauthorized: RocketChat.settings.get('CROWD_Reject_Unauthorized')                                           // 46
		};                                                                                                                  // 38
                                                                                                                      //
		this.crowdClient = new AtlassianCrowd(this.options);                                                                // 49
                                                                                                                      //
		this.crowdClient.user.authenticateSync = Meteor.wrapAsync(this.crowdClient.user.authenticate, this);                // 51
		this.crowdClient.user.findSync = Meteor.wrapAsync(this.crowdClient.user.find, this);                                // 52
		this.crowdClient.pingSync = Meteor.wrapAsync(this.crowdClient.ping, this);                                          // 53
	}                                                                                                                    // 54
                                                                                                                      //
	CROWD.prototype.checkConnection = function () {                                                                      // 27
		function checkConnection() {                                                                                        // 27
			this.crowdClient.pingSync();                                                                                       // 57
		}                                                                                                                   // 58
                                                                                                                      //
		return checkConnection;                                                                                             // 27
	}();                                                                                                                 // 27
                                                                                                                      //
	CROWD.prototype.authenticate = function () {                                                                         // 27
		function authenticate(username, password) {                                                                         // 27
			if (!username || !password) {                                                                                      // 61
				logger.error('No username or password');                                                                          // 62
				return;                                                                                                           // 63
			}                                                                                                                  // 64
                                                                                                                      //
			logger.info('Going to crowd:', username);                                                                          // 66
			var auth = this.crowdClient.user.authenticateSync(username, password);                                             // 67
                                                                                                                      //
			if (!auth) {                                                                                                       // 69
				return;                                                                                                           // 70
			}                                                                                                                  // 71
                                                                                                                      //
			var userResponse = this.crowdClient.user.findSync(username);                                                       // 73
                                                                                                                      //
			var user = {                                                                                                       // 75
				displayname: userResponse['display-name'],                                                                        // 76
				username: userResponse.name,                                                                                      // 77
				email: userResponse.email,                                                                                        // 78
				password: password,                                                                                               // 79
				active: userResponse.active                                                                                       // 80
			};                                                                                                                 // 75
                                                                                                                      //
			return user;                                                                                                       // 83
		}                                                                                                                   // 84
                                                                                                                      //
		return authenticate;                                                                                                // 27
	}();                                                                                                                 // 27
                                                                                                                      //
	CROWD.prototype.syncDataToUser = function () {                                                                       // 27
		function syncDataToUser(crowdUser, id) {                                                                            // 27
			var user = {                                                                                                       // 87
				name: crowdUser.displayname,                                                                                      // 88
				username: crowdUser.username,                                                                                     // 89
				emails: [{                                                                                                        // 90
					address: crowdUser.email,                                                                                        // 91
					verified: true                                                                                                   // 92
				}],                                                                                                               // 90
				password: crowdUser.password,                                                                                     // 94
				active: crowdUser.active                                                                                          // 95
			};                                                                                                                 // 87
                                                                                                                      //
			Meteor.users.update(id, {                                                                                          // 98
				$set: user                                                                                                        // 99
			});                                                                                                                // 98
		}                                                                                                                   // 101
                                                                                                                      //
		return syncDataToUser;                                                                                              // 27
	}();                                                                                                                 // 27
                                                                                                                      //
	CROWD.prototype.sync = function () {                                                                                 // 27
		function sync() {                                                                                                   // 27
			if (RocketChat.settings.get('CROWD_Enable') !== true) {                                                            // 104
				return;                                                                                                           // 105
			}                                                                                                                  // 106
                                                                                                                      //
			var self = this;                                                                                                   // 108
			logger.info('Sync started');                                                                                       // 109
                                                                                                                      //
			var users = RocketChat.models.Users.findCrowdUsers();                                                              // 111
			if (users) {                                                                                                       // 112
				users.forEach(function (user) {                                                                                   // 113
					logger.info('Syncing user', user.username);                                                                      // 114
					var userResponse = self.crowdClient.user.findSync(user.username);                                                // 115
					if (userResponse) {                                                                                              // 116
						var crowdUser = {                                                                                               // 117
							displayname: userResponse['display-name'],                                                                     // 118
							username: userResponse.name,                                                                                   // 119
							email: userResponse.email,                                                                                     // 120
							password: userResponse.password,                                                                               // 121
							active: userResponse.active                                                                                    // 122
						};                                                                                                              // 117
                                                                                                                      //
						self.syncDataToUser(crowdUser, user._id);                                                                       // 125
					}                                                                                                                // 126
				});                                                                                                               // 127
			}                                                                                                                  // 128
		}                                                                                                                   // 129
                                                                                                                      //
		return sync;                                                                                                        // 27
	}();                                                                                                                 // 27
                                                                                                                      //
	CROWD.prototype.addNewUser = function () {                                                                           // 27
		function addNewUser(crowdUser) {                                                                                    // 27
			var userQuery = {                                                                                                  // 132
				crowd: true,                                                                                                      // 133
				username: crowdUser.username                                                                                      // 134
			};                                                                                                                 // 132
                                                                                                                      //
			// find our existinmg user if they exist                                                                           // 137
			var user = Meteor.users.findOne(userQuery);                                                                        // 138
                                                                                                                      //
			if (user) {                                                                                                        // 140
				var stampedToken = Accounts._generateStampedLoginToken();                                                         // 141
                                                                                                                      //
				Meteor.users.update(user._id, {                                                                                   // 143
					$push: {                                                                                                         // 144
						'services.resume.loginTokens': Accounts._hashStampedToken(stampedToken)                                         // 145
					}                                                                                                                // 144
				});                                                                                                               // 143
                                                                                                                      //
				this.syncDataToUser(crowdUser, user._id);                                                                         // 149
                                                                                                                      //
				return {                                                                                                          // 151
					userId: user._id,                                                                                                // 152
					token: stampedToken.token                                                                                        // 153
				};                                                                                                                // 151
			} else {                                                                                                           // 155
				try {                                                                                                             // 156
					crowdUser._id = Accounts.createUser(crowdUser);                                                                  // 157
				} catch (error) {                                                                                                 // 158
					logger.info('Error creating new user for crowd user', error);                                                    // 159
				}                                                                                                                 // 160
                                                                                                                      //
				var updateUser = {                                                                                                // 162
					name: crowdUser.displayname,                                                                                     // 163
					crowd: true,                                                                                                     // 164
					active: crowdUser.active                                                                                         // 165
				};                                                                                                                // 162
                                                                                                                      //
				Meteor.users.update(crowdUser._id, {                                                                              // 168
					$set: updateUser                                                                                                 // 169
				});                                                                                                               // 168
			}                                                                                                                  // 171
                                                                                                                      //
			Meteor.runAsUser(crowdUser._id, function () {                                                                      // 173
				Meteor.call('joinDefaultChannels');                                                                               // 174
			});                                                                                                                // 175
                                                                                                                      //
			return {                                                                                                           // 177
				userId: crowdUser._id                                                                                             // 178
			};                                                                                                                 // 177
		}                                                                                                                   // 180
                                                                                                                      //
		return addNewUser;                                                                                                  // 27
	}();                                                                                                                 // 27
                                                                                                                      //
	return CROWD;                                                                                                        // 27
}();                                                                                                                  // 27
                                                                                                                      //
Accounts.registerLoginHandler('crowd', function (loginRequest) {                                                      // 183
	if (!loginRequest.crowd) {                                                                                           // 184
		return undefined;                                                                                                   // 185
	}                                                                                                                    // 186
                                                                                                                      //
	logger.info('Init CROWD login', loginRequest.username);                                                              // 188
                                                                                                                      //
	if (RocketChat.settings.get('CROWD_Enable') !== true) {                                                              // 190
		return fallbackDefaultAccountSystem(this, loginRequest.username, loginRequest.crowdPassword);                       // 191
	}                                                                                                                    // 192
                                                                                                                      //
	var crowd = new CROWD();                                                                                             // 194
	var user = void 0;                                                                                                   // 195
	try {                                                                                                                // 196
		user = crowd.authenticate(loginRequest.username, loginRequest.crowdPassword);                                       // 197
	} catch (error) {                                                                                                    // 198
		logger.error('Crowd user not authenticated due to an error, falling back');                                         // 199
	}                                                                                                                    // 200
                                                                                                                      //
	if (!user) {                                                                                                         // 202
		return fallbackDefaultAccountSystem(this, loginRequest.username, loginRequest.crowdPassword);                       // 203
	}                                                                                                                    // 204
                                                                                                                      //
	return crowd.addNewUser(user);                                                                                       // 206
});                                                                                                                   // 207
                                                                                                                      //
var interval = void 0;                                                                                                // 209
var timeout = void 0;                                                                                                 // 210
                                                                                                                      //
RocketChat.settings.get('CROWD_Sync_User_Data', function (key, value) {                                               // 212
	Meteor.clearInterval(interval);                                                                                      // 213
	Meteor.clearTimeout(timeout);                                                                                        // 214
                                                                                                                      //
	if (value === true) {                                                                                                // 216
		(function () {                                                                                                      // 216
			var crowd = new CROWD();                                                                                           // 217
			logger.info('Enabling CROWD user sync');                                                                           // 218
			Meteor.setInterval(crowd.sync, 1000 * 60 * 60);                                                                    // 219
			Meteor.setTimeout(function () {                                                                                    // 220
				crowd.sync();                                                                                                     // 221
			}, 1000 * 30);                                                                                                     // 222
		})();                                                                                                               // 216
	} else {                                                                                                             // 223
		logger.info('Disabling CROWD user sync');                                                                           // 224
	}                                                                                                                    // 225
});                                                                                                                   // 226
                                                                                                                      //
Meteor.methods({                                                                                                      // 228
	crowd_test_connection: function () {                                                                                 // 229
		function crowd_test_connection() {                                                                                  // 229
			var user = Meteor.user();                                                                                          // 230
			if (!user) {                                                                                                       // 231
				throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'crowd_test_connection' });                // 232
			}                                                                                                                  // 233
                                                                                                                      //
			if (!RocketChat.authz.hasRole(user._id, 'admin')) {                                                                // 235
				throw new Meteor.Error('error-not-authorized', 'Not authorized', { method: 'crowd_test_connection' });            // 236
			}                                                                                                                  // 237
                                                                                                                      //
			if (RocketChat.settings.get('CROWD_Enable') !== true) {                                                            // 239
				throw new Meteor.Error('crowd_disabled');                                                                         // 240
			}                                                                                                                  // 241
                                                                                                                      //
			var crowd = new CROWD();                                                                                           // 243
                                                                                                                      //
			try {                                                                                                              // 245
				crowd.checkConnection();                                                                                          // 246
			} catch (error) {                                                                                                  // 247
				logger.error('Invalid crowd connection details, check the url and application username/password and make sure this server is allowed to speak to crowd');
				throw new Meteor.Error('Invalid connection details', '', { method: 'crowd_test_connection' });                    // 249
			}                                                                                                                  // 250
                                                                                                                      //
			return {                                                                                                           // 252
				message: 'Connection success',                                                                                    // 253
				params: []                                                                                                        // 254
			};                                                                                                                 // 252
		}                                                                                                                   // 256
                                                                                                                      //
		return crowd_test_connection;                                                                                       // 229
	}()                                                                                                                  // 229
});                                                                                                                   // 228
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"settings.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_crowd/server/settings.js                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.startup(function () {                                                                                          // 1
	RocketChat.settings.addGroup('AtlassianCrowd', function () {                                                         // 2
		var enableQuery = { _id: 'CROWD_Enable', value: true };                                                             // 3
		this.add('CROWD_Enable', false, { type: 'boolean', 'public': true, i18nLabel: 'Enabled' });                         // 4
		this.add('CROWD_URL', '', { type: 'string', enableQuery: enableQuery, i18nLabel: 'URL' });                          // 5
		this.add('CROWD_Reject_Unauthorized', true, { type: 'boolean', enableQuery: enableQuery });                         // 6
		this.add('CROWD_APP_USERNAME', '', { type: 'string', enableQuery: enableQuery, i18nLabel: 'Username' });            // 7
		this.add('CROWD_APP_PASSWORD', '', { type: 'password', enableQuery: enableQuery, i18nLabel: 'Password' });          // 8
		this.add('CROWD_Sync_User_Data', false, { type: 'boolean', enableQuery: enableQuery, i18nLabel: 'Sync_Users' });    // 9
		this.add('CROWD_Test_Connection', 'crowd_test_connection', { type: 'action', actionText: 'Test_Connection', i18nLabel: 'Test_Connection' });
	});                                                                                                                  // 11
});                                                                                                                   // 12
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/rocketchat:crowd/server/crowd.js");
require("./node_modules/meteor/rocketchat:crowd/server/settings.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['rocketchat:crowd'] = {}, {
  CROWD: CROWD
});

})();

//# sourceMappingURL=rocketchat_crowd.js.map
