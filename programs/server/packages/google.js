(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var OAuth = Package.oauth.OAuth;
var Oauth = Package.oauth.Oauth;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;
var _ = Package.underscore._;
var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;

/* Package-scope variables */
var Google;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                              //
// packages/google/google_server.js                                                             //
//                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                //
Google = {};

// https://developers.google.com/accounts/docs/OAuth2Login#userinfocall
Google.whitelistedFields = ['id', 'email', 'verified_email', 'name', 'given_name',
                   'family_name', 'picture', 'locale', 'timezone', 'gender'];


OAuth.registerService('google', 2, null, function(query) {

  var response = getTokens(query);
  var expiresAt = (+new Date) + (1000 * parseInt(response.expiresIn, 10));
  var accessToken = response.accessToken;
  var idToken = response.idToken;
  var scopes = getScopes(accessToken);
  var identity = getIdentity(accessToken);

  var serviceData = {
    accessToken: accessToken,
    idToken: idToken,
    expiresAt: expiresAt,
    scope: scopes
  };

  var fields = _.pick(identity, Google.whitelistedFields);
  _.extend(serviceData, fields);

  // only set the token in serviceData if it's there. this ensures
  // that we don't lose old ones (since we only get this on the first
  // log in attempt)
  if (response.refreshToken)
    serviceData.refreshToken = response.refreshToken;

  return {
    serviceData: serviceData,
    options: {profile: {name: identity.name}}
  };
});

// returns an object containing:
// - accessToken
// - expiresIn: lifetime of token in seconds
// - refreshToken, if this is the first authorization request
var getTokens = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'google'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var response;
  try {
    response = HTTP.post(
      "https://accounts.google.com/o/oauth2/token", {params: {
        code: query.code,
        client_id: config.clientId,
        client_secret: OAuth.openSecret(config.secret),
        redirect_uri: OAuth._redirectUri('google', config),
        grant_type: 'authorization_code'
      }});
  } catch (err) {
    throw _.extend(new Error("Failed to complete OAuth handshake with Google. " + err.message),
                   {response: err.response});
  }

  if (response.data.error) { // if the http response was a json object with an error attribute
    throw new Error("Failed to complete OAuth handshake with Google. " + response.data.error);
  } else {
    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in,
      idToken: response.data.id_token
    };
  }
};

var getIdentity = function (accessToken) {
  try {
    return HTTP.get(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {params: {access_token: accessToken}}).data;
  } catch (err) {
    throw _.extend(new Error("Failed to fetch identity from Google. " + err.message),
                   {response: err.response});
  }
};

var getScopes = function (accessToken) {
  try {
    return HTTP.get(
      "https://www.googleapis.com/oauth2/v1/tokeninfo",
      {params: {access_token: accessToken}}).data.scope.split(' ');
  } catch (err) {
    throw _.extend(new Error("Failed to fetch tokeninfo from Google. " + err.message),
                   {response: err.response});
  }
};

Google.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};

//////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package.google = {}, {
  Google: Google
});

})();
