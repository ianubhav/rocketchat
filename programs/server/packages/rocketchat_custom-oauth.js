(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var check = Package.check.check;
var Match = Package.check.Match;
var OAuth = Package.oauth.OAuth;
var Oauth = Package.oauth.Oauth;
var _ = Package.underscore._;
var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;
var s = Package['underscorestring:underscore.string'].s;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Accounts = Package['accounts-base'].Accounts;

/* Package-scope variables */
var __coffeescriptShare, CustomOAuth;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/rocketchat_custom-oauth/custom_oauth_server.coffee.js                                              //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Services;                                                                                                  // 1
                                                                                                               //
Services = {};                                                                                                 // 1
                                                                                                               //
CustomOAuth = (function() {                                                                                    // 3
  function CustomOAuth(name, options) {                                                                        //
    this.name = name;                                                                                          //
    if (!Match.test(this.name, String)) {                                                                      //
      throw new Meteor.Error('CustomOAuth: Name is required and must be String');                              // 6
    }                                                                                                          //
    if (Services[this.name] != null) {                                                                         //
      Services[this.name].configure(options);                                                                  //
      return;                                                                                                  // 10
    }                                                                                                          //
    Services[this.name] = this;                                                                                //
    this.configure(options);                                                                                   //
    this.userAgent = "Meteor";                                                                                 //
    if (Meteor.release) {                                                                                      //
      this.userAgent += '/' + Meteor.release;                                                                  //
    }                                                                                                          //
    Accounts.oauth.registerService(this.name);                                                                 //
    this.registerService();                                                                                    //
  }                                                                                                            //
                                                                                                               //
  CustomOAuth.prototype.configure = function(options) {                                                        //
    if (!Match.test(options, Object)) {                                                                        //
      throw new Meteor.Error('CustomOAuth: Options is required and must be Object');                           // 25
    }                                                                                                          //
    if (!Match.test(options.serverURL, String)) {                                                              //
      throw new Meteor.Error('CustomOAuth: Options.serverURL is required and must be String');                 // 28
    }                                                                                                          //
    if (!Match.test(options.tokenPath, String)) {                                                              //
      options.tokenPath = '/oauth/token';                                                                      //
    }                                                                                                          //
    if (!Match.test(options.identityPath, String)) {                                                           //
      options.identityPath = '/me';                                                                            //
    }                                                                                                          //
    this.serverURL = options.serverURL;                                                                        //
    this.tokenPath = options.tokenPath;                                                                        //
    this.identityPath = options.identityPath;                                                                  //
    this.tokenSentVia = options.tokenSentVia;                                                                  //
    if (!/^https?:\/\/.+/.test(this.tokenPath)) {                                                              //
      this.tokenPath = this.serverURL + this.tokenPath;                                                        //
    }                                                                                                          //
    if (!/^https?:\/\/.+/.test(this.identityPath)) {                                                           //
      this.identityPath = this.serverURL + this.identityPath;                                                  //
    }                                                                                                          //
    if (Match.test(options.addAutopublishFields, Object)) {                                                    //
      return Accounts.addAutopublishFields(options.addAutopublishFields);                                      //
    }                                                                                                          //
  };                                                                                                           //
                                                                                                               //
  CustomOAuth.prototype.getAccessToken = function(query) {                                                     //
    var config, err, error, response;                                                                          // 51
    config = ServiceConfiguration.configurations.findOne({                                                     //
      service: this.name                                                                                       //
    });                                                                                                        //
    if (config == null) {                                                                                      //
      throw new ServiceConfiguration.ConfigError();                                                            // 53
    }                                                                                                          //
    response = void 0;                                                                                         //
    try {                                                                                                      // 56
      response = HTTP.post(this.tokenPath, {                                                                   //
        auth: config.clientId + ':' + OAuth.openSecret(config.secret),                                         //
        headers: {                                                                                             //
          Accept: 'application/json',                                                                          //
          'User-Agent': this.userAgent                                                                         //
        },                                                                                                     //
        params: {                                                                                              //
          code: query.code,                                                                                    //
          client_id: config.clientId,                                                                          //
          client_secret: OAuth.openSecret(config.secret),                                                      //
          redirect_uri: OAuth._redirectUri(this.name, config),                                                 //
          grant_type: 'authorization_code',                                                                    //
          state: query.state                                                                                   //
        }                                                                                                      //
      });                                                                                                      //
    } catch (error1) {                                                                                         //
      err = error1;                                                                                            //
      error = new Error(("Failed to complete OAuth handshake with " + this.name + " at " + this.tokenPath + ". ") + err.message);
      throw _.extend(error, {                                                                                  // 72
        response: err.response                                                                                 //
      });                                                                                                      //
    }                                                                                                          //
    if (response.data.error) {                                                                                 //
      throw new Error(("Failed to complete OAuth handshake with " + this.name + " at " + this.tokenPath + ". ") + response.data.error);
    } else {                                                                                                   //
      return response.data.access_token;                                                                       // 77
    }                                                                                                          //
  };                                                                                                           //
                                                                                                               //
  CustomOAuth.prototype.getIdentity = function(accessToken) {                                                  //
    var err, error, headers, params, response;                                                                 // 80
    params = {};                                                                                               //
    headers = {                                                                                                //
      'User-Agent': this.userAgent                                                                             //
    };                                                                                                         //
    if (this.tokenSentVia === 'header') {                                                                      //
      headers['Authorization'] = 'Bearer ' + accessToken;                                                      //
    } else {                                                                                                   //
      params['access_token'] = accessToken;                                                                    //
    }                                                                                                          //
    try {                                                                                                      // 89
      response = HTTP.get(this.identityPath, {                                                                 //
        headers: headers,                                                                                      //
        params: params                                                                                         //
      });                                                                                                      //
      if (response.data) {                                                                                     //
        return response.data;                                                                                  // 95
      } else {                                                                                                 //
        return JSON.parse(response.content);                                                                   // 97
      }                                                                                                        //
    } catch (error1) {                                                                                         //
      err = error1;                                                                                            //
      error = new Error(("Failed to fetch identity from " + this.name + " at " + this.identityPath + ". ") + err.message);
      throw _.extend(error, {                                                                                  // 101
        response: err.response                                                                                 //
      });                                                                                                      //
    }                                                                                                          //
  };                                                                                                           //
                                                                                                               //
  CustomOAuth.prototype.registerService = function() {                                                         //
    var self;                                                                                                  // 104
    self = this;                                                                                               //
    return OAuth.registerService(this.name, 2, null, function(query) {                                         //
      var accessToken, data, identity, ref, ref1, serviceData;                                                 // 106
      accessToken = self.getAccessToken(query);                                                                //
      identity = self.getIdentity(accessToken);                                                                //
      if (identity != null ? identity.result : void 0) {                                                       //
        identity = identity.result;                                                                            //
      }                                                                                                        //
      if ((identity != null ? identity.ID : void 0) && !identity.id) {                                         //
        identity.id = identity.ID;                                                                             //
      }                                                                                                        //
      if ((identity != null ? identity.user_id : void 0) && !identity.id) {                                    //
        identity.id = identity.user_id;                                                                        //
      }                                                                                                        //
      if ((identity != null ? identity.CharacterID : void 0) && !identity.id) {                                //
        identity.id = identity.CharacterID;                                                                    //
      }                                                                                                        //
      if ((identity != null ? (ref = identity.user) != null ? ref.userid : void 0 : void 0) && !identity.id) {
        identity.id = identity.user.userid;                                                                    //
        identity.email = identity.user.email;                                                                  //
      }                                                                                                        //
      if ((identity != null ? identity.phid : void 0) && !identity.id) {                                       //
        identity.id = identity.phid;                                                                           //
      }                                                                                                        //
      if ((identity != null ? identity.sub : void 0) && !identity.id) {                                        //
        identity.id = identity.sub;                                                                            //
      }                                                                                                        //
      if ((identity != null ? identity.userid : void 0) && !identity.id) {                                     //
        identity.id = identity.userid;                                                                         //
      }                                                                                                        //
      serviceData = {                                                                                          //
        _OAuthCustom: true,                                                                                    //
        accessToken: accessToken                                                                               //
      };                                                                                                       //
      _.extend(serviceData, identity);                                                                         //
      data = {                                                                                                 //
        serviceData: serviceData,                                                                              //
        options: {                                                                                             //
          profile: {                                                                                           //
            name: identity.name || identity.username || identity.nickname || identity.CharacterName || identity.userName || identity.preferred_username || ((ref1 = identity.user) != null ? ref1.name : void 0)
          }                                                                                                    //
        }                                                                                                      //
      };                                                                                                       //
      return data;                                                                                             // 159
    });                                                                                                        //
  };                                                                                                           //
                                                                                                               //
  CustomOAuth.prototype.retrieveCredential = function(credentialToken, credentialSecret) {                     //
    return OAuth.retrieveCredential(credentialToken, credentialSecret);                                        // 162
  };                                                                                                           //
                                                                                                               //
  return CustomOAuth;                                                                                          //
                                                                                                               //
})();                                                                                                          //
                                                                                                               //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['rocketchat:custom-oauth'] = {}, {
  CustomOAuth: CustomOAuth
});

})();

//# sourceMappingURL=rocketchat_custom-oauth.js.map
