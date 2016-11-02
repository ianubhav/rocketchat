(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var CustomOAuth = Package['rocketchat:custom-oauth'].CustomOAuth;
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

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
// packages/rocketchat_gitlab/common.coffee.js                               //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////
                                                                             //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Gitlab, config;                                                          // 1
                                                                             //
config = {                                                                   // 1
  serverURL: 'https://gitlab.com',                                           //
  identityPath: '/api/v3/user',                                              //
  scope: 'api',                                                              //
  addAutopublishFields: {                                                    //
    forLoggedInUser: ['services.gitlab'],                                    //
    forOtherUsers: ['services.gitlab.username']                              //
  }                                                                          //
};                                                                           //
                                                                             //
Gitlab = new CustomOAuth('gitlab', config);                                  // 9
                                                                             //
if (Meteor.isServer) {                                                       // 11
  Meteor.startup(function() {                                                //
    return RocketChat.settings.get('API_Gitlab_URL', function(key, value) {  //
      config.serverURL = value;                                              //
      return Gitlab.configure(config);                                       //
    });                                                                      //
  });                                                                        //
} else {                                                                     //
  Meteor.startup(function() {                                                //
    return Tracker.autorun(function() {                                      //
      if (RocketChat.settings.get('API_Gitlab_URL')) {                       //
        config.serverURL = RocketChat.settings.get('API_Gitlab_URL');        //
        return Gitlab.configure(config);                                     //
      }                                                                      //
    });                                                                      //
  });                                                                        //
}                                                                            //
                                                                             //
///////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
// packages/rocketchat_gitlab/startup.coffee.js                              //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////
                                                                             //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.settings.addGroup('OAuth', function() {                           // 1
  return this.section('GitLab', function() {                                 //
    var enableQuery;                                                         // 3
    enableQuery = {                                                          //
      _id: 'Accounts_OAuth_Gitlab',                                          //
      value: true                                                            //
    };                                                                       //
    this.add('Accounts_OAuth_Gitlab', false, {                               //
      type: 'boolean',                                                       //
      "public": true                                                         //
    });                                                                      //
    this.add('API_Gitlab_URL', '', {                                         //
      type: 'string',                                                        //
      enableQuery: enableQuery,                                              //
      "public": true                                                         //
    });                                                                      //
    this.add('Accounts_OAuth_Gitlab_id', '', {                               //
      type: 'string',                                                        //
      enableQuery: enableQuery                                               //
    });                                                                      //
    this.add('Accounts_OAuth_Gitlab_secret', '', {                           //
      type: 'string',                                                        //
      enableQuery: enableQuery                                               //
    });                                                                      //
    return this.add('Accounts_OAuth_Gitlab_callback_url', '_oauth/gitlab', {
      type: 'relativeUrl',                                                   //
      readonly: true,                                                        //
      force: true,                                                           //
      enableQuery: enableQuery                                               //
    });                                                                      //
  });                                                                        //
});                                                                          // 1
                                                                             //
///////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:gitlab'] = {};

})();

//# sourceMappingURL=rocketchat_gitlab.js.map
