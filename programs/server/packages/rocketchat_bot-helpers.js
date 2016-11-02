(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var Accounts = Package['accounts-base'].Accounts;
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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:bot-helpers":{"server":{"index.js":["babel-runtime/helpers/classCallCheck","babel-runtime/helpers/createClass",function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                               //
// packages/rocketchat_bot-helpers/server/index.js                                               //
//                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                 //
var _classCallCheck;module.import('babel-runtime/helpers/classCallCheck',{"default":function(v){_classCallCheck=v}});var _createClass;module.import('babel-runtime/helpers/createClass',{"default":function(v){_createClass=v}});
                                                                                                 //
                                                                                                 //
/**                                                                                              // 1
 * BotHelpers helps bots                                                                         //
 * "private" properties use meteor collection cursors, so they stay reactive                     //
 * "public" properties use getters to fetch and filter collections as array                      //
 */                                                                                              //
var BotHelpers = function () {                                                                   //
	function BotHelpers() {                                                                         // 7
		_classCallCheck(this, BotHelpers);                                                             // 7
                                                                                                 //
		this.queries = {                                                                               // 8
			online: { 'status': { $ne: 'offline' } },                                                     // 9
			users: { 'roles': { $not: { $all: ['bot'] } } }                                               // 10
		};                                                                                             // 8
	}                                                                                               // 12
                                                                                                 //
	// setup collection cursors with array of fields from setting                                   // 14
                                                                                                 //
                                                                                                 //
	BotHelpers.prototype.setupCursors = function () {                                               //
		function setupCursors(fieldsSetting) {                                                         //
			var _this = this;                                                                             // 15
                                                                                                 //
			this.userFields = {};                                                                         // 16
			if (typeof fieldsSetting === 'string') {                                                      // 17
				fieldsSetting = fieldsSetting.split(',');                                                    // 18
			}                                                                                             // 19
			fieldsSetting.forEach(function (n) {                                                          // 20
				_this.userFields[n.trim()] = 1;                                                              // 21
			});                                                                                           // 22
			this._allUsers = Meteor.users.find(this.queries.users, { fields: this.userFields });          // 23
			this._onlineUsers = Meteor.users.find({ $and: [this.queries.users, this.queries.online] }, { fields: this.userFields });
		}                                                                                              // 25
                                                                                                 //
		return setupCursors;                                                                           //
	}();                                                                                            //
                                                                                                 //
	// request methods or props as arguments to Meteor.call                                         // 27
                                                                                                 //
                                                                                                 //
	BotHelpers.prototype.request = function () {                                                    //
		function request(prop) {                                                                       //
			if (typeof this[prop] === 'undefined') {                                                      // 29
				return null;                                                                                 // 30
			} else if (typeof this[prop] === 'function') {                                                // 31
				return this[prop]();                                                                         // 32
			} else {                                                                                      // 33
				return this[prop];                                                                           // 34
			}                                                                                             // 35
		}                                                                                              // 36
                                                                                                 //
		return request;                                                                                //
	}();                                                                                            //
                                                                                                 //
	// generic error whenever property access insufficient to fill request                          // 38
                                                                                                 //
                                                                                                 //
	BotHelpers.prototype.requestError = function () {                                               //
		function requestError() {                                                                      //
			throw new Meteor.Error('error-not-allowed', 'Bot request not allowed', { method: 'botRequest', action: 'bot_request' });
		}                                                                                              // 41
                                                                                                 //
		return requestError;                                                                           //
	}();                                                                                            //
                                                                                                 //
	// "public" properties accessed by getters                                                      // 43
	// allUsers / onlineUsers return whichever properties are enabled by settings                   // 44
                                                                                                 //
                                                                                                 //
	_createClass(BotHelpers, [{                                                                     //
		key: 'allUsers',                                                                               //
		get: function () {                                                                             //
			function get() {                                                                              //
				if (!this.userFields.length) {                                                               // 46
					this.requestError();                                                                        // 47
					return false;                                                                               // 48
				} else {                                                                                     // 49
					return this._allUsers.fetch();                                                              // 50
				}                                                                                            // 51
			}                                                                                             // 52
                                                                                                 //
			return get;                                                                                   //
		}()                                                                                            //
	}, {                                                                                            //
		key: 'onlineUsers',                                                                            //
		get: function () {                                                                             //
			function get() {                                                                              //
				if (!this.userFields.length) {                                                               // 54
					this.requestError();                                                                        // 55
					return false;                                                                               // 56
				} else {                                                                                     // 57
					return this._onlineUsers.fetch();                                                           // 58
				}                                                                                            // 59
			}                                                                                             // 60
                                                                                                 //
			return get;                                                                                   //
		}()                                                                                            //
	}, {                                                                                            //
		key: 'allUsernames',                                                                           //
		get: function () {                                                                             //
			function get() {                                                                              //
				if (!this.userFields.hasOwnProperty('username')) {                                           // 62
					this.requestError();                                                                        // 63
					return false;                                                                               // 64
				} else {                                                                                     // 65
					return this._allUsers.fetch().map(function (user) {                                         // 66
						return user.username;                                                                      // 66
					});                                                                                         // 66
				}                                                                                            // 67
			}                                                                                             // 68
                                                                                                 //
			return get;                                                                                   //
		}()                                                                                            //
	}, {                                                                                            //
		key: 'onlineUsernames',                                                                        //
		get: function () {                                                                             //
			function get() {                                                                              //
				if (!this.userFields.hasOwnProperty('username')) {                                           // 70
					this.requestError();                                                                        // 71
					return false;                                                                               // 72
				} else {                                                                                     // 73
					return this._onlineUsers.fetch().map(function (user) {                                      // 74
						return user.username;                                                                      // 74
					});                                                                                         // 74
				}                                                                                            // 75
			}                                                                                             // 76
                                                                                                 //
			return get;                                                                                   //
		}()                                                                                            //
	}, {                                                                                            //
		key: 'allNames',                                                                               //
		get: function () {                                                                             //
			function get() {                                                                              //
				if (!this.userFields.hasOwnProperty('name')) {                                               // 78
					this.requestError();                                                                        // 79
					return false;                                                                               // 80
				} else {                                                                                     // 81
					return this._allUsers.fetch().map(function (user) {                                         // 82
						return user.name;                                                                          // 82
					});                                                                                         // 82
				}                                                                                            // 83
			}                                                                                             // 84
                                                                                                 //
			return get;                                                                                   //
		}()                                                                                            //
	}, {                                                                                            //
		key: 'onlineNames',                                                                            //
		get: function () {                                                                             //
			function get() {                                                                              //
				if (!this.userFields.hasOwnProperty('name')) {                                               // 86
					this.requestError();                                                                        // 87
					return false;                                                                               // 88
				} else {                                                                                     // 89
					return this._onlineUsers.fetch().map(function (user) {                                      // 90
						return user.name;                                                                          // 90
					});                                                                                         // 90
				}                                                                                            // 91
			}                                                                                             // 92
                                                                                                 //
			return get;                                                                                   //
		}()                                                                                            //
	}, {                                                                                            //
		key: 'allIDs',                                                                                 //
		get: function () {                                                                             //
			function get() {                                                                              //
				if (!this.userFields.hasOwnProperty('_id') || !this.userFields.hasOwnProperty('username')) {
					this.requestError();                                                                        // 95
					return false;                                                                               // 96
				} else {                                                                                     // 97
					return this._allUsers.fetch().map(function (user) {                                         // 98
						return { 'id': user._id, 'name': user.username };                                          // 99
					});                                                                                         // 100
				}                                                                                            // 101
			}                                                                                             // 102
                                                                                                 //
			return get;                                                                                   //
		}()                                                                                            //
	}, {                                                                                            //
		key: 'onlineIDs',                                                                              //
		get: function () {                                                                             //
			function get() {                                                                              //
				if (!this.userFields.hasOwnProperty('_id') || !this.userFields.hasOwnProperty('username')) {
					this.requestError();                                                                        // 105
					return false;                                                                               // 106
				} else {                                                                                     // 107
					return this._onlineUsers.fetch().map(function (user) {                                      // 108
						return { 'id': user._id, 'name': user.username };                                          // 109
					});                                                                                         // 110
				}                                                                                            // 111
			}                                                                                             // 112
                                                                                                 //
			return get;                                                                                   //
		}()                                                                                            //
	}]);                                                                                            //
                                                                                                 //
	return BotHelpers;                                                                              //
}();                                                                                             //
                                                                                                 //
// add class to meteor methods                                                                   // 115
                                                                                                 //
                                                                                                 //
var botHelpers = new BotHelpers();                                                               // 116
                                                                                                 //
// init cursors with fields setting and update on setting change                                 // 118
RocketChat.settings.get('BotHelpers_userFields', function (settingKey, settingValue) {           // 119
	botHelpers.setupCursors(settingValue);                                                          // 120
});                                                                                              // 121
                                                                                                 //
Meteor.methods({                                                                                 // 123
	botRequest: function () {                                                                       // 124
		function botRequest() {                                                                        // 124
			var userID = Meteor.userId();                                                                 // 125
			if (userID && RocketChat.authz.hasRole(userID, 'bot')) {                                      // 126
				return botHelpers.request.apply(botHelpers, arguments);                                      // 127
			} else {                                                                                      // 128
				throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'botRequest' });      // 129
			}                                                                                             // 130
		}                                                                                              // 131
                                                                                                 //
		return botRequest;                                                                             // 124
	}()                                                                                             // 124
});                                                                                              // 123
///////////////////////////////////////////////////////////////////////////////////////////////////

}],"settings.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                               //
// packages/rocketchat_bot-helpers/server/settings.js                                            //
//                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                 //
Meteor.startup(function () {                                                                     // 1
	RocketChat.settings.addGroup('Bots', function () {                                              // 2
		this.add('BotHelpers_userFields', '_id, name, username, emails, language, utcOffset', {        // 3
			type: 'string',                                                                               // 4
			section: 'Helpers',                                                                           // 5
			i18nLabel: 'BotHelpers_userFields',                                                           // 6
			i18nDescription: 'BotHelpers_userFields_Description'                                          // 7
		});                                                                                            // 3
	});                                                                                             // 9
});                                                                                              // 10
///////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/rocketchat:bot-helpers/server/index.js");
require("./node_modules/meteor/rocketchat:bot-helpers/server/settings.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:bot-helpers'] = {};

})();

//# sourceMappingURL=rocketchat_bot-helpers.js.map
