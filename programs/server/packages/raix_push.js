(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var EventState = Package['raix:eventstate'].EventState;
var check = Package.check.check;
var Match = Package.check.Match;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var _ = Package.underscore._;
var EJSON = Package.ejson.EJSON;
var meteorInstall = Package.modules.meteorInstall;
var Buffer = Package.modules.Buffer;
var process = Package.modules.process;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var Push, _matchToken, checkClientSecurity, _replaceToken, _removeToken, initPushUpdates;

var require = meteorInstall({"node_modules":{"meteor":{"raix:push":{"lib":{"common":{"main.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/raix_push/lib/common/main.js                                                                             //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
// The push object is an event emitter                                                                               // 1
Push = new EventState();                                                                                             // 2
                                                                                                                     //
// This is the match pattern for tokens                                                                              // 4
_matchToken = Match.OneOf({ apn: String }, { gcm: String });                                                         // 5
                                                                                                                     //
// Client-side security warnings, used to check options                                                              // 8
checkClientSecurity = function checkClientSecurity(options) {                                                        // 9
                                                                                                                     //
  // Warn if certificates or keys are added here on client. We dont allow the                                        // 11
  // user to do this for security reasons.                                                                           // 12
  if (options.apn && options.apn.certData) {                                                                         // 13
    throw new Error('Push.init: Dont add your APN certificate in client code!');                                     // 14
  }                                                                                                                  // 15
                                                                                                                     //
  if (options.apn && options.apn.keyData) {                                                                          // 17
    throw new Error('Push.init: Dont add your APN key in client code!');                                             // 18
  }                                                                                                                  // 19
                                                                                                                     //
  if (options.apn && options.apn.passphrase) {                                                                       // 21
    throw new Error('Push.init: Dont add your APN passphrase in client code!');                                      // 22
  }                                                                                                                  // 23
                                                                                                                     //
  if (options.gcm && options.gcm.apiKey) {                                                                           // 25
    throw new Error('Push.init: Dont add your GCM api key in client code!');                                         // 26
  }                                                                                                                  // 27
};                                                                                                                   // 28
                                                                                                                     //
// DEPRECATED                                                                                                        // 30
Push.init = function () {                                                                                            // 31
  console.warn('Push.init have been deprecated in favor of "config.push.json" please migrate');                      // 32
};                                                                                                                   // 33
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"notifications.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/raix_push/lib/common/notifications.js                                                                    //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
// Notifications collection                                                                                          // 1
Push.notifications = new Mongo.Collection('_raix_push_notifications');                                               // 2
                                                                                                                     //
// This is a general function to validate that the data added to notifications                                       // 4
// is in the correct format. If not this function will throw errors                                                  // 5
var _validateDocument = function _validateDocument(notification) {                                                   // 6
                                                                                                                     //
  // Check the general notification                                                                                  // 8
  check(notification, {                                                                                              // 9
    from: String,                                                                                                    // 10
    title: String,                                                                                                   // 11
    text: String,                                                                                                    // 12
    badge: Match.Optional(Number),                                                                                   // 13
    sound: Match.Optional(String),                                                                                   // 14
    notId: Match.Optional(Match.Integer),                                                                            // 15
    apn: Match.Optional({                                                                                            // 16
      from: Match.Optional(String),                                                                                  // 17
      title: Match.Optional(String),                                                                                 // 18
      text: Match.Optional(String),                                                                                  // 19
      badge: Match.Optional(Number),                                                                                 // 20
      sound: Match.Optional(String),                                                                                 // 21
      notId: Match.Optional(Match.Integer)                                                                           // 22
    }),                                                                                                              // 16
    gcm: Match.Optional({                                                                                            // 24
      from: Match.Optional(String),                                                                                  // 25
      title: Match.Optional(String),                                                                                 // 26
      text: Match.Optional(String),                                                                                  // 27
      badge: Match.Optional(Number),                                                                                 // 28
      sound: Match.Optional(String),                                                                                 // 29
      notId: Match.Optional(Match.Integer)                                                                           // 30
    }),                                                                                                              // 24
    query: Match.Optional(String),                                                                                   // 32
    token: Match.Optional(_matchToken),                                                                              // 33
    tokens: Match.Optional([_matchToken]),                                                                           // 34
    payload: Match.Optional(Object),                                                                                 // 35
    delayUntil: Match.Optional(Date),                                                                                // 36
    createdAt: Date,                                                                                                 // 37
    createdBy: Match.OneOf(String, null)                                                                             // 38
  });                                                                                                                // 9
                                                                                                                     //
  // Make sure a token selector or query have been set                                                               // 41
  if (!notification.token && !notification.tokens && !notification.query) {                                          // 42
    throw new Error('No token selector or query found');                                                             // 43
  }                                                                                                                  // 44
                                                                                                                     //
  // If tokens array is set it should not be empty                                                                   // 46
  if (notification.tokens && !notification.tokens.length) {                                                          // 47
    throw new Error('No tokens in array');                                                                           // 48
  }                                                                                                                  // 49
};                                                                                                                   // 50
                                                                                                                     //
Push.send = function (options) {                                                                                     // 52
  // If on the client we set the user id - on the server we need an option                                           // 53
  // set or we default to "<SERVER>" as the creator of the notification                                              // 54
  // If current user not set see if we can set it to the logged in user                                              // 55
  // this will only run on the client if Meteor.userId is available                                                  // 56
  var currentUser = Meteor.isClient && Meteor.userId && Meteor.userId() || Meteor.isServer && (options.createdBy || '<SERVER>') || null;
                                                                                                                     //
  // Rig the notification object                                                                                     // 60
  var notification = _.extend({                                                                                      // 61
    createdAt: new Date(),                                                                                           // 62
    createdBy: currentUser                                                                                           // 63
  }, _.pick(options, 'from', 'title', 'text'));                                                                      // 61
                                                                                                                     //
  // Add extra                                                                                                       // 66
  _.extend(notification, _.pick(options, 'payload', 'badge', 'sound', 'notId', 'delayUntil'));                       // 67
                                                                                                                     //
  if (Match.test(options.apn, Object)) {                                                                             // 69
    notification.apn = _.pick(options.apn, 'from', 'title', 'text', 'badge', 'sound', 'notId');                      // 70
  }                                                                                                                  // 71
                                                                                                                     //
  if (Match.test(options.gcm, Object)) {                                                                             // 73
    notification.gcm = _.pick(options.gcm, 'from', 'title', 'text', 'badge', 'sound', 'notId');                      // 74
  }                                                                                                                  // 75
                                                                                                                     //
  // Set one token selector, this can be token, array of tokens or query                                             // 77
  if (options.query) {                                                                                               // 78
    // Set query to the json string version fixing #43 and #39                                                       // 79
    notification.query = JSON.stringify(options.query);                                                              // 80
  } else if (options.token) {                                                                                        // 81
    // Set token                                                                                                     // 82
    notification.token = options.token;                                                                              // 83
  } else if (options.tokens) {                                                                                       // 84
    // Set tokens                                                                                                    // 85
    notification.tokens = options.tokens;                                                                            // 86
  }                                                                                                                  // 87
                                                                                                                     //
  // Validate the notification                                                                                       // 89
  _validateDocument(notification);                                                                                   // 90
                                                                                                                     //
  // Try to add the notification to send, we return an id to keep track                                              // 92
  return Push.notifications.insert(notification);                                                                    // 93
};                                                                                                                   // 94
                                                                                                                     //
Push.allow = function (rules) {                                                                                      // 96
  if (rules.send) {                                                                                                  // 97
    Push.notifications.allow({                                                                                       // 98
      'insert': function () {                                                                                        // 99
        function insert(userId, notification) {                                                                      // 99
          // Validate the notification                                                                               // 100
          _validateDocument(notification);                                                                           // 101
          // Set the user defined "send" rules                                                                       // 102
          return rules.send.apply(this, [userId, notification]);                                                     // 103
        }                                                                                                            // 104
                                                                                                                     //
        return insert;                                                                                               // 99
      }()                                                                                                            // 99
    });                                                                                                              // 98
  }                                                                                                                  // 106
};                                                                                                                   // 107
                                                                                                                     //
Push.deny = function (rules) {                                                                                       // 109
  if (rules.send) {                                                                                                  // 110
    Push.notifications.deny({                                                                                        // 111
      'insert': function () {                                                                                        // 112
        function insert(userId, notification) {                                                                      // 112
          // Validate the notification                                                                               // 113
          _validateDocument(notification);                                                                           // 114
          // Set the user defined "send" rules                                                                       // 115
          return rules.send.apply(this, [userId, notification]);                                                     // 116
        }                                                                                                            // 117
                                                                                                                     //
        return insert;                                                                                               // 112
      }()                                                                                                            // 112
    });                                                                                                              // 111
  }                                                                                                                  // 119
};                                                                                                                   // 120
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"push.api.js":function(require){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/raix_push/lib/server/push.api.js                                                                         //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
/*                                                                                                                   // 1
  A general purpose user CordovaPush                                                                                 //
  ios, android, mail, twitter?, facebook?, sms?, snailMail? :)                                                       //
                                                                                                                     //
  Phonegap generic :                                                                                                 //
  https://github.com/phonegap-build/PushPlugin                                                                       //
 */                                                                                                                  //
                                                                                                                     //
// getText / getBinary                                                                                               // 9
                                                                                                                     //
Push.setBadge = function () /* id, count */{                                                                         // 11
  // throw new Error('Push.setBadge not implemented on the server');                                                 // 12
};                                                                                                                   // 13
                                                                                                                     //
var isConfigured = false;                                                                                            // 15
                                                                                                                     //
Push.Configure = function (options) {                                                                                // 17
  var self = this;                                                                                                   // 18
  // https://npmjs.org/package/apn                                                                                   // 19
                                                                                                                     //
  // After requesting the certificate from Apple, export your private key as                                         // 21
  // a .p12 file anddownload the .cer file from the iOS Provisioning Portal.                                         // 22
                                                                                                                     //
  // gateway.push.apple.com, port 2195                                                                               // 24
  // gateway.sandbox.push.apple.com, port 2195                                                                       // 25
                                                                                                                     //
  // Now, in the directory containing cert.cer and key.p12 execute the                                               // 27
  // following commands to generate your .pem files:                                                                 // 28
  // $ openssl x509 -in cert.cer -inform DER -outform PEM -out cert.pem                                              // 29
  // $ openssl pkcs12 -in key.p12 -out key.pem -nodes                                                                // 30
                                                                                                                     //
  // Block multiple calls                                                                                            // 32
  if (isConfigured) {                                                                                                // 33
    throw new Error('Push.Configure should not be called more than once!');                                          // 34
  }                                                                                                                  // 35
                                                                                                                     //
  isConfigured = true;                                                                                               // 37
                                                                                                                     //
  // Add debug info                                                                                                  // 39
  if (Push.debug) {                                                                                                  // 40
    console.log('Push.Configure', options);                                                                          // 41
  }                                                                                                                  // 42
                                                                                                                     //
  // This function is called when a token is replaced on a device - normally                                         // 44
  // this should not happen, but if it does we should take action on it                                              // 45
  _replaceToken = function _replaceToken(currentToken, newToken) {                                                   // 46
    // console.log('Replace token: ' + currentToken + ' -- ' + newToken);                                            // 47
    // If the server gets a token event its passing in the current token and                                         // 48
    // the new value - if new value is undefined this empty the token                                                // 49
    self.emitState('token', currentToken, newToken);                                                                 // 50
  };                                                                                                                 // 51
                                                                                                                     //
  // Rig the removeToken callback                                                                                    // 53
  _removeToken = function _removeToken(token) {                                                                      // 54
    // console.log('Remove token: ' + token);                                                                        // 55
    // Invalidate the token                                                                                          // 56
    self.emitState('token', token, null);                                                                            // 57
  };                                                                                                                 // 58
                                                                                                                     //
  if (options.apn) {                                                                                                 // 61
    if (Push.debug) {                                                                                                // 62
      console.log('Push: APN configured');                                                                           // 63
    }                                                                                                                // 64
                                                                                                                     //
    // Allow production to be a general option for push notifications                                                // 66
    if (options.production === Boolean(options.production)) {                                                        // 67
      options.apn.production = options.production;                                                                   // 68
    }                                                                                                                // 69
                                                                                                                     //
    // Give the user warnings about development settings                                                             // 71
    if (options.apn.development) {                                                                                   // 72
      // This flag is normally set by the configuration file                                                         // 73
      console.warn('WARNING: Push APN is using development key and certificate');                                    // 74
    } else {                                                                                                         // 75
      // We check the apn gateway i the options, we could risk shipping                                              // 76
      // server into production while using the production configuration.                                            // 77
      // On the other hand we could be in development but using the production                                       // 78
      // configuration. And finally we could have configured an unknown apn                                          // 79
      // gateway (this could change in the future - but a warning about typos                                        // 80
      // can save hours of debugging)                                                                                // 81
      //                                                                                                             // 82
      // Warn about gateway configurations - it's more a guide                                                       // 83
      if (options.apn.gateway) {                                                                                     // 84
                                                                                                                     //
        if (options.apn.gateway === 'gateway.sandbox.push.apple.com') {                                              // 86
          // Using the development sandbox                                                                           // 87
          console.warn('WARNING: Push APN is in development mode');                                                  // 88
        } else if (options.apn.gateway === 'gateway.push.apple.com') {                                               // 89
          // In production - but warn if we are running on localhost                                                 // 90
          if (/http:\/\/localhost/.test(Meteor.absoluteUrl())) {                                                     // 91
            console.warn('WARNING: Push APN is configured to production mode - but server is running' + ' from localhost');
          }                                                                                                          // 94
        } else {                                                                                                     // 95
          // Warn about gateways we dont know about                                                                  // 96
          console.warn('WARNING: Push APN unkown gateway "' + options.apn.gateway + '"');                            // 97
        }                                                                                                            // 98
      } else {                                                                                                       // 100
        if (options.apn.production) {                                                                                // 101
          if (/http:\/\/localhost/.test(Meteor.absoluteUrl())) {                                                     // 102
            console.warn('WARNING: Push APN is configured to production mode - but server is running' + ' from localhost');
          }                                                                                                          // 105
        } else {                                                                                                     // 106
          console.warn('WARNING: Push APN is in development mode');                                                  // 107
        }                                                                                                            // 108
      }                                                                                                              // 109
    }                                                                                                                // 111
                                                                                                                     //
    // Check certificate data                                                                                        // 113
    if (!options.apn.certData || !options.apn.certData.length) {                                                     // 114
      console.error('ERROR: Push server could not find certData');                                                   // 115
    }                                                                                                                // 116
                                                                                                                     //
    // Check key data                                                                                                // 118
    if (!options.apn.keyData || !options.apn.keyData.length) {                                                       // 119
      console.error('ERROR: Push server could not find keyData');                                                    // 120
    }                                                                                                                // 121
                                                                                                                     //
    // Rig apn connection                                                                                            // 123
    var apn = Npm.require('apn');                                                                                    // 124
    var apnConnection = new apn.Connection(options.apn);                                                             // 125
                                                                                                                     //
    // Listen to transmission errors - should handle the same way as feedback.                                       // 127
    apnConnection.on('transmissionError', Meteor.bindEnvironment(function (errCode, notification, recipient) {       // 128
      if (Push.debug) {                                                                                              // 129
        console.log('Got error code %d for token %s', errCode, notification.token);                                  // 130
      }                                                                                                              // 131
      if ([2, 5, 8].indexOf(errCode) >= 0) {                                                                         // 132
                                                                                                                     //
        // Invalid token errors...                                                                                   // 135
        _removeToken({                                                                                               // 136
          apn: notification.token                                                                                    // 137
        });                                                                                                          // 136
      }                                                                                                              // 139
    }));                                                                                                             // 140
    // XXX: should we do a test of the connection? It would be nice to know                                          // 141
    // That the server/certificates/network are correct configured                                                   // 142
                                                                                                                     //
    // apnConnection.connect().then(function() {                                                                     // 144
    //     console.info('CHECK: Push APN connection OK');                                                            // 145
    // }, function(err) {                                                                                            // 146
    //     console.warn('CHECK: Push APN connection FAILURE');                                                       // 147
    // });                                                                                                           // 148
    // Note: the above code spoils the connection - investigate how to                                               // 149
    // shutdown/close it.                                                                                            // 150
                                                                                                                     //
    self.sendAPN = function (userToken, notification) {                                                              // 152
      if (Match.test(notification.apn, Object)) {                                                                    // 153
        notification = _.extend({}, notification, notification.apn);                                                 // 154
      }                                                                                                              // 155
                                                                                                                     //
      // console.log('sendAPN', notification.from, userToken, notification.title, notification.text,                 // 157
      // notification.badge, notification.priority);                                                                 // 158
      var priority = notification.priority || notification.priority === 0 ? notification.priority : 10;              // 159
                                                                                                                     //
      var myDevice = new apn.Device(userToken);                                                                      // 161
                                                                                                                     //
      var note = new apn.Notification();                                                                             // 163
                                                                                                                     //
      note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.                                // 165
      if (typeof notification.badge !== 'undefined') {                                                               // 166
        note.badge = notification.badge;                                                                             // 167
      }                                                                                                              // 168
      if (typeof notification.sound !== 'undefined') {                                                               // 169
        note.sound = notification.sound;                                                                             // 170
      }                                                                                                              // 171
                                                                                                                     //
      // adds category support for iOS8 custom actions as described here:                                            // 173
      // https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/                        // 174
      // RemoteNotificationsPG/Chapters/IPhoneOSClientImp.html#//apple_ref/doc/uid/TP40008194-CH103-SW36             // 175
      if (typeof notification.category !== 'undefined') {                                                            // 176
        note.category = notification.category;                                                                       // 177
      }                                                                                                              // 178
                                                                                                                     //
      note.alert = notification.text;                                                                                // 180
      // Allow the user to set payload data                                                                          // 181
      note.payload = notification.payload ? { ejson: EJSON.stringify(notification.payload) } : {};                   // 182
                                                                                                                     //
      note.payload.messageFrom = notification.from;                                                                  // 184
      note.priority = priority;                                                                                      // 185
                                                                                                                     //
      // Store the token on the note so we can reference it if there was an error                                    // 188
      note.token = userToken;                                                                                        // 189
                                                                                                                     //
      // console.log('I:Send message to: ' + userToken + ' count=' + count);                                         // 191
                                                                                                                     //
      apnConnection.pushNotification(note, myDevice);                                                                // 193
    };                                                                                                               // 195
                                                                                                                     //
    var initFeedback = function initFeedback() {                                                                     // 198
      var apn = Npm.require('apn');                                                                                  // 199
      // console.log('Init feedback');                                                                               // 200
      var feedbackOptions = {                                                                                        // 201
        'batchFeedback': true,                                                                                       // 202
                                                                                                                     //
        // Time in SECONDS                                                                                           // 204
        'interval': 5,                                                                                               // 205
        production: !options.apn.development,                                                                        // 206
        cert: options.certData,                                                                                      // 207
        key: options.keyData,                                                                                        // 208
        passphrase: options.passphrase                                                                               // 209
      };                                                                                                             // 201
                                                                                                                     //
      var feedback = new apn.Feedback(feedbackOptions);                                                              // 212
      feedback.on('feedback', function (devices) {                                                                   // 213
        devices.forEach(function (item) {                                                                            // 214
          // Do something with item.device and item.time;                                                            // 215
          // console.log('A:PUSH FEEDBACK ' + item.device + ' - ' + item.time);                                      // 216
          // The app is most likely removed from the device, we should                                               // 217
          // remove the token                                                                                        // 218
          _removeToken({                                                                                             // 219
            apn: item.device                                                                                         // 220
          });                                                                                                        // 219
        });                                                                                                          // 222
      });                                                                                                            // 223
                                                                                                                     //
      feedback.start();                                                                                              // 225
    };                                                                                                               // 226
                                                                                                                     //
    // Init feedback from apn server                                                                                 // 228
    // This will help keep the appCollection up-to-date, it will help update                                         // 229
    // and remove token from appCollection.                                                                          // 230
    initFeedback();                                                                                                  // 231
  } // EO ios notification                                                                                           // 233
                                                                                                                     //
  if (options.gcm && options.gcm.apiKey) {                                                                           // 235
    if (Push.debug) {                                                                                                // 236
      console.log('GCM configured');                                                                                 // 237
    }                                                                                                                // 238
    //self.sendGCM = function(options.from, userTokens, options.title, options.text, options.badge, options.priority) {
    self.sendGCM = function (userTokens, notification) {                                                             // 240
      if (Match.test(notification.gcm, Object)) {                                                                    // 241
        notification = _.extend({}, notification, notification.gcm);                                                 // 242
      }                                                                                                              // 243
                                                                                                                     //
      // Make sure userTokens are an array of strings                                                                // 245
      if (userTokens === '' + userTokens) {                                                                          // 246
        userTokens = [userTokens];                                                                                   // 247
      }                                                                                                              // 248
                                                                                                                     //
      // Check if any tokens in there to send                                                                        // 250
      if (!userTokens.length) {                                                                                      // 251
        if (Push.debug) {                                                                                            // 252
          console.log('sendGCM no push tokens found');                                                               // 253
        }                                                                                                            // 254
        return;                                                                                                      // 255
      }                                                                                                              // 256
                                                                                                                     //
      if (Push.debug) {                                                                                              // 258
        console.log('sendGCM', userTokens, notification);                                                            // 259
      }                                                                                                              // 260
                                                                                                                     //
      var gcm = Npm.require('node-gcm');                                                                             // 262
      var Fiber = Npm.require('fibers');                                                                             // 263
                                                                                                                     //
      // Allow user to set payload                                                                                   // 265
      var data = notification.payload ? { ejson: EJSON.stringify(notification.payload) } : {};                       // 266
                                                                                                                     //
      data.title = notification.title;                                                                               // 268
      data.message = notification.text;                                                                              // 269
                                                                                                                     //
      // Set extra details                                                                                           // 271
      if (typeof notification.badge !== 'undefined') {                                                               // 272
        data.msgcnt = notification.badge;                                                                            // 273
      }                                                                                                              // 274
      if (typeof notification.sound !== 'undefined') {                                                               // 275
        data.soundname = notification.sound;                                                                         // 276
      }                                                                                                              // 277
      if (typeof notification.notId !== 'undefined') {                                                               // 278
        data.notId = notification.notId;                                                                             // 279
      }                                                                                                              // 280
                                                                                                                     //
      //var message = new gcm.Message();                                                                             // 282
      var message = new gcm.Message({                                                                                // 283
        collapseKey: notification.from,                                                                              // 284
        //    delayWhileIdle: true,                                                                                  // 285
        //    timeToLive: 4,                                                                                         // 286
        //    restricted_package_name: 'dk.gi2.app'                                                                  // 287
        data: data                                                                                                   // 288
      });                                                                                                            // 283
                                                                                                                     //
      if (Push.debug) {                                                                                              // 291
        console.log('Create GCM Sender using "' + options.gcm.apiKey + '"');                                         // 292
      }                                                                                                              // 293
      var sender = new gcm.Sender(options.gcm.apiKey);                                                               // 294
                                                                                                                     //
      _.each(userTokens, function (value /*, key */) {                                                               // 296
        if (Push.debug) {                                                                                            // 297
          console.log('A:Send message to: ' + value);                                                                // 298
        }                                                                                                            // 299
      });                                                                                                            // 300
                                                                                                                     //
      /*message.addData('title', title);                                                                             // 302
      message.addData('message', text);                                                                              //
      message.addData('msgcnt', '1');                                                                                //
      message.collapseKey = 'sitDrift';                                                                              //
      message.delayWhileIdle = true;                                                                                 //
      message.timeToLive = 3;*/                                                                                      //
                                                                                                                     //
      // /**                                                                                                         // 309
      //  * Parameters: message-literal, userTokens-array, No. of retries, callback-function                         // 310
      //  */                                                                                                         // 311
                                                                                                                     //
      var userToken = userTokens.length === 1 ? userTokens[0] : null;                                                // 313
                                                                                                                     //
      sender.send(message, userTokens, 5, function (err, result) {                                                   // 315
        if (err) {                                                                                                   // 316
          if (Push.debug) {                                                                                          // 317
            console.log('ANDROID ERROR: result of sender: ' + result);                                               // 318
          }                                                                                                          // 319
        } else {                                                                                                     // 320
          if (result === null) {                                                                                     // 321
            if (Push.debug) {                                                                                        // 322
              console.log('ANDROID: Result of sender is null');                                                      // 323
            }                                                                                                        // 324
            return;                                                                                                  // 325
          }                                                                                                          // 326
          if (Push.debug) {                                                                                          // 327
            console.log('ANDROID: Result of sender: ' + JSON.stringify(result));                                     // 328
          }                                                                                                          // 329
          if (result.canonical_ids === 1 && userToken) {                                                             // 330
            // jshint ignore:line                                                                                    // 330
                                                                                                                     //
            // This is an old device, token is replaced                                                              // 332
            Fiber(function (self) {                                                                                  // 333
              // Run in fiber                                                                                        // 334
              try {                                                                                                  // 335
                self.callback(self.oldToken, self.newToken);                                                         // 336
              } catch (err) {}                                                                                       // 337
            }).run({                                                                                                 // 341
              oldToken: { gcm: userToken },                                                                          // 342
              newToken: { gcm: result.results[0].registration_id }, // jshint ignore:line                            // 343
              callback: _replaceToken                                                                                // 344
            });                                                                                                      // 341
            //_replaceToken({ gcm: userToken }, { gcm: result.results[0].registration_id });                         // 346
          }                                                                                                          // 348
          // We cant send to that token - might not be registred                                                     // 349
          // ask the user to remove the token from the list                                                          // 350
          if (result.failure !== 0 && userToken) {                                                                   // 351
                                                                                                                     //
            // This is an old device, token is replaced                                                              // 353
            Fiber(function (self) {                                                                                  // 354
              // Run in fiber                                                                                        // 355
              try {                                                                                                  // 356
                self.callback(self.token);                                                                           // 357
              } catch (err) {}                                                                                       // 358
            }).run({                                                                                                 // 362
              token: { gcm: userToken },                                                                             // 363
              callback: _removeToken                                                                                 // 364
            });                                                                                                      // 362
            //_replaceToken({ gcm: userToken }, { gcm: result.results[0].registration_id });                         // 366
          }                                                                                                          // 368
        }                                                                                                            // 370
      });                                                                                                            // 371
      // /** Use the following line if you want to send the message without retries                                  // 372
      // sender.sendNoRetry(message, userTokens, function (result) {                                                 // 373
      //     console.log('ANDROID: ' + JSON.stringify(result));                                                      // 374
      // });                                                                                                         // 375
      // **/                                                                                                         // 376
    }; // EO sendAndroid                                                                                             // 377
  } // EO Android                                                                                                    // 379
                                                                                                                     //
  // Universal send function                                                                                         // 381
  var _querySend = function _querySend(query, options) {                                                             // 382
                                                                                                                     //
    var countApn = [];                                                                                               // 384
    var countGcm = [];                                                                                               // 385
                                                                                                                     //
    Push.appCollection.find(query).forEach(function (app) {                                                          // 387
                                                                                                                     //
      if (Push.debug) {                                                                                              // 389
        console.log('send to token', app.token);                                                                     // 390
      }                                                                                                              // 391
                                                                                                                     //
      if (app.token.apn) {                                                                                           // 393
        countApn.push(app._id);                                                                                      // 394
        // Send to APN                                                                                               // 395
        if (self.sendAPN) {                                                                                          // 396
          self.sendAPN(app.token.apn, options);                                                                      // 397
        }                                                                                                            // 398
      } else if (app.token.gcm) {                                                                                    // 400
        countGcm.push(app._id);                                                                                      // 401
                                                                                                                     //
        // Send to GCM                                                                                               // 403
        // We do support multiple here - so we should construct an array                                             // 404
        // and send it bulk - Investigate limit count of id's                                                        // 405
        if (self.sendGCM) {                                                                                          // 406
          self.sendGCM(app.token.gcm, options);                                                                      // 407
        }                                                                                                            // 408
      } else {                                                                                                       // 410
        throw new Error('Push.send got a faulty query');                                                             // 411
      }                                                                                                              // 412
    });                                                                                                              // 414
                                                                                                                     //
    if (Push.debug) {                                                                                                // 416
                                                                                                                     //
      console.log('Push: Sent message "' + options.title + '" to ' + countApn.length + ' ios apps ' + countGcm.length + ' android apps');
                                                                                                                     //
      // Add some verbosity about the send result, making sure the developer                                         // 421
      // understands what just happened.                                                                             // 422
      if (!countApn.length && !countGcm.length) {                                                                    // 423
        if (Push.appCollection.find().count() === 0) {                                                               // 424
          console.log('Push, GUIDE: The "Push.appCollection" is empty -' + ' No clients have registred on the server yet...');
        }                                                                                                            // 427
      } else if (!countApn.length) {                                                                                 // 428
        if (Push.appCollection.find({ 'token.apn': { $exists: true } }).count() === 0) {                             // 429
          console.log('Push, GUIDE: The "Push.appCollection" - No APN clients have registred on the server yet...');
        }                                                                                                            // 431
      } else if (!countGcm.length) {                                                                                 // 432
        if (Push.appCollection.find({ 'token.gcm': { $exists: true } }).count() === 0) {                             // 433
          console.log('Push, GUIDE: The "Push.appCollection" - No GCM clients have registred on the server yet...');
        }                                                                                                            // 435
      }                                                                                                              // 436
    }                                                                                                                // 438
                                                                                                                     //
    return {                                                                                                         // 440
      apn: countApn,                                                                                                 // 441
      gcm: countGcm                                                                                                  // 442
    };                                                                                                               // 440
  };                                                                                                                 // 444
                                                                                                                     //
  self.serverSend = function (options) {                                                                             // 446
    options = options || { badge: 0 };                                                                               // 447
    var query;                                                                                                       // 448
                                                                                                                     //
    // Check basic options                                                                                           // 450
    if (options.from !== '' + options.from) {                                                                        // 451
      throw new Error('Push.send: option "from" not a string');                                                      // 452
    }                                                                                                                // 453
                                                                                                                     //
    if (options.title !== '' + options.title) {                                                                      // 455
      throw new Error('Push.send: option "title" not a string');                                                     // 456
    }                                                                                                                // 457
                                                                                                                     //
    if (options.text !== '' + options.text) {                                                                        // 459
      throw new Error('Push.send: option "text" not a string');                                                      // 460
    }                                                                                                                // 461
                                                                                                                     //
    if (options.token || options.tokens) {                                                                           // 463
                                                                                                                     //
      // The user set one token or array of tokens                                                                   // 465
      var tokenList = options.token ? [options.token] : options.tokens;                                              // 466
                                                                                                                     //
      if (Push.debug) {                                                                                              // 468
        console.log('Push: Send message "' + options.title + '" via token(s)', tokenList);                           // 469
      }                                                                                                              // 470
                                                                                                                     //
      query = {                                                                                                      // 472
        $or: [                                                                                                       // 473
        // XXX: Test this query: can we hand in a list of push tokens?                                               // 474
        { $and: [{ token: { $in: tokenList } },                                                                      // 475
          // And is not disabled                                                                                     // 477
          { enabled: { $ne: false } }]                                                                               // 478
        },                                                                                                           // 475
        // XXX: Test this query: does this work on app id?                                                           // 481
        { $and: [{ _in: { $in: tokenList } }, // one of the app ids                                                  // 482
          { $or: [{ 'token.apn': { $exists: true } }, // got apn token                                               // 484
            { 'token.gcm': { $exists: true } } // got gcm token                                                      // 486
            ] },                                                                                                     // 484
          // And is not disabled                                                                                     // 488
          { enabled: { $ne: false } }]                                                                               // 489
        }]                                                                                                           // 482
      };                                                                                                             // 472
    } else if (options.query) {                                                                                      // 495
                                                                                                                     //
      if (Push.debug) {                                                                                              // 497
        console.log('Push: Send message "' + options.title + '" via query', options.query);                          // 498
      }                                                                                                              // 499
                                                                                                                     //
      query = {                                                                                                      // 501
        $and: [options.query, // query object                                                                        // 502
        { $or: [{ 'token.apn': { $exists: true } }, // got apn token                                                 // 504
          { 'token.gcm': { $exists: true } } // got gcm token                                                        // 506
          ] },                                                                                                       // 504
        // And is not disabled                                                                                       // 508
        { enabled: { $ne: false } }]                                                                                 // 509
      };                                                                                                             // 501
    }                                                                                                                // 512
                                                                                                                     //
    if (query) {                                                                                                     // 515
                                                                                                                     //
      // Convert to querySend and return status                                                                      // 517
      return _querySend(query, options);                                                                             // 518
    } else {                                                                                                         // 520
      throw new Error('Push.send: please set option "token"/"tokens" or "query"');                                   // 521
    }                                                                                                                // 522
  };                                                                                                                 // 524
                                                                                                                     //
  // This interval will allow only one notification to be sent at a time, it                                         // 527
  // will check for new notifications at every `options.sendInterval`                                                // 528
  // (default interval is 15000 ms)                                                                                  // 529
  //                                                                                                                 // 530
  // It looks in notifications collection to see if theres any pending                                               // 531
  // notifications, if so it will try to reserve the pending notification.                                           // 532
  // If successfully reserved the send is started.                                                                   // 533
  //                                                                                                                 // 534
  // If notification.query is type string, it's assumed to be a json string                                          // 535
  // version of the query selector. Making it able to carry `$` properties in                                        // 536
  // the mongo collection.                                                                                           // 537
  //                                                                                                                 // 538
  // Pr. default notifications are removed from the collection after send have                                       // 539
  // completed. Setting `options.keepNotifications` will update and keep the                                         // 540
  // notification eg. if needed for historical reasons.                                                              // 541
  //                                                                                                                 // 542
  // After the send have completed a "send" event will be emitted with a                                             // 543
  // status object containing notification id and the send result object.                                            // 544
  //                                                                                                                 // 545
  var isSendingNotification = false;                                                                                 // 546
                                                                                                                     //
  if (options.sendInterval !== null) {                                                                               // 548
                                                                                                                     //
    // This will require index since we sort notifications by createdAt                                              // 550
    Push.notifications._ensureIndex({ createdAt: 1 });                                                               // 551
                                                                                                                     //
    Meteor.setInterval(function () {                                                                                 // 553
                                                                                                                     //
      if (isSendingNotification) {                                                                                   // 555
        return;                                                                                                      // 556
      }                                                                                                              // 557
      // Set send fence                                                                                              // 558
      isSendingNotification = true;                                                                                  // 559
                                                                                                                     //
      // var countSent = 0;                                                                                          // 561
      var batchSize = options.sendBatchSize || 1;                                                                    // 562
                                                                                                                     //
      // Find notifications that are not being or already sent                                                       // 564
      var pendingNotifications = Push.notifications.find({ $and: [                                                   // 565
        // Message is not sent                                                                                       // 566
        { sent: { $ne: true } },                                                                                     // 567
        // And not being sent by other instances                                                                     // 568
        { sending: { $ne: true } },                                                                                  // 569
        // And not queued for future                                                                                 // 570
        { $or: [{ delayUntil: { $exists: false } }, { delayUntil: { $lte: new Date() } }] }] }, {                    // 571
        // Sort by created date                                                                                      // 573
        sort: { createdAt: 1 },                                                                                      // 574
        limit: batchSize                                                                                             // 575
      });                                                                                                            // 572
                                                                                                                     //
      pendingNotifications.forEach(function (notification) {                                                         // 578
        // Reserve notification                                                                                      // 579
        var reserved = Push.notifications.update({ $and: [                                                           // 580
          // Try to reserve the current notification                                                                 // 581
          { _id: notification._id },                                                                                 // 582
          // Make sure no other instances have reserved it                                                           // 583
          { sending: { $ne: true } }] }, {                                                                           // 584
          $set: {                                                                                                    // 586
            // Try to reserve                                                                                        // 587
            sending: true                                                                                            // 588
          }                                                                                                          // 586
        });                                                                                                          // 585
                                                                                                                     //
        // Make sure we only handle notifications reserved by this                                                   // 592
        // instance                                                                                                  // 593
        if (reserved) {                                                                                              // 594
                                                                                                                     //
          // Check if query is set and is type String                                                                // 596
          if (notification.query && notification.query === '' + notification.query) {                                // 597
            try {                                                                                                    // 598
              // The query is in string json format - we need to parse it                                            // 599
              notification.query = JSON.parse(notification.query);                                                   // 600
            } catch (err) {                                                                                          // 601
              // Did the user tamper with this??                                                                     // 602
              throw new Error('Push: Error while parsing query string, Error: ' + err.message);                      // 603
            }                                                                                                        // 604
          }                                                                                                          // 605
                                                                                                                     //
          // Send the notification                                                                                   // 607
          var result = Push.serverSend(notification);                                                                // 608
                                                                                                                     //
          if (!options.keepNotifications) {                                                                          // 610
            // Pr. Default we will remove notifications                                                              // 611
            Push.notifications.remove({ _id: notification._id });                                                    // 612
          } else {                                                                                                   // 613
                                                                                                                     //
            // Update the notification                                                                               // 615
            Push.notifications.update({ _id: notification._id }, {                                                   // 616
              $set: {                                                                                                // 617
                // Mark as sent                                                                                      // 618
                sent: true,                                                                                          // 619
                // Set the sent date                                                                                 // 620
                sentAt: new Date(),                                                                                  // 621
                // Count                                                                                             // 622
                count: result,                                                                                       // 623
                // Not being sent anymore                                                                            // 624
                sending: false                                                                                       // 625
              }                                                                                                      // 617
            });                                                                                                      // 616
          }                                                                                                          // 629
                                                                                                                     //
          // Emit the send                                                                                           // 631
          self.emit('send', { notification: notification._id, result: result });                                     // 632
        } // Else could not reserve                                                                                  // 634
      }); // EO forEach                                                                                              // 636
                                                                                                                     //
      // Remove the send fence                                                                                       // 638
      isSendingNotification = false;                                                                                 // 639
    }, options.sendInterval || 15000); // Default every 15th sec                                                     // 640
  } else {                                                                                                           // 642
    if (Push.debug) {                                                                                                // 643
      console.log('Push: Send server is disabled');                                                                  // 644
    }                                                                                                                // 645
  }                                                                                                                  // 646
};                                                                                                                   // 648
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"server.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/raix_push/lib/server/server.js                                                                           //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Push.appCollection = new Mongo.Collection('_raix_push_app_tokens');                                                  // 1
                                                                                                                     //
Push.addListener('token', function (currentToken, value) {                                                           // 3
  if (value) {                                                                                                       // 4
    // Update the token for app                                                                                      // 5
    Push.appCollection.update({ token: currentToken }, { $set: { token: value } }, { multi: true });                 // 6
  } else if (value === null) {                                                                                       // 7
    // Remove the token for app                                                                                      // 8
    Push.appCollection.update({ token: currentToken }, { $unset: { token: true } }, { multi: true });                // 9
  }                                                                                                                  // 10
});                                                                                                                  // 11
                                                                                                                     //
Meteor.methods({                                                                                                     // 13
  'raix:push-update': function () {                                                                                  // 14
    function raixPushUpdate(options) {                                                                               // 14
      if (Push.debug) {                                                                                              // 15
        console.log('Push: Got push token from app:', options);                                                      // 16
      }                                                                                                              // 17
                                                                                                                     //
      check(options, {                                                                                               // 19
        id: Match.Optional(String),                                                                                  // 20
        token: _matchToken,                                                                                          // 21
        appName: String,                                                                                             // 22
        userId: Match.OneOf(String, null),                                                                           // 23
        metadata: Match.Optional(Object)                                                                             // 24
      });                                                                                                            // 19
                                                                                                                     //
      // The if user id is set then user id should match on client and connection                                    // 27
      if (options.userId && options.userId !== this.userId) {                                                        // 28
        throw new Meteor.Error(403, 'Forbidden access');                                                             // 29
      }                                                                                                              // 30
                                                                                                                     //
      var doc;                                                                                                       // 32
                                                                                                                     //
      // lookup app by id if one was included                                                                        // 34
      if (options.id) {                                                                                              // 35
        doc = Push.appCollection.findOne({ _id: options.id });                                                       // 36
      }                                                                                                              // 37
                                                                                                                     //
      // No doc was found - we check the database to see if                                                          // 39
      // we can find a match for the app via token and appName                                                       // 40
      if (!doc) {                                                                                                    // 41
        doc = Push.appCollection.findOne({                                                                           // 42
          $and: [{ token: options.token }, // Match token                                                            // 43
          { appName: options.appName }, // Match appName                                                             // 45
          { token: { $exists: true } } // Make sure token exists                                                     // 46
          ]                                                                                                          // 43
        });                                                                                                          // 42
      }                                                                                                              // 49
                                                                                                                     //
      // if we could not find the id or token then create it                                                         // 51
      if (!doc) {                                                                                                    // 52
        // Rig default doc                                                                                           // 53
        doc = {                                                                                                      // 54
          token: options.token,                                                                                      // 55
          appName: options.appName,                                                                                  // 56
          userId: options.userId,                                                                                    // 57
          enabled: true,                                                                                             // 58
          createdAt: new Date(),                                                                                     // 59
          updatedAt: new Date()                                                                                      // 60
        };                                                                                                           // 54
                                                                                                                     //
        if (options.id) {                                                                                            // 63
          // XXX: We might want to check the id - Why isnt there a match for id                                      // 64
          // in the Meteor check... Normal length 17 (could be larger), and                                          // 65
          // numbers+letters are used in Random.id() with exception of 0 and 1                                       // 66
          doc._id = options.id;                                                                                      // 67
          // The user wanted us to use a specific id, we didn't find this while                                      // 68
          // searching. The client could depend on the id eg. as reference so                                        // 69
          // we respect this and try to create a document with the selected id;                                      // 70
          Push.appCollection._collection.insert(doc);                                                                // 71
        } else {                                                                                                     // 72
          // Get the id from insert                                                                                  // 73
          doc._id = Push.appCollection.insert(doc);                                                                  // 74
        }                                                                                                            // 75
      } else {                                                                                                       // 76
        // We found the app so update the updatedAt and set the token                                                // 77
        Push.appCollection.update({ _id: doc._id }, {                                                                // 78
          $set: {                                                                                                    // 79
            updatedAt: new Date(),                                                                                   // 80
            token: options.token                                                                                     // 81
          }                                                                                                          // 79
        });                                                                                                          // 78
      }                                                                                                              // 84
                                                                                                                     //
      if (doc) {                                                                                                     // 86
        // xxx: Hack                                                                                                 // 87
        // Clean up mech making sure tokens are uniq - android sometimes generate                                    // 88
        // new tokens resulting in duplicates                                                                        // 89
        var removed = Push.appCollection.remove({                                                                    // 90
          $and: [{ _id: { $ne: doc._id } }, { token: doc.token }, // Match token                                     // 91
          { appName: doc.appName }, // Match appName                                                                 // 94
          { token: { $exists: true } } // Make sure token exists                                                     // 95
          ]                                                                                                          // 91
        });                                                                                                          // 90
                                                                                                                     //
        if (removed && Push.debug) {                                                                                 // 99
          console.log('Push: Removed ' + removed + ' existing app items');                                           // 100
        }                                                                                                            // 101
      }                                                                                                              // 102
                                                                                                                     //
      if (doc && Push.debug) {                                                                                       // 104
        console.log('Push: updated', doc);                                                                           // 105
      }                                                                                                              // 106
                                                                                                                     //
      if (!doc) {                                                                                                    // 108
        throw new Meteor.Error(500, 'setPushToken could not create record');                                         // 109
      }                                                                                                              // 110
      // Return the doc we want to use                                                                               // 111
      return doc;                                                                                                    // 112
    }                                                                                                                // 113
                                                                                                                     //
    return raixPushUpdate;                                                                                           // 14
  }(),                                                                                                               // 14
  'raix:push-setuser': function () {                                                                                 // 114
    function raixPushSetuser(id) {                                                                                   // 114
      check(id, String);                                                                                             // 115
                                                                                                                     //
      if (Push.debug) {                                                                                              // 117
        console.log('Push: Settings userId "' + this.userId + '" for app:', id);                                     // 118
      }                                                                                                              // 119
      // We update the appCollection id setting the Meteor.userId                                                    // 120
      var found = Push.appCollection.update({ _id: id }, { $set: { userId: this.userId } });                         // 121
                                                                                                                     //
      // Note that the app id might not exist because no token is set yet.                                           // 123
      // We do create the new app id for the user since we might store additional                                    // 124
      // metadata for the app / user                                                                                 // 125
                                                                                                                     //
      // If id not found then create it?                                                                             // 127
      // We dont, its better to wait until the user wants to                                                         // 128
      // store metadata or token - We could end up with unused data in the                                           // 129
      // collection at every app re-install / update                                                                 // 130
      //                                                                                                             // 131
      // The user could store some metadata in appCollectin but only if they                                         // 132
      // have created the app and provided a token.                                                                  // 133
      // If not the metadata should be set via ground:db                                                             // 134
                                                                                                                     //
      return !!found;                                                                                                // 136
    }                                                                                                                // 137
                                                                                                                     //
    return raixPushSetuser;                                                                                          // 114
  }(),                                                                                                               // 114
  'raix:push-metadata': function () {                                                                                // 138
    function raixPushMetadata(data) {                                                                                // 138
      check(data, {                                                                                                  // 139
        id: String,                                                                                                  // 140
        metadata: Object                                                                                             // 141
      });                                                                                                            // 139
                                                                                                                     //
      // Set the metadata                                                                                            // 144
      var found = Push.appCollection.update({ _id: data.id }, { $set: { metadata: data.metadata } });                // 145
                                                                                                                     //
      return !!found;                                                                                                // 147
    }                                                                                                                // 148
                                                                                                                     //
    return raixPushMetadata;                                                                                         // 138
  }(),                                                                                                               // 138
  'raix:push-enable': function () {                                                                                  // 149
    function raixPushEnable(data) {                                                                                  // 149
      check(data, {                                                                                                  // 150
        id: String,                                                                                                  // 151
        enabled: Boolean                                                                                             // 152
      });                                                                                                            // 150
                                                                                                                     //
      if (Push.debug) {                                                                                              // 155
        console.log('Push: Setting enabled to "' + data.enabled + '" for app:', data.id);                            // 156
      }                                                                                                              // 157
                                                                                                                     //
      var found = Push.appCollection.update({ _id: data.id }, { $set: { enabled: data.enabled } });                  // 159
                                                                                                                     //
      return !!found;                                                                                                // 161
    }                                                                                                                // 162
                                                                                                                     //
    return raixPushEnable;                                                                                           // 149
  }()                                                                                                                // 149
});                                                                                                                  // 13
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/raix:push/lib/common/main.js");
require("./node_modules/meteor/raix:push/lib/common/notifications.js");
require("./node_modules/meteor/raix:push/lib/server/push.api.js");
require("./node_modules/meteor/raix:push/lib/server/server.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['raix:push'] = {}, {
  Push: Push,
  _matchToken: _matchToken,
  checkClientSecurity: checkClientSecurity,
  initPushUpdates: initPushUpdates,
  _replaceToken: _replaceToken,
  _removeToken: _removeToken
});

})();

//# sourceMappingURL=raix_push.js.map
