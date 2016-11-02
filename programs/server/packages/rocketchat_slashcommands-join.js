(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var check = Package.check.check;
var Match = Package.check.Match;
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/rocketchat_slashcommands-join/server.coffee.js                                                //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                                                                                                          //
/*                                                                                                        // 1
 * Join is a named function that will replace /join commands                                              //
 * @param {Object} message - The message object                                                           //
 */                                                                                                       //
var Join;                                                                                                 // 1
                                                                                                          //
Join = (function() {                                                                                      // 6
  function Join(command, params, item) {                                                                  //
    var channel, room, user;                                                                              // 8
    if (command !== 'join' || !Match.test(params, String)) {                                              //
      return;                                                                                             // 9
    }                                                                                                     //
    channel = params.trim();                                                                              //
    if (channel === '') {                                                                                 //
      return;                                                                                             // 13
    }                                                                                                     //
    channel = channel.replace('#', '');                                                                   //
    user = Meteor.users.findOne(Meteor.userId());                                                         //
    room = RocketChat.models.Rooms.findOneByNameAndTypeNotContainigUsername(channel, 'c', user.username);
    if (room == null) {                                                                                   //
      RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {                                   //
        _id: Random.id(),                                                                                 //
        rid: item.rid,                                                                                    //
        ts: new Date,                                                                                     //
        msg: TAPi18n.__('Channel_doesnt_exist', {                                                         //
          postProcess: 'sprintf',                                                                         //
          sprintf: [channel]                                                                              //
        }, user.language)                                                                                 //
      });                                                                                                 //
      return;                                                                                             // 27
    }                                                                                                     //
    Meteor.call('joinRoom', room._id);                                                                    //
  }                                                                                                       //
                                                                                                          //
  return Join;                                                                                            //
                                                                                                          //
})();                                                                                                     //
                                                                                                          //
RocketChat.slashCommands.add('join', Join);                                                               // 31
                                                                                                          //
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:slashcommands-join'] = {};

})();

//# sourceMappingURL=rocketchat_slashcommands-join.js.map
