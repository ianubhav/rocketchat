(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var s = Package['underscorestring:underscore.string'].s;
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
// packages/rocketchat_katex/settings.coffee.js                                                 //
//                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                                                     // 1
  var enableQuery;                                                                              // 2
  enableQuery = {                                                                               //
    _id: 'Katex_Enabled',                                                                       //
    value: true                                                                                 //
  };                                                                                            //
  RocketChat.settings.add('Katex_Enabled', true, {                                              //
    type: 'boolean',                                                                            //
    group: 'Message',                                                                           //
    section: 'Katex',                                                                           //
    "public": true,                                                                             //
    i18n: 'Katex_Enabled_Description'                                                           //
  });                                                                                           //
  RocketChat.settings.add('Katex_Parenthesis_Syntax', true, {                                   //
    type: 'boolean',                                                                            //
    group: 'Message',                                                                           //
    section: 'Katex',                                                                           //
    "public": true,                                                                             //
    enableQuery: enableQuery,                                                                   //
    i18nDescription: 'Katex_Parenthesis_Syntax_Description'                                     //
  });                                                                                           //
  return RocketChat.settings.add('Katex_Dollar_Syntax', false, {                                //
    type: 'boolean',                                                                            //
    group: 'Message',                                                                           //
    section: 'Katex',                                                                           //
    "public": true,                                                                             //
    enableQuery: enableQuery,                                                                   //
    i18nDescription: 'Katex_Dollar_Syntax_Description'                                          //
  });                                                                                           //
});                                                                                             // 1
                                                                                                //
//////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                              //
// packages/rocketchat_katex/katex.coffee.js                                                    //
//                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                                                                                                //
/*                                                                                              // 1
 * KaTeX is a fast, easy-to-use JavaScript library for TeX math rendering on the web.           //
 * https://github.com/Khan/KaTeX                                                                //
 */                                                                                             //
var Katex, cb;                                                                                  // 1
                                                                                                //
Katex = (function() {                                                                           // 5
  var Boundary;                                                                                 // 6
                                                                                                //
  function Katex() {                                                                            //
    this.delimiters_map = [                                                                     //
      {                                                                                         //
        opener: '\\[',                                                                          //
        closer: '\\]',                                                                          //
        displayMode: true,                                                                      //
        enabled: (function(_this) {                                                             //
          return function() {                                                                   //
            return _this.parenthesis_syntax_enabled();                                          //
          };                                                                                    //
        })(this)                                                                                //
      }, {                                                                                      //
        opener: '\\(',                                                                          //
        closer: '\\)',                                                                          //
        displayMode: false,                                                                     //
        enabled: (function(_this) {                                                             //
          return function() {                                                                   //
            return _this.parenthesis_syntax_enabled();                                          //
          };                                                                                    //
        })(this)                                                                                //
      }, {                                                                                      //
        opener: '$$',                                                                           //
        closer: '$$',                                                                           //
        displayMode: true,                                                                      //
        enabled: (function(_this) {                                                             //
          return function() {                                                                   //
            return _this.dollar_syntax_enabled();                                               //
          };                                                                                    //
        })(this)                                                                                //
      }, {                                                                                      //
        opener: '$',                                                                            //
        closer: '$',                                                                            //
        displayMode: false,                                                                     //
        enabled: (function(_this) {                                                             //
          return function() {                                                                   //
            return _this.dollar_syntax_enabled();                                               //
          };                                                                                    //
        })(this)                                                                                //
      }                                                                                         //
    ];                                                                                          //
  }                                                                                             //
                                                                                                //
  Katex.prototype.find_opening_delimiter = function(str, start) {                               //
    var m, match, match_index, matches, o, pos, positions;                                      // 16
    matches = (function() {                                                                     //
      var i, len, ref, results;                                                                 //
      ref = this.delimiters_map;                                                                // 16
      results = [];                                                                             // 16
      for (i = 0, len = ref.length; i < len; i++) {                                             //
        o = ref[i];                                                                             //
        if (o.enabled()) {                                                                      //
          results.push({                                                                        //
            options: o,                                                                         //
            pos: str.indexOf(o.opener, start)                                                   //
          });                                                                                   //
        }                                                                                       //
      }                                                                                         // 16
      return results;                                                                           //
    }).call(this);                                                                              //
    positions = (function() {                                                                   //
      var i, len, results;                                                                      //
      results = [];                                                                             // 17
      for (i = 0, len = matches.length; i < len; i++) {                                         //
        m = matches[i];                                                                         //
        if (m.pos >= 0) {                                                                       //
          results.push(m.pos);                                                                  //
        }                                                                                       //
      }                                                                                         // 17
      return results;                                                                           //
    })();                                                                                       //
    if (positions.length === 0) {                                                               //
      return null;                                                                              // 21
    }                                                                                           //
    pos = Math.min.apply(Math, positions);                                                      //
    match_index = ((function() {                                                                //
      var i, len, results;                                                                      //
      results = [];                                                                             // 26
      for (i = 0, len = matches.length; i < len; i++) {                                         //
        m = matches[i];                                                                         //
        results.push(m.pos);                                                                    //
      }                                                                                         // 26
      return results;                                                                           //
    })()).indexOf(pos);                                                                         //
    match = matches[match_index];                                                               //
    return match;                                                                               // 29
  };                                                                                            //
                                                                                                //
  Boundary = (function() {                                                                      //
    function Boundary() {}                                                                      //
                                                                                                //
    Boundary.prototype.length = function() {                                                    //
      return this.end - this.start;                                                             // 33
    };                                                                                          //
                                                                                                //
    Boundary.prototype.extract = function(str) {                                                //
      return str.substr(this.start, this.length());                                             // 36
    };                                                                                          //
                                                                                                //
    return Boundary;                                                                            //
                                                                                                //
  })();                                                                                         //
                                                                                                //
  Katex.prototype.get_latex_boundaries = function(str, opening_delimiter_match) {               //
    var closer, closer_index, inner, outer;                                                     // 41
    inner = new Boundary;                                                                       //
    outer = new Boundary;                                                                       //
    closer = opening_delimiter_match.options.closer;                                            //
    outer.start = opening_delimiter_match.pos;                                                  //
    inner.start = opening_delimiter_match.pos + closer.length;                                  //
    closer_index = str.substr(inner.start).indexOf(closer);                                     //
    if (closer_index < 0) {                                                                     //
      return null;                                                                              // 53
    }                                                                                           //
    inner.end = inner.start + closer_index;                                                     //
    outer.end = inner.end + closer.length;                                                      //
    return {                                                                                    // 58
      outer: outer,                                                                             //
      inner: inner                                                                              //
    };                                                                                          //
  };                                                                                            //
                                                                                                //
  Katex.prototype.find_latex = function(str) {                                                  //
    var match, opening_delimiter_match, start;                                                  // 65
    start = 0;                                                                                  //
    while ((opening_delimiter_match = this.find_opening_delimiter(str, start++)) != null) {     // 66
      match = this.get_latex_boundaries(str, opening_delimiter_match);                          //
      if (match != null ? match.inner.extract(str).trim().length : void 0) {                    //
        match.options = opening_delimiter_match.options;                                        //
        return match;                                                                           // 72
      }                                                                                         //
    }                                                                                           //
    return null;                                                                                // 74
  };                                                                                            //
                                                                                                //
  Katex.prototype.extract_latex = function(str, match) {                                        //
    var after, before, latex;                                                                   // 79
    before = str.substr(0, match.outer.start);                                                  //
    after = str.substr(match.outer.end);                                                        //
    latex = match.inner.extract(str);                                                           //
    latex = s.unescapeHTML(latex);                                                              //
    return {                                                                                    // 85
      before: before,                                                                           //
      latex: latex,                                                                             //
      after: after                                                                              //
    };                                                                                          //
  };                                                                                            //
                                                                                                //
  Katex.prototype.render_latex = function(latex, displayMode) {                                 //
    var display_mode, e, rendered;                                                              // 90
    try {                                                                                       // 90
      rendered = katex.renderToString(latex, {                                                  //
        displayMode: displayMode                                                                //
      });                                                                                       //
    } catch (error) {                                                                           //
      e = error;                                                                                //
      display_mode = displayMode ? "block" : "inline";                                          //
      rendered = "<div class=\"katex-error katex-" + display_mode + "-error\">";                //
      rendered += "" + (s.escapeHTML(e.message));                                               //
      rendered += "</div>";                                                                     //
    }                                                                                           //
    return rendered;                                                                            // 98
  };                                                                                            //
                                                                                                //
  Katex.prototype.render = function(str, render_func) {                                         //
    var match, parts, rendered, result;                                                         // 102
    result = '';                                                                                //
    while (true) {                                                                              // 104
      match = this.find_latex(str);                                                             //
      if (match == null) {                                                                      //
        result += str;                                                                          //
        break;                                                                                  // 111
      }                                                                                         //
      parts = this.extract_latex(str, match);                                                   //
      rendered = render_func(parts.latex, match.options.displayMode);                           //
      result += parts.before + rendered;                                                        //
      str = parts.after;                                                                        //
    }                                                                                           //
    return result;                                                                              // 123
  };                                                                                            //
                                                                                                //
  Katex.prototype.render_message = function(message) {                                          //
    var msg, render_func;                                                                       // 128
    if (this.katex_enabled()) {                                                                 //
      msg = message;                                                                            //
      if (!_.isString(message)) {                                                               //
        if (_.trim(message.html)) {                                                             //
          msg = message.html;                                                                   //
        } else {                                                                                //
          return message;                                                                       // 135
        }                                                                                       //
      }                                                                                         //
      if (_.isString(message)) {                                                                //
        render_func = (function(_this) {                                                        //
          return function(latex, displayMode) {                                                 //
            return _this.render_latex(latex, displayMode);                                      // 139
          };                                                                                    //
        })(this);                                                                               //
      } else {                                                                                  //
        if (message.tokens == null) {                                                           //
          message.tokens = [];                                                                  //
        }                                                                                       //
        render_func = (function(_this) {                                                        //
          return function(latex, displayMode) {                                                 //
            var token;                                                                          // 144
            token = "=&=" + (Random.id()) + "=&=";                                              //
            message.tokens.push({                                                               //
              token: token,                                                                     //
              text: _this.render_latex(latex, displayMode)                                      //
            });                                                                                 //
            return token;                                                                       // 150
          };                                                                                    //
        })(this);                                                                               //
      }                                                                                         //
      msg = this.render(msg, render_func);                                                      //
      if (!_.isString(message)) {                                                               //
        message.html = msg;                                                                     //
      } else {                                                                                  //
        message = msg;                                                                          //
      }                                                                                         //
    }                                                                                           //
    return message;                                                                             // 159
  };                                                                                            //
                                                                                                //
  Katex.prototype.katex_enabled = function() {                                                  //
    return RocketChat.settings.get('Katex_Enabled');                                            // 162
  };                                                                                            //
                                                                                                //
  Katex.prototype.dollar_syntax_enabled = function() {                                          //
    return RocketChat.settings.get('Katex_Dollar_Syntax');                                      // 165
  };                                                                                            //
                                                                                                //
  Katex.prototype.parenthesis_syntax_enabled = function() {                                     //
    return RocketChat.settings.get('Katex_Parenthesis_Syntax');                                 // 168
  };                                                                                            //
                                                                                                //
  return Katex;                                                                                 //
                                                                                                //
})();                                                                                           //
                                                                                                //
RocketChat.katex = new Katex;                                                                   // 171
                                                                                                //
cb = RocketChat.katex.render_message.bind(RocketChat.katex);                                    // 173
                                                                                                //
RocketChat.callbacks.add('renderMessage', cb, RocketChat.callbacks.priority.HIGH - 1, 'katex');
                                                                                                //
if (Meteor.isClient) {                                                                          // 176
  Blaze.registerHelper('RocketChatKatex', function(text) {                                      //
    return RocketChat.katex.render_message(text);                                               // 178
  });                                                                                           //
}                                                                                               //
                                                                                                //
//////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:katex'] = {};

})();

//# sourceMappingURL=rocketchat_katex.js.map
