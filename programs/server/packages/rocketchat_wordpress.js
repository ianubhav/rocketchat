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

/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
// packages/rocketchat_wordpress/common.coffee.js                                  //
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var WordPress, config;                                                             // 1
                                                                                   //
config = {                                                                         // 1
  serverURL: '',                                                                   //
  identityPath: '/oauth/me',                                                       //
  addAutopublishFields: {                                                          //
    forLoggedInUser: ['services.wordpress'],                                       //
    forOtherUsers: ['services.wordpress.user_login']                               //
  }                                                                                //
};                                                                                 //
                                                                                   //
WordPress = new CustomOAuth('wordpress', config);                                  // 8
                                                                                   //
if (Meteor.isServer) {                                                             // 10
  Meteor.startup(function() {                                                      //
    return RocketChat.settings.get('API_Wordpress_URL', function(key, value) {     //
      config.serverURL = value;                                                    //
      return WordPress.configure(config);                                          //
    });                                                                            //
  });                                                                              //
} else {                                                                           //
  Meteor.startup(function() {                                                      //
    return Tracker.autorun(function() {                                            //
      if (RocketChat.settings.get('API_Wordpress_URL')) {                          //
        config.serverURL = RocketChat.settings.get('API_Wordpress_URL');           //
        return WordPress.configure(config);                                        //
      }                                                                            //
    });                                                                            //
  });                                                                              //
}                                                                                  //
                                                                                   //
/////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
// packages/rocketchat_wordpress/startup.coffee.js                                 //
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.settings.addGroup('OAuth', function() {                                 // 1
  return this.section('WordPress', function() {                                    //
    var enableQuery;                                                               // 3
    enableQuery = {                                                                //
      _id: 'Accounts_OAuth_Wordpress',                                             //
      value: true                                                                  //
    };                                                                             //
    this.add('Accounts_OAuth_Wordpress', false, {                                  //
      type: 'boolean',                                                             //
      "public": true                                                               //
    });                                                                            //
    this.add('API_Wordpress_URL', '', {                                            //
      type: 'string',                                                              //
      enableQuery: enableQuery,                                                    //
      "public": true                                                               //
    });                                                                            //
    this.add('Accounts_OAuth_Wordpress_id', '', {                                  //
      type: 'string',                                                              //
      enableQuery: enableQuery                                                     //
    });                                                                            //
    this.add('Accounts_OAuth_Wordpress_secret', '', {                              //
      type: 'string',                                                              //
      enableQuery: enableQuery                                                     //
    });                                                                            //
    return this.add('Accounts_OAuth_Wordpress_callback_url', '_oauth/wordpress', {
      type: 'relativeUrl',                                                         //
      readonly: true,                                                              //
      force: true,                                                                 //
      enableQuery: enableQuery                                                     //
    });                                                                            //
  });                                                                              //
});                                                                                // 1
                                                                                   //
/////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:wordpress'] = {};

})();

//# sourceMappingURL=rocketchat_wordpress.js.map
