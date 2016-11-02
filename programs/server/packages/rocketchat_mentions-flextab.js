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

//////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                              //
// packages/rocketchat_mentions-flextab/server/publications/mentionedMessages.coffee.js         //
//                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('mentionedMessages', function(rid, limit) {                                      // 1
  var cursorHandle, publication, user;                                                          // 2
  if (limit == null) {                                                                          //
    limit = 50;                                                                                 //
  }                                                                                             //
  if (!this.userId) {                                                                           //
    return this.ready();                                                                        // 3
  }                                                                                             //
  publication = this;                                                                           //
  user = RocketChat.models.Users.findOneById(this.userId);                                      //
  if (!user) {                                                                                  //
    return this.ready();                                                                        // 9
  }                                                                                             //
  cursorHandle = RocketChat.models.Messages.findVisibleByMentionAndRoomId(user.username, rid, {
    sort: {                                                                                     //
      ts: -1                                                                                    //
    },                                                                                          //
    limit: limit                                                                                //
  }).observeChanges({                                                                           //
    added: function(_id, record) {                                                              //
      record.mentionedList = true;                                                              //
      return publication.added('rocketchat_mentioned_message', _id, record);                    //
    },                                                                                          //
    changed: function(_id, record) {                                                            //
      record.mentionedList = true;                                                              //
      return publication.changed('rocketchat_mentioned_message', _id, record);                  //
    },                                                                                          //
    removed: function(_id) {                                                                    //
      return publication.removed('rocketchat_mentioned_message', _id);                          //
    }                                                                                           //
  });                                                                                           //
  this.ready();                                                                                 //
  return this.onStop(function() {                                                               //
    return cursorHandle.stop();                                                                 //
  });                                                                                           //
});                                                                                             // 1
                                                                                                //
//////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:mentions-flextab'] = {};

})();

//# sourceMappingURL=rocketchat_mentions-flextab.js.map
