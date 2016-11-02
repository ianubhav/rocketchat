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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_mentions/server.coffee.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                                                                                                                       //
/*                                                                                                                     // 1
 * Mentions is a named function that will process Mentions                                                             //
 * @param {Object} message - The message object                                                                        //
 */                                                                                                                    //
var MentionsServer;                                                                                                    // 1
                                                                                                                       //
MentionsServer = (function() {                                                                                         // 6
  function MentionsServer(message) {                                                                                   //
    var channels, mentions, msgChannelRegex, msgMentionRegex, verifiedChannels, verifiedMentions;                      // 9
    mentions = [];                                                                                                     //
    msgMentionRegex = new RegExp('(?:^|\\s|\\n)(?:@)(' + RocketChat.settings.get('UTF8_Names_Validation') + ')', 'g');
    message.msg.replace(msgMentionRegex, function(match, mention) {                                                    //
      return mentions.push(mention);                                                                                   //
    });                                                                                                                //
    if (mentions.length !== 0) {                                                                                       //
      mentions = _.unique(mentions);                                                                                   //
      verifiedMentions = [];                                                                                           //
      mentions.forEach(function(mention) {                                                                             //
        var allChannel, messageMaxAll, verifiedMention;                                                                // 17
        if (mention === 'all') {                                                                                       //
          messageMaxAll = RocketChat.settings.get('Message_MaxAll');                                                   //
          if (messageMaxAll > 0) {                                                                                     //
            allChannel = RocketChat.models.Rooms.findOneById(message.rid);                                             //
            if (allChannel.usernames.length <= messageMaxAll) {                                                        //
              verifiedMention = {                                                                                      //
                _id: mention,                                                                                          //
                username: mention                                                                                      //
              };                                                                                                       //
            }                                                                                                          //
          } else {                                                                                                     //
            verifiedMention = {                                                                                        //
              _id: mention,                                                                                            //
              username: mention                                                                                        //
            };                                                                                                         //
          }                                                                                                            //
        } else if (mention === 'here') {                                                                               //
          verifiedMention = {                                                                                          //
            _id: mention,                                                                                              //
            username: mention                                                                                          //
          };                                                                                                           //
        } else {                                                                                                       //
          verifiedMention = Meteor.users.findOne({                                                                     //
            username: mention                                                                                          //
          }, {                                                                                                         //
            fields: {                                                                                                  //
              _id: 1,                                                                                                  //
              username: 1                                                                                              //
            }                                                                                                          //
          });                                                                                                          //
        }                                                                                                              //
        if (verifiedMention != null) {                                                                                 //
          return verifiedMentions.push(verifiedMention);                                                               //
        }                                                                                                              //
      });                                                                                                              //
      if (verifiedMentions.length !== 0) {                                                                             //
        message.mentions = verifiedMentions;                                                                           //
      }                                                                                                                //
    }                                                                                                                  //
    channels = [];                                                                                                     //
    msgChannelRegex = new RegExp('(?:^|\\s|\\n)(?:#)(' + RocketChat.settings.get('UTF8_Names_Validation') + ')', 'g');
    message.msg.replace(msgChannelRegex, function(match, mention) {                                                    //
      return channels.push(mention);                                                                                   //
    });                                                                                                                //
    if (channels.length !== 0) {                                                                                       //
      channels = _.unique(channels);                                                                                   //
      verifiedChannels = [];                                                                                           //
      channels.forEach(function(mention) {                                                                             //
        var verifiedChannel;                                                                                           // 49
        verifiedChannel = RocketChat.models.Rooms.findOneByNameAndType(mention, 'c', {                                 //
          fields: {                                                                                                    //
            _id: 1,                                                                                                    //
            name: 1                                                                                                    //
          }                                                                                                            //
        });                                                                                                            //
        if (verifiedChannel != null) {                                                                                 //
          return verifiedChannels.push(verifiedChannel);                                                               //
        }                                                                                                              //
      });                                                                                                              //
      if (verifiedChannels.length !== 0) {                                                                             //
        message.channels = verifiedChannels;                                                                           //
      }                                                                                                                //
    }                                                                                                                  //
    return message;                                                                                                    // 54
  }                                                                                                                    //
                                                                                                                       //
  return MentionsServer;                                                                                               //
                                                                                                                       //
})();                                                                                                                  //
                                                                                                                       //
RocketChat.callbacks.add('beforeSaveMessage', MentionsServer, RocketChat.callbacks.priority.HIGH, 'mentions');         // 56
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:mentions'] = {};

})();

//# sourceMappingURL=rocketchat_mentions.js.map
