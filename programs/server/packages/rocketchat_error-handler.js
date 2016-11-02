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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:error-handler":{"server":{"lib":{"RocketChat.ErrorHandler.js":["babel-runtime/helpers/classCallCheck",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_error-handler/server/lib/RocketChat.ErrorHandler.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _classCallCheck;module.import('babel-runtime/helpers/classCallCheck',{"default":function(v){_classCallCheck=v}});
                                                                                                                      //
var ErrorHandler = function () {                                                                                      //
	function ErrorHandler() {                                                                                            // 2
		var _this = this;                                                                                                   // 2
                                                                                                                      //
		_classCallCheck(this, ErrorHandler);                                                                                // 2
                                                                                                                      //
		this.reporting = false;                                                                                             // 3
		this.rid = null;                                                                                                    // 4
		this.lastError = null;                                                                                              // 5
                                                                                                                      //
		this.registerHandlers();                                                                                            // 7
                                                                                                                      //
		RocketChat.settings.get('Log_Exceptions_to_Channel', function (key, value) {                                        // 9
			if (value.trim()) {                                                                                                // 10
				_this.reporting = true;                                                                                           // 11
				_this.rid = _this.getRoomId(value);                                                                               // 12
			} else {                                                                                                           // 13
				_this.reporting = false;                                                                                          // 14
				_this.rid = '';                                                                                                   // 15
			}                                                                                                                  // 16
		});                                                                                                                 // 17
	}                                                                                                                    // 18
                                                                                                                      //
	ErrorHandler.prototype.registerHandlers = function () {                                                              //
		function registerHandlers() {                                                                                       //
			var _this2 = this;                                                                                                 // 20
                                                                                                                      //
			process.on('uncaughtException', Meteor.bindEnvironment(function (error) {                                          // 21
				if (!_this2.reporting) {                                                                                          // 22
					return;                                                                                                          // 23
				}                                                                                                                 // 24
				_this2.trackError(error.message, error.stack);                                                                    // 25
			}));                                                                                                               // 26
                                                                                                                      //
			var self = this;                                                                                                   // 28
			var originalMeteorDebug = Meteor._debug;                                                                           // 29
			Meteor._debug = function (message, stack) {                                                                        // 30
				if (!self.reporting) {                                                                                            // 31
					return originalMeteorDebug.call(this, message, stack);                                                           // 32
				}                                                                                                                 // 33
				self.trackError(message, stack);                                                                                  // 34
				return originalMeteorDebug.apply(this, arguments);                                                                // 35
			};                                                                                                                 // 36
		}                                                                                                                   // 37
                                                                                                                      //
		return registerHandlers;                                                                                            //
	}();                                                                                                                 //
                                                                                                                      //
	ErrorHandler.prototype.getRoomId = function () {                                                                     //
		function getRoomId(roomName) {                                                                                      //
			roomName = roomName.replace('#');                                                                                  // 40
			var room = RocketChat.models.Rooms.findOneByName(roomName, { fields: { _id: 1, t: 1 } });                          // 41
			if (room && (room.t === 'c' || room.t === 'p')) {                                                                  // 42
				return room._id;                                                                                                  // 43
			} else {                                                                                                           // 44
				this.reporting = false;                                                                                           // 45
			}                                                                                                                  // 46
		}                                                                                                                   // 47
                                                                                                                      //
		return getRoomId;                                                                                                   //
	}();                                                                                                                 //
                                                                                                                      //
	ErrorHandler.prototype.trackError = function () {                                                                    //
		function trackError(message, stack) {                                                                               //
			if (this.reporting && this.rid && this.lastError !== message) {                                                    // 50
				this.lastError = message;                                                                                         // 51
				var user = RocketChat.models.Users.findOneById('rocket.cat');                                                     // 52
                                                                                                                      //
				if (stack) {                                                                                                      // 54
					message = message + '\n```\n' + stack + '\n```';                                                                 // 55
				}                                                                                                                 // 56
                                                                                                                      //
				RocketChat.sendMessage(user, { msg: message }, { _id: this.rid });                                                // 58
			}                                                                                                                  // 59
		}                                                                                                                   // 60
                                                                                                                      //
		return trackError;                                                                                                  //
	}();                                                                                                                 //
                                                                                                                      //
	return ErrorHandler;                                                                                                 //
}();                                                                                                                  //
                                                                                                                      //
RocketChat.ErrorHandler = new ErrorHandler();                                                                         // 63
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]},"startup":{"settings.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_error-handler/server/startup/settings.js                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
RocketChat.settings.addGroup('Logs', function () {                                                                    // 1
	this.add('Log_Exceptions_to_Channel', '', { type: 'string' });                                                       // 2
});                                                                                                                   // 3
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/rocketchat:error-handler/server/lib/RocketChat.ErrorHandler.js");
require("./node_modules/meteor/rocketchat:error-handler/server/startup/settings.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:error-handler'] = {};

})();

//# sourceMappingURL=rocketchat_error-handler.js.map
