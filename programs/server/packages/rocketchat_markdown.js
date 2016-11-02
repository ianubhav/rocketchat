(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var s = Package['underscorestring:underscore.string'].s;
var hljs = Package['simple:highlight.js'].hljs;
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/rocketchat_markdown/settings.coffee.js                                                               //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                                                                      // 1
  RocketChat.settings.add('Markdown_Headers', false, {                                                           //
    type: 'boolean',                                                                                             //
    group: 'Message',                                                                                            //
    section: 'Markdown',                                                                                         //
    "public": true                                                                                               //
  });                                                                                                            //
  return RocketChat.settings.add('Markdown_SupportSchemesForLink', 'http,https', {                               //
    type: 'string',                                                                                              //
    group: 'Message',                                                                                            //
    section: 'Markdown',                                                                                         //
    "public": true,                                                                                              //
    i18nDescription: 'Markdown_SupportSchemesForLink_Description'                                                //
  });                                                                                                            //
});                                                                                                              // 1
                                                                                                                 //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/rocketchat_markdown/markdown.coffee.js                                                               //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                                                                                                                 //
/*                                                                                                               //
 * Markdown is a named function that will parse markdown syntax                                                  //
 * @param {Object} message - The message object                                                                  //
 */                                                                                                              //
var Markdown;                                                                                                    //
                                                                                                                 //
Markdown = function () {                                                                                         //
  function Markdown(message) {                                                                                   //
    var msg, schemes;                                                                                            //
    msg = message;                                                                                               //
    if (!_.isString(message)) {                                                                                  //
      if (_.trim(message != null ? message.html : void 0)) {                                                     //
        msg = message.html;                                                                                      //
      } else {                                                                                                   //
        return message;                                                                                          //
      }                                                                                                          //
    }                                                                                                            //
    schemes = RocketChat.settings.get('Markdown_SupportSchemesForLink').split(',').join('|');                    //
    msg = msg.replace(new RegExp("!\\[([^\\]]+)\\]\\(((?:" + schemes + "):\\/\\/[^\\)]+)\\)", 'gm'), function (match, title, url) {
      var target;                                                                                                //
      target = url.indexOf(Meteor.absoluteUrl()) === 0 ? '' : '_blank';                                          //
      return '<a href="' + url + '" title="' + title + '" class="swipebox" target="' + target + '"><div class="inline-image" style="background-image: url(' + url + ');"></div></a>';
    });                                                                                                          //
    msg = msg.replace(new RegExp("\\[([^\\]]+)\\]\\(((?:" + schemes + "):\\/\\/[^\\)]+)\\)", 'gm'), function (match, title, url) {
      var target;                                                                                                //
      target = url.indexOf(Meteor.absoluteUrl()) === 0 ? '' : '_blank';                                          //
      return '<a href="' + url + '" target="' + target + '">' + title + '</a>';                                  //
    });                                                                                                          //
    msg = msg.replace(new RegExp("(?:<|&lt;)((?:" + schemes + "):\\/\\/[^\\|]+)\\|(.+?)(?=>|&gt;)(?:>|&gt;)", 'gm'), function (match, url, title) {
      var target;                                                                                                //
      target = url.indexOf(Meteor.absoluteUrl()) === 0 ? '' : '_blank';                                          //
      return '<a href="' + url + '" target="' + target + '">' + title + '</a>';                                  //
    });                                                                                                          //
    if (RocketChat.settings.get('Markdown_Headers')) {                                                           //
      msg = msg.replace(/^# (([\S\w\d-_\/\*\.,\\][ \u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]?)+)/gm, '<h1>$1</h1>');
      msg = msg.replace(/^## (([\S\w\d-_\/\*\.,\\][ \u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]?)+)/gm, '<h2>$1</h2>');
      msg = msg.replace(/^### (([\S\w\d-_\/\*\.,\\][ \u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]?)+)/gm, '<h3>$1</h3>');
      msg = msg.replace(/^#### (([\S\w\d-_\/\*\.,\\][ \u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]?)+)/gm, '<h4>$1</h4>');
    }                                                                                                            //
    msg = msg.replace(/(^|&gt;|[ >_~`])\*{1,2}([^\*\r\n]+)\*{1,2}([<_~`]|\B|\b|$)/gm, '$1<span class="copyonly">*</span><strong>$2</strong><span class="copyonly">*</span>$3');
    msg = msg.replace(/(^|&gt;|[ >*~`])\_([^\_\r\n]+)\_([<*~`]|\B|\b|$)/gm, '$1<span class="copyonly">_</span><em>$2</em><span class="copyonly">_</span>$3');
    msg = msg.replace(/(^|&gt;|[ >_*`])\~{1,2}([^~\r\n]+)\~{1,2}([<_*`]|\B|\b|$)/gm, '$1<span class="copyonly">~</span><strike>$2</strike><span class="copyonly">~</span>$3');
    msg = msg.replace(/(?:&gt;){3}\n+([\s\S]*?)\n+(?:&lt;){3}/g, '<blockquote><span class="copyonly">&gt;&gt;&gt;</span>$1<span class="copyonly">&lt;&lt;&lt;</span></blockquote>');
    msg = msg.replace(/^&gt;(.*)$/gm, '<blockquote><span class="copyonly">&gt;</span>$1</blockquote>');          //
    msg = msg.replace(/\s*<blockquote>/gm, '<blockquote>');                                                      //
    msg = msg.replace(/<\/blockquote>\s*/gm, '</blockquote>');                                                   //
    msg = msg.replace(/<\/blockquote>\n<blockquote>/gm, '</blockquote><blockquote>');                            //
    if (!_.isString(message)) {                                                                                  //
      message.html = msg;                                                                                        //
    } else {                                                                                                     //
      message = msg;                                                                                             //
    }                                                                                                            //
    if (typeof window !== "undefined" && window !== null ? window.rocketDebug : void 0) {                        //
      console.log('Markdown', message);                                                                          //
    }                                                                                                            //
    return message;                                                                                              //
  }                                                                                                              //
                                                                                                                 //
  return Markdown;                                                                                               //
}();                                                                                                             //
                                                                                                                 //
RocketChat.Markdown = Markdown;                                                                                  //
                                                                                                                 //
RocketChat.callbacks.add('renderMessage', Markdown, RocketChat.callbacks.priority.HIGH, 'markdown');             //
                                                                                                                 //
if (Meteor.isClient) {                                                                                           //
  Blaze.registerHelper('RocketChatMarkdown', function (text) {                                                   //
    return RocketChat.Markdown(text);                                                                            //
  });                                                                                                            //
}                                                                                                                //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/rocketchat_markdown/markdowncode.coffee.js                                                           //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                                                                                                                 //
/*                                                                                                               //
 * MarkdownCode is a named function that will parse `inline code` and ```codeblock``` syntaxes                   //
 * @param {Object} message - The message object                                                                  //
 */                                                                                                              //
var MarkdownCode,                                                                                                //
    indexOf = [].indexOf || function (item) {                                                                    //
  for (var i = 0, l = this.length; i < l; i++) {                                                                 //
    if (i in this && this[i] === item) return i;                                                                 //
  }return -1;                                                                                                    //
};                                                                                                               //
                                                                                                                 //
MarkdownCode = function () {                                                                                     //
  function MarkdownCode(message) {                                                                               //
    if (s.trim(message.html)) {                                                                                  //
      if (message.tokens == null) {                                                                              //
        message.tokens = [];                                                                                     //
      }                                                                                                          //
      MarkdownCode.handle_codeblocks(message);                                                                   //
      MarkdownCode.handle_inlinecode(message);                                                                   //
      if (typeof window !== "undefined" && window !== null ? window.rocketDebug : void 0) {                      //
        console.log('Markdown', message);                                                                        //
      }                                                                                                          //
    }                                                                                                            //
    return message;                                                                                              //
  }                                                                                                              //
                                                                                                                 //
  MarkdownCode.handle_inlinecode = function (message) {                                                          //
    return message.html = message.html.replace(/(^|&gt;|[ >_*~])\`([^`\r\n]+)\`([<_*~]|\B|\b|$)/gm, function (match, p1, p2, p3, offset, text) {
      var token;                                                                                                 //
      token = "=&=" + Random.id() + "=&=";                                                                       //
      message.tokens.push({                                                                                      //
        token: token,                                                                                            //
        text: p1 + "<span class=\"copyonly\">`</span><span><code class=\"inline\">" + p2 + "</code></span><span class=\"copyonly\">`</span>" + p3
      });                                                                                                        //
      return token;                                                                                              //
    });                                                                                                          //
  };                                                                                                             //
                                                                                                                 //
  MarkdownCode.handle_codeblocks = function (message) {                                                          //
    var code, codeMatch, count, i, index, lang, len, msgParts, part, ref, result, singleLine, token;             //
    count = (message.html.match(/```/g) || []).length;                                                           //
    if (count) {                                                                                                 //
      if (count % 2 > 0) {                                                                                       //
        message.html = message.html + "\n```";                                                                   //
        message.msg = message.msg + "\n```";                                                                     //
      }                                                                                                          //
      msgParts = message.html.split(/^\s*(```(?:[a-zA-Z]+)?(?:(?:.|\n)*?)```)(?:\n)?$/gm);                       //
      for (index = i = 0, len = msgParts.length; i < len; index = ++i) {                                         //
        part = msgParts[index];                                                                                  //
        codeMatch = part.match(/^```(\w*[\n\ ]?)([\s\S]*?)```+?$/);                                              //
        if (codeMatch != null) {                                                                                 //
          singleLine = codeMatch[0].indexOf('\n') === -1;                                                        //
          if (singleLine) {                                                                                      //
            lang = '';                                                                                           //
            code = _.unescapeHTML(codeMatch[1] + codeMatch[2]);                                                  //
          } else {                                                                                               //
            lang = codeMatch[1];                                                                                 //
            code = _.unescapeHTML(codeMatch[2]);                                                                 //
          }                                                                                                      //
          if (s.trim(lang) === '') {                                                                             //
            lang = '';                                                                                           //
          }                                                                                                      //
          if (ref = s.trim(lang), indexOf.call(hljs.listLanguages(), ref) < 0) {                                 //
            result = hljs.highlightAuto(lang + code);                                                            //
          } else {                                                                                               //
            result = hljs.highlight(s.trim(lang), code);                                                         //
          }                                                                                                      //
          token = "=&=" + Random.id() + "=&=";                                                                   //
          message.tokens.push({                                                                                  //
            highlight: true,                                                                                     //
            token: token,                                                                                        //
            text: "<pre><code class='hljs " + result.language + "'><span class='copyonly'>```<br></span>" + result.value + "<span class='copyonly'><br>```</span></code></pre>"
          });                                                                                                    //
          msgParts[index] = token;                                                                               //
        } else {                                                                                                 //
          msgParts[index] = part;                                                                                //
        }                                                                                                        //
      }                                                                                                          //
      return message.html = msgParts.join('');                                                                   //
    }                                                                                                            //
  };                                                                                                             //
                                                                                                                 //
  return MarkdownCode;                                                                                           //
}();                                                                                                             //
                                                                                                                 //
RocketChat.MarkdownCode = MarkdownCode;                                                                          //
                                                                                                                 //
RocketChat.callbacks.add('renderMessage', MarkdownCode, RocketChat.callbacks.priority.HIGH - 2, 'markdowncode');
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:markdown'] = {};

})();

//# sourceMappingURL=rocketchat_markdown.js.map
