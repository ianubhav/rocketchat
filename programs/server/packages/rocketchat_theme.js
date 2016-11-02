(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var Logger = Package['rocketchat:logger'].Logger;
var _ = Package.underscore._;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var WebAppHashing = Package['webapp-hashing'].WebAppHashing;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/rocketchat_theme/server/server.coffee.js                                                      //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var autoprefixer, calculateClientHash, crypto, less, logger, setctionPerType;                             //
                                                                                                          //
less = Npm.require('less');                                                                               //
                                                                                                          //
autoprefixer = Npm.require('less-plugin-autoprefix');                                                     //
                                                                                                          //
crypto = Npm.require('crypto');                                                                           //
                                                                                                          //
logger = new Logger('rocketchat:theme', {                                                                 //
  methods: {                                                                                              //
    stop_rendering: {                                                                                     //
      type: 'info'                                                                                        //
    }                                                                                                     //
  }                                                                                                       //
});                                                                                                       //
                                                                                                          //
calculateClientHash = WebAppHashing.calculateClientHash;                                                  //
                                                                                                          //
WebAppHashing.calculateClientHash = function (manifest, includeFilter, runtimeConfigOverride) {           //
  var css, hash, themeManifestItem;                                                                       //
  css = RocketChat.theme.getCss();                                                                        //
  if (css.trim() !== '') {                                                                                //
    WebAppInternals.staticFiles['/__cordova/theme.css'] = WebAppInternals.staticFiles['/theme.css'] = {   //
      cacheable: true,                                                                                    //
      sourceMapUrl: void 0,                                                                               //
      type: 'css',                                                                                        //
      content: css                                                                                        //
    };                                                                                                    //
    hash = crypto.createHash('sha1').update(css).digest('hex');                                           //
    themeManifestItem = _.find(manifest, function (item) {                                                //
      return item.path === 'app/theme.css';                                                               //
    });                                                                                                   //
    if (themeManifestItem == null) {                                                                      //
      themeManifestItem = {};                                                                             //
      manifest.push(themeManifestItem);                                                                   //
    }                                                                                                     //
    themeManifestItem.path = 'app/theme.css';                                                             //
    themeManifestItem.type = 'css';                                                                       //
    themeManifestItem.cacheable = true;                                                                   //
    themeManifestItem.where = 'client';                                                                   //
    themeManifestItem.url = "/theme.css?" + hash;                                                         //
    themeManifestItem.size = css.length;                                                                  //
    themeManifestItem.hash = hash;                                                                        //
  }                                                                                                       //
  return calculateClientHash.call(this, manifest, includeFilter, runtimeConfigOverride);                  //
};                                                                                                        //
                                                                                                          //
setctionPerType = {                                                                                       //
  'color': 'Colors',                                                                                      //
  'font': 'Fonts'                                                                                         //
};                                                                                                        //
                                                                                                          //
RocketChat.theme = new (function () {                                                                     //
  _Class.prototype.variables = {};                                                                        //
                                                                                                          //
  _Class.prototype.packageCallbacks = [];                                                                 //
                                                                                                          //
  _Class.prototype.files = ['assets/stylesheets/global/_variables.less', 'assets/stylesheets/utils/_keyframes.import.less', 'assets/stylesheets/utils/_lesshat.import.less', 'assets/stylesheets/utils/_preloader.import.less', 'assets/stylesheets/utils/_reset.import.less', 'assets/stylesheets/utils/_chatops.less', 'assets/stylesheets/animation.css', 'assets/stylesheets/base.less', 'assets/stylesheets/fontello.css', 'assets/stylesheets/rtl.less', 'assets/stylesheets/swipebox.min.css', 'assets/stylesheets/utils/_colors.import.less'];
                                                                                                          //
  function _Class() {                                                                                     //
    this.customCSS = '';                                                                                  //
    RocketChat.settings.add('css', '');                                                                   //
    RocketChat.settings.addGroup('Layout');                                                               //
    RocketChat.settings.onload('css', Meteor.bindEnvironment(function (_this) {                           //
      return function (key, value, initialLoad) {                                                         //
        if (!initialLoad) {                                                                               //
          return Meteor.startup(function () {                                                             //
            return process.emit('message', {                                                              //
              refresh: 'client'                                                                           //
            });                                                                                           //
          });                                                                                             //
        }                                                                                                 //
      };                                                                                                  //
    }(this)));                                                                                            //
    this.compileDelayed = _.debounce(Meteor.bindEnvironment(this.compile.bind(this)), 100);               //
    Meteor.startup(function (_this) {                                                                     //
      return function () {                                                                                //
        return RocketChat.settings.onAfterInitialLoad(function () {                                       //
          return RocketChat.settings.get('*', Meteor.bindEnvironment(function (key, value, initialLoad) {
            var name;                                                                                     //
            if (key === 'theme-custom-css') {                                                             //
              if ((value != null ? value.trim() : void 0) !== '') {                                       //
                _this.customCSS = value;                                                                  //
              }                                                                                           //
            } else if (/^theme-.+/.test(key) === true) {                                                  //
              name = key.replace(/^theme-[a-z]+-/, '');                                                   //
              if (_this.variables[name] != null) {                                                        //
                _this.variables[name].value = value;                                                      //
              }                                                                                           //
            } else {                                                                                      //
              return;                                                                                     //
            }                                                                                             //
            return _this.compileDelayed();                                                                //
          }));                                                                                            //
        });                                                                                               //
      };                                                                                                  //
    }(this));                                                                                             //
  }                                                                                                       //
                                                                                                          //
  _Class.prototype.compile = function () {                                                                //
    var content, file, i, j, len, len1, options, packageCallback, ref, ref1, result, start;               //
    content = [this.getVariablesAsLess()];                                                                //
    ref = this.files;                                                                                     //
    for (i = 0, len = ref.length; i < len; i++) {                                                         //
      file = ref[i];                                                                                      //
      content.push(Assets.getText(file));                                                                 //
    }                                                                                                     //
    ref1 = this.packageCallbacks;                                                                         //
    for (j = 0, len1 = ref1.length; j < len1; j++) {                                                      //
      packageCallback = ref1[j];                                                                          //
      result = packageCallback();                                                                         //
      if (_.isString(result)) {                                                                           //
        content.push(result);                                                                             //
      }                                                                                                   //
    }                                                                                                     //
    content.push(this.customCSS);                                                                         //
    content = content.join('\n');                                                                         //
    options = {                                                                                           //
      compress: true,                                                                                     //
      plugins: [new autoprefixer()]                                                                       //
    };                                                                                                    //
    start = Date.now();                                                                                   //
    return less.render(content, options, function (err, data) {                                           //
      logger.stop_rendering(Date.now() - start);                                                          //
      if (err != null) {                                                                                  //
        return console.log(err);                                                                          //
      }                                                                                                   //
      RocketChat.settings.updateById('css', data.css);                                                    //
      return Meteor.startup(function () {                                                                 //
        return Meteor.setTimeout(function () {                                                            //
          return process.emit('message', {                                                                //
            refresh: 'client'                                                                             //
          });                                                                                             //
        }, 200);                                                                                          //
      });                                                                                                 //
    });                                                                                                   //
  };                                                                                                      //
                                                                                                          //
  _Class.prototype.addVariable = function (type, name, value, persist) {                                  //
    var config;                                                                                           //
    if (persist == null) {                                                                                //
      persist = true;                                                                                     //
    }                                                                                                     //
    this.variables[name] = {                                                                              //
      type: type,                                                                                         //
      value: value                                                                                        //
    };                                                                                                    //
    if (persist === true) {                                                                               //
      config = {                                                                                          //
        group: 'Layout',                                                                                  //
        type: type,                                                                                       //
        section: setctionPerType[type],                                                                   //
        "public": false                                                                                   //
      };                                                                                                  //
      return RocketChat.settings.add("theme-" + type + "-" + name, value, config);                        //
    }                                                                                                     //
  };                                                                                                      //
                                                                                                          //
  _Class.prototype.addPublicColor = function (name, value) {                                              //
    return this.addVariable('color', name, value, true);                                                  //
  };                                                                                                      //
                                                                                                          //
  _Class.prototype.addPublicFont = function (name, value) {                                               //
    return this.addVariable('font', name, value, true);                                                   //
  };                                                                                                      //
                                                                                                          //
  _Class.prototype.getVariablesAsObject = function () {                                                   //
    var name, obj, ref, variable;                                                                         //
    obj = {};                                                                                             //
    ref = this.variables;                                                                                 //
    for (name in meteorBabelHelpers.sanitizeForInObject(ref)) {                                           //
      variable = ref[name];                                                                               //
      obj[name] = variable.value;                                                                         //
    }                                                                                                     //
    return obj;                                                                                           //
  };                                                                                                      //
                                                                                                          //
  _Class.prototype.getVariablesAsLess = function () {                                                     //
    var items, name, ref, variable;                                                                       //
    items = [];                                                                                           //
    ref = this.variables;                                                                                 //
    for (name in meteorBabelHelpers.sanitizeForInObject(ref)) {                                           //
      variable = ref[name];                                                                               //
      items.push("@" + name + ": " + variable.value + ";");                                               //
    }                                                                                                     //
    return items.join('\n');                                                                              //
  };                                                                                                      //
                                                                                                          //
  _Class.prototype.addPackageAsset = function (cb) {                                                      //
    this.packageCallbacks.push(cb);                                                                       //
    return this.compileDelayed();                                                                         //
  };                                                                                                      //
                                                                                                          //
  _Class.prototype.getCss = function () {                                                                 //
    return RocketChat.settings.get('css') || '';                                                          //
  };                                                                                                      //
                                                                                                          //
  return _Class;                                                                                          //
}())();                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/rocketchat_theme/server/variables.coffee.js                                                   //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.theme.addPublicColor("primary-background-color", "#04436a");                                   // 1
                                                                                                          //
RocketChat.theme.addPublicColor("primary-font-color", "#444444");                                         // 2
                                                                                                          //
RocketChat.theme.addPublicColor("secondary-background-color", "#f4f4f4");                                 // 3
                                                                                                          //
RocketChat.theme.addPublicColor("secondary-font-color", "#7f7f7f");                                       // 4
                                                                                                          //
RocketChat.theme.addPublicColor("tertiary-background-color", "#eaeaea");                                  // 5
                                                                                                          //
RocketChat.theme.addPublicColor("tertiary-font-color", "rgba(255, 255, 255, 0.6)");                       // 6
                                                                                                          //
RocketChat.theme.addPublicColor("quaternary-font-color", "#ffffff");                                      // 7
                                                                                                          //
RocketChat.theme.addPublicColor("action-buttons-color", "#13679a");                                       // 9
                                                                                                          //
RocketChat.theme.addPublicColor("active-channel-background-color", "rgba(255, 255, 255, 0.075)");         // 10
                                                                                                          //
RocketChat.theme.addPublicColor("active-channel-font-color", "rgba(255, 255, 255, 0.75)");                // 11
                                                                                                          //
RocketChat.theme.addPublicColor("blockquote-background", "#cccccc");                                      // 12
                                                                                                          //
RocketChat.theme.addPublicColor("clean-buttons-color", "rgba(0, 0, 0, 0.25)");                            // 13
                                                                                                          //
RocketChat.theme.addPublicColor("code-background", "#f8f8f8");                                            // 14
                                                                                                          //
RocketChat.theme.addPublicColor("code-border", "#cccccc");                                                // 15
                                                                                                          //
RocketChat.theme.addPublicColor("code-color", "#333333");                                                 // 16
                                                                                                          //
RocketChat.theme.addPublicColor("content-background-color", "#ffffff");                                   // 17
                                                                                                          //
RocketChat.theme.addPublicColor("custom-scrollbar-color", "rgba(255, 255, 255, 0.05)");                   // 18
                                                                                                          //
RocketChat.theme.addPublicColor("info-active-font-color", "#ff0000");                                     // 19
                                                                                                          //
RocketChat.theme.addPublicColor("info-font-color", "#aaaaaa");                                            // 20
                                                                                                          //
RocketChat.theme.addPublicColor("input-font-color", "rgba(255, 255, 255, 0.85)");                         // 21
                                                                                                          //
RocketChat.theme.addPublicColor("link-font-color", "#008ce3");                                            // 22
                                                                                                          //
RocketChat.theme.addPublicColor("message-hover-background-color", "rgba(0, 0, 0, 0.025)");                // 23
                                                                                                          //
RocketChat.theme.addPublicColor("smallprint-font-color", "#c2e7ff");                                      // 24
                                                                                                          //
RocketChat.theme.addPublicColor("smallprint-hover-color", "#ffffff");                                     // 25
                                                                                                          //
RocketChat.theme.addPublicColor("status-away", "#fcb316");                                                // 26
                                                                                                          //
RocketChat.theme.addPublicColor("status-busy", "#d30230");                                                // 27
                                                                                                          //
RocketChat.theme.addPublicColor("status-offline", "rgba(150, 150, 150, 0.50)");                           // 28
                                                                                                          //
RocketChat.theme.addPublicColor("status-online", "#35ac19");                                              // 29
                                                                                                          //
RocketChat.theme.addPublicColor("unread-notification-color", "#1dce73");                                  // 30
                                                                                                          //
RocketChat.theme.addPublicFont("body-font-family", '-apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI", "Segoe UI Emoji", "Segoe UI Symbol", "Meiryo UI"');
                                                                                                          //
RocketChat.settings.add("theme-custom-css", '', {                                                         // 35
  group: 'Layout',                                                                                        //
  type: 'code',                                                                                           //
  code: 'text/x-less',                                                                                    //
  multiline: true,                                                                                        //
  section: 'Custom CSS',                                                                                  //
  "public": false                                                                                         //
});                                                                                                       //
                                                                                                          //
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:theme'] = {};

})();

//# sourceMappingURL=rocketchat_theme.js.map
