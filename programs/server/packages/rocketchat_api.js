(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var ECMAScript = Package.ecmascript.ECMAScript;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var Restivus = Package['nimble:restivus'].Restivus;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var meteorInstall = Package.modules.meteorInstall;
var Buffer = Package.modules.Buffer;
var process = Package.modules.process;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:api":{"server":{"api.coffee.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/rocketchat_api/server/api.coffee.js                                                                 //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var API,                                                                                                        // 1
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;                                                                                  //
                                                                                                                //
API = (function(superClass) {                                                                                   // 1
  extend(API, superClass);                                                                                      //
                                                                                                                //
  function API() {                                                                                              //
    this.authMethods = [];                                                                                      //
    API.__super__.constructor.apply(this, arguments);                                                           //
  }                                                                                                             //
                                                                                                                //
  API.prototype.addAuthMethod = function(method) {                                                              //
    return this.authMethods.push(method);                                                                       //
  };                                                                                                            //
                                                                                                                //
  API.prototype.success = function(result) {                                                                    //
    if (result == null) {                                                                                       //
      result = {};                                                                                              //
    }                                                                                                           //
    if (_.isObject(result)) {                                                                                   //
      result.success = true;                                                                                    //
    }                                                                                                           //
    return {                                                                                                    // 13
      statusCode: 200,                                                                                          //
      body: result                                                                                              //
    };                                                                                                          //
  };                                                                                                            //
                                                                                                                //
  API.prototype.failure = function(result) {                                                                    //
    if (_.isObject(result)) {                                                                                   //
      result.success = false;                                                                                   //
    } else {                                                                                                    //
      result = {                                                                                                //
        success: false,                                                                                         //
        error: result                                                                                           //
      };                                                                                                        //
    }                                                                                                           //
    return {                                                                                                    // 25
      statusCode: 400,                                                                                          //
      body: result                                                                                              //
    };                                                                                                          //
  };                                                                                                            //
                                                                                                                //
  API.prototype.unauthorized = function(msg) {                                                                  //
    return {                                                                                                    // 30
      statusCode: 403,                                                                                          //
      body: {                                                                                                   //
        success: false,                                                                                         //
        error: msg || 'unauthorized'                                                                            //
      }                                                                                                         //
    };                                                                                                          //
  };                                                                                                            //
                                                                                                                //
  return API;                                                                                                   //
                                                                                                                //
})(Restivus);                                                                                                   //
                                                                                                                //
RocketChat.API = {};                                                                                            // 37
                                                                                                                //
RocketChat.API.v1 = new API({                                                                                   // 40
  version: 'v1',                                                                                                //
  useDefaultAuth: true,                                                                                         //
  prettyJson: true,                                                                                             //
  enableCors: false,                                                                                            //
  auth: {                                                                                                       //
    token: 'services.resume.loginTokens.hashedToken',                                                           //
    user: function() {                                                                                          //
      var i, len, method, ref, ref1, result, token;                                                             // 48
      if (((ref = this.bodyParams) != null ? ref.payload : void 0) != null) {                                   //
        this.bodyParams = JSON.parse(this.bodyParams.payload);                                                  //
      }                                                                                                         //
      ref1 = RocketChat.API.v1.authMethods;                                                                     // 51
      for (i = 0, len = ref1.length; i < len; i++) {                                                            // 51
        method = ref1[i];                                                                                       //
        result = method.apply(this, arguments);                                                                 //
        if (result !== (void 0) && result !== null && result !== false) {                                       //
          return result;                                                                                        // 54
        }                                                                                                       //
      }                                                                                                         // 51
      if (this.request.headers['x-auth-token']) {                                                               //
        token = Accounts._hashLoginToken(this.request.headers['x-auth-token']);                                 //
      }                                                                                                         //
      return {                                                                                                  // 59
        userId: this.request.headers['x-user-id'],                                                              //
        token: token                                                                                            //
      };                                                                                                        //
    }                                                                                                           //
  }                                                                                                             //
});                                                                                                             //
                                                                                                                //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"routes.coffee.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/rocketchat_api/server/routes.coffee.js                                                              //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.API.v1.addRoute('info', {                                                                            // 1
  authRequired: false                                                                                           //
}, {                                                                                                            //
  get: function() {                                                                                             //
    return RocketChat.Info;                                                                                     //
  }                                                                                                             //
});                                                                                                             //
                                                                                                                //
RocketChat.API.v1.addRoute('me', {                                                                              // 5
  authRequired: true                                                                                            //
}, {                                                                                                            //
  get: function() {                                                                                             //
    return _.pick(this.user, ['_id', 'name', 'emails', 'status', 'statusConnection', 'username', 'utcOffset', 'active', 'language']);
  }                                                                                                             //
});                                                                                                             //
                                                                                                                //
RocketChat.API.v1.addRoute('chat.messageExamples', {                                                            // 21
  authRequired: true                                                                                            //
}, {                                                                                                            //
  get: function() {                                                                                             //
    return RocketChat.API.v1.success({                                                                          // 23
      body: [                                                                                                   //
        {                                                                                                       //
          token: Random.id(24),                                                                                 //
          channel_id: Random.id(),                                                                              //
          channel_name: 'general',                                                                              //
          timestamp: new Date,                                                                                  //
          user_id: Random.id(),                                                                                 //
          user_name: 'rocket.cat',                                                                              //
          text: 'Sample text 1',                                                                                //
          trigger_word: 'Sample'                                                                                //
        }, {                                                                                                    //
          token: Random.id(24),                                                                                 //
          channel_id: Random.id(),                                                                              //
          channel_name: 'general',                                                                              //
          timestamp: new Date,                                                                                  //
          user_id: Random.id(),                                                                                 //
          user_name: 'rocket.cat',                                                                              //
          text: 'Sample text 2',                                                                                //
          trigger_word: 'Sample'                                                                                //
        }, {                                                                                                    //
          token: Random.id(24),                                                                                 //
          channel_id: Random.id(),                                                                              //
          channel_name: 'general',                                                                              //
          timestamp: new Date,                                                                                  //
          user_id: Random.id(),                                                                                 //
          user_name: 'rocket.cat',                                                                              //
          text: 'Sample text 3',                                                                                //
          trigger_word: 'Sample'                                                                                //
        }                                                                                                       //
      ]                                                                                                         //
    });                                                                                                         //
  }                                                                                                             //
});                                                                                                             //
                                                                                                                //
RocketChat.API.v1.addRoute('chat.postMessage', {                                                                // 55
  authRequired: true                                                                                            //
}, {                                                                                                            //
  post: function() {                                                                                            //
    var e, messageReturn;                                                                                       // 57
    try {                                                                                                       // 57
      messageReturn = processWebhookMessage(this.bodyParams, this.user);                                        //
      if (messageReturn == null) {                                                                              //
        return RocketChat.API.v1.failure('unknown-error');                                                      // 61
      }                                                                                                         //
      return RocketChat.API.v1.success({                                                                        // 63
        ts: Date.now(),                                                                                         //
        channel: messageReturn.channel,                                                                         //
        message: messageReturn.message                                                                          //
      });                                                                                                       //
    } catch (error) {                                                                                           //
      e = error;                                                                                                //
      return RocketChat.API.v1.failure(e.error);                                                                // 68
    }                                                                                                           //
  }                                                                                                             //
});                                                                                                             //
                                                                                                                //
RocketChat.API.v1.addRoute('channels.setTopic', {                                                               // 71
  authRequired: true                                                                                            //
}, {                                                                                                            //
  post: function() {                                                                                            //
    if (this.bodyParams.channel == null) {                                                                      //
      return RocketChat.API.v1.failure('Body param "channel" is required');                                     // 74
    }                                                                                                           //
    if (this.bodyParams.topic == null) {                                                                        //
      return RocketChat.API.v1.failure('Body param "topic" is required');                                       // 77
    }                                                                                                           //
    if (!RocketChat.authz.hasPermission(this.userId, 'edit-room', this.bodyParams.channel)) {                   //
      return RocketChat.API.v1.unauthorized();                                                                  // 80
    }                                                                                                           //
    if (!RocketChat.saveRoomTopic(this.bodyParams.channel, this.bodyParams.topic, this.user)) {                 //
      return RocketChat.API.v1.failure('invalid_channel');                                                      // 83
    }                                                                                                           //
    return RocketChat.API.v1.success({                                                                          // 85
      topic: this.bodyParams.topic                                                                              //
    });                                                                                                         //
  }                                                                                                             //
});                                                                                                             //
                                                                                                                //
RocketChat.API.v1.addRoute('channels.create', {                                                                 // 90
  authRequired: true                                                                                            //
}, {                                                                                                            //
  post: function() {                                                                                            //
    var e, id;                                                                                                  // 92
    if (this.bodyParams.name == null) {                                                                         //
      return RocketChat.API.v1.failure('Body param "name" is required');                                        // 93
    }                                                                                                           //
    if (!RocketChat.authz.hasPermission(this.userId, 'create-c')) {                                             //
      return RocketChat.API.v1.unauthorized();                                                                  // 96
    }                                                                                                           //
    id = void 0;                                                                                                //
    try {                                                                                                       // 99
      Meteor.runAsUser(this.userId, (function(_this) {                                                          //
        return function() {                                                                                     //
          return id = Meteor.call('createChannel', _this.bodyParams.name, []);                                  //
        };                                                                                                      //
      })(this));                                                                                                //
    } catch (error) {                                                                                           //
      e = error;                                                                                                //
      return RocketChat.API.v1.failure(e.name + ': ' + e.message);                                              // 103
    }                                                                                                           //
    return RocketChat.API.v1.success({                                                                          // 105
      channel: RocketChat.models.Rooms.findOneById(id.rid)                                                      //
    });                                                                                                         //
  }                                                                                                             //
});                                                                                                             //
                                                                                                                //
RocketChat.API.v1.addRoute('groups.list', {                                                                     // 109
  authRequired: true                                                                                            //
}, {                                                                                                            //
  get: function() {                                                                                             //
    var roomIds;                                                                                                // 111
    roomIds = _.pluck(RocketChat.models.Subscriptions.findByTypeAndUserId('p', this.userId).fetch(), 'rid');    //
    return {                                                                                                    // 112
      groups: RocketChat.models.Rooms.findByIds(roomIds).fetch()                                                //
    };                                                                                                          //
  }                                                                                                             //
});                                                                                                             //
                                                                                                                //
RocketChat.API.v1.addRoute('channel.addall', {                                                                  // 115
  authRequired: true                                                                                            //
}, {                                                                                                            //
  post: function() {                                                                                            //
    var e, id;                                                                                                  // 118
    id = void 0;                                                                                                //
    try {                                                                                                       // 119
      Meteor.runAsUser(this.userId, (function(_this) {                                                          //
        return function() {                                                                                     //
          return id = Meteor.call('addAllUserToRoom', _this.bodyParams.roomId, []);                             //
        };                                                                                                      //
      })(this));                                                                                                //
    } catch (error) {                                                                                           //
      e = error;                                                                                                //
      return RocketChat.API.v1.failure(e.name + ': ' + e.message);                                              // 123
    }                                                                                                           //
    return RocketChat.API.v1.success({                                                                          // 125
      channel: RocketChat.models.Rooms.findOneById(this.bodyParams.roomId)                                      //
    });                                                                                                         //
  }                                                                                                             //
});                                                                                                             //
                                                                                                                //
RocketChat.API.v1.addRoute('users.list', {                                                                      // 129
  authRequired: true                                                                                            //
}, {                                                                                                            //
  get: function() {                                                                                             //
    if (RocketChat.authz.hasRole(this.userId, 'admin') === false) {                                             //
      return RocketChat.API.v1.unauthorized();                                                                  // 132
    }                                                                                                           //
    return {                                                                                                    // 134
      users: RocketChat.models.Users.find().fetch()                                                             //
    };                                                                                                          //
  }                                                                                                             //
});                                                                                                             //
                                                                                                                //
RocketChat.API.v1.addRoute('users.create', {                                                                    // 137
  authRequired: true                                                                                            //
}, {                                                                                                            //
  post: function() {                                                                                            //
    var e, nameValidation, newUserId, user, userData;                                                           // 139
    try {                                                                                                       // 139
      check(this.bodyParams, {                                                                                  //
        email: String,                                                                                          //
        name: String,                                                                                           //
        password: String,                                                                                       //
        username: String,                                                                                       //
        role: Match.Maybe(String),                                                                              //
        joinDefaultChannels: Match.Maybe(Boolean),                                                              //
        requirePasswordChange: Match.Maybe(Boolean),                                                            //
        sendWelcomeEmail: Match.Maybe(Boolean),                                                                 //
        verified: Match.Maybe(Boolean),                                                                         //
        customFields: Match.Maybe(Object)                                                                       //
      });                                                                                                       //
      try {                                                                                                     // 153
        nameValidation = new RegExp('^' + RocketChat.settings.get('UTF8_Names_Validation') + '$');              //
      } catch (error) {                                                                                         //
        nameValidation = new RegExp('^[0-9a-zA-Z-_.]+$');                                                       //
      }                                                                                                         //
      if (!nameValidation.test(this.bodyParams.username)) {                                                     //
        return RocketChat.API.v1.failure('Invalid username');                                                   // 159
      }                                                                                                         //
      if (!RocketChat.checkUsernameAvailability(this.bodyParams.username)) {                                    //
        return RocketChat.API.v1.failure('Username not available');                                             // 162
      }                                                                                                         //
      userData = {};                                                                                            //
      newUserId = RocketChat.saveUser(this.userId, this.bodyParams);                                            //
      if (this.bodyParams.customFields != null) {                                                               //
        RocketChat.saveCustomFields(newUserId, this.bodyParams.customFields);                                   //
      }                                                                                                         //
      user = RocketChat.models.Users.findOneById(newUserId);                                                    //
      if (typeof this.bodyParams.joinDefaultChannels === 'undefined' || this.bodyParams.joinDefaultChannels) {  //
        RocketChat.addUserToDefaultChannels(user);                                                              //
      }                                                                                                         //
      return RocketChat.API.v1.success({                                                                        // 176
        user: user                                                                                              //
      });                                                                                                       //
    } catch (error) {                                                                                           //
      e = error;                                                                                                //
      return RocketChat.API.v1.failure(e.name + ': ' + e.message);                                              // 179
    }                                                                                                           //
  }                                                                                                             //
});                                                                                                             //
                                                                                                                //
RocketChat.API.v1.addRoute('user.update', {                                                                     // 182
  authRequired: true                                                                                            //
}, {                                                                                                            //
  post: function() {                                                                                            //
    var e, userData;                                                                                            // 184
    try {                                                                                                       // 184
      check(this.bodyParams, {                                                                                  //
        userId: String,                                                                                         //
        data: {                                                                                                 //
          email: Match.Maybe(String),                                                                           //
          name: Match.Maybe(String),                                                                            //
          password: Match.Maybe(String),                                                                        //
          username: Match.Maybe(String),                                                                        //
          role: Match.Maybe(String),                                                                            //
          joinDefaultChannels: Match.Maybe(Boolean),                                                            //
          requirePasswordChange: Match.Maybe(Boolean),                                                          //
          sendWelcomeEmail: Match.Maybe(Boolean),                                                               //
          verified: Match.Maybe(Boolean),                                                                       //
          customFields: Match.Maybe(Object)                                                                     //
        }                                                                                                       //
      });                                                                                                       //
      userData = _.extend({                                                                                     //
        _id: this.bodyParams.userId                                                                             //
      }, this.bodyParams.data);                                                                                 //
      RocketChat.saveUser(this.userId, userData);                                                               //
      if (this.bodyParams.data.customFields != null) {                                                          //
        RocketChat.saveCustomFields(this.bodyParams.userId, this.bodyParams.data.customFields);                 //
      }                                                                                                         //
      return RocketChat.API.v1.success({                                                                        // 206
        user: RocketChat.models.Users.findOneById(this.bodyParams.userId)                                       //
      });                                                                                                       //
    } catch (error) {                                                                                           //
      e = error;                                                                                                //
      return RocketChat.API.v1.failure(e.name + ': ' + e.message);                                              // 209
    }                                                                                                           //
  }                                                                                                             //
});                                                                                                             //
                                                                                                                //
RocketChat.API.v1.addRoute('user.info', {                                                                       // 212
  authRequired: true                                                                                            //
}, {                                                                                                            //
  post: function() {                                                                                            //
    if (RocketChat.authz.hasRole(this.userId, 'admin') === false) {                                             //
      return RocketChat.API.v1.unauthorized();                                                                  // 215
    }                                                                                                           //
    return {                                                                                                    // 217
      user: RocketChat.models.Users.findOneByUsername(this.bodyParams.name)                                     //
    };                                                                                                          //
  }                                                                                                             //
});                                                                                                             //
                                                                                                                //
RocketChat.API.v1.addRoute('user.getpresence', {                                                                // 220
  authRequired: true                                                                                            //
}, {                                                                                                            //
  post: function() {                                                                                            //
    return {                                                                                                    // 222
      user: RocketChat.models.Users.findOne({                                                                   //
        username: this.bodyParams.name                                                                          //
      }, {                                                                                                      //
        fields: {                                                                                               //
          status: 1                                                                                             //
        }                                                                                                       //
      })                                                                                                        //
    };                                                                                                          //
  }                                                                                                             //
});                                                                                                             //
                                                                                                                //
RocketChat.API.v1.addRoute('users.delete', {                                                                    // 225
  authRequired: true                                                                                            //
}, {                                                                                                            //
  post: function() {                                                                                            //
    var e, id;                                                                                                  // 227
    if (this.bodyParams.userId == null) {                                                                       //
      return RocketChat.API.v1.failure('Body param "userId" is required');                                      // 228
    }                                                                                                           //
    if (!RocketChat.authz.hasPermission(this.userId, 'delete-user')) {                                          //
      return RocketChat.API.v1.unauthorized();                                                                  // 231
    }                                                                                                           //
    id = void 0;                                                                                                //
    try {                                                                                                       // 234
      Meteor.runAsUser(this.userId, (function(_this) {                                                          //
        return function() {                                                                                     //
          return id = Meteor.call('deleteUser', _this.bodyParams.userId, []);                                   //
        };                                                                                                      //
      })(this));                                                                                                //
    } catch (error) {                                                                                           //
      e = error;                                                                                                //
      return RocketChat.API.v1.failure(e.name + ': ' + e.message);                                              // 238
    }                                                                                                           //
    return RocketChat.API.v1.success;                                                                           // 240
  }                                                                                                             //
});                                                                                                             //
                                                                                                                //
RocketChat.API.v1.addRoute('groups.create', {                                                                   // 243
  authRequired: true                                                                                            //
}, {                                                                                                            //
  post: function() {                                                                                            //
    var e, id;                                                                                                  // 245
    if (this.bodyParams.name == null) {                                                                         //
      return RocketChat.API.v1.failure('Body param "name" is required');                                        // 246
    }                                                                                                           //
    if (!RocketChat.authz.hasPermission(this.userId, 'create-p')) {                                             //
      return RocketChat.API.v1.unauthorized();                                                                  // 249
    }                                                                                                           //
    id = void 0;                                                                                                //
    try {                                                                                                       // 252
      if (this.bodyParams.members == null) {                                                                    //
        Meteor.runAsUser(this.userId, (function(_this) {                                                        //
          return function() {                                                                                   //
            return id = Meteor.call('createPrivateGroup', _this.bodyParams.name, []);                           //
          };                                                                                                    //
        })(this));                                                                                              //
      } else {                                                                                                  //
        Meteor.runAsUser(this.userId, (function(_this) {                                                        //
          return function() {                                                                                   //
            return id = Meteor.call('createPrivateGroup', _this.bodyParams.name, _this.bodyParams.members, []);
          };                                                                                                    //
        })(this));                                                                                              //
      }                                                                                                         //
    } catch (error) {                                                                                           //
      e = error;                                                                                                //
      return RocketChat.API.v1.failure(e.name + ': ' + e.message);                                              // 260
    }                                                                                                           //
    return RocketChat.API.v1.success({                                                                          // 262
      group: RocketChat.models.Rooms.findOneById(id.rid)                                                        //
    });                                                                                                         //
  }                                                                                                             //
});                                                                                                             //
                                                                                                                //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"settings.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/rocketchat_api/server/settings.js                                                                   //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
// settings endpoints                                                                                           // 1
RocketChat.API.v1.addRoute('settings/:_id', { authRequired: true }, {                                           // 2
	get: function () {                                                                                             // 3
		function get() {                                                                                              // 2
			if (!RocketChat.authz.hasPermission(this.userId, 'view-privileged-setting')) {                               // 4
				return RocketChat.API.v1.unauthorized();                                                                    // 5
			}                                                                                                            // 6
                                                                                                                //
			return RocketChat.API.v1.success(_.pick(RocketChat.models.Settings.findOneNotHiddenById(this.urlParams._id), '_id', 'value'));
		}                                                                                                             // 9
                                                                                                                //
		return get;                                                                                                   // 2
	}(),                                                                                                           // 2
	post: function () {                                                                                            // 10
		function post() {                                                                                             // 2
			if (!RocketChat.authz.hasPermission(this.userId, 'edit-privileged-setting')) {                               // 11
				return RocketChat.API.v1.unauthorized();                                                                    // 12
			}                                                                                                            // 13
                                                                                                                //
			try {                                                                                                        // 15
				check(this.bodyParams, {                                                                                    // 16
					value: Match.Any                                                                                           // 17
				});                                                                                                         // 16
                                                                                                                //
				if (RocketChat.models.Settings.updateValueNotHiddenById(this.urlParams._id, this.bodyParams.value)) {       // 20
					return RocketChat.API.v1.success();                                                                        // 21
				}                                                                                                           // 22
                                                                                                                //
				return RocketChat.API.v1.failure();                                                                         // 24
			} catch (e) {                                                                                                // 25
				return RocketChat.API.v1.failure(e.message);                                                                // 26
			}                                                                                                            // 27
		}                                                                                                             // 28
                                                                                                                //
		return post;                                                                                                  // 2
	}()                                                                                                            // 2
});                                                                                                             // 2
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{"extensions":[".js",".json",".coffee"]});
require("./node_modules/meteor/rocketchat:api/server/api.coffee.js");
require("./node_modules/meteor/rocketchat:api/server/routes.coffee.js");
require("./node_modules/meteor/rocketchat:api/server/settings.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:api'] = {};

})();

//# sourceMappingURL=rocketchat_api.js.map
