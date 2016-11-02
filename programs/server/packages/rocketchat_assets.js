(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var RocketChatFile = Package['rocketchat:file'].RocketChatFile;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var WebAppHashing = Package['webapp-hashing'].WebAppHashing;
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_assets/server/assets.coffee.js                                                             //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var assets, calculateClientHash, crypto, fn, key, mime, sizeOf, value,                                            // 1
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
                                                                                                                  //
sizeOf = Npm.require('image-size');                                                                               // 1
                                                                                                                  //
mime = Npm.require('mime-types');                                                                                 // 2
                                                                                                                  //
crypto = Npm.require('crypto');                                                                                   // 3
                                                                                                                  //
mime.extensions['image/vnd.microsoft.icon'] = ['ico'];                                                            // 5
                                                                                                                  //
this.RocketChatAssetsInstance = new RocketChatFile.GridFS({                                                       // 7
  name: 'assets'                                                                                                  //
});                                                                                                               //
                                                                                                                  //
assets = {                                                                                                        // 11
  'logo': {                                                                                                       //
    label: 'logo (svg, png, jpg)',                                                                                //
    defaultUrl: 'images/logo/logo.svg',                                                                           //
    constraints: {                                                                                                //
      type: 'image',                                                                                              //
      extensions: ['svg', 'png', 'jpg', 'jpeg'],                                                                  //
      width: void 0,                                                                                              //
      height: void 0                                                                                              //
    }                                                                                                             //
  },                                                                                                              //
  'favicon_ico': {                                                                                                //
    label: 'favicon.ico',                                                                                         //
    defaultUrl: 'favicon.ico',                                                                                    //
    constraints: {                                                                                                //
      type: 'image',                                                                                              //
      extensions: ['ico'],                                                                                        //
      width: void 0,                                                                                              //
      height: void 0                                                                                              //
    }                                                                                                             //
  },                                                                                                              //
  'favicon': {                                                                                                    //
    label: 'favicon.svg',                                                                                         //
    defaultUrl: 'images/logo/icon.svg',                                                                           //
    constraints: {                                                                                                //
      type: 'image',                                                                                              //
      extensions: ['svg'],                                                                                        //
      width: void 0,                                                                                              //
      height: void 0                                                                                              //
    }                                                                                                             //
  },                                                                                                              //
  'favicon_64': {                                                                                                 //
    label: 'favicon.png (64x64)',                                                                                 //
    defaultUrl: 'images/logo/favicon-64x64.png',                                                                  //
    constraints: {                                                                                                //
      type: 'image',                                                                                              //
      extensions: ['png'],                                                                                        //
      width: 64,                                                                                                  //
      height: 64                                                                                                  //
    }                                                                                                             //
  },                                                                                                              //
  'favicon_96': {                                                                                                 //
    label: 'favicon.png (96x96)',                                                                                 //
    defaultUrl: 'images/logo/favicon-96x96.png',                                                                  //
    constraints: {                                                                                                //
      type: 'image',                                                                                              //
      extensions: ['png'],                                                                                        //
      width: 96,                                                                                                  //
      height: 96                                                                                                  //
    }                                                                                                             //
  },                                                                                                              //
  'favicon_128': {                                                                                                //
    label: 'favicon.png (128x128)',                                                                               //
    defaultUrl: 'images/logo/favicon-128x128.png',                                                                //
    constraints: {                                                                                                //
      type: 'image',                                                                                              //
      extensions: ['png'],                                                                                        //
      width: 128,                                                                                                 //
      height: 128                                                                                                 //
    }                                                                                                             //
  },                                                                                                              //
  'favicon_192': {                                                                                                //
    label: 'favicon.png (192x192)',                                                                               //
    defaultUrl: 'images/logo/android-chrome-192x192.png',                                                         //
    constraints: {                                                                                                //
      type: 'image',                                                                                              //
      extensions: ['png'],                                                                                        //
      width: 192,                                                                                                 //
      height: 192                                                                                                 //
    }                                                                                                             //
  },                                                                                                              //
  'favicon_256': {                                                                                                //
    label: 'favicon.png (256x256)',                                                                               //
    defaultUrl: 'images/logo/favicon-256x256.png',                                                                //
    constraints: {                                                                                                //
      type: 'image',                                                                                              //
      extensions: ['png'],                                                                                        //
      width: 256,                                                                                                 //
      height: 256                                                                                                 //
    }                                                                                                             //
  }                                                                                                               //
};                                                                                                                //
                                                                                                                  //
RocketChat.Assets = new ((function() {                                                                            // 78
  function _Class() {}                                                                                            //
                                                                                                                  //
  _Class.prototype.mime = mime;                                                                                   //
                                                                                                                  //
  _Class.prototype.assets = assets;                                                                               //
                                                                                                                  //
  _Class.prototype.setAsset = function(binaryContent, contentType, asset) {                                       //
    var dimensions, extension, file, rs, ws;                                                                      // 83
    if (assets[asset] == null) {                                                                                  //
      throw new Meteor.Error("error-invalid-asset", 'Invalid asset', {                                            // 84
        "function": 'RocketChat.Assets.setAsset'                                                                  //
      });                                                                                                         //
    }                                                                                                             //
    extension = mime.extension(contentType);                                                                      //
    if (indexOf.call(assets[asset].constraints.extensions, extension) < 0) {                                      //
      throw new Meteor.Error(contentType, 'Invalid file type: ' + contentType, {                                  // 88
        "function": 'RocketChat.Assets.setAsset',                                                                 //
        errorTitle: 'error-invalid-file-type'                                                                     //
      });                                                                                                         //
    }                                                                                                             //
    file = new Buffer(binaryContent, 'binary');                                                                   //
    if ((assets[asset].constraints.width != null) || (assets[asset].constraints.height != null)) {                //
      dimensions = sizeOf(file);                                                                                  //
      if ((assets[asset].constraints.width != null) && assets[asset].constraints.width !== dimensions.width) {    //
        throw new Meteor.Error("error-invalid-file-width", "Invalid file width", {                                // 95
          "function": 'Invalid file width'                                                                        //
        });                                                                                                       //
      }                                                                                                           //
      if ((assets[asset].constraints.height != null) && assets[asset].constraints.height !== dimensions.height) {
        throw new Meteor.Error("error-invalid-file-height");                                                      // 98
      }                                                                                                           //
    }                                                                                                             //
    rs = RocketChatFile.bufferToStream(file);                                                                     //
    RocketChatAssetsInstance.deleteFile(asset);                                                                   //
    ws = RocketChatAssetsInstance.createWriteStream(asset, contentType);                                          //
    ws.on('end', Meteor.bindEnvironment(function() {                                                              //
      return Meteor.setTimeout(function() {                                                                       //
        var key, value;                                                                                           // 105
        key = "Assets_" + asset;                                                                                  //
        value = {                                                                                                 //
          url: "assets/" + asset + "." + extension,                                                               //
          defaultUrl: assets[asset].defaultUrl                                                                    //
        };                                                                                                        //
        RocketChat.settings.updateById(key, value);                                                               //
        return RocketChat.Assets.processAsset(key, value);                                                        //
      }, 200);                                                                                                    //
    }));                                                                                                          //
    rs.pipe(ws);                                                                                                  //
  };                                                                                                              //
                                                                                                                  //
  _Class.prototype.unsetAsset = function(asset) {                                                                 //
    var key, value;                                                                                               // 118
    if (assets[asset] == null) {                                                                                  //
      throw new Meteor.Error("error-invalid-asset", 'Invalid asset', {                                            // 119
        "function": 'RocketChat.Assets.unsetAsset'                                                                //
      });                                                                                                         //
    }                                                                                                             //
    RocketChatAssetsInstance.deleteFile(asset);                                                                   //
    key = "Assets_" + asset;                                                                                      //
    value = {                                                                                                     //
      defaultUrl: assets[asset].defaultUrl                                                                        //
    };                                                                                                            //
    RocketChat.settings.updateById(key, value);                                                                   //
    RocketChat.Assets.processAsset(key, value);                                                                   //
  };                                                                                                              //
                                                                                                                  //
  _Class.prototype.refreshClients = function() {                                                                  //
    return process.emit('message', {                                                                              //
      refresh: 'client'                                                                                           //
    });                                                                                                           //
  };                                                                                                              //
                                                                                                                  //
  _Class.prototype.processAsset = function(settingKey, settingValue) {                                            //
    var assetKey, assetValue, extension, file, hash;                                                              // 135
    if (settingKey.indexOf('Assets_') !== 0) {                                                                    //
      return;                                                                                                     // 136
    }                                                                                                             //
    assetKey = settingKey.replace(/^Assets_/, '');                                                                //
    assetValue = assets[assetKey];                                                                                //
    if (assetValue == null) {                                                                                     //
      return;                                                                                                     // 142
    }                                                                                                             //
    if ((settingValue != null ? settingValue.url : void 0) == null) {                                             //
      assetValue.cache = void 0;                                                                                  //
      return;                                                                                                     // 146
    }                                                                                                             //
    file = RocketChatAssetsInstance.getFileSync(assetKey);                                                        //
    if (!file) {                                                                                                  //
      assetValue.cache = void 0;                                                                                  //
      return;                                                                                                     // 151
    }                                                                                                             //
    hash = crypto.createHash('sha1').update(file.buffer).digest('hex');                                           //
    extension = settingValue.url.split('.').pop();                                                                //
    return assetValue.cache = {                                                                                   //
      path: "assets/" + assetKey + "." + extension,                                                               //
      cacheable: false,                                                                                           //
      sourceMapUrl: void 0,                                                                                       //
      where: 'client',                                                                                            //
      type: 'asset',                                                                                              //
      content: file.buffer,                                                                                       //
      extension: extension,                                                                                       //
      url: "/assets/" + assetKey + "." + extension + "?" + hash,                                                  //
      size: file.length,                                                                                          //
      uploadDate: file.uploadDate,                                                                                //
      contentType: file.contentType,                                                                              //
      hash: hash                                                                                                  //
    };                                                                                                            //
  };                                                                                                              //
                                                                                                                  //
  return _Class;                                                                                                  //
                                                                                                                  //
})());                                                                                                            //
                                                                                                                  //
RocketChat.settings.addGroup('Assets');                                                                           // 170
                                                                                                                  //
fn = function(key, value) {                                                                                       //
  return RocketChat.settings.add("Assets_" + key, {                                                               //
    defaultUrl: value.defaultUrl                                                                                  //
  }, {                                                                                                            //
    type: 'asset',                                                                                                //
    group: 'Assets',                                                                                              //
    fileConstraints: value.constraints,                                                                           //
    i18nLabel: value.label,                                                                                       //
    asset: key,                                                                                                   //
    "public": true                                                                                                //
  });                                                                                                             //
};                                                                                                                // 172
for (key in assets) {                                                                                             // 171
  value = assets[key];                                                                                            //
  fn(key, value);                                                                                                 //
}                                                                                                                 // 171
                                                                                                                  //
RocketChat.models.Settings.find().observe({                                                                       // 176
  added: function(record) {                                                                                       //
    return RocketChat.Assets.processAsset(record._id, record.value);                                              //
  },                                                                                                              //
  changed: function(record) {                                                                                     //
    return RocketChat.Assets.processAsset(record._id, record.value);                                              //
  },                                                                                                              //
  removed: function(record) {                                                                                     //
    return RocketChat.Assets.processAsset(record._id, void 0);                                                    //
  }                                                                                                               //
});                                                                                                               //
                                                                                                                  //
Meteor.startup(function() {                                                                                       // 184
  return Meteor.setTimeout(function() {                                                                           //
    return process.emit('message', {                                                                              //
      refresh: 'client'                                                                                           //
    });                                                                                                           //
  }, 200);                                                                                                        //
});                                                                                                               // 184
                                                                                                                  //
calculateClientHash = WebAppHashing.calculateClientHash;                                                          // 189
                                                                                                                  //
WebAppHashing.calculateClientHash = function(manifest, includeFilter, runtimeConfigOverride) {                    // 190
  var cache, extension, index, manifestItem;                                                                      // 191
  for (key in assets) {                                                                                           // 191
    value = assets[key];                                                                                          //
    if ((value.cache == null) && (value.defaultUrl == null)) {                                                    //
      continue;                                                                                                   // 193
    }                                                                                                             //
    cache = {};                                                                                                   //
    if (value.cache) {                                                                                            //
      cache = {                                                                                                   //
        path: value.cache.path,                                                                                   //
        cacheable: value.cache.cacheable,                                                                         //
        sourceMapUrl: value.cache.sourceMapUrl,                                                                   //
        where: value.cache.where,                                                                                 //
        type: value.cache.type,                                                                                   //
        url: value.cache.url,                                                                                     //
        size: value.cache.size,                                                                                   //
        hash: value.cache.hash                                                                                    //
      };                                                                                                          //
      WebAppInternals.staticFiles["/__cordova/assets/" + key] = value.cache;                                      //
      WebAppInternals.staticFiles["/__cordova/assets/" + key + "." + value.cache.extension] = value.cache;        //
    } else {                                                                                                      //
      extension = value.defaultUrl.split('.').pop();                                                              //
      cache = {                                                                                                   //
        path: "assets/" + key + "." + extension,                                                                  //
        cacheable: false,                                                                                         //
        sourceMapUrl: void 0,                                                                                     //
        where: 'client',                                                                                          //
        type: 'asset',                                                                                            //
        url: "/assets/" + key + "." + extension + "?v3",                                                          //
        hash: 'v3'                                                                                                //
      };                                                                                                          //
      WebAppInternals.staticFiles["/__cordova/assets/" + key] = WebAppInternals.staticFiles["/__cordova/" + value.defaultUrl];
      WebAppInternals.staticFiles["/__cordova/assets/" + key + "." + extension] = WebAppInternals.staticFiles["/__cordova/" + value.defaultUrl];
    }                                                                                                             //
    manifestItem = _.findWhere(manifest, {                                                                        //
      path: key                                                                                                   //
    });                                                                                                           //
    if (manifestItem != null) {                                                                                   //
      index = manifest.indexOf(manifestItem);                                                                     //
      manifest[index] = cache;                                                                                    //
    } else {                                                                                                      //
      manifest.push(cache);                                                                                       //
    }                                                                                                             //
  }                                                                                                               // 191
  return calculateClientHash.call(this, manifest, includeFilter, runtimeConfigOverride);                          // 233
};                                                                                                                // 190
                                                                                                                  //
Meteor.methods({                                                                                                  // 236
  refreshClients: function() {                                                                                    //
    var hasPermission;                                                                                            // 238
    if (!Meteor.userId()) {                                                                                       //
      throw new Meteor.Error('error-invalid-user', "Invalid user", {                                              // 239
        method: 'refreshClients'                                                                                  //
      });                                                                                                         //
    }                                                                                                             //
    hasPermission = RocketChat.authz.hasPermission(Meteor.userId(), 'manage-assets');                             //
    if (!hasPermission) {                                                                                         //
      throw new Meteor.Error('error-action-now-allowed', 'Managing assets not allowed', {                         // 243
        method: 'refreshClients',                                                                                 //
        action: 'Managing_assets'                                                                                 //
      });                                                                                                         //
    }                                                                                                             //
    return RocketChat.Assets.refreshClients();                                                                    //
  },                                                                                                              //
  unsetAsset: function(asset) {                                                                                   //
    var hasPermission;                                                                                            // 249
    if (!Meteor.userId()) {                                                                                       //
      throw new Meteor.Error('error-invalid-user', "Invalid user", {                                              // 250
        method: 'unsetAsset'                                                                                      //
      });                                                                                                         //
    }                                                                                                             //
    hasPermission = RocketChat.authz.hasPermission(Meteor.userId(), 'manage-assets');                             //
    if (!hasPermission) {                                                                                         //
      throw new Meteor.Error('error-action-now-allowed', 'Managing assets not allowed', {                         // 254
        method: 'unsetAsset',                                                                                     //
        action: 'Managing_assets'                                                                                 //
      });                                                                                                         //
    }                                                                                                             //
    return RocketChat.Assets.unsetAsset(asset);                                                                   //
  },                                                                                                              //
  setAsset: function(binaryContent, contentType, asset) {                                                         //
    var hasPermission;                                                                                            // 260
    if (!Meteor.userId()) {                                                                                       //
      throw new Meteor.Error('error-invalid-user', "Invalid user", {                                              // 261
        method: 'setAsset'                                                                                        //
      });                                                                                                         //
    }                                                                                                             //
    hasPermission = RocketChat.authz.hasPermission(Meteor.userId(), 'manage-assets');                             //
    if (!hasPermission) {                                                                                         //
      throw new Meteor.Error('error-action-now-allowed', 'Managing assets not allowed', {                         // 265
        method: 'setAsset',                                                                                       //
        action: 'Managing_assets'                                                                                 //
      });                                                                                                         //
    }                                                                                                             //
    RocketChat.Assets.setAsset(binaryContent, contentType, asset);                                                //
  }                                                                                                               //
});                                                                                                               //
                                                                                                                  //
WebApp.connectHandlers.use('/assets/', Meteor.bindEnvironment(function(req, res, next) {                          // 271
  var file, params, ref, ref1, ref2, ref3, reqModifiedHeader;                                                     // 272
  params = {                                                                                                      //
    asset: decodeURIComponent(req.url.replace(/^\//, '').replace(/\?.*$/, '')).replace(/\.[^.]*$/, '')            //
  };                                                                                                              //
  file = (ref = assets[params.asset]) != null ? ref.cache : void 0;                                               //
  if (file == null) {                                                                                             //
    if (((ref1 = assets[params.asset]) != null ? ref1.defaultUrl : void 0) != null) {                             //
      req.url = '/' + assets[params.asset].defaultUrl;                                                            //
      WebAppInternals.staticFilesMiddleware(WebAppInternals.staticFiles, req, res, next);                         //
    } else {                                                                                                      //
      res.writeHead(404);                                                                                         //
      res.end();                                                                                                  //
    }                                                                                                             //
    return;                                                                                                       // 285
  }                                                                                                               //
  reqModifiedHeader = req.headers["if-modified-since"];                                                           //
  if (reqModifiedHeader != null) {                                                                                //
    if (reqModifiedHeader === ((ref2 = file.uploadDate) != null ? ref2.toUTCString() : void 0)) {                 //
      res.setHeader('Last-Modified', reqModifiedHeader);                                                          //
      res.writeHead(304);                                                                                         //
      res.end();                                                                                                  //
      return;                                                                                                     // 293
    }                                                                                                             //
  }                                                                                                               //
  res.setHeader('Cache-Control', 'public, max-age=0');                                                            //
  res.setHeader('Expires', '-1');                                                                                 //
  res.setHeader('Last-Modified', ((ref3 = file.uploadDate) != null ? ref3.toUTCString() : void 0) || new Date().toUTCString());
  res.setHeader('Content-Type', file.contentType);                                                                //
  res.setHeader('Content-Length', file.size);                                                                     //
  res.writeHead(200);                                                                                             //
  res.end(file.content);                                                                                          //
}));                                                                                                              // 271
                                                                                                                  //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:assets'] = {};

})();

//# sourceMappingURL=rocketchat_assets.js.map
