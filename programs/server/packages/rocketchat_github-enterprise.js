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

/////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                 //
// packages/rocketchat_github-enterprise/common.coffee.js                                          //
//                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var GitHubEnterprise, config;                                                                      // 3
                                                                                                   //
config = {                                                                                         // 3
  serverURL: '',                                                                                   //
  identityPath: '/api/v3/user',                                                                    //
  authorizePath: '/login/oauth/authorize',                                                         //
  tokenPath: '/login/oauth/access_token',                                                          //
  addAutopublishFields: {                                                                          //
    forLoggedInUser: ['services.github-enterprise'],                                               //
    forOtherUsers: ['services.github-enterprise.username']                                         //
  }                                                                                                //
};                                                                                                 //
                                                                                                   //
GitHubEnterprise = new CustomOAuth('github_enterprise', config);                                   // 12
                                                                                                   //
if (Meteor.isServer) {                                                                             // 14
  Meteor.startup(function() {                                                                      //
    return RocketChat.settings.get('API_GitHub_Enterprise_URL', function(key, value) {             //
      config.serverURL = value;                                                                    //
      return GitHubEnterprise.configure(config);                                                   //
    });                                                                                            //
  });                                                                                              //
} else {                                                                                           //
  Meteor.startup(function() {                                                                      //
    return Tracker.autorun(function() {                                                            //
      if (RocketChat.settings.get('API_GitHub_Enterprise_URL')) {                                  //
        config.serverURL = RocketChat.settings.get('API_GitHub_Enterprise_URL');                   //
        return GitHubEnterprise.configure(config);                                                 //
      }                                                                                            //
    });                                                                                            //
  });                                                                                              //
}                                                                                                  //
                                                                                                   //
/////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                 //
// packages/rocketchat_github-enterprise/startup.coffee.js                                         //
//                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.settings.addGroup('OAuth', function() {                                                 // 1
  return this.section('GitHub Enterprise', function() {                                            //
    var enableQuery;                                                                               // 3
    enableQuery = {                                                                                //
      _id: 'Accounts_OAuth_GitHub_Enterprise',                                                     //
      value: true                                                                                  //
    };                                                                                             //
    this.add('Accounts_OAuth_GitHub_Enterprise', false, {                                          //
      type: 'boolean'                                                                              //
    });                                                                                            //
    this.add('API_GitHub_Enterprise_URL', '', {                                                    //
      type: 'string',                                                                              //
      "public": true,                                                                              //
      enableQuery: enableQuery,                                                                    //
      i18nDescription: 'API_GitHub_Enterprise_URL_Description'                                     //
    });                                                                                            //
    this.add('Accounts_OAuth_GitHub_Enterprise_id', '', {                                          //
      type: 'string',                                                                              //
      enableQuery: enableQuery                                                                     //
    });                                                                                            //
    this.add('Accounts_OAuth_GitHub_Enterprise_secret', '', {                                      //
      type: 'string',                                                                              //
      enableQuery: enableQuery                                                                     //
    });                                                                                            //
    return this.add('Accounts_OAuth_GitHub_Enterprise_callback_url', '_oauth/github_enterprise', {
      type: 'relativeUrl',                                                                         //
      readonly: true,                                                                              //
      force: true,                                                                                 //
      enableQuery: enableQuery                                                                     //
    });                                                                                            //
  });                                                                                              //
});                                                                                                // 1
                                                                                                   //
/////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:github-enterprise'] = {};

})();

//# sourceMappingURL=rocketchat_github-enterprise.js.map
