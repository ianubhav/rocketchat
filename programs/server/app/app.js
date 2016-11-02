var require = meteorInstall({"server":{"lib":{"cordova":{"facebook-login.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/lib/cordova/facebook-login.coffee.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var getIdentity;                                                                                                       // 1
                                                                                                                       //
Accounts.registerLoginHandler(function(loginRequest) {                                                                 // 1
  var fields, identity, options, profileFields, serviceData, whitelisted;                                              // 2
  if (!loginRequest.cordova) {                                                                                         //
    return void 0;                                                                                                     // 3
  }                                                                                                                    //
  loginRequest = loginRequest.authResponse;                                                                            //
  identity = getIdentity(loginRequest.accessToken);                                                                    //
  serviceData = {                                                                                                      //
    accessToken: loginRequest.accessToken,                                                                             //
    expiresAt: (+(new Date)) + (1000 * loginRequest.expiresIn)                                                         //
  };                                                                                                                   //
  whitelisted = ['id', 'email', 'name', 'first_name', 'last_name', 'link', 'username', 'gender', 'locale', 'age_range'];
  fields = _.pick(identity, whitelisted);                                                                              //
  _.extend(serviceData, fields);                                                                                       //
  options = {                                                                                                          //
    profile: {}                                                                                                        //
  };                                                                                                                   //
  profileFields = _.pick(identity, whitelisted);                                                                       //
  _.extend(options.profile, profileFields);                                                                            //
  return Accounts.updateOrCreateUserFromExternalService("facebook", serviceData, options);                             // 21
});                                                                                                                    // 1
                                                                                                                       //
getIdentity = function(accessToken) {                                                                                  // 24
  var err;                                                                                                             // 25
  try {                                                                                                                // 25
    return HTTP.get("https://graph.facebook.com/me", {                                                                 // 26
      params: {                                                                                                        //
        access_token: accessToken                                                                                      //
      }                                                                                                                //
    }).data;                                                                                                           //
  } catch (error) {                                                                                                    //
    err = error;                                                                                                       //
    throw _.extend(new Error("Failed to fetch identity from Facebook. " + err.message), {                              // 29
      response: err.response                                                                                           //
    });                                                                                                                //
  }                                                                                                                    //
};                                                                                                                     // 24
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"accounts.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/lib/accounts.coffee.js                                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var accountsConfig, resetPasswordHtml, verifyEmailHtml,                                                                // 2
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
                                                                                                                       //
accountsConfig = {                                                                                                     // 2
  forbidClientAccountCreation: true,                                                                                   //
  loginExpirationInDays: RocketChat.settings.get('Accounts_LoginExpiration')                                           //
};                                                                                                                     //
                                                                                                                       //
Accounts.config(accountsConfig);                                                                                       // 3
                                                                                                                       //
Accounts.emailTemplates.siteName = RocketChat.settings.get('Site_Name');                                               // 5
                                                                                                                       //
Accounts.emailTemplates.from = (RocketChat.settings.get('Site_Name')) + " <" + (RocketChat.settings.get('From_Email')) + ">";
                                                                                                                       //
verifyEmailHtml = Accounts.emailTemplates.verifyEmail.text;                                                            // 8
                                                                                                                       //
Accounts.emailTemplates.verifyEmail.html = function(user, url) {                                                       // 9
  url = url.replace(Meteor.absoluteUrl(), Meteor.absoluteUrl() + 'login/');                                            //
  return verifyEmailHtml(user, url);                                                                                   //
};                                                                                                                     // 9
                                                                                                                       //
resetPasswordHtml = Accounts.emailTemplates.resetPassword.text;                                                        // 13
                                                                                                                       //
Accounts.emailTemplates.resetPassword.html = function(user, url) {                                                     // 14
  url = url.replace(/\/#\//, '/');                                                                                     //
  return resetPasswordHtml(user, url);                                                                                 //
};                                                                                                                     // 14
                                                                                                                       //
Accounts.emailTemplates.enrollAccount.subject = function(user) {                                                       // 18
  var subject;                                                                                                         // 19
  if (RocketChat.settings.get('Accounts_Enrollment_Customized')) {                                                     //
    subject = RocketChat.settings.get('Accounts_Enrollment_Email_Subject');                                            //
  } else {                                                                                                             //
    subject = TAPi18n.__('Accounts_Enrollment_Email_Subject_Default', {                                                //
      lng: (user != null ? user.language : void 0) || RocketChat.settings.get('language') || 'en'                      //
    });                                                                                                                //
  }                                                                                                                    //
  return RocketChat.placeholders.replace(subject);                                                                     // 24
};                                                                                                                     // 18
                                                                                                                       //
Accounts.emailTemplates.enrollAccount.html = function(user, url) {                                                     // 26
  var footer, header, html, ref, ref1;                                                                                 // 28
  if (RocketChat.settings.get('Accounts_Enrollment_Customized')) {                                                     //
    html = RocketChat.settings.get('Accounts_Enrollment_Email');                                                       //
  } else {                                                                                                             //
    html = TAPi18n.__('Accounts_Enrollment_Email_Default', {                                                           //
      lng: (user != null ? user.language : void 0) || RocketChat.settings.get('language') || 'en'                      //
    });                                                                                                                //
  }                                                                                                                    //
  header = RocketChat.placeholders.replace(RocketChat.settings.get('Email_Header') || "");                             //
  footer = RocketChat.placeholders.replace(RocketChat.settings.get('Email_Footer') || "");                             //
  html = RocketChat.placeholders.replace(html, {                                                                       //
    name: user.name,                                                                                                   //
    email: (ref = user.emails) != null ? (ref1 = ref[0]) != null ? ref1.address : void 0 : void 0                      //
  });                                                                                                                  //
  return header + html + footer;                                                                                       // 40
};                                                                                                                     // 26
                                                                                                                       //
Accounts.onCreateUser(function(options, user) {                                                                        // 42
  var ref, ref1, ref2, service, serviceName;                                                                           // 47
  RocketChat.callbacks.run('beforeCreateUser', options, user);                                                         //
  user.status = 'offline';                                                                                             //
  user.active = !RocketChat.settings.get('Accounts_ManuallyApproveNewUsers');                                          //
  if (((user != null ? user.name : void 0) == null) || user.name === '') {                                             //
    if (((ref = options.profile) != null ? ref.name : void 0) != null) {                                               //
      user.name = (ref1 = options.profile) != null ? ref1.name : void 0;                                               //
    }                                                                                                                  //
  }                                                                                                                    //
  if (user.services != null) {                                                                                         //
    ref2 = user.services;                                                                                              // 57
    for (serviceName in ref2) {                                                                                        // 57
      service = ref2[serviceName];                                                                                     //
      if (((user != null ? user.name : void 0) == null) || user.name === '') {                                         //
        if (service.name != null) {                                                                                    //
          user.name = service.name;                                                                                    //
        } else if (service.username != null) {                                                                         //
          user.name = service.username;                                                                                //
        }                                                                                                              //
      }                                                                                                                //
      if ((user.emails == null) && (service.email != null)) {                                                          //
        user.emails = [                                                                                                //
          {                                                                                                            //
            address: service.email,                                                                                    //
            verified: true                                                                                             //
          }                                                                                                            //
        ];                                                                                                             //
      }                                                                                                                //
    }                                                                                                                  // 57
  }                                                                                                                    //
  return user;                                                                                                         // 70
});                                                                                                                    // 42
                                                                                                                       //
Accounts.insertUserDoc = _.wrap(Accounts.insertUserDoc, function(insertUserDoc, options, user) {                       // 73
  var _id, hasAdmin, roles;                                                                                            // 74
  roles = [];                                                                                                          //
  if (Match.test(user.globalRoles, [String]) && user.globalRoles.length > 0) {                                         //
    roles = roles.concat(user.globalRoles);                                                                            //
  }                                                                                                                    //
  delete user.globalRoles;                                                                                             //
  if (user.type == null) {                                                                                             //
    user.type = 'user';                                                                                                //
  }                                                                                                                    //
  _id = insertUserDoc.call(Accounts, options, user);                                                                   //
  if (roles.length === 0) {                                                                                            //
    hasAdmin = RocketChat.models.Users.findOne({                                                                       //
      roles: 'admin'                                                                                                   //
    }, {                                                                                                               //
      fields: {                                                                                                        //
        _id: 1                                                                                                         //
      }                                                                                                                //
    });                                                                                                                //
    if (hasAdmin != null) {                                                                                            //
      roles.push('user');                                                                                              //
    } else {                                                                                                           //
      roles.push('admin');                                                                                             //
    }                                                                                                                  //
  }                                                                                                                    //
  RocketChat.authz.addUserRoles(_id, roles);                                                                           //
  Meteor.defer(function() {                                                                                            //
    return RocketChat.callbacks.run('afterCreateUser', options, user);                                                 //
  });                                                                                                                  //
  return _id;                                                                                                          // 97
});                                                                                                                    // 73
                                                                                                                       //
Accounts.validateLoginAttempt(function(login) {                                                                        // 99
  var ref, ref1, validEmail;                                                                                           // 100
  login = RocketChat.callbacks.run('beforeValidateLogin', login);                                                      //
  if (login.allowed !== true) {                                                                                        //
    return login.allowed;                                                                                              // 103
  }                                                                                                                    //
  if (login.user.type === 'visitor') {                                                                                 //
    return true;                                                                                                       // 107
  }                                                                                                                    //
  if (!!((ref = login.user) != null ? ref.active : void 0) !== true) {                                                 //
    throw new Meteor.Error('error-user-is-not-activated', 'User is not activated', {                                   // 110
      "function": 'Accounts.validateLoginAttempt'                                                                      //
    });                                                                                                                //
    return false;                                                                                                      // 111
  }                                                                                                                    //
  if (indexOf.call((ref1 = login.user) != null ? ref1.roles : void 0, 'admin') < 0 && login.type === 'password' && RocketChat.settings.get('Accounts_EmailVerification') === true) {
    validEmail = login.user.emails.filter(function(email) {                                                            //
      return email.verified === true;                                                                                  // 116
    });                                                                                                                //
    if (validEmail.length === 0) {                                                                                     //
      throw new Meteor.Error('error-invalid-email', 'Invalid email __email__');                                        // 119
      return false;                                                                                                    // 120
    }                                                                                                                  //
  }                                                                                                                    //
  RocketChat.models.Users.updateLastLoginById(login.user._id);                                                         //
  Meteor.defer(function() {                                                                                            //
    return RocketChat.callbacks.run('afterValidateLogin', login);                                                      //
  });                                                                                                                  //
  return true;                                                                                                         // 127
});                                                                                                                    // 99
                                                                                                                       //
Accounts.validateNewUser(function(user) {                                                                              // 129
  var ref;                                                                                                             // 131
  if (user.type === 'visitor') {                                                                                       //
    return true;                                                                                                       // 132
  }                                                                                                                    //
  if (RocketChat.settings.get('Accounts_Registration_AuthenticationServices_Enabled') === false && RocketChat.settings.get('LDAP_Enable') === false && (((ref = user.services) != null ? ref.password : void 0) == null)) {
    throw new Meteor.Error('registration-disabled-authentication-services', 'User registration is disabled for authentication services');
  }                                                                                                                    //
  return true;                                                                                                         // 136
});                                                                                                                    // 129
                                                                                                                       //
Accounts.validateNewUser(function(user) {                                                                              // 139
  var domain, domainWhiteList, email, i, len, ref, ret;                                                                // 141
  if (user.type === 'visitor') {                                                                                       //
    return true;                                                                                                       // 142
  }                                                                                                                    //
  domainWhiteList = RocketChat.settings.get('Accounts_AllowedDomainsList');                                            //
  if (_.isEmpty(s.trim(domainWhiteList))) {                                                                            //
    return true;                                                                                                       // 147
  }                                                                                                                    //
  domainWhiteList = _.map(domainWhiteList.split(','), function(domain) {                                               //
    return domain.trim();                                                                                              //
  });                                                                                                                  //
  if (((ref = user.emails) != null ? ref.length : void 0) > 0) {                                                       //
    ret = false;                                                                                                       //
    email = user.emails[0].address;                                                                                    //
    for (i = 0, len = domainWhiteList.length; i < len; i++) {                                                          // 154
      domain = domainWhiteList[i];                                                                                     //
      if (email.match('@' + RegExp.escape(domain) + '$')) {                                                            //
        ret = true;                                                                                                    //
        break;                                                                                                         // 157
      }                                                                                                                //
    }                                                                                                                  // 154
    if (!ret) {                                                                                                        //
      throw new Meteor.Error('error-invalid-domain');                                                                  // 160
    }                                                                                                                  //
  }                                                                                                                    //
  return true;                                                                                                         // 162
});                                                                                                                    // 139
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"cordova.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/lib/cordova.coffee.js                                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var configurePush, sendPush;                                                                                           // 1
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
  log: function() {                                                                                                    //
    return console.log.apply(console, arguments);                                                                      //
  },                                                                                                                   //
  push_test: function() {                                                                                              //
    var query, tokens, user;                                                                                           // 6
    user = Meteor.user();                                                                                              //
    if (user == null) {                                                                                                //
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                     // 8
        method: 'push_test'                                                                                            //
      });                                                                                                              //
    }                                                                                                                  //
    if (!RocketChat.authz.hasRole(user._id, 'admin')) {                                                                //
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                     // 11
        method: 'push_test'                                                                                            //
      });                                                                                                              //
    }                                                                                                                  //
    if (Push.enabled !== true) {                                                                                       //
      throw new Meteor.Error('error-push-disabled', 'Push is disabled', {                                              // 14
        method: 'push_test'                                                                                            //
      });                                                                                                              //
    }                                                                                                                  //
    query = {                                                                                                          //
      $and: [                                                                                                          //
        {                                                                                                              //
          userId: user._id                                                                                             //
        }, {                                                                                                           //
          $or: [                                                                                                       //
            {                                                                                                          //
              'token.apn': {                                                                                           //
                $exists: true                                                                                          //
              }                                                                                                        //
            }, {                                                                                                       //
              'token.gcm': {                                                                                           //
                $exists: true                                                                                          //
              }                                                                                                        //
            }                                                                                                          //
          ]                                                                                                            //
        }                                                                                                              //
      ]                                                                                                                //
    };                                                                                                                 //
    tokens = Push.appCollection.find(query).count();                                                                   //
    if (tokens === 0) {                                                                                                //
      throw new Meteor.Error('error-no-tokens-for-this-user', "There are no tokens for this user", {                   // 30
        method: 'push_test'                                                                                            //
      });                                                                                                              //
    }                                                                                                                  //
    Push.send({                                                                                                        //
      from: 'push',                                                                                                    //
      title: "@" + user.username,                                                                                      //
      text: TAPi18n.__("This_is_a_push_test_messsage"),                                                                //
      apn: {                                                                                                           //
        text: ("@" + user.username + ":\n") + TAPi18n.__("This_is_a_push_test_messsage")                               //
      },                                                                                                               //
      sound: 'chime',                                                                                                  //
      query: {                                                                                                         //
        userId: user._id                                                                                               //
      }                                                                                                                //
    });                                                                                                                //
    return {                                                                                                           // 42
      message: "Your_push_was_sent_to_s_devices",                                                                      //
      params: [tokens]                                                                                                 //
    };                                                                                                                 //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
configurePush = function() {                                                                                           // 47
  var apn, gcm;                                                                                                        // 48
  if (RocketChat.settings.get('Push_debug')) {                                                                         //
    Push.debug = true;                                                                                                 //
    console.log('Push: configuring...');                                                                               //
  }                                                                                                                    //
  if (RocketChat.settings.get('Push_enable') === true) {                                                               //
    Push.allow({                                                                                                       //
      send: function(userId, notification) {                                                                           //
        return RocketChat.authz.hasRole(userId, 'admin');                                                              // 55
      }                                                                                                                //
    });                                                                                                                //
    apn = void 0;                                                                                                      //
    gcm = void 0;                                                                                                      //
    if (RocketChat.settings.get('Push_enable_gateway') === false) {                                                    //
      gcm = {                                                                                                          //
        apiKey: RocketChat.settings.get('Push_gcm_api_key'),                                                           //
        projectNumber: RocketChat.settings.get('Push_gcm_project_number')                                              //
      };                                                                                                               //
      apn = {                                                                                                          //
        passphrase: RocketChat.settings.get('Push_apn_passphrase'),                                                    //
        keyData: RocketChat.settings.get('Push_apn_key'),                                                              //
        certData: RocketChat.settings.get('Push_apn_cert')                                                             //
      };                                                                                                               //
      if (RocketChat.settings.get('Push_production') !== true) {                                                       //
        apn = {                                                                                                        //
          passphrase: RocketChat.settings.get('Push_apn_dev_passphrase'),                                              //
          keyData: RocketChat.settings.get('Push_apn_dev_key'),                                                        //
          certData: RocketChat.settings.get('Push_apn_dev_cert'),                                                      //
          gateway: 'gateway.sandbox.push.apple.com'                                                                    //
        };                                                                                                             //
      }                                                                                                                //
      if ((apn.keyData == null) || apn.keyData.trim() === '' || (apn.keyData == null) || apn.keyData.trim() === '') {  //
        apn = void 0;                                                                                                  //
      }                                                                                                                //
      if ((gcm.apiKey == null) || gcm.apiKey.trim() === '' || (gcm.projectNumber == null) || gcm.projectNumber.trim() === '') {
        gcm = void 0;                                                                                                  //
      }                                                                                                                //
    }                                                                                                                  //
    Push.Configure({                                                                                                   //
      apn: apn,                                                                                                        //
      gcm: gcm,                                                                                                        //
      production: RocketChat.settings.get('Push_production'),                                                          //
      sendInterval: 1000,                                                                                              //
      sendBatchSize: 10                                                                                                //
    });                                                                                                                //
    if (RocketChat.settings.get('Push_enable_gateway') === true) {                                                     //
      Push.serverSend = function(options) {                                                                            //
        var query;                                                                                                     // 92
        options = options || {                                                                                         //
          badge: 0                                                                                                     //
        };                                                                                                             //
        query = void 0;                                                                                                //
        if (options.from !== '' + options.from) {                                                                      //
          throw new Error('Push.send: option "from" not a string');                                                    // 96
        }                                                                                                              //
        if (options.title !== '' + options.title) {                                                                    //
          throw new Error('Push.send: option "title" not a string');                                                   // 99
        }                                                                                                              //
        if (options.text !== '' + options.text) {                                                                      //
          throw new Error('Push.send: option "text" not a string');                                                    // 102
        }                                                                                                              //
        if (RocketChat.settings.get('Push_debug')) {                                                                   //
          console.log('Push: send message "' + options.title + '" via query', options.query);                          //
        }                                                                                                              //
        query = {                                                                                                      //
          $and: [                                                                                                      //
            options.query, {                                                                                           //
              $or: [                                                                                                   //
                {                                                                                                      //
                  'token.apn': {                                                                                       //
                    $exists: true                                                                                      //
                  }                                                                                                    //
                }, {                                                                                                   //
                  'token.gcm': {                                                                                       //
                    $exists: true                                                                                      //
                  }                                                                                                    //
                }                                                                                                      //
              ]                                                                                                        //
            }                                                                                                          //
          ]                                                                                                            //
        };                                                                                                             //
        return Push.appCollection.find(query).forEach(function(app) {                                                  //
          var service, token;                                                                                          // 119
          if (RocketChat.settings.get('Push_debug')) {                                                                 //
            console.log('Push: send to token', app.token);                                                             //
          }                                                                                                            //
          if (app.token.apn != null) {                                                                                 //
            service = 'apn';                                                                                           //
            token = app.token.apn;                                                                                     //
          } else if (app.token.gcm != null) {                                                                          //
            service = 'gcm';                                                                                           //
            token = app.token.gcm;                                                                                     //
          }                                                                                                            //
          return sendPush(service, token, options);                                                                    //
        });                                                                                                            //
      };                                                                                                               //
    }                                                                                                                  //
    return Push.enabled = true;                                                                                        //
  }                                                                                                                    //
};                                                                                                                     // 47
                                                                                                                       //
sendPush = function(service, token, options, tries) {                                                                  // 133
  var data;                                                                                                            // 134
  if (tries == null) {                                                                                                 //
    tries = 0;                                                                                                         //
  }                                                                                                                    //
  data = {                                                                                                             //
    data: {                                                                                                            //
      token: token,                                                                                                    //
      options: options                                                                                                 //
    }                                                                                                                  //
  };                                                                                                                   //
  return HTTP.post(RocketChat.settings.get('Push_gateway') + ("/push/" + service + "/send"), data, function(error, response) {
    var milli;                                                                                                         // 140
    if ((response != null ? response.statusCode : void 0) === 406) {                                                   //
      console.log('removing push token', token);                                                                       //
      Push.appCollection.remove({                                                                                      //
        $or: [                                                                                                         //
          {                                                                                                            //
            'token.apn': token                                                                                         //
          }, {                                                                                                         //
            'token.gcm': token                                                                                         //
          }                                                                                                            //
        ]                                                                                                              //
      });                                                                                                              //
      return;                                                                                                          // 148
    }                                                                                                                  //
    if (error == null) {                                                                                               //
      return;                                                                                                          // 151
    }                                                                                                                  //
    SystemLogger.error('Error sending push to gateway (' + tries + ' try) ->', error);                                 //
    if (tries <= 6) {                                                                                                  //
      milli = Math.pow(10, tries + 2);                                                                                 //
      SystemLogger.log('Trying sending push to gateway again in', milli, 'milliseconds');                              //
      return Meteor.setTimeout(function() {                                                                            //
        return sendPush(service, token, options, tries + 1);                                                           //
      }, milli);                                                                                                       //
    }                                                                                                                  //
  });                                                                                                                  //
};                                                                                                                     // 133
                                                                                                                       //
Meteor.startup(function() {                                                                                            // 164
  return configurePush();                                                                                              //
});                                                                                                                    // 164
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"startup":{"migrations":{"v001.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v001.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                                                                            // 1
  version: 1,                                                                                                          //
  up: function() {                                                                                                     //
    return RocketChat.models.Users.find({                                                                              //
      username: {                                                                                                      //
        $exists: false                                                                                                 //
      },                                                                                                               //
      lastLogin: {                                                                                                     //
        $exists: true                                                                                                  //
      }                                                                                                                //
    }).forEach(function(user) {                                                                                        //
      var username;                                                                                                    // 5
      username = generateSuggestion(user);                                                                             //
      if ((username != null) && username.trim() !== '') {                                                              //
        return RocketChat.models.Users.setUsername(user._id, username);                                                //
      } else {                                                                                                         //
        return console.log("User without username", JSON.stringify(user, null, ' '));                                  //
      }                                                                                                                //
    });                                                                                                                //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v002.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v002.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                                                                            // 1
  version: 2,                                                                                                          //
  up: function() {                                                                                                     //
    return RocketChat.models.Users.find({                                                                              //
      avatarOrigin: {                                                                                                  //
        $exists: false                                                                                                 //
      },                                                                                                               //
      username: {                                                                                                      //
        $exists: true                                                                                                  //
      }                                                                                                                //
    }).forEach(function(user) {                                                                                        //
      var avatars, contentType, dataURI, image, ref, rs, service, services, ws;                                        // 5
      avatars = getAvatarSuggestionForUser(user);                                                                      //
      services = Object.keys(avatars);                                                                                 //
      if (services.length === 0) {                                                                                     //
        return;                                                                                                        // 10
      }                                                                                                                //
      service = services[0];                                                                                           //
      console.log(user.username, '->', service);                                                                       //
      dataURI = avatars[service].blob;                                                                                 //
      ref = RocketChatFile.dataURIParse(dataURI), image = ref.image, contentType = ref.contentType;                    //
      rs = RocketChatFile.bufferToStream(new Buffer(image, 'base64'));                                                 //
      ws = RocketChatFileAvatarInstance.createWriteStream(user.username + ".jpg", contentType);                        //
      ws.on('end', Meteor.bindEnvironment(function() {                                                                 //
        return RocketChat.models.Users.setAvatarOrigin(user._id, service);                                             //
      }));                                                                                                             //
      return rs.pipe(ws);                                                                                              //
    });                                                                                                                //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v003.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v003.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                                                                            // 1
  version: 3,                                                                                                          //
  up: function() {                                                                                                     //
    RocketChat.models.Subscriptions.tryDropIndex('uid_1');                                                             //
    RocketChat.models.Subscriptions.tryDropIndex('rid_1_uid_1');                                                       //
    console.log('Fixing ChatSubscription uid');                                                                        //
    RocketChat.models.Subscriptions.find({                                                                             //
      uid: {                                                                                                           //
        $exists: true                                                                                                  //
      }                                                                                                                //
    }, {                                                                                                               //
      nonreactive: true                                                                                                //
    }).forEach(function(sub) {                                                                                         //
      var update, user;                                                                                                // 12
      update = {};                                                                                                     //
      user = RocketChat.models.Users.findOneById(sub.uid, {                                                            //
        fields: {                                                                                                      //
          username: 1                                                                                                  //
        }                                                                                                              //
      });                                                                                                              //
      if (user != null) {                                                                                              //
        if (update.$set == null) {                                                                                     //
          update.$set = {};                                                                                            //
        }                                                                                                              //
        if (update.$unset == null) {                                                                                   //
          update.$unset = {};                                                                                          //
        }                                                                                                              //
        update.$set['u._id'] = user._id;                                                                               //
        update.$set['u.username'] = user.username;                                                                     //
        update.$unset.uid = 1;                                                                                         //
      }                                                                                                                //
      if (Object.keys(update).length > 0) {                                                                            //
        return RocketChat.models.Subscriptions.update(sub._id, update);                                                //
      }                                                                                                                //
    });                                                                                                                //
    console.log('Fixing ChatRoom uids');                                                                               //
    RocketChat.models.Rooms.find({                                                                                     //
      'uids.0': {                                                                                                      //
        $exists: true                                                                                                  //
      }                                                                                                                //
    }, {                                                                                                               //
      nonreactive: true                                                                                                //
    }).forEach(function(room) {                                                                                        //
      var k, oldId, ref, ref1, update, user, usernames, users, v;                                                      // 27
      update = {};                                                                                                     //
      users = RocketChat.models.Users.find({                                                                           //
        _id: {                                                                                                         //
          $in: room.uids                                                                                               //
        },                                                                                                             //
        username: {                                                                                                    //
          $exists: true                                                                                                //
        }                                                                                                              //
      }, {                                                                                                             //
        fields: {                                                                                                      //
          username: 1                                                                                                  //
        }                                                                                                              //
      });                                                                                                              //
      usernames = users.map(function(user) {                                                                           //
        return user.username;                                                                                          // 30
      });                                                                                                              //
      if (update.$set == null) {                                                                                       //
        update.$set = {};                                                                                              //
      }                                                                                                                //
      if (update.$unset == null) {                                                                                     //
        update.$unset = {};                                                                                            //
      }                                                                                                                //
      update.$set.usernames = usernames;                                                                               //
      update.$unset.uids = 1;                                                                                          //
      user = RocketChat.models.Users.findOneById(room.uid, {                                                           //
        fields: {                                                                                                      //
          username: 1                                                                                                  //
        }                                                                                                              //
      });                                                                                                              //
      if (user != null) {                                                                                              //
        update.$set['u._id'] = user._id;                                                                               //
        update.$set['u.username'] = user.username;                                                                     //
        update.$unset.uid = 1;                                                                                         //
      }                                                                                                                //
      if (room.t === 'd' && usernames.length === 2) {                                                                  //
        ref = update.$set;                                                                                             // 44
        for (k in ref) {                                                                                               // 44
          v = ref[k];                                                                                                  //
          room[k] = v;                                                                                                 //
        }                                                                                                              // 44
        ref1 = update.$unset;                                                                                          // 46
        for (k in ref1) {                                                                                              // 46
          v = ref1[k];                                                                                                 //
          delete room[k];                                                                                              //
        }                                                                                                              // 46
        oldId = room._id;                                                                                              //
        room._id = usernames.sort().join(',');                                                                         //
        RocketChat.models.Rooms.insert(room);                                                                          //
        RocketChat.models.Rooms.removeById(oldId);                                                                     //
        RocketChat.models.Subscriptions.update({                                                                       //
          rid: oldId                                                                                                   //
        }, {                                                                                                           //
          $set: {                                                                                                      //
            rid: room._id                                                                                              //
          }                                                                                                            //
        }, {                                                                                                           //
          multi: true                                                                                                  //
        });                                                                                                            //
        return RocketChat.models.Messages.update({                                                                     //
          rid: oldId                                                                                                   //
        }, {                                                                                                           //
          $set: {                                                                                                      //
            rid: room._id                                                                                              //
          }                                                                                                            //
        }, {                                                                                                           //
          multi: true                                                                                                  //
        });                                                                                                            //
      } else {                                                                                                         //
        return RocketChat.models.Rooms.update(room._id, update);                                                       //
      }                                                                                                                //
    });                                                                                                                //
    console.log('Fixing ChatMessage uid');                                                                             //
    RocketChat.models.Messages.find({                                                                                  //
      uid: {                                                                                                           //
        $exists: true                                                                                                  //
      }                                                                                                                //
    }, {                                                                                                               //
      nonreactive: true                                                                                                //
    }).forEach(function(message) {                                                                                     //
      var update, user;                                                                                                // 61
      update = {};                                                                                                     //
      user = RocketChat.models.Users.findOneById(message.uid, {                                                        //
        fields: {                                                                                                      //
          username: 1                                                                                                  //
        }                                                                                                              //
      });                                                                                                              //
      if (user != null) {                                                                                              //
        if (update.$set == null) {                                                                                     //
          update.$set = {};                                                                                            //
        }                                                                                                              //
        if (update.$unset == null) {                                                                                   //
          update.$unset = {};                                                                                          //
        }                                                                                                              //
        update.$set['u._id'] = user._id;                                                                               //
        update.$set['u.username'] = user.username;                                                                     //
        update.$unset.uid = 1;                                                                                         //
      }                                                                                                                //
      if (Object.keys(update).length > 0) {                                                                            //
        return RocketChat.models.Messages.update(message._id, update);                                                 //
      }                                                                                                                //
    });                                                                                                                //
    return console.log('End');                                                                                         //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v004.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v004.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                                                                            // 1
  version: 4,                                                                                                          //
  up: function() {                                                                                                     //
    RocketChat.models.Messages.tryDropIndex('rid_1');                                                                  //
    RocketChat.models.Subscriptions.tryDropIndex('u._id_1');                                                           //
    console.log('Rename rn to name');                                                                                  //
    RocketChat.models.Subscriptions.update({                                                                           //
      rn: {                                                                                                            //
        $exists: true                                                                                                  //
      }                                                                                                                //
    }, {                                                                                                               //
      $rename: {                                                                                                       //
        rn: 'name'                                                                                                     //
      }                                                                                                                //
    }, {                                                                                                               //
      multi: true                                                                                                      //
    });                                                                                                                //
    console.log('Adding names to rooms without name');                                                                 //
    RocketChat.models.Rooms.find({                                                                                     //
      name: ''                                                                                                         //
    }).forEach(function(item) {                                                                                        //
      var name;                                                                                                        // 15
      name = Random.id().toLowerCase();                                                                                //
      RocketChat.models.Rooms.setNameById(item._id, name);                                                             //
      return RocketChat.models.Subscriptions.update({                                                                  //
        rid: item._id                                                                                                  //
      }, {                                                                                                             //
        $set: {                                                                                                        //
          name: name                                                                                                   //
        }                                                                                                              //
      }, {                                                                                                             //
        multi: true                                                                                                    //
      });                                                                                                              //
    });                                                                                                                //
    console.log('Making room names unique');                                                                           //
    RocketChat.models.Rooms.find().forEach(function(room) {                                                            //
      return RocketChat.models.Rooms.find({                                                                            //
        name: room.name,                                                                                               //
        _id: {                                                                                                         //
          $ne: room._id                                                                                                //
        }                                                                                                              //
      }).forEach(function(item) {                                                                                      //
        var name;                                                                                                      // 23
        name = room.name + '-' + Random.id(2).toLowerCase();                                                           //
        RocketChat.models.Rooms.setNameById(item._id, name);                                                           //
        return RocketChat.models.Subscriptions.update({                                                                //
          rid: item._id                                                                                                //
        }, {                                                                                                           //
          $set: {                                                                                                      //
            name: name                                                                                                 //
          }                                                                                                            //
        }, {                                                                                                           //
          multi: true                                                                                                  //
        });                                                                                                            //
      });                                                                                                              //
    });                                                                                                                //
    return console.log('End');                                                                                         //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v005.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v005.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                                                                            // 1
  version: 5,                                                                                                          //
  up: function() {                                                                                                     //
    console.log('Dropping test rooms with less than 2 messages');                                                      //
    RocketChat.models.Rooms.find({                                                                                     //
      msgs: {                                                                                                          //
        '$lt': 2                                                                                                       //
      }                                                                                                                //
    }).forEach(function(room) {                                                                                        //
      console.log('Dropped: ', room.name);                                                                             //
      RocketChat.models.Rooms.removeById(room._id);                                                                    //
      RocketChat.models.Messages.removeByRoomId(room._id);                                                             //
      return RocketChat.models.Subscriptions.removeByRoomId(room._id);                                                 //
    });                                                                                                                //
    console.log('Dropping test rooms with less than 2 user');                                                          //
    RocketChat.models.Rooms.find({                                                                                     //
      usernames: {                                                                                                     //
        '$size': 1                                                                                                     //
      }                                                                                                                //
    }).forEach(function(room) {                                                                                        //
      console.log('Dropped: ', room.name);                                                                             //
      RocketChat.models.Rooms.removeById(room._id);                                                                    //
      RocketChat.models.Messages.removeByRoomId(room._id);                                                             //
      return RocketChat.models.Subscriptions.removeByRoomId(room._id);                                                 //
    });                                                                                                                //
    console.log('Adding username to all users');                                                                       //
    RocketChat.models.Users.find({                                                                                     //
      'username': {                                                                                                    //
        '$exists': 0                                                                                                   //
      },                                                                                                               //
      'emails': {                                                                                                      //
        '$exists': 1                                                                                                   //
      }                                                                                                                //
    }).forEach(function(user) {                                                                                        //
      var newUserName;                                                                                                 // 23
      newUserName = user.emails[0].address.split("@")[0];                                                              //
      if (RocketChat.models.Users.findOneByUsername(newUserName)) {                                                    //
        newUserName = newUserName + Math.floor((Math.random() * 10) + 1);                                              //
        if (RocketChat.models.Users.findOneByUsername(newUserName)) {                                                  //
          newUserName = newUserName + Math.floor((Math.random() * 10) + 1);                                            //
          if (RocketChat.models.Users.findOneByUsername(newUserName)) {                                                //
            newUserName = newUserName + Math.floor((Math.random() * 10) + 1);                                          //
          }                                                                                                            //
        }                                                                                                              //
      }                                                                                                                //
      console.log('Adding: username ' + newUserName + ' to all user ' + user._id);                                     //
      return RocketChat.models.Users.setUsername(user._id, newUserName);                                               //
    });                                                                                                                //
    console.log('Fixing _id of direct messages rooms');                                                                //
    RocketChat.models.Rooms.findByType('d').forEach(function(room) {                                                   //
      var id0, id1, ids, newId;                                                                                        // 36
      newId = '';                                                                                                      //
      id0 = RocketChat.models.Users.findOneByUsername(room.usernames[0])._id;                                          //
      id1 = RocketChat.models.Users.findOneByUsername(room.usernames[1])._id;                                          //
      ids = [id0, id1];                                                                                                //
      newId = ids.sort().join('');                                                                                     //
      if (newId !== room._id) {                                                                                        //
        console.log('Fixing: _id ' + room._id + ' to ' + newId);                                                       //
        RocketChat.models.Subscriptions.update({                                                                       //
          'rid': room._id                                                                                              //
        }, {                                                                                                           //
          '$set': {                                                                                                    //
            'rid': newId                                                                                               //
          }                                                                                                            //
        }, {                                                                                                           //
          'multi': 1                                                                                                   //
        });                                                                                                            //
        RocketChat.models.Messages.update({                                                                            //
          'rid': room._id                                                                                              //
        }, {                                                                                                           //
          '$set': {                                                                                                    //
            'rid': newId                                                                                               //
          }                                                                                                            //
        }, {                                                                                                           //
          'multi': 1                                                                                                   //
        });                                                                                                            //
        RocketChat.models.Rooms.removeById(room._id);                                                                  //
        room._id = newId;                                                                                              //
        RocketChat.models.Rooms.insert(room);                                                                          //
      }                                                                                                                //
      RocketChat.models.Subscriptions.update({                                                                         //
        'rid': room._id,                                                                                               //
        'u._id': id0                                                                                                   //
      }, {                                                                                                             //
        '$set': {                                                                                                      //
          'name': room.usernames[1]                                                                                    //
        }                                                                                                              //
      });                                                                                                              //
      return RocketChat.models.Subscriptions.update({                                                                  //
        'rid': room._id,                                                                                               //
        'u._id': id1                                                                                                   //
      }, {                                                                                                             //
        '$set': {                                                                                                      //
          'name': room.usernames[0]                                                                                    //
        }                                                                                                              //
      });                                                                                                              //
    });                                                                                                                //
    console.log('Adding u.username to all documents');                                                                 //
    RocketChat.models.Users.find({}, {                                                                                 //
      'username': 1                                                                                                    //
    }).forEach(function(user) {                                                                                        //
      console.log('Adding: u.username ' + user.username + ' to all document');                                         //
      RocketChat.models.Rooms.update({                                                                                 //
        'u._id': user._id                                                                                              //
      }, {                                                                                                             //
        '$set': {                                                                                                      //
          'u.username': user.username                                                                                  //
        }                                                                                                              //
      }, {                                                                                                             //
        'multi': 1                                                                                                     //
      });                                                                                                              //
      RocketChat.models.Subscriptions.update({                                                                         //
        'u._id': user._id                                                                                              //
      }, {                                                                                                             //
        '$set': {                                                                                                      //
          'u.username': user.username                                                                                  //
        }                                                                                                              //
      }, {                                                                                                             //
        'multi': 1                                                                                                     //
      });                                                                                                              //
      RocketChat.models.Messages.update({                                                                              //
        'u._id': user._id                                                                                              //
      }, {                                                                                                             //
        '$set': {                                                                                                      //
          'u.username': user.username                                                                                  //
        }                                                                                                              //
      }, {                                                                                                             //
        'multi': 1                                                                                                     //
      });                                                                                                              //
      RocketChat.models.Messages.update({                                                                              //
        'uid': user._id                                                                                                //
      }, {                                                                                                             //
        '$set': {                                                                                                      //
          'u': user                                                                                                    //
        }                                                                                                              //
      }, {                                                                                                             //
        'multi': 1                                                                                                     //
      });                                                                                                              //
      RocketChat.models.Messages.update({                                                                              //
        'by': user._id                                                                                                 //
      }, {                                                                                                             //
        '$set': {                                                                                                      //
          'u': user                                                                                                    //
        }                                                                                                              //
      }, {                                                                                                             //
        'multi': 1                                                                                                     //
      });                                                                                                              //
      return RocketChat.models.Messages.update({                                                                       //
        'uid': {                                                                                                       //
          '$exists': 1                                                                                                 //
        }                                                                                                              //
      }, {                                                                                                             //
        '$unset': {                                                                                                    //
          'uid': 1,                                                                                                    //
          'by': 1                                                                                                      //
        }                                                                                                              //
      }, {                                                                                                             //
        'multi': 1                                                                                                     //
      });                                                                                                              //
    });                                                                                                                //
    return console.log('End');                                                                                         //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v006.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v006.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                                                                            // 1
  version: 6,                                                                                                          //
  up: function() {                                                                                                     //
    var room;                                                                                                          // 5
    console.log('Changin _id of #general channel room from XXX to GENERAL');                                           //
    room = RocketChat.models.Rooms.findOneByName('general');                                                           //
    if ((room != null ? room._id : void 0) === !'GENERAL') {                                                           //
      RocketChat.models.Subscriptions.update({                                                                         //
        'rid': room._id                                                                                                //
      }, {                                                                                                             //
        '$set': {                                                                                                      //
          'rid': 'GENERAL'                                                                                             //
        }                                                                                                              //
      }, {                                                                                                             //
        'multi': 1                                                                                                     //
      });                                                                                                              //
      RocketChat.models.Messages.update({                                                                              //
        'rid': room._id                                                                                                //
      }, {                                                                                                             //
        '$set': {                                                                                                      //
          'rid': 'GENERAL'                                                                                             //
        }                                                                                                              //
      }, {                                                                                                             //
        'multi': 1                                                                                                     //
      });                                                                                                              //
      RocketChat.models.Rooms.removeById(room._id);                                                                    //
      delete room._id;                                                                                                 //
      RocketChat.models.Rooms.upsert({                                                                                 //
        '_id': 'GENERAL'                                                                                               //
      }, {                                                                                                             //
        $set: room                                                                                                     //
      });                                                                                                              //
    }                                                                                                                  //
    return console.log('End');                                                                                         //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v007.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v007.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                                                                            // 1
  version: 7,                                                                                                          //
  up: function() {                                                                                                     //
    var count, query;                                                                                                  // 5
    console.log('Populate urls in messages');                                                                          //
    query = RocketChat.models.Messages.find({                                                                          //
      'urls.0': {                                                                                                      //
        $exists: true                                                                                                  //
      }                                                                                                                //
    });                                                                                                                //
    count = query.count();                                                                                             //
    query.forEach(function(message, index) {                                                                           //
      console.log((index + 1) + " / " + count);                                                                        //
      message.urls = message.urls.map(function(url) {                                                                  //
        if (_.isString(url)) {                                                                                         //
          return {                                                                                                     // 13
            url: url                                                                                                   //
          };                                                                                                           //
        }                                                                                                              //
        return url;                                                                                                    // 14
      });                                                                                                              //
      return OEmbed.RocketUrlParser(message);                                                                          //
    });                                                                                                                //
    return console.log('End');                                                                                         //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v008.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v008.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                                                                            // 1
  version: 8,                                                                                                          //
  up: function() {                                                                                                     //
    var ref, ref1, ref2, ref3, ref4, settings;                                                                         // 4
    console.log('Load old settings record');                                                                           //
    settings = RocketChat.models.Settings.findOne({                                                                    //
      _id: 'settings'                                                                                                  //
    });                                                                                                                //
    if (settings) {                                                                                                    //
      if (settings.CDN_PREFIX != null) {                                                                               //
        RocketChat.models.Settings.insert({                                                                            //
          _id: 'CDN_PREFIX',                                                                                           //
          value: settings.CDN_PREFIX,                                                                                  //
          type: 'string',                                                                                              //
          group: 'General'                                                                                             //
        });                                                                                                            //
      }                                                                                                                //
      if (((ref = settings.ENV) != null ? ref.MAIL_URL : void 0) != null) {                                            //
        RocketChat.models.Settings.insert({                                                                            //
          _id: 'MAIL_URL',                                                                                             //
          value: settings.ENV.MAIL_URL,                                                                                //
          type: 'string',                                                                                              //
          group: 'SMTP'                                                                                                //
        });                                                                                                            //
      }                                                                                                                //
      if (settings.denyUnverifiedEmails != null) {                                                                     //
        RocketChat.models.Settings.insert({                                                                            //
          _id: 'Accounts_denyUnverifiedEmails',                                                                        //
          value: settings.denyUnverifiedEmails,                                                                        //
          type: 'boolean',                                                                                             //
          group: 'Accounts'                                                                                            //
        });                                                                                                            //
      }                                                                                                                //
      if (((ref1 = settings["public"]) != null ? (ref2 = ref1.avatarStore) != null ? ref2.type : void 0 : void 0) != null) {
        RocketChat.models.Settings.insert({                                                                            //
          _id: 'avatarStore_type',                                                                                     //
          value: settings["public"].avatarStore.type,                                                                  //
          type: 'string',                                                                                              //
          group: 'API'                                                                                                 //
        });                                                                                                            //
      }                                                                                                                //
      if (((ref3 = settings["public"]) != null ? (ref4 = ref3.avatarStore) != null ? ref4.path : void 0 : void 0) != null) {
        RocketChat.models.Settings.insert({                                                                            //
          _id: 'avatarStore_path',                                                                                     //
          value: settings["public"].avatarStore.path,                                                                  //
          type: 'string',                                                                                              //
          group: 'API'                                                                                                 //
        });                                                                                                            //
      }                                                                                                                //
      return RocketChat.models.Settings.remove({                                                                       //
        _id: 'settings'                                                                                                //
      });                                                                                                              //
    }                                                                                                                  //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v009.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v009.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                                                                            // 1
  version: 9,                                                                                                          //
  up: function() {                                                                                                     //
    var toMigrate;                                                                                                     // 7
    toMigrate = [                                                                                                      //
      {                                                                                                                //
        source: new Meteor.Collection('data.ChatRoom'),                                                                //
        target: RocketChat.models.Rooms.model                                                                          //
      }, {                                                                                                             //
        source: new Meteor.Collection('data.ChatSubscription'),                                                        //
        target: RocketChat.models.Subscriptions.model                                                                  //
      }, {                                                                                                             //
        source: new Meteor.Collection('data.ChatMessage'),                                                             //
        target: RocketChat.models.Messages.model                                                                       //
      }, {                                                                                                             //
        source: new Meteor.Collection('settings'),                                                                     //
        target: Settings                                                                                               //
      }, {                                                                                                             //
        source: new Meteor.Collection('oembed_cache'),                                                                 //
        target: OEmbed.cache                                                                                           //
      }                                                                                                                //
    ];                                                                                                                 //
    return toMigrate.forEach(function(collection) {                                                                    //
      var rawSource, source, target;                                                                                   // 32
      source = collection.source;                                                                                      //
      target = collection.target;                                                                                      //
      console.log('Migrating data from: ' + source.rawCollection().collectionName + ' to: ' + target.rawCollection().collectionName);
      source.find().forEach(function(doc) {                                                                            //
        return target.upsert({                                                                                         //
          _id: doc._id                                                                                                 //
        }, doc);                                                                                                       //
      });                                                                                                              //
      rawSource = source.rawCollection();                                                                              //
      return Meteor.wrapAsync(rawSource.drop, rawSource)(function(err, res) {                                          //
        if (err) {                                                                                                     //
          return console.log('Error dropping ' + rawSource.collectionName + ' collection due to: ' + err.errmsg);      //
        }                                                                                                              //
      });                                                                                                              //
    });                                                                                                                //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v010.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v010.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                                                                            // 1
  version: 10,                                                                                                         //
  up: function() {                                                                                                     //
                                                                                                                       //
    /*                                                                                                                 // 4
    		 * Remove duplicated usernames from rooms                                                                        //
     */                                                                                                                //
    var count;                                                                                                         // 4
    count = 0;                                                                                                         //
    RocketChat.models.Rooms.find({                                                                                     //
      'usernames.0': {                                                                                                 //
        $exists: true                                                                                                  //
      }                                                                                                                //
    }, {                                                                                                               //
      fields: {                                                                                                        //
        usernames: 1                                                                                                   //
      }                                                                                                                //
    }).forEach(function(room) {                                                                                        //
      var newUsernames;                                                                                                // 10
      newUsernames = _.uniq(room.usernames);                                                                           //
      if (newUsernames.length !== room.usernames.length) {                                                             //
        count++;                                                                                                       //
        return RocketChat.models.Rooms.update({                                                                        //
          _id: room._id                                                                                                //
        }, {                                                                                                           //
          $set: {                                                                                                      //
            usernames: newUsernames                                                                                    //
          }                                                                                                            //
        });                                                                                                            //
      }                                                                                                                //
    });                                                                                                                //
    return console.log("Removed duplicated usernames from " + count + " rooms");                                       //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v011.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v011.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                                                                            // 1
  version: 11,                                                                                                         //
  up: function() {                                                                                                     //
                                                                                                                       //
    /*                                                                                                                 // 4
    		 * Set GENERAL room to be default                                                                                //
     */                                                                                                                //
    RocketChat.models.Rooms.update({                                                                                   //
      _id: 'GENERAL'                                                                                                   //
    }, {                                                                                                               //
      $set: {                                                                                                          //
        "default": true                                                                                                //
      }                                                                                                                //
    });                                                                                                                //
    return console.log("Set GENERAL room to be default");                                                              //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v012.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v012.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                                                                            // 1
  version: 12,                                                                                                         //
  up: function() {                                                                                                     //
    var admin, oldestUser;                                                                                             // 5
    admin = RocketChat.models.Users.findOneAdmin(true, {                                                               //
      fields: {                                                                                                        //
        _id: 1                                                                                                         //
      }                                                                                                                //
    });                                                                                                                //
    if (!admin) {                                                                                                      //
      oldestUser = RocketChat.models.Users.findOne({}, {                                                               //
        fields: {                                                                                                      //
          username: 1                                                                                                  //
        },                                                                                                             //
        sort: {                                                                                                        //
          createdAt: 1                                                                                                 //
        }                                                                                                              //
      });                                                                                                              //
      if (oldestUser) {                                                                                                //
        Meteor.users.update({                                                                                          //
          _id: oldestUser._id                                                                                          //
        }, {                                                                                                           //
          $set: {                                                                                                      //
            admin: true                                                                                                //
          }                                                                                                            //
        });                                                                                                            //
        return console.log("Set " + oldestUser.username + " as admin for being the oldest user");                      //
      }                                                                                                                //
    }                                                                                                                  //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v013.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v013.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                                                                            // 1
  version: 13,                                                                                                         //
  up: function() {                                                                                                     //
    RocketChat.models.Users.setAllUsersActive(true);                                                                   //
    return console.log("Set all users as active");                                                                     //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v014.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v014.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                                                                            // 1
  version: 14,                                                                                                         //
  up: function() {                                                                                                     //
    var i, len, metaKeys, newValue, oldAndNew, oldValue, ref, ref1;                                                    // 5
    RocketChat.models.Settings.remove({                                                                                //
      _id: "API_Piwik_URL"                                                                                             //
    });                                                                                                                //
    RocketChat.models.Settings.remove({                                                                                //
      _id: "API_Piwik_ID"                                                                                              //
    });                                                                                                                //
    RocketChat.models.Settings.remove({                                                                                //
      _id: "Message_Edit"                                                                                              //
    });                                                                                                                //
    RocketChat.models.Settings.remove({                                                                                //
      _id: "Message_Delete"                                                                                            //
    });                                                                                                                //
    RocketChat.models.Settings.remove({                                                                                //
      _id: "Message_KeepStatusHistory"                                                                                 //
    });                                                                                                                //
    RocketChat.models.Settings.update({                                                                                //
      _id: "Message_ShowEditedStatus"                                                                                  //
    }, {                                                                                                               //
      $set: {                                                                                                          //
        type: "boolean",                                                                                               //
        value: true                                                                                                    //
      }                                                                                                                //
    });                                                                                                                //
    RocketChat.models.Settings.update({                                                                                //
      _id: "Message_ShowDeletedStatus"                                                                                 //
    }, {                                                                                                               //
      $set: {                                                                                                          //
        type: "boolean",                                                                                               //
        value: false                                                                                                   //
      }                                                                                                                //
    });                                                                                                                //
    metaKeys = [                                                                                                       //
      {                                                                                                                //
        'old': 'Meta:language',                                                                                        //
        'new': 'Meta_language'                                                                                         //
      }, {                                                                                                             //
        'old': 'Meta:fb:app_id',                                                                                       //
        'new': 'Meta_fb_app_id'                                                                                        //
      }, {                                                                                                             //
        'old': 'Meta:robots',                                                                                          //
        'new': 'Meta_robots'                                                                                           //
      }, {                                                                                                             //
        'old': 'Meta:google-site-verification',                                                                        //
        'new': 'Meta_google-site-verification'                                                                         //
      }, {                                                                                                             //
        'old': 'Meta:msvalidate.01',                                                                                   //
        'new': 'Meta_msvalidate01'                                                                                     //
      }                                                                                                                //
    ];                                                                                                                 //
    for (i = 0, len = metaKeys.length; i < len; i++) {                                                                 // 32
      oldAndNew = metaKeys[i];                                                                                         //
      oldValue = (ref = RocketChat.models.Settings.findOne({                                                           //
        _id: oldAndNew.old                                                                                             //
      })) != null ? ref.value : void 0;                                                                                //
      newValue = (ref1 = RocketChat.models.Settings.findOne({                                                          //
        _id: oldAndNew["new"]                                                                                          //
      })) != null ? ref1.value : void 0;                                                                               //
      if ((oldValue != null) && (newValue == null)) {                                                                  //
        RocketChat.models.Settings.update({                                                                            //
          _id: oldAndNew["new"]                                                                                        //
        }, {                                                                                                           //
          $set: {                                                                                                      //
            value: newValue                                                                                            //
          }                                                                                                            //
        });                                                                                                            //
      }                                                                                                                //
      RocketChat.models.Settings.remove({                                                                              //
        _id: oldAndNew.old                                                                                             //
      });                                                                                                              //
    }                                                                                                                  // 32
    return RocketChat.models.Settings.remove({                                                                         //
      _id: "SMTP_Security"                                                                                             //
    });                                                                                                                //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v015.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v015.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                                                                            // 1
  version: 15,                                                                                                         //
  up: function() {                                                                                                     //
    var newChunkCollection, newFilesCollection, newGridFSCollection, oldChunkCollection, oldFilesCollection, oldGridFSCollection;
    console.log('Starting file migration');                                                                            //
    oldFilesCollection = new Meteor.Collection('cfs.Files.filerecord');                                                //
    oldGridFSCollection = new Meteor.Collection('cfs_gridfs.files.files');                                             //
    oldChunkCollection = new Meteor.Collection('cfs_gridfs.files.chunks');                                             //
    newFilesCollection = RocketChat.models.Uploads;                                                                    //
    newGridFSCollection = new Meteor.Collection('rocketchat_uploads.files');                                           //
    newChunkCollection = new Meteor.Collection('rocketchat_uploads.chunks');                                           //
    oldFilesCollection.find({                                                                                          //
      'copies.files.key': {                                                                                            //
        $exists: true                                                                                                  //
      }                                                                                                                //
    }).forEach(function(cfsRecord) {                                                                                   //
      var extension, nameParts, oldGridFsFile, record, ref, url;                                                       // 16
      nameParts = (ref = cfsRecord.original.name) != null ? ref.split('.') : void 0;                                   //
      extension = '';                                                                                                  //
      url = "ufs/rocketchat_uploads/" + cfsRecord._id;                                                                 //
      console.log('migrating file', url);                                                                              //
      if ((nameParts != null ? nameParts.length : void 0) > 1) {                                                       //
        extension = nameParts.pop();                                                                                   //
        url = url + '.' + extension;                                                                                   //
      }                                                                                                                //
      record = {                                                                                                       //
        _id: cfsRecord._id,                                                                                            //
        name: cfsRecord.original.name || '',                                                                           //
        size: cfsRecord.original.size,                                                                                 //
        type: cfsRecord.original.type,                                                                                 //
        complete: true,                                                                                                //
        uploading: false,                                                                                              //
        store: "rocketchat_uploads",                                                                                   //
        extension: extension,                                                                                          //
        userId: cfsRecord.userId,                                                                                      //
        uploadedAt: cfsRecord.updatedAt,                                                                               //
        url: Meteor.absoluteUrl() + url                                                                                //
      };                                                                                                               //
      newFilesCollection.insert(record);                                                                               //
      oldGridFsFile = oldGridFSCollection.findOne({                                                                    //
        _id: new Meteor.Collection.ObjectID(cfsRecord.copies.files.key)                                                //
      });                                                                                                              //
      newGridFSCollection.insert({                                                                                     //
        _id: cfsRecord._id,                                                                                            //
        filename: cfsRecord._id,                                                                                       //
        contentType: oldGridFsFile.contentType,                                                                        //
        length: oldGridFsFile.length,                                                                                  //
        chunkSize: oldGridFsFile.chunkSize,                                                                            //
        uploadDate: oldGridFsFile.uploadDate,                                                                          //
        aliases: null,                                                                                                 //
        metadata: null,                                                                                                //
        md5: oldGridFsFile.md5                                                                                         //
      });                                                                                                              //
      oldChunkCollection.find({                                                                                        //
        files_id: new Meteor.Collection.ObjectID(cfsRecord.copies.files.key)                                           //
      }).forEach(function(oldChunk) {                                                                                  //
        return newChunkCollection.insert({                                                                             //
          _id: oldChunk._id,                                                                                           //
          files_id: cfsRecord._id,                                                                                     //
          n: oldChunk.n,                                                                                               //
          data: oldChunk.data                                                                                          //
        });                                                                                                            //
      });                                                                                                              //
      RocketChat.models.Messages.find({                                                                                //
        $or: [                                                                                                         //
          {                                                                                                            //
            'urls.url': "https://demo.rocket.chat/cfs/files/Files/" + cfsRecord._id                                    //
          }, {                                                                                                         //
            'urls.url': "https://rocket.chat/cfs/files/Files/" + cfsRecord._id                                         //
          }                                                                                                            //
        ]                                                                                                              //
      }).forEach(function(message) {                                                                                   //
        var i, len, ref1, ref2, urlsItem;                                                                              // 62
        ref1 = message.urls;                                                                                           // 62
        for (i = 0, len = ref1.length; i < len; i++) {                                                                 // 62
          urlsItem = ref1[i];                                                                                          //
          if (urlsItem.url === ("https://demo.rocket.chat/cfs/files/Files/" + cfsRecord._id) || urlsItem.url === ("https://rocket.chat/cfs/files/Files/" + cfsRecord._id)) {
            urlsItem.url = Meteor.absoluteUrl() + url;                                                                 //
            if (((ref2 = urlsItem.parsedUrl) != null ? ref2.pathname : void 0) != null) {                              //
              urlsItem.parsedUrl.pathname = "/" + url;                                                                 //
            }                                                                                                          //
            message.msg = message.msg.replace("https://demo.rocket.chat/cfs/files/Files/" + cfsRecord._id, Meteor.absoluteUrl() + url);
            message.msg = message.msg.replace("https://rocket.chat/cfs/files/Files/" + cfsRecord._id, Meteor.absoluteUrl() + url);
          }                                                                                                            //
        }                                                                                                              // 62
        return RocketChat.models.Messages.update({                                                                     //
          _id: message._id                                                                                             //
        }, {                                                                                                           //
          $set: {                                                                                                      //
            urls: message.urls,                                                                                        //
            msg: message.msg                                                                                           //
          }                                                                                                            //
        });                                                                                                            //
      });                                                                                                              //
      oldFilesCollection.remove({                                                                                      //
        _id: cfsRecord._id                                                                                             //
      });                                                                                                              //
      oldGridFSCollection.remove({                                                                                     //
        _id: oldGridFsFile._id                                                                                         //
      });                                                                                                              //
      return oldChunkCollection.remove({                                                                               //
        files_id: new Meteor.Collection.ObjectID(cfsRecord.copies.files.key)                                           //
      });                                                                                                              //
    });                                                                                                                //
    return console.log('End of file migration');                                                                       //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v016.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v016.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                                                                            // 1
  version: 16,                                                                                                         //
  up: function() {                                                                                                     //
    return RocketChat.models.Messages.tryDropIndex({                                                                   //
      _hidden: 1                                                                                                       //
    });                                                                                                                //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v017.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v017.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                                                                            // 1
  version: 17,                                                                                                         //
  up: function() {                                                                                                     //
    return RocketChat.models.Messages.tryDropIndex({                                                                   //
      _hidden: 1                                                                                                       //
    });                                                                                                                //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v018.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v018.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                                                                            // 1
  version: 18,                                                                                                         //
  up: function() {                                                                                                     //
    var changes, from, record, to;                                                                                     // 4
    changes = {                                                                                                        //
      Accounts_Facebook: 'Accounts_OAuth_Facebook',                                                                    //
      Accounts_Facebook_id: 'Accounts_OAuth_Facebook_id',                                                              //
      Accounts_Facebook_secret: 'Accounts_OAuth_Facebook_secret',                                                      //
      Accounts_Google: 'Accounts_OAuth_Google',                                                                        //
      Accounts_Google_id: 'Accounts_OAuth_Google_id',                                                                  //
      Accounts_Google_secret: 'Accounts_OAuth_Google_secret',                                                          //
      Accounts_Github: 'Accounts_OAuth_Github',                                                                        //
      Accounts_Github_id: 'Accounts_OAuth_Github_id',                                                                  //
      Accounts_Github_secret: 'Accounts_OAuth_Github_secret',                                                          //
      Accounts_Gitlab: 'Accounts_OAuth_Gitlab',                                                                        //
      Accounts_Gitlab_id: 'Accounts_OAuth_Gitlab_id',                                                                  //
      Accounts_Gitlab_secret: 'Accounts_OAuth_Gitlab_secret',                                                          //
      Accounts_Linkedin: 'Accounts_OAuth_Linkedin',                                                                    //
      Accounts_Linkedin_id: 'Accounts_OAuth_Linkedin_id',                                                              //
      Accounts_Linkedin_secret: 'Accounts_OAuth_Linkedin_secret',                                                      //
      Accounts_Meteor: 'Accounts_OAuth_Meteor',                                                                        //
      Accounts_Meteor_id: 'Accounts_OAuth_Meteor_id',                                                                  //
      Accounts_Meteor_secret: 'Accounts_OAuth_Meteor_secret',                                                          //
      Accounts_Twitter: 'Accounts_OAuth_Twitter',                                                                      //
      Accounts_Twitter_id: 'Accounts_OAuth_Twitter_id',                                                                //
      Accounts_Twitter_secret: 'Accounts_OAuth_Twitter_secret'                                                         //
    };                                                                                                                 //
    for (from in changes) {                                                                                            // 27
      to = changes[from];                                                                                              //
      record = RocketChat.models.Settings.findOne({                                                                    //
        _id: from                                                                                                      //
      });                                                                                                              //
      if (record != null) {                                                                                            //
        delete record._id;                                                                                             //
        RocketChat.models.Settings.upsert({                                                                            //
          _id: to                                                                                                      //
        }, record);                                                                                                    //
      }                                                                                                                //
      RocketChat.models.Settings.remove({                                                                              //
        _id: from                                                                                                      //
      });                                                                                                              //
    }                                                                                                                  // 27
    return ServiceConfiguration.configurations.remove({});                                                             //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v019.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v019.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                                                                            // 1
  version: 19,                                                                                                         //
  up: function() {                                                                                                     //
                                                                                                                       //
    /*                                                                                                                 // 4
    		 * Migrate existing admin users to Role based admin functionality                                                //
    		 * 'admin' role applies to global scope                                                                          //
     */                                                                                                                //
    var admins, rooms, usernames, users;                                                                               // 4
    admins = Meteor.users.find({                                                                                       //
      admin: true                                                                                                      //
    }, {                                                                                                               //
      fields: {                                                                                                        //
        _id: 1,                                                                                                        //
        username: 1                                                                                                    //
      }                                                                                                                //
    }).fetch();                                                                                                        //
    RocketChat.authz.addUsersToRoles(_.pluck(admins, '_id'), ['admin']);                                               //
    Meteor.users.update({}, {                                                                                          //
      $unset: {                                                                                                        //
        admin: ''                                                                                                      //
      }                                                                                                                //
    }, {                                                                                                               //
      multi: true                                                                                                      //
    });                                                                                                                //
    usernames = _.pluck(admins, 'username').join(', ');                                                                //
    console.log(("Migrate " + usernames + " from admin field to 'admin' role").green);                                 //
    users = Meteor.users.find().fetch();                                                                               //
    RocketChat.authz.addUsersToRoles(_.pluck(users, '_id'), ['user']);                                                 //
    usernames = _.pluck(users, 'username').join(', ');                                                                 //
    console.log(("Add " + usernames + " to 'user' role").green);                                                       //
    rooms = RocketChat.models.Rooms.findByTypes(['c', 'p']).fetch();                                                   //
    return _.each(rooms, function(room) {                                                                              //
      var creator, ref;                                                                                                // 23
      creator = room != null ? (ref = room.u) != null ? ref._id : void 0 : void 0;                                     //
      if (creator) {                                                                                                   //
        if (Meteor.users.findOne({                                                                                     //
          _id: creator                                                                                                 //
        })) {                                                                                                          //
          return RocketChat.authz.addUsersToRoles(creator, ['moderator'], room._id);                                   //
        } else {                                                                                                       //
          RocketChat.models.Subscriptions.removeByRoomId(room._id);                                                    //
          RocketChat.models.Messages.removeByRoomId(room._id);                                                         //
          return RocketChat.models.Rooms.removeById(room._id);                                                         //
        }                                                                                                              //
      }                                                                                                                //
    });                                                                                                                //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v020.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v020.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                                                                            //
  version: 20,                                                                                                         //
  up: function () {                                                                                                    //
    function up() {                                                                                                    //
                                                                                                                       //
      /*                                                                                                               //
      		 * Migrate existing `rocketchat_uploads` documents to include the room Id                                      //
      		 * where the file was uploaded to. The room Id is retrieved from the message                                   //
      		 * document created after the file upload.                                                                     //
       */                                                                                                              //
      var cursorFileMessages, msgOptions, msgQuery;                                                                    //
      msgQuery = {                                                                                                     //
        rid: {                                                                                                         //
          $exists: true                                                                                                //
        },                                                                                                             //
        'file._id': {                                                                                                  //
          $exists: true                                                                                                //
        }                                                                                                              //
      };                                                                                                               //
      msgOptions = {                                                                                                   //
        fields: {                                                                                                      //
          _id: 1,                                                                                                      //
          rid: 1,                                                                                                      //
          'file._id': 1                                                                                                //
        }                                                                                                              //
      };                                                                                                               //
      cursorFileMessages = RocketChat.models.Messages.find(msgQuery, msgOptions);                                      //
      if (!cursorFileMessages.count()) {                                                                               //
        return;                                                                                                        //
      }                                                                                                                //
      _.each(cursorFileMessages.fetch(), function (msg) {                                                              //
        var ref;                                                                                                       //
        return RocketChat.models.Uploads.update({                                                                      //
          _id: msg != null ? (ref = msg.file) != null ? ref._id : void 0 : void 0                                      //
        }, {                                                                                                           //
          $set: {                                                                                                      //
            rid: msg.rid                                                                                               //
          }                                                                                                            //
        }, {                                                                                                           //
          $multi: true                                                                                                 //
        });                                                                                                            //
      });                                                                                                              //
      return console.log('Updated rocketchat_uploads documents to include the room Id in which they were sent.');      //
    }                                                                                                                  //
                                                                                                                       //
    return up;                                                                                                         //
  }()                                                                                                                  //
});                                                                                                                    //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v021.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v021.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                                                                            // 1
  version: 21,                                                                                                         //
  up: function() {                                                                                                     //
                                                                                                                       //
    /*                                                                                                                 // 4
    		 * Remove any i18nLabel from rocketchat_settings                                                                 //
    		 * They will be added again where necessary on next restart                                                      //
     */                                                                                                                //
    RocketChat.models.Settings.update({                                                                                //
      i18nLabel: {                                                                                                     //
        $exists: true                                                                                                  //
      }                                                                                                                //
    }, {                                                                                                               //
      $unset: {                                                                                                        //
        i18nLabel: 1                                                                                                   //
      }                                                                                                                //
    }, {                                                                                                               //
      multi: true                                                                                                      //
    });                                                                                                                //
    return console.log('Removed i18nLabel from Settings. New labels will be added on next restart! Please restart your server.');
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v022.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v022.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                                                                            // 1
  version: 22,                                                                                                         //
  up: function() {                                                                                                     //
                                                                                                                       //
    /*                                                                                                                 // 4
    		 * Update message edit field                                                                                     //
     */                                                                                                                //
    RocketChat.models.Messages.upgradeEtsToEditAt();                                                                   //
    return console.log('Updated old messages\' ets edited timestamp to new editedAt timestamp.');                      //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v023.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v023.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                                                                            // 1
  version: 23,                                                                                                         //
  up: function() {                                                                                                     //
    RocketChat.models.Settings.remove({                                                                                //
      _id: 'Accounts_denyUnverifiedEmails'                                                                             //
    });                                                                                                                //
    return console.log('Deleting not used setting Accounts_denyUnverifiedEmails');                                     //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v024.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v024.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                                                                            // 1
  version: 24,                                                                                                         //
  up: function() {                                                                                                     //
    return RocketChat.models.Permissions.remove({                                                                      //
      _id: 'access-rocket-permissions'                                                                                 //
    });                                                                                                                //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v025.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v025.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                                                                            // 1
  version: 25,                                                                                                         //
  up: function() {                                                                                                     //
    return RocketChat.models.Settings.update({                                                                         //
      _id: /Accounts_OAuth_Custom/                                                                                     //
    }, {                                                                                                               //
      $set: {                                                                                                          //
        persistent: true                                                                                               //
      },                                                                                                               //
      $unset: {                                                                                                        //
        hidden: true                                                                                                   //
      }                                                                                                                //
    }, {                                                                                                               //
      multi: true                                                                                                      //
    });                                                                                                                //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v026.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v026.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                                                                            // 1
  version: 26,                                                                                                         //
  up: function() {                                                                                                     //
    return RocketChat.models.Messages.update({                                                                         //
      t: 'rm'                                                                                                          //
    }, {                                                                                                               //
      $set: {                                                                                                          //
        mentions: []                                                                                                   //
      }                                                                                                                //
    }, {                                                                                                               //
      multi: true                                                                                                      //
    });                                                                                                                //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v027.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v027.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                                                                            // 1
  version: 27,                                                                                                         //
  up: function() {                                                                                                     //
    RocketChat.models.Users.update({}, {                                                                               //
      $rename: {                                                                                                       //
        roles: '_roles'                                                                                                //
      }                                                                                                                //
    }, {                                                                                                               //
      multi: true                                                                                                      //
    });                                                                                                                //
    RocketChat.models.Users.find({                                                                                     //
      _roles: {                                                                                                        //
        $exists: 1                                                                                                     //
      }                                                                                                                //
    }).forEach(function(user) {                                                                                        //
      var ref, results, roles, scope;                                                                                  // 7
      ref = user._roles;                                                                                               // 7
      results = [];                                                                                                    // 7
      for (scope in ref) {                                                                                             //
        roles = ref[scope];                                                                                            //
        results.push(RocketChat.models.Roles.addUserRoles(user._id, roles, scope));                                    //
      }                                                                                                                // 7
      return results;                                                                                                  //
    });                                                                                                                //
    return RocketChat.models.Users.update({}, {                                                                        //
      $unset: {                                                                                                        //
        _roles: 1                                                                                                      //
      }                                                                                                                //
    }, {                                                                                                               //
      multi: true                                                                                                      //
    });                                                                                                                //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v028.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v028.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                                                                            // 1
  version: 28,                                                                                                         //
  up: function() {                                                                                                     //
    return RocketChat.models.Permissions.addRole('view-c-room', 'bot');                                                //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v029.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v029.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                                                                            // 1
  version: 29,                                                                                                         //
  up: function() {                                                                                                     //
    var LDAP_Bind_Search, LDAP_DN, LDAP_TLS, LDAP_Url, ref, ref1, ref2, ref3;                                          // 4
    LDAP_Url = (ref = RocketChat.models.Settings.findOne('LDAP_Url')) != null ? ref.value : void 0;                    //
    LDAP_TLS = (ref1 = RocketChat.models.Settings.findOne('LDAP_TLS')) != null ? ref1.value : void 0;                  //
    LDAP_DN = (ref2 = RocketChat.models.Settings.findOne('LDAP_DN')) != null ? ref2.value : void 0;                    //
    LDAP_Bind_Search = (ref3 = RocketChat.models.Settings.findOne('LDAP_Bind_Search')) != null ? ref3.value : void 0;  //
    if ((LDAP_Url != null) && LDAP_Url.trim() !== '') {                                                                //
      LDAP_Url = LDAP_Url.replace(/ldaps?:\/\//i, '');                                                                 //
      RocketChat.models.Settings.upsert({                                                                              //
        _id: 'LDAP_Host'                                                                                               //
      }, {                                                                                                             //
        $set: {                                                                                                        //
          value: LDAP_Url                                                                                              //
        },                                                                                                             //
        $setOnInsert: {                                                                                                //
          createdAt: new Date                                                                                          //
        }                                                                                                              //
      });                                                                                                              //
    }                                                                                                                  //
    if (LDAP_TLS === true) {                                                                                           //
      RocketChat.models.Settings.upsert({                                                                              //
        _id: 'LDAP_Encryption'                                                                                         //
      }, {                                                                                                             //
        $set: {                                                                                                        //
          value: 'tls'                                                                                                 //
        },                                                                                                             //
        $setOnInsert: {                                                                                                //
          createdAt: new Date                                                                                          //
        }                                                                                                              //
      });                                                                                                              //
    }                                                                                                                  //
    if ((LDAP_DN != null) && LDAP_DN.trim() !== '') {                                                                  //
      RocketChat.models.Settings.upsert({                                                                              //
        _id: 'LDAP_Domain_Base'                                                                                        //
      }, {                                                                                                             //
        $set: {                                                                                                        //
          value: LDAP_DN                                                                                               //
        },                                                                                                             //
        $setOnInsert: {                                                                                                //
          createdAt: new Date                                                                                          //
        }                                                                                                              //
      });                                                                                                              //
      RocketChat.models.Settings.upsert({                                                                              //
        _id: 'LDAP_Username_Field'                                                                                     //
      }, {                                                                                                             //
        $set: {                                                                                                        //
          value: ''                                                                                                    //
        },                                                                                                             //
        $setOnInsert: {                                                                                                //
          createdAt: new Date                                                                                          //
        }                                                                                                              //
      });                                                                                                              //
      RocketChat.models.Settings.upsert({                                                                              //
        _id: 'LDAP_Unique_Identifier_Field'                                                                            //
      }, {                                                                                                             //
        $set: {                                                                                                        //
          value: ''                                                                                                    //
        },                                                                                                             //
        $setOnInsert: {                                                                                                //
          createdAt: new Date                                                                                          //
        }                                                                                                              //
      });                                                                                                              //
    }                                                                                                                  //
    if ((LDAP_Bind_Search != null) && LDAP_Bind_Search.trim() !== '') {                                                //
      RocketChat.models.Settings.upsert({                                                                              //
        _id: 'LDAP_Custom_Domain_Search'                                                                               //
      }, {                                                                                                             //
        $set: {                                                                                                        //
          value: LDAP_Bind_Search                                                                                      //
        },                                                                                                             //
        $setOnInsert: {                                                                                                //
          createdAt: new Date                                                                                          //
        }                                                                                                              //
      });                                                                                                              //
      RocketChat.models.Settings.upsert({                                                                              //
        _id: 'LDAP_Use_Custom_Domain_Search'                                                                           //
      }, {                                                                                                             //
        $set: {                                                                                                        //
          value: true                                                                                                  //
        },                                                                                                             //
        $setOnInsert: {                                                                                                //
          createdAt: new Date                                                                                          //
        }                                                                                                              //
      });                                                                                                              //
    }                                                                                                                  //
    RocketChat.models.Settings.remove({                                                                                //
      _id: 'LDAP_Url'                                                                                                  //
    });                                                                                                                //
    RocketChat.models.Settings.remove({                                                                                //
      _id: 'LDAP_TLS'                                                                                                  //
    });                                                                                                                //
    RocketChat.models.Settings.remove({                                                                                //
      _id: 'LDAP_DN'                                                                                                   //
    });                                                                                                                //
    return RocketChat.models.Settings.remove({                                                                         //
      _id: 'LDAP_Bind_Search'                                                                                          //
    });                                                                                                                //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v030.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v030.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                                                                            // 1
  version: 30,                                                                                                         //
  up: function() {                                                                                                     //
    var WebRTC_STUN_Server, WebRTC_TURN_Password, WebRTC_TURN_Server, WebRTC_TURN_Username, ref, ref1, ref2, ref3, servers;
    WebRTC_STUN_Server = (ref = RocketChat.models.Settings.findOne('WebRTC_STUN_Server')) != null ? ref.value : void 0;
    WebRTC_TURN_Server = (ref1 = RocketChat.models.Settings.findOne('WebRTC_TURN_Server')) != null ? ref1.value : void 0;
    WebRTC_TURN_Username = (ref2 = RocketChat.models.Settings.findOne('WebRTC_TURN_Username')) != null ? ref2.value : void 0;
    WebRTC_TURN_Password = (ref3 = RocketChat.models.Settings.findOne('WebRTC_TURN_Password')) != null ? ref3.value : void 0;
    RocketChat.models.Settings.remove({                                                                                //
      _id: 'WebRTC_STUN_Server'                                                                                        //
    });                                                                                                                //
    RocketChat.models.Settings.remove({                                                                                //
      _id: 'WebRTC_TURN_Server'                                                                                        //
    });                                                                                                                //
    RocketChat.models.Settings.remove({                                                                                //
      _id: 'WebRTC_TURN_Username'                                                                                      //
    });                                                                                                                //
    RocketChat.models.Settings.remove({                                                                                //
      _id: 'WebRTC_TURN_Password'                                                                                      //
    });                                                                                                                //
    if (WebRTC_STUN_Server === 'stun:stun.l.google.com:19302' && WebRTC_TURN_Server === 'turn:numb.viagenie.ca:3478' && WebRTC_TURN_Username === 'team@rocket.chat' && WebRTC_TURN_Password === 'demo') {
      return;                                                                                                          // 17
    }                                                                                                                  //
    servers = '';                                                                                                      //
    if (WebRTC_STUN_Server != null) {                                                                                  //
      servers += WebRTC_STUN_Server;                                                                                   //
    }                                                                                                                  //
    if (WebRTC_TURN_Server != null) {                                                                                  //
      servers += ', ';                                                                                                 //
      if (WebRTC_TURN_Username != null) {                                                                              //
        servers += encodeURIComponent(WebRTC_TURN_Username) + ':' + encodeURIComponent(WebRTC_TURN_Password) + '@';    //
      }                                                                                                                //
      servers += WebRTC_TURN_Server;                                                                                   //
    }                                                                                                                  //
    if (servers !== '') {                                                                                              //
      return RocketChat.models.Settings.upsert({                                                                       //
        _id: 'WebRTC_Servers'                                                                                          //
      }, {                                                                                                             //
        $set: {                                                                                                        //
          value: servers                                                                                               //
        },                                                                                                             //
        $setOnInsert: {                                                                                                //
          createdAt: new Date                                                                                          //
        }                                                                                                              //
      });                                                                                                              //
    }                                                                                                                  //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v031.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v031.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                                                                            // 1
  version: 31,                                                                                                         //
  up: function() {                                                                                                     //
    var changes, from, record, results, to;                                                                            // 4
    changes = {                                                                                                        //
      API_Analytics: 'GoogleTagManager_id'                                                                             //
    };                                                                                                                 //
    results = [];                                                                                                      // 7
    for (from in changes) {                                                                                            //
      to = changes[from];                                                                                              //
      record = RocketChat.models.Settings.findOne({                                                                    //
        _id: from                                                                                                      //
      });                                                                                                              //
      if (record != null) {                                                                                            //
        delete record._id;                                                                                             //
        RocketChat.models.Settings.upsert({                                                                            //
          _id: to                                                                                                      //
        }, record);                                                                                                    //
      }                                                                                                                //
      results.push(RocketChat.models.Settings.remove({                                                                 //
        _id: from                                                                                                      //
      }));                                                                                                             //
    }                                                                                                                  // 7
    return results;                                                                                                    //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v032.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v032.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                                                                            // 1
  version: 32,                                                                                                         //
  up: function() {                                                                                                     //
    return RocketChat.models.Settings.update({                                                                         //
      '_id': /Accounts_OAuth_Custom_/                                                                                  //
    }, {                                                                                                               //
      $set: {                                                                                                          //
        'group': 'OAuth'                                                                                               //
      }                                                                                                                //
    }, {                                                                                                               //
      multi: true                                                                                                      //
    });                                                                                                                //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v033.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v033.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                                                                            // 1
  version: 33,                                                                                                         //
  up: function() {                                                                                                     //
    var integrations, scriptAlert, update;                                                                             // 4
    scriptAlert = "/**\n * This scrit is out-of-date, convert to the new format\n * (https://github.com/RocketChat/Rocket.Chat/wiki/WebHook-Scripting)\n**/\n\n";
    integrations = RocketChat.models.Integrations.find({                                                               //
      $or: [                                                                                                           //
        {                                                                                                              //
          script: {                                                                                                    //
            $exists: false                                                                                             //
          },                                                                                                           //
          processIncomingRequestScript: {                                                                              //
            $exists: true                                                                                              //
          }                                                                                                            //
        }, {                                                                                                           //
          script: {                                                                                                    //
            $exists: false                                                                                             //
          },                                                                                                           //
          prepareOutgoingRequestScript: {                                                                              //
            $exists: true                                                                                              //
          }                                                                                                            //
        }, {                                                                                                           //
          script: {                                                                                                    //
            $exists: false                                                                                             //
          },                                                                                                           //
          processOutgoingResponseScript: {                                                                             //
            $exists: true                                                                                              //
          }                                                                                                            //
        }                                                                                                              //
      ]                                                                                                                //
    }).fetch();                                                                                                        //
    integrations.forEach(function(integration) {                                                                       //
      var script;                                                                                                      // 16
      script = '';                                                                                                     //
      if (integration.processIncomingRequestScript) {                                                                  //
        script += integration.processIncomingRequestScript + '\n\n';                                                   //
      }                                                                                                                //
      if (integration.prepareOutgoingRequestScript) {                                                                  //
        script += integration.prepareOutgoingRequestScript + '\n\n';                                                   //
      }                                                                                                                //
      if (integration.processOutgoingResponseScript) {                                                                 //
        script += integration.processOutgoingResponseScript + '\n\n';                                                  //
      }                                                                                                                //
      return RocketChat.models.Integrations.update(integration._id, {                                                  //
        $set: {                                                                                                        //
          script: scriptAlert + script.replace(/^/gm, '// ')                                                           //
        }                                                                                                              //
      });                                                                                                              //
    });                                                                                                                //
    update = {                                                                                                         //
      $unset: {                                                                                                        //
        processIncomingRequestScript: 1,                                                                               //
        prepareOutgoingRequestScript: 1,                                                                               //
        processOutgoingResponseScript: 1                                                                               //
      }                                                                                                                //
    };                                                                                                                 //
    RocketChat.models.Integrations.update({}, update, {                                                                //
      multi: true                                                                                                      //
    });                                                                                                                //
    update = {                                                                                                         //
      $set: {                                                                                                          //
        enabled: true                                                                                                  //
      }                                                                                                                //
    };                                                                                                                 //
    return RocketChat.models.Integrations.update({                                                                     //
      enabled: {                                                                                                       //
        $exists: false                                                                                                 //
      }                                                                                                                //
    }, update, {                                                                                                       //
      multi: true                                                                                                      //
    });                                                                                                                //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v034.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v034.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                                                                            // 1
  version: 34,                                                                                                         //
  up: function() {                                                                                                     //
    return RocketChat.models.Settings.update({                                                                         //
      _id: 'Layout_Login_Header',                                                                                      //
      value: '<a class="logo" href="/"><img src="/assets/logo/logo.svg?v=3" /></a>'                                    //
    }, {                                                                                                               //
      $set: {                                                                                                          //
        value: '<a class="logo" href="/"><img src="/assets/logo?v=3" /></a>'                                           //
      }                                                                                                                //
    });                                                                                                                //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v035.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v035.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                                                                            // 1
  version: 35,                                                                                                         //
  up: function() {                                                                                                     //
    return RocketChat.models.Messages.update({                                                                         //
      'file._id': {                                                                                                    //
        $exists: true                                                                                                  //
      },                                                                                                               //
      'attachments.title_link': {                                                                                      //
        $exists: true                                                                                                  //
      },                                                                                                               //
      'attachments.title_link_download': {                                                                             //
        $exists: false                                                                                                 //
      }                                                                                                                //
    }, {                                                                                                               //
      $set: {                                                                                                          //
        'attachments.$.title_link_download': true                                                                      //
      }                                                                                                                //
    }, {                                                                                                               //
      multi: true                                                                                                      //
    });                                                                                                                //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v036.coffee.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v036.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var url;                                                                                                               // 1
                                                                                                                       //
url = Npm.require('url');                                                                                              // 1
                                                                                                                       //
RocketChat.Migrations.add({                                                                                            // 2
  version: 36,                                                                                                         //
  up: function() {                                                                                                     //
    var e, loginHeader, match, requestUrl;                                                                             // 5
    loginHeader = RocketChat.models.Settings.findOne({                                                                 //
      _id: 'Layout_Login_Header'                                                                                       //
    });                                                                                                                //
    if ((loginHeader != null ? loginHeader.value : void 0) == null) {                                                  //
      return;                                                                                                          // 8
    }                                                                                                                  //
    match = loginHeader.value.match(/<img\ssrc=['"]([^'"]+)/);                                                         //
    if ((match != null) && match.length === 2) {                                                                       //
      requestUrl = match[1];                                                                                           //
      if (requestUrl[0] === '/') {                                                                                     //
        requestUrl = url.resolve(Meteor.absoluteUrl(), requestUrl);                                                    //
      }                                                                                                                //
      try {                                                                                                            // 16
        Meteor.startup(function() {                                                                                    //
          return Meteor.setTimeout(function() {                                                                        //
            var result;                                                                                                // 19
            result = HTTP.get(requestUrl, {                                                                            //
              npmRequestOptions: {                                                                                     //
                encoding: 'binary'                                                                                     //
              }                                                                                                        //
            });                                                                                                        //
            if (result.statusCode === 200) {                                                                           //
              return RocketChat.Assets.setAsset(result.content, result.headers['content-type'], 'logo');               //
            }                                                                                                          //
          }, 30000);                                                                                                   //
        });                                                                                                            //
      } catch (error) {                                                                                                //
        e = error;                                                                                                     //
        console.log(e);                                                                                                //
      }                                                                                                                //
    }                                                                                                                  //
    return RocketChat.models.Settings.remove({                                                                         //
      _id: 'Layout_Login_Header'                                                                                       //
    });                                                                                                                //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v037.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v037.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.Migrations.add({                                                                                            // 1
	version: 37,                                                                                                          // 2
	up: function () {                                                                                                     // 3
		function up() {                                                                                                      // 3
			if (RocketChat && RocketChat.models && RocketChat.models.Permissions) {                                             // 4
                                                                                                                       //
				// Find permission add-user (changed it to create-user)                                                            // 6
				var addUserPermission = RocketChat.models.Permissions.findOne('add-user');                                         // 7
                                                                                                                       //
				if (addUserPermission) {                                                                                           // 9
					RocketChat.models.Permissions.upsert({ _id: 'create-user' }, { $set: { roles: addUserPermission.roles } });       // 10
					RocketChat.models.Permissions.remove({ _id: 'add-user' });                                                        // 11
				}                                                                                                                  // 12
			}                                                                                                                   // 13
		}                                                                                                                    // 14
                                                                                                                       //
		return up;                                                                                                           // 3
	}()                                                                                                                   // 3
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v038.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v038.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.Migrations.add({                                                                                            // 1
	version: 38,                                                                                                          // 2
	up: function () {                                                                                                     // 3
		function up() {                                                                                                      // 3
			if (RocketChat && RocketChat.settings && RocketChat.settings.get) {                                                 // 4
				var allowPinning = RocketChat.settings.get('Message_AllowPinningByAnyone');                                        // 5
                                                                                                                       //
				// If public pinning was allowed, add pinning permissions to 'users', else leave it to 'owners' and 'moderators'   // 7
				if (allowPinning) {                                                                                                // 8
					if (RocketChat.models && RocketChat.models.Permissions) {                                                         // 9
						RocketChat.models.Permissions.update({ _id: 'pin-message' }, { $addToSet: { roles: 'user' } });                  // 10
					}                                                                                                                 // 11
				}                                                                                                                  // 12
			}                                                                                                                   // 13
		}                                                                                                                    // 14
                                                                                                                       //
		return up;                                                                                                           // 3
	}()                                                                                                                   // 3
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v039.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v039.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.Migrations.add({                                                                                            // 1
	version: 39,                                                                                                          // 2
	up: function () {                                                                                                     // 3
		function up() {                                                                                                      // 3
			if (RocketChat && RocketChat.models && RocketChat.models.Settings) {                                                // 4
				var footer = RocketChat.models.Settings.findOne({ _id: 'Layout_Sidenav_Footer' });                                 // 5
                                                                                                                       //
				// Replace footer octicons with icons                                                                              // 7
				if (footer && footer.value !== '') {                                                                               // 8
					var footerValue = footer.value.replace('octicon octicon-pencil', 'icon-pencil');                                  // 9
					footerValue = footerValue.replace('octicon octicon-heart', 'icon-heart');                                         // 10
					footerValue = footerValue.replace('octicon octicon-mark-github', 'icon-github-circled');                          // 11
					RocketChat.models.Settings.update({ _id: 'Layout_Sidenav_Footer' }, { $set: { value: footerValue, packageValue: footerValue } });
				}                                                                                                                  // 13
			}                                                                                                                   // 14
		}                                                                                                                    // 15
                                                                                                                       //
		return up;                                                                                                           // 3
	}()                                                                                                                   // 3
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v040.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v040.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.Migrations.add({                                                                                            // 1
	version: 40,                                                                                                          // 2
	up: function () {                                                                                                     // 3
		function up() {                                                                                                      // 3
			RocketChat.models.Settings.find({ _id: /Accounts_OAuth_Custom_/, i18nLabel: 'Accounts_OAuth_Custom_Enable' }).forEach(function (customOauth) {
				var parts = customOauth._id.split('_');                                                                            // 5
				var name = parts[3];                                                                                               // 6
				var id = 'Accounts_OAuth_Custom_' + name + '_token_sent_via';                                                      // 7
				if (!RocketChat.models.Settings.findOne({ _id: id })) {                                                            // 8
					RocketChat.models.Settings.insert({                                                                               // 9
						'_id': id,                                                                                                       // 10
						'type': 'select',                                                                                                // 11
						'group': 'OAuth',                                                                                                // 12
						'section': 'Custom OAuth: ' + name,                                                                              // 13
						'i18nLabel': 'Accounts_OAuth_Custom_Token_Sent_Via',                                                             // 14
						'persistent': true,                                                                                              // 15
						'values': [{                                                                                                     // 16
							'key': 'header',                                                                                                // 18
							'i18nLabel': 'Header'                                                                                           // 19
						}, {                                                                                                             // 17
							'key': 'payload',                                                                                               // 22
							'i18nLabel': 'Payload'                                                                                          // 23
						}],                                                                                                              // 21
						'packageValue': 'payload',                                                                                       // 26
						'valueSource': 'packageValue',                                                                                   // 27
						'ts': new Date(),                                                                                                // 28
						'hidden': false,                                                                                                 // 29
						'blocked': false,                                                                                                // 30
						'sorter': 255,                                                                                                   // 31
						'i18nDescription': 'Accounts_OAuth_Custom_' + name + '_token_sent_via_Description',                              // 32
						'createdAt': new Date(),                                                                                         // 33
						'value': 'payload'                                                                                               // 34
					});                                                                                                               // 9
				}                                                                                                                  // 36
			});                                                                                                                 // 37
		}                                                                                                                    // 38
                                                                                                                       //
		return up;                                                                                                           // 3
	}()                                                                                                                   // 3
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v041.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v041.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.Migrations.add({                                                                                            // 1
	version: 41,                                                                                                          // 2
	up: function () {                                                                                                     // 3
		function up() {                                                                                                      // 3
			if (RocketChat && RocketChat.models && RocketChat.models.Users) {                                                   // 4
				RocketChat.models.Users.update({ bot: true }, { $set: { type: 'bot' } }, { multi: true });                         // 5
				RocketChat.models.Users.update({ 'profile.guest': true }, { $set: { type: 'visitor' } }, { multi: true });         // 6
				RocketChat.models.Users.update({ type: { $exists: false } }, { $set: { type: 'user' } }, { multi: true });         // 7
			}                                                                                                                   // 8
		}                                                                                                                    // 9
                                                                                                                       //
		return up;                                                                                                           // 3
	}()                                                                                                                   // 3
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v042.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v042.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.Migrations.add({                                                                                            // 1
  version: 42,                                                                                                         //
  up: function() {                                                                                                     //
    var chunks, extension, files, from, list, oldFile, results, to;                                                    // 4
    files = RocketChat.__migration_assets_files = new Mongo.Collection('assets.files');                                //
    chunks = RocketChat.__migration_assets_chunks = new Mongo.Collection('assets.chunks');                             //
    list = {                                                                                                           //
      'favicon.ico': 'favicon_ico',                                                                                    //
      'favicon.svg': 'favicon',                                                                                        //
      'favicon_64.png': 'favicon_64',                                                                                  //
      'favicon_96.png': 'favicon_96',                                                                                  //
      'favicon_128.png': 'favicon_128',                                                                                //
      'favicon_192.png': 'favicon_192',                                                                                //
      'favicon_256.png': 'favicon_256'                                                                                 //
    };                                                                                                                 //
    results = [];                                                                                                      // 16
    for (from in list) {                                                                                               //
      to = list[from];                                                                                                 //
      if (files.findOne({                                                                                              //
        _id: to                                                                                                        //
      }) == null) {                                                                                                    //
        oldFile = files.findOne({                                                                                      //
          _id: from                                                                                                    //
        });                                                                                                            //
        if (oldFile != null) {                                                                                         //
          extension = RocketChat.Assets.mime.extension(oldFile.contentType);                                           //
          RocketChat.settings.removeById("Assets_" + from);                                                            //
          RocketChat.settings.updateById("Assets_" + to, {                                                             //
            url: "/assets/" + to + "." + extension,                                                                    //
            defaultUrl: RocketChat.Assets.assets[to].defaultUrl                                                        //
          });                                                                                                          //
          oldFile._id = to;                                                                                            //
          oldFile.filename = to;                                                                                       //
          files.insert(oldFile);                                                                                       //
          files.remove({                                                                                               //
            _id: from                                                                                                  //
          });                                                                                                          //
          results.push(chunks.update({                                                                                 //
            files_id: from                                                                                             //
          }, {                                                                                                         //
            $set: {                                                                                                    //
              files_id: to                                                                                             //
            }                                                                                                          //
          }, {                                                                                                         //
            multi: true                                                                                                //
          }));                                                                                                         //
        } else {                                                                                                       //
          results.push(void 0);                                                                                        //
        }                                                                                                              //
      } else {                                                                                                         //
        results.push(void 0);                                                                                          //
      }                                                                                                                //
    }                                                                                                                  // 16
    return results;                                                                                                    //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v043.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v043.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.Migrations.add({                                                                                            // 1
	version: 43,                                                                                                          // 2
	up: function () {                                                                                                     // 3
		function up() {                                                                                                      // 3
			if (RocketChat && RocketChat.models && RocketChat.models.Permissions) {                                             // 4
				RocketChat.models.Permissions.update({ _id: 'pin-message' }, { $addToSet: { roles: 'admin' } });                   // 5
			}                                                                                                                   // 6
		}                                                                                                                    // 7
                                                                                                                       //
		return up;                                                                                                           // 3
	}()                                                                                                                   // 3
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v044.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v044.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.Migrations.add({                                                                                            // 1
	version: 44,                                                                                                          // 2
	up: function () {                                                                                                     // 3
		function up() {                                                                                                      // 3
			if (RocketChat && RocketChat.models && RocketChat.models.Users) {                                                   // 4
				RocketChat.models.Users.find({ $or: [{ 'settings.preferences.disableNewRoomNotification': { $exists: 1 } }, { 'settings.preferences.disableNewMessageNotification': { $exists: 1 } }] }).forEach(function (user) {
					var newRoomNotification = !(user && user.settings && user.settings.preferences && user.settings.preferences.disableNewRoomNotification);
					var newMessageNotification = !(user && user.settings && user.settings.preferences && user.settings.preferences.disableNewMessageNotification);
					RocketChat.models.Users.update({ _id: user._id }, { $unset: { 'settings.preferences.disableNewRoomNotification': 1, 'settings.preferences.disableNewMessageNotification': 1 }, $set: { 'settings.preferences.newRoomNotification': newRoomNotification, 'settings.preferences.newMessageNotification': newMessageNotification } });
				});                                                                                                                // 9
			}                                                                                                                   // 10
                                                                                                                       //
			if (RocketChat && RocketChat.models && RocketChat.models.Settings) {                                                // 12
				var optOut = RocketChat.models.Settings.findOne({ _id: 'Statistics_opt_out' });                                    // 13
				if (optOut) {                                                                                                      // 14
					RocketChat.models.Settings.remove({ _id: 'Statistics_opt_out' });                                                 // 15
					RocketChat.models.Settings.upsert({ _id: 'Statistics_reporting' }, {                                              // 16
						$set: {                                                                                                          // 17
							value: !optOut.value ? true : false,                                                                            // 18
							i18nDescription: 'Statistics_reporting_Description',                                                            // 19
							packageValue: true,                                                                                             // 20
							i18nLabel: 'Statistics_reporting'                                                                               // 21
						}                                                                                                                // 17
					});                                                                                                               // 16
				}                                                                                                                  // 24
			}                                                                                                                   // 25
                                                                                                                       //
			if (RocketChat && RocketChat.models && RocketChat.models.Settings) {                                                // 27
				var favoriteRooms = RocketChat.models.Settings.findOne({ _id: 'Disable_Favorite_Rooms' });                         // 28
				if (favoriteRooms) {                                                                                               // 29
					RocketChat.models.Settings.remove({ _id: 'Disable_Favorite_Rooms' });                                             // 30
					RocketChat.models.Settings.upsert({ _id: 'Favorite_Rooms' }, {                                                    // 31
						$set: {                                                                                                          // 32
							value: !favoriteRooms.value ? true : false,                                                                     // 33
							i18nDescription: 'Favorite_Rooms_Description',                                                                  // 34
							packageValue: true,                                                                                             // 35
							i18nLabel: 'Favorite_Rooms'                                                                                     // 36
						}                                                                                                                // 32
					});                                                                                                               // 31
				}                                                                                                                  // 39
			}                                                                                                                   // 40
		}                                                                                                                    // 41
                                                                                                                       //
		return up;                                                                                                           // 3
	}()                                                                                                                   // 3
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v045.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v045.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.Migrations.add({                                                                                            // 1
	version: 45,                                                                                                          // 2
	up: function () {                                                                                                     // 3
		function up() {                                                                                                      // 3
                                                                                                                       //
			// finds the latest created visitor                                                                                 // 5
			var lastVisitor = RocketChat.models.Users.find({ type: 'visitor' }, { fields: { username: 1 }, sort: { createdAt: -1 }, limit: 1 }).fetch();
                                                                                                                       //
			if (lastVisitor && lastVisitor.length > 0) {                                                                        // 8
				var lastNumber = lastVisitor[0].username.replace(/^guest\-/, '');                                                  // 9
                                                                                                                       //
				RocketChat.settings.add('Livechat_guest_count', parseInt(lastNumber) + 1, { type: 'int', group: 'Livechat' });     // 11
			}                                                                                                                   // 12
		}                                                                                                                    // 13
                                                                                                                       //
		return up;                                                                                                           // 3
	}()                                                                                                                   // 3
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v046.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v046.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.Migrations.add({                                                                                            // 1
	version: 46,                                                                                                          // 2
	up: function () {                                                                                                     // 3
		function up() {                                                                                                      // 3
			if (RocketChat && RocketChat.models && RocketChat.models.Users) {                                                   // 4
				RocketChat.models.Users.update({ type: { $exists: false } }, { $set: { type: 'user' } }, { multi: true });         // 5
			}                                                                                                                   // 6
		}                                                                                                                    // 7
                                                                                                                       //
		return up;                                                                                                           // 3
	}()                                                                                                                   // 3
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v047.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v047.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.Migrations.add({                                                                                            // 1
	version: 47,                                                                                                          // 2
	up: function () {                                                                                                     // 3
		function up() {                                                                                                      // 3
			if (RocketChat && RocketChat.models && RocketChat.models.Settings) {                                                // 4
				var autolinkerUrls = RocketChat.models.Settings.findOne({ _id: 'AutoLinker_Urls' });                               // 5
				if (autolinkerUrls) {                                                                                              // 6
					RocketChat.models.Settings.remove({ _id: 'AutoLinker_Urls' });                                                    // 7
					RocketChat.models.Settings.upsert({ _id: 'AutoLinker_Urls_Scheme' }, {                                            // 8
						$set: {                                                                                                          // 9
							value: autolinkerUrls.value ? true : false,                                                                     // 10
							i18nLabel: 'AutoLinker_Urls_Scheme'                                                                             // 11
						}                                                                                                                // 9
					});                                                                                                               // 8
					RocketChat.models.Settings.upsert({ _id: 'AutoLinker_Urls_www' }, {                                               // 14
						$set: {                                                                                                          // 15
							value: autolinkerUrls.value ? true : false,                                                                     // 16
							i18nLabel: 'AutoLinker_Urls_www'                                                                                // 17
						}                                                                                                                // 15
					});                                                                                                               // 14
					RocketChat.models.Settings.upsert({ _id: 'AutoLinker_Urls_TLD' }, {                                               // 20
						$set: {                                                                                                          // 21
							value: autolinkerUrls.value ? true : false,                                                                     // 22
							i18nLabel: 'AutoLinker_Urls_TLD'                                                                                // 23
						}                                                                                                                // 21
					});                                                                                                               // 20
				}                                                                                                                  // 26
			}                                                                                                                   // 27
		}                                                                                                                    // 28
                                                                                                                       //
		return up;                                                                                                           // 3
	}()                                                                                                                   // 3
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v048.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v048.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.Migrations.add({                                                                                            // 1
	version: 48,                                                                                                          // 2
	up: function () {                                                                                                     // 3
		function up() {                                                                                                      // 3
			if (RocketChat && RocketChat.models && RocketChat.models.Settings) {                                                // 4
                                                                                                                       //
				var RocketBot_Enabled = RocketChat.models.Settings.findOne({                                                       // 6
					_id: 'RocketBot_Enabled'                                                                                          // 7
				});                                                                                                                // 6
				if (RocketBot_Enabled) {                                                                                           // 9
					RocketChat.models.Settings.remove({                                                                               // 10
						_id: 'RocketBot_Enabled'                                                                                         // 11
					});                                                                                                               // 10
					RocketChat.models.Settings.upsert({                                                                               // 13
						_id: 'InternalHubot_Enabled'                                                                                     // 14
					}, {                                                                                                              // 13
						$set: {                                                                                                          // 16
							value: RocketBot_Enabled.value                                                                                  // 17
						}                                                                                                                // 16
					});                                                                                                               // 15
				}                                                                                                                  // 20
                                                                                                                       //
				var RocketBot_Name = RocketChat.models.Settings.findOne({                                                          // 22
					_id: 'RocketBot_Name'                                                                                             // 23
				});                                                                                                                // 22
				if (RocketBot_Name) {                                                                                              // 25
					RocketChat.models.Settings.remove({                                                                               // 26
						_id: 'RocketBot_Name'                                                                                            // 27
					});                                                                                                               // 26
					RocketChat.models.Settings.upsert({                                                                               // 29
						_id: 'InternalHubot_Username'                                                                                    // 30
					}, {                                                                                                              // 29
						$set: {                                                                                                          // 32
							value: RocketBot_Name.value                                                                                     // 33
						}                                                                                                                // 32
					});                                                                                                               // 31
				}                                                                                                                  // 36
			}                                                                                                                   // 38
		}                                                                                                                    // 39
                                                                                                                       //
		return up;                                                                                                           // 3
	}()                                                                                                                   // 3
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v049.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v049.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.Migrations.add({                                                                                            // 1
	version: 49,                                                                                                          // 2
	up: function () {                                                                                                     // 3
		function up() {                                                                                                      // 3
                                                                                                                       //
			var count = 1;                                                                                                      // 5
                                                                                                                       //
			RocketChat.models.Rooms.find({ t: 'l' }, { sort: { ts: 1 }, fields: { _id: 1 } }).forEach(function (room) {         // 7
				RocketChat.models.Rooms.update({ _id: room._id }, { $set: { code: count } });                                      // 8
				RocketChat.models.Subscriptions.update({ rid: room._id }, { $set: { code: count } }, { multi: true });             // 9
				count++;                                                                                                           // 10
			});                                                                                                                 // 11
                                                                                                                       //
			RocketChat.models.Settings.upsert({ _id: 'Livechat_Room_Count' }, {                                                 // 13
				$set: {                                                                                                            // 14
					value: count,                                                                                                     // 15
					type: 'int',                                                                                                      // 16
					group: 'Livechat'                                                                                                 // 17
				}                                                                                                                  // 14
			});                                                                                                                 // 13
		}                                                                                                                    // 20
                                                                                                                       //
		return up;                                                                                                           // 3
	}()                                                                                                                   // 3
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v050.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v050.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.Migrations.add({                                                                                            // 1
	version: 50,                                                                                                          // 2
	up: function () {                                                                                                     // 3
		function up() {                                                                                                      // 3
			RocketChat.models.Subscriptions.tryDropIndex('u._id_1_name_1_t_1');                                                 // 4
			RocketChat.models.Subscriptions.tryEnsureIndex({ 'u._id': 1, 'name': 1, 't': 1 });                                  // 5
		}                                                                                                                    // 6
                                                                                                                       //
		return up;                                                                                                           // 3
	}()                                                                                                                   // 3
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v051.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v051.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.Migrations.add({                                                                                            // 1
	version: 51,                                                                                                          // 2
	up: function () {                                                                                                     // 3
		function up() {                                                                                                      // 3
			RocketChat.models.Rooms.find({ t: 'l', 'v.token': { $exists: true }, label: { $exists: false } }).forEach(function (room) {
				var user = RocketChat.models.Users.findOne({ 'profile.token': room.v.token });                                     // 5
				if (user) {                                                                                                        // 6
					RocketChat.models.Rooms.update({ _id: room._id }, {                                                               // 7
						$set: {                                                                                                          // 8
							label: user.name || user.username,                                                                              // 9
							'v._id': user._id                                                                                               // 10
						}                                                                                                                // 8
					});                                                                                                               // 7
					RocketChat.models.Subscriptions.update({ rid: room._id }, {                                                       // 13
						$set: {                                                                                                          // 14
							name: user.name || user.username                                                                                // 15
						}                                                                                                                // 14
					}, { multi: true });                                                                                              // 13
				}                                                                                                                  // 18
			});                                                                                                                 // 19
		}                                                                                                                    // 20
                                                                                                                       //
		return up;                                                                                                           // 3
	}()                                                                                                                   // 3
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v052.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v052.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.Migrations.add({                                                                                            // 1
	version: 52,                                                                                                          // 2
	up: function () {                                                                                                     // 3
		function up() {                                                                                                      // 3
			RocketChat.models.Users.update({ _id: 'rocket.cat' }, { $addToSet: { roles: 'bot' } });                             // 4
		}                                                                                                                    // 5
                                                                                                                       //
		return up;                                                                                                           // 3
	}()                                                                                                                   // 3
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v053.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v053.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.Migrations.add({                                                                                            // 1
	version: 53,                                                                                                          // 2
	up: function () {                                                                                                     // 3
		function up() {                                                                                                      // 3
			RocketChat.models.Settings.update({ _id: 'Email_Header', value: '' }, {                                             // 4
				$set: {                                                                                                            // 5
					value: '<table border="0" cellspacing="0" cellpadding="0" width="100%" bgcolor="#f3f3f3" style="color:#4a4a4a;font-family: Helvetica,Arial,sans-serif;font-size:14px;line-height:20px;border-collapse:callapse;border-spacing:0;margin:0 auto"><tr><td style="padding:1em"><table border="0" cellspacing="0" cellpadding="0" align="center" width="100%" style="width:100%;margin:0 auto;max-width:800px"><tr><td bgcolor="#ffffff" style="background-color:#ffffff; border: 1px solid #DDD; font-size: 10pt; font-family: Helvetica,Arial,sans-serif;"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td style="background-color: #04436a;"><h1 style="font-family: Helvetica,Arial,sans-serif; padding: 0 1em; margin: 0; line-height: 70px; color: #FFF;">[Site_Name]</h1></td></tr><tr><td style="padding: 1em; font-size: 10pt; font-family: Helvetica,Arial,sans-serif;">'
				}                                                                                                                  // 5
			});                                                                                                                 // 4
                                                                                                                       //
			RocketChat.models.Settings.update({ _id: 'Email_Footer', value: '' }, {                                             // 10
				$set: {                                                                                                            // 11
					value: '</td></tr></table></td></tr><tr><td border="0" cellspacing="0" cellpadding="0" width="100%" style="font-family: Helvetica,Arial,sans-serif; max-width: 800px; margin: 0 auto; padding: 1.5em; text-align: center; font-size: 8pt; color: #999;">Powered by <a href="https://rocket.chat" target="_blank">Rocket.Chat</a></td></tr></table></td></tr></table>'
				}                                                                                                                  // 11
			});                                                                                                                 // 10
		}                                                                                                                    // 15
                                                                                                                       //
		return up;                                                                                                           // 3
	}()                                                                                                                   // 3
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v054.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v054.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.Migrations.add({                                                                                            // 1
	version: 54,                                                                                                          // 2
	up: function () {                                                                                                     // 3
		function up() {                                                                                                      // 3
			if (RocketChat && RocketChat.models && RocketChat.models.Users) {                                                   // 4
				// Set default message viewMode to 'normal' or 'cozy' depending on the users' current settings and remove the field 'compactView'
				RocketChat.models.Users.update({ 'settings.preferences.compactView': true }, { $set: { 'settings.preferences.viewMode': 1 }, $unset: { 'settings.preferences.compactView': 1 } }, { multi: true });
				RocketChat.models.Users.update({ 'settings.preferences.viewMode': { $ne: 1 } }, { $set: { 'settings.preferences.viewMode': 0 } }, { multi: true });
			}                                                                                                                   // 8
		}                                                                                                                    // 9
                                                                                                                       //
		return up;                                                                                                           // 3
	}()                                                                                                                   // 3
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v055.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v055.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.Migrations.add({                                                                                            // 1
	version: 55,                                                                                                          // 2
	up: function () {                                                                                                     // 3
		function up() {                                                                                                      // 3
			RocketChat.models.Rooms.find({ 'topic': { $exists: 1, $ne: '' } }, { topic: 1 }).forEach(function (room) {          // 4
				var topic = s.escapeHTML(room.topic);                                                                              // 5
				RocketChat.models.Rooms.update({ _id: room._id }, { $set: { topic: topic } });                                     // 6
				RocketChat.models.Messages.update({ t: 'room_changed_topic', rid: room._id }, { $set: { msg: topic } });           // 7
			});                                                                                                                 // 8
		}                                                                                                                    // 9
                                                                                                                       //
		return up;                                                                                                           // 3
	}()                                                                                                                   // 3
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v056.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v056.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.Migrations.add({                                                                                            // 1
	version: 56,                                                                                                          // 2
	up: function () {                                                                                                     // 3
		function up() {                                                                                                      // 3
			RocketChat.models.Messages.find({ _id: /\./ }).forEach(function (message) {                                         // 4
				var oldId = message._id;                                                                                           // 5
				message._id = message._id.replace(/(.*)\.S?(.*)/, 'slack-$1-$2');                                                  // 6
				RocketChat.models.Messages.insert(message);                                                                        // 7
				RocketChat.models.Messages.remove({ _id: oldId });                                                                 // 8
			});                                                                                                                 // 9
		}                                                                                                                    // 10
                                                                                                                       //
		return up;                                                                                                           // 3
	}()                                                                                                                   // 3
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v057.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v057.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.Migrations.add({                                                                                            // 1
	version: 57,                                                                                                          // 2
	up: function () {                                                                                                     // 3
		function up() {                                                                                                      // 3
			RocketChat.models.Messages.find({ _id: /slack-([a-zA-Z0-9]+)S([0-9]+-[0-9]+)/ }).forEach(function (message) {       // 4
				var oldId = message._id;                                                                                           // 5
				message._id = message._id.replace(/slack-([a-zA-Z0-9]+)S([0-9]+-[0-9]+)/, 'slack-$1-$2');                          // 6
				RocketChat.models.Messages.insert(message);                                                                        // 7
				RocketChat.models.Messages.remove({ _id: oldId });                                                                 // 8
			});                                                                                                                 // 9
                                                                                                                       //
			RocketChat.models.Messages.find({ _id: /slack-slack/ }).forEach(function (message) {                                // 11
				var oldId = message._id;                                                                                           // 12
				message._id = message._id.replace('slack-slack', 'slack');                                                         // 13
				RocketChat.models.Messages.insert(message);                                                                        // 14
				RocketChat.models.Messages.remove({ _id: oldId });                                                                 // 15
			});                                                                                                                 // 16
                                                                                                                       //
			RocketChat.models.Messages.find({ _id: /\./ }).forEach(function (message) {                                         // 18
				var oldId = message._id;                                                                                           // 19
				message._id = message._id.replace(/(.*)\.?S(.*)/, 'slack-$1-$2');                                                  // 20
				message._id = message._id.replace(/\./g, '-');                                                                     // 21
				RocketChat.models.Messages.remove({ _id: message._id });                                                           // 22
				RocketChat.models.Messages.insert(message);                                                                        // 23
				RocketChat.models.Messages.remove({ _id: oldId });                                                                 // 24
			});                                                                                                                 // 25
		}                                                                                                                    // 26
                                                                                                                       //
		return up;                                                                                                           // 3
	}()                                                                                                                   // 3
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v058.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v058.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.Migrations.add({                                                                                            // 1
	version: 58,                                                                                                          // 2
	up: function () {                                                                                                     // 3
		function up() {                                                                                                      // 3
			RocketChat.models.Settings.update({ _id: 'Push_gateway', value: 'https://rocket.chat' }, {                          // 4
				$set: {                                                                                                            // 5
					value: 'https://gateway.rocket.chat',                                                                             // 6
					packageValue: 'https://gateway.rocket.chat'                                                                       // 7
				}                                                                                                                  // 5
			});                                                                                                                 // 4
		}                                                                                                                    // 10
                                                                                                                       //
		return up;                                                                                                           // 3
	}()                                                                                                                   // 3
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v059.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v059.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.Migrations.add({                                                                                            // 1
	version: 59,                                                                                                          // 2
	up: function () {                                                                                                     // 3
		function up() {                                                                                                      // 3
			var users = RocketChat.models.Users.find({}, { sort: { createdAt: 1 }, limit: 1 }).fetch();                         // 4
			if (users && users.length > 0) {                                                                                    // 5
				var createdAt = users[0].createdAt;                                                                                // 6
				RocketChat.models.Settings.update({ createdAt: { $exists: 0 } }, { $set: { createdAt: createdAt } }, { multi: true });
				RocketChat.models.Statistics.update({ installedAt: { $exists: 0 } }, { $set: { installedAt: createdAt } }, { multi: true });
			}                                                                                                                   // 9
		}                                                                                                                    // 10
                                                                                                                       //
		return up;                                                                                                           // 3
	}()                                                                                                                   // 3
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v060.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v060.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.Migrations.add({                                                                                            // 1
	version: 60,                                                                                                          // 2
	up: function () {                                                                                                     // 3
		function up() {                                                                                                      // 3
			var subscriptions = RocketChat.models.Subscriptions.find({ $or: [{ name: { $exists: 0 } }, { name: { $not: { $type: 2 } } }] }).fetch();
			if (subscriptions && subscriptions.length > 0) {                                                                    // 5
				RocketChat.models.Subscriptions.remove({ _id: { $in: _.pluck(subscriptions, '_id') } });                           // 6
			}                                                                                                                   // 7
                                                                                                                       //
			subscriptions = RocketChat.models.Subscriptions.find().forEach(function (subscription) {                            // 9
				var user = RocketChat.models.Users.findOne({ _id: subscription && subscription.u && subscription.u._id });         // 10
				if (!user) {                                                                                                       // 11
					RocketChat.models.Subscriptions.remove({ _id: subscription._id });                                                // 12
				}                                                                                                                  // 13
			});                                                                                                                 // 14
		}                                                                                                                    // 15
                                                                                                                       //
		return up;                                                                                                           // 3
	}()                                                                                                                   // 3
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v061.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v061.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.Migrations.add({                                                                                            // 1
	version: 61,                                                                                                          // 2
	up: function () {                                                                                                     // 3
		function up() {                                                                                                      // 3
			RocketChat.models.Users.find({ active: false }).forEach(function (user) {                                           // 4
				RocketChat.models.Subscriptions.setArchivedByUsername(user.username, true);                                        // 5
			});                                                                                                                 // 6
		}                                                                                                                    // 7
                                                                                                                       //
		return up;                                                                                                           // 3
	}()                                                                                                                   // 3
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v062.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v062.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.Migrations.add({                                                                                            // 1
	version: 62,                                                                                                          // 2
	up: function () {                                                                                                     // 3
		function up() {                                                                                                      // 3
			RocketChat.models.Settings.remove({ _id: 'Atlassian Crowd', type: 'group' });                                       // 4
		}                                                                                                                    // 5
                                                                                                                       //
		return up;                                                                                                           // 3
	}()                                                                                                                   // 3
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v063.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v063.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.Migrations.add({                                                                                            // 1
	version: 63,                                                                                                          // 2
	up: function () {                                                                                                     // 3
		function up() {                                                                                                      // 3
			var forward = RocketChat.models.Settings.findOne({ _id: 'Livechat_forward_open_chats' });                           // 4
			var timeout = RocketChat.models.Settings.findOne({ _id: 'Livechat_forward_open_chats_timeout' });                   // 5
                                                                                                                       //
			if (forward && forward.value) {                                                                                     // 7
				RocketChat.models.Settings.upsert({ _id: 'Livechat_agent_leave_action' }, {                                        // 8
					$set: {                                                                                                           // 9
						value: 'forward',                                                                                                // 10
						type: 'string',                                                                                                  // 11
						group: 'Livechat'                                                                                                // 12
					}                                                                                                                 // 9
				});                                                                                                                // 8
			}                                                                                                                   // 15
                                                                                                                       //
			if (timeout && timeout.value !== 60) {                                                                              // 17
				RocketChat.models.Settings.upsert({ _id: 'Livechat_agent_leave_action_timeout' }, {                                // 18
					$set: {                                                                                                           // 19
						value: timeout.value,                                                                                            // 20
						type: 'int',                                                                                                     // 21
						group: 'Livechat'                                                                                                // 22
					}                                                                                                                 // 19
				});                                                                                                                // 18
			}                                                                                                                   // 25
                                                                                                                       //
			RocketChat.models.Settings.remove({ _id: 'Livechat_forward_open_chats' });                                          // 27
			RocketChat.models.Settings.remove({ _id: 'Livechat_forward_open_chats_timeout' });                                  // 28
		}                                                                                                                    // 29
                                                                                                                       //
		return up;                                                                                                           // 3
	}()                                                                                                                   // 3
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v064.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/v064.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.Migrations.add({                                                                                            // 1
	version: 64,                                                                                                          // 2
	up: function () {                                                                                                     // 3
		function up() {                                                                                                      // 3
			RocketChat.models.Messages.find({ 't': 'room_changed_topic', 'msg': /</ }, { msg: 1 }).forEach(function (message) {
				var msg = s.escapeHTML(message.msg);                                                                               // 5
				RocketChat.models.Messages.update({ _id: message._id }, { $set: { msg: msg } });                                   // 6
			});                                                                                                                 // 7
		}                                                                                                                    // 8
                                                                                                                       //
		return up;                                                                                                           // 3
	}()                                                                                                                   // 3
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"xrun.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/migrations/xrun.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var control;                                                                                                           // 1
                                                                                                                       //
if (RocketChat.Migrations.getVersion() !== 0) {                                                                        // 1
  RocketChat.Migrations.migrateTo('latest');                                                                           //
} else {                                                                                                               //
  control = RocketChat.Migrations._getControl();                                                                       //
  control.version = _.last(RocketChat.Migrations._list).version;                                                       //
  RocketChat.Migrations._setControl(control);                                                                          //
}                                                                                                                      //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"appcache.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/appcache.coffee.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var ref;                                                                                                               // 1
                                                                                                                       //
if ((ref = Meteor.AppCache) != null) {                                                                                 //
  ref.config({                                                                                                         //
    onlineOnly: ['/elements/', '/landing/', '/moment-locales/', '/scripts/']                                           //
  });                                                                                                                  //
}                                                                                                                      //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"avatar.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/avatar.coffee.js                                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                                                                            // 1
  var RocketChatStore, path, ref, storeType, transformWrite;                                                           // 2
  storeType = 'GridFS';                                                                                                //
  if (RocketChat.settings.get('Accounts_AvatarStoreType')) {                                                           //
    storeType = RocketChat.settings.get('Accounts_AvatarStoreType');                                                   //
  }                                                                                                                    //
  RocketChatStore = RocketChatFile[storeType];                                                                         //
  if (RocketChatStore == null) {                                                                                       //
    throw new Error("Invalid RocketChatStore type [" + storeType + "]");                                               // 10
  }                                                                                                                    //
  console.log(("Using " + storeType + " for Avatar storage").green);                                                   //
  transformWrite = function(file, readStream, writeStream) {                                                           //
    var height, width;                                                                                                 // 15
    if (RocketChatFile.enabled === false || RocketChat.settings.get('Accounts_AvatarResize') !== true) {               //
      return readStream.pipe(writeStream);                                                                             // 16
    }                                                                                                                  //
    height = RocketChat.settings.get('Accounts_AvatarSize');                                                           //
    width = height;                                                                                                    //
    return RocketChatFile.gm(readStream, file.fileName).background('#ffffff').resize(width, height + '^>').gravity('Center').extent(width, height).stream('jpeg').pipe(writeStream);
  };                                                                                                                   //
  path = "~/uploads";                                                                                                  //
  if (((ref = RocketChat.settings.get('Accounts_AvatarStorePath')) != null ? ref.trim() : void 0) !== '') {            //
    path = RocketChat.settings.get('Accounts_AvatarStorePath');                                                        //
  }                                                                                                                    //
  this.RocketChatFileAvatarInstance = new RocketChatStore({                                                            //
    name: 'avatars',                                                                                                   //
    absolutePath: path,                                                                                                //
    transformWrite: transformWrite                                                                                     //
  });                                                                                                                  //
  return WebApp.connectHandlers.use('/avatar/', Meteor.bindEnvironment(function(req, res, next) {                      //
    var color, colors, file, initials, params, position, ref1, ref2, ref3, ref4, ref5, ref6, reqModifiedHeader, svg, user, username, usernameParts;
    params = {                                                                                                         //
      username: decodeURIComponent(req.url.replace(/^\//, '').replace(/\?.*$/, ''))                                    //
    };                                                                                                                 //
    if (_.isEmpty(params.username)) {                                                                                  //
      res.writeHead(403);                                                                                              //
      res.write('Forbidden');                                                                                          //
      res.end();                                                                                                       //
      return;                                                                                                          // 41
    }                                                                                                                  //
    if (params.username[0] !== '@') {                                                                                  //
      if ((ref1 = Meteor.settings) != null ? (ref2 = ref1["public"]) != null ? ref2.sandstorm : void 0 : void 0) {     //
        user = RocketChat.models.Users.findOneByUsername(params.username.replace('.jpg', ''));                         //
        if (user != null ? (ref3 = user.services) != null ? (ref4 = ref3.sandstorm) != null ? ref4.picture : void 0 : void 0 : void 0) {
          res.setHeader('Location', user.services.sandstorm.picture);                                                  //
          res.writeHead(302);                                                                                          //
          res.end();                                                                                                   //
          return;                                                                                                      // 50
        }                                                                                                              //
      }                                                                                                                //
      file = RocketChatFileAvatarInstance.getFileWithReadStream(encodeURIComponent(params.username));                  //
    } else {                                                                                                           //
      params.username = params.username.replace('@', '');                                                              //
    }                                                                                                                  //
    res.setHeader('Content-Disposition', 'inline');                                                                    //
    if (file == null) {                                                                                                //
      res.setHeader('Content-Type', 'image/svg+xml');                                                                  //
      res.setHeader('Cache-Control', 'public, max-age=0');                                                             //
      res.setHeader('Expires', '-1');                                                                                  //
      res.setHeader('Last-Modified', "Thu, 01 Jan 2015 00:00:00 GMT");                                                 //
      reqModifiedHeader = req.headers["if-modified-since"];                                                            //
      if (reqModifiedHeader != null) {                                                                                 //
        if (reqModifiedHeader === "Thu, 01 Jan 2015 00:00:00 GMT") {                                                   //
          res.writeHead(304);                                                                                          //
          res.end();                                                                                                   //
          return;                                                                                                      // 69
        }                                                                                                              //
      }                                                                                                                //
      colors = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B'];
      username = params.username.replace('.jpg', '');                                                                  //
      color = '';                                                                                                      //
      initials = '';                                                                                                   //
      if (username === "?") {                                                                                          //
        color = "#000";                                                                                                //
        initials = username;                                                                                           //
      } else {                                                                                                         //
        position = username.length % colors.length;                                                                    //
        color = colors[position];                                                                                      //
        username = username.replace(/[^A-Za-z0-9]/g, '.').replace(/\.+/g, '.').replace(/(^\.)|(\.$)/g, '');            //
        usernameParts = username.split('.');                                                                           //
        initials = usernameParts.length > 1 ? _.first(usernameParts)[0] + _.last(usernameParts)[0] : username.replace(/[^A-Za-z0-9]/g, '').substr(0, 2);
        initials = initials.toUpperCase();                                                                             //
      }                                                                                                                //
      svg = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg xmlns=\"http://www.w3.org/2000/svg\" pointer-events=\"none\" width=\"50\" height=\"50\" style=\"width: 50px; height: 50px; background-color: " + color + ";\">\n	<text text-anchor=\"middle\" y=\"50%\" x=\"50%\" dy=\"0.36em\" pointer-events=\"auto\" fill=\"#ffffff\" font-family=\"Helvetica, Arial, Lucida Grande, sans-serif\" style=\"font-weight: 400; font-size: 28px;\">\n		" + initials + "\n	</text>\n</svg>";
      res.write(svg);                                                                                                  //
      res.end();                                                                                                       //
      return;                                                                                                          // 101
    }                                                                                                                  //
    reqModifiedHeader = req.headers["if-modified-since"];                                                              //
    if (reqModifiedHeader != null) {                                                                                   //
      if (reqModifiedHeader === ((ref5 = file.uploadDate) != null ? ref5.toUTCString() : void 0)) {                    //
        res.setHeader('Last-Modified', reqModifiedHeader);                                                             //
        res.writeHead(304);                                                                                            //
        res.end();                                                                                                     //
        return;                                                                                                        // 109
      }                                                                                                                //
    }                                                                                                                  //
    res.setHeader('Cache-Control', 'public, max-age=0');                                                               //
    res.setHeader('Expires', '-1');                                                                                    //
    res.setHeader('Last-Modified', ((ref6 = file.uploadDate) != null ? ref6.toUTCString() : void 0) || new Date().toUTCString());
    res.setHeader('Content-Type', 'image/jpeg');                                                                       //
    res.setHeader('Content-Length', file.length);                                                                      //
    file.readStream.pipe(res);                                                                                         //
  }));                                                                                                                 //
});                                                                                                                    // 1
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"cron.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/cron.coffee.js                                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var generateStatistics, logger;                                                                                        // 2
                                                                                                                       //
logger = new Logger('SyncedCron');                                                                                     // 2
                                                                                                                       //
SyncedCron.config({                                                                                                    // 4
  logger: function(opts) {                                                                                             //
    return logger[opts.level].call(logger, opts.message);                                                              //
  },                                                                                                                   //
  collectionName: 'rocketchat_cron_history'                                                                            //
});                                                                                                                    //
                                                                                                                       //
generateStatistics = function() {                                                                                      // 9
  var e, statistics;                                                                                                   // 10
  statistics = RocketChat.statistics.save();                                                                           //
  statistics.host = Meteor.absoluteUrl();                                                                              //
  if (RocketChat.settings.get('Statistics_reporting')) {                                                               //
    try {                                                                                                              // 13
      HTTP.post('https://collector.rocket.chat/', {                                                                    //
        data: statistics                                                                                               //
      });                                                                                                              //
    } catch (error) {                                                                                                  //
      e = error;                                                                                                       //
      logger.warn('Failed to send usage report');                                                                      //
    }                                                                                                                  //
  }                                                                                                                    //
};                                                                                                                     // 9
                                                                                                                       //
Meteor.startup(function() {                                                                                            // 20
  return Meteor.defer(function() {                                                                                     //
    generateStatistics();                                                                                              //
    SyncedCron.add({                                                                                                   //
      name: 'Generate and save statistics',                                                                            //
      schedule: function(parser) {                                                                                     //
        return parser.cron(new Date().getMinutes() + ' * * * *');                                                      // 28
      },                                                                                                               //
      job: generateStatistics                                                                                          //
    });                                                                                                                //
    return SyncedCron.start();                                                                                         //
  });                                                                                                                  //
});                                                                                                                    // 20
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"i18n-validation.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/i18n-validation.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var flat;                                                                                                              // 1
                                                                                                                       //
flat = function(obj, newObj, path) {                                                                                   // 1
  var key, value;                                                                                                      // 2
  if (newObj == null) {                                                                                                //
    newObj = {};                                                                                                       //
  }                                                                                                                    //
  if (path == null) {                                                                                                  //
    path = '';                                                                                                         //
  }                                                                                                                    //
  for (key in obj) {                                                                                                   // 2
    value = obj[key];                                                                                                  //
    if (_.isObject(value)) {                                                                                           //
      flat(value, newObj, key + '.');                                                                                  //
    } else {                                                                                                           //
      newObj[path + key] = value;                                                                                      //
    }                                                                                                                  //
  }                                                                                                                    // 2
  return newObj;                                                                                                       // 8
};                                                                                                                     // 1
                                                                                                                       //
Meteor.startup(function() {                                                                                            // 11
  var error, errors, i, key, keys, l, lang, langs, len, len1, present, ref, ref1, value;                               // 12
  return;                                                                                                              // 12
  l = {};                                                                                                              //
  keys = {};                                                                                                           //
  errors = [];                                                                                                         //
  langs = Object.keys(TAPi18next.options.resStore);                                                                    //
  ref = TAPi18next.options.resStore;                                                                                   // 18
  for (lang in ref) {                                                                                                  // 18
    value = ref[lang];                                                                                                 //
    l[lang] = flat(value);                                                                                             //
    ref1 = l[lang];                                                                                                    // 20
    for (key in ref1) {                                                                                                // 20
      value = ref1[key];                                                                                               //
      if (keys[key] == null) {                                                                                         //
        keys[key] = [];                                                                                                //
      }                                                                                                                //
      keys[key].push(lang);                                                                                            //
    }                                                                                                                  // 20
  }                                                                                                                    // 18
  len = 0;                                                                                                             //
  for (key in keys) {                                                                                                  // 25
    present = keys[key];                                                                                               //
    if (!(present.length !== langs.length)) {                                                                          //
      continue;                                                                                                        //
    }                                                                                                                  //
    error = ((_.difference(langs, present).join(',')) + ": missing translation for ").red + key.white + (". Present in [" + (present.join(',')) + "]").red;
    errors.push(error);                                                                                                //
    if (error.length > len) {                                                                                          //
      len = error.length;                                                                                              //
    }                                                                                                                  //
  }                                                                                                                    // 25
  if (errors.length > 0) {                                                                                             //
    console.log("+".red + s.rpad('', len - 28, '-').red + "+".red);                                                    //
    for (i = 0, len1 = errors.length; i < len1; i++) {                                                                 // 33
      error = errors[i];                                                                                               //
      console.log("|".red, s.rpad("" + error, len).red, "|".red);                                                      //
    }                                                                                                                  // 33
    return console.log("+".red + s.rpad('', len - 28, '-').red + "+".red);                                             //
  }                                                                                                                    //
});                                                                                                                    // 11
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"initialData.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/initialData.coffee.js                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                                                                            // 1
  return Meteor.defer(function() {                                                                                     //
    var adminUser, id, nameValidation, oldestUser, re, rs, ws;                                                         // 4
    if (RocketChat.models.Rooms.findOneById('GENERAL') == null) {                                                      //
      RocketChat.models.Rooms.createWithIdTypeAndName('GENERAL', 'c', 'general', {                                     //
        "default": true                                                                                                //
      });                                                                                                              //
    }                                                                                                                  //
    if (RocketChat.models.Users.findOneById('rocket.cat') == null) {                                                   //
      RocketChat.models.Users.create({                                                                                 //
        _id: 'rocket.cat',                                                                                             //
        name: "Rocket.Cat",                                                                                            //
        username: 'rocket.cat',                                                                                        //
        status: "online",                                                                                              //
        statusDefault: "online",                                                                                       //
        utcOffset: 0,                                                                                                  //
        active: true,                                                                                                  //
        type: 'bot'                                                                                                    //
      });                                                                                                              //
      RocketChat.authz.addUserRoles('rocket.cat', 'bot');                                                              //
      rs = RocketChatFile.bufferToStream(new Buffer(Assets.getBinary('avatars/rocketcat.png'), 'utf8'));               //
      RocketChatFileAvatarInstance.deleteFile("rocket.cat.jpg");                                                       //
      ws = RocketChatFileAvatarInstance.createWriteStream("rocket.cat.jpg", 'image/png');                              //
      ws.on('end', Meteor.bindEnvironment(function() {                                                                 //
        return RocketChat.models.Users.setAvatarOrigin('rocket.cat', 'local');                                         //
      }));                                                                                                             //
      rs.pipe(ws);                                                                                                     //
    }                                                                                                                  //
    if (process.env.ADMIN_PASS != null) {                                                                              //
      if (_.isEmpty(RocketChat.authz.getUsersInRole('admin').fetch())) {                                               //
        console.log('Inserting admin user:'.green);                                                                    //
        adminUser = {                                                                                                  //
          name: "Administrator",                                                                                       //
          username: "admin",                                                                                           //
          status: "offline",                                                                                           //
          statusDefault: "online",                                                                                     //
          utcOffset: 0,                                                                                                //
          active: true                                                                                                 //
        };                                                                                                             //
        if (process.env.ADMIN_NAME != null) {                                                                          //
          adminUser.name = process.env.ADMIN_NAME;                                                                     //
        }                                                                                                              //
        console.log(("Name: " + adminUser.name).green);                                                                //
        if (process.env.ADMIN_EMAIL != null) {                                                                         //
          re = /^[^@].*@[^@]+$/i;                                                                                      //
          if (re.test(process.env.ADMIN_EMAIL)) {                                                                      //
            if (!RocketChat.models.Users.findOneByEmailAddress(process.env.ADMIN_EMAIL)) {                             //
              adminUser.emails = [                                                                                     //
                {                                                                                                      //
                  address: process.env.ADMIN_EMAIL,                                                                    //
                  verified: true                                                                                       //
                }                                                                                                      //
              ];                                                                                                       //
              console.log(("Email: " + process.env.ADMIN_EMAIL).green);                                                //
            } else {                                                                                                   //
              console.log('Email provided already exists; Ignoring environment variables ADMIN_EMAIL'.red);            //
            }                                                                                                          //
          } else {                                                                                                     //
            console.log('Email provided is invalid; Ignoring environment variables ADMIN_EMAIL'.red);                  //
          }                                                                                                            //
        }                                                                                                              //
        if (process.env.ADMIN_USERNAME != null) {                                                                      //
          try {                                                                                                        // 61
            nameValidation = new RegExp('^' + RocketChat.settings.get('UTF8_Names_Validation') + '$');                 //
          } catch (error) {                                                                                            //
            nameValidation = new RegExp('^[0-9a-zA-Z-_.]+$');                                                          //
          }                                                                                                            //
          if (nameValidation.test(process.env.ADMIN_USERNAME)) {                                                       //
            if (RocketChat.checkUsernameAvailability(process.env.ADMIN_USERNAME)) {                                    //
              adminUser.username = process.env.ADMIN_USERNAME;                                                         //
            } else {                                                                                                   //
              console.log('Username provided already exists; Ignoring environment variables ADMIN_USERNAME'.red);      //
            }                                                                                                          //
          } else {                                                                                                     //
            console.log('Username provided is invalid; Ignoring environment variables ADMIN_USERNAME'.red);            //
          }                                                                                                            //
        }                                                                                                              //
        console.log(("Username: " + adminUser.username).green);                                                        //
        adminUser.type = 'user';                                                                                       //
        id = RocketChat.models.Users.create(adminUser);                                                                //
        Accounts.setPassword(id, process.env.ADMIN_PASS);                                                              //
        console.log(("Password: " + process.env.ADMIN_PASS).green);                                                    //
        RocketChat.authz.addUserRoles(id, 'admin');                                                                    //
      } else {                                                                                                         //
        console.log('Users with admin role already exist; Ignoring environment variables ADMIN_PASS'.red);             //
      }                                                                                                                //
    }                                                                                                                  //
    if (_.isEmpty(RocketChat.authz.getUsersInRole('admin').fetch())) {                                                 //
      oldestUser = RocketChat.models.Users.findOne({                                                                   //
        _id: {                                                                                                         //
          $ne: 'rocket.cat'                                                                                            //
        }                                                                                                              //
      }, {                                                                                                             //
        fields: {                                                                                                      //
          username: 1                                                                                                  //
        },                                                                                                             //
        sort: {                                                                                                        //
          createdAt: 1                                                                                                 //
        }                                                                                                              //
      });                                                                                                              //
      if (oldestUser) {                                                                                                //
        RocketChat.authz.addUserRoles(oldestUser._id, 'admin');                                                        //
        return console.log("No admins are found. Set " + oldestUser.username + " as admin for being the oldest user");
      }                                                                                                                //
    }                                                                                                                  //
  });                                                                                                                  //
});                                                                                                                    // 1
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"presence.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/presence.coffee.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                                                                            // 1
  var instance;                                                                                                        // 2
  instance = {                                                                                                         //
    host: 'localhost',                                                                                                 //
    port: process.env.PORT                                                                                             //
  };                                                                                                                   //
  if (process.env.INSTANCE_IP) {                                                                                       //
    instance.host = process.env.INSTANCE_IP;                                                                           //
  }                                                                                                                    //
  InstanceStatus.registerInstance('rocket.chat', instance);                                                            //
  UserPresence.start();                                                                                                //
  return UserPresenceMonitor.start();                                                                                  //
});                                                                                                                    // 1
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"roomPublishes.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/roomPublishes.coffee.js                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                                                                            // 1
  RocketChat.roomTypes.setPublish('c', function(identifier) {                                                          //
    var options, ref, roomId;                                                                                          // 3
    options = {                                                                                                        //
      fields: {                                                                                                        //
        name: 1,                                                                                                       //
        t: 1,                                                                                                          //
        cl: 1,                                                                                                         //
        u: 1,                                                                                                          //
        usernames: 1,                                                                                                  //
        topic: 1,                                                                                                      //
        muted: 1,                                                                                                      //
        archived: 1,                                                                                                   //
        ro: 1,                                                                                                         //
        jitsiTimeout: 1,                                                                                               //
        description: 1,                                                                                                //
        sysMes: 1,                                                                                                     //
        joinCodeRequired: 1                                                                                            //
      }                                                                                                                //
    };                                                                                                                 //
    if (RocketChat.authz.hasPermission(this.userId, 'view-join-code')) {                                               //
      options.fields.joinCode = 1;                                                                                     //
    }                                                                                                                  //
    if (RocketChat.authz.hasPermission(this.userId, 'view-c-room')) {                                                  //
      return RocketChat.models.Rooms.findByTypeAndName('c', identifier, options);                                      // 23
    } else if (RocketChat.authz.hasPermission(this.userId, 'view-joined-room')) {                                      //
      roomId = RocketChat.models.Subscriptions.findByTypeNameAndUserId('c', identifier, this.userId).fetch();          //
      if (roomId.length > 0) {                                                                                         //
        return RocketChat.models.Rooms.findById((ref = roomId[0]) != null ? ref.rid : void 0, options);                // 27
      }                                                                                                                //
    }                                                                                                                  //
    return this.ready();                                                                                               // 29
  });                                                                                                                  //
  RocketChat.roomTypes.setPublish('p', function(identifier) {                                                          //
    var options, user;                                                                                                 // 32
    options = {                                                                                                        //
      fields: {                                                                                                        //
        name: 1,                                                                                                       //
        t: 1,                                                                                                          //
        cl: 1,                                                                                                         //
        u: 1,                                                                                                          //
        usernames: 1,                                                                                                  //
        topic: 1,                                                                                                      //
        muted: 1,                                                                                                      //
        archived: 1,                                                                                                   //
        ro: 1,                                                                                                         //
        jitsiTimeout: 1,                                                                                               //
        description: 1,                                                                                                //
        sysMes: 1                                                                                                      //
      }                                                                                                                //
    };                                                                                                                 //
    user = RocketChat.models.Users.findOneById(this.userId, {                                                          //
      fields: {                                                                                                        //
        username: 1                                                                                                    //
      }                                                                                                                //
    });                                                                                                                //
    return RocketChat.models.Rooms.findByTypeAndNameContainingUsername('p', identifier, user.username, options);       // 48
  });                                                                                                                  //
  return RocketChat.roomTypes.setPublish('d', function(identifier) {                                                   //
    var options, user;                                                                                                 // 51
    options = {                                                                                                        //
      fields: {                                                                                                        //
        name: 1,                                                                                                       //
        t: 1,                                                                                                          //
        cl: 1,                                                                                                         //
        u: 1,                                                                                                          //
        usernames: 1,                                                                                                  //
        topic: 1,                                                                                                      //
        jitsiTimeout: 1                                                                                                //
      }                                                                                                                //
    };                                                                                                                 //
    user = RocketChat.models.Users.findOneById(this.userId, {                                                          //
      fields: {                                                                                                        //
        username: 1                                                                                                    //
      }                                                                                                                //
    });                                                                                                                //
    if (RocketChat.authz.hasAtLeastOnePermission(this.userId, ['view-d-room', 'view-joined-room'])) {                  //
      return RocketChat.models.Rooms.findByTypeContainigUsernames('d', [user.username, identifier], options);          // 63
    }                                                                                                                  //
    return this.ready();                                                                                               // 64
  });                                                                                                                  //
});                                                                                                                    // 1
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"serverRunning.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/startup/serverRunning.coffee.js                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                                                                            // 1
  var isOplogState;                                                                                                    // 2
  isOplogState = 'Enabled';                                                                                            //
  if (MongoInternals.defaultRemoteCollectionDriver().mongo._oplogHandle == null) {                                     //
    isOplogState = 'Disabled';                                                                                         //
  }                                                                                                                    //
  return Meteor.setTimeout(function() {                                                                                //
    var msg;                                                                                                           // 7
    msg = ["     Version: " + RocketChat.Info.version, "Process Port: " + process.env.PORT, "    Site URL: " + (RocketChat.settings.get('Site_Url')), "       OpLog: " + isOplogState].join('\n');
    return SystemLogger.startup_box(msg, 'SERVER RUNNING');                                                            //
  }, 100);                                                                                                             //
});                                                                                                                    // 1
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"configuration":{"accounts_meld.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/configuration/accounts_meld.coffee.js                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var orig_updateOrCreateUserFromExternalService;                                                                        // 1
                                                                                                                       //
orig_updateOrCreateUserFromExternalService = Accounts.updateOrCreateUserFromExternalService;                           // 1
                                                                                                                       //
Accounts.updateOrCreateUserFromExternalService = function(serviceName, serviceData, options) {                         // 2
  var email, i, len, ref, user;                                                                                        // 4
  if ((serviceName !== 'facebook' && serviceName !== 'github' && serviceName !== 'gitlab' && serviceName !== 'google' && serviceName !== 'meteor-developer' && serviceName !== 'linkedin' && serviceName !== 'twitter' && serviceName !== 'sandstorm') && serviceData._OAuthCustom !== true) {
    return;                                                                                                            // 5
  }                                                                                                                    //
  if (serviceName === 'meteor-developer') {                                                                            //
    if (_.isArray(serviceData != null ? serviceData.emails : void 0)) {                                                //
      serviceData.emails.sort(function(a, b) {                                                                         //
        return a.primary !== true;                                                                                     // 10
      });                                                                                                              //
      ref = serviceData.emails;                                                                                        // 12
      for (i = 0, len = ref.length; i < len; i++) {                                                                    // 12
        email = ref[i];                                                                                                //
        if (email.verified === true) {                                                                                 //
          serviceData.email = email.address;                                                                           //
          break;                                                                                                       // 15
        }                                                                                                              //
      }                                                                                                                // 12
    }                                                                                                                  //
  }                                                                                                                    //
  if (serviceName === 'linkedin') {                                                                                    //
    serviceData.email = serviceData.emailAddress;                                                                      //
  }                                                                                                                    //
  if (serviceData.email) {                                                                                             //
    user = RocketChat.models.Users.findOneByEmailAddress(serviceData.email);                                           //
    if (user != null) {                                                                                                //
      if (!_.findWhere(user.emails, {                                                                                  //
        address: serviceData.email,                                                                                    //
        verified: true                                                                                                 //
      })) {                                                                                                            //
        RocketChat.models.Users.resetPasswordAndSetRequirePasswordChange(user._id, true, 'This_email_has_already_been_used_and_has_not_been_verified__Please_change_your_password');
      }                                                                                                                //
      RocketChat.models.Users.setServiceId(user._id, serviceName, serviceData.id);                                     //
      RocketChat.models.Users.setEmailVerified(user._id, serviceData.email);                                           //
    }                                                                                                                  //
  }                                                                                                                    //
  return orig_updateOrCreateUserFromExternalService.apply(this, arguments);                                            // 35
};                                                                                                                     // 2
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"methods":{"addAllUserToRoom.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/addAllUserToRoom.js                                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	addAllUserToRoom: function () {                                                                                       // 2
		function addAllUserToRoom(rid) {                                                                                     // 2
                                                                                                                       //
			check(rid, String);                                                                                                 // 4
                                                                                                                       //
			if (RocketChat.authz.hasRole(this.userId, 'admin') === true) {                                                      // 6
				var now, room, users;                                                                                              // 7
				var userCount = RocketChat.models.Users.find().count();                                                            // 8
				if (userCount > RocketChat.settings.get('API_User_Limit')) {                                                       // 9
					throw new Meteor.Error('error-user-limit-exceeded', 'User Limit Exceeded', {                                      // 10
						method: 'addAllToRoom'                                                                                           // 11
					});                                                                                                               // 10
				}                                                                                                                  // 13
				room = RocketChat.models.Rooms.findOneById(rid);                                                                   // 14
				if (room == null) {                                                                                                // 15
					throw new Meteor.Error('error-invalid-room', 'Invalid room', {                                                    // 16
						method: 'addAllToRoom'                                                                                           // 17
					});                                                                                                               // 16
				}                                                                                                                  // 19
				users = RocketChat.models.Users.find().fetch();                                                                    // 20
				now = new Date();                                                                                                  // 21
				users.forEach(function (user) {                                                                                    // 22
					var subscription;                                                                                                 // 23
					subscription = RocketChat.models.Subscriptions.findOneByRoomIdAndUserId(rid, user._id);                           // 24
					if (subscription != null) {                                                                                       // 25
						return;                                                                                                          // 26
					}                                                                                                                 // 27
					RocketChat.callbacks.run('beforeJoinRoom', user, room);                                                           // 28
					RocketChat.models.Rooms.addUsernameById(rid, user.username);                                                      // 29
					RocketChat.models.Subscriptions.createWithRoomAndUser(room, user, {                                               // 30
						ts: now,                                                                                                         // 31
						open: true,                                                                                                      // 32
						alert: true,                                                                                                     // 33
						unread: 1                                                                                                        // 34
					});                                                                                                               // 30
					RocketChat.models.Messages.createUserJoinWithRoomIdAndUser(rid, user, {                                           // 36
						ts: now                                                                                                          // 37
					});                                                                                                               // 36
					Meteor.defer(function () {});                                                                                     // 39
					return RocketChat.callbacks.run('afterJoinRoom', user, room);                                                     // 40
				});                                                                                                                // 41
				return true;                                                                                                       // 42
			} else {                                                                                                            // 43
				throw new Meteor.Error(403, 'Access to Method Forbidden', {                                                        // 44
					method: 'addAllToRoom'                                                                                            // 45
				});                                                                                                                // 44
			}                                                                                                                   // 47
		}                                                                                                                    // 48
                                                                                                                       //
		return addAllUserToRoom;                                                                                             // 2
	}()                                                                                                                   // 2
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"addRoomModerator.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/addRoomModerator.coffee.js                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                       // 1
  addRoomModerator: function(rid, userId) {                                                                            //
    var fromUser, subscription, user;                                                                                  // 4
    check(rid, String);                                                                                                //
    check(userId, String);                                                                                             //
    if (!Meteor.userId()) {                                                                                            //
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                   // 8
        method: 'addRoomModerator'                                                                                     //
      });                                                                                                              //
    }                                                                                                                  //
    if (!RocketChat.authz.hasPermission(Meteor.userId(), 'set-moderator', rid)) {                                      //
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                     // 11
        method: 'addRoomModerator'                                                                                     //
      });                                                                                                              //
    }                                                                                                                  //
    subscription = RocketChat.models.Subscriptions.findOneByRoomIdAndUserId(rid, userId);                              //
    if (subscription == null) {                                                                                        //
      throw new Meteor.Error('error-invalid-room', 'Invalid room', {                                                   // 15
        method: 'addRoomModerator'                                                                                     //
      });                                                                                                              //
    }                                                                                                                  //
    RocketChat.models.Subscriptions.addRoleById(subscription._id, 'moderator');                                        //
    user = RocketChat.models.Users.findOneById(userId);                                                                //
    fromUser = RocketChat.models.Users.findOneById(Meteor.userId());                                                   //
    RocketChat.models.Messages.createSubscriptionRoleAddedWithRoomIdAndUser(rid, user, {                               //
      u: {                                                                                                             //
        _id: fromUser._id,                                                                                             //
        username: fromUser.username                                                                                    //
      },                                                                                                               //
      role: 'moderator'                                                                                                //
    });                                                                                                                //
    if (RocketChat.settings.get('UI_DisplayRoles')) {                                                                  //
      RocketChat.Notifications.notifyAll('roles-change', {                                                             //
        type: 'added',                                                                                                 //
        _id: 'moderator',                                                                                              //
        u: {                                                                                                           //
          _id: user._id,                                                                                               //
          username: user.username                                                                                      //
        },                                                                                                             //
        scope: rid                                                                                                     //
      });                                                                                                              //
    }                                                                                                                  //
    return true;                                                                                                       // 30
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"addRoomOwner.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/addRoomOwner.coffee.js                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                       // 1
  addRoomOwner: function(rid, userId) {                                                                                //
    var fromUser, subscription, user;                                                                                  // 4
    check(rid, String);                                                                                                //
    check(userId, String);                                                                                             //
    if (!Meteor.userId()) {                                                                                            //
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                   // 8
        method: 'addRoomOwner'                                                                                         //
      });                                                                                                              //
    }                                                                                                                  //
    if (!RocketChat.authz.hasPermission(Meteor.userId(), 'set-owner', rid)) {                                          //
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                     // 11
        method: 'addRoomOwner'                                                                                         //
      });                                                                                                              //
    }                                                                                                                  //
    subscription = RocketChat.models.Subscriptions.findOneByRoomIdAndUserId(rid, userId);                              //
    if (subscription == null) {                                                                                        //
      throw new Meteor.Error('error-invalid-room', 'Invalid room', {                                                   // 15
        method: 'addRoomOwner'                                                                                         //
      });                                                                                                              //
    }                                                                                                                  //
    RocketChat.models.Subscriptions.addRoleById(subscription._id, 'owner');                                            //
    user = RocketChat.models.Users.findOneById(userId);                                                                //
    fromUser = RocketChat.models.Users.findOneById(Meteor.userId());                                                   //
    RocketChat.models.Messages.createSubscriptionRoleAddedWithRoomIdAndUser(rid, user, {                               //
      u: {                                                                                                             //
        _id: fromUser._id,                                                                                             //
        username: fromUser.username                                                                                    //
      },                                                                                                               //
      role: 'owner'                                                                                                    //
    });                                                                                                                //
    if (RocketChat.settings.get('UI_DisplayRoles')) {                                                                  //
      RocketChat.Notifications.notifyAll('roles-change', {                                                             //
        type: 'added',                                                                                                 //
        _id: 'owner',                                                                                                  //
        u: {                                                                                                           //
          _id: user._id,                                                                                               //
          username: user.username                                                                                      //
        },                                                                                                             //
        scope: rid                                                                                                     //
      });                                                                                                              //
    }                                                                                                                  //
    return true;                                                                                                       // 30
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"canAccessRoom.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/canAccessRoom.coffee.js                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                       // 1
  canAccessRoom: function(rid, userId) {                                                                               //
    var room, user;                                                                                                    // 4
    check(rid, String);                                                                                                //
    check(userId, String);                                                                                             //
    user = RocketChat.models.Users.findOneById(userId, {                                                               //
      fields: {                                                                                                        //
        username: 1                                                                                                    //
      }                                                                                                                //
    });                                                                                                                //
    if (!(user != null ? user.username : void 0)) {                                                                    //
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                   // 10
        method: 'canAccessRoom'                                                                                        //
      });                                                                                                              //
    }                                                                                                                  //
    if (!rid) {                                                                                                        //
      throw new Meteor.Error('error-invalid-room', 'Invalid room', {                                                   // 13
        method: 'canAccessRoom'                                                                                        //
      });                                                                                                              //
    }                                                                                                                  //
    room = RocketChat.models.Rooms.findOneById(rid);                                                                   //
    if (room) {                                                                                                        //
      if (RocketChat.authz.canAccessRoom.call(this, room, user)) {                                                     //
        room.username = user.username;                                                                                 //
        return room;                                                                                                   // 20
      } else {                                                                                                         //
        return false;                                                                                                  // 22
      }                                                                                                                //
    } else {                                                                                                           //
      throw new Meteor.Error('error-invalid-room', 'Invalid room', {                                                   // 24
        method: 'canAccessRoom'                                                                                        //
      });                                                                                                              //
    }                                                                                                                  //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"channelsList.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/channelsList.coffee.js                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                       // 1
  channelsList: function(filter, channelType, limit, sort) {                                                           //
    var globalPref, mergeChannels, options, ref, ref1, ref2, roomIds, roomTypes, userPref;                             // 3
    this.unblock();                                                                                                    //
    check(filter, String);                                                                                             //
    check(channelType, String);                                                                                        //
    check(limit, Match.Optional(Number));                                                                              //
    check(sort, Match.Optional(String));                                                                               //
    if (!Meteor.userId()) {                                                                                            //
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                   // 11
        method: 'channelsList'                                                                                         //
      });                                                                                                              //
    }                                                                                                                  //
    options = {                                                                                                        //
      fields: {                                                                                                        //
        name: 1,                                                                                                       //
        t: 1                                                                                                           //
      },                                                                                                               //
      sort: {                                                                                                          //
        msgs: -1                                                                                                       //
      }                                                                                                                //
    };                                                                                                                 //
    if (_.isNumber(limit)) {                                                                                           //
      options.limit = limit;                                                                                           //
    }                                                                                                                  //
    if (_.trim(sort)) {                                                                                                //
      switch (sort) {                                                                                                  // 17
        case 'name':                                                                                                   // 17
          options.sort = {                                                                                             //
            name: 1                                                                                                    //
          };                                                                                                           //
          break;                                                                                                       // 18
        case 'msgs':                                                                                                   // 17
          options.sort = {                                                                                             //
            msgs: -1                                                                                                   //
          };                                                                                                           //
      }                                                                                                                // 17
    }                                                                                                                  //
    roomTypes = [];                                                                                                    //
    if (channelType !== 'private') {                                                                                   //
      if (RocketChat.authz.hasPermission(Meteor.userId(), 'view-c-room')) {                                            //
        roomTypes.push({                                                                                               //
          type: 'c'                                                                                                    //
        });                                                                                                            //
      } else if (RocketChat.authz.hasPermission(Meteor.userId(), 'view-joined-room')) {                                //
        roomIds = _.pluck(RocketChat.models.Subscriptions.findByTypeAndUserId('c', Meteor.userId()).fetch(), 'rid');   //
        roomTypes.push({                                                                                               //
          type: 'c',                                                                                                   //
          ids: roomIds                                                                                                 //
        });                                                                                                            //
      }                                                                                                                //
    }                                                                                                                  //
    if (channelType !== 'public' && RocketChat.authz.hasPermission(Meteor.userId(), 'view-p-room')) {                  //
      userPref = (ref = Meteor.user()) != null ? (ref1 = ref.settings) != null ? (ref2 = ref1.preferences) != null ? ref2.mergeChannels : void 0 : void 0 : void 0;
      globalPref = RocketChat.settings.get('UI_Merge_Channels_Groups');                                                //
      mergeChannels = userPref != null ? userPref : globalPref;                                                        //
      if (mergeChannels) {                                                                                             //
        roomTypes.push({                                                                                               //
          type: 'p',                                                                                                   //
          username: Meteor.user().username                                                                             //
        });                                                                                                            //
      }                                                                                                                //
    }                                                                                                                  //
    if (roomTypes.length) {                                                                                            //
      if (filter) {                                                                                                    //
        return {                                                                                                       // 40
          channels: RocketChat.models.Rooms.findByNameContainingTypesWithUsername(filter, roomTypes, options).fetch()  //
        };                                                                                                             //
      } else {                                                                                                         //
        return {                                                                                                       // 42
          channels: RocketChat.models.Rooms.findContainingTypesWithUsername(roomTypes, options).fetch()                //
        };                                                                                                             //
      }                                                                                                                //
    } else {                                                                                                           //
      return {                                                                                                         // 44
        channels: []                                                                                                   //
      };                                                                                                               //
    }                                                                                                                  //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"createDirectMessage.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/createDirectMessage.coffee.js                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                       // 1
  createDirectMessage: function(username) {                                                                            //
    var me, now, rid, to, upsertSubscription;                                                                          // 4
    check(username, String);                                                                                           //
    if (!Meteor.userId()) {                                                                                            //
      throw new Meteor.Error('error-invalid-user', "Invalid user", {                                                   // 7
        method: 'createDirectMessage'                                                                                  //
      });                                                                                                              //
    }                                                                                                                  //
    me = Meteor.user();                                                                                                //
    if (!me.username) {                                                                                                //
      throw new Meteor.Error('error-invalid-user', "Invalid user", {                                                   // 12
        method: 'createDirectMessage'                                                                                  //
      });                                                                                                              //
    }                                                                                                                  //
    if (me.username === username) {                                                                                    //
      throw new Meteor.Error('error-invalid-user', "Invalid user", {                                                   // 15
        method: 'createDirectMessage'                                                                                  //
      });                                                                                                              //
    }                                                                                                                  //
    if (!RocketChat.authz.hasPermission(Meteor.userId(), 'create-d')) {                                                //
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                     // 18
        method: 'createDirectMessage'                                                                                  //
      });                                                                                                              //
    }                                                                                                                  //
    to = RocketChat.models.Users.findOneByUsername(username);                                                          //
    if (!to) {                                                                                                         //
      throw new Meteor.Error('error-invalid-user', "Invalid user", {                                                   // 23
        method: 'createDirectMessage'                                                                                  //
      });                                                                                                              //
    }                                                                                                                  //
    rid = [me._id, to._id].sort().join('');                                                                            //
    now = new Date();                                                                                                  //
    RocketChat.models.Rooms.upsert({                                                                                   //
      _id: rid                                                                                                         //
    }, {                                                                                                               //
      $set: {                                                                                                          //
        usernames: [me.username, to.username]                                                                          //
      },                                                                                                               //
      $setOnInsert: {                                                                                                  //
        t: 'd',                                                                                                        //
        msgs: 0,                                                                                                       //
        ts: now                                                                                                        //
      }                                                                                                                //
    });                                                                                                                //
    upsertSubscription = {                                                                                             //
      $set: {                                                                                                          //
        ts: now,                                                                                                       //
        ls: now,                                                                                                       //
        open: true                                                                                                     //
      },                                                                                                               //
      $setOnInsert: {                                                                                                  //
        name: to.username,                                                                                             //
        t: 'd',                                                                                                        //
        alert: false,                                                                                                  //
        unread: 0,                                                                                                     //
        u: {                                                                                                           //
          _id: me._id,                                                                                                 //
          username: me.username                                                                                        //
        }                                                                                                              //
      }                                                                                                                //
    };                                                                                                                 //
    if (to.active === false) {                                                                                         //
      upsertSubscription.$set.archived = true;                                                                         //
    }                                                                                                                  //
    RocketChat.models.Subscriptions.upsert({                                                                           //
      rid: rid,                                                                                                        //
      $and: [                                                                                                          //
        {                                                                                                              //
          'u._id': me._id                                                                                              //
        }                                                                                                              //
      ]                                                                                                                //
    }, upsertSubscription);                                                                                            //
    RocketChat.models.Subscriptions.upsert({                                                                           //
      rid: rid,                                                                                                        //
      $and: [                                                                                                          //
        {                                                                                                              //
          'u._id': to._id                                                                                              //
        }                                                                                                              //
      ]                                                                                                                //
    }, {                                                                                                               //
      $setOnInsert: {                                                                                                  //
        name: me.username,                                                                                             //
        t: 'd',                                                                                                        //
        open: false,                                                                                                   //
        alert: false,                                                                                                  //
        unread: 0,                                                                                                     //
        u: {                                                                                                           //
          _id: to._id,                                                                                                 //
          username: to.username                                                                                        //
        }                                                                                                              //
      }                                                                                                                //
    });                                                                                                                //
    return {                                                                                                           // 78
      rid: rid                                                                                                         //
    };                                                                                                                 //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
DDPRateLimiter.addRule({                                                                                               // 82
  type: 'method',                                                                                                      //
  name: 'createDirectMessage',                                                                                         //
  connectionId: function() {                                                                                           //
    return true;                                                                                                       // 85
  }                                                                                                                    //
}, 10, 60000);                                                                                                         //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"deleteFileMessage.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/deleteFileMessage.js                                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	deleteFileMessage: function () {                                                                                      // 2
		function deleteFileMessage(fileID) {                                                                                 // 2
			check(fileID, String);                                                                                              // 3
                                                                                                                       //
			return Meteor.call('deleteMessage', RocketChat.models.Messages.getMessageByFileId(fileID));                         // 5
		}                                                                                                                    // 6
                                                                                                                       //
		return deleteFileMessage;                                                                                            // 2
	}()                                                                                                                   // 2
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"deleteUser.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/deleteUser.coffee.js                                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                       // 1
  deleteUser: function(userId) {                                                                                       //
    var adminCount, user, userIsAdmin;                                                                                 // 4
    check(userId, String);                                                                                             //
    if (!Meteor.userId()) {                                                                                            //
      throw new Meteor.Error('error-invalid-user', "Invalid user", {                                                   // 7
        method: 'deleteUser'                                                                                           //
      });                                                                                                              //
    }                                                                                                                  //
    user = RocketChat.models.Users.findOneById(Meteor.userId());                                                       //
    if (RocketChat.authz.hasPermission(Meteor.userId(), 'delete-user') !== true) {                                     //
      throw new Meteor.Error('error-not-allowed', "Not allowed", {                                                     // 12
        method: 'deleteUser'                                                                                           //
      });                                                                                                              //
    }                                                                                                                  //
    user = RocketChat.models.Users.findOneById(userId);                                                                //
    if (user == null) {                                                                                                //
      throw new Meteor.Error('error-invalid-user', "Invalid user", {                                                   // 16
        method: 'deleteUser'                                                                                           //
      });                                                                                                              //
    }                                                                                                                  //
    adminCount = Meteor.users.find({                                                                                   //
      roles: {                                                                                                         //
        $in: ['admin']                                                                                                 //
      }                                                                                                                //
    }).count();                                                                                                        //
    userIsAdmin = user.roles.indexOf('admin') > -1;                                                                    //
    if (adminCount === 1 && userIsAdmin) {                                                                             //
      throw new Meteor.Error('error-action-not-allowed', 'Leaving the app without admins is not allowed', {            // 22
        method: 'deleteUser',                                                                                          //
        action: 'Remove_last_admin'                                                                                    //
      });                                                                                                              //
    }                                                                                                                  //
    RocketChat.deleteUser(userId);                                                                                     //
    return true;                                                                                                       // 26
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"eraseRoom.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/eraseRoom.coffee.js                                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                       // 1
  eraseRoom: function(rid) {                                                                                           //
    var fromId, ref, roomType;                                                                                         // 4
    check(rid, String);                                                                                                //
    if (!Meteor.userId()) {                                                                                            //
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                   // 7
        method: 'eraseRoom'                                                                                            //
      });                                                                                                              //
    }                                                                                                                  //
    fromId = Meteor.userId();                                                                                          //
    roomType = (ref = RocketChat.models.Rooms.findOneById(rid)) != null ? ref.t : void 0;                              //
    if (RocketChat.authz.hasPermission(fromId, "delete-" + roomType, rid)) {                                           //
      RocketChat.models.Messages.removeByRoomId(rid);                                                                  //
      RocketChat.models.Subscriptions.removeByRoomId(rid);                                                             //
      return RocketChat.models.Rooms.removeById(rid);                                                                  //
    } else {                                                                                                           //
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                     // 21
        method: 'eraseRoom'                                                                                            //
      });                                                                                                              //
    }                                                                                                                  //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getAvatarSuggestion.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/getAvatarSuggestion.coffee.js                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
this.getAvatarSuggestionForUser = function(user) {                                                                     // 1
  var avatar, avatars, blob, e, email, i, j, k, len, len1, len2, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, result, validAvatars;
  check(user, Object);                                                                                                 //
  avatars = [];                                                                                                        //
  if ((((ref = user.services.facebook) != null ? ref.id : void 0) != null) && RocketChat.settings.get('Accounts_OAuth_Facebook')) {
    avatars.push({                                                                                                     //
      service: 'facebook',                                                                                             //
      url: "https://graph.facebook.com/" + user.services.facebook.id + "/picture?type=large"                           //
    });                                                                                                                //
  }                                                                                                                    //
  if ((((ref1 = user.services.google) != null ? ref1.picture : void 0) != null) && user.services.google.picture !== "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg" && RocketChat.settings.get('Accounts_OAuth_Google')) {
    avatars.push({                                                                                                     //
      service: 'google',                                                                                               //
      url: user.services.google.picture                                                                                //
    });                                                                                                                //
  }                                                                                                                    //
  if ((((ref2 = user.services.github) != null ? ref2.username : void 0) != null) && RocketChat.settings.get('Accounts_OAuth_Github')) {
    avatars.push({                                                                                                     //
      service: 'github',                                                                                               //
      url: "https://avatars.githubusercontent.com/" + user.services.github.username + "?s=200"                         //
    });                                                                                                                //
  }                                                                                                                    //
  if ((((ref3 = user.services.linkedin) != null ? ref3.pictureUrl : void 0) != null) && RocketChat.settings.get('Accounts_OAuth_Linkedin')) {
    avatars.push({                                                                                                     //
      service: 'linkedin',                                                                                             //
      url: user.services.linkedin.pictureUrl                                                                           //
    });                                                                                                                //
  }                                                                                                                    //
  if ((((ref4 = user.services.twitter) != null ? ref4.profile_image_url_https : void 0) != null) && RocketChat.settings.get('Accounts_OAuth_Twitter')) {
    avatars.push({                                                                                                     //
      service: 'twitter',                                                                                              //
      url: user.services.twitter.profile_image_url_https                                                               //
    });                                                                                                                //
  }                                                                                                                    //
  if ((((ref5 = user.services.gitlab) != null ? ref5.avatar_url : void 0) != null) && RocketChat.settings.get('Accounts_OAuth_Gitlab')) {
    avatars.push({                                                                                                     //
      service: 'gitlab',                                                                                               //
      url: user.services.gitlab.avatar_url                                                                             //
    });                                                                                                                //
  }                                                                                                                    //
  if ((((ref6 = user.services.sandstorm) != null ? ref6.picture : void 0) != null) && Meteor.settings["public"].sandstorm) {
    avatars.push({                                                                                                     //
      service: 'sandstorm',                                                                                            //
      url: user.services.sandstorm.picture                                                                             //
    });                                                                                                                //
  }                                                                                                                    //
  if (((ref7 = user.emails) != null ? ref7.length : void 0) > 0) {                                                     //
    ref8 = user.emails;                                                                                                // 43
    for (i = 0, len = ref8.length; i < len; i++) {                                                                     // 43
      email = ref8[i];                                                                                                 //
      if (email.verified === true) {                                                                                   //
        avatars.push({                                                                                                 //
          service: 'gravatar',                                                                                         //
          url: Gravatar.imageUrl(email.address, {                                                                      //
            "default": '404',                                                                                          //
            size: 200,                                                                                                 //
            secure: true                                                                                               //
          })                                                                                                           //
        });                                                                                                            //
      }                                                                                                                //
    }                                                                                                                  // 43
    ref9 = user.emails;                                                                                                // 48
    for (j = 0, len1 = ref9.length; j < len1; j++) {                                                                   // 48
      email = ref9[j];                                                                                                 //
      if (email.verified !== true) {                                                                                   //
        avatars.push({                                                                                                 //
          service: 'gravatar',                                                                                         //
          url: Gravatar.imageUrl(email.address, {                                                                      //
            "default": '404',                                                                                          //
            size: 200,                                                                                                 //
            secure: true                                                                                               //
          })                                                                                                           //
        });                                                                                                            //
      }                                                                                                                //
    }                                                                                                                  // 48
  }                                                                                                                    //
  validAvatars = {};                                                                                                   //
  for (k = 0, len2 = avatars.length; k < len2; k++) {                                                                  // 54
    avatar = avatars[k];                                                                                               //
    try {                                                                                                              // 55
      result = HTTP.get(avatar.url, {                                                                                  //
        npmRequestOptions: {                                                                                           //
          encoding: 'binary'                                                                                           //
        }                                                                                                              //
      });                                                                                                              //
      if (result.statusCode === 200) {                                                                                 //
        blob = "data:" + result.headers['content-type'] + ";base64,";                                                  //
        blob += Buffer(result.content, 'binary').toString('base64');                                                   //
        avatar.blob = blob;                                                                                            //
        avatar.contentType = result.headers['content-type'];                                                           //
        validAvatars[avatar.service] = avatar;                                                                         //
      }                                                                                                                //
    } catch (error) {                                                                                                  //
      e = error;                                                                                                       //
    }                                                                                                                  //
  }                                                                                                                    // 54
  return validAvatars;                                                                                                 // 66
};                                                                                                                     // 1
                                                                                                                       //
Meteor.methods({                                                                                                       // 69
  getAvatarSuggestion: function() {                                                                                    //
    var user;                                                                                                          // 71
    if (!Meteor.userId()) {                                                                                            //
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                   // 72
        method: 'getAvatarSuggestion'                                                                                  //
      });                                                                                                              //
    }                                                                                                                  //
    this.unblock();                                                                                                    //
    user = Meteor.user();                                                                                              //
    return getAvatarSuggestionForUser(user);                                                                           //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getRoomIdByNameOrId.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/getRoomIdByNameOrId.coffee.js                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                       // 1
  getRoomIdByNameOrId: function(rid) {                                                                                 //
    var ref, room;                                                                                                     // 4
    check(rid, String);                                                                                                //
    if (!Meteor.userId()) {                                                                                            //
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                   // 7
        method: 'getRoomIdByNameOrId'                                                                                  //
      });                                                                                                              //
    }                                                                                                                  //
    room = RocketChat.models.Rooms.findOneById(rid) || RocketChat.models.Rooms.findOneByName(rid);                     //
    if (room == null) {                                                                                                //
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                     // 12
        method: 'getRoomIdByNameOrId'                                                                                  //
      });                                                                                                              //
    }                                                                                                                  //
    if (room.usernames.indexOf((ref = Meteor.user()) != null ? ref.username : void 0) !== -1) {                        //
      return room._id;                                                                                                 // 15
    }                                                                                                                  //
    if (room.t !== 'c' || RocketChat.authz.hasPermission(Meteor.userId(), 'view-c-room') !== true) {                   //
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                     // 18
        method: 'getRoomIdByNameOrId'                                                                                  //
      });                                                                                                              //
    }                                                                                                                  //
    return room._id;                                                                                                   // 20
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getTotalChannels.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/getTotalChannels.coffee.js                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                       // 1
  getTotalChannels: function() {                                                                                       //
    if (!Meteor.userId()) {                                                                                            //
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                   // 4
        method: 'getTotalChannels'                                                                                     //
      });                                                                                                              //
    }                                                                                                                  //
    return RocketChat.models.Rooms.find({                                                                              // 6
      t: 'c'                                                                                                           //
    }).count();                                                                                                        //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getUsernameSuggestion.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/getUsernameSuggestion.coffee.js                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var slug, usernameIsAvaliable;                                                                                         // 1
                                                                                                                       //
slug = function(text) {                                                                                                // 1
  text = slugify(text, '.');                                                                                           //
  return text.replace(/[^0-9a-z-_.]/g, '');                                                                            // 3
};                                                                                                                     // 1
                                                                                                                       //
usernameIsAvaliable = function(username) {                                                                             // 5
  if (username.length < 1) {                                                                                           //
    return false;                                                                                                      // 7
  }                                                                                                                    //
  if (username === 'all') {                                                                                            //
    return false;                                                                                                      // 10
  }                                                                                                                    //
  return !RocketChat.models.Users.findOneByUsername({                                                                  // 12
    $regex: new RegExp("^" + username + "$", "i")                                                                      //
  });                                                                                                                  //
};                                                                                                                     // 5
                                                                                                                       //
this.generateSuggestion = function(user) {                                                                             // 14
  var email, first, i, index, item, j, k, l, last, len, len1, len2, len3, nameParts, ref, ref1, ref2, ref3, ref4, service, services, username, usernames;
  usernames = [];                                                                                                      //
  username = void 0;                                                                                                   //
  if (Meteor.settings["public"].sandstorm) {                                                                           //
    usernames.push(user.services.sandstorm.preferredHandle);                                                           //
  }                                                                                                                    //
  if (Match.test(user != null ? user.name : void 0, String)) {                                                         //
    if (RocketChat.settings.get('UTF8_Names_Slugify')) {                                                               //
      usernames.push(slug(user.name));                                                                                 //
    } else {                                                                                                           //
      usernames.push(user.name);                                                                                       //
    }                                                                                                                  //
    nameParts = user != null ? (ref = user.name) != null ? ref.split(' ') : void 0 : void 0;                           //
    if (nameParts.length > 1) {                                                                                        //
      first = nameParts[0];                                                                                            //
      last = nameParts[nameParts.length - 1];                                                                          //
      if (RocketChat.settings.get('UTF8_Names_Slugify')) {                                                             //
        usernames.push(slug(first[0] + last));                                                                         //
        usernames.push(slug(first + last[0]));                                                                         //
      } else {                                                                                                         //
        usernames.push(first[0] + last);                                                                               //
        usernames.push(first + last[0]);                                                                               //
      }                                                                                                                //
    }                                                                                                                  //
  }                                                                                                                    //
  if (((ref1 = user.profile) != null ? ref1.name : void 0) != null) {                                                  //
    if (RocketChat.settings.get('UTF8_Names_Slugify')) {                                                               //
      usernames.push(slug(user.profile.name));                                                                         //
    } else {                                                                                                           //
      usernames.push(user.profile.name);                                                                               //
    }                                                                                                                  //
  }                                                                                                                    //
  if (user.services != null) {                                                                                         //
    services = _.map(user.services, function(service) {                                                                //
      return _.values(_.pick(service, 'name', 'username', 'firstName', 'lastName'));                                   // 47
    });                                                                                                                //
    services = _.uniq(_.flatten(services));                                                                            //
    for (i = 0, len = services.length; i < len; i++) {                                                                 // 51
      service = services[i];                                                                                           //
      if (RocketChat.settings.get('UTF8_Names_Slugify')) {                                                             //
        usernames.push(slug(service));                                                                                 //
      } else {                                                                                                         //
        usernames.push(service);                                                                                       //
      }                                                                                                                //
    }                                                                                                                  // 51
  }                                                                                                                    //
  if (((ref2 = user.emails) != null ? ref2.length : void 0) > 0) {                                                     //
    ref3 = user.emails;                                                                                                // 58
    for (j = 0, len1 = ref3.length; j < len1; j++) {                                                                   // 58
      email = ref3[j];                                                                                                 //
      if ((email.address != null) && email.verified === true) {                                                        //
        usernames.push(slug(email.address.replace(/@.+$/, '')));                                                       //
      }                                                                                                                //
    }                                                                                                                  // 58
    ref4 = user.emails;                                                                                                // 61
    for (k = 0, len2 = ref4.length; k < len2; k++) {                                                                   // 61
      email = ref4[k];                                                                                                 //
      if ((email.address != null) && email.verified === true) {                                                        //
        usernames.push(slug(email.address.replace(/(.+)@(\w+).+/, '$1.$2')));                                          //
      }                                                                                                                //
    }                                                                                                                  // 61
  }                                                                                                                    //
  usernames = _.compact(usernames);                                                                                    //
  for (l = 0, len3 = usernames.length; l < len3; l++) {                                                                // 66
    item = usernames[l];                                                                                               //
    if (usernameIsAvaliable(item)) {                                                                                   //
      username = item;                                                                                                 //
      break;                                                                                                           // 69
    }                                                                                                                  //
  }                                                                                                                    // 66
  if (usernames.length === 0 || usernames[0].length === 0) {                                                           //
    usernames.push('user');                                                                                            //
  }                                                                                                                    //
  index = 0;                                                                                                           //
  while (username == null) {                                                                                           // 75
    index++;                                                                                                           //
    if (usernameIsAvaliable(usernames[0] + '-' + index)) {                                                             //
      username = usernames[0] + '-' + index;                                                                           //
    }                                                                                                                  //
  }                                                                                                                    //
  if (usernameIsAvaliable(username)) {                                                                                 //
    return username;                                                                                                   // 81
  }                                                                                                                    //
  return void 0;                                                                                                       // 83
};                                                                                                                     // 14
                                                                                                                       //
RocketChat.generateUsernameSuggestion = generateSuggestion;                                                            // 84
                                                                                                                       //
Meteor.methods({                                                                                                       // 86
  getUsernameSuggestion: function() {                                                                                  //
    var user;                                                                                                          // 88
    if (!Meteor.userId()) {                                                                                            //
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                   // 89
        method: 'getUsernameSuggestion'                                                                                //
      });                                                                                                              //
    }                                                                                                                  //
    user = Meteor.user();                                                                                              //
    return generateSuggestion(user);                                                                                   // 92
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getUsersOfRoom.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/getUsersOfRoom.js                                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	getUsersOfRoom: function () {                                                                                         // 2
		function getUsersOfRoom(roomId, showAll) {                                                                           // 1
			if (!Meteor.userId()) {                                                                                             // 3
				throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'getUsersOfRoom' });                        // 4
			}                                                                                                                   // 5
                                                                                                                       //
			var room = Meteor.call('canAccessRoom', roomId, Meteor.userId());                                                   // 7
			if (!room) {                                                                                                        // 8
				throw new Meteor.Error('error-invalid-room', 'Invalid room', { method: 'getUsersOfRoom' });                        // 9
			}                                                                                                                   // 10
                                                                                                                       //
			var filter = function () {                                                                                          // 12
				function filter(record) {                                                                                          // 12
					if (!record._user) {                                                                                              // 13
						console.log('Subscription without user', record._id);                                                            // 14
						return false;                                                                                                    // 15
					}                                                                                                                 // 16
                                                                                                                       //
					if (showAll === true) {                                                                                           // 18
						return true;                                                                                                     // 19
					}                                                                                                                 // 20
                                                                                                                       //
					return record._user.status !== 'offline';                                                                         // 22
				}                                                                                                                  // 23
                                                                                                                       //
				return filter;                                                                                                     // 12
			}();                                                                                                                // 12
                                                                                                                       //
			var map = function () {                                                                                             // 25
				function map(record) {                                                                                             // 25
					return record._user.username;                                                                                     // 26
				}                                                                                                                  // 27
                                                                                                                       //
				return map;                                                                                                        // 25
			}();                                                                                                                // 25
                                                                                                                       //
			var records = RocketChat.models.Subscriptions.findByRoomId(roomId).fetch();                                         // 29
                                                                                                                       //
			return {                                                                                                            // 31
				total: records.length,                                                                                             // 32
				records: records.filter(filter).map(map)                                                                           // 33
			};                                                                                                                  // 31
		}                                                                                                                    // 35
                                                                                                                       //
		return getUsersOfRoom;                                                                                               // 1
	}()                                                                                                                   // 1
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"groupsList.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/groupsList.js                                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	groupsList: function () {                                                                                             // 2
		function groupsList(nameFilter, limit, sort) {                                                                       // 2
                                                                                                                       //
			check(nameFilter, String);                                                                                          // 4
			check(limit, Match.Optional(Number));                                                                               // 5
			check(sort, Match.Optional(String));                                                                                // 6
                                                                                                                       //
			if (!Meteor.userId()) {                                                                                             // 8
				throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'groupsList' });                            // 9
			}                                                                                                                   // 10
                                                                                                                       //
			var options = {                                                                                                     // 12
				fields: { name: 1 },                                                                                               // 13
				sort: { name: 1 }                                                                                                  // 14
			};                                                                                                                  // 12
                                                                                                                       //
			//Verify the limit param is a number                                                                                // 17
			if (_.isNumber(limit)) {                                                                                            // 18
				options.limit = limit;                                                                                             // 19
			}                                                                                                                   // 20
                                                                                                                       //
			//Verify there is a sort option and it's a string                                                                   // 22
			if (_.trim(sort)) {                                                                                                 // 23
				switch (sort) {                                                                                                    // 24
					case 'name':                                                                                                      // 25
						options.sort = { name: 1 };                                                                                      // 26
						break;                                                                                                           // 27
					case 'msgs':                                                                                                      // 28
						options.sort = { msgs: -1 };                                                                                     // 29
						break;                                                                                                           // 30
				}                                                                                                                  // 24
			}                                                                                                                   // 32
                                                                                                                       //
			//Determine if they are searching or not, base it upon the name field                                               // 34
			if (nameFilter) {                                                                                                   // 35
				return { groups: RocketChat.models.Rooms.findByTypeAndNameContainingUsername('p', new RegExp(s.trim(s.escapeRegExp(nameFilter)), 'i'), Meteor.user().username, options).fetch() };
			} else {                                                                                                            // 37
				var roomIds = _.pluck(RocketChat.models.Subscriptions.findByTypeAndUserId('p', Meteor.userId()).fetch(), 'rid');   // 38
				return { groups: RocketChat.models.Rooms.findByIds(roomIds, options).fetch() };                                    // 39
			}                                                                                                                   // 40
		}                                                                                                                    // 41
                                                                                                                       //
		return groupsList;                                                                                                   // 2
	}()                                                                                                                   // 2
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"hideRoom.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/hideRoom.coffee.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                       // 1
  hideRoom: function(rid) {                                                                                            //
    check(rid, String);                                                                                                //
    if (!Meteor.userId()) {                                                                                            //
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                   // 7
        method: 'hideRoom'                                                                                             //
      });                                                                                                              //
    }                                                                                                                  //
    return RocketChat.models.Subscriptions.hideByRoomIdAndUserId(rid, Meteor.userId());                                //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"loadHistory.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/loadHistory.coffee.js                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var hideMessagesOfType;                                                                                                // 1
                                                                                                                       //
hideMessagesOfType = [];                                                                                               // 1
                                                                                                                       //
RocketChat.settings.get(/Message_HideType_.+/, function(key, value) {                                                  // 2
  var index, type;                                                                                                     // 3
  type = key.replace('Message_HideType_', '');                                                                         //
  index = hideMessagesOfType.indexOf(type);                                                                            //
  if (value === true && index === -1) {                                                                                //
    return hideMessagesOfType.push(type);                                                                              //
  } else if (index > -1) {                                                                                             //
    return hideMessagesOfType.splice(index, 1);                                                                        //
  }                                                                                                                    //
});                                                                                                                    // 2
                                                                                                                       //
Meteor.methods({                                                                                                       // 12
  loadHistory: function(rid, end, limit, ls) {                                                                         //
    var firstMessage, firstUnread, fromId, messages, options, records, room, unreadMessages, unreadNotLoaded;          // 15
    if (limit == null) {                                                                                               //
      limit = 20;                                                                                                      //
    }                                                                                                                  //
    check(rid, String);                                                                                                //
    if (!Meteor.userId()) {                                                                                            //
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                   // 21
        method: 'loadHistory'                                                                                          //
      });                                                                                                              //
    }                                                                                                                  //
    fromId = Meteor.userId();                                                                                          //
    room = Meteor.call('canAccessRoom', rid, fromId);                                                                  //
    if (!room) {                                                                                                       //
      return false;                                                                                                    // 26
    }                                                                                                                  //
    if (room.t === 'c' && !RocketChat.authz.hasPermission(fromId, 'preview-c-room') && room.usernames.indexOf(room.username) === -1) {
      return false;                                                                                                    // 29
    }                                                                                                                  //
    options = {                                                                                                        //
      sort: {                                                                                                          //
        ts: -1                                                                                                         //
      },                                                                                                               //
      limit: limit                                                                                                     //
    };                                                                                                                 //
    if (!RocketChat.settings.get('Message_ShowEditedStatus')) {                                                        //
      options.fields = {                                                                                               //
        'editedAt': 0                                                                                                  //
      };                                                                                                               //
    }                                                                                                                  //
    if (end != null) {                                                                                                 //
      records = RocketChat.models.Messages.findVisibleByRoomIdBeforeTimestampNotContainingTypes(rid, end, hideMessagesOfType, options).fetch();
    } else {                                                                                                           //
      records = RocketChat.models.Messages.findVisibleByRoomIdNotContainingTypes(rid, hideMessagesOfType, options).fetch();
    }                                                                                                                  //
    messages = _.map(records, function(message) {                                                                      //
      message.starred = _.findWhere(message.starred, {                                                                 //
        _id: fromId                                                                                                    //
      });                                                                                                              //
      return message;                                                                                                  // 46
    });                                                                                                                //
    unreadNotLoaded = 0;                                                                                               //
    if (ls != null) {                                                                                                  //
      firstMessage = messages[messages.length - 1];                                                                    //
      if ((firstMessage != null ? firstMessage.ts : void 0) > ls) {                                                    //
        delete options.limit;                                                                                          //
        unreadMessages = RocketChat.models.Messages.findVisibleByRoomIdBetweenTimestampsNotContainingTypes(rid, ls, firstMessage.ts, hideMessagesOfType, {
          limit: 1,                                                                                                    //
          sort: {                                                                                                      //
            ts: 1                                                                                                      //
          }                                                                                                            //
        });                                                                                                            //
        firstUnread = unreadMessages.fetch()[0];                                                                       //
        unreadNotLoaded = unreadMessages.count();                                                                      //
      }                                                                                                                //
    }                                                                                                                  //
    return {                                                                                                           // 58
      messages: messages,                                                                                              //
      firstUnread: firstUnread,                                                                                        //
      unreadNotLoaded: unreadNotLoaded                                                                                 //
    };                                                                                                                 //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"loadLocale.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/loadLocale.coffee.js                                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                       // 1
  loadLocale: function(locale) {                                                                                       //
    var e;                                                                                                             // 4
    check(locale, String);                                                                                             //
    try {                                                                                                              // 6
      return Assets.getText("moment-locales/" + (locale.toLowerCase()) + ".js");                                       // 7
    } catch (error) {                                                                                                  //
      e = error;                                                                                                       //
      return console.log(e);                                                                                           //
    }                                                                                                                  //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"loadMissedMessages.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/loadMissedMessages.coffee.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                       // 1
  loadMissedMessages: function(rid, start) {                                                                           //
    var fromId, options;                                                                                               // 4
    check(rid, String);                                                                                                //
    check(start, Date);                                                                                                //
    if (!Meteor.userId()) {                                                                                            //
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                   // 8
        method: 'loadMissedMessages'                                                                                   //
      });                                                                                                              //
    }                                                                                                                  //
    fromId = Meteor.userId();                                                                                          //
    if (!Meteor.call('canAccessRoom', rid, fromId)) {                                                                  //
      return false;                                                                                                    // 12
    }                                                                                                                  //
    options = {                                                                                                        //
      sort: {                                                                                                          //
        ts: -1                                                                                                         //
      }                                                                                                                //
    };                                                                                                                 //
    if (!RocketChat.settings.get('Message_ShowEditedStatus')) {                                                        //
      options.fields = {                                                                                               //
        'editedAt': 0                                                                                                  //
      };                                                                                                               //
    }                                                                                                                  //
    return RocketChat.models.Messages.findVisibleByRoomIdAfterTimestamp(rid, start, options).fetch();                  // 21
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"loadNextMessages.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/loadNextMessages.coffee.js                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                       // 1
  loadNextMessages: function(rid, end, limit) {                                                                        //
    var fromId, messages, options, records;                                                                            // 4
    if (limit == null) {                                                                                               //
      limit = 20;                                                                                                      //
    }                                                                                                                  //
    check(rid, String);                                                                                                //
    check(limit, Number);                                                                                              //
    if (!Meteor.userId()) {                                                                                            //
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                   // 9
        method: 'loadNextMessages'                                                                                     //
      });                                                                                                              //
    }                                                                                                                  //
    fromId = Meteor.userId();                                                                                          //
    if (!Meteor.call('canAccessRoom', rid, fromId)) {                                                                  //
      return false;                                                                                                    // 14
    }                                                                                                                  //
    options = {                                                                                                        //
      sort: {                                                                                                          //
        ts: 1                                                                                                          //
      },                                                                                                               //
      limit: limit                                                                                                     //
    };                                                                                                                 //
    if (!RocketChat.settings.get('Message_ShowEditedStatus')) {                                                        //
      options.fields = {                                                                                               //
        'editedAt': 0                                                                                                  //
      };                                                                                                               //
    }                                                                                                                  //
    if (end != null) {                                                                                                 //
      records = RocketChat.models.Messages.findVisibleByRoomIdAfterTimestamp(rid, end, options).fetch();               //
    } else {                                                                                                           //
      records = RocketChat.models.Messages.findVisibleByRoomId(rid, options).fetch();                                  //
    }                                                                                                                  //
    messages = _.map(records, function(message) {                                                                      //
      message.starred = _.findWhere(message.starred, {                                                                 //
        _id: fromId                                                                                                    //
      });                                                                                                              //
      return message;                                                                                                  // 31
    });                                                                                                                //
    return {                                                                                                           // 33
      messages: messages                                                                                               //
    };                                                                                                                 //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"loadSurroundingMessages.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/loadSurroundingMessages.coffee.js                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                       // 1
  loadSurroundingMessages: function(message, limit) {                                                                  //
    var afterMessages, fromId, messages, moreAfter, moreBefore, options, records;                                      // 4
    if (limit == null) {                                                                                               //
      limit = 50;                                                                                                      //
    }                                                                                                                  //
    check(message, Object);                                                                                            //
    check(limit, Number);                                                                                              //
    if (!Meteor.userId()) {                                                                                            //
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                   // 8
        method: 'loadSurroundingMessages'                                                                              //
      });                                                                                                              //
    }                                                                                                                  //
    fromId = Meteor.userId();                                                                                          //
    if (!message._id) {                                                                                                //
      return false;                                                                                                    // 13
    }                                                                                                                  //
    message = RocketChat.models.Messages.findOneById(message._id);                                                     //
    if (!(message != null ? message.rid : void 0)) {                                                                   //
      return false;                                                                                                    // 18
    }                                                                                                                  //
    if (!Meteor.call('canAccessRoom', message.rid, fromId)) {                                                          //
      return false;                                                                                                    // 21
    }                                                                                                                  //
    limit = limit - 1;                                                                                                 //
    options = {                                                                                                        //
      sort: {                                                                                                          //
        ts: -1                                                                                                         //
      },                                                                                                               //
      limit: Math.ceil(limit / 2)                                                                                      //
    };                                                                                                                 //
    if (!RocketChat.settings.get('Message_ShowEditedStatus')) {                                                        //
      options.fields = {                                                                                               //
        'editedAt': 0                                                                                                  //
      };                                                                                                               //
    }                                                                                                                  //
    records = RocketChat.models.Messages.findVisibleByRoomIdBeforeTimestamp(message.rid, message.ts, options).fetch();
    messages = _.map(records, function(message) {                                                                      //
      message.starred = _.findWhere(message.starred, {                                                                 //
        _id: fromId                                                                                                    //
      });                                                                                                              //
      return message;                                                                                                  // 36
    });                                                                                                                //
    moreBefore = messages.length === options.limit;                                                                    //
    messages.push(message);                                                                                            //
    options.sort = {                                                                                                   //
      ts: 1                                                                                                            //
    };                                                                                                                 //
    options.limit = Math.floor(limit / 2);                                                                             //
    records = RocketChat.models.Messages.findVisibleByRoomIdAfterTimestamp(message.rid, message.ts, options).fetch();  //
    afterMessages = _.map(records, function(message) {                                                                 //
      message.starred = _.findWhere(message.starred, {                                                                 //
        _id: fromId                                                                                                    //
      });                                                                                                              //
      return message;                                                                                                  // 48
    });                                                                                                                //
    moreAfter = afterMessages.length === options.limit;                                                                //
    messages = messages.concat(afterMessages);                                                                         //
    return {                                                                                                           // 54
      messages: messages,                                                                                              //
      moreBefore: moreBefore,                                                                                          //
      moreAfter: moreAfter                                                                                             //
    };                                                                                                                 //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"logoutCleanUp.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/logoutCleanUp.coffee.js                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                       // 1
  logoutCleanUp: function(user) {                                                                                      //
    check(user, Object);                                                                                               //
    return Meteor.defer(function() {                                                                                   //
      return RocketChat.callbacks.run('afterLogoutCleanUp', user);                                                     //
    });                                                                                                                //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"messageSearch.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/messageSearch.js                                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	messageSearch: function () {                                                                                          // 2
		function messageSearch(text, rid, limit) {                                                                           // 2
			var from, mention, options, query, r, result, currentUserName, currentUserId, currentUserTimezoneOffset;            // 3
			check(text, String);                                                                                                // 4
			check(rid, String);                                                                                                 // 5
			check(limit, Match.Optional(Number));                                                                               // 6
			currentUserId = Meteor.userId();                                                                                    // 7
			if (!currentUserId) {                                                                                               // 8
				throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                     // 9
					method: 'messageSearch'                                                                                           // 10
				});                                                                                                                // 9
			}                                                                                                                   // 12
			currentUserName = Meteor.user().username;                                                                           // 13
			currentUserTimezoneOffset = Meteor.user().utcOffset;                                                                // 14
                                                                                                                       //
			// I would place these methods at the bottom of the file for clarity but travis doesn't appreciate that.            // 16
			// (no-use-before-define)                                                                                           // 17
                                                                                                                       //
			function filterStarred() {                                                                                          // 19
				query['starred._id'] = currentUserId;                                                                              // 20
				return '';                                                                                                         // 21
			}                                                                                                                   // 22
                                                                                                                       //
			function filterUrl() {                                                                                              // 24
				query['urls.0'] = {                                                                                                // 25
					$exists: true                                                                                                     // 26
				};                                                                                                                 // 25
				return '';                                                                                                         // 28
			}                                                                                                                   // 29
                                                                                                                       //
			function filterPinned() {                                                                                           // 31
				query.pinned = true;                                                                                               // 32
				return '';                                                                                                         // 33
			}                                                                                                                   // 34
                                                                                                                       //
			function filterLocation() {                                                                                         // 36
				query.location = {                                                                                                 // 37
					$exist: true                                                                                                      // 38
				};                                                                                                                 // 37
				return '';                                                                                                         // 40
			}                                                                                                                   // 41
                                                                                                                       //
			function filterBeforeDate(_, day, month, year) {                                                                    // 43
				month--;                                                                                                           // 44
				var beforeDate = new Date(year, month, day);                                                                       // 45
				beforeDate.setHours(beforeDate.getUTCHours() + beforeDate.getTimezoneOffset() / 60 + currentUserTimezoneOffset);   // 46
				query.ts = {                                                                                                       // 47
					$lte: beforeDate                                                                                                  // 48
				};                                                                                                                 // 47
				return '';                                                                                                         // 50
			}                                                                                                                   // 51
                                                                                                                       //
			function filterAfterDate(_, day, month, year) {                                                                     // 53
				month--;                                                                                                           // 54
				day++;                                                                                                             // 55
				var afterDate = new Date(year, month, day);                                                                        // 56
				afterDate.setUTCHours(afterDate.getUTCHours() + afterDate.getTimezoneOffset() / 60 + currentUserTimezoneOffset);   // 57
				if (query.ts) {                                                                                                    // 58
					query.ts.$gte = afterDate;                                                                                        // 59
				} else {                                                                                                           // 60
					query.ts = {                                                                                                      // 61
						$gte: afterDate                                                                                                  // 62
					};                                                                                                                // 61
				}                                                                                                                  // 64
				return '';                                                                                                         // 65
			}                                                                                                                   // 66
                                                                                                                       //
			function filterOnDate(_, day, month, year) {                                                                        // 68
				month--;                                                                                                           // 69
				var date, dayAfter;                                                                                                // 70
				date = new Date(year, month, day);                                                                                 // 71
				date.setUTCHours(date.getUTCHours() + date.getTimezoneOffset() / 60 + currentUserTimezoneOffset);                  // 72
				dayAfter = new Date(date);                                                                                         // 73
				dayAfter.setDate(dayAfter.getDate() + 1);                                                                          // 74
				delete query.ts;                                                                                                   // 75
				query.ts = {                                                                                                       // 76
					$gte: date,                                                                                                       // 77
					$lt: dayAfter                                                                                                     // 78
				};                                                                                                                 // 76
				return '';                                                                                                         // 80
			}                                                                                                                   // 81
                                                                                                                       //
			function sortByTimestamp(_, direction) {                                                                            // 83
				if (direction.startsWith('asc')) {                                                                                 // 84
					options.sort.ts = 1;                                                                                              // 85
				} else if (direction.startsWith('desc')) {                                                                         // 86
					options.sort.ts = -1;                                                                                             // 87
				}                                                                                                                  // 88
				return '';                                                                                                         // 89
			}                                                                                                                   // 90
                                                                                                                       //
			/*                                                                                                                  // 92
    text = 'from:rodrigo mention:gabriel chat'                                                                         //
    */                                                                                                                 //
			result = {                                                                                                          // 95
				messages: [],                                                                                                      // 96
				users: [],                                                                                                         // 97
				channels: []                                                                                                       // 98
			};                                                                                                                  // 95
			query = {};                                                                                                         // 100
			options = {                                                                                                         // 101
				sort: {                                                                                                            // 102
					ts: -1                                                                                                            // 103
				},                                                                                                                 // 102
				limit: limit || 20                                                                                                 // 105
			};                                                                                                                  // 101
                                                                                                                       //
			// Query for senders                                                                                                // 108
			from = [];                                                                                                          // 109
			text = text.replace(/from:([a-z0-9.-_]+)/ig, function (match, username) {                                           // 110
				if (username === 'me' && !from.includes(currentUserName)) {                                                        // 111
					username = currentUserName;                                                                                       // 112
				}                                                                                                                  // 113
				from.push(username);                                                                                               // 114
				return '';                                                                                                         // 115
			});                                                                                                                 // 116
			if (from.length > 0) {                                                                                              // 117
				query['u.username'] = {                                                                                            // 118
					$regex: from.join('|'),                                                                                           // 119
					$options: 'i'                                                                                                     // 120
				};                                                                                                                 // 118
			}                                                                                                                   // 122
			// Query for senders                                                                                                // 123
			mention = [];                                                                                                       // 124
			text = text.replace(/mention:([a-z0-9.-_]+)/ig, function (match, username) {                                        // 125
				mention.push(username);                                                                                            // 126
				return '';                                                                                                         // 127
			});                                                                                                                 // 128
			if (mention.length > 0) {                                                                                           // 129
				query['mentions.username'] = {                                                                                     // 130
					$regex: mention.join('|'),                                                                                        // 131
					$options: 'i'                                                                                                     // 132
				};                                                                                                                 // 130
			}                                                                                                                   // 134
			// Filter on messages that are starred by the current user.                                                         // 135
			text = text.replace(/has:star/g, filterStarred);                                                                    // 136
			// Filter on messages that have an url.                                                                             // 137
			text = text.replace(/has:url|has:link/g, filterUrl);                                                                // 138
			// Filter on pinned messages.                                                                                       // 139
			text = text.replace(/is:pinned|has:pin/g, filterPinned);                                                            // 140
			// Filter on messages which have a location attached.                                                               // 141
			text = text.replace(/has:location|has:map/g, filterLocation);                                                       // 142
			// Filtering before/after/on a date                                                                                 // 143
			// matches dd-MM-yyyy, dd/MM/yyyy, dd-MM-yyyy, prefixed by before:, after: and on: respectively.                    // 144
			// Example: before:15/09/2016 after: 10-08-2016                                                                     // 145
			// if "on:" is set, "before:" and "after:" are ignored.                                                             // 146
			text = text.replace(/before:(\d{1,2})[\/\.-](\d{1,2})[\/\.-](\d{4})/g, filterBeforeDate);                           // 147
			text = text.replace(/after:(\d{1,2})[\/\.-](\d{1,2})[\/\.-](\d{4})/g, filterAfterDate);                             // 148
			text = text.replace(/on:(\d{1,2})[\/\.-](\d{1,2})[\/\.-](\d{4})/g, filterOnDate);                                   // 149
			// Sort order                                                                                                       // 150
			text = text.replace(/(?:order|sort):(asc|ascend|ascending|desc|descend|descening)/g, sortByTimestamp);              // 151
                                                                                                                       //
			// Query in message text                                                                                            // 153
			text = text.trim().replace(/\s\s/g, ' ');                                                                           // 154
			if (text !== '') {                                                                                                  // 155
				if (/^\/.+\/[imxs]*$/.test(text)) {                                                                                // 156
					r = text.split('/');                                                                                              // 157
					query.msg = {                                                                                                     // 158
						$regex: r[1],                                                                                                    // 159
						$options: r[2]                                                                                                   // 160
					};                                                                                                                // 158
				} else if (RocketChat.settings.get('Message_AlwaysSearchRegExp')) {                                                // 162
					query.msg = {                                                                                                     // 163
						$regex: text,                                                                                                    // 164
						$options: 'i'                                                                                                    // 165
					};                                                                                                                // 163
				} else {                                                                                                           // 167
					query.$text = {                                                                                                   // 168
						$search: text                                                                                                    // 169
					};                                                                                                                // 168
					options.fields = {                                                                                                // 171
						score: {                                                                                                         // 172
							$meta: 'textScore'                                                                                              // 173
						}                                                                                                                // 172
					};                                                                                                                // 171
				}                                                                                                                  // 176
			}                                                                                                                   // 177
			if (Object.keys(query).length > 0) {                                                                                // 178
				query.t = {                                                                                                        // 179
					$ne: 'rm' //hide removed messages (useful when searching for user messages)                                       // 180
				};                                                                                                                 // 179
				query._hidden = {                                                                                                  // 182
					$ne: true // don't return _hidden messages                                                                        // 183
				};                                                                                                                 // 182
				if (rid != null) {                                                                                                 // 185
					query.rid = rid;                                                                                                  // 186
					if (Meteor.call('canAccessRoom', rid, currentUserId) !== false) {                                                 // 187
						if (!RocketChat.settings.get('Message_ShowEditedStatus')) {                                                      // 188
							options.fields = {                                                                                              // 189
								'editedAt': 0                                                                                                  // 190
							};                                                                                                              // 189
						}                                                                                                                // 192
						result.messages = RocketChat.models.Messages.find(query, options).fetch();                                       // 193
					}                                                                                                                 // 194
				}                                                                                                                  // 195
			}                                                                                                                   // 196
                                                                                                                       //
			return result;                                                                                                      // 198
		}                                                                                                                    // 199
                                                                                                                       //
		return messageSearch;                                                                                                // 2
	}()                                                                                                                   // 2
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"migrate.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/migrate.coffee.js                                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                       // 1
  migrateTo: function(version) {                                                                                       //
    var user;                                                                                                          // 4
    check(version, String);                                                                                            //
    if (!Meteor.userId()) {                                                                                            //
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                   // 7
        method: 'migrateTo'                                                                                            //
      });                                                                                                              //
    }                                                                                                                  //
    user = Meteor.user();                                                                                              //
    if ((user == null) || RocketChat.authz.hasPermission(user._id, 'run-migration') !== true) {                        //
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                     // 12
        method: 'migrateTo'                                                                                            //
      });                                                                                                              //
    }                                                                                                                  //
    this.unblock();                                                                                                    //
    RocketChat.Migrations.migrateTo(version);                                                                          //
    return version;                                                                                                    // 16
  },                                                                                                                   //
  getMigrationVersion: function() {                                                                                    //
    if (!Meteor.userId()) {                                                                                            //
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                   // 20
        method: 'getMigrationVersion'                                                                                  //
      });                                                                                                              //
    }                                                                                                                  //
    return RocketChat.Migrations.getVersion();                                                                         // 22
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"muteUserInRoom.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/muteUserInRoom.coffee.js                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
  muteUserInRoom: function(data) {                                                                                     //
    var fromId, fromUser, mutedUser, ref, ref1, room;                                                                  // 4
    check(data, Match.ObjectIncluding({                                                                                //
      rid: String,                                                                                                     //
      username: String                                                                                                 //
    }));                                                                                                               //
    if (!Meteor.userId()) {                                                                                            //
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                   // 7
        method: 'muteUserInRoom'                                                                                       //
      });                                                                                                              //
    }                                                                                                                  //
    fromId = Meteor.userId();                                                                                          //
    if (!RocketChat.authz.hasPermission(fromId, 'mute-user', data.rid)) {                                              //
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                     // 12
        method: 'muteUserInRoom'                                                                                       //
      });                                                                                                              //
    }                                                                                                                  //
    room = RocketChat.models.Rooms.findOneById(data.rid);                                                              //
    if (!room) {                                                                                                       //
      throw new Meteor.Error('error-invalid-room', 'Invalid room', {                                                   // 16
        method: 'muteUserInRoom'                                                                                       //
      });                                                                                                              //
    }                                                                                                                  //
    if ((ref = room.t) !== 'c' && ref !== 'p') {                                                                       //
      throw new Meteor.Error('error-invalid-room-type', room.t + ' is not a valid room type', {                        // 19
        method: 'muteUserInRoom',                                                                                      //
        type: room.t                                                                                                   //
      });                                                                                                              //
    }                                                                                                                  //
    if (ref1 = data.username, indexOf.call((room != null ? room.usernames : void 0) || [], ref1) < 0) {                //
      throw new Meteor.Error('error-user-not-in-room', 'User is not in this room', {                                   // 22
        method: 'muteUserInRoom'                                                                                       //
      });                                                                                                              //
    }                                                                                                                  //
    mutedUser = RocketChat.models.Users.findOneByUsername(data.username);                                              //
    RocketChat.models.Rooms.muteUsernameByRoomId(data.rid, mutedUser.username);                                        //
    fromUser = RocketChat.models.Users.findOneById(fromId);                                                            //
    RocketChat.models.Messages.createUserMutedWithRoomIdAndUser(data.rid, mutedUser, {                                 //
      u: {                                                                                                             //
        _id: fromUser._id,                                                                                             //
        username: fromUser.username                                                                                    //
      }                                                                                                                //
    });                                                                                                                //
    return true;                                                                                                       // 34
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"openRoom.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/openRoom.coffee.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                       // 1
  openRoom: function(rid) {                                                                                            //
    check(rid, String);                                                                                                //
    if (!Meteor.userId()) {                                                                                            //
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                   // 7
        method: 'openRoom'                                                                                             //
      });                                                                                                              //
    }                                                                                                                  //
    return RocketChat.models.Subscriptions.openByRoomIdAndUserId(rid, Meteor.userId());                                //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"readMessages.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/readMessages.coffee.js                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                       // 1
  readMessages: function(rid) {                                                                                        //
    check(rid, String);                                                                                                //
    if (!Meteor.userId()) {                                                                                            //
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                   // 7
        method: 'readMessages'                                                                                         //
      });                                                                                                              //
    }                                                                                                                  //
    return RocketChat.models.Subscriptions.setAsReadByRoomIdAndUserId(rid, Meteor.userId());                           //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"registerUser.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/registerUser.coffee.js                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                       // 1
  registerUser: function(formData) {                                                                                   //
    var error, importedUser, ref, userData, userId;                                                                    // 4
    check(formData, Object);                                                                                           //
    if (RocketChat.settings.get('Accounts_RegistrationForm') === 'Disabled') {                                         //
      throw new Meteor.Error('error-user-registration-disabled', 'User registration is disabled', {                    // 7
        method: 'registerUser'                                                                                         //
      });                                                                                                              //
    } else if (RocketChat.settings.get('Accounts_RegistrationForm') === 'Secret URL' && (!formData.secretURL || formData.secretURL !== RocketChat.settings.get('Accounts_RegistrationForm_SecretURL'))) {
      throw new Meteor.Error('error-user-registration-secret', 'User registration is only allowed via Secret URL', {   // 10
        method: 'registerUser'                                                                                         //
      });                                                                                                              //
    }                                                                                                                  //
    RocketChat.validateEmailDomain(formData.email);                                                                    //
    userData = {                                                                                                       //
      email: s.trim(formData.email.toLowerCase()),                                                                     //
      password: formData.pass                                                                                          //
    };                                                                                                                 //
    importedUser = RocketChat.models.Users.findOneByEmailAddress(s.trim(formData.email.toLowerCase()));                //
    if ((importedUser != null ? (ref = importedUser.importIds) != null ? ref.length : void 0 : void 0) && !importedUser.lastLogin) {
      Accounts.setPassword(importedUser._id, userData.password);                                                       //
      userId = importedUser._id;                                                                                       //
    } else {                                                                                                           //
      userId = Accounts.createUser(userData);                                                                          //
    }                                                                                                                  //
    RocketChat.models.Users.setName(userId, s.trim(formData.name));                                                    //
    RocketChat.saveCustomFields(userId, formData);                                                                     //
    try {                                                                                                              // 30
      if (userData.email) {                                                                                            //
        Accounts.sendVerificationEmail(userId, userData.email);                                                        //
      }                                                                                                                //
    } catch (error1) {                                                                                                 //
      error = error1;                                                                                                  //
    }                                                                                                                  //
    return userId;                                                                                                     // 36
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"removeRoomModerator.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/removeRoomModerator.coffee.js                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                       // 1
  removeRoomModerator: function(rid, userId) {                                                                         //
    var fromUser, subscription, user;                                                                                  // 4
    check(rid, String);                                                                                                //
    check(userId, String);                                                                                             //
    if (!Meteor.userId()) {                                                                                            //
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                   // 8
        method: 'removeRoomModerator'                                                                                  //
      });                                                                                                              //
    }                                                                                                                  //
    if (!RocketChat.authz.hasPermission(Meteor.userId(), 'set-moderator', rid)) {                                      //
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                     // 11
        method: 'removeRoomModerator'                                                                                  //
      });                                                                                                              //
    }                                                                                                                  //
    subscription = RocketChat.models.Subscriptions.findOneByRoomIdAndUserId(rid, userId);                              //
    if (subscription == null) {                                                                                        //
      throw new Meteor.Error('error-invalid-room', 'Invalid room', {                                                   // 15
        method: 'removeRoomModerator'                                                                                  //
      });                                                                                                              //
    }                                                                                                                  //
    RocketChat.models.Subscriptions.removeRoleById(subscription._id, 'moderator');                                     //
    user = RocketChat.models.Users.findOneById(userId);                                                                //
    fromUser = RocketChat.models.Users.findOneById(Meteor.userId());                                                   //
    RocketChat.models.Messages.createSubscriptionRoleRemovedWithRoomIdAndUser(rid, user, {                             //
      u: {                                                                                                             //
        _id: fromUser._id,                                                                                             //
        username: fromUser.username                                                                                    //
      },                                                                                                               //
      role: 'moderator'                                                                                                //
    });                                                                                                                //
    if (RocketChat.settings.get('UI_DisplayRoles')) {                                                                  //
      RocketChat.Notifications.notifyAll('roles-change', {                                                             //
        type: 'removed',                                                                                               //
        _id: 'moderator',                                                                                              //
        u: {                                                                                                           //
          _id: user._id,                                                                                               //
          username: user.username                                                                                      //
        },                                                                                                             //
        scope: rid                                                                                                     //
      });                                                                                                              //
    }                                                                                                                  //
    return true;                                                                                                       // 30
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"removeRoomOwner.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/removeRoomOwner.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                       // 1
  removeRoomOwner: function(rid, userId) {                                                                             //
    var fromUser, numOwners, subscription, user;                                                                       // 4
    check(rid, String);                                                                                                //
    check(userId, String);                                                                                             //
    if (!Meteor.userId()) {                                                                                            //
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                   // 8
        method: 'removeRoomOwner'                                                                                      //
      });                                                                                                              //
    }                                                                                                                  //
    if (!RocketChat.authz.hasPermission(Meteor.userId(), 'set-owner', rid)) {                                          //
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                     // 11
        method: 'removeRoomOwner'                                                                                      //
      });                                                                                                              //
    }                                                                                                                  //
    subscription = RocketChat.models.Subscriptions.findOneByRoomIdAndUserId(rid, userId);                              //
    if (subscription == null) {                                                                                        //
      throw new Meteor.Error('error-invalid-room', 'Invalid room', {                                                   // 15
        method: 'removeRoomOwner'                                                                                      //
      });                                                                                                              //
    }                                                                                                                  //
    numOwners = RocketChat.authz.getUsersInRole('owner', rid).count();                                                 //
    if (numOwners === 1) {                                                                                             //
      throw new Meteor.Error('error-remove-last-owner', 'This is the last owner. Please set a new owner before removing this one.', {
        method: 'removeRoomOwner'                                                                                      //
      });                                                                                                              //
    }                                                                                                                  //
    RocketChat.models.Subscriptions.removeRoleById(subscription._id, 'owner');                                         //
    user = RocketChat.models.Users.findOneById(userId);                                                                //
    fromUser = RocketChat.models.Users.findOneById(Meteor.userId());                                                   //
    RocketChat.models.Messages.createSubscriptionRoleRemovedWithRoomIdAndUser(rid, user, {                             //
      u: {                                                                                                             //
        _id: fromUser._id,                                                                                             //
        username: fromUser.username                                                                                    //
      },                                                                                                               //
      role: 'owner'                                                                                                    //
    });                                                                                                                //
    if (RocketChat.settings.get('UI_DisplayRoles')) {                                                                  //
      RocketChat.Notifications.notifyAll('roles-change', {                                                             //
        type: 'removed',                                                                                               //
        _id: 'owner',                                                                                                  //
        u: {                                                                                                           //
          _id: user._id,                                                                                               //
          username: user.username                                                                                      //
        },                                                                                                             //
        scope: rid                                                                                                     //
      });                                                                                                              //
    }                                                                                                                  //
    return true;                                                                                                       // 34
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"removeUserFromRoom.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/removeUserFromRoom.coffee.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
  removeUserFromRoom: function(data) {                                                                                 //
    var fromId, fromUser, numOwners, ref, ref1, removedUser, room;                                                     // 4
    check(data, Match.ObjectIncluding({                                                                                //
      rid: String,                                                                                                     //
      username: String                                                                                                 //
    }));                                                                                                               //
    if (!Meteor.userId()) {                                                                                            //
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                   // 7
        method: 'removeUserFromRoom'                                                                                   //
      });                                                                                                              //
    }                                                                                                                  //
    fromId = Meteor.userId();                                                                                          //
    if (!RocketChat.authz.hasPermission(fromId, 'remove-user', data.rid)) {                                            //
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                     // 12
        method: 'removeUserFromRoom'                                                                                   //
      });                                                                                                              //
    }                                                                                                                  //
    room = RocketChat.models.Rooms.findOneById(data.rid);                                                              //
    if (ref = data.username, indexOf.call((room != null ? room.usernames : void 0) || [], ref) < 0) {                  //
      throw new Meteor.Error('error-user-not-in-room', 'User is not in this room', {                                   // 17
        method: 'removeUserFromRoom'                                                                                   //
      });                                                                                                              //
    }                                                                                                                  //
    removedUser = RocketChat.models.Users.findOneByUsername(data.username);                                            //
    if (RocketChat.authz.hasRole(removedUser._id, 'owner', room._id)) {                                                //
      numOwners = RocketChat.authz.getUsersInRole('owner', room._id).fetch().length;                                   //
      if (numOwners === 1) {                                                                                           //
        throw new Meteor.Error('error-you-are-last-owner', 'You are the last owner. Please set new owner before leaving the room.', {
          method: 'removeUserFromRoom'                                                                                 //
        });                                                                                                            //
      }                                                                                                                //
    }                                                                                                                  //
    RocketChat.models.Rooms.removeUsernameById(data.rid, data.username);                                               //
    RocketChat.models.Subscriptions.removeByRoomIdAndUserId(data.rid, removedUser._id);                                //
    if ((ref1 = room.t) === 'c' || ref1 === 'p') {                                                                     //
      RocketChat.authz.removeUserFromRoles(removedUser._id, ['moderator', 'owner'], data.rid);                         //
    }                                                                                                                  //
    fromUser = RocketChat.models.Users.findOneById(fromId);                                                            //
    RocketChat.models.Messages.createUserRemovedWithRoomIdAndUser(data.rid, removedUser, {                             //
      u: {                                                                                                             //
        _id: fromUser._id,                                                                                             //
        username: fromUser.username                                                                                    //
      }                                                                                                                //
    });                                                                                                                //
    return true;                                                                                                       // 39
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"reportMessage.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/reportMessage.coffee.js                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                       // 1
  reportMessage: function(message, description) {                                                                      //
    check(message, Object);                                                                                            //
    check(description, String);                                                                                        //
    if (!Meteor.userId()) {                                                                                            //
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                   // 8
        method: 'reportMessage'                                                                                        //
      });                                                                                                              //
    }                                                                                                                  //
    if ((description == null) || description.trim() === '') {                                                          //
      throw new Meteor.Error('error-invalid-description', 'Invalid description', {                                     // 11
        method: 'reportMessage'                                                                                        //
      });                                                                                                              //
    }                                                                                                                  //
    return RocketChat.models.Reports.createWithMessageDescriptionAndUserId(message, description, Meteor.userId());     //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"resetAvatar.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/resetAvatar.coffee.js                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                       // 1
  resetAvatar: function() {                                                                                            //
    var user;                                                                                                          // 3
    if (!Meteor.userId()) {                                                                                            //
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                   // 4
        method: 'resetAvatar'                                                                                          //
      });                                                                                                              //
    }                                                                                                                  //
    if (!RocketChat.settings.get("Accounts_AllowUserAvatarChange")) {                                                  //
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                     // 7
        method: 'resetAvatar'                                                                                          //
      });                                                                                                              //
    }                                                                                                                  //
    user = Meteor.user();                                                                                              //
    RocketChatFileAvatarInstance.deleteFile(user.username + ".jpg");                                                   //
    RocketChat.models.Users.unsetAvatarOrigin(user._id);                                                               //
    RocketChat.Notifications.notifyAll('updateAvatar', {                                                               //
      username: user.username                                                                                          //
    });                                                                                                                //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
DDPRateLimiter.addRule({                                                                                               // 19
  type: 'method',                                                                                                      //
  name: 'resetAvatar',                                                                                                 //
  userId: function() {                                                                                                 //
    return true;                                                                                                       // 22
  }                                                                                                                    //
}, 1, 60000);                                                                                                          //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"saveUserPreferences.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/saveUserPreferences.coffee.js                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                       // 1
  saveUserPreferences: function(settings) {                                                                            //
    var preferences;                                                                                                   // 4
    check(settings, Object);                                                                                           //
    if (Meteor.userId()) {                                                                                             //
      preferences = {};                                                                                                //
      if (settings.language != null) {                                                                                 //
        RocketChat.models.Users.setLanguage(Meteor.userId(), settings.language);                                       //
      }                                                                                                                //
      if (settings.newRoomNotification != null) {                                                                      //
        preferences.newRoomNotification = settings.newRoomNotification === "1" ? true : false;                         //
      }                                                                                                                //
      if (settings.newMessageNotification != null) {                                                                   //
        preferences.newMessageNotification = settings.newMessageNotification === "1" ? true : false;                   //
      }                                                                                                                //
      if (settings.useEmojis != null) {                                                                                //
        preferences.useEmojis = settings.useEmojis === "1" ? true : false;                                             //
      }                                                                                                                //
      if (settings.convertAsciiEmoji != null) {                                                                        //
        preferences.convertAsciiEmoji = settings.convertAsciiEmoji === "1" ? true : false;                             //
      }                                                                                                                //
      if (settings.saveMobileBandwidth != null) {                                                                      //
        preferences.saveMobileBandwidth = settings.saveMobileBandwidth === "1" ? true : false;                         //
      }                                                                                                                //
      if (settings.collapseMediaByDefault != null) {                                                                   //
        preferences.collapseMediaByDefault = settings.collapseMediaByDefault === "1" ? true : false;                   //
      }                                                                                                                //
      if (settings.unreadRoomsMode != null) {                                                                          //
        preferences.unreadRoomsMode = settings.unreadRoomsMode === "1" ? true : false;                                 //
      }                                                                                                                //
      if (settings.autoImageLoad != null) {                                                                            //
        preferences.autoImageLoad = settings.autoImageLoad === "1" ? true : false;                                     //
      }                                                                                                                //
      if (settings.emailNotificationMode != null) {                                                                    //
        preferences.emailNotificationMode = settings.emailNotificationMode;                                            //
      }                                                                                                                //
      if (settings.mergeChannels !== "-1") {                                                                           //
        preferences.mergeChannels = settings.mergeChannels === "1";                                                    //
      } else {                                                                                                         //
        delete preferences.mergeChannels;                                                                              //
      }                                                                                                                //
      if (settings.unreadAlert != null) {                                                                              //
        preferences.unreadAlert = settings.unreadAlert === "1" ? true : false;                                         //
      }                                                                                                                //
      preferences.desktopNotificationDuration = settings.desktopNotificationDuration - 0;                              //
      preferences.viewMode = settings.viewMode || 0;                                                                   //
      preferences.hideUsernames = settings.hideUsernames === "1";                                                      //
      preferences.hideAvatars = settings.hideAvatars === "1";                                                          //
      preferences.hideFlexTab = settings.hideFlexTab === "1";                                                          //
      preferences.highlights = settings.highlights;                                                                    //
      RocketChat.models.Users.setPreferences(Meteor.userId(), preferences);                                            //
      return true;                                                                                                     // 56
    }                                                                                                                  //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"saveUserProfile.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/saveUserProfile.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                       // 1
  saveUserProfile: function(settings) {                                                                                //
    var checkPassword, profile, user;                                                                                  // 4
    check(settings, Object);                                                                                           //
    if (!RocketChat.settings.get("Accounts_AllowUserProfileChange")) {                                                 //
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                     // 7
        method: 'saveUserProfile'                                                                                      //
      });                                                                                                              //
    }                                                                                                                  //
    if (!Meteor.userId()) {                                                                                            //
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                   // 10
        method: 'saveUserProfile'                                                                                      //
      });                                                                                                              //
    }                                                                                                                  //
    user = RocketChat.models.Users.findOneById(Meteor.userId());                                                       //
    checkPassword = function(user, currentPassword) {                                                                  //
      var passCheck, ref, ref1;                                                                                        // 15
      if (!s.trim(user != null ? (ref = user.services) != null ? (ref1 = ref.password) != null ? ref1.bcrypt : void 0 : void 0 : void 0)) {
        return true;                                                                                                   // 16
      }                                                                                                                //
      if (!currentPassword) {                                                                                          //
        return false;                                                                                                  // 19
      }                                                                                                                //
      passCheck = Accounts._checkPassword(user, {                                                                      //
        digest: currentPassword,                                                                                       //
        algorithm: 'sha-256'                                                                                           //
      });                                                                                                              //
      if (passCheck.error) {                                                                                           //
        return false;                                                                                                  // 23
      }                                                                                                                //
      return true;                                                                                                     // 24
    };                                                                                                                 //
    if (settings.newPassword != null) {                                                                                //
      if (!checkPassword(user, settings.currentPassword)) {                                                            //
        throw new Meteor.Error('error-invalid-password', 'Invalid password', {                                         // 28
          method: 'saveUserProfile'                                                                                    //
        });                                                                                                            //
      }                                                                                                                //
      Accounts.setPassword(Meteor.userId(), settings.newPassword, {                                                    //
        logout: false                                                                                                  //
      });                                                                                                              //
    }                                                                                                                  //
    if (settings.realname != null) {                                                                                   //
      Meteor.call('setRealName', settings.realname);                                                                   //
    }                                                                                                                  //
    if (settings.username != null) {                                                                                   //
      Meteor.call('setUsername', settings.username);                                                                   //
    }                                                                                                                  //
    if (settings.email != null) {                                                                                      //
      if (!checkPassword(user, settings.currentPassword)) {                                                            //
        throw new Meteor.Error('error-invalid-password', 'Invalid password', {                                         // 39
          method: 'saveUserProfile'                                                                                    //
        });                                                                                                            //
      }                                                                                                                //
      Meteor.call('setEmail', settings.email);                                                                         //
    }                                                                                                                  //
    profile = {};                                                                                                      //
    RocketChat.models.Users.setProfile(Meteor.userId(), profile);                                                      //
    return true;                                                                                                       // 46
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"sendConfirmationEmail.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/sendConfirmationEmail.coffee.js                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                       // 1
  sendConfirmationEmail: function(email) {                                                                             //
    var error, user;                                                                                                   // 4
    check(email, String);                                                                                              //
    user = RocketChat.models.Users.findOneByEmailAddress(s.trim(email));                                               //
    if (user != null) {                                                                                                //
      try {                                                                                                            // 9
        Accounts.sendVerificationEmail(user._id, s.trim(email));                                                       //
      } catch (error1) {                                                                                               //
        error = error1;                                                                                                //
        throw new Meteor.Error('error-email-send-failed', 'Error trying to send email: ' + error.message, {            // 12
          method: 'registerUser',                                                                                      //
          message: error.message                                                                                       //
        });                                                                                                            //
      }                                                                                                                //
      return true;                                                                                                     // 14
    }                                                                                                                  //
    return false;                                                                                                      // 15
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"sendForgotPasswordEmail.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/sendForgotPasswordEmail.coffee.js                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                       // 1
  sendForgotPasswordEmail: function(email) {                                                                           //
    var error, regex, user;                                                                                            // 4
    check(email, String);                                                                                              //
    email = s.trim(email);                                                                                             //
    user = RocketChat.models.Users.findOneByEmailAddress(email);                                                       //
    if (user != null) {                                                                                                //
      regex = new RegExp("^" + s.escapeRegExp(email) + "$", 'i');                                                      //
      email = _.find(_.pluck(user.emails || [], 'address'), function(userEmail) {                                      //
        return regex.test(userEmail);                                                                                  // 13
      });                                                                                                              //
      try {                                                                                                            // 15
        Accounts.sendResetPasswordEmail(user._id, email);                                                              //
      } catch (error1) {                                                                                               //
        error = error1;                                                                                                //
        throw new Meteor.Error('error-email-send-failed', 'Error trying to send email: ' + error.message, {            // 18
          method: 'registerUser',                                                                                      //
          message: error.message                                                                                       //
        });                                                                                                            //
      }                                                                                                                //
      return true;                                                                                                     // 20
    }                                                                                                                  //
    return false;                                                                                                      // 22
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"setAvatarFromService.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/setAvatarFromService.coffee.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                       // 1
  setAvatarFromService: function(dataURI, contentType, service) {                                                      //
    var user;                                                                                                          // 4
    check(dataURI, String);                                                                                            //
    check(contentType, Match.Optional(String));                                                                        //
    check(service, Match.Optional(String));                                                                            //
    if (!Meteor.userId()) {                                                                                            //
      throw new Meteor.Error('error-invalid-user', "Invalid user", {                                                   // 9
        method: 'setAvatarFromService'                                                                                 //
      });                                                                                                              //
    }                                                                                                                  //
    if (!RocketChat.settings.get("Accounts_AllowUserAvatarChange")) {                                                  //
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                     // 12
        method: 'setAvatarFromService'                                                                                 //
      });                                                                                                              //
    }                                                                                                                  //
    user = Meteor.user();                                                                                              //
    return RocketChat.setUserAvatar(user, dataURI, contentType, service);                                              // 16
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
DDPRateLimiter.addRule({                                                                                               // 18
  type: 'method',                                                                                                      //
  name: 'setAvatarFromService',                                                                                        //
  userId: function() {                                                                                                 //
    return true;                                                                                                       // 21
  }                                                                                                                    //
}, 1, 5000);                                                                                                           //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"setUserActiveStatus.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/setUserActiveStatus.coffee.js                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                       // 1
  setUserActiveStatus: function(userId, active) {                                                                      //
    var user;                                                                                                          // 4
    check(userId, String);                                                                                             //
    check(active, Boolean);                                                                                            //
    if (!Meteor.userId()) {                                                                                            //
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                   // 8
        method: 'setUserActiveStatus'                                                                                  //
      });                                                                                                              //
    }                                                                                                                  //
    if (RocketChat.authz.hasPermission(Meteor.userId(), 'edit-other-user-active-status') !== true) {                   //
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                     // 11
        method: 'setUserActiveStatus'                                                                                  //
      });                                                                                                              //
    }                                                                                                                  //
    user = RocketChat.models.Users.findOneById(userId);                                                                //
    RocketChat.models.Users.setUserActive(userId, active);                                                             //
    RocketChat.models.Subscriptions.setArchivedByUsername(user != null ? user.username : void 0, !active);             //
    if (active === false) {                                                                                            //
      RocketChat.models.Users.unsetLoginTokens(userId);                                                                //
    }                                                                                                                  //
    return true;                                                                                                       // 21
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"setUserPassword.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/setUserPassword.coffee.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                       // 1
  setUserPassword: function(password) {                                                                                //
    var user;                                                                                                          // 4
    check(password, String);                                                                                           //
    if (!Meteor.userId()) {                                                                                            //
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                   // 7
        method: 'setUserPassword'                                                                                      //
      });                                                                                                              //
    }                                                                                                                  //
    user = RocketChat.models.Users.findOneById(Meteor.userId());                                                       //
    if (user && user.requirePasswordChange !== true) {                                                                 //
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                     // 11
        method: 'setUserPassword'                                                                                      //
      });                                                                                                              //
    }                                                                                                                  //
    Accounts.setPassword(Meteor.userId(), password, {                                                                  //
      logout: false                                                                                                    //
    });                                                                                                                //
    return RocketChat.models.Users.unsetRequirePasswordChange(Meteor.userId());                                        // 14
    return true;                                                                                                       // 16
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"toogleFavorite.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/toogleFavorite.coffee.js                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                       // 1
  toggleFavorite: function(rid, f) {                                                                                   //
    check(rid, String);                                                                                                //
    check(f, Match.Optional(Boolean));                                                                                 //
    if (!Meteor.userId()) {                                                                                            //
      throw new Meteor.Error('error-invalid-user', "Invalid user", {                                                   // 8
        method: 'toggleFavorite'                                                                                       //
      });                                                                                                              //
    }                                                                                                                  //
    return RocketChat.models.Subscriptions.setFavoriteByRoomIdAndUserId(rid, Meteor.userId(), f);                      //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"unmuteUserInRoom.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/unmuteUserInRoom.coffee.js                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
  unmuteUserInRoom: function(data) {                                                                                   //
    var fromId, fromUser, ref, ref1, room, unmutedUser;                                                                // 3
    fromId = Meteor.userId();                                                                                          //
    check(data, Match.ObjectIncluding({                                                                                //
      rid: String,                                                                                                     //
      username: String                                                                                                 //
    }));                                                                                                               //
    if (!RocketChat.authz.hasPermission(fromId, 'mute-user', data.rid)) {                                              //
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                     // 7
        method: 'unmuteUserInRoom'                                                                                     //
      });                                                                                                              //
    }                                                                                                                  //
    room = RocketChat.models.Rooms.findOneById(data.rid);                                                              //
    if (!room) {                                                                                                       //
      throw new Meteor.Error('error-invalid-room', 'Invalid room', {                                                   // 11
        method: 'unmuteUserInRoom'                                                                                     //
      });                                                                                                              //
    }                                                                                                                  //
    if ((ref = room.t) !== 'c' && ref !== 'p') {                                                                       //
      throw new Meteor.Error('error-invalid-room-type', room.t + ' is not a valid room type', {                        // 14
        method: 'unmuteUserInRoom',                                                                                    //
        type: room.t                                                                                                   //
      });                                                                                                              //
    }                                                                                                                  //
    if (ref1 = data.username, indexOf.call((room != null ? room.usernames : void 0) || [], ref1) < 0) {                //
      throw new Meteor.Error('error-user-not-in-room', 'User is not in this room', {                                   // 17
        method: 'unmuteUserInRoom'                                                                                     //
      });                                                                                                              //
    }                                                                                                                  //
    unmutedUser = RocketChat.models.Users.findOneByUsername(data.username);                                            //
    RocketChat.models.Rooms.unmuteUsernameByRoomId(data.rid, unmutedUser.username);                                    //
    fromUser = RocketChat.models.Users.findOneById(fromId);                                                            //
    RocketChat.models.Messages.createUserUnmutedWithRoomIdAndUser(data.rid, unmutedUser, {                             //
      u: {                                                                                                             //
        _id: fromUser._id,                                                                                             //
        username: fromUser.username                                                                                    //
      }                                                                                                                //
    });                                                                                                                //
    return true;                                                                                                       // 29
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"userSetUtcOffset.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/methods/userSetUtcOffset.coffee.js                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                       // 1
  userSetUtcOffset: function(utcOffset) {                                                                              //
    check(utcOffset, Number);                                                                                          //
    if (this.userId == null) {                                                                                         //
      return;                                                                                                          // 7
    }                                                                                                                  //
    this.unblock();                                                                                                    //
    return RocketChat.models.Users.setUtcOffset(this.userId, utcOffset);                                               //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
DDPRateLimiter.addRule({                                                                                               // 13
  type: 'method',                                                                                                      //
  name: 'userSetUtcOffset',                                                                                            //
  userId: function() {                                                                                                 //
    return true;                                                                                                       // 16
  }                                                                                                                    //
}, 1, 60000);                                                                                                          //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"publications":{"activeUsers.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/publications/activeUsers.coffee.js                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('activeUsers', function() {                                                                             // 1
  if (!this.userId) {                                                                                                  //
    return this.ready();                                                                                               // 3
  }                                                                                                                    //
  return RocketChat.models.Users.findUsersNotOffline({                                                                 //
    fields: {                                                                                                          //
      username: 1,                                                                                                     //
      status: 1,                                                                                                       //
      utcOffset: 1                                                                                                     //
    }                                                                                                                  //
  });                                                                                                                  //
});                                                                                                                    // 1
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"channelAndPrivateAutocomplete.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/publications/channelAndPrivateAutocomplete.coffee.js                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('channelAndPrivateAutocomplete', function(selector) {                                                   // 1
  var cursorHandle, options, pub;                                                                                      // 2
  if (!this.userId) {                                                                                                  //
    return this.ready();                                                                                               // 3
  }                                                                                                                    //
  if (RocketChat.authz.hasPermission(this.userId, 'view-other-user-channels') !== true) {                              //
    return this.ready();                                                                                               // 6
  }                                                                                                                    //
  pub = this;                                                                                                          //
  options = {                                                                                                          //
    fields: {                                                                                                          //
      _id: 1,                                                                                                          //
      name: 1                                                                                                          //
    },                                                                                                                 //
    limit: 10,                                                                                                         //
    sort: {                                                                                                            //
      name: 1                                                                                                          //
    }                                                                                                                  //
  };                                                                                                                   //
  cursorHandle = RocketChat.models.Rooms.findByNameStartingAndTypes(selector.name, ['c', 'p'], options).observeChanges({
    added: function(_id, record) {                                                                                     //
      return pub.added('autocompleteRecords', _id, record);                                                            //
    },                                                                                                                 //
    changed: function(_id, record) {                                                                                   //
      return pub.changed('autocompleteRecords', _id, record);                                                          //
    },                                                                                                                 //
    removed: function(_id, record) {                                                                                   //
      return pub.removed('autocompleteRecords', _id, record);                                                          //
    }                                                                                                                  //
  });                                                                                                                  //
  this.ready();                                                                                                        //
  this.onStop(function() {                                                                                             //
    return cursorHandle.stop();                                                                                        //
  });                                                                                                                  //
});                                                                                                                    // 1
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"fullUserData.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/publications/fullUserData.coffee.js                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('fullUserData', function(filter, limit) {                                                               // 1
  var fields, filterReg, options;                                                                                      // 2
  if (!this.userId) {                                                                                                  //
    return this.ready();                                                                                               // 3
  }                                                                                                                    //
  fields = {                                                                                                           //
    name: 1,                                                                                                           //
    username: 1,                                                                                                       //
    status: 1,                                                                                                         //
    utcOffset: 1,                                                                                                      //
    type: 1,                                                                                                           //
    active: 1                                                                                                          //
  };                                                                                                                   //
  if (RocketChat.authz.hasPermission(this.userId, 'view-full-other-user-info') === true) {                             //
    fields = _.extend(fields, {                                                                                        //
      emails: 1,                                                                                                       //
      phone: 1,                                                                                                        //
      statusConnection: 1,                                                                                             //
      createdAt: 1,                                                                                                    //
      lastLogin: 1,                                                                                                    //
      services: 1,                                                                                                     //
      requirePasswordChange: 1,                                                                                        //
      requirePasswordChangeReason: 1,                                                                                  //
      roles: 1                                                                                                         //
    });                                                                                                                //
  } else {                                                                                                             //
    limit = 1;                                                                                                         //
  }                                                                                                                    //
  filter = s.trim(filter);                                                                                             //
  if (!filter && limit === 1) {                                                                                        //
    return this.ready();                                                                                               // 30
  }                                                                                                                    //
  options = {                                                                                                          //
    fields: fields,                                                                                                    //
    limit: limit,                                                                                                      //
    sort: {                                                                                                            //
      username: 1                                                                                                      //
    }                                                                                                                  //
  };                                                                                                                   //
  if (filter) {                                                                                                        //
    if (limit === 1) {                                                                                                 //
      return RocketChat.models.Users.findByUsername(filter, options);                                                  // 39
    } else {                                                                                                           //
      filterReg = new RegExp(s.escapeRegExp(filter), "i");                                                             //
      return RocketChat.models.Users.findByUsernameNameOrEmailAddress(filterReg, options);                             // 42
    }                                                                                                                  //
  }                                                                                                                    //
  return RocketChat.models.Users.find({}, options);                                                                    // 44
});                                                                                                                    // 1
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"messages.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/publications/messages.coffee.js                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('messages', function(rid, start) {                                                                      // 1
  var cursor, cursorDelete, cursorDeleteHandle, cursorHandle, publication;                                             // 2
  if (!this.userId) {                                                                                                  //
    return this.ready();                                                                                               // 3
  }                                                                                                                    //
  publication = this;                                                                                                  //
  if (typeof rid !== 'string') {                                                                                       //
    return this.ready();                                                                                               // 8
  }                                                                                                                    //
  if (!Meteor.call('canAccessRoom', rid, this.userId)) {                                                               //
    return this.ready();                                                                                               // 11
  }                                                                                                                    //
  cursor = RocketChat.models.Messages.findVisibleByRoomId(rid, {                                                       //
    sort: {                                                                                                            //
      ts: -1                                                                                                           //
    },                                                                                                                 //
    limit: 50                                                                                                          //
  });                                                                                                                  //
  cursorHandle = cursor.observeChanges({                                                                               //
    added: function(_id, record) {                                                                                     //
      record.starred = _.findWhere(record.starred, {                                                                   //
        _id: publication.userId                                                                                        //
      });                                                                                                              //
      return publication.added('rocketchat_message', _id, record);                                                     //
    },                                                                                                                 //
    changed: function(_id, record) {                                                                                   //
      record.starred = _.findWhere(record.starred, {                                                                   //
        _id: publication.userId                                                                                        //
      });                                                                                                              //
      return publication.changed('rocketchat_message', _id, record);                                                   //
    }                                                                                                                  //
  });                                                                                                                  //
  cursorDelete = RocketChat.models.Messages.findInvisibleByRoomId(rid, {                                               //
    fields: {                                                                                                          //
      _id: 1                                                                                                           //
    }                                                                                                                  //
  });                                                                                                                  //
  cursorDeleteHandle = cursorDelete.observeChanges({                                                                   //
    added: function(_id, record) {                                                                                     //
      return publication.added('rocketchat_message', _id, {                                                            //
        _hidden: true                                                                                                  //
      });                                                                                                              //
    },                                                                                                                 //
    changed: function(_id, record) {                                                                                   //
      return publication.added('rocketchat_message', _id, {                                                            //
        _hidden: true                                                                                                  //
      });                                                                                                              //
    }                                                                                                                  //
  });                                                                                                                  //
  this.ready();                                                                                                        //
  return this.onStop(function() {                                                                                      //
    cursorHandle.stop();                                                                                               //
    return cursorDeleteHandle.stop();                                                                                  //
  });                                                                                                                  //
});                                                                                                                    // 1
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"privateHistory.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/publications/privateHistory.coffee.js                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('privateHistory', function() {                                                                          // 1
  if (!this.userId) {                                                                                                  //
    return this.ready();                                                                                               // 3
  }                                                                                                                    //
  return RocketChat.models.Rooms.findByContainigUsername(RocketChat.models.Users.findOneById(this.userId).username, {  //
    fields: {                                                                                                          //
      t: 1,                                                                                                            //
      name: 1,                                                                                                         //
      msgs: 1,                                                                                                         //
      ts: 1,                                                                                                           //
      lm: 1,                                                                                                           //
      cl: 1                                                                                                            //
    }                                                                                                                  //
  });                                                                                                                  //
});                                                                                                                    // 1
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"room.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/publications/room.coffee.js                                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('room', function(typeName) {                                                                            // 1
  var name, type;                                                                                                      // 2
  if (!this.userId) {                                                                                                  //
    return this.ready();                                                                                               // 3
  }                                                                                                                    //
  if (typeof typeName !== 'string') {                                                                                  //
    return this.ready();                                                                                               // 6
  }                                                                                                                    //
  type = typeName.substr(0, 1);                                                                                        //
  name = typeName.substr(1);                                                                                           //
  return RocketChat.roomTypes.runPublish(this, type, name);                                                            // 11
});                                                                                                                    // 1
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"roomFiles.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/publications/roomFiles.coffee.js                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('roomFiles', function(rid, limit) {                                                                     // 1
  var cursorFileListHandle, pub;                                                                                       // 2
  if (limit == null) {                                                                                                 //
    limit = 50;                                                                                                        //
  }                                                                                                                    //
  if (!this.userId) {                                                                                                  //
    return this.ready();                                                                                               // 3
  }                                                                                                                    //
  pub = this;                                                                                                          //
  cursorFileListHandle = RocketChat.models.Uploads.findNotHiddenFilesOfRoom(rid, limit).observeChanges({               //
    added: function(_id, record) {                                                                                     //
      return pub.added('room_files', _id, record);                                                                     //
    },                                                                                                                 //
    changed: function(_id, record) {                                                                                   //
      return pub.changed('room_files', _id, record);                                                                   //
    },                                                                                                                 //
    removed: function(_id, record) {                                                                                   //
      return pub.removed('room_files', _id, record);                                                                   //
    }                                                                                                                  //
  });                                                                                                                  //
  this.ready();                                                                                                        //
  return this.onStop(function() {                                                                                      //
    return cursorFileListHandle.stop();                                                                                //
  });                                                                                                                  //
});                                                                                                                    // 1
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"roomSubscriptionsByRole.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/publications/roomSubscriptionsByRole.coffee.js                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('roomSubscriptionsByRole', function(rid, role) {                                                        // 1
  if (!this.userId) {                                                                                                  //
    return this.ready();                                                                                               // 3
  }                                                                                                                    //
  if (RocketChat.authz.hasPermission(this.userId, 'view-other-user-channels') !== true) {                              //
    return this.ready();                                                                                               // 6
  }                                                                                                                    //
  return RocketChat.models.Subscriptions.findByRoomIdAndRoles(rid, role, {                                             //
    fields: {                                                                                                          //
      rid: 1,                                                                                                          //
      name: 1,                                                                                                         //
      roles: 1,                                                                                                        //
      u: 1                                                                                                             //
    },                                                                                                                 //
    sort: {                                                                                                            //
      name: 1                                                                                                          //
    }                                                                                                                  //
  });                                                                                                                  //
});                                                                                                                    // 1
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"spotlight.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/publications/spotlight.coffee.js                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                       // 1
  spotlight: function(text, usernames, type) {                                                                         //
    var regex, result, username;                                                                                       // 3
    if (type == null) {                                                                                                //
      type = {                                                                                                         //
        users: true,                                                                                                   //
        rooms: true                                                                                                    //
      };                                                                                                               //
    }                                                                                                                  //
    result = {                                                                                                         //
      users: [],                                                                                                       //
      rooms: []                                                                                                        //
    };                                                                                                                 //
    if (this.userId == null) {                                                                                         //
      return result;                                                                                                   // 8
    }                                                                                                                  //
    regex = new RegExp(s.trim(s.escapeRegExp(text)), "i");                                                             //
    if (type.users === true && RocketChat.authz.hasPermission(this.userId, 'view-d-room')) {                           //
      result.users = RocketChat.models.Users.findByActiveUsersUsernameExcept(text, usernames, {                        //
        limit: 5,                                                                                                      //
        fields: {                                                                                                      //
          username: 1,                                                                                                 //
          status: 1                                                                                                    //
        },                                                                                                             //
        sort: {                                                                                                        //
          username: 1                                                                                                  //
        }                                                                                                              //
      }).fetch();                                                                                                      //
    }                                                                                                                  //
    if (type.rooms === true && RocketChat.authz.hasPermission(this.userId, 'view-c-room')) {                           //
      username = RocketChat.models.Users.findOneById(this.userId, {                                                    //
        username: 1                                                                                                    //
      }).username;                                                                                                     //
      result.rooms = RocketChat.models.Rooms.findByNameAndTypeNotContainingUsername(regex, 'c', username, {            //
        limit: 5,                                                                                                      //
        fields: {                                                                                                      //
          t: 1,                                                                                                        //
          name: 1                                                                                                      //
        },                                                                                                             //
        sort: {                                                                                                        //
          name: 1                                                                                                      //
        }                                                                                                              //
      }).fetch();                                                                                                      //
    }                                                                                                                  //
    return result;                                                                                                     // 19
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
DDPRateLimiter.addRule({                                                                                               // 21
  type: 'method',                                                                                                      //
  name: 'spotlight',                                                                                                   //
  userId: function(userId) {                                                                                           //
    return true;                                                                                                       // 25
  }                                                                                                                    //
}, 10, 10000);                                                                                                         //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"subscription.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/publications/subscription.coffee.js                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var fields,                                                                                                            // 1
  slice = [].slice;                                                                                                    //
                                                                                                                       //
fields = {                                                                                                             // 1
  t: 1,                                                                                                                //
  ts: 1,                                                                                                               //
  ls: 1,                                                                                                               //
  name: 1,                                                                                                             //
  rid: 1,                                                                                                              //
  code: 1,                                                                                                             //
  f: 1,                                                                                                                //
  u: 1,                                                                                                                //
  open: 1,                                                                                                             //
  alert: 1,                                                                                                            //
  roles: 1,                                                                                                            //
  unread: 1,                                                                                                           //
  archived: 1,                                                                                                         //
  desktopNotifications: 1,                                                                                             //
  desktopNotificationDuration: 1,                                                                                      //
  mobilePushNotifications: 1,                                                                                          //
  emailNotifications: 1,                                                                                               //
  unreadAlert: 1,                                                                                                      //
  _updatedAt: 1                                                                                                        //
};                                                                                                                     //
                                                                                                                       //
Meteor.methods({                                                                                                       // 23
  'subscriptions/get': function(updatedAt) {                                                                           //
    var options;                                                                                                       // 25
    if (!Meteor.userId()) {                                                                                            //
      return [];                                                                                                       // 26
    }                                                                                                                  //
    this.unblock();                                                                                                    //
    options = {                                                                                                        //
      fields: fields                                                                                                   //
    };                                                                                                                 //
    if (updatedAt instanceof Date) {                                                                                   //
      return RocketChat.models.Subscriptions.dinamicFindChangesAfter('findByUserId', updatedAt, Meteor.userId(), options);
    }                                                                                                                  //
    return RocketChat.models.Subscriptions.findByUserId(Meteor.userId(), options).fetch();                             // 36
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
RocketChat.models.Subscriptions.on('change', function() {                                                              // 39
  var args, i, len, record, records, results, type;                                                                    // 40
  type = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];                                   //
  records = RocketChat.models.Subscriptions.getChangedRecords(type, args[0], fields);                                  //
  results = [];                                                                                                        // 42
  for (i = 0, len = records.length; i < len; i++) {                                                                    //
    record = records[i];                                                                                               //
    results.push(RocketChat.Notifications.notifyUser(record.u._id, 'subscriptions-changed', type, record));            //
  }                                                                                                                    // 42
  return results;                                                                                                      //
});                                                                                                                    // 39
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"userAutocomplete.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/publications/userAutocomplete.coffee.js                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('userAutocomplete', function(selector) {                                                                // 1
  var cursorHandle, exceptions, options, pub;                                                                          // 2
  if (!this.userId) {                                                                                                  //
    return this.ready();                                                                                               // 3
  }                                                                                                                    //
  if (!_.isObject(selector)) {                                                                                         //
    return this.ready();                                                                                               // 6
  }                                                                                                                    //
  options = {                                                                                                          //
    fields: {                                                                                                          //
      name: 1,                                                                                                         //
      username: 1,                                                                                                     //
      status: 1                                                                                                        //
    },                                                                                                                 //
    sort: {                                                                                                            //
      username: 1                                                                                                      //
    },                                                                                                                 //
    limit: 10                                                                                                          //
  };                                                                                                                   //
  pub = this;                                                                                                          //
  exceptions = selector.exceptions || [];                                                                              //
  cursorHandle = RocketChat.models.Users.findActiveByUsernameOrNameRegexWithExceptions(selector.term, exceptions, options).observeChanges({
    added: function(_id, record) {                                                                                     //
      return pub.added("autocompleteRecords", _id, record);                                                            //
    },                                                                                                                 //
    changed: function(_id, record) {                                                                                   //
      return pub.changed("autocompleteRecords", _id, record);                                                          //
    },                                                                                                                 //
    removed: function(_id, record) {                                                                                   //
      return pub.removed("autocompleteRecords", _id, record);                                                          //
    }                                                                                                                  //
  });                                                                                                                  //
  this.ready();                                                                                                        //
  this.onStop(function() {                                                                                             //
    return cursorHandle.stop();                                                                                        //
  });                                                                                                                  //
});                                                                                                                    // 1
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"userChannels.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/publications/userChannels.coffee.js                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('userChannels', function(userId) {                                                                      // 1
  if (!this.userId) {                                                                                                  //
    return this.ready();                                                                                               // 3
  }                                                                                                                    //
  if (RocketChat.authz.hasPermission(this.userId, 'view-other-user-channels') !== true) {                              //
    return this.ready();                                                                                               // 6
  }                                                                                                                    //
  return RocketChat.models.Subscriptions.findByUserId(userId, {                                                        //
    fields: {                                                                                                          //
      rid: 1,                                                                                                          //
      name: 1,                                                                                                         //
      t: 1,                                                                                                            //
      u: 1                                                                                                             //
    },                                                                                                                 //
    sort: {                                                                                                            //
      t: 1,                                                                                                            //
      name: 1                                                                                                          //
    }                                                                                                                  //
  });                                                                                                                  //
});                                                                                                                    // 1
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"userData.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/publications/userData.coffee.js                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('userData', function() {                                                                                // 1
  if (!this.userId) {                                                                                                  //
    return this.ready();                                                                                               // 3
  }                                                                                                                    //
  return RocketChat.models.Users.find(this.userId, {                                                                   //
    fields: {                                                                                                          //
      name: 1,                                                                                                         //
      username: 1,                                                                                                     //
      status: 1,                                                                                                       //
      statusDefault: 1,                                                                                                //
      statusConnection: 1,                                                                                             //
      avatarOrigin: 1,                                                                                                 //
      utcOffset: 1,                                                                                                    //
      language: 1,                                                                                                     //
      settings: 1,                                                                                                     //
      roles: 1,                                                                                                        //
      active: 1,                                                                                                       //
      defaultRoom: 1,                                                                                                  //
      'services.github': 1,                                                                                            //
      'services.gitlab': 1,                                                                                            //
      requirePasswordChange: 1,                                                                                        //
      requirePasswordChangeReason: 1,                                                                                  //
      'services.password.bcrypt': 1,                                                                                   //
      statusLivechat: 1                                                                                                //
    }                                                                                                                  //
  });                                                                                                                  //
});                                                                                                                    // 1
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"restapi":{"restapi.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/restapi/restapi.coffee.js                                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Api;                                                                                                               //
                                                                                                                       //
Api = new Restivus({                                                                                                   //
  useDefaultAuth: true,                                                                                                //
  prettyJson: true,                                                                                                    //
  enableCors: false                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
Api.addRoute('info', {                                                                                                 //
  authRequired: false                                                                                                  //
}, {                                                                                                                   //
  get: function () {                                                                                                   //
    function get() {                                                                                                   //
      return RocketChat.Info;                                                                                          //
    }                                                                                                                  //
                                                                                                                       //
    return get;                                                                                                        //
  }()                                                                                                                  //
});                                                                                                                    //
                                                                                                                       //
Api.addRoute('version', {                                                                                              //
  authRequired: false                                                                                                  //
}, {                                                                                                                   //
  get: function () {                                                                                                   //
    function get() {                                                                                                   //
      var version;                                                                                                     //
      version = {                                                                                                      //
        api: '0.1',                                                                                                    //
        rocketchat: '0.5'                                                                                              //
      };                                                                                                               //
      return {                                                                                                         //
        status: 'success',                                                                                             //
        versions: version                                                                                              //
      };                                                                                                               //
    }                                                                                                                  //
                                                                                                                       //
    return get;                                                                                                        //
  }()                                                                                                                  //
});                                                                                                                    //
                                                                                                                       //
Api.addRoute('publicRooms', {                                                                                          //
  authRequired: true                                                                                                   //
}, {                                                                                                                   //
  get: function () {                                                                                                   //
    function get() {                                                                                                   //
      var rooms;                                                                                                       //
      rooms = RocketChat.models.Rooms.findByType('c', {                                                                //
        sort: {                                                                                                        //
          msgs: -1                                                                                                     //
        }                                                                                                              //
      }).fetch();                                                                                                      //
      return {                                                                                                         //
        status: 'success',                                                                                             //
        rooms: rooms                                                                                                   //
      };                                                                                                               //
    }                                                                                                                  //
                                                                                                                       //
    return get;                                                                                                        //
  }()                                                                                                                  //
});                                                                                                                    //
                                                                                                                       //
/*                                                                                                                     //
@api {get} /joinedRooms Get joined rooms.                                                                              //
 */                                                                                                                    //
                                                                                                                       //
Api.addRoute('joinedRooms', {                                                                                          //
  authRequired: true                                                                                                   //
}, {                                                                                                                   //
  get: function () {                                                                                                   //
    function get() {                                                                                                   //
      var rooms;                                                                                                       //
      rooms = RocketChat.models.Rooms.findByContainigUsername(this.user.username).fetch();                             //
      return {                                                                                                         //
        status: 'success',                                                                                             //
        rooms: rooms                                                                                                   //
      };                                                                                                               //
    }                                                                                                                  //
                                                                                                                       //
    return get;                                                                                                        //
  }()                                                                                                                  //
});                                                                                                                    //
                                                                                                                       //
Api.addRoute('rooms/:id/join', {                                                                                       //
  authRequired: true                                                                                                   //
}, {                                                                                                                   //
  post: function () {                                                                                                  //
    function post() {                                                                                                  //
      Meteor.runAsUser(this.userId, function (_this) {                                                                 //
        return function () {                                                                                           //
          return Meteor.call('joinRoom', _this.urlParams.id);                                                          //
        };                                                                                                             //
      }(this));                                                                                                        //
      return {                                                                                                         //
        status: 'success'                                                                                              //
      };                                                                                                               //
    }                                                                                                                  //
                                                                                                                       //
    return post;                                                                                                       //
  }()                                                                                                                  //
});                                                                                                                    //
                                                                                                                       //
Api.addRoute('rooms/:id/leave', {                                                                                      //
  authRequired: true                                                                                                   //
}, {                                                                                                                   //
  post: function () {                                                                                                  //
    function post() {                                                                                                  //
      Meteor.runAsUser(this.userId, function (_this) {                                                                 //
        return function () {                                                                                           //
          return Meteor.call('leaveRoom', _this.urlParams.id);                                                         //
        };                                                                                                             //
      }(this));                                                                                                        //
      return {                                                                                                         //
        status: 'success'                                                                                              //
      };                                                                                                               //
    }                                                                                                                  //
                                                                                                                       //
    return post;                                                                                                       //
  }()                                                                                                                  //
});                                                                                                                    //
                                                                                                                       //
/*                                                                                                                     //
@api {get} /rooms/:id/messages?skip=:skip&limit=:limit Get messages in a room.                                         //
@apiParam {Number} id         Room ID                                                                                  //
@apiParam {Number} [skip=0]   Number of results to skip at the beginning                                               //
@apiParam {Number} [limit=50] Maximum number of results to return                                                      //
 */                                                                                                                    //
                                                                                                                       //
Api.addRoute('rooms/:id/messages', {                                                                                   //
  authRequired: true                                                                                                   //
}, {                                                                                                                   //
  get: function () {                                                                                                   //
    function get() {                                                                                                   //
      var e, limit, msgs, rid, skip;                                                                                   //
      try {                                                                                                            //
        rid = this.urlParams.id;                                                                                       //
        skip = this.queryParams.skip | 0 || 0;                                                                         //
        limit = this.queryParams.limit | 0 || 50;                                                                      //
        if (limit > 50) {                                                                                              //
          limit = 50;                                                                                                  //
        }                                                                                                              //
        if (Meteor.call('canAccessRoom', rid, this.userId)) {                                                          //
          msgs = RocketChat.models.Messages.findVisibleByRoomId(rid, {                                                 //
            sort: {                                                                                                    //
              ts: -1                                                                                                   //
            },                                                                                                         //
            skip: skip,                                                                                                //
            limit: limit                                                                                               //
          }).fetch();                                                                                                  //
          return {                                                                                                     //
            status: 'success',                                                                                         //
            messages: msgs                                                                                             //
          };                                                                                                           //
        } else {                                                                                                       //
          return {                                                                                                     //
            statusCode: 403,                                                                                           //
            body: {                                                                                                    //
              status: 'fail',                                                                                          //
              message: 'Cannot access room.'                                                                           //
            }                                                                                                          //
          };                                                                                                           //
        }                                                                                                              //
      } catch (error) {                                                                                                //
        e = error;                                                                                                     //
        return {                                                                                                       //
          statusCode: 400,                                                                                             //
          body: {                                                                                                      //
            status: 'fail',                                                                                            //
            message: e.name + ' :: ' + e.message                                                                       //
          }                                                                                                            //
        };                                                                                                             //
      }                                                                                                                //
    }                                                                                                                  //
                                                                                                                       //
    return get;                                                                                                        //
  }()                                                                                                                  //
});                                                                                                                    //
                                                                                                                       //
Api.addRoute('rooms/:id/send', {                                                                                       //
  authRequired: true                                                                                                   //
}, {                                                                                                                   //
  post: function () {                                                                                                  //
    function post() {                                                                                                  //
      Meteor.runAsUser(this.userId, function (_this) {                                                                 //
        return function () {                                                                                           //
          console.log(_this.bodyParams.msg);                                                                           //
          return Meteor.call('sendMessage', {                                                                          //
            msg: _this.bodyParams.msg,                                                                                 //
            rid: _this.urlParams.id                                                                                    //
          });                                                                                                          //
        };                                                                                                             //
      }(this));                                                                                                        //
      return {                                                                                                         //
        status: 'success'                                                                                              //
      };                                                                                                               //
    }                                                                                                                  //
                                                                                                                       //
    return post;                                                                                                       //
  }()                                                                                                                  //
});                                                                                                                    //
                                                                                                                       //
Api.addRoute('rooms/:id/online', {                                                                                     //
  authRequired: true                                                                                                   //
}, {                                                                                                                   //
  get: function () {                                                                                                   //
    function get() {                                                                                                   //
      var i, j, len, online, onlineInRoom, room, user;                                                                 //
      room = RocketChat.models.Rooms.findOneById(this.urlParams.id);                                                   //
      online = RocketChat.models.Users.findUsersNotOffline({                                                           //
        fields: {                                                                                                      //
          username: 1,                                                                                                 //
          status: 1                                                                                                    //
        }                                                                                                              //
      }).fetch();                                                                                                      //
      onlineInRoom = [];                                                                                               //
      for (i = j = 0, len = online.length; j < len; i = ++j) {                                                         //
        user = online[i];                                                                                              //
        if (room.usernames.indexOf(user.username) !== -1) {                                                            //
          onlineInRoom.push(user.username);                                                                            //
        }                                                                                                              //
      }                                                                                                                //
      return {                                                                                                         //
        status: 'success',                                                                                             //
        online: onlineInRoom                                                                                           //
      };                                                                                                               //
    }                                                                                                                  //
                                                                                                                       //
    return get;                                                                                                        //
  }()                                                                                                                  //
});                                                                                                                    //
                                                                                                                       //
Api.testapiValidateUsers = function (users) {                                                                          //
  var i, j, len, nameValidation, user;                                                                                 //
  for (i = j = 0, len = users.length; j < len; i = ++j) {                                                              //
    user = users[i];                                                                                                   //
    if (user.name != null) {                                                                                           //
      if (user.email != null) {                                                                                        //
        if (user.pass != null) {                                                                                       //
          try {                                                                                                        //
            nameValidation = new RegExp('^' + RocketChat.settings.get('UTF8_Names_Validation') + '$', 'i');            //
          } catch (error) {                                                                                            //
            nameValidation = new RegExp('^[0-9a-zA-Z-_.]+$', 'i');                                                     //
          }                                                                                                            //
          if (nameValidation.test(user.name)) {                                                                        //
            if (/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]+\b/i.test(user.email)) {                                          //
              continue;                                                                                                //
            }                                                                                                          //
          }                                                                                                            //
        }                                                                                                              //
      }                                                                                                                //
    }                                                                                                                  //
    throw new Meteor.Error('invalid-user-record', "[restapi] bulk/register -> record #" + i + " is invalid");          //
  }                                                                                                                    //
};                                                                                                                     //
                                                                                                                       //
/*                                                                                                                     //
@api {post} /bulk/register  Register multiple users based on an input array.                                           //
@apiName register                                                                                                      //
@apiGroup TestAndAdminAutomation                                                                                       //
@apiVersion 0.0.1                                                                                                      //
@apiDescription  Caller must have 'testagent' or 'adminautomation' role.                                               //
NOTE:   remove room is NOT recommended; use Meteor.reset() to clear db and re-seed instead                             //
@apiParam {json} rooms An array of users in the body of the POST.                                                      //
@apiParamExample {json} POST Request Body example:                                                                     //
  {                                                                                                                    //
    'users':[ {'email': 'user1@user1.com',                                                                             //
               'name': 'user1',                                                                                        //
               'pass': 'abc123' },                                                                                     //
              {'email': 'user2@user2.com',                                                                             //
               'name': 'user2',                                                                                        //
               'pass': 'abc123'},                                                                                      //
              ...                                                                                                      //
            ]                                                                                                          //
  }                                                                                                                    //
@apiSuccess {json} ids An array of IDs of the registered users.                                                        //
@apiSuccessExample {json} Success-Response:                                                                            //
  HTTP/1.1 200 OK                                                                                                      //
  {                                                                                                                    //
    'ids':[ {'uid': 'uid_1'},                                                                                          //
            {'uid': 'uid_2'},                                                                                          //
            ...                                                                                                        //
    ]                                                                                                                  //
  }                                                                                                                    //
 */                                                                                                                    //
                                                                                                                       //
Api.addRoute('bulk/register', {                                                                                        //
  authRequired: true                                                                                                   //
}, {                                                                                                                   //
  post: {                                                                                                              //
    action: function () {                                                                                              //
      function action() {                                                                                              //
        var e, endCount, i, ids, incoming, j, len, ref;                                                                //
        if (RocketChat.authz.hasPermission(this.userId, 'bulk-register-user')) {                                       //
          try {                                                                                                        //
            Api.testapiValidateUsers(this.bodyParams.users);                                                           //
            this.response.setTimeout(500 * this.bodyParams.users.length);                                              //
            ids = [];                                                                                                  //
            endCount = this.bodyParams.users.length - 1;                                                               //
            ref = this.bodyParams.users;                                                                               //
            for (i = j = 0, len = ref.length; j < len; i = ++j) {                                                      //
              incoming = ref[i];                                                                                       //
              ids[i] = {                                                                                               //
                uid: Meteor.call('registerUser', incoming)                                                             //
              };                                                                                                       //
              Meteor.runAsUser(ids[i].uid, function (_this) {                                                          //
                return function () {                                                                                   //
                  Meteor.call('setUsername', incoming.name);                                                           //
                  return Meteor.call('joinDefaultChannels');                                                           //
                };                                                                                                     //
              }(this));                                                                                                //
            }                                                                                                          //
            return {                                                                                                   //
              status: 'success',                                                                                       //
              ids: ids                                                                                                 //
            };                                                                                                         //
          } catch (error) {                                                                                            //
            e = error;                                                                                                 //
            return {                                                                                                   //
              statusCode: 400,                                                                                         //
              body: {                                                                                                  //
                status: 'fail',                                                                                        //
                message: e.name + ' :: ' + e.message                                                                   //
              }                                                                                                        //
            };                                                                                                         //
          }                                                                                                            //
        } else {                                                                                                       //
          console.log('[restapi] bulk/register -> '.red, "User does not have 'bulk-register-user' permission");        //
          return {                                                                                                     //
            statusCode: 403,                                                                                           //
            body: {                                                                                                    //
              status: 'error',                                                                                         //
              message: 'You do not have permission to do this'                                                         //
            }                                                                                                          //
          };                                                                                                           //
        }                                                                                                              //
      }                                                                                                                //
                                                                                                                       //
      return action;                                                                                                   //
    }()                                                                                                                //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
Api.testapiValidateRooms = function (rooms) {                                                                          //
  var i, j, len, nameValidation, room;                                                                                 //
  for (i = j = 0, len = rooms.length; j < len; i = ++j) {                                                              //
    room = rooms[i];                                                                                                   //
    if (room.name != null) {                                                                                           //
      if (room.members != null) {                                                                                      //
        if (room.members.length > 1) {                                                                                 //
          try {                                                                                                        //
            nameValidation = new RegExp('^' + RocketChat.settings.get('UTF8_Names_Validation') + '$', 'i');            //
          } catch (error) {                                                                                            //
            nameValidation = new RegExp('^[0-9a-zA-Z-_.]+$', 'i');                                                     //
          }                                                                                                            //
          if (nameValidation.test(room.name)) {                                                                        //
            continue;                                                                                                  //
          }                                                                                                            //
        }                                                                                                              //
      }                                                                                                                //
    }                                                                                                                  //
    throw new Meteor.Error('invalid-room-record', "[restapi] bulk/createRoom -> record #" + i + " is invalid");        //
  }                                                                                                                    //
};                                                                                                                     //
                                                                                                                       //
/*                                                                                                                     //
@api {post} /bulk/createRoom Create multiple rooms based on an input array.                                            //
@apiName createRoom                                                                                                    //
@apiGroup TestAndAdminAutomation                                                                                       //
@apiVersion 0.0.1                                                                                                      //
@apiParam {json} rooms An array of rooms in the body of the POST. 'name' is room name, 'members' is array of usernames
@apiParamExample {json} POST Request Body example:                                                                     //
  {                                                                                                                    //
    'rooms':[ {'name': 'room1',                                                                                        //
               'members': ['user1', 'user2']                                                                           //
              },                                                                                                       //
              {'name': 'room2',                                                                                        //
               'members': ['user1', 'user2', 'user3']                                                                  //
              }                                                                                                        //
              ...                                                                                                      //
            ]                                                                                                          //
  }                                                                                                                    //
@apiDescription  Caller must have 'testagent' or 'adminautomation' role.                                               //
NOTE:   remove room is NOT recommended; use Meteor.reset() to clear db and re-seed instead                             //
                                                                                                                       //
@apiSuccess {json} ids An array of ids of the rooms created.                                                           //
@apiSuccessExample {json} Success-Response:                                                                            //
  HTTP/1.1 200 OK                                                                                                      //
  {                                                                                                                    //
    'ids':[ {'rid': 'rid_1'},                                                                                          //
            {'rid': 'rid_2'},                                                                                          //
            ...                                                                                                        //
    ]                                                                                                                  //
  }                                                                                                                    //
 */                                                                                                                    //
                                                                                                                       //
Api.addRoute('bulk/createRoom', {                                                                                      //
  authRequired: true                                                                                                   //
}, {                                                                                                                   //
  post: {                                                                                                              //
    action: function () {                                                                                              //
      function action() {                                                                                              //
        var e, ids;                                                                                                    //
        if (RocketChat.authz.hasPermission(this.userId, 'bulk-create-c')) {                                            //
          try {                                                                                                        //
            this.response.setTimeout(1000 * this.bodyParams.rooms.length);                                             //
            Api.testapiValidateRooms(this.bodyParams.rooms);                                                           //
            ids = [];                                                                                                  //
            Meteor.runAsUser(this.userId, function (_this) {                                                           //
              return function () {                                                                                     //
                var i, incoming, j, len, ref, results;                                                                 //
                ref = _this.bodyParams.rooms;                                                                          //
                results = [];                                                                                          //
                for (i = j = 0, len = ref.length; j < len; i = ++j) {                                                  //
                  incoming = ref[i];                                                                                   //
                  results.push(ids[i] = Meteor.call('createChannel', incoming.name, incoming.members));                //
                }                                                                                                      //
                return results;                                                                                        //
              };                                                                                                       //
            }(this));                                                                                                  //
            return {                                                                                                   //
              status: 'success',                                                                                       //
              ids: ids                                                                                                 //
            };                                                                                                         //
          } catch (error) {                                                                                            //
            e = error;                                                                                                 //
            return {                                                                                                   //
              statusCode: 400,                                                                                         //
              body: {                                                                                                  //
                status: 'fail',                                                                                        //
                message: e.name + ' :: ' + e.message                                                                   //
              }                                                                                                        //
            };                                                                                                         //
          }                                                                                                            //
        } else {                                                                                                       //
          console.log('[restapi] bulk/createRoom -> '.red, "User does not have 'bulk-create-c' permission");           //
          return {                                                                                                     //
            statusCode: 403,                                                                                           //
            body: {                                                                                                    //
              status: 'error',                                                                                         //
              message: 'You do not have permission to do this'                                                         //
            }                                                                                                          //
          };                                                                                                           //
        }                                                                                                              //
      }                                                                                                                //
                                                                                                                       //
      return action;                                                                                                   //
    }()                                                                                                                //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
Api.addRoute('room/:id/archive', {                                                                                     //
  authRequired: true                                                                                                   //
}, {                                                                                                                   //
  post: {                                                                                                              //
    action: function () {                                                                                              //
      function action() {                                                                                              //
        var e;                                                                                                         //
        if (RocketChat.authz.hasPermission(this.userId, 'archive-room')) {                                             //
          try {                                                                                                        //
            Meteor.runAsUser(this.userId, function (_this) {                                                           //
              return function () {                                                                                     //
                return Meteor.call('archiveRoom', _this.urlParams.id);                                                 //
              };                                                                                                       //
            }(this));                                                                                                  //
            return {                                                                                                   //
              status: 'success'                                                                                        //
            };                                                                                                         //
          } catch (error) {                                                                                            //
            e = error;                                                                                                 //
            return {                                                                                                   //
              statusCode: 400,                                                                                         //
              body: {                                                                                                  //
                status: 'fail',                                                                                        //
                message: e.name + ' :: ' + e.message                                                                   //
              }                                                                                                        //
            };                                                                                                         //
          }                                                                                                            //
        } else {                                                                                                       //
          console.log('[restapi] archiveRoom -> '.red, "User does not have 'archive-room' permission");                //
          return {                                                                                                     //
            statusCode: 403,                                                                                           //
            body: {                                                                                                    //
              status: 'error',                                                                                         //
              message: 'You do not have permission to do this'                                                         //
            }                                                                                                          //
          };                                                                                                           //
        }                                                                                                              //
      }                                                                                                                //
                                                                                                                       //
      return action;                                                                                                   //
    }()                                                                                                                //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
Api.addRoute('room/:id/unarchive', {                                                                                   //
  authRequired: true                                                                                                   //
}, {                                                                                                                   //
  post: {                                                                                                              //
    action: function () {                                                                                              //
      function action() {                                                                                              //
        var e;                                                                                                         //
        if (RocketChat.authz.hasPermission(this.userId, 'unarchive-room')) {                                           //
          try {                                                                                                        //
            Meteor.runAsUser(this.userId, function (_this) {                                                           //
              return function () {                                                                                     //
                return Meteor.call('unarchiveRoom', _this.urlParams.id);                                               //
              };                                                                                                       //
            }(this));                                                                                                  //
            return {                                                                                                   //
              status: 'success'                                                                                        //
            };                                                                                                         //
          } catch (error) {                                                                                            //
            e = error;                                                                                                 //
            return {                                                                                                   //
              statusCode: 400,                                                                                         //
              body: {                                                                                                  //
                status: 'fail',                                                                                        //
                message: e.name + ' :: ' + e.message                                                                   //
              }                                                                                                        //
            };                                                                                                         //
          }                                                                                                            //
        } else {                                                                                                       //
          console.log('[restapi] unarchiveRoom -> '.red, "User does not have 'unarchive-room' permission");            //
          return {                                                                                                     //
            statusCode: 403,                                                                                           //
            body: {                                                                                                    //
              status: 'error',                                                                                         //
              message: 'You do not have permission to do this'                                                         //
            }                                                                                                          //
          };                                                                                                           //
        }                                                                                                              //
      }                                                                                                                //
                                                                                                                       //
      return action;                                                                                                   //
    }()                                                                                                                //
  }                                                                                                                    //
});                                                                                                                    //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"stream":{"messages.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/stream/messages.coffee.js                                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var slice = [].slice;                                                                                                  // 1
                                                                                                                       //
this.msgStream = new Meteor.Streamer('room-messages');                                                                 // 1
                                                                                                                       //
msgStream.allowWrite('none');                                                                                          // 3
                                                                                                                       //
msgStream.allowRead(function(eventName) {                                                                              // 5
  var e, room;                                                                                                         // 6
  try {                                                                                                                // 6
    room = Meteor.call('canAccessRoom', eventName, this.userId);                                                       //
    if (!room) {                                                                                                       //
      return false;                                                                                                    // 9
    }                                                                                                                  //
    if (room.t === 'c' && !RocketChat.authz.hasPermission(this.userId, 'preview-c-room') && room.usernames.indexOf(room.username) === -1) {
      return false;                                                                                                    // 12
    }                                                                                                                  //
    return true;                                                                                                       // 14
  } catch (error) {                                                                                                    //
    e = error;                                                                                                         //
    return false;                                                                                                      // 16
  }                                                                                                                    //
});                                                                                                                    // 5
                                                                                                                       //
msgStream.allowRead('__my_messages__', 'all');                                                                         // 18
                                                                                                                       //
msgStream.allowEmit('__my_messages__', function(eventName, msg, options) {                                             // 20
  var e, room;                                                                                                         // 21
  try {                                                                                                                // 21
    room = Meteor.call('canAccessRoom', msg.rid, this.userId);                                                         //
    if (!room) {                                                                                                       //
      return false;                                                                                                    // 24
    }                                                                                                                  //
    options.roomParticipant = room.usernames.indexOf(room.username) > -1;                                              //
    options.roomType = room.t;                                                                                         //
    return true;                                                                                                       // 29
  } catch (error) {                                                                                                    //
    e = error;                                                                                                         //
    return false;                                                                                                      // 31
  }                                                                                                                    //
});                                                                                                                    // 20
                                                                                                                       //
Meteor.startup(function() {                                                                                            // 34
  var fields;                                                                                                          // 35
  fields = void 0;                                                                                                     //
  if (!RocketChat.settings.get('Message_ShowEditedStatus')) {                                                          //
    fields = {                                                                                                         //
      'editedAt': 0                                                                                                    //
    };                                                                                                                 //
  }                                                                                                                    //
  return RocketChat.models.Messages.on('change', function() {                                                          //
    var args, i, len, record, records, results, type;                                                                  // 41
    type = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];                                 //
    records = RocketChat.models.Messages.getChangedRecords(type, args[0], fields);                                     //
    results = [];                                                                                                      // 43
    for (i = 0, len = records.length; i < len; i++) {                                                                  //
      record = records[i];                                                                                             //
      if (record._hidden !== true && (record.imported == null)) {                                                      //
        msgStream.emit('__my_messages__', record, {});                                                                 //
        results.push(msgStream.emit(record.rid, record));                                                              //
      } else {                                                                                                         //
        results.push(void 0);                                                                                          //
      }                                                                                                                //
    }                                                                                                                  // 43
    return results;                                                                                                    //
  });                                                                                                                  //
});                                                                                                                    // 34
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"streamBroadcast.coffee.js":["meteor/ddp-common",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/stream/streamBroadcast.coffee.js                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var DDPCommon;module.import('meteor/ddp-common',{"DDPCommon":function(v){DDPCommon=v}});                               //
var _authorizeConnection, _authorizeConnection2, logger, startMatrixBroadcast, startStreamCastBroadcast;               //
                                                                                                                       //
logger = new Logger('StreamBroadcast', {                                                                               //
  sections: {                                                                                                          //
    connection: 'Connection',                                                                                          //
    auth: 'Auth',                                                                                                      //
    stream: 'Stream'                                                                                                   //
  }                                                                                                                    //
});                                                                                                                    //
                                                                                                                       //
_authorizeConnection = function _authorizeConnection(instance) {                                                       //
  logger.auth.info("Authorizing with " + instance);                                                                    //
  return connections[instance].call('broadcastAuth', InstanceStatus.id(), connections[instance].instanceId, function (err, ok) {
    if (err != null) {                                                                                                 //
      return logger.auth.error("broadcastAuth error " + instance + " " + InstanceStatus.id() + " " + connections[instance].instanceId, err);
    }                                                                                                                  //
    connections[instance].broadcastAuth = ok;                                                                          //
    return logger.auth.info("broadcastAuth with " + instance, ok);                                                     //
  });                                                                                                                  //
};                                                                                                                     //
                                                                                                                       //
_authorizeConnection2 = function authorizeConnection(instance) {                                                       //
  if (InstanceStatus.getCollection().findOne({                                                                         //
    _id: InstanceStatus.id()                                                                                           //
  }) == null) {                                                                                                        //
    return Meteor.setTimeout(function () {                                                                             //
      return _authorizeConnection2(instance);                                                                          //
    }, 500);                                                                                                           //
  }                                                                                                                    //
  return _authorizeConnection(instance);                                                                               //
};                                                                                                                     //
                                                                                                                       //
startMatrixBroadcast = function startMatrixBroadcast() {                                                               //
  InstanceStatus.getCollection().find({                                                                                //
    'extraInformation.port': {                                                                                         //
      $exists: true                                                                                                    //
    }                                                                                                                  //
  }, {                                                                                                                 //
    sort: {                                                                                                            //
      _createdAt: -1                                                                                                   //
    }                                                                                                                  //
  }).observe({                                                                                                         //
    added: function () {                                                                                               //
      function added(record) {                                                                                         //
        var instance, ref;                                                                                             //
        instance = record.extraInformation.host + ":" + record.extraInformation.port;                                  //
        if (record.extraInformation.port === process.env.PORT && record.extraInformation.host === process.env.INSTANCE_IP) {
          logger.auth.info("prevent self connect", instance);                                                          //
          return;                                                                                                      //
        }                                                                                                              //
        if (record.extraInformation.host === process.env.INSTANCE_IP) {                                                //
          instance = "localhost:" + record.extraInformation.port;                                                      //
        }                                                                                                              //
        if (((ref = connections[instance]) != null ? ref.instanceRecord : void 0) != null) {                           //
          if (connections[instance].instanceRecord._createdAt < record._createdAt) {                                   //
            connections[instance].disconnect();                                                                        //
            delete connections[instance];                                                                              //
          } else {                                                                                                     //
            return;                                                                                                    //
          }                                                                                                            //
        }                                                                                                              //
        logger.connection.info('connecting in', instance);                                                             //
        connections[instance] = DDP.connect(instance, {                                                                //
          _dontPrintErrors: true                                                                                       //
        });                                                                                                            //
        connections[instance].instanceRecord = record;                                                                 //
        connections[instance].instanceId = record._id;                                                                 //
        return connections[instance].onReconnect = function () {                                                       //
          return _authorizeConnection2(instance);                                                                      //
        };                                                                                                             //
      }                                                                                                                //
                                                                                                                       //
      return added;                                                                                                    //
    }(),                                                                                                               //
    removed: function () {                                                                                             //
      function removed(record) {                                                                                       //
        var instance;                                                                                                  //
        instance = record.extraInformation.host + ":" + record.extraInformation.port;                                  //
        if (record.extraInformation.host === process.env.INSTANCE_IP) {                                                //
          instance = "localhost:" + record.extraInformation.port;                                                      //
        }                                                                                                              //
        if (connections[instance] != null && InstanceStatus.getCollection().findOne({                                  //
          'extraInformation.host': record.extraInformation.host,                                                       //
          'extraInformation.port': record.extraInformation.port                                                        //
        }) == null) {                                                                                                  //
          logger.connection.info('disconnecting from', instance);                                                      //
          connections[instance].disconnect();                                                                          //
          return delete connections[instance];                                                                         //
        }                                                                                                              //
      }                                                                                                                //
                                                                                                                       //
      return removed;                                                                                                  //
    }()                                                                                                                //
  });                                                                                                                  //
  return Meteor.methods({                                                                                              //
    broadcastAuth: function () {                                                                                       //
      function broadcastAuth(remoteId, selfId) {                                                                       //
        check(selfId, String);                                                                                         //
        check(remoteId, String);                                                                                       //
        this.unblock();                                                                                                //
        if (selfId === InstanceStatus.id() && remoteId !== InstanceStatus.id() && InstanceStatus.getCollection().findOne({
          _id: remoteId                                                                                                //
        }) != null) {                                                                                                  //
          this.connection.broadcastAuth = true;                                                                        //
        }                                                                                                              //
        return this.connection.broadcastAuth === true;                                                                 //
      }                                                                                                                //
                                                                                                                       //
      return broadcastAuth;                                                                                            //
    }(),                                                                                                               //
    stream: function () {                                                                                              //
      function stream(streamName, eventName, args) {                                                                   //
        if (this.connection == null) {                                                                                 //
          return 'self-not-authorized';                                                                                //
        }                                                                                                              //
        if (this.connection.broadcastAuth !== true) {                                                                  //
          return 'not-authorized';                                                                                     //
        }                                                                                                              //
        if (Meteor.StreamerCentral.instances[streamName] == null) {                                                    //
          return 'stream-not-exists';                                                                                  //
        }                                                                                                              //
        Meteor.StreamerCentral.instances[streamName]._emit(eventName, args);                                           //
        return void 0;                                                                                                 //
      }                                                                                                                //
                                                                                                                       //
      return stream;                                                                                                   //
    }()                                                                                                                //
  });                                                                                                                  //
};                                                                                                                     //
                                                                                                                       //
startStreamCastBroadcast = function startStreamCastBroadcast(value) {                                                  //
  var connection, instance;                                                                                            //
  instance = 'StreamCast';                                                                                             //
  logger.connection.info('connecting in', instance, value);                                                            //
  connection = DDP.connect(value, {                                                                                    //
    _dontPrintErrors: true                                                                                             //
  });                                                                                                                  //
  connections[instance] = connection;                                                                                  //
  connection.instanceId = instance;                                                                                    //
  connection.onReconnect = function () {                                                                               //
    return _authorizeConnection2(instance);                                                                            //
  };                                                                                                                   //
  connection._stream.on('message', function (raw_msg) {                                                                //
    var args, eventName, msg, ref, streamName;                                                                         //
    msg = DDPCommon.parseDDP(raw_msg);                                                                                 //
    if (!msg || msg.msg !== 'changed' || msg.collection == null || msg.fields == null) {                               //
      return;                                                                                                          //
    }                                                                                                                  //
    ref = msg.fields, streamName = ref.streamName, eventName = ref.eventName, args = ref.args;                         //
    if (streamName == null || eventName == null || args == null) {                                                     //
      return;                                                                                                          //
    }                                                                                                                  //
    if (connection.broadcastAuth !== true) {                                                                           //
      return 'not-authorized';                                                                                         //
    }                                                                                                                  //
    if (Meteor.StreamerCentral.instances[streamName] == null) {                                                        //
      return 'stream-not-exists';                                                                                      //
    }                                                                                                                  //
    return Meteor.StreamerCentral.instances[streamName]._emit(eventName, args);                                        //
  });                                                                                                                  //
  return connection.subscribe('stream');                                                                               //
};                                                                                                                     //
                                                                                                                       //
this.connections = {};                                                                                                 //
                                                                                                                       //
this.startStreamBroadcast = function () {                                                                              //
  var base, broadcast;                                                                                                 //
  if ((base = process.env).INSTANCE_IP == null) {                                                                      //
    base.INSTANCE_IP = 'localhost';                                                                                    //
  }                                                                                                                    //
  logger.info('startStreamBroadcast');                                                                                 //
  RocketChat.settings.get('Stream_Cast_Address', function (key, value) {                                               //
    var connection, fn, instance;                                                                                      //
    fn = function fn(instance, connection) {                                                                           //
      connection.disconnect();                                                                                         //
      return delete connections[instance];                                                                             //
    };                                                                                                                 //
    for (instance in meteorBabelHelpers.sanitizeForInObject(connections)) {                                            //
      connection = connections[instance];                                                                              //
      fn(instance, connection);                                                                                        //
    }                                                                                                                  //
    if ((value != null ? value.trim() : void 0) !== '') {                                                              //
      return startStreamCastBroadcast(value);                                                                          //
    } else {                                                                                                           //
      return startMatrixBroadcast();                                                                                   //
    }                                                                                                                  //
  });                                                                                                                  //
  broadcast = function broadcast(streamName, eventName, args, userId) {                                                //
    var connection, fromInstance, instance, results;                                                                   //
    fromInstance = process.env.INSTANCE_IP + ':' + process.env.PORT;                                                   //
    results = [];                                                                                                      //
    for (instance in meteorBabelHelpers.sanitizeForInObject(connections)) {                                            //
      connection = connections[instance];                                                                              //
      results.push(function (instance, connection) {                                                                   //
        if (connection.status().connected === true) {                                                                  //
          return connection.call('stream', streamName, eventName, args, function (error, response) {                   //
            if (error != null) {                                                                                       //
              logger.error("Stream broadcast error", error);                                                           //
            }                                                                                                          //
            switch (response) {                                                                                        //
              case 'self-not-authorized':                                                                              //
                logger.stream.error(("Stream broadcast from '" + fromInstance + "' to '" + connection._stream.endpoint + "' with name " + streamName + " to self is not authorized").red);
                logger.stream.debug("    -> connection authorized".red, connection.broadcastAuth);                     //
                logger.stream.debug("    -> connection status".red, connection.status());                              //
                return logger.stream.debug("    -> arguments".red, eventName, args);                                   //
              case 'not-authorized':                                                                                   //
                logger.stream.error(("Stream broadcast from '" + fromInstance + "' to '" + connection._stream.endpoint + "' with name " + streamName + " not authorized").red);
                logger.stream.debug("    -> connection authorized".red, connection.broadcastAuth);                     //
                logger.stream.debug("    -> connection status".red, connection.status());                              //
                logger.stream.debug("    -> arguments".red, eventName, args);                                          //
                return _authorizeConnection2(instance);                                                                //
              case 'stream-not-exists':                                                                                //
                logger.stream.error(("Stream broadcast from '" + fromInstance + "' to '" + connection._stream.endpoint + "' with name " + streamName + " does not exist").red);
                logger.stream.debug("    -> connection authorized".red, connection.broadcastAuth);                     //
                logger.stream.debug("    -> connection status".red, connection.status());                              //
                return logger.stream.debug("    -> arguments".red, eventName, args);                                   //
            }                                                                                                          //
          });                                                                                                          //
        }                                                                                                              //
      }(instance, connection));                                                                                        //
    }                                                                                                                  //
    return results;                                                                                                    //
  };                                                                                                                   //
  return Meteor.StreamerCentral.on('broadcast', function (streamName, eventName, args) {                               //
    return broadcast(streamName, eventName, args);                                                                     //
  });                                                                                                                  //
};                                                                                                                     //
                                                                                                                       //
Meteor.startup(function () {                                                                                           //
  return startStreamBroadcast();                                                                                       //
});                                                                                                                    //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]}},"lib":{"RegExp.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// lib/RegExp.coffee.js                                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RegExp.escape = function(s) {                                                                                          // 1
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');                                                                  // 2
};                                                                                                                     // 1
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"fileUpload.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// lib/fileUpload.coffee.js                                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var initFileStore;                                                                                                     // 1
                                                                                                                       //
if (typeof UploadFS !== "undefined" && UploadFS !== null) {                                                            // 1
  RocketChat.models.Uploads.allow({                                                                                    //
    insert: function(userId, doc) {                                                                                    //
      return userId;                                                                                                   // 4
    },                                                                                                                 //
    update: function(userId, doc) {                                                                                    //
      return userId === doc.userId;                                                                                    // 7
    },                                                                                                                 //
    remove: function(userId, doc) {                                                                                    //
      return userId === doc.userId;                                                                                    // 10
    }                                                                                                                  //
  });                                                                                                                  //
  initFileStore = function() {                                                                                         //
    var cookie;                                                                                                        // 13
    cookie = new Cookies();                                                                                            //
    if (Meteor.isClient) {                                                                                             //
      document.cookie = 'rc_uid=' + escape(Meteor.userId()) + '; path=/';                                              //
      document.cookie = 'rc_token=' + escape(Accounts._storedLoginToken()) + '; path=/';                               //
    }                                                                                                                  //
    return Meteor.fileStore = new UploadFS.store.GridFS({                                                              //
      collection: RocketChat.models.Uploads.model,                                                                     //
      name: 'rocketchat_uploads',                                                                                      //
      collectionName: 'rocketchat_uploads',                                                                            //
      filter: new UploadFS.Filter({                                                                                    //
        onCheck: FileUpload.validateFileUpload                                                                         //
      }),                                                                                                              //
      transformWrite: function(readStream, writeStream, fileId, file) {                                                //
        var identify, stream;                                                                                          // 25
        if (RocketChatFile.enabled === false || !/^image\/.+/.test(file.type)) {                                       //
          return readStream.pipe(writeStream);                                                                         // 26
        }                                                                                                              //
        stream = void 0;                                                                                               //
        identify = function(err, data) {                                                                               //
          var ref;                                                                                                     // 31
          if (err != null) {                                                                                           //
            return stream.pipe(writeStream);                                                                           // 32
          }                                                                                                            //
          file.identify = {                                                                                            //
            format: data.format,                                                                                       //
            size: data.size                                                                                            //
          };                                                                                                           //
          if ((data.Orientation != null) && ((ref = data.Orientation) !== '' && ref !== 'Unknown' && ref !== 'Undefined')) {
            return RocketChatFile.gm(stream).autoOrient().stream().pipe(writeStream);                                  //
          } else {                                                                                                     //
            return stream.pipe(writeStream);                                                                           //
          }                                                                                                            //
        };                                                                                                             //
        return stream = RocketChatFile.gm(readStream).identify(identify).stream();                                     //
      },                                                                                                               //
      onRead: function(fileId, file, req, res) {                                                                       //
        var rawCookies, ref, token, uid;                                                                               // 46
        if (RocketChat.settings.get('FileUpload_ProtectFiles')) {                                                      //
          if ((req != null ? (ref = req.headers) != null ? ref.cookie : void 0 : void 0) != null) {                    //
            rawCookies = req.headers.cookie;                                                                           //
          }                                                                                                            //
          if (rawCookies != null) {                                                                                    //
            uid = cookie.get('rc_uid', rawCookies);                                                                    //
          }                                                                                                            //
          if (rawCookies != null) {                                                                                    //
            token = cookie.get('rc_token', rawCookies);                                                                //
          }                                                                                                            //
          if (uid == null) {                                                                                           //
            uid = req.query.rc_uid;                                                                                    //
            token = req.query.rc_token;                                                                                //
          }                                                                                                            //
          if (!(uid && token && RocketChat.models.Users.findOneByIdAndLoginToken(uid, token))) {                       //
            res.writeHead(403);                                                                                        //
            return false;                                                                                              // 57
          }                                                                                                            //
        }                                                                                                              //
        res.setHeader('content-disposition', "attachment; filename=\"" + (encodeURIComponent(file.name)) + "\"");      //
        return true;                                                                                                   // 60
      }                                                                                                                //
    });                                                                                                                //
  };                                                                                                                   //
  Meteor.startup(function() {                                                                                          //
    if (Meteor.isServer) {                                                                                             //
      return initFileStore();                                                                                          //
    } else {                                                                                                           //
      return Tracker.autorun(function(c) {                                                                             //
        if (Meteor.userId() && RocketChat.settings.cachedCollection.ready.get()) {                                     //
          initFileStore();                                                                                             //
          return c.stop();                                                                                             //
        }                                                                                                              //
      });                                                                                                              //
    }                                                                                                                  //
  });                                                                                                                  //
}                                                                                                                      //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"francocatena_fix.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// lib/francocatena_fix.coffee.js                                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
this.i18n_status_func = function(key, options) {                                                                       // 1
  return TAPi18n.__(key, options);                                                                                     // 2
};                                                                                                                     // 1
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"underscore.string.coffee.js":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// lib/underscore.string.coffee.js                                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var mixin;                                                                                                             // 6
                                                                                                                       //
mixin = function(obj) {                                                                                                // 6
  return _.each(_.functions(obj), function(name) {                                                                     //
    var func;                                                                                                          // 8
    if (!_[name] && (_.prototype[name] == null)) {                                                                     //
      func = _[name] = obj[name];                                                                                      //
      return _.prototype[name] = function() {                                                                          //
        var args;                                                                                                      // 11
        args = [this._wrapped];                                                                                        //
        push.apply(args, arguments);                                                                                   //
        return result.call(this, func.apply(_, args));                                                                 // 13
      };                                                                                                               //
    }                                                                                                                  //
  });                                                                                                                  //
};                                                                                                                     // 6
                                                                                                                       //
mixin(s.exports());                                                                                                    // 15
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},{"extensions":[".js",".json",".coffee"]});
require("./server/lib/cordova/facebook-login.coffee.js");
require("./server/lib/accounts.coffee.js");
require("./server/lib/cordova.coffee.js");
require("./lib/RegExp.coffee.js");
require("./lib/fileUpload.coffee.js");
require("./lib/francocatena_fix.coffee.js");
require("./lib/underscore.string.coffee.js");
require("./server/startup/migrations/v001.coffee.js");
require("./server/startup/migrations/v002.coffee.js");
require("./server/startup/migrations/v003.coffee.js");
require("./server/startup/migrations/v004.coffee.js");
require("./server/startup/migrations/v005.coffee.js");
require("./server/startup/migrations/v006.coffee.js");
require("./server/startup/migrations/v007.coffee.js");
require("./server/startup/migrations/v008.coffee.js");
require("./server/startup/migrations/v009.coffee.js");
require("./server/startup/migrations/v010.coffee.js");
require("./server/startup/migrations/v011.coffee.js");
require("./server/startup/migrations/v012.coffee.js");
require("./server/startup/migrations/v013.coffee.js");
require("./server/startup/migrations/v014.coffee.js");
require("./server/startup/migrations/v015.coffee.js");
require("./server/startup/migrations/v016.coffee.js");
require("./server/startup/migrations/v017.coffee.js");
require("./server/startup/migrations/v018.coffee.js");
require("./server/startup/migrations/v019.coffee.js");
require("./server/startup/migrations/v020.coffee.js");
require("./server/startup/migrations/v021.coffee.js");
require("./server/startup/migrations/v022.coffee.js");
require("./server/startup/migrations/v023.coffee.js");
require("./server/startup/migrations/v024.coffee.js");
require("./server/startup/migrations/v025.coffee.js");
require("./server/startup/migrations/v026.coffee.js");
require("./server/startup/migrations/v027.coffee.js");
require("./server/startup/migrations/v028.coffee.js");
require("./server/startup/migrations/v029.coffee.js");
require("./server/startup/migrations/v030.coffee.js");
require("./server/startup/migrations/v031.coffee.js");
require("./server/startup/migrations/v032.coffee.js");
require("./server/startup/migrations/v033.coffee.js");
require("./server/startup/migrations/v034.coffee.js");
require("./server/startup/migrations/v035.coffee.js");
require("./server/startup/migrations/v036.coffee.js");
require("./server/startup/migrations/v037.js");
require("./server/startup/migrations/v038.js");
require("./server/startup/migrations/v039.js");
require("./server/startup/migrations/v040.js");
require("./server/startup/migrations/v041.js");
require("./server/startup/migrations/v042.coffee.js");
require("./server/startup/migrations/v043.js");
require("./server/startup/migrations/v044.js");
require("./server/startup/migrations/v045.js");
require("./server/startup/migrations/v046.js");
require("./server/startup/migrations/v047.js");
require("./server/startup/migrations/v048.js");
require("./server/startup/migrations/v049.js");
require("./server/startup/migrations/v050.js");
require("./server/startup/migrations/v051.js");
require("./server/startup/migrations/v052.js");
require("./server/startup/migrations/v053.js");
require("./server/startup/migrations/v054.js");
require("./server/startup/migrations/v055.js");
require("./server/startup/migrations/v056.js");
require("./server/startup/migrations/v057.js");
require("./server/startup/migrations/v058.js");
require("./server/startup/migrations/v059.js");
require("./server/startup/migrations/v060.js");
require("./server/startup/migrations/v061.js");
require("./server/startup/migrations/v062.js");
require("./server/startup/migrations/v063.js");
require("./server/startup/migrations/v064.js");
require("./server/startup/migrations/xrun.coffee.js");
require("./server/configuration/accounts_meld.coffee.js");
require("./server/methods/addAllUserToRoom.js");
require("./server/methods/addRoomModerator.coffee.js");
require("./server/methods/addRoomOwner.coffee.js");
require("./server/methods/canAccessRoom.coffee.js");
require("./server/methods/channelsList.coffee.js");
require("./server/methods/createDirectMessage.coffee.js");
require("./server/methods/deleteFileMessage.js");
require("./server/methods/deleteUser.coffee.js");
require("./server/methods/eraseRoom.coffee.js");
require("./server/methods/getAvatarSuggestion.coffee.js");
require("./server/methods/getRoomIdByNameOrId.coffee.js");
require("./server/methods/getTotalChannels.coffee.js");
require("./server/methods/getUsernameSuggestion.coffee.js");
require("./server/methods/getUsersOfRoom.js");
require("./server/methods/groupsList.js");
require("./server/methods/hideRoom.coffee.js");
require("./server/methods/loadHistory.coffee.js");
require("./server/methods/loadLocale.coffee.js");
require("./server/methods/loadMissedMessages.coffee.js");
require("./server/methods/loadNextMessages.coffee.js");
require("./server/methods/loadSurroundingMessages.coffee.js");
require("./server/methods/logoutCleanUp.coffee.js");
require("./server/methods/messageSearch.js");
require("./server/methods/migrate.coffee.js");
require("./server/methods/muteUserInRoom.coffee.js");
require("./server/methods/openRoom.coffee.js");
require("./server/methods/readMessages.coffee.js");
require("./server/methods/registerUser.coffee.js");
require("./server/methods/removeRoomModerator.coffee.js");
require("./server/methods/removeRoomOwner.coffee.js");
require("./server/methods/removeUserFromRoom.coffee.js");
require("./server/methods/reportMessage.coffee.js");
require("./server/methods/resetAvatar.coffee.js");
require("./server/methods/saveUserPreferences.coffee.js");
require("./server/methods/saveUserProfile.coffee.js");
require("./server/methods/sendConfirmationEmail.coffee.js");
require("./server/methods/sendForgotPasswordEmail.coffee.js");
require("./server/methods/setAvatarFromService.coffee.js");
require("./server/methods/setUserActiveStatus.coffee.js");
require("./server/methods/setUserPassword.coffee.js");
require("./server/methods/toogleFavorite.coffee.js");
require("./server/methods/unmuteUserInRoom.coffee.js");
require("./server/methods/userSetUtcOffset.coffee.js");
require("./server/publications/activeUsers.coffee.js");
require("./server/publications/channelAndPrivateAutocomplete.coffee.js");
require("./server/publications/fullUserData.coffee.js");
require("./server/publications/messages.coffee.js");
require("./server/publications/privateHistory.coffee.js");
require("./server/publications/room.coffee.js");
require("./server/publications/roomFiles.coffee.js");
require("./server/publications/roomSubscriptionsByRole.coffee.js");
require("./server/publications/spotlight.coffee.js");
require("./server/publications/subscription.coffee.js");
require("./server/publications/userAutocomplete.coffee.js");
require("./server/publications/userChannels.coffee.js");
require("./server/publications/userData.coffee.js");
require("./server/restapi/restapi.coffee.js");
require("./server/startup/appcache.coffee.js");
require("./server/startup/avatar.coffee.js");
require("./server/startup/cron.coffee.js");
require("./server/startup/i18n-validation.coffee.js");
require("./server/startup/initialData.coffee.js");
require("./server/startup/presence.coffee.js");
require("./server/startup/roomPublishes.coffee.js");
require("./server/startup/serverRunning.coffee.js");
require("./server/stream/messages.coffee.js");
require("./server/stream/streamBroadcast.coffee.js");
//# sourceMappingURL=app.js.map
