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

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/rocketchat_message-star/server/settings.coffee.js                                            //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                                                              // 1
  return RocketChat.settings.add('Message_AllowStarring', true, {                                        //
    type: 'boolean',                                                                                     //
    group: 'Message',                                                                                    //
    "public": true                                                                                       //
  });                                                                                                    //
});                                                                                                      // 1
                                                                                                         //
///////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/rocketchat_message-star/server/starMessage.coffee.js                                         //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                         // 1
  starMessage: function(message) {                                                                       //
    var room;                                                                                            // 3
    if (!Meteor.userId()) {                                                                              //
      throw new Meteor.Error('error-invalid-user', "Invalid user", {                                     // 4
        method: 'starMessage'                                                                            //
      });                                                                                                //
    }                                                                                                    //
    if (!RocketChat.settings.get('Message_AllowStarring')) {                                             //
      throw new Meteor.Error('error-action-not-allowed', 'Message starring not allowed', {               // 7
        method: 'pinMessage',                                                                            //
        action: 'Message_starring'                                                                       //
      });                                                                                                //
    }                                                                                                    //
    room = RocketChat.models.Rooms.findOneById(message.rid);                                             //
    if (Array.isArray(room.usernames) && room.usernames.indexOf(Meteor.user().username) === -1) {        //
      return false;                                                                                      // 12
    }                                                                                                    //
    return RocketChat.models.Messages.updateUserStarById(message._id, Meteor.userId(), message.starred);
  }                                                                                                      //
});                                                                                                      //
                                                                                                         //
///////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/rocketchat_message-star/server/publications/starredMessages.coffee.js                        //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('starredMessages', function(rid, limit) {                                                 // 1
  var cursorHandle, publication, user;                                                                   // 2
  if (limit == null) {                                                                                   //
    limit = 50;                                                                                          //
  }                                                                                                      //
  if (!this.userId) {                                                                                    //
    return this.ready();                                                                                 // 3
  }                                                                                                      //
  publication = this;                                                                                    //
  user = RocketChat.models.Users.findOneById(this.userId);                                               //
  if (!user) {                                                                                           //
    return this.ready();                                                                                 // 9
  }                                                                                                      //
  cursorHandle = RocketChat.models.Messages.findStarredByUserAtRoom(this.userId, rid, {                  //
    sort: {                                                                                              //
      ts: -1                                                                                             //
    },                                                                                                   //
    limit: limit                                                                                         //
  }).observeChanges({                                                                                    //
    added: function(_id, record) {                                                                       //
      return publication.added('rocketchat_starred_message', _id, record);                               //
    },                                                                                                   //
    changed: function(_id, record) {                                                                     //
      return publication.changed('rocketchat_starred_message', _id, record);                             //
    },                                                                                                   //
    removed: function(_id) {                                                                             //
      return publication.removed('rocketchat_starred_message', _id);                                     //
    }                                                                                                    //
  });                                                                                                    //
  this.ready();                                                                                          //
  return this.onStop(function() {                                                                        //
    return cursorHandle.stop();                                                                          //
  });                                                                                                    //
});                                                                                                      // 1
                                                                                                         //
///////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/rocketchat_message-star/server/startup/indexes.coffee.js                                     //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                                                              // 1
  return Meteor.defer(function() {                                                                       //
    return RocketChat.models.Messages.tryEnsureIndex({                                                   //
      'starred._id': 1                                                                                   //
    }, {                                                                                                 //
      sparse: 1                                                                                          //
    });                                                                                                  //
  });                                                                                                    //
});                                                                                                      // 1
                                                                                                         //
///////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:message-star'] = {};

})();

//# sourceMappingURL=rocketchat_message-star.js.map
