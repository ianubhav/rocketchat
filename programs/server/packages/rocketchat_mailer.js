(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var DDPRateLimiter = Package['ddp-rate-limiter'].DDPRateLimiter;
var FlowRouter = Package['kadira:flow-router'].FlowRouter;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare, Mailer;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_mailer/lib/Mailer.coffee.js                                                         //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                                                                                                           // 1
                                                                                                           //
Mailer = {};                                                                                               // 1
                                                                                                           //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_mailer/server/startup.coffee.js                                                     //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                                                                // 1
  return RocketChat.models.Permissions.upsert('access-mailer', {                                           //
    $setOnInsert: {                                                                                        //
      _id: 'access-mailer',                                                                                //
      roles: ['admin']                                                                                     //
    }                                                                                                      //
  });                                                                                                      //
});                                                                                                        // 1
                                                                                                           //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_mailer/server/models/Users.coffee.js                                                //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.models.Users.RocketMailUnsubscribe = function(_id, createdAt) {                                 // 3
  var affectedRows, query, update;                                                                         // 5
  query = {                                                                                                //
    _id: _id,                                                                                              //
    createdAt: new Date(parseInt(createdAt))                                                               //
  };                                                                                                       //
  update = {                                                                                               //
    $set: {                                                                                                //
      "mailer.unsubscribed": true                                                                          //
    }                                                                                                      //
  };                                                                                                       //
  affectedRows = this.update(query, update);                                                               //
  console.log('[Mailer:Unsubscribe]', _id, createdAt, new Date(parseInt(createdAt)), affectedRows);        //
  return affectedRows;                                                                                     // 17
};                                                                                                         // 3
                                                                                                           //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_mailer/server/functions/sendMail.coffee.js                                          //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Mailer.sendMail = function (from, subject, body, dryrun, query) {                                          //
  var footer, header, rfcMailPatternWithName, userQuery;                                                   //
  rfcMailPatternWithName = /^(?:.*<)?([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)(?:>?)$/;
  if (!rfcMailPatternWithName.test(from)) {                                                                //
    throw new Meteor.Error('error-invalid-from-address', 'Invalid from address', {                         //
      "function": 'Mailer.sendMail'                                                                        //
    });                                                                                                    //
  }                                                                                                        //
  if (body.indexOf('[unsubscribe]') === -1) {                                                              //
    throw new Meteor.Error('error-missing-unsubscribe-link', 'You must provide the [unsubscribe] link.', {
      "function": 'Mailer.sendMail'                                                                        //
    });                                                                                                    //
  }                                                                                                        //
  header = RocketChat.placeholders.replace(RocketChat.settings.get('Email_Header') || '');                 //
  footer = RocketChat.placeholders.replace(RocketChat.settings.get('Email_Footer') || '');                 //
  userQuery = {                                                                                            //
    "mailer.unsubscribed": {                                                                               //
      $exists: 0                                                                                           //
    }                                                                                                      //
  };                                                                                                       //
  if (query) {                                                                                             //
    userQuery = {                                                                                          //
      $and: [userQuery, EJSON.parse(query)]                                                                //
    };                                                                                                     //
  }                                                                                                        //
  if (dryrun) {                                                                                            //
    return Meteor.users.find({                                                                             //
      "emails.address": from                                                                               //
    }).forEach(function (user) {                                                                           //
      var email, html, ref, ref1;                                                                          //
      email = (ref = user.emails) != null ? (ref1 = ref[0]) != null ? ref1.address : void 0 : void 0;      //
      html = RocketChat.placeholders.replace(body, {                                                       //
        unsubscribe: Meteor.absoluteUrl(FlowRouter.path('mailer/unsubscribe/:_id/:createdAt', {            //
          _id: user._id,                                                                                   //
          createdAt: user.createdAt.getTime()                                                              //
        })),                                                                                               //
        name: user.name,                                                                                   //
        email: email                                                                                       //
      });                                                                                                  //
      email = user.name + " <" + email + ">";                                                              //
      if (rfcMailPatternWithName.test(email)) {                                                            //
        Meteor.defer(function () {                                                                         //
          return Email.send({                                                                              //
            to: email,                                                                                     //
            from: from,                                                                                    //
            subject: subject,                                                                              //
            html: header + html + footer                                                                   //
          });                                                                                              //
        });                                                                                                //
        return console.log('Sending email to ' + email);                                                   //
      }                                                                                                    //
    });                                                                                                    //
  } else {                                                                                                 //
    return Meteor.users.find({                                                                             //
      "mailer.unsubscribed": {                                                                             //
        $exists: 0                                                                                         //
      }                                                                                                    //
    }).forEach(function (user) {                                                                           //
      var email, html, ref, ref1;                                                                          //
      email = (ref = user.emails) != null ? (ref1 = ref[0]) != null ? ref1.address : void 0 : void 0;      //
      html = RocketChat.placeholders.replace(body, {                                                       //
        unsubscribe: Meteor.absoluteUrl(FlowRouter.path('mailer/unsubscribe/:_id/:createdAt', {            //
          _id: user._id,                                                                                   //
          createdAt: user.createdAt.getTime()                                                              //
        })),                                                                                               //
        name: user.name,                                                                                   //
        email: email                                                                                       //
      });                                                                                                  //
      email = user.name + " <" + email + ">";                                                              //
      if (rfcMailPatternWithName.test(email)) {                                                            //
        Meteor.defer(function () {                                                                         //
          return Email.send({                                                                              //
            to: email,                                                                                     //
            from: from,                                                                                    //
            subject: subject,                                                                              //
            html: header + html + footer                                                                   //
          });                                                                                              //
        });                                                                                                //
        return console.log('Sending email to ' + email);                                                   //
      }                                                                                                    //
    });                                                                                                    //
  }                                                                                                        //
};                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_mailer/server/functions/unsubscribe.coffee.js                                       //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Mailer.unsubscribe = function(_id, createdAt) {                                                            // 1
  if (_id && createdAt) {                                                                                  //
    return RocketChat.models.Users.RocketMailUnsubscribe(_id, createdAt) === 1;                            // 3
  }                                                                                                        //
  return false;                                                                                            // 4
};                                                                                                         // 1
                                                                                                           //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_mailer/server/methods/sendMail.coffee.js                                            //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                           // 1
  'Mailer.sendMail': function(from, subject, body, dryrun, query) {                                        //
    if (!Meteor.userId()) {                                                                                //
      throw new Meteor.Error('error-invalid-user', "Invalid user", {                                       // 4
        method: 'Mailer.sendMail'                                                                          //
      });                                                                                                  //
    }                                                                                                      //
    if (RocketChat.authz.hasRole(Meteor.userId(), 'admin') !== true) {                                     //
      throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                         // 7
        method: 'Mailer.sendMail'                                                                          //
      });                                                                                                  //
    }                                                                                                      //
    return Mailer.sendMail(from, subject, body, dryrun, query);                                            // 9
  }                                                                                                        //
});                                                                                                        //
                                                                                                           //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/rocketchat_mailer/server/methods/unsubscribe.coffee.js                                         //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                           // 1
  'Mailer:unsubscribe': function(_id, createdAt) {                                                         //
    return Mailer.unsubscribe(_id, createdAt);                                                             // 3
  }                                                                                                        //
});                                                                                                        //
                                                                                                           //
DDPRateLimiter.addRule({                                                                                   // 6
  type: 'method',                                                                                          //
  name: 'Mailer:unsubscribe',                                                                              //
  connectionId: function() {                                                                               //
    return true;                                                                                           // 9
  }                                                                                                        //
}, 1, 60000);                                                                                              //
                                                                                                           //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['rocketchat:mailer'] = {}, {
  Mailer: Mailer
});

})();

//# sourceMappingURL=rocketchat_mailer.js.map
