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

//////////////////////////////////////////////////////////////////////////
//                                                                      //
// packages/rocketchat_slashcommands-mute/server/mute.coffee.js         //
//                                                                      //
//////////////////////////////////////////////////////////////////////////
                                                                        //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                                                                        //
/*                                                                      // 1
 * Mute is a named function that will replace /mute commands            //
 */                                                                     //
var Mute,                                                               // 1
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
                                                                        //
Mute = (function() {                                                    // 5
  function Mute(command, params, item) {                                //
    var mutedUser, room, user, username;                                // 7
    if (command !== 'mute' || !Match.test(params, String)) {            //
      return;                                                           // 8
    }                                                                   //
    username = params.trim();                                           //
    if (username === '') {                                              //
      return;                                                           // 12
    }                                                                   //
    username = username.replace('@', '');                               //
    user = Meteor.users.findOne(Meteor.userId());                       //
    mutedUser = RocketChat.models.Users.findOneByUsername(username);    //
    room = RocketChat.models.Rooms.findOneById(item.rid);               //
    if (mutedUser == null) {                                            //
      RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {
        _id: Random.id(),                                               //
        rid: item.rid,                                                  //
        ts: new Date,                                                   //
        msg: TAPi18n.__('Username_doesnt_exist', {                      //
          postProcess: 'sprintf',                                       //
          sprintf: [username]                                           //
        }, user.language)                                               //
      });                                                               //
      return;                                                           // 27
    }                                                                   //
    if (indexOf.call(room.usernames || [], username) < 0) {             //
      RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {
        _id: Random.id(),                                               //
        rid: item.rid,                                                  //
        ts: new Date,                                                   //
        msg: TAPi18n.__('Username_is_not_in_this_room', {               //
          postProcess: 'sprintf',                                       //
          sprintf: [username]                                           //
        }, user.language)                                               //
      });                                                               //
      return;                                                           // 36
    }                                                                   //
    Meteor.call('muteUserInRoom', {                                     //
      rid: item.rid,                                                    //
      username: username                                                //
    });                                                                 //
  }                                                                     //
                                                                        //
  return Mute;                                                          //
                                                                        //
})();                                                                   //
                                                                        //
RocketChat.slashCommands.add('mute', Mute);                             // 40
                                                                        //
//////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////
//                                                                      //
// packages/rocketchat_slashcommands-mute/server/unmute.coffee.js       //
//                                                                      //
//////////////////////////////////////////////////////////////////////////
                                                                        //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                                                                        //
/*                                                                      // 1
 * Unmute is a named function that will replace /unmute commands        //
 */                                                                     //
var Unmute,                                                             // 1
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
                                                                        //
Unmute = (function() {                                                  // 5
  function Unmute(command, params, item) {                              //
    var room, unmutedUser, user, username;                              // 7
    if (command !== 'unmute' || !Match.test(params, String)) {          //
      return;                                                           // 8
    }                                                                   //
    username = params.trim();                                           //
    if (username === '') {                                              //
      return;                                                           // 12
    }                                                                   //
    username = username.replace('@', '');                               //
    user = Meteor.users.findOne(Meteor.userId());                       //
    unmutedUser = RocketChat.models.Users.findOneByUsername(username);  //
    room = RocketChat.models.Rooms.findOneById(item.rid);               //
    if (unmutedUser == null) {                                          //
      RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {
        _id: Random.id(),                                               //
        rid: item.rid,                                                  //
        ts: new Date,                                                   //
        msg: TAPi18n.__('Username_doesnt_exist', {                      //
          postProcess: 'sprintf',                                       //
          sprintf: [username]                                           //
        }, user.language)                                               //
      });                                                               //
      return;                                                           // 27
    }                                                                   //
    if (indexOf.call(room.usernames || [], username) < 0) {             //
      RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {
        _id: Random.id(),                                               //
        rid: item.rid,                                                  //
        ts: new Date,                                                   //
        msg: TAPi18n.__('Username_is_not_in_this_room', {               //
          postProcess: 'sprintf',                                       //
          sprintf: [username]                                           //
        }, user.language)                                               //
      });                                                               //
      return;                                                           // 36
    }                                                                   //
    Meteor.call('unmuteUserInRoom', {                                   //
      rid: item.rid,                                                    //
      username: username                                                //
    });                                                                 //
  }                                                                     //
                                                                        //
  return Unmute;                                                        //
                                                                        //
})();                                                                   //
                                                                        //
RocketChat.slashCommands.add('unmute', Unmute);                         // 40
                                                                        //
//////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:slashcommands-mute'] = {};

})();

//# sourceMappingURL=rocketchat_slashcommands-mute.js.map
