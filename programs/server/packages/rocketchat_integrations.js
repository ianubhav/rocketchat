(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var ECMAScript = Package.ecmascript.ECMAScript;
var Babel = Package['babel-compiler'].Babel;
var BabelCompiler = Package['babel-compiler'].BabelCompiler;
var hljs = Package['simple:highlight.js'].hljs;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var Logger = Package['rocketchat:logger'].Logger;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var meteorInstall = Package.modules.meteorInstall;
var Buffer = Package.modules.Buffer;
var process = Package.modules.process;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare, logger;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:integrations":{"lib":{"rocketchat.coffee.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/lib/rocketchat.coffee.js                                                         //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.integrations = {};                                                                                        // 1
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"client":{"stylesheets":{"load.coffee.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/client/stylesheets/load.coffee.js                                                //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.theme.addPackageAsset(function() {                                                                        // 1
  return Assets.getText('client/stylesheets/integrations.less');                                                     // 2
});                                                                                                                  // 1
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"server":{"logger.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/logger.js                                                                 //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
/* globals logger:true */                                                                                            // 1
/* exported logger */                                                                                                // 2
                                                                                                                     //
logger = new Logger('Integrations', {                                                                                // 4
	sections: {                                                                                                         // 5
		incoming: 'Incoming WebHook',                                                                                      // 6
		outgoing: 'Outgoing WebHook'                                                                                       // 7
	}                                                                                                                   // 5
});                                                                                                                  // 4
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"validation.coffee.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/lib/validation.coffee.js                                                  //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
                                                                                                                     //
RocketChat.integrations.validateOutgoing = function(integration, userId) {                                           // 1
  var babelOptions, channel, channelType, channels, e, i, index, j, k, l, len, len1, len2, len3, record, ref, ref1, ref2, ref3, ref4, ref5, scopedChannels, triggerWord, url, user;
  if ((((ref = integration.channel) != null ? ref.trim : void 0) != null) && integration.channel.trim() === '') {    //
    delete integration.channel;                                                                                      //
  }                                                                                                                  //
  if (integration.username.trim() === '') {                                                                          //
    throw new Meteor.Error('error-invalid-username', 'Invalid username', {                                           // 6
      method: 'addOutgoingIntegration'                                                                               //
    });                                                                                                              //
  }                                                                                                                  //
  if (!Match.test(integration.urls, [String])) {                                                                     //
    throw new Meteor.Error('error-invalid-urls', 'Invalid URLs', {                                                   // 9
      method: 'addOutgoingIntegration'                                                                               //
    });                                                                                                              //
  }                                                                                                                  //
  ref1 = integration.urls;                                                                                           // 11
  for (index = i = 0, len = ref1.length; i < len; index = ++i) {                                                     // 11
    url = ref1[index];                                                                                               //
    if (url.trim() === '') {                                                                                         //
      delete integration.urls[index];                                                                                //
    }                                                                                                                //
  }                                                                                                                  // 11
  integration.urls = _.without(integration.urls, [void 0]);                                                          //
  if (integration.urls.length === 0) {                                                                               //
    throw new Meteor.Error('error-invalid-urls', 'Invalid URLs', {                                                   // 17
      method: 'addOutgoingIntegration'                                                                               //
    });                                                                                                              //
  }                                                                                                                  //
  channels = integration.channel ? _.map(integration.channel.split(','), function(channel) {                         //
    return s.trim(channel);                                                                                          //
  }) : [];                                                                                                           //
  scopedChannels = ['all_public_channels', 'all_private_groups', 'all_direct_messages'];                             //
  for (j = 0, len1 = channels.length; j < len1; j++) {                                                               // 22
    channel = channels[j];                                                                                           //
    if (((ref2 = channel[0]) !== '@' && ref2 !== '#') && indexOf.call(scopedChannels, channel) < 0) {                //
      throw new Meteor.Error('error-invalid-channel-start-with-chars', 'Invalid channel. Start with @ or #', {       // 24
        method: 'updateIncomingIntegration'                                                                          //
      });                                                                                                            //
    }                                                                                                                //
  }                                                                                                                  // 22
  if (integration.triggerWords != null) {                                                                            //
    if (!Match.test(integration.triggerWords, [String])) {                                                           //
      throw new Meteor.Error('error-invalid-triggerWords', 'Invalid triggerWords', {                                 // 28
        method: 'addOutgoingIntegration'                                                                             //
      });                                                                                                            //
    }                                                                                                                //
    ref3 = integration.triggerWords;                                                                                 // 30
    for (index = k = 0, len2 = ref3.length; k < len2; index = ++k) {                                                 // 30
      triggerWord = ref3[index];                                                                                     //
      if (triggerWord.trim() === '') {                                                                               //
        delete integration.triggerWords[index];                                                                      //
      }                                                                                                              //
    }                                                                                                                // 30
    integration.triggerWords = _.without(integration.triggerWords, [void 0]);                                        //
  }                                                                                                                  //
  if (integration.scriptEnabled === true && (integration.script != null) && integration.script.trim() !== '') {      //
    try {                                                                                                            // 36
      babelOptions = Babel.getDefaultOptions({                                                                       //
        runtime: false                                                                                               //
      });                                                                                                            //
      babelOptions = _.extend(babelOptions, {                                                                        //
        compact: true,                                                                                               //
        minified: true,                                                                                              //
        comments: false                                                                                              //
      });                                                                                                            //
      integration.scriptCompiled = Babel.compile(integration.script, babelOptions).code;                             //
      integration.scriptError = void 0;                                                                              //
    } catch (error) {                                                                                                //
      e = error;                                                                                                     //
      integration.scriptCompiled = void 0;                                                                           //
      integration.scriptError = _.pick(e, 'name', 'message', 'stack');                                               //
    }                                                                                                                //
  }                                                                                                                  //
  for (l = 0, len3 = channels.length; l < len3; l++) {                                                               // 47
    channel = channels[l];                                                                                           //
    if (indexOf.call(scopedChannels, channel) >= 0) {                                                                //
      if (channel === 'all_public_channels') {                                                                       //
                                                                                                                     // 49
      } else if (!RocketChat.authz.hasPermission(userId, 'manage-integrations')) {                                   //
        throw new Meteor.Error('error-invalid-channel', 'Invalid Channel', {                                         // 52
          method: 'addOutgoingIntegration'                                                                           //
        });                                                                                                          //
      }                                                                                                              //
    } else {                                                                                                         //
      record = void 0;                                                                                               //
      channelType = channel[0];                                                                                      //
      channel = channel.substr(1);                                                                                   //
      switch (channelType) {                                                                                         // 58
        case '#':                                                                                                    // 58
          record = RocketChat.models.Rooms.findOne({                                                                 //
            $or: [                                                                                                   //
              {                                                                                                      //
                _id: channel                                                                                         //
              }, {                                                                                                   //
                name: channel                                                                                        //
              }                                                                                                      //
            ]                                                                                                        //
          });                                                                                                        //
          break;                                                                                                     // 59
        case '@':                                                                                                    // 58
          record = RocketChat.models.Users.findOne({                                                                 //
            $or: [                                                                                                   //
              {                                                                                                      //
                _id: channel                                                                                         //
              }, {                                                                                                   //
                username: channel                                                                                    //
              }                                                                                                      //
            ]                                                                                                        //
          });                                                                                                        //
      }                                                                                                              // 58
      if (record === void 0) {                                                                                       //
        throw new Meteor.Error('error-invalid-room', 'Invalid room', {                                               // 73
          method: 'addOutgoingIntegration'                                                                           //
        });                                                                                                          //
      }                                                                                                              //
      if ((record.usernames != null) && (!RocketChat.authz.hasPermission(userId, 'manage-integrations')) && (RocketChat.authz.hasPermission(userId, 'manage-own-integrations')) && (ref4 = (ref5 = Meteor.user()) != null ? ref5.username : void 0, indexOf.call(record.usernames, ref4) < 0)) {
        throw new Meteor.Error('error-invalid-channel', 'Invalid Channel', {                                         // 79
          method: 'addOutgoingIntegration'                                                                           //
        });                                                                                                          //
      }                                                                                                              //
    }                                                                                                                //
  }                                                                                                                  // 47
  user = RocketChat.models.Users.findOne({                                                                           //
    username: integration.username                                                                                   //
  });                                                                                                                //
  if (user == null) {                                                                                                //
    throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                   // 84
      method: 'addOutgoingIntegration'                                                                               //
    });                                                                                                              //
  }                                                                                                                  //
  integration.type = 'webhook-outgoing';                                                                             //
  integration.userId = user._id;                                                                                     //
  integration.channel = channels;                                                                                    //
  return integration;                                                                                                // 90
};                                                                                                                   // 1
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"models":{"Integrations.coffee.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/models/Integrations.coffee.js                                             //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;                                                                                       //
                                                                                                                     //
RocketChat.models.Integrations = new ((function(superClass) {                                                        // 1
  extend(_Class, superClass);                                                                                        //
                                                                                                                     //
  function _Class() {                                                                                                //
    _Class.__super__.constructor.call(this, 'integrations');                                                         //
  }                                                                                                                  //
                                                                                                                     //
  return _Class;                                                                                                     //
                                                                                                                     //
})(RocketChat.models._Base));                                                                                        //
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"publications":{"integrations.coffee.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/publications/integrations.coffee.js                                       //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('integrations', function() {                                                                          // 1
  if (!this.userId) {                                                                                                //
    return this.ready();                                                                                             // 3
  }                                                                                                                  //
  if (RocketChat.authz.hasPermission(this.userId, 'manage-integrations')) {                                          //
    return RocketChat.models.Integrations.find();                                                                    // 6
  } else if (RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations')) {                               //
    return RocketChat.models.Integrations.find({                                                                     // 8
      "_createdBy._id": this.userId                                                                                  //
    });                                                                                                              //
  } else {                                                                                                           //
    throw new Meteor.Error("not-authorized");                                                                        // 10
  }                                                                                                                  //
});                                                                                                                  // 1
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"methods":{"incoming":{"addIncomingIntegration.coffee.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/methods/incoming/addIncomingIntegration.coffee.js                         //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
                                                                                                                     //
Meteor.methods({                                                                                                     // 1
  addIncomingIntegration: function(integration) {                                                                    //
    var babelOptions, channel, channelType, channels, e, i, j, len, len1, record, ref, ref1, ref2, token, user;      // 3
    if ((!RocketChat.authz.hasPermission(this.userId, 'manage-integrations')) && (!RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations'))) {
      throw new Meteor.Error('not_authorized');                                                                      // 4
    }                                                                                                                //
    if (!_.isString(integration.channel)) {                                                                          //
      throw new Meteor.Error('error-invalid-channel', 'Invalid channel', {                                           // 7
        method: 'addIncomingIntegration'                                                                             //
      });                                                                                                            //
    }                                                                                                                //
    if (integration.channel.trim() === '') {                                                                         //
      throw new Meteor.Error('error-invalid-channel', 'Invalid channel', {                                           // 10
        method: 'addIncomingIntegration'                                                                             //
      });                                                                                                            //
    }                                                                                                                //
    channels = _.map(integration.channel.split(','), function(channel) {                                             //
      return s.trim(channel);                                                                                        //
    });                                                                                                              //
    for (i = 0, len = channels.length; i < len; i++) {                                                               // 14
      channel = channels[i];                                                                                         //
      if ((ref = channel[0]) !== '@' && ref !== '#') {                                                               //
        throw new Meteor.Error('error-invalid-channel-start-with-chars', 'Invalid channel. Start with @ or #', {     // 16
          method: 'updateIncomingIntegration'                                                                        //
        });                                                                                                          //
      }                                                                                                              //
    }                                                                                                                // 14
    if (!_.isString(integration.username)) {                                                                         //
      throw new Meteor.Error('error-invalid-username', 'Invalid username', {                                         // 19
        method: 'addIncomingIntegration'                                                                             //
      });                                                                                                            //
    }                                                                                                                //
    if (integration.username.trim() === '') {                                                                        //
      throw new Meteor.Error('error-invalid-username', 'Invalid username', {                                         // 22
        method: 'addIncomingIntegration'                                                                             //
      });                                                                                                            //
    }                                                                                                                //
    if (integration.scriptEnabled === true && (integration.script != null) && integration.script.trim() !== '') {    //
      try {                                                                                                          // 25
        babelOptions = Babel.getDefaultOptions({                                                                     //
          runtime: false                                                                                             //
        });                                                                                                          //
        babelOptions = _.extend(babelOptions, {                                                                      //
          compact: true,                                                                                             //
          minified: true,                                                                                            //
          comments: false                                                                                            //
        });                                                                                                          //
        integration.scriptCompiled = Babel.compile(integration.script, babelOptions).code;                           //
        integration.scriptError = void 0;                                                                            //
      } catch (error) {                                                                                              //
        e = error;                                                                                                   //
        integration.scriptCompiled = void 0;                                                                         //
        integration.scriptError = _.pick(e, 'name', 'message', 'stack');                                             //
      }                                                                                                              //
    }                                                                                                                //
    for (j = 0, len1 = channels.length; j < len1; j++) {                                                             // 35
      channel = channels[j];                                                                                         //
      record = void 0;                                                                                               //
      channelType = channel[0];                                                                                      //
      channel = channel.substr(1);                                                                                   //
      switch (channelType) {                                                                                         // 40
        case '#':                                                                                                    // 40
          record = RocketChat.models.Rooms.findOne({                                                                 //
            $or: [                                                                                                   //
              {                                                                                                      //
                _id: channel                                                                                         //
              }, {                                                                                                   //
                name: channel                                                                                        //
              }                                                                                                      //
            ]                                                                                                        //
          });                                                                                                        //
          break;                                                                                                     // 41
        case '@':                                                                                                    // 40
          record = RocketChat.models.Users.findOne({                                                                 //
            $or: [                                                                                                   //
              {                                                                                                      //
                _id: channel                                                                                         //
              }, {                                                                                                   //
                username: channel                                                                                    //
              }                                                                                                      //
            ]                                                                                                        //
          });                                                                                                        //
      }                                                                                                              // 40
      if (record === void 0) {                                                                                       //
        throw new Meteor.Error('error-invalid-room', 'Invalid room', {                                               // 55
          method: 'addIncomingIntegration'                                                                           //
        });                                                                                                          //
      }                                                                                                              //
      if ((record.usernames != null) && (!RocketChat.authz.hasPermission(this.userId, 'manage-integrations')) && (RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations')) && (ref1 = (ref2 = Meteor.user()) != null ? ref2.username : void 0, indexOf.call(record.usernames, ref1) < 0)) {
        throw new Meteor.Error('error-invalid-channel', 'Invalid Channel', {                                         // 61
          method: 'addIncomingIntegration'                                                                           //
        });                                                                                                          //
      }                                                                                                              //
    }                                                                                                                // 35
    user = RocketChat.models.Users.findOne({                                                                         //
      username: integration.username                                                                                 //
    });                                                                                                              //
    if (user == null) {                                                                                              //
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                 // 66
        method: 'addIncomingIntegration'                                                                             //
      });                                                                                                            //
    }                                                                                                                //
    token = Random.id(48);                                                                                           //
    integration.type = 'webhook-incoming';                                                                           //
    integration.token = token;                                                                                       //
    integration.userId = user._id;                                                                                   //
    integration._createdAt = new Date;                                                                               //
    integration._createdBy = RocketChat.models.Users.findOne(this.userId, {                                          //
      fields: {                                                                                                      //
        username: 1                                                                                                  //
      }                                                                                                              //
    });                                                                                                              //
    RocketChat.models.Roles.addUserRoles(user._id, 'bot');                                                           //
    integration._id = RocketChat.models.Integrations.insert(integration);                                            //
    return integration;                                                                                              // 80
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"updateIncomingIntegration.coffee.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/methods/incoming/updateIncomingIntegration.coffee.js                      //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
                                                                                                                     //
Meteor.methods({                                                                                                     // 1
  updateIncomingIntegration: function(integrationId, integration) {                                                  //
    var babelOptions, channel, channelType, channels, currentIntegration, e, i, j, len, len1, record, ref, ref1, ref2, user;
    if (!_.isString(integration.channel)) {                                                                          //
      throw new Meteor.Error('error-invalid-channel', 'Invalid channel', {                                           // 4
        method: 'updateIncomingIntegration'                                                                          //
      });                                                                                                            //
    }                                                                                                                //
    if (integration.channel.trim() === '') {                                                                         //
      throw new Meteor.Error('error-invalid-channel', 'Invalid channel', {                                           // 7
        method: 'updateIncomingIntegration'                                                                          //
      });                                                                                                            //
    }                                                                                                                //
    channels = _.map(integration.channel.split(','), function(channel) {                                             //
      return s.trim(channel);                                                                                        //
    });                                                                                                              //
    for (i = 0, len = channels.length; i < len; i++) {                                                               // 11
      channel = channels[i];                                                                                         //
      if ((ref = channel[0]) !== '@' && ref !== '#') {                                                               //
        throw new Meteor.Error('error-invalid-channel-start-with-chars', 'Invalid channel. Start with @ or #', {     // 13
          method: 'updateIncomingIntegration'                                                                        //
        });                                                                                                          //
      }                                                                                                              //
    }                                                                                                                // 11
    currentIntegration = null;                                                                                       //
    if (RocketChat.authz.hasPermission(this.userId, 'manage-integrations')) {                                        //
      currentIntegration = RocketChat.models.Integrations.findOne(integrationId);                                    //
    } else if (RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations')) {                             //
      currentIntegration = RocketChat.models.Integrations.findOne({                                                  //
        "_id": integrationId,                                                                                        //
        "_createdBy._id": this.userId                                                                                //
      });                                                                                                            //
    } else {                                                                                                         //
      throw new Meteor.Error('not_authorized');                                                                      // 22
    }                                                                                                                //
    if (currentIntegration == null) {                                                                                //
      throw new Meteor.Error('error-invalid-integration', 'Invalid integration', {                                   // 25
        method: 'updateIncomingIntegration'                                                                          //
      });                                                                                                            //
    }                                                                                                                //
    if (integration.scriptEnabled === true && (integration.script != null) && integration.script.trim() !== '') {    //
      try {                                                                                                          // 28
        babelOptions = Babel.getDefaultOptions({                                                                     //
          runtime: false                                                                                             //
        });                                                                                                          //
        babelOptions = _.extend(babelOptions, {                                                                      //
          compact: true,                                                                                             //
          minified: true,                                                                                            //
          comments: false                                                                                            //
        });                                                                                                          //
        integration.scriptCompiled = Babel.compile(integration.script, babelOptions).code;                           //
        integration.scriptError = void 0;                                                                            //
      } catch (error) {                                                                                              //
        e = error;                                                                                                   //
        integration.scriptCompiled = void 0;                                                                         //
        integration.scriptError = _.pick(e, 'name', 'message', 'stack');                                             //
      }                                                                                                              //
    }                                                                                                                //
    for (j = 0, len1 = channels.length; j < len1; j++) {                                                             // 38
      channel = channels[j];                                                                                         //
      record = void 0;                                                                                               //
      channelType = channel[0];                                                                                      //
      channel = channel.substr(1);                                                                                   //
      switch (channelType) {                                                                                         // 43
        case '#':                                                                                                    // 43
          record = RocketChat.models.Rooms.findOne({                                                                 //
            $or: [                                                                                                   //
              {                                                                                                      //
                _id: channel                                                                                         //
              }, {                                                                                                   //
                name: channel                                                                                        //
              }                                                                                                      //
            ]                                                                                                        //
          });                                                                                                        //
          break;                                                                                                     // 44
        case '@':                                                                                                    // 43
          record = RocketChat.models.Users.findOne({                                                                 //
            $or: [                                                                                                   //
              {                                                                                                      //
                _id: channel                                                                                         //
              }, {                                                                                                   //
                username: channel                                                                                    //
              }                                                                                                      //
            ]                                                                                                        //
          });                                                                                                        //
      }                                                                                                              // 43
      if (record === void 0) {                                                                                       //
        throw new Meteor.Error('error-invalid-room', 'Invalid room', {                                               // 58
          method: 'updateIncomingIntegration'                                                                        //
        });                                                                                                          //
      }                                                                                                              //
      if ((record.usernames != null) && (!RocketChat.authz.hasPermission(this.userId, 'manage-integrations')) && (RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations')) && (ref1 = (ref2 = Meteor.user()) != null ? ref2.username : void 0, indexOf.call(record.usernames, ref1) < 0)) {
        throw new Meteor.Error('error-invalid-channel', 'Invalid Channel', {                                         // 64
          method: 'updateIncomingIntegration'                                                                        //
        });                                                                                                          //
      }                                                                                                              //
    }                                                                                                                // 38
    user = RocketChat.models.Users.findOne({                                                                         //
      username: currentIntegration.username                                                                          //
    });                                                                                                              //
    RocketChat.models.Roles.addUserRoles(user._id, 'bot');                                                           //
    RocketChat.models.Integrations.update(integrationId, {                                                           //
      $set: {                                                                                                        //
        enabled: integration.enabled,                                                                                //
        name: integration.name,                                                                                      //
        avatar: integration.avatar,                                                                                  //
        emoji: integration.emoji,                                                                                    //
        alias: integration.alias,                                                                                    //
        channel: channels,                                                                                           //
        script: integration.script,                                                                                  //
        scriptEnabled: integration.scriptEnabled,                                                                    //
        scriptCompiled: integration.scriptCompiled,                                                                  //
        scriptError: integration.scriptError,                                                                        //
        _updatedAt: new Date,                                                                                        //
        _updatedBy: RocketChat.models.Users.findOne(this.userId, {                                                   //
          fields: {                                                                                                  //
            username: 1                                                                                              //
          }                                                                                                          //
        })                                                                                                           //
      }                                                                                                              //
    });                                                                                                              //
    return RocketChat.models.Integrations.findOne(integrationId);                                                    // 84
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"deleteIncomingIntegration.coffee.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/methods/incoming/deleteIncomingIntegration.coffee.js                      //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                     // 1
  deleteIncomingIntegration: function(integrationId) {                                                               //
    var integration;                                                                                                 // 3
    integration = null;                                                                                              //
    if (RocketChat.authz.hasPermission(this.userId, 'manage-integrations')) {                                        //
      integration = RocketChat.models.Integrations.findOne(integrationId);                                           //
    } else if (RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations')) {                             //
      integration = RocketChat.models.Integrations.findOne(integrationId, {                                          //
        fields: {                                                                                                    //
          "_createdBy._id": this.userId                                                                              //
        }                                                                                                            //
      });                                                                                                            //
    } else {                                                                                                         //
      throw new Meteor.Error('not_authorized');                                                                      // 10
    }                                                                                                                //
    if (integration == null) {                                                                                       //
      throw new Meteor.Error('error-invalid-integration', 'Invalid integration', {                                   // 13
        method: 'deleteIncomingIntegration'                                                                          //
      });                                                                                                            //
    }                                                                                                                //
    RocketChat.models.Integrations.remove({                                                                          //
      _id: integrationId                                                                                             //
    });                                                                                                              //
    return true;                                                                                                     // 17
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"outgoing":{"addOutgoingIntegration.coffee.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/methods/outgoing/addOutgoingIntegration.coffee.js                         //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                     // 1
  addOutgoingIntegration: function(integration) {                                                                    //
    if ((!RocketChat.authz.hasPermission(this.userId, 'manage-integrations')) && !(RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations')) && !(RocketChat.authz.hasPermission(this.userId, 'manage-integrations', 'bot')) && !(RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations', 'bot'))) {
      throw new Meteor.Error('not_authorized');                                                                      // 8
    }                                                                                                                //
    integration = RocketChat.integrations.validateOutgoing(integration, this.userId);                                //
    integration._createdAt = new Date;                                                                               //
    integration._createdBy = RocketChat.models.Users.findOne(this.userId, {                                          //
      fields: {                                                                                                      //
        username: 1                                                                                                  //
      }                                                                                                              //
    });                                                                                                              //
    integration._id = RocketChat.models.Integrations.insert(integration);                                            //
    return integration;                                                                                              // 17
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"updateOutgoingIntegration.coffee.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/methods/outgoing/updateOutgoingIntegration.coffee.js                      //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                     // 1
  updateOutgoingIntegration: function(integrationId, integration) {                                                  //
    var currentIntegration, ref;                                                                                     // 3
    integration = RocketChat.integrations.validateOutgoing(integration, this.userId);                                //
    if ((integration.token == null) || ((ref = integration.token) != null ? ref.trim() : void 0) === '') {           //
      throw new Meteor.Error('error-invalid-token', 'Invalid token', {                                               // 6
        method: 'updateOutgoingIntegration'                                                                          //
      });                                                                                                            //
    }                                                                                                                //
    currentIntegration = null;                                                                                       //
    if (RocketChat.authz.hasPermission(this.userId, 'manage-integrations')) {                                        //
      currentIntegration = RocketChat.models.Integrations.findOne(integrationId);                                    //
    } else if (RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations')) {                             //
      currentIntegration = RocketChat.models.Integrations.findOne({                                                  //
        "_id": integrationId,                                                                                        //
        "_createdBy._id": this.userId                                                                                //
      });                                                                                                            //
    } else {                                                                                                         //
      throw new Meteor.Error('not_authorized');                                                                      // 15
    }                                                                                                                //
    if (currentIntegration == null) {                                                                                //
      throw new Meteor.Error('invalid_integration', '[methods] updateOutgoingIntegration -> integration not found');
    }                                                                                                                //
    RocketChat.models.Integrations.update(integrationId, {                                                           //
      $set: {                                                                                                        //
        enabled: integration.enabled,                                                                                //
        name: integration.name,                                                                                      //
        avatar: integration.avatar,                                                                                  //
        emoji: integration.emoji,                                                                                    //
        alias: integration.alias,                                                                                    //
        channel: integration.channel,                                                                                //
        impersonateUser: integration.impersonateUser,                                                                //
        username: integration.username,                                                                              //
        userId: integration.userId,                                                                                  //
        urls: integration.urls,                                                                                      //
        token: integration.token,                                                                                    //
        script: integration.script,                                                                                  //
        scriptEnabled: integration.scriptEnabled,                                                                    //
        scriptCompiled: integration.scriptCompiled,                                                                  //
        scriptError: integration.scriptError,                                                                        //
        triggerWords: integration.triggerWords,                                                                      //
        _updatedAt: new Date,                                                                                        //
        _updatedBy: RocketChat.models.Users.findOne(this.userId, {                                                   //
          fields: {                                                                                                  //
            username: 1                                                                                              //
          }                                                                                                          //
        })                                                                                                           //
      }                                                                                                              //
    });                                                                                                              //
    return RocketChat.models.Integrations.findOne(integrationId);                                                    // 42
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"deleteOutgoingIntegration.coffee.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/methods/outgoing/deleteOutgoingIntegration.coffee.js                      //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                     // 1
  deleteOutgoingIntegration: function(integrationId) {                                                               //
    var integration;                                                                                                 // 3
    integration = null;                                                                                              //
    if (RocketChat.authz.hasPermission(this.userId, 'manage-integrations') || RocketChat.authz.hasPermission(this.userId, 'manage-integrations', 'bot')) {
      integration = RocketChat.models.Integrations.findOne(integrationId);                                           //
    } else if (RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations') || RocketChat.authz.hasPermission(this.userId, 'manage-own-integrations', 'bot')) {
      integration = RocketChat.models.Integrations.findOne(integrationId, {                                          //
        fields: {                                                                                                    //
          "_createdBy._id": this.userId                                                                              //
        }                                                                                                            //
      });                                                                                                            //
    } else {                                                                                                         //
      throw new Meteor.Error('not_authorized');                                                                      // 10
    }                                                                                                                //
    if (integration == null) {                                                                                       //
      throw new Meteor.Error('error-invalid-integration', 'Invalid integration', {                                   // 13
        method: 'deleteOutgoingIntegration'                                                                          //
      });                                                                                                            //
    }                                                                                                                //
    RocketChat.models.Integrations.remove({                                                                          //
      _id: integrationId                                                                                             //
    });                                                                                                              //
    return true;                                                                                                     // 17
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"api":{"api.coffee.js":function(require){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/api/api.coffee.js                                                         //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Api, addIntegrationRest, compiledScripts, createIntegration, executeIntegrationRest, getIntegrationScript, integrationInfoRest, integrationSampleRest, removeIntegration, removeIntegrationRest, vm;
                                                                                                                     //
vm = Npm.require('vm');                                                                                              // 1
                                                                                                                     //
compiledScripts = {};                                                                                                // 3
                                                                                                                     //
getIntegrationScript = function(integration) {                                                                       // 5
  var compiledScript, e, sandbox, script, vmScript;                                                                  // 6
  compiledScript = compiledScripts[integration._id];                                                                 //
  if ((compiledScript != null) && +compiledScript._updatedAt === +integration._updatedAt) {                          //
    return compiledScript.script;                                                                                    // 8
  }                                                                                                                  //
  script = integration.scriptCompiled;                                                                               //
  vmScript = void 0;                                                                                                 //
  sandbox = {                                                                                                        //
    _: _,                                                                                                            //
    s: s,                                                                                                            //
    console: console,                                                                                                //
    Store: {                                                                                                         //
      set: function(key, val) {                                                                                      //
        return store[key] = val;                                                                                     // 18
      },                                                                                                             //
      get: function(key) {                                                                                           //
        return store[key];                                                                                           // 20
      }                                                                                                              //
    }                                                                                                                //
  };                                                                                                                 //
  try {                                                                                                              // 22
    logger.incoming.info('Will evaluate script of Trigger', integration.name);                                       //
    logger.incoming.debug(script);                                                                                   //
    vmScript = vm.createScript(script, 'script.js');                                                                 //
    vmScript.runInNewContext(sandbox);                                                                               //
    if (sandbox.Script != null) {                                                                                    //
      compiledScripts[integration._id] = {                                                                           //
        script: new sandbox.Script(),                                                                                //
        _updatedAt: integration._updatedAt                                                                           //
      };                                                                                                             //
      return compiledScripts[integration._id].script;                                                                // 35
    }                                                                                                                //
  } catch (error) {                                                                                                  //
    e = error;                                                                                                       //
    logger.incoming.error('[Error evaluating Script in Trigger', integration.name, ':]');                            //
    logger.incoming.error(script.replace(/^/gm, '  '));                                                              //
    logger.incoming.error("[Stack:]");                                                                               //
    logger.incoming.error(e.stack.replace(/^/gm, '  '));                                                             //
    throw RocketChat.API.v1.failure('error-evaluating-script');                                                      // 41
  }                                                                                                                  //
  if (sandbox.Script == null) {                                                                                      //
    logger.incoming.error('[Class "Script" not in Trigger', integration.name, ']');                                  //
    throw RocketChat.API.v1.failure('class-script-not-found');                                                       // 45
  }                                                                                                                  //
};                                                                                                                   // 5
                                                                                                                     //
Api = new Restivus({                                                                                                 // 48
  enableCors: true,                                                                                                  //
  apiPath: 'hooks/',                                                                                                 //
  auth: {                                                                                                            //
    user: function() {                                                                                               //
      var ref, user;                                                                                                 // 53
      if (((ref = this.bodyParams) != null ? ref.payload : void 0) != null) {                                        //
        this.bodyParams = JSON.parse(this.bodyParams.payload);                                                       //
      }                                                                                                              //
      this.integration = RocketChat.models.Integrations.findOne({                                                    //
        _id: this.request.params.integrationId,                                                                      //
        token: decodeURIComponent(this.request.params.token)                                                         //
      });                                                                                                            //
      if (this.integration == null) {                                                                                //
        logger.incoming.info("Invalid integration id", this.request.params.integrationId, "or token", this.request.params.token);
        return;                                                                                                      // 62
      }                                                                                                              //
      user = RocketChat.models.Users.findOne({                                                                       //
        _id: this.integration.userId                                                                                 //
      });                                                                                                            //
      return {                                                                                                       // 67
        user: user                                                                                                   //
      };                                                                                                             //
    }                                                                                                                //
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
createIntegration = function(options, user) {                                                                        // 70
  logger.incoming.info('Add integration');                                                                           //
  logger.incoming.debug(options);                                                                                    //
  Meteor.runAsUser(user._id, (function(_this) {                                                                      //
    return function() {                                                                                              //
      switch (options['event']) {                                                                                    // 75
        case 'newMessageOnChannel':                                                                                  // 75
          if (options.data == null) {                                                                                //
            options.data = {};                                                                                       //
          }                                                                                                          //
          if ((options.data.channel_name != null) && options.data.channel_name.indexOf('#') === -1) {                //
            options.data.channel_name = '#' + options.data.channel_name;                                             //
          }                                                                                                          //
          return Meteor.call('addOutgoingIntegration', {                                                             //
            username: 'rocket.cat',                                                                                  //
            urls: [options.target_url],                                                                              //
            name: options.name,                                                                                      //
            channel: options.data.channel_name,                                                                      //
            triggerWords: options.data.trigger_words                                                                 //
          });                                                                                                        //
        case 'newMessageToUser':                                                                                     // 75
          if (options.data.username.indexOf('@') === -1) {                                                           //
            options.data.username = '@' + options.data.username;                                                     //
          }                                                                                                          //
          return Meteor.call('addOutgoingIntegration', {                                                             //
            username: 'rocket.cat',                                                                                  //
            urls: [options.target_url],                                                                              //
            name: options.name,                                                                                      //
            channel: options.data.username,                                                                          //
            triggerWords: options.data.trigger_words                                                                 //
          });                                                                                                        //
      }                                                                                                              // 75
    };                                                                                                               //
  })(this));                                                                                                         //
  return RocketChat.API.v1.success();                                                                                // 100
};                                                                                                                   // 70
                                                                                                                     //
removeIntegration = function(options, user) {                                                                        // 103
  var integrationToRemove;                                                                                           // 104
  logger.incoming.info('Remove integration');                                                                        //
  logger.incoming.debug(options);                                                                                    //
  integrationToRemove = RocketChat.models.Integrations.findOne({                                                     //
    urls: options.target_url                                                                                         //
  });                                                                                                                //
  Meteor.runAsUser(user._id, (function(_this) {                                                                      //
    return function() {                                                                                              //
      return Meteor.call('deleteOutgoingIntegration', integrationToRemove._id);                                      //
    };                                                                                                               //
  })(this));                                                                                                         //
  return RocketChat.API.v1.success();                                                                                // 111
};                                                                                                                   // 103
                                                                                                                     //
executeIntegrationRest = function() {                                                                                // 114
  var defaultValues, e, message, ref, ref1, request, result, script;                                                 // 115
  logger.incoming.info('Post integration');                                                                          //
  logger.incoming.debug('@urlParams', this.urlParams);                                                               //
  logger.incoming.debug('@bodyParams', this.bodyParams);                                                             //
  if (this.integration.enabled !== true) {                                                                           //
    return {                                                                                                         // 120
      statusCode: 503,                                                                                               //
      body: 'Service Unavailable'                                                                                    //
    };                                                                                                               //
  }                                                                                                                  //
  defaultValues = {                                                                                                  //
    channel: this.integration.channel,                                                                               //
    alias: this.integration.alias,                                                                                   //
    avatar: this.integration.avatar,                                                                                 //
    emoji: this.integration.emoji                                                                                    //
  };                                                                                                                 //
  if (this.integration.scriptEnabled === true && (this.integration.scriptCompiled != null) && this.integration.scriptCompiled.trim() !== '') {
    script = void 0;                                                                                                 //
    try {                                                                                                            // 133
      script = getIntegrationScript(this.integration);                                                               //
    } catch (error) {                                                                                                //
      e = error;                                                                                                     //
      return e;                                                                                                      // 136
    }                                                                                                                //
    request = {                                                                                                      //
      url: {                                                                                                         //
        hash: this.request._parsedUrl.hash,                                                                          //
        search: this.request._parsedUrl.search,                                                                      //
        query: this.queryParams,                                                                                     //
        pathname: this.request._parsedUrl.pathname,                                                                  //
        path: this.request._parsedUrl.path                                                                           //
      },                                                                                                             //
      url_raw: this.request.url,                                                                                     //
      url_params: this.urlParams,                                                                                    //
      content: this.bodyParams,                                                                                      //
      content_raw: (ref = this.request._readableState) != null ? (ref1 = ref.buffer) != null ? ref1.toString() : void 0 : void 0,
      headers: this.request.headers,                                                                                 //
      user: {                                                                                                        //
        _id: this.user._id,                                                                                          //
        name: this.user.name,                                                                                        //
        username: this.user.username                                                                                 //
      }                                                                                                              //
    };                                                                                                               //
    try {                                                                                                            // 155
      result = script.process_incoming_request({                                                                     //
        request: request                                                                                             //
      });                                                                                                            //
      if ((result != null ? result.error : void 0) != null) {                                                        //
        return RocketChat.API.v1.failure(result.error);                                                              // 159
      }                                                                                                              //
      this.bodyParams = result != null ? result.content : void 0;                                                    //
      logger.incoming.debug('[Process Incoming Request result of Trigger', this.integration.name, ':]');             //
      logger.incoming.debug('result', this.bodyParams);                                                              //
    } catch (error) {                                                                                                //
      e = error;                                                                                                     //
      logger.incoming.error('[Error running Script in Trigger', this.integration.name, ':]');                        //
      logger.incoming.error(this.integration.scriptCompiled.replace(/^/gm, '  '));                                   //
      logger.incoming.error("[Stack:]");                                                                             //
      logger.incoming.error(e.stack.replace(/^/gm, '  '));                                                           //
      return RocketChat.API.v1.failure('error-running-script');                                                      // 170
    }                                                                                                                //
  }                                                                                                                  //
  if (this.bodyParams == null) {                                                                                     //
    return RocketChat.API.v1.failure('body-empty');                                                                  // 173
  }                                                                                                                  //
  this.bodyParams.bot = {                                                                                            //
    i: this.integration._id                                                                                          //
  };                                                                                                                 //
  try {                                                                                                              // 178
    message = processWebhookMessage(this.bodyParams, this.user, defaultValues);                                      //
    if (_.isEmpty(message)) {                                                                                        //
      return RocketChat.API.v1.failure('unknown-error');                                                             // 182
    }                                                                                                                //
    return RocketChat.API.v1.success();                                                                              // 184
  } catch (error) {                                                                                                  //
    e = error;                                                                                                       //
    return RocketChat.API.v1.failure(e.error);                                                                       // 186
  }                                                                                                                  //
};                                                                                                                   // 114
                                                                                                                     //
addIntegrationRest = function() {                                                                                    // 189
  return createIntegration(this.bodyParams, this.user);                                                              // 190
};                                                                                                                   // 189
                                                                                                                     //
removeIntegrationRest = function() {                                                                                 // 193
  return removeIntegration(this.bodyParams, this.user);                                                              // 194
};                                                                                                                   // 193
                                                                                                                     //
integrationSampleRest = function() {                                                                                 // 197
  logger.incoming.info('Sample Integration');                                                                        //
  return {                                                                                                           // 200
    statusCode: 200,                                                                                                 //
    body: [                                                                                                          //
      {                                                                                                              //
        token: Random.id(24),                                                                                        //
        channel_id: Random.id(),                                                                                     //
        channel_name: 'general',                                                                                     //
        timestamp: new Date,                                                                                         //
        user_id: Random.id(),                                                                                        //
        user_name: 'rocket.cat',                                                                                     //
        text: 'Sample text 1',                                                                                       //
        trigger_word: 'Sample'                                                                                       //
      }, {                                                                                                           //
        token: Random.id(24),                                                                                        //
        channel_id: Random.id(),                                                                                     //
        channel_name: 'general',                                                                                     //
        timestamp: new Date,                                                                                         //
        user_id: Random.id(),                                                                                        //
        user_name: 'rocket.cat',                                                                                     //
        text: 'Sample text 2',                                                                                       //
        trigger_word: 'Sample'                                                                                       //
      }, {                                                                                                           //
        token: Random.id(24),                                                                                        //
        channel_id: Random.id(),                                                                                     //
        channel_name: 'general',                                                                                     //
        timestamp: new Date,                                                                                         //
        user_id: Random.id(),                                                                                        //
        user_name: 'rocket.cat',                                                                                     //
        text: 'Sample text 3',                                                                                       //
        trigger_word: 'Sample'                                                                                       //
      }                                                                                                              //
    ]                                                                                                                //
  };                                                                                                                 //
};                                                                                                                   // 197
                                                                                                                     //
integrationInfoRest = function() {                                                                                   // 232
  logger.incoming.info('Info integration');                                                                          //
  return {                                                                                                           // 235
    statusCode: 200,                                                                                                 //
    body: {                                                                                                          //
      success: true                                                                                                  //
    }                                                                                                                //
  };                                                                                                                 //
};                                                                                                                   // 232
                                                                                                                     //
RocketChat.API.v1.addRoute('integrations.create', {                                                                  // 241
  authRequired: true                                                                                                 //
}, {                                                                                                                 //
  post: function() {                                                                                                 //
    return createIntegration(this.bodyParams, this.user);                                                            // 243
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
RocketChat.API.v1.addRoute('integrations.remove', {                                                                  // 246
  authRequired: true                                                                                                 //
}, {                                                                                                                 //
  post: function() {                                                                                                 //
    return removeIntegration(this.bodyParams, this.user);                                                            // 248
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
Api.addRoute(':integrationId/:userId/:token', {                                                                      // 251
  authRequired: true                                                                                                 //
}, {                                                                                                                 //
  post: executeIntegrationRest,                                                                                      //
  get: executeIntegrationRest                                                                                        //
});                                                                                                                  //
                                                                                                                     //
Api.addRoute(':integrationId/:token', {                                                                              // 252
  authRequired: true                                                                                                 //
}, {                                                                                                                 //
  post: executeIntegrationRest,                                                                                      //
  get: executeIntegrationRest                                                                                        //
});                                                                                                                  //
                                                                                                                     //
Api.addRoute('sample/:integrationId/:userId/:token', {                                                               // 254
  authRequired: true                                                                                                 //
}, {                                                                                                                 //
  get: integrationSampleRest                                                                                         //
});                                                                                                                  //
                                                                                                                     //
Api.addRoute('sample/:integrationId/:token', {                                                                       // 255
  authRequired: true                                                                                                 //
}, {                                                                                                                 //
  get: integrationSampleRest                                                                                         //
});                                                                                                                  //
                                                                                                                     //
Api.addRoute('info/:integrationId/:userId/:token', {                                                                 // 257
  authRequired: true                                                                                                 //
}, {                                                                                                                 //
  get: integrationInfoRest                                                                                           //
});                                                                                                                  //
                                                                                                                     //
Api.addRoute('info/:integrationId/:token', {                                                                         // 258
  authRequired: true                                                                                                 //
}, {                                                                                                                 //
  get: integrationInfoRest                                                                                           //
});                                                                                                                  //
                                                                                                                     //
Api.addRoute('add/:integrationId/:userId/:token', {                                                                  // 260
  authRequired: true                                                                                                 //
}, {                                                                                                                 //
  post: addIntegrationRest                                                                                           //
});                                                                                                                  //
                                                                                                                     //
Api.addRoute('add/:integrationId/:token', {                                                                          // 261
  authRequired: true                                                                                                 //
}, {                                                                                                                 //
  post: addIntegrationRest                                                                                           //
});                                                                                                                  //
                                                                                                                     //
Api.addRoute('remove/:integrationId/:userId/:token', {                                                               // 263
  authRequired: true                                                                                                 //
}, {                                                                                                                 //
  post: removeIntegrationRest                                                                                        //
});                                                                                                                  //
                                                                                                                     //
Api.addRoute('remove/:integrationId/:token', {                                                                       // 264
  authRequired: true                                                                                                 //
}, {                                                                                                                 //
  post: removeIntegrationRest                                                                                        //
});                                                                                                                  //
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"triggers.coffee.js":function(require){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/triggers.coffee.js                                                        //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var ExecuteTrigger, ExecuteTriggerUrl, ExecuteTriggers, addIntegration, compiledScripts, executeScript, getIntegrationScript, hasScriptAndMethod, removeIntegration, triggers, vm;
                                                                                                                     //
vm = Npm.require('vm');                                                                                              // 1
                                                                                                                     //
compiledScripts = {};                                                                                                // 3
                                                                                                                     //
getIntegrationScript = function(integration) {                                                                       // 5
  var compiledScript, e, sandbox, script, store, vmScript;                                                           // 6
  compiledScript = compiledScripts[integration._id];                                                                 //
  if ((compiledScript != null) && +compiledScript._updatedAt === +integration._updatedAt) {                          //
    return compiledScript.script;                                                                                    // 8
  }                                                                                                                  //
  script = integration.scriptCompiled;                                                                               //
  vmScript = void 0;                                                                                                 //
  store = {};                                                                                                        //
  sandbox = {                                                                                                        //
    _: _,                                                                                                            //
    s: s,                                                                                                            //
    console: console,                                                                                                //
    Store: {                                                                                                         //
      set: function(key, val) {                                                                                      //
        return store[key] = val;                                                                                     // 19
      },                                                                                                             //
      get: function(key) {                                                                                           //
        return store[key];                                                                                           // 21
      }                                                                                                              //
    },                                                                                                               //
    HTTP: function(method, url, options) {                                                                           //
      var e;                                                                                                         // 23
      try {                                                                                                          // 23
        return {                                                                                                     // 24
          result: HTTP.call(method, url, options)                                                                    //
        };                                                                                                           //
      } catch (error1) {                                                                                             //
        e = error1;                                                                                                  //
        return {                                                                                                     // 27
          error: e                                                                                                   //
        };                                                                                                           //
      }                                                                                                              //
    }                                                                                                                //
  };                                                                                                                 //
  try {                                                                                                              // 30
    logger.outgoing.info('Will evaluate script of Trigger', integration.name);                                       //
    logger.outgoing.debug(script);                                                                                   //
    vmScript = vm.createScript(script, 'script.js');                                                                 //
    vmScript.runInNewContext(sandbox);                                                                               //
    if (sandbox.Script != null) {                                                                                    //
      compiledScripts[integration._id] = {                                                                           //
        script: new sandbox.Script(),                                                                                //
        _updatedAt: integration._updatedAt                                                                           //
      };                                                                                                             //
      return compiledScripts[integration._id].script;                                                                // 43
    }                                                                                                                //
  } catch (error1) {                                                                                                 //
    e = error1;                                                                                                      //
    logger.outgoing.error('[Error evaluating Script in Trigger', integration.name, ':]');                            //
    logger.outgoing.error(script.replace(/^/gm, '  '));                                                              //
    logger.outgoing.error("[Stack:]");                                                                               //
    logger.outgoing.error(e.stack.replace(/^/gm, '  '));                                                             //
    throw new Meteor.Error('error-evaluating-script');                                                               // 49
  }                                                                                                                  //
  if (sandbox.Script == null) {                                                                                      //
    logger.outgoing.error('[Class "Script" not in Trigger', integration.name, ']');                                  //
    throw new Meteor.Error('class-script-not-found');                                                                // 53
  }                                                                                                                  //
};                                                                                                                   // 5
                                                                                                                     //
triggers = {};                                                                                                       // 56
                                                                                                                     //
hasScriptAndMethod = function(integration, method) {                                                                 // 58
  var e, script;                                                                                                     // 59
  if (integration.scriptEnabled !== true || (integration.scriptCompiled == null) || integration.scriptCompiled.trim() === '') {
    return false;                                                                                                    // 60
  }                                                                                                                  //
  script = void 0;                                                                                                   //
  try {                                                                                                              // 63
    script = getIntegrationScript(integration);                                                                      //
  } catch (error1) {                                                                                                 //
    e = error1;                                                                                                      //
    return;                                                                                                          // 66
  }                                                                                                                  //
  return script[method] != null;                                                                                     // 68
};                                                                                                                   // 58
                                                                                                                     //
executeScript = function(integration, method, params) {                                                              // 70
  var e, result, script;                                                                                             // 71
  script = void 0;                                                                                                   //
  try {                                                                                                              // 72
    script = getIntegrationScript(integration);                                                                      //
  } catch (error1) {                                                                                                 //
    e = error1;                                                                                                      //
    return;                                                                                                          // 75
  }                                                                                                                  //
  if (script[method] == null) {                                                                                      //
    logger.outgoing.error('[Method "', method, '" not found in Trigger', integration.name, ']');                     //
    return;                                                                                                          // 79
  }                                                                                                                  //
  try {                                                                                                              // 81
    result = script[method](params);                                                                                 //
    logger.outgoing.debug('[Script method [', method, '] result of Trigger', integration.name, ':]');                //
    logger.outgoing.debug(result);                                                                                   //
    return result;                                                                                                   // 87
  } catch (error1) {                                                                                                 //
    e = error1;                                                                                                      //
    logger.incoming.error('[Error running Script in Trigger', integration.name, ':]');                               //
    logger.incoming.error(integration.scriptCompiled.replace(/^/gm, '  '));                                          //
    logger.incoming.error("[Stack:]");                                                                               //
    logger.incoming.error(e.stack.replace(/^/gm, '  '));                                                             //
  }                                                                                                                  //
};                                                                                                                   // 70
                                                                                                                     //
addIntegration = function(record) {                                                                                  // 96
  var channel, channels, i, len, results;                                                                            // 97
  if (_.isEmpty(record.channel)) {                                                                                   //
    channels = ['__any'];                                                                                            //
  } else {                                                                                                           //
    channels = [].concat(record.channel);                                                                            //
  }                                                                                                                  //
  results = [];                                                                                                      // 102
  for (i = 0, len = channels.length; i < len; i++) {                                                                 //
    channel = channels[i];                                                                                           //
    if (triggers[channel] == null) {                                                                                 //
      triggers[channel] = {};                                                                                        //
    }                                                                                                                //
    results.push(triggers[channel][record._id] = record);                                                            //
  }                                                                                                                  // 102
  return results;                                                                                                    //
};                                                                                                                   // 96
                                                                                                                     //
removeIntegration = function(record) {                                                                               // 106
  var channel, results, trigger;                                                                                     // 107
  results = [];                                                                                                      // 107
  for (channel in triggers) {                                                                                        //
    trigger = triggers[channel];                                                                                     //
    results.push(delete trigger[record._id]);                                                                        //
  }                                                                                                                  // 107
  return results;                                                                                                    //
};                                                                                                                   // 106
                                                                                                                     //
RocketChat.models.Integrations.find({                                                                                // 110
  type: 'webhook-outgoing'                                                                                           //
}).observe({                                                                                                         //
  added: function(record) {                                                                                          //
    return addIntegration(record);                                                                                   //
  },                                                                                                                 //
  changed: function(record) {                                                                                        //
    removeIntegration(record);                                                                                       //
    return addIntegration(record);                                                                                   //
  },                                                                                                                 //
  removed: function(record) {                                                                                        //
    return removeIntegration(record);                                                                                //
  }                                                                                                                  //
});                                                                                                                  //
                                                                                                                     //
ExecuteTriggerUrl = function(url, trigger, message, room, tries) {                                                   // 122
  var data, i, len, opts, ref, ref1, sandbox, sendMessage, triggerWord, word;                                        // 123
  if (tries == null) {                                                                                               //
    tries = 0;                                                                                                       //
  }                                                                                                                  //
  word = void 0;                                                                                                     //
  if (((ref = trigger.triggerWords) != null ? ref.length : void 0) > 0) {                                            //
    ref1 = trigger.triggerWords;                                                                                     // 125
    for (i = 0, len = ref1.length; i < len; i++) {                                                                   // 125
      triggerWord = ref1[i];                                                                                         //
      if (message.msg.indexOf(triggerWord) === 0) {                                                                  //
        word = triggerWord;                                                                                          //
        break;                                                                                                       // 128
      }                                                                                                              //
    }                                                                                                                // 125
    if (word == null) {                                                                                              //
      return;                                                                                                        // 132
    }                                                                                                                //
  }                                                                                                                  //
  data = {                                                                                                           //
    token: trigger.token,                                                                                            //
    channel_id: room._id,                                                                                            //
    channel_name: room.name,                                                                                         //
    timestamp: message.ts,                                                                                           //
    user_id: message.u._id,                                                                                          //
    user_name: message.u.username,                                                                                   //
    text: message.msg                                                                                                //
  };                                                                                                                 //
  if (message.alias != null) {                                                                                       //
    data.alias = message.alias;                                                                                      //
  }                                                                                                                  //
  if (message.bot != null) {                                                                                         //
    data.bot = message.bot;                                                                                          //
  } else {                                                                                                           //
    data.bot = false;                                                                                                //
  }                                                                                                                  //
  if (word != null) {                                                                                                //
    data.trigger_word = word;                                                                                        //
  }                                                                                                                  //
  logger.outgoing.info('Will execute trigger', trigger.name, 'to', url);                                             //
  logger.outgoing.debug(data);                                                                                       //
  sendMessage = function(message) {                                                                                  //
    var defaultValues, ref2, user;                                                                                   // 158
    if ((ref2 = trigger.impersonateUser) != null ? ref2 : false) {                                                   //
      user = RocketChat.models.Users.findOneByUsername(data.user_name);                                              //
    } else {                                                                                                         //
      user = RocketChat.models.Users.findOneByUsername(trigger.username);                                            //
    }                                                                                                                //
    message.bot = {                                                                                                  //
      i: trigger._id                                                                                                 //
    };                                                                                                               //
    defaultValues = {                                                                                                //
      alias: trigger.alias,                                                                                          //
      avatar: trigger.avatar,                                                                                        //
      emoji: trigger.emoji                                                                                           //
    };                                                                                                               //
    if (room.t === 'd') {                                                                                            //
      message.channel = '@' + room._id;                                                                              //
    } else {                                                                                                         //
      message.channel = '#' + room._id;                                                                              //
    }                                                                                                                //
    return message = processWebhookMessage(message, user, defaultValues);                                            //
  };                                                                                                                 //
  opts = {                                                                                                           //
    params: {},                                                                                                      //
    method: 'POST',                                                                                                  //
    url: url,                                                                                                        //
    data: data,                                                                                                      //
    auth: void 0,                                                                                                    //
    npmRequestOptions: {                                                                                             //
      rejectUnauthorized: !RocketChat.settings.get('Allow_Invalid_SelfSigned_Certs'),                                //
      strictSSL: !RocketChat.settings.get('Allow_Invalid_SelfSigned_Certs')                                          //
    },                                                                                                               //
    headers: {                                                                                                       //
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.0 Safari/537.36'
    }                                                                                                                //
  };                                                                                                                 //
  if (hasScriptAndMethod(trigger, 'prepare_outgoing_request')) {                                                     //
    sandbox = {                                                                                                      //
      request: opts                                                                                                  //
    };                                                                                                               //
    opts = executeScript(trigger, 'prepare_outgoing_request', sandbox);                                              //
  }                                                                                                                  //
  if (opts == null) {                                                                                                //
    return;                                                                                                          // 198
  }                                                                                                                  //
  if (opts.message != null) {                                                                                        //
    sendMessage(opts.message);                                                                                       //
  }                                                                                                                  //
  if ((opts.url == null) || (opts.method == null)) {                                                                 //
    return;                                                                                                          // 204
  }                                                                                                                  //
  return HTTP.call(opts.method, opts.url, opts, function(error, result) {                                            //
    var ref2, ref3, ref4, ref5, scriptResult, waitTime;                                                              // 207
    if (result == null) {                                                                                            //
      logger.outgoing.info('Result for trigger', trigger.name, 'to', url, 'is empty');                               //
    } else {                                                                                                         //
      logger.outgoing.info('Status code for trigger', trigger.name, 'to', url, 'is', result.statusCode);             //
    }                                                                                                                //
    scriptResult = void 0;                                                                                           //
    if (hasScriptAndMethod(trigger, 'process_outgoing_response')) {                                                  //
      sandbox = {                                                                                                    //
        request: opts,                                                                                               //
        response: {                                                                                                  //
          error: error,                                                                                              //
          status_code: result.statusCode,                                                                            //
          content: result.data,                                                                                      //
          content_raw: result.content,                                                                               //
          headers: result.headers                                                                                    //
        }                                                                                                            //
      };                                                                                                             //
      scriptResult = executeScript(trigger, 'process_outgoing_response', sandbox);                                   //
      if (scriptResult != null ? scriptResult.content : void 0) {                                                    //
        sendMessage(scriptResult.content);                                                                           //
        return;                                                                                                      // 227
      }                                                                                                              //
      if (scriptResult === false) {                                                                                  //
        return;                                                                                                      // 230
      }                                                                                                              //
    }                                                                                                                //
    if ((result == null) || ((ref2 = result.statusCode) !== 200 && ref2 !== 201 && ref2 !== 202)) {                  //
      if (error != null) {                                                                                           //
        logger.outgoing.error('Error for trigger', trigger.name, 'to', url, error);                                  //
      }                                                                                                              //
      if (result != null) {                                                                                          //
        logger.outgoing.error('Error for trigger', trigger.name, 'to', url, result);                                 //
      }                                                                                                              //
      if (result.statusCode === 410) {                                                                               //
        RocketChat.models.Integrations.remove({                                                                      //
          _id: trigger._id                                                                                           //
        });                                                                                                          //
        return;                                                                                                      // 240
      }                                                                                                              //
      if (result.statusCode === 500) {                                                                               //
        logger.outgoing.error('Error [500] for trigger', trigger.name, 'to', url);                                   //
        logger.outgoing.error(result.content);                                                                       //
        return;                                                                                                      // 245
      }                                                                                                              //
      if (tries <= 6) {                                                                                              //
        waitTime = Math.pow(10, tries + 2);                                                                          //
        logger.outgoing.info('Trying trigger', trigger.name, 'to', url, 'again in', waitTime, 'seconds');            //
        Meteor.setTimeout(function() {                                                                               //
          return ExecuteTriggerUrl(url, trigger, message, room, tries + 1);                                          //
        }, waitTime);                                                                                                //
      }                                                                                                              //
      return;                                                                                                        // 255
    }                                                                                                                //
    if ((ref3 = result != null ? result.statusCode : void 0) === 200 || ref3 === 201 || ref3 === 202) {              //
      if (((result != null ? (ref4 = result.data) != null ? ref4.text : void 0 : void 0) != null) || ((result != null ? (ref5 = result.data) != null ? ref5.attachments : void 0 : void 0) != null)) {
        return sendMessage(result.data);                                                                             //
      }                                                                                                              //
    }                                                                                                                //
  });                                                                                                                //
};                                                                                                                   // 122
                                                                                                                     //
ExecuteTrigger = function(trigger, message, room) {                                                                  // 263
  var i, len, ref, results, url;                                                                                     // 264
  ref = trigger.urls;                                                                                                // 264
  results = [];                                                                                                      // 264
  for (i = 0, len = ref.length; i < len; i++) {                                                                      //
    url = ref[i];                                                                                                    //
    results.push(ExecuteTriggerUrl(url, trigger, message, room));                                                    //
  }                                                                                                                  // 264
  return results;                                                                                                    //
};                                                                                                                   // 263
                                                                                                                     //
ExecuteTriggers = function(message, room) {                                                                          // 268
  var i, id, key, len, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, trigger, triggerToExecute, triggersToExecute, username;
  if (room == null) {                                                                                                //
    return;                                                                                                          // 270
  }                                                                                                                  //
  triggersToExecute = [];                                                                                            //
  switch (room.t) {                                                                                                  // 274
    case 'd':                                                                                                        // 274
      id = room._id.replace(message.u._id, '');                                                                      //
      username = _.without(room.usernames, message.u.username);                                                      //
      username = username[0];                                                                                        //
      if (triggers['@' + id] != null) {                                                                              //
        ref = triggers['@' + id];                                                                                    // 282
        for (key in ref) {                                                                                           // 282
          trigger = ref[key];                                                                                        //
          triggersToExecute.push(trigger);                                                                           //
        }                                                                                                            // 282
      }                                                                                                              //
      if (triggers.all_direct_messages != null) {                                                                    //
        ref1 = triggers.all_direct_messages;                                                                         // 285
        for (key in ref1) {                                                                                          // 285
          trigger = ref1[key];                                                                                       //
          triggersToExecute.push(trigger);                                                                           //
        }                                                                                                            // 285
      }                                                                                                              //
      if (id !== username && (triggers['@' + username] != null)) {                                                   //
        ref2 = triggers['@' + username];                                                                             // 288
        for (key in ref2) {                                                                                          // 288
          trigger = ref2[key];                                                                                       //
          triggersToExecute.push(trigger);                                                                           //
        }                                                                                                            // 288
      }                                                                                                              //
      break;                                                                                                         // 275
    case 'c':                                                                                                        // 274
      if (triggers.__any != null) {                                                                                  //
        ref3 = triggers.__any;                                                                                       // 292
        for (key in ref3) {                                                                                          // 292
          trigger = ref3[key];                                                                                       //
          triggersToExecute.push(trigger);                                                                           //
        }                                                                                                            // 292
      }                                                                                                              //
      if (triggers.all_public_channels != null) {                                                                    //
        ref4 = triggers.all_public_channels;                                                                         // 295
        for (key in ref4) {                                                                                          // 295
          trigger = ref4[key];                                                                                       //
          triggersToExecute.push(trigger);                                                                           //
        }                                                                                                            // 295
      }                                                                                                              //
      if (triggers['#' + room._id] != null) {                                                                        //
        ref5 = triggers['#' + room._id];                                                                             // 298
        for (key in ref5) {                                                                                          // 298
          trigger = ref5[key];                                                                                       //
          triggersToExecute.push(trigger);                                                                           //
        }                                                                                                            // 298
      }                                                                                                              //
      if (room._id !== room.name && (triggers['#' + room.name] != null)) {                                           //
        ref6 = triggers['#' + room.name];                                                                            // 301
        for (key in ref6) {                                                                                          // 301
          trigger = ref6[key];                                                                                       //
          triggersToExecute.push(trigger);                                                                           //
        }                                                                                                            // 301
      }                                                                                                              //
      break;                                                                                                         // 290
    default:                                                                                                         // 274
      if (triggers.all_private_groups != null) {                                                                     //
        ref7 = triggers.all_private_groups;                                                                          // 305
        for (key in ref7) {                                                                                          // 305
          trigger = ref7[key];                                                                                       //
          triggersToExecute.push(trigger);                                                                           //
        }                                                                                                            // 305
      }                                                                                                              //
      if (triggers['#' + room._id] != null) {                                                                        //
        ref8 = triggers['#' + room._id];                                                                             // 308
        for (key in ref8) {                                                                                          // 308
          trigger = ref8[key];                                                                                       //
          triggersToExecute.push(trigger);                                                                           //
        }                                                                                                            // 308
      }                                                                                                              //
      if (room._id !== room.name && (triggers['#' + room.name] != null)) {                                           //
        ref9 = triggers['#' + room.name];                                                                            // 311
        for (key in ref9) {                                                                                          // 311
          trigger = ref9[key];                                                                                       //
          triggersToExecute.push(trigger);                                                                           //
        }                                                                                                            // 311
      }                                                                                                              //
  }                                                                                                                  // 274
  for (i = 0, len = triggersToExecute.length; i < len; i++) {                                                        // 314
    triggerToExecute = triggersToExecute[i];                                                                         //
    if (triggerToExecute.enabled === true) {                                                                         //
      ExecuteTrigger(triggerToExecute, message, room);                                                               //
    }                                                                                                                //
  }                                                                                                                  // 314
  return message;                                                                                                    // 318
};                                                                                                                   // 268
                                                                                                                     //
RocketChat.callbacks.add('afterSaveMessage', ExecuteTriggers, RocketChat.callbacks.priority.LOW, 'ExecuteTriggers');
                                                                                                                     //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"processWebhookMessage.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_integrations/server/processWebhookMessage.js                                                  //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
this.processWebhookMessage = function (messageObj, user, defaultValues) {                                            // 1
	var attachment, channel, channels, channelType, i, len, message, ref, rid, room, roomUser, ret;                     // 2
	ret = [];                                                                                                           // 3
                                                                                                                     //
	if (!defaultValues) {                                                                                               // 5
		defaultValues = {                                                                                                  // 6
			channel: '',                                                                                                      // 7
			alias: '',                                                                                                        // 8
			avatar: '',                                                                                                       // 9
			emoji: ''                                                                                                         // 10
		};                                                                                                                 // 6
	}                                                                                                                   // 12
                                                                                                                     //
	channel = messageObj.channel || defaultValues.channel;                                                              // 14
                                                                                                                     //
	channels = [].concat(channel);                                                                                      // 16
                                                                                                                     //
	for (var _iterator = channels, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
		if (_isArray) {                                                                                                    // 18
			if (_i >= _iterator.length) break;                                                                                // 18
			channel = _iterator[_i++];                                                                                        // 18
		} else {                                                                                                           // 18
			_i = _iterator.next();                                                                                            // 18
			if (_i.done) break;                                                                                               // 18
			channel = _i.value;                                                                                               // 18
		}                                                                                                                  // 18
                                                                                                                     //
		channelType = channel[0];                                                                                          // 19
                                                                                                                     //
		channel = channel.substr(1);                                                                                       // 21
                                                                                                                     //
		switch (channelType) {                                                                                             // 23
			case '#':                                                                                                         // 24
				room = RocketChat.models.Rooms.findOneByIdOrName(channel);                                                       // 25
				if (!_.isObject(room)) {                                                                                         // 26
					throw new Meteor.Error('invalid-channel');                                                                      // 27
				}                                                                                                                // 28
				rid = room._id;                                                                                                  // 29
				if (room.t === 'c') {                                                                                            // 30
					Meteor.runAsUser(user._id, function () {                                                                        // 31
						return Meteor.call('joinRoom', room._id);                                                                      // 32
					});                                                                                                             // 33
				}                                                                                                                // 34
				break;                                                                                                           // 35
			case '@':                                                                                                         // 36
				roomUser = RocketChat.models.Users.findOne({                                                                     // 37
					$or: [{                                                                                                         // 38
						_id: channel                                                                                                   // 40
					}, {                                                                                                            // 39
						username: channel                                                                                              // 42
					}]                                                                                                              // 41
				}) || {};                                                                                                        // 37
				rid = [user._id, roomUser._id].sort().join('');                                                                  // 46
				room = RocketChat.models.Rooms.findOneById({ $in: [rid, channel] });                                             // 47
				if (!_.isObject(roomUser) && !_.isObject(room)) {                                                                // 48
					throw new Meteor.Error('invalid-channel');                                                                      // 49
				}                                                                                                                // 50
				if (!room) {                                                                                                     // 51
					Meteor.runAsUser(user._id, function () {                                                                        // 52
						Meteor.call('createDirectMessage', roomUser.username);                                                         // 53
						room = RocketChat.models.Rooms.findOneById(rid);                                                               // 54
					});                                                                                                             // 55
				}                                                                                                                // 56
				break;                                                                                                           // 57
			default:                                                                                                          // 58
				throw new Meteor.Error('invalid-channel-type');                                                                  // 59
		}                                                                                                                  // 23
                                                                                                                     //
		if (messageObj.attachments && !_.isArray(messageObj.attachments)) {                                                // 62
			console.log('Attachments should be Array, ignoring value'.red, messageObj.attachments);                           // 63
			messageObj.attachments = undefined;                                                                               // 64
		}                                                                                                                  // 65
                                                                                                                     //
		message = {                                                                                                        // 67
			alias: messageObj.username || messageObj.alias || defaultValues.alias,                                            // 68
			msg: _.trim(messageObj.text || messageObj.msg || ''),                                                             // 69
			attachments: messageObj.attachments,                                                                              // 70
			parseUrls: messageObj.parseUrls !== undefined ? messageObj.parseUrls : !messageObj.attachments,                   // 71
			bot: messageObj.bot,                                                                                              // 72
			groupable: messageObj.groupable !== undefined ? messageObj.groupable : false                                      // 73
		};                                                                                                                 // 67
                                                                                                                     //
		if (!_.isEmpty(messageObj.icon_url) || !_.isEmpty(messageObj.avatar)) {                                            // 76
			message.avatar = messageObj.icon_url || messageObj.avatar;                                                        // 77
		} else if (!_.isEmpty(messageObj.icon_emoji) || !_.isEmpty(messageObj.emoji)) {                                    // 78
			message.emoji = messageObj.icon_emoji || messageObj.emoji;                                                        // 79
		} else if (!_.isEmpty(defaultValues.avatar)) {                                                                     // 80
			message.avatar = defaultValues.avatar;                                                                            // 81
		} else if (!_.isEmpty(defaultValues.emoji)) {                                                                      // 82
			message.emoji = defaultValues.emoji;                                                                              // 83
		}                                                                                                                  // 84
                                                                                                                     //
		if (_.isArray(message.attachments)) {                                                                              // 86
			ref = message.attachments;                                                                                        // 87
			for (i = 0, len = ref.length; i < len; i++) {                                                                     // 88
				attachment = ref[i];                                                                                             // 89
				if (attachment.msg) {                                                                                            // 90
					attachment.text = _.trim(attachment.msg);                                                                       // 91
					delete attachment.msg;                                                                                          // 92
				}                                                                                                                // 93
			}                                                                                                                 // 94
		}                                                                                                                  // 95
                                                                                                                     //
		var messageReturn = RocketChat.sendMessage(user, message, room);                                                   // 97
		ret.push({ channel: channel, message: messageReturn });                                                            // 98
	}                                                                                                                   // 99
	return ret;                                                                                                         // 100
};                                                                                                                   // 101
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{"extensions":[".js",".json",".coffee"]});
require("./node_modules/meteor/rocketchat:integrations/lib/rocketchat.coffee.js");
require("./node_modules/meteor/rocketchat:integrations/client/stylesheets/load.coffee.js");
require("./node_modules/meteor/rocketchat:integrations/server/logger.js");
require("./node_modules/meteor/rocketchat:integrations/server/lib/validation.coffee.js");
require("./node_modules/meteor/rocketchat:integrations/server/models/Integrations.coffee.js");
require("./node_modules/meteor/rocketchat:integrations/server/publications/integrations.coffee.js");
require("./node_modules/meteor/rocketchat:integrations/server/methods/incoming/addIncomingIntegration.coffee.js");
require("./node_modules/meteor/rocketchat:integrations/server/methods/incoming/updateIncomingIntegration.coffee.js");
require("./node_modules/meteor/rocketchat:integrations/server/methods/incoming/deleteIncomingIntegration.coffee.js");
require("./node_modules/meteor/rocketchat:integrations/server/methods/outgoing/addOutgoingIntegration.coffee.js");
require("./node_modules/meteor/rocketchat:integrations/server/methods/outgoing/updateOutgoingIntegration.coffee.js");
require("./node_modules/meteor/rocketchat:integrations/server/methods/outgoing/deleteOutgoingIntegration.coffee.js");
require("./node_modules/meteor/rocketchat:integrations/server/api/api.coffee.js");
require("./node_modules/meteor/rocketchat:integrations/server/triggers.coffee.js");
require("./node_modules/meteor/rocketchat:integrations/server/processWebhookMessage.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:integrations'] = {};

})();

//# sourceMappingURL=rocketchat_integrations.js.map
