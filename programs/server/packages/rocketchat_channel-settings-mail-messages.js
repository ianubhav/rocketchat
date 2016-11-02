(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var moment = Package['momentjs:moment'].moment;
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
// packages/rocketchat_channel-settings-mail-messages/server/lib/startup.coffee.js                      //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {                                                                             // 1
  var permission;                                                                                       // 2
  permission = {                                                                                        //
    _id: 'mail-messages',                                                                               //
    roles: ['admin']                                                                                    //
  };                                                                                                    //
  return RocketChat.models.Permissions.upsert(permission._id, {                                         //
    $setOnInsert: permission                                                                            //
  });                                                                                                   //
});                                                                                                     // 1
                                                                                                        //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/rocketchat_channel-settings-mail-messages/server/methods/mailMessages.coffee.js             //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                        //
  'mailMessages': function () {                                                                         //
    function mailMessages(data) {                                                                       //
      var email, emails, footer, header, html, i, j, len, len1, localeFn, missing, name, ref, ref1, ref2, ref3, ref4, rfcMailPatternWithName, room, user, username;
      if (!Meteor.userId()) {                                                                           //
        throw new Meteor.Error('error-invalid-user', "Invalid user", {                                  //
          method: 'mailMessages'                                                                        //
        });                                                                                             //
      }                                                                                                 //
      check(data, Match.ObjectIncluding({                                                               //
        rid: String,                                                                                    //
        to_users: [String],                                                                             //
        to_emails: String,                                                                              //
        subject: String,                                                                                //
        messages: [String],                                                                             //
        language: String                                                                                //
      }));                                                                                              //
      room = Meteor.call('canAccessRoom', data.rid, Meteor.userId());                                   //
      if (!room) {                                                                                      //
        throw new Meteor.Error('error-invalid-room', "Invalid room", {                                  //
          method: 'mailMessages'                                                                        //
        });                                                                                             //
      }                                                                                                 //
      if (!RocketChat.authz.hasPermission(Meteor.userId(), 'mail-messages')) {                          //
        throw new Meteor.Error('error-action-not-allowed', 'Mailing is not allowed', {                  //
          method: 'mailMessages',                                                                       //
          action: 'Mailing'                                                                             //
        });                                                                                             //
      }                                                                                                 //
      rfcMailPatternWithName = /^(?:.*<)?([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)(?:>?)$/;
      emails = _.compact(data.to_emails.trim().split(','));                                             //
      missing = [];                                                                                     //
      if (data.to_users.length > 0) {                                                                   //
        ref = data.to_users;                                                                            //
        for (i = 0, len = ref.length; i < len; i++) {                                                   //
          username = ref[i];                                                                            //
          user = RocketChat.models.Users.findOneByUsername(username);                                   //
          if (user != null ? (ref1 = user.emails) != null ? (ref2 = ref1[0]) != null ? ref2.address : void 0 : void 0 : void 0) {
            emails.push(user.emails[0].address);                                                        //
          } else {                                                                                      //
            missing.push(username);                                                                     //
          }                                                                                             //
        }                                                                                               //
      }                                                                                                 //
      console.log('Sending messages to e-mails: ', emails);                                             //
      for (j = 0, len1 = emails.length; j < len1; j++) {                                                //
        email = emails[j];                                                                              //
        if (!rfcMailPatternWithName.test(email.trim())) {                                               //
          throw new Meteor.Error('error-invalid-email', "Invalid email " + email, {                     //
            method: 'mailMessages',                                                                     //
            email: email                                                                                //
          });                                                                                           //
        }                                                                                               //
      }                                                                                                 //
      user = Meteor.user();                                                                             //
      name = user.name;                                                                                 //
      email = (ref3 = user.emails) != null ? (ref4 = ref3[0]) != null ? ref4.address : void 0 : void 0;
      data.language = data.language.split('-').shift().toLowerCase();                                   //
      if (data.language !== 'en') {                                                                     //
        localeFn = Meteor.call('loadLocale', data.language);                                            //
        if (localeFn) {                                                                                 //
          Function(localeFn)();                                                                         //
        }                                                                                               //
      }                                                                                                 //
      html = "";                                                                                        //
      header = RocketChat.placeholders.replace(RocketChat.settings.get('Email_Header') || "");          //
      footer = RocketChat.placeholders.replace(RocketChat.settings.get('Email_Footer') || "");          //
      RocketChat.models.Messages.findByRoomIdAndMessageIds(data.rid, data.messages, {                   //
        sort: {                                                                                         //
          ts: 1                                                                                         //
        }                                                                                               //
      }).forEach(function (message) {                                                                   //
        var dateTime;                                                                                   //
        dateTime = moment(message.ts).locale(data.language).format('L LT');                             //
        return html += "<p style='margin-bottom: 5px'><b>" + message.u.username + "</b> <span style='color: #aaa; font-size: 12px'>" + dateTime + "</span><br />" + RocketChat.Message.parse(message, data.language) + "</p>";
      });                                                                                               //
      Meteor.defer(function () {                                                                        //
        Email.send({                                                                                    //
          to: emails,                                                                                   //
          from: RocketChat.settings.get('From_Email'),                                                  //
          replyTo: email,                                                                               //
          subject: data.subject,                                                                        //
          html: header + html + footer                                                                  //
        });                                                                                             //
        return console.log('Sending email to ' + emails.join(', '));                                    //
      });                                                                                               //
      return {                                                                                          //
        success: true,                                                                                  //
        missing: missing                                                                                //
      };                                                                                                //
    }                                                                                                   //
                                                                                                        //
    return mailMessages;                                                                                //
  }()                                                                                                   //
});                                                                                                     //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:channel-settings-mail-messages'] = {};

})();

//# sourceMappingURL=rocketchat_channel-settings-mail-messages.js.map
