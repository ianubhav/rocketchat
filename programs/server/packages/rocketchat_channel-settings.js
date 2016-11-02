(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var RocketChat = Package['rocketchat:lib'].RocketChat;
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
var __coffeescriptShare;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:channel-settings":{"server":{"functions":{"saveRoomType.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_channel-settings/server/functions/saveRoomType.coffee.js                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.saveRoomType = function(rid, roomType, user, sendMessage) {                                                // 1
  var message, result;                                                                                                // 2
  if (sendMessage == null) {                                                                                          //
    sendMessage = true;                                                                                               //
  }                                                                                                                   //
  if (!Match.test(rid, String)) {                                                                                     //
    throw new Meteor.Error('invalid-room', 'Invalid room', {                                                          // 3
      "function": 'RocketChat.saveRoomType'                                                                           //
    });                                                                                                               //
  }                                                                                                                   //
  if (roomType !== 'c' && roomType !== 'p') {                                                                         //
    throw new Meteor.Error('error-invalid-room-type', 'error-invalid-room-type', {                                    // 6
      type: roomType                                                                                                  //
    });                                                                                                               //
  }                                                                                                                   //
  result = RocketChat.models.Rooms.setTypeById(rid, roomType) && RocketChat.models.Subscriptions.updateTypeByRoomId(rid, roomType);
  if (result && sendMessage) {                                                                                        //
    if (roomType === 'c') {                                                                                           //
      message = TAPi18n.__('Channel', {                                                                               //
        lng: (user != null ? user.language : void 0) || RocketChat.settings.get('language') || 'en'                   //
      });                                                                                                             //
    } else {                                                                                                          //
      message = TAPi18n.__('Private_Group', {                                                                         //
        lng: (user != null ? user.language : void 0) || RocketChat.settings.get('language') || 'en'                   //
      });                                                                                                             //
    }                                                                                                                 //
    RocketChat.models.Messages.createRoomSettingsChangedWithTypeRoomIdMessageAndUser('room_changed_privacy', rid, message, user);
  }                                                                                                                   //
  return result;                                                                                                      // 18
};                                                                                                                    // 1
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"saveRoomTopic.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_channel-settings/server/functions/saveRoomTopic.coffee.js                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.saveRoomTopic = function(rid, roomTopic, user, sendMessage) {                                              // 1
  var update;                                                                                                         // 2
  if (sendMessage == null) {                                                                                          //
    sendMessage = true;                                                                                               //
  }                                                                                                                   //
  if (!Match.test(rid, String)) {                                                                                     //
    throw new Meteor.Error('invalid-room', 'Invalid room', {                                                          // 3
      "function": 'RocketChat.saveRoomTopic'                                                                          //
    });                                                                                                               //
  }                                                                                                                   //
  roomTopic = s.escapeHTML(roomTopic);                                                                                //
  update = RocketChat.models.Rooms.setTopicById(rid, roomTopic);                                                      //
  if (update && sendMessage) {                                                                                        //
    RocketChat.models.Messages.createRoomSettingsChangedWithTypeRoomIdMessageAndUser('room_changed_topic', rid, roomTopic, user);
  }                                                                                                                   //
  return update;                                                                                                      // 12
};                                                                                                                    // 1
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"saveRoomName.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_channel-settings/server/functions/saveRoomName.coffee.js                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.saveRoomName = function(rid, name, user, sendMessage) {                                                    // 1
  var nameValidation, ref, room, update;                                                                              // 2
  if (sendMessage == null) {                                                                                          //
    sendMessage = true;                                                                                               //
  }                                                                                                                   //
  room = RocketChat.models.Rooms.findOneById(rid);                                                                    //
  if ((ref = room.t) !== 'c' && ref !== 'p') {                                                                        //
    throw new Meteor.Error('error-not-allowed', 'Not allowed', {                                                      // 5
      "function": 'RocketChat.saveRoomName'                                                                           //
    });                                                                                                               //
  }                                                                                                                   //
  try {                                                                                                               // 7
    nameValidation = new RegExp('^' + RocketChat.settings.get('UTF8_Names_Validation') + '$');                        //
  } catch (error) {                                                                                                   //
    nameValidation = new RegExp('^[0-9a-zA-Z-_.]+$');                                                                 //
  }                                                                                                                   //
  if (!nameValidation.test(name)) {                                                                                   //
    throw new Meteor.Error('error-invalid-room-name', name + ' is not a valid room name. Use only letters, numbers, hyphens and underscores', {
      "function": 'RocketChat.saveRoomName',                                                                          //
      room_name: name                                                                                                 //
    });                                                                                                               //
  }                                                                                                                   //
  if (name === room.name) {                                                                                           //
    return;                                                                                                           // 19
  }                                                                                                                   //
  if (RocketChat.models.Rooms.findOneByName(name)) {                                                                  //
    throw new Meteor.Error('error-duplicate-channel-name', 'A channel with name \'' + name + '\' exists', {           // 23
      "function": 'RocketChat.saveRoomName',                                                                          //
      channel_name: name                                                                                              //
    });                                                                                                               //
  }                                                                                                                   //
  update = RocketChat.models.Rooms.setNameById(rid, name) && RocketChat.models.Subscriptions.updateNameAndAlertByRoomId(rid, name);
  if (update && sendMessage) {                                                                                        //
    RocketChat.models.Messages.createRoomRenamedWithRoomIdRoomNameAndUser(rid, name, user);                           //
  }                                                                                                                   //
  return name;                                                                                                        // 29
};                                                                                                                    // 1
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"saveRoomReadOnly.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_channel-settings/server/functions/saveRoomReadOnly.coffee.js                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.saveRoomReadOnly = function(rid, readOnly, user) {                                                         // 1
  var update;                                                                                                         // 2
  if (!Match.test(rid, String)) {                                                                                     //
    throw new Meteor.Error('invalid-room', 'Invalid room', {                                                          // 3
      "function": 'RocketChat.saveRoomReadOnly'                                                                       //
    });                                                                                                               //
  }                                                                                                                   //
  update = RocketChat.models.Rooms.setReadOnlyById(rid, readOnly);                                                    //
  return update;                                                                                                      // 7
};                                                                                                                    // 1
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"saveRoomDescription.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_channel-settings/server/functions/saveRoomDescription.coffee.js                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.saveRoomDescription = function(rid, roomDescription, user) {                                               // 1
  var update;                                                                                                         // 2
  if (!Match.test(rid, String)) {                                                                                     //
    throw new Meteor.Error('invalid-room', 'Invalid room', {                                                          // 3
      "function": 'RocketChat.saveRoomDescription'                                                                    //
    });                                                                                                               //
  }                                                                                                                   //
  roomDescription = s.escapeHTML(roomDescription);                                                                    //
  update = RocketChat.models.Rooms.setDescriptionById(rid, roomDescription);                                          //
  RocketChat.models.Messages.createRoomSettingsChangedWithTypeRoomIdMessageAndUser('room_changed_description', rid, roomDescription, user);
  return update;                                                                                                      // 11
};                                                                                                                    // 1
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"saveRoomSystemMessages.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_channel-settings/server/functions/saveRoomSystemMessages.coffee.js                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.saveRoomSystemMessages = function(rid, systemMessages, user) {                                             // 1
  var update;                                                                                                         // 2
  if (!Match.test(rid, String)) {                                                                                     //
    throw new Meteor.Error('invalid-room', 'Invalid room', {                                                          // 3
      "function": 'RocketChat.saveRoomSystemMessages'                                                                 //
    });                                                                                                               //
  }                                                                                                                   //
  update = RocketChat.models.Rooms.setSystemMessagesById(rid, systemMessages);                                        //
  return update;                                                                                                      // 7
};                                                                                                                    // 1
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"methods":{"saveRoomSettings.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_channel-settings/server/methods/saveRoomSettings.coffee.js                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                      // 1
  saveRoomSettings: function(rid, setting, value) {                                                                   //
    var name, room;                                                                                                   // 3
    if (!Meteor.userId()) {                                                                                           //
      throw new Meteor.Error('error-invalid-user', "Invalid user", {                                                  // 4
        "function": 'RocketChat.saveRoomName'                                                                         //
      });                                                                                                             //
    }                                                                                                                 //
    if (!Match.test(rid, String)) {                                                                                   //
      throw new Meteor.Error('error-invalid-room', 'Invalid room', {                                                  // 7
        method: 'saveRoomSettings'                                                                                    //
      });                                                                                                             //
    }                                                                                                                 //
    if (setting !== 'roomName' && setting !== 'roomTopic' && setting !== 'roomDescription' && setting !== 'roomType' && setting !== 'readOnly' && setting !== 'systemMessages' && setting !== 'default' && setting !== 'joinCode') {
      throw new Meteor.Error('error-invalid-settings', 'Invalid settings provided', {                                 // 10
        method: 'saveRoomSettings'                                                                                    //
      });                                                                                                             //
    }                                                                                                                 //
    if (!RocketChat.authz.hasPermission(Meteor.userId(), 'edit-room', rid)) {                                         //
      throw new Meteor.Error('error-action-not-allowed', 'Editing room is not allowed', {                             // 13
        method: 'saveRoomSettings',                                                                                   //
        action: 'Editing_room'                                                                                        //
      });                                                                                                             //
    }                                                                                                                 //
    if (setting === 'default' && !RocketChat.authz.hasPermission(this.userId, 'view-room-administration')) {          //
      throw new Meteor.Error('error-action-not-allowed', 'Viewing room administration is not allowed', {              // 16
        method: 'saveRoomSettings',                                                                                   //
        action: 'Viewing_room_administration'                                                                         //
      });                                                                                                             //
    }                                                                                                                 //
    room = RocketChat.models.Rooms.findOneById(rid);                                                                  //
    if (room != null) {                                                                                               //
      switch (setting) {                                                                                              // 20
        case 'roomName':                                                                                              // 20
          name = RocketChat.saveRoomName(rid, value, Meteor.user());                                                  //
          break;                                                                                                      // 21
        case 'roomTopic':                                                                                             // 20
          if (value !== room.topic) {                                                                                 //
            RocketChat.saveRoomTopic(rid, value, Meteor.user());                                                      //
          }                                                                                                           //
          break;                                                                                                      // 23
        case 'roomDescription':                                                                                       // 20
          if (value !== room.description) {                                                                           //
            RocketChat.saveRoomDescription(rid, value, Meteor.user());                                                //
          }                                                                                                           //
          break;                                                                                                      // 26
        case 'roomType':                                                                                              // 20
          if (value !== room.t) {                                                                                     //
            RocketChat.saveRoomType(rid, value, Meteor.user());                                                       //
          }                                                                                                           //
          break;                                                                                                      // 29
        case 'readOnly':                                                                                              // 20
          if (value !== room.ro) {                                                                                    //
            RocketChat.saveRoomReadOnly(rid, value, Meteor.user());                                                   //
          }                                                                                                           //
          break;                                                                                                      // 32
        case 'systemMessages':                                                                                        // 20
          if (value !== room.sysMes) {                                                                                //
            RocketChat.saveRoomSystemMessages(rid, value, Meteor.user());                                             //
          }                                                                                                           //
          break;                                                                                                      // 35
        case 'joinCode':                                                                                              // 20
          RocketChat.models.Rooms.setJoinCodeById(rid, String(value));                                                //
          break;                                                                                                      // 38
        case 'default':                                                                                               // 20
          RocketChat.models.Rooms.saveDefaultById(rid, value);                                                        //
      }                                                                                                               // 20
    }                                                                                                                 //
    return {                                                                                                          // 43
      result: true,                                                                                                   //
      rid: room._id                                                                                                   //
    };                                                                                                                //
  }                                                                                                                   //
});                                                                                                                   //
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"models":{"Messages.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_channel-settings/server/models/Messages.coffee.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.models.Messages.createRoomSettingsChangedWithTypeRoomIdMessageAndUser = function(type, roomId, message, user, extraData) {
  return this.createWithTypeRoomIdMessageAndUser(type, roomId, message, user, extraData);                             // 2
};                                                                                                                    // 1
                                                                                                                      //
RocketChat.models.Messages.createRoomRenamedWithRoomIdRoomNameAndUser = function(roomId, roomName, user, extraData) {
  return this.createWithTypeRoomIdMessageAndUser('r', roomId, roomName, user, extraData);                             // 5
};                                                                                                                    // 4
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Rooms.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_channel-settings/server/models/Rooms.coffee.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.models.Rooms.setDescriptionById = function(_id, description) {                                             // 1
  var query, update;                                                                                                  // 2
  query = {                                                                                                           //
    _id: _id                                                                                                          //
  };                                                                                                                  //
  update = {                                                                                                          //
    $set: {                                                                                                           //
      description: description                                                                                        //
    }                                                                                                                 //
  };                                                                                                                  //
  return this.update(query, update);                                                                                  // 9
};                                                                                                                    // 1
                                                                                                                      //
RocketChat.models.Rooms.setReadOnlyById = function(_id, readOnly) {                                                   // 11
  var query, update, usernames, users;                                                                                // 12
  query = {                                                                                                           //
    _id: _id                                                                                                          //
  };                                                                                                                  //
  update = {                                                                                                          //
    $set: {                                                                                                           //
      ro: readOnly                                                                                                    //
    }                                                                                                                 //
  };                                                                                                                  //
  if (readOnly) {                                                                                                     //
    usernames = this.findOne(query, {                                                                                 //
      fields: {                                                                                                       //
        usernames: 1                                                                                                  //
      }                                                                                                               //
    });                                                                                                               //
    users = RocketChat.models.Users.findUsersByUsernames(usernames != null ? usernames.usernames : void 0, {          //
      fields: {                                                                                                       //
        username: 1                                                                                                   //
      }                                                                                                               //
    });                                                                                                               //
    users.forEach(function(user) {                                                                                    //
      if (RocketChat.authz.hasPermission(user._id, 'post-readonly') === false) {                                      //
        if (!update.$set.muted) {                                                                                     //
          update.$set.muted = [];                                                                                     //
        }                                                                                                             //
        return update.$set.muted.push(user.username);                                                                 //
      }                                                                                                               //
    });                                                                                                               //
  } else {                                                                                                            //
    update.$unset = {                                                                                                 //
      muted: ""                                                                                                       //
    };                                                                                                                //
  }                                                                                                                   //
  return this.update(query, update);                                                                                  // 33
};                                                                                                                    // 11
                                                                                                                      //
RocketChat.models.Rooms.setSystemMessagesById = function(_id, systemMessages) {                                       // 35
  var query, update;                                                                                                  // 36
  query = {                                                                                                           //
    _id: _id                                                                                                          //
  };                                                                                                                  //
  update = {                                                                                                          //
    $set: {                                                                                                           //
      sysMes: systemMessages                                                                                          //
    }                                                                                                                 //
  };                                                                                                                  //
  return this.update(query, update);                                                                                  // 43
};                                                                                                                    // 35
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"startup.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_channel-settings/server/startup.js                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.startup(function () {                                                                                          // 1
	RocketChat.models.Permissions.upsert('post-readonly', { $set: { roles: ['admin', 'owner', 'moderator'] } });         // 2
	RocketChat.models.Permissions.upsert('set-readonly', { $set: { roles: ['admin', 'owner'] } });                       // 3
});                                                                                                                   // 4
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{"extensions":[".js",".json",".coffee"]});
require("./node_modules/meteor/rocketchat:channel-settings/server/functions/saveRoomType.coffee.js");
require("./node_modules/meteor/rocketchat:channel-settings/server/functions/saveRoomTopic.coffee.js");
require("./node_modules/meteor/rocketchat:channel-settings/server/functions/saveRoomName.coffee.js");
require("./node_modules/meteor/rocketchat:channel-settings/server/functions/saveRoomReadOnly.coffee.js");
require("./node_modules/meteor/rocketchat:channel-settings/server/functions/saveRoomDescription.coffee.js");
require("./node_modules/meteor/rocketchat:channel-settings/server/functions/saveRoomSystemMessages.coffee.js");
require("./node_modules/meteor/rocketchat:channel-settings/server/methods/saveRoomSettings.coffee.js");
require("./node_modules/meteor/rocketchat:channel-settings/server/models/Messages.coffee.js");
require("./node_modules/meteor/rocketchat:channel-settings/server/models/Rooms.coffee.js");
require("./node_modules/meteor/rocketchat:channel-settings/server/startup.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:channel-settings'] = {};

})();

//# sourceMappingURL=rocketchat_channel-settings.js.map
