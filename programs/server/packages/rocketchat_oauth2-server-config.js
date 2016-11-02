(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var OAuth2Server = Package['rocketchat:oauth2-server'].OAuth2Server;
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/rocketchat_oauth2-server-config/server/models/OAuthApps.coffee.js                           //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;                                                                          //
                                                                                                        //
RocketChat.models.OAuthApps = new ((function(superClass) {                                              // 1
  extend(_Class, superClass);                                                                           //
                                                                                                        //
  function _Class() {                                                                                   //
    _Class.__super__.constructor.call(this, 'oauth_apps');                                              //
  }                                                                                                     //
                                                                                                        //
  return _Class;                                                                                        //
                                                                                                        //
})(RocketChat.models._Base));                                                                           //
                                                                                                        //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/rocketchat_oauth2-server-config/oauth/server/oauth2-server.coffee.js                        //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var oauth2server;                                                                                       // 1
                                                                                                        //
oauth2server = new OAuth2Server({                                                                       // 1
  accessTokensCollectionName: 'rocketchat_oauth_access_tokens',                                         //
  refreshTokensCollectionName: 'rocketchat_oauth_refresh_tokens',                                       //
  authCodesCollectionName: 'rocketchat_oauth_auth_codes',                                               //
  clientsCollection: RocketChat.models.OAuthApps.model,                                                 //
  debug: true                                                                                           //
});                                                                                                     //
                                                                                                        //
WebApp.connectHandlers.use(oauth2server.app);                                                           // 9
                                                                                                        //
Meteor.publish('oauthClient', function(clientId) {                                                      // 12
  if (!this.userId) {                                                                                   //
    return this.ready();                                                                                // 14
  }                                                                                                     //
  return RocketChat.models.OAuthApps.find({                                                             // 16
    clientId: clientId,                                                                                 //
    active: true                                                                                        //
  }, {                                                                                                  //
    fields: {                                                                                           //
      name: 1                                                                                           //
    }                                                                                                   //
  });                                                                                                   //
});                                                                                                     // 12
                                                                                                        //
RocketChat.API.v1.addAuthMethod(function() {                                                            // 21
  var accessToken, bearerToken, getAccessToken, getToken, headerToken, matches, user;                   // 22
  console.log(this.request.method, this.request.url);                                                   //
  headerToken = this.request.headers['authorization'];                                                  //
  getToken = this.request.query.access_token;                                                           //
  if (headerToken != null) {                                                                            //
    if (matches = headerToken.match(/Bearer\s(\S+)/)) {                                                 //
      headerToken = matches[1];                                                                         //
    } else {                                                                                            //
      headerToken = void 0;                                                                             //
    }                                                                                                   //
  }                                                                                                     //
  bearerToken = headerToken || getToken;                                                                //
  if (bearerToken == null) {                                                                            //
    return;                                                                                             // 37
  }                                                                                                     //
  getAccessToken = Meteor.wrapAsync(oauth2server.oauth.model.getAccessToken, oauth2server.oauth.model);
  accessToken = getAccessToken(bearerToken);                                                            //
  if (accessToken == null) {                                                                            //
    return;                                                                                             // 46
  }                                                                                                     //
  if ((accessToken.expires != null) && accessToken.expires !== 0 && accessToken.expires < new Date()) {
    return;                                                                                             // 50
  }                                                                                                     //
  user = RocketChat.models.Users.findOne(accessToken.userId);                                           //
  if (user == null) {                                                                                   //
    return;                                                                                             // 55
  }                                                                                                     //
  return {                                                                                              // 57
    user: user                                                                                          //
  };                                                                                                    //
});                                                                                                     // 21
                                                                                                        //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/rocketchat_oauth2-server-config/oauth/server/default-services.coffee.js                     //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
if (!RocketChat.models.OAuthApps.findOne('zapier')) {                                                   // 1
  RocketChat.models.OAuthApps.insert({                                                                  //
    _id: 'zapier',                                                                                      //
    name: 'Zapier',                                                                                     //
    active: false,                                                                                      //
    clientId: 'zapier',                                                                                 //
    clientSecret: 'RTK6TlndaCIolhQhZ7_KHIGOKj41RnlaOq_o-7JKwLr',                                        //
    redirectUri: 'https://zapier.com/dashboard/auth/oauth/return/AppIDAPI/',                            //
    _createdAt: new Date,                                                                               //
    _createdBy: {                                                                                       //
      _id: 'system',                                                                                    //
      username: 'system'                                                                                //
    }                                                                                                   //
  });                                                                                                   //
}                                                                                                       //
                                                                                                        //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/rocketchat_oauth2-server-config/oauth/client/stylesheets/load.coffee.js                     //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.theme.addPackageAsset(function() {                                                           // 1
  return Assets.getText('oauth/client/stylesheets/oauth2.less');                                        // 2
});                                                                                                     // 1
                                                                                                        //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/rocketchat_oauth2-server-config/admin/server/publications/oauthApps.coffee.js               //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('oauthApps', function() {                                                                // 1
  if (!this.userId) {                                                                                   //
    return this.ready();                                                                                // 3
  }                                                                                                     //
  if (!RocketChat.authz.hasPermission(this.userId, 'manage-oauth-apps')) {                              //
    this.error(Meteor.Error("error-not-allowed", "Not allowed", {                                       //
      publish: 'oauthApps'                                                                              //
    }));                                                                                                //
  }                                                                                                     //
  return RocketChat.models.OAuthApps.find();                                                            // 8
});                                                                                                     // 1
                                                                                                        //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/rocketchat_oauth2-server-config/admin/server/methods/addOAuthApp.coffee.js                  //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                        // 1
  addOAuthApp: function(application) {                                                                  //
    if (!RocketChat.authz.hasPermission(this.userId, 'manage-oauth-apps')) {                            //
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                      // 4
        method: 'addOAuthApp'                                                                           //
      });                                                                                               //
    }                                                                                                   //
    if (!_.isString(application.name) || application.name.trim() === '') {                              //
      throw new Meteor.Error('error-invalid-name', 'Invalid name', {                                    // 7
        method: 'addOAuthApp'                                                                           //
      });                                                                                               //
    }                                                                                                   //
    if (!_.isString(application.redirectUri) || application.redirectUri.trim() === '') {                //
      throw new Meteor.Error('error-invalid-redirectUri', 'Invalid redirectUri', {                      // 10
        method: 'addOAuthApp'                                                                           //
      });                                                                                               //
    }                                                                                                   //
    if (!_.isBoolean(application.active)) {                                                             //
      throw new Meteor.Error('error-invalid-arguments', 'Invalid arguments', {                          // 13
        method: 'addOAuthApp'                                                                           //
      });                                                                                               //
    }                                                                                                   //
    application.clientId = Random.id();                                                                 //
    application.clientSecret = Random.secret();                                                         //
    application._createdAt = new Date;                                                                  //
    application._createdBy = RocketChat.models.Users.findOne(this.userId, {                             //
      fields: {                                                                                         //
        username: 1                                                                                     //
      }                                                                                                 //
    });                                                                                                 //
    application._id = RocketChat.models.OAuthApps.insert(application);                                  //
    return application;                                                                                 // 22
  }                                                                                                     //
});                                                                                                     //
                                                                                                        //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/rocketchat_oauth2-server-config/admin/server/methods/updateOAuthApp.coffee.js               //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                        // 1
  updateOAuthApp: function(applicationId, application) {                                                //
    var currentApplication;                                                                             // 3
    if (!RocketChat.authz.hasPermission(this.userId, 'manage-oauth-apps')) {                            //
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                      // 4
        method: 'updateOAuthApp'                                                                        //
      });                                                                                               //
    }                                                                                                   //
    if (!_.isString(application.name) || application.name.trim() === '') {                              //
      throw new Meteor.Error('error-invalid-name', 'Invalid name', {                                    // 7
        method: 'updateOAuthApp'                                                                        //
      });                                                                                               //
    }                                                                                                   //
    if (!_.isString(application.redirectUri) || application.redirectUri.trim() === '') {                //
      throw new Meteor.Error('error-invalid-redirectUri', 'Invalid redirectUri', {                      // 10
        method: 'updateOAuthApp'                                                                        //
      });                                                                                               //
    }                                                                                                   //
    if (!_.isBoolean(application.active)) {                                                             //
      throw new Meteor.Error('error-invalid-arguments', 'Invalid arguments', {                          // 13
        method: 'updateOAuthApp'                                                                        //
      });                                                                                               //
    }                                                                                                   //
    currentApplication = RocketChat.models.OAuthApps.findOne(applicationId);                            //
    if (currentApplication == null) {                                                                   //
      throw new Meteor.Error('error-application-not-found', 'Application not found', {                  // 17
        method: 'updateOAuthApp'                                                                        //
      });                                                                                               //
    }                                                                                                   //
    RocketChat.models.OAuthApps.update(applicationId, {                                                 //
      $set: {                                                                                           //
        name: application.name,                                                                         //
        active: application.active,                                                                     //
        redirectUri: application.redirectUri,                                                           //
        _updatedAt: new Date,                                                                           //
        _updatedBy: RocketChat.models.Users.findOne(this.userId, {                                      //
          fields: {                                                                                     //
            username: 1                                                                                 //
          }                                                                                             //
        })                                                                                              //
      }                                                                                                 //
    });                                                                                                 //
    return RocketChat.models.OAuthApps.findOne(applicationId);                                          // 27
  }                                                                                                     //
});                                                                                                     //
                                                                                                        //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/rocketchat_oauth2-server-config/admin/server/methods/deleteOAuthApp.coffee.js               //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                        // 1
  deleteOAuthApp: function(applicationId) {                                                             //
    var application;                                                                                    // 3
    if (!RocketChat.authz.hasPermission(this.userId, 'manage-oauth-apps')) {                            //
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                      // 4
        method: 'deleteOAuthApp'                                                                        //
      });                                                                                               //
    }                                                                                                   //
    application = RocketChat.models.OAuthApps.findOne(applicationId);                                   //
    if (application == null) {                                                                          //
      throw new Meteor.Error('error-application-not-found', 'Application not found', {                  // 9
        method: 'deleteOAuthApp'                                                                        //
      });                                                                                               //
    }                                                                                                   //
    RocketChat.models.OAuthApps.remove({                                                                //
      _id: applicationId                                                                                //
    });                                                                                                 //
    return true;                                                                                        // 14
  }                                                                                                     //
});                                                                                                     //
                                                                                                        //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:oauth2-server-config'] = {};

})();

//# sourceMappingURL=rocketchat_oauth2-server-config.js.map
