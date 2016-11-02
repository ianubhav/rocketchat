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

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/rocketchat_slashcommands-me/me.coffee.js                 //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                                                                     //
/*                                                                   // 1
 * Me is a named function that will replace /me commands             //
 * @param {Object} message - The message object                      //
 */                                                                  //
var Me;                                                              // 1
                                                                     //
Me = (function() {                                                   // 6
  function Me(command, params, item) {                               //
    var msg;                                                         // 8
    if (command === "me") {                                          //
      if (_.trim(params)) {                                          //
        msg = item;                                                  //
        msg.msg = '_' + params + '_';                                //
        Meteor.call('sendMessage', msg);                             //
      }                                                              //
    }                                                                //
  }                                                                  //
                                                                     //
  return Me;                                                         //
                                                                     //
})();                                                                //
                                                                     //
RocketChat.slashCommands.add('me', Me, {                             // 14
  description: 'Displays_action_text',                               //
  params: 'your_message'                                             //
});                                                                  //
                                                                     //
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:slashcommands-me'] = {};

})();

//# sourceMappingURL=rocketchat_slashcommands-me.js.map
