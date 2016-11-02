(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var Logger = Package['rocketchat:logger'].Logger;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var logger, __coffeescriptShare;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_message-mark-as-unread/server/logger.js                                                    //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
/* globals logger:true */
/* exported logger */

logger = new Logger('MessageMarkAsUnread', {
	sections: {
		connection: 'Connection',
		events: 'Events'
	}
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_message-mark-as-unread/server/unreadMessages.coffee.js                                     //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                  // 1
  unreadMessages: function(firstUnreadMessage) {                                                                  //
    var lastSeen, originalMessage;                                                                                // 3
    if (!Meteor.userId()) {                                                                                       //
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                              // 4
        method: 'unreadMessages'                                                                                  //
      });                                                                                                         //
    }                                                                                                             //
    originalMessage = RocketChat.models.Messages.findOneById(firstUnreadMessage._id, {                            //
      fields: {                                                                                                   //
        u: 1,                                                                                                     //
        rid: 1,                                                                                                   //
        file: 1,                                                                                                  //
        ts: 1                                                                                                     //
      }                                                                                                           //
    });                                                                                                           //
    if (originalMessage == null) {                                                                                //
      throw new Meteor.Error('error-action-not-allowed', 'Not allowed', {                                         // 8
        method: 'unreadMessages',                                                                                 //
        action: 'Unread_messages'                                                                                 //
      });                                                                                                         //
    }                                                                                                             //
    if (Meteor.userId() === originalMessage.u._id) {                                                              //
      throw new Meteor.Error('error-action-not-allowed', 'Not allowed', {                                         // 11
        method: 'unreadMessages',                                                                                 //
        action: 'Unread_messages'                                                                                 //
      });                                                                                                         //
    }                                                                                                             //
    lastSeen = RocketChat.models.Subscriptions.findOneByRoomIdAndUserId(originalMessage.rid, Meteor.userId()).ls;
    if (firstUnreadMessage.ts >= lastSeen) {                                                                      //
      logger.connection.debug('Provided message is already marked as unread');                                    //
      return;                                                                                                     // 16
    }                                                                                                             //
    logger.connection.debug('Updating unread  message of ' + originalMessage.ts + ' as the first unread');        //
    return RocketChat.models.Subscriptions.setAsUnreadByRoomIdAndUserId(originalMessage.rid, Meteor.userId(), originalMessage.ts);
  }                                                                                                               //
});                                                                                                               //
                                                                                                                  //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:message-mark-as-unread'] = {};

})();

//# sourceMappingURL=rocketchat_message-mark-as-unread.js.map
