(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_message-pin/server/settings.coffee.js                                                      //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                                                                       // 1
  RocketChat.settings.add('Message_AllowPinning', true, {                                                         //
    type: 'boolean',                                                                                              //
    group: 'Message',                                                                                             //
    "public": true                                                                                                //
  });                                                                                                             //
  return RocketChat.models.Permissions.upsert('pin-message', {                                                    //
    $setOnInsert: {                                                                                               //
      roles: ['owner', 'moderator', 'admin']                                                                      //
    }                                                                                                             //
  });                                                                                                             //
});                                                                                                               // 1
                                                                                                                  //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_message-pin/server/pinMessage.coffee.js                                                    //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                  // 1
  pinMessage: function(message, pinnedAt) {                                                                       //
    var me, room;                                                                                                 // 3
    if (!Meteor.userId()) {                                                                                       //
      throw new Meteor.Error('error-invalid-user', "Invalid user", {                                              // 4
        method: 'pinMessage'                                                                                      //
      });                                                                                                         //
    }                                                                                                             //
    if (!RocketChat.settings.get('Message_AllowPinning')) {                                                       //
      throw new Meteor.Error('error-action-not-allowed', 'Message pinning not allowed', {                         // 7
        method: 'pinMessage',                                                                                     //
        action: 'Message_pinning'                                                                                 //
      });                                                                                                         //
    }                                                                                                             //
    room = RocketChat.models.Rooms.findOneById(message.rid);                                                      //
    if (Array.isArray(room.usernames) && room.usernames.indexOf(Meteor.user().username) === -1) {                 //
      return false;                                                                                               // 12
    }                                                                                                             //
    if (RocketChat.settings.get('Message_KeepHistory')) {                                                         //
      RocketChat.models.Messages.cloneAndSaveAsHistoryById(message._id);                                          //
    }                                                                                                             //
    me = RocketChat.models.Users.findOneById(Meteor.userId());                                                    //
    message.pinned = true;                                                                                        //
    message.pinnedAt = pinnedAt || Date.now;                                                                      //
    message.pinnedBy = {                                                                                          //
      _id: Meteor.userId(),                                                                                       //
      username: me.username                                                                                       //
    };                                                                                                            //
    message = RocketChat.callbacks.run('beforeSaveMessage', message);                                             //
    RocketChat.models.Messages.setPinnedByIdAndUserId(message._id, message.pinnedBy, message.pinned);             //
    return RocketChat.models.Messages.createWithTypeRoomIdMessageAndUser('message_pinned', message.rid, '', me, {
      attachments: [                                                                                              //
        {                                                                                                         //
          "text": message.msg,                                                                                    //
          "author_name": message.u.username,                                                                      //
          "author_icon": getAvatarUrlFromUsername(message.u.username),                                            //
          "ts": message.ts                                                                                        //
        }                                                                                                         //
      ]                                                                                                           //
    });                                                                                                           //
  },                                                                                                              //
  unpinMessage: function(message) {                                                                               //
    var me, room;                                                                                                 // 39
    if (!Meteor.userId()) {                                                                                       //
      throw new Meteor.Error('error-invalid-user', "Invalid user", {                                              // 40
        method: 'unpinMessage'                                                                                    //
      });                                                                                                         //
    }                                                                                                             //
    if (!RocketChat.settings.get('Message_AllowPinning')) {                                                       //
      throw new Meteor.Error('error-action-not-allowed', 'Message pinning not allowed', {                         // 43
        method: 'unpinMessage',                                                                                   //
        action: 'Message_pinning'                                                                                 //
      });                                                                                                         //
    }                                                                                                             //
    room = RocketChat.models.Rooms.findOneById(message.rid);                                                      //
    if (Array.isArray(room.usernames) && room.usernames.indexOf(Meteor.user().username) === -1) {                 //
      return false;                                                                                               // 48
    }                                                                                                             //
    if (RocketChat.settings.get('Message_KeepHistory')) {                                                         //
      RocketChat.models.Messages.cloneAndSaveAsHistoryById(message._id);                                          //
    }                                                                                                             //
    me = RocketChat.models.Users.findOneById(Meteor.userId());                                                    //
    message.pinned = false;                                                                                       //
    message.pinnedBy = {                                                                                          //
      _id: Meteor.userId(),                                                                                       //
      username: me.username                                                                                       //
    };                                                                                                            //
    message = RocketChat.callbacks.run('beforeSaveMessage', message);                                             //
    return RocketChat.models.Messages.setPinnedByIdAndUserId(message._id, message.pinnedBy, message.pinned);      //
  }                                                                                                               //
});                                                                                                               //
                                                                                                                  //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_message-pin/server/publications/pinnedMessages.coffee.js                                   //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('pinnedMessages', function(rid, limit) {                                                           // 1
  var cursorHandle, publication, user;                                                                            // 2
  if (limit == null) {                                                                                            //
    limit = 50;                                                                                                   //
  }                                                                                                               //
  if (!this.userId) {                                                                                             //
    return this.ready();                                                                                          // 3
  }                                                                                                               //
  publication = this;                                                                                             //
  user = RocketChat.models.Users.findOneById(this.userId);                                                        //
  if (!user) {                                                                                                    //
    return this.ready();                                                                                          // 9
  }                                                                                                               //
  cursorHandle = RocketChat.models.Messages.findPinnedByRoom(rid, {                                               //
    sort: {                                                                                                       //
      ts: -1                                                                                                      //
    },                                                                                                            //
    limit: limit                                                                                                  //
  }).observeChanges({                                                                                             //
    added: function(_id, record) {                                                                                //
      return publication.added('rocketchat_pinned_message', _id, record);                                         //
    },                                                                                                            //
    changed: function(_id, record) {                                                                              //
      return publication.changed('rocketchat_pinned_message', _id, record);                                       //
    },                                                                                                            //
    removed: function(_id) {                                                                                      //
      return publication.removed('rocketchat_pinned_message', _id);                                               //
    }                                                                                                             //
  });                                                                                                             //
  this.ready();                                                                                                   //
  return this.onStop(function() {                                                                                 //
    return cursorHandle.stop();                                                                                   //
  });                                                                                                             //
});                                                                                                               // 1
                                                                                                                  //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_message-pin/server/startup/indexes.coffee.js                                               //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                                                                       // 1
  return Meteor.defer(function() {                                                                                //
    return RocketChat.models.Messages.tryEnsureIndex({                                                            //
      'pinnedBy._id': 1                                                                                           //
    }, {                                                                                                          //
      sparse: 1                                                                                                   //
    });                                                                                                           //
  });                                                                                                             //
});                                                                                                               // 1
                                                                                                                  //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:message-pin'] = {};

})();

//# sourceMappingURL=rocketchat_message-pin.js.map
