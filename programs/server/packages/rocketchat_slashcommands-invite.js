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

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// packages/rocketchat_slashcommands-invite/server.coffee.js                                   //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                               //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                                                                                               //
/*                                                                                             // 1
 * Invite is a named function that will replace /invite commands                               //
 * @param {Object} message - The message object                                                //
 */                                                                                            //
var Invite;                                                                                    // 1
                                                                                               //
Invite = (function() {                                                                         // 6
  function Invite(command, params, item) {                                                     //
    var currentUser, usernames, users;                                                         // 8
    if (command !== 'invite' || !Match.test(params, String)) {                                 //
      return;                                                                                  // 9
    }                                                                                          //
    usernames = params.replace(/@/g, '').split(/[\s,]/).filter(function(a) {                   //
      return '' !== a;                                                                         //
    });                                                                                        //
    if (0 === usernames.length) {                                                              //
      return;                                                                                  // 13
    }                                                                                          //
    users = Meteor.users.find({                                                                //
      username: {                                                                              //
        $in: usernames                                                                         //
      }                                                                                        //
    });                                                                                        //
    currentUser = Meteor.users.findOne(Meteor.userId());                                       //
    if (0 === users.count()) {                                                                 //
      RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {                        //
        _id: Random.id(),                                                                      //
        rid: item.rid,                                                                         //
        ts: new Date,                                                                          //
        msg: TAPi18n.__('User_doesnt_exist', {                                                 //
          postProcess: 'sprintf',                                                              //
          sprintf: [usernames.join(' @')]                                                      //
        }, currentUser.language)                                                               //
      });                                                                                      //
      return;                                                                                  // 25
    }                                                                                          //
    usernames = usernames.filter(function(username) {                                          //
      if (RocketChat.models.Rooms.findOneByIdContainigUsername(item.rid, username) == null) {  //
        return true;                                                                           // 29
      }                                                                                        //
      RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {                        //
        _id: Random.id(),                                                                      //
        rid: item.rid,                                                                         //
        ts: new Date,                                                                          //
        msg: TAPi18n.__('Username_is_already_in_here', {                                       //
          postProcess: 'sprintf',                                                              //
          sprintf: [username]                                                                  //
        }, currentUser.language)                                                               //
      });                                                                                      //
      return false;                                                                            // 38
    });                                                                                        //
    if (0 === usernames.length) {                                                              //
      return;                                                                                  // 43
    }                                                                                          //
    users.forEach(function(user) {                                                             //
      var e;                                                                                   // 46
      try {                                                                                    // 46
        return Meteor.call('addUserToRoom', {                                                  //
          rid: item.rid,                                                                       //
          username: user.username                                                              //
        });                                                                                    //
      } catch (error) {                                                                        //
        e = error;                                                                             //
        if (e.error === 'cant-invite-for-direct-room') {                                       //
          RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {                    //
            _id: Random.id(),                                                                  //
            rid: item.rid,                                                                     //
            ts: new Date,                                                                      //
            msg: TAPi18n.__('Cannot_invite_users_to_direct_rooms', null, currentUser.language)
          });                                                                                  //
        } else {                                                                               //
          RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {                    //
            _id: Random.id(),                                                                  //
            rid: item.rid,                                                                     //
            ts: new Date,                                                                      //
            msg: TAPi18n.__(e.error, null, currentUser.language)                               //
          });                                                                                  //
        }                                                                                      //
      }                                                                                        //
    });                                                                                        //
  }                                                                                            //
                                                                                               //
  return Invite;                                                                               //
                                                                                               //
})();                                                                                          //
                                                                                               //
RocketChat.slashCommands.add('invite', Invite);                                                // 68
                                                                                               //
/////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:slashcommands-invite'] = {};

})();

//# sourceMappingURL=rocketchat_slashcommands-invite.js.map
