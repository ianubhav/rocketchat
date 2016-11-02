(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var OEmbed = Package['rocketchat:oembed'].OEmbed;
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_spotify/lib/spotify.coffee.js                                                                 //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                                                                                                                     //
/*                                                                                                                   //
 * Spotify a named function that will process Spotify links or syntaxes (ex: spotify:track:1q6IK1l4qpYykOaWaLJkWG)   //
 * @param {Object} message - The message object                                                                      //
 */                                                                                                                  //
var Spotify;                                                                                                         //
                                                                                                                     //
Spotify = function () {                                                                                              //
  var process;                                                                                                       //
                                                                                                                     //
  function Spotify() {}                                                                                              //
                                                                                                                     //
  process = function process(message, source, callback) {                                                            //
    var codeMatch, i, index, len, msgParts, part, results;                                                           //
    if (_.trim(source)) {                                                                                            //
      msgParts = source.split(/(```\w*[\n ]?[\s\S]*?```+?)|(`(?:[^`]+)`)/);                                          //
      results = [];                                                                                                  //
      for (index = i = 0, len = msgParts.length; i < len; index = ++i) {                                             //
        part = msgParts[index];                                                                                      //
        if (((part != null ? part.length : void 0) != null) > 0) {                                                   //
          codeMatch = part.match(/(?:```(\w*)[\n ]?([\s\S]*?)```+?)|(?:`(?:[^`]+)`)/);                               //
          if (codeMatch == null) {                                                                                   //
            results.push(callback(message, msgParts, index, part));                                                  //
          } else {                                                                                                   //
            results.push(void 0);                                                                                    //
          }                                                                                                          //
        } else {                                                                                                     //
          results.push(void 0);                                                                                      //
        }                                                                                                            //
      }                                                                                                              //
      return results;                                                                                                //
    }                                                                                                                //
  };                                                                                                                 //
                                                                                                                     //
  Spotify.transform = function (message) {                                                                           //
    var changed, urls;                                                                                               //
    urls = [];                                                                                                       //
    if (Array.isArray(message.urls)) {                                                                               //
      urls = urls.concat(message.urls);                                                                              //
    }                                                                                                                //
    changed = false;                                                                                                 //
    process(message, message.msg, function (message, msgParts, index, part) {                                        //
      var data, match, path, re, results, url;                                                                       //
      re = /(?:^|\s)spotify:([^:\s]+):([^:\s]+)(?::([^:\s]+))?(?::(\S+))?(?:\s|$)/g;                                 //
      results = [];                                                                                                  //
      while (match = re.exec(part)) {                                                                                //
        data = _.filter(match.slice(1), function (value) {                                                           //
          return value != null;                                                                                      //
        });                                                                                                          //
        path = _.map(data, function (value) {                                                                        //
          return _.escape(value);                                                                                    //
        }).join('/');                                                                                                //
        url = 'https://open.spotify.com/' + path;                                                                    //
        urls.push({                                                                                                  //
          'url': url,                                                                                                //
          'source': 'spotify:' + data.join(':')                                                                      //
        });                                                                                                          //
        results.push(changed = true);                                                                                //
      }                                                                                                              //
      return results;                                                                                                //
    });                                                                                                              //
    if (changed) {                                                                                                   //
      message.urls = urls;                                                                                           //
    }                                                                                                                //
    return message;                                                                                                  //
  };                                                                                                                 //
                                                                                                                     //
  Spotify.render = function (message) {                                                                              //
    process(message, message.html, function (message, msgParts, index, part) {                                       //
      var i, item, len, quotedSource, re, ref;                                                                       //
      if (Array.isArray(message.urls)) {                                                                             //
        ref = message.urls;                                                                                          //
        for (i = 0, len = ref.length; i < len; i++) {                                                                //
          item = ref[i];                                                                                             //
          if (item.source) {                                                                                         //
            quotedSource = item.source.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');                                       //
            re = new RegExp('(^|\\s)' + quotedSource + '(\\s|$)', 'g');                                              //
            msgParts[index] = part.replace(re, '$1<a href="' + item.url + '" target="_blank">' + item.source + '</a>$2');
          }                                                                                                          //
        }                                                                                                            //
        return message.html = msgParts.join('');                                                                     //
      }                                                                                                              //
    });                                                                                                              //
    return message;                                                                                                  //
  };                                                                                                                 //
                                                                                                                     //
  return Spotify;                                                                                                    //
}();                                                                                                                 //
                                                                                                                     //
RocketChat.callbacks.add('beforeSaveMessage', Spotify.transform, RocketChat.callbacks.priority.LOW, 'spotify-save');
                                                                                                                     //
RocketChat.callbacks.add('renderMessage', Spotify.render, RocketChat.callbacks.priority.MEDIUM, 'spotify-render');   //
                                                                                                                     //
RocketChat.Spotify = Spotify;                                                                                        //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:spotify'] = {};

})();
