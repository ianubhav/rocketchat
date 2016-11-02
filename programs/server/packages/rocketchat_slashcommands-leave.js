(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
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

//////////////////////////////////////////////////////////////////////////////
//                                                                          //
// packages/rocketchat_slashcommands-leave/leave.coffee.js                  //
//                                                                          //
//////////////////////////////////////////////////////////////////////////////
                                                                            //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                                                                            //
/*                                                                          // 1
 * Leave is a named function that will replace /leave commands              //
 * @param {Object} message - The message object                             //
 */                                                                         //
var Leave;                                                                  // 1
                                                                            //
if (Meteor.isClient) {                                                      // 6
  RocketChat.slashCommands.add('leave', void 0, {                           //
    description: 'Leave_the_current_channel'                                //
  });                                                                       //
  RocketChat.slashCommands.add('part', void 0, {                            //
    description: 'Leave_the_current_channel'                                //
  });                                                                       //
} else {                                                                    //
  Leave = (function() {                                                     //
    function Leave(command, params, item) {                                 //
      var err;                                                              // 16
      if (command === "leave" || command === "part") {                      //
        try {                                                               // 17
          Meteor.call('leaveRoom', item.rid);                               //
        } catch (error) {                                                   //
          err = error;                                                      //
          RocketChat.Notifications.notifyUser(Meteor.userId(), 'message', {
            _id: Random.id(),                                               //
            rid: item.rid,                                                  //
            ts: new Date,                                                   //
            msg: TAPi18n.__(err.error, null, Meteor.user().language)        //
          });                                                               //
        }                                                                   //
      }                                                                     //
    }                                                                       //
                                                                            //
    return Leave;                                                           //
                                                                            //
  })();                                                                     //
  RocketChat.slashCommands.add('leave', Leave);                             //
  RocketChat.slashCommands.add('part', Leave);                              //
}                                                                           //
                                                                            //
//////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:slashcommands-leave'] = {};

})();

//# sourceMappingURL=rocketchat_slashcommands-leave.js.map
