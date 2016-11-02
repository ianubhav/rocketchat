(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var Importer = Package['rocketchat:importer'].Importer;
var Logger = Package['rocketchat:logger'].Logger;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var moment = Package['momentjs:moment'].moment;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/rocketchat_importer-slack/server.coffee.js                                                              //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var bind = function bind(fn, me) {                                                                                  //
  return function () {                                                                                              //
    return fn.apply(me, arguments);                                                                                 //
  };                                                                                                                //
},                                                                                                                  //
    extend = function extend(child, parent) {                                                                       //
  for (var key in meteorBabelHelpers.sanitizeForInObject(parent)) {                                                 //
    if (hasProp.call(parent, key)) child[key] = parent[key];                                                        //
  }function ctor() {                                                                                                //
    this.constructor = child;                                                                                       //
  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;  //
},                                                                                                                  //
    hasProp = {}.hasOwnProperty;                                                                                    //
                                                                                                                    //
Importer.Slack = Importer.Slack = function (superClass) {                                                           //
  extend(Slack, superClass);                                                                                        //
                                                                                                                    //
  function Slack(name, descriptionI18N, fileTypeRegex) {                                                            //
    this.getSelection = bind(this.getSelection, this);                                                              //
    this.convertSlackMessageToRocketChat = bind(this.convertSlackMessageToRocketChat, this);                        //
    this.getRocketUser = bind(this.getRocketUser, this);                                                            //
    this.getSlackChannelFromName = bind(this.getSlackChannelFromName, this);                                        //
    this.startImport = bind(this.startImport, this);                                                                //
    this.prepare = bind(this.prepare, this);                                                                        //
    Slack.__super__.constructor.call(this, name, descriptionI18N, fileTypeRegex);                                   //
    this.userTags = [];                                                                                             //
    this.bots = {};                                                                                                 //
    this.logger.debug('Constructed a new Slack Importer.');                                                         //
  }                                                                                                                 //
                                                                                                                    //
  Slack.prototype.prepare = function (dataURI, sentContentType, fileName) {                                         //
    var channel, channelsId, contentType, entry, fn, fn1, image, j, len, messagesCount, messagesObj, ref, selectionChannels, selectionUsers, tempChannels, tempMessages, tempUsers, usersId, zip, zipEntries;
    Slack.__super__.prepare.call(this, dataURI, sentContentType, fileName);                                         //
    ref = RocketChatFile.dataURIParse(dataURI), image = ref.image, contentType = ref.contentType;                   //
    zip = new this.AdmZip(new Buffer(image, 'base64'));                                                             //
    zipEntries = zip.getEntries();                                                                                  //
    tempChannels = [];                                                                                              //
    tempUsers = [];                                                                                                 //
    tempMessages = {};                                                                                              //
    fn = function (_this) {                                                                                         //
      return function (entry) {                                                                                     //
        var channelName, item, k, len1, msgGroupData, results, user;                                                //
        if (entry.entryName.indexOf('__MACOSX') > -1) {                                                             //
          return _this.logger.debug("Ignoring the file: " + entry.entryName);                                       //
        } else if (entry.entryName === 'channels.json') {                                                           //
          _this.updateProgress(Importer.ProgressStep.PREPARING_CHANNELS);                                           //
          tempChannels = JSON.parse(entry.getData().toString());                                                    //
          return tempChannels = tempChannels.filter(function (channel) {                                            //
            return channel.creator != null;                                                                         //
          });                                                                                                       //
        } else if (entry.entryName === 'users.json') {                                                              //
          _this.updateProgress(Importer.ProgressStep.PREPARING_USERS);                                              //
          tempUsers = JSON.parse(entry.getData().toString());                                                       //
          results = [];                                                                                             //
          for (k = 0, len1 = tempUsers.length; k < len1; k++) {                                                     //
            user = tempUsers[k];                                                                                    //
            if (user.is_bot) {                                                                                      //
              results.push(_this.bots[user.profile.bot_id] = user);                                                 //
            }                                                                                                       //
          }                                                                                                         //
          return results;                                                                                           //
        } else if (!entry.isDirectory && entry.entryName.indexOf('/') > -1) {                                       //
          item = entry.entryName.split('/');                                                                        //
          channelName = item[0];                                                                                    //
          msgGroupData = item[1].split('.')[0];                                                                     //
          if (!tempMessages[channelName]) {                                                                         //
            tempMessages[channelName] = {};                                                                         //
          }                                                                                                         //
          try {                                                                                                     //
            return tempMessages[channelName][msgGroupData] = JSON.parse(entry.getData().toString());                //
          } catch (error) {                                                                                         //
            return _this.logger.warn(entry.entryName + " is not a valid JSON file! Unable to import it.");          //
          }                                                                                                         //
        }                                                                                                           //
      };                                                                                                            //
    }(this);                                                                                                        //
    for (j = 0, len = zipEntries.length; j < len; j++) {                                                            //
      entry = zipEntries[j];                                                                                        //
      fn(entry);                                                                                                    //
    }                                                                                                               //
    usersId = this.collection.insert({                                                                              //
      'import': this.importRecord._id,                                                                              //
      'importer': this.name,                                                                                        //
      'type': 'users',                                                                                              //
      'users': tempUsers                                                                                            //
    });                                                                                                             //
    this.users = this.collection.findOne(usersId);                                                                  //
    this.updateRecord({                                                                                             //
      'count.users': tempUsers.length                                                                               //
    });                                                                                                             //
    this.addCountToTotal(tempUsers.length);                                                                         //
    channelsId = this.collection.insert({                                                                           //
      'import': this.importRecord._id,                                                                              //
      'importer': this.name,                                                                                        //
      'type': 'channels',                                                                                           //
      'channels': tempChannels                                                                                      //
    });                                                                                                             //
    this.channels = this.collection.findOne(channelsId);                                                            //
    this.updateRecord({                                                                                             //
      'count.channels': tempChannels.length                                                                         //
    });                                                                                                             //
    this.addCountToTotal(tempChannels.length);                                                                      //
    this.updateProgress(Importer.ProgressStep.PREPARING_MESSAGES);                                                  //
    messagesCount = 0;                                                                                              //
    fn1 = function (_this) {                                                                                        //
      return function (channel, messagesObj) {                                                                      //
        var date, i, messagesId, msgs, results, splitMsg;                                                           //
        if (!_this.messages[channel]) {                                                                             //
          _this.messages[channel] = {};                                                                             //
        }                                                                                                           //
        results = [];                                                                                               //
        for (date in meteorBabelHelpers.sanitizeForInObject(messagesObj)) {                                         //
          msgs = messagesObj[date];                                                                                 //
          messagesCount += msgs.length;                                                                             //
          _this.updateRecord({                                                                                      //
            'messagesstatus': channel + "/" + date                                                                  //
          });                                                                                                       //
          if (Importer.Base.getBSONSize(msgs) > Importer.Base.MaxBSONSize) {                                        //
            results.push(function () {                                                                              //
              var k, len1, ref1, results1;                                                                          //
              ref1 = Importer.Base.getBSONSafeArraysFromAnArray(msgs);                                              //
              results1 = [];                                                                                        //
              for (i = k = 0, len1 = ref1.length; k < len1; i = ++k) {                                              //
                splitMsg = ref1[i];                                                                                 //
                messagesId = this.collection.insert({                                                               //
                  'import': this.importRecord._id,                                                                  //
                  'importer': this.name,                                                                            //
                  'type': 'messages',                                                                               //
                  'name': channel + "/" + date + "." + i,                                                           //
                  'messages': splitMsg                                                                              //
                });                                                                                                 //
                results1.push(this.messages[channel][date + "." + i] = this.collection.findOne(messagesId));        //
              }                                                                                                     //
              return results1;                                                                                      //
            }.call(_this));                                                                                         //
          } else {                                                                                                  //
            messagesId = _this.collection.insert({                                                                  //
              'import': _this.importRecord._id,                                                                     //
              'importer': _this.name,                                                                               //
              'type': 'messages',                                                                                   //
              'name': channel + "/" + date,                                                                         //
              'messages': msgs                                                                                      //
            });                                                                                                     //
            results.push(_this.messages[channel][date] = _this.collection.findOne(messagesId));                     //
          }                                                                                                         //
        }                                                                                                           //
        return results;                                                                                             //
      };                                                                                                            //
    }(this);                                                                                                        //
    for (channel in meteorBabelHelpers.sanitizeForInObject(tempMessages)) {                                         //
      messagesObj = tempMessages[channel];                                                                          //
      fn1(channel, messagesObj);                                                                                    //
    }                                                                                                               //
    this.updateRecord({                                                                                             //
      'count.messages': messagesCount,                                                                              //
      'messagesstatus': null                                                                                        //
    });                                                                                                             //
    this.addCountToTotal(messagesCount);                                                                            //
    if (tempUsers.length === 0 || tempChannels.length === 0 || messagesCount === 0) {                               //
      this.logger.warn("The loaded users count " + tempUsers.length + ", the loaded channels " + tempChannels.length + ", and the loaded messages " + messagesCount);
      this.updateProgress(Importer.ProgressStep.ERROR);                                                             //
      return this.getProgress();                                                                                    //
    }                                                                                                               //
    selectionUsers = tempUsers.map(function (user) {                                                                //
      return new Importer.SelectionUser(user.id, user.name, user.profile.email, user.deleted, user.is_bot, !user.is_bot);
    });                                                                                                             //
    selectionChannels = tempChannels.map(function (channel) {                                                       //
      return new Importer.SelectionChannel(channel.id, channel.name, channel.is_archived, true);                    //
    });                                                                                                             //
    this.updateProgress(Importer.ProgressStep.USER_SELECTION);                                                      //
    return new Importer.Selection(this.name, selectionUsers, selectionChannels);                                    //
  };                                                                                                                //
                                                                                                                    //
  Slack.prototype.startImport = function (importSelection) {                                                        //
    var c, channel, j, k, l, len, len1, len2, len3, m, ref, ref1, ref2, ref3, start, startedByUserId, u, user;      //
    Slack.__super__.startImport.call(this, importSelection);                                                        //
    start = Date.now();                                                                                             //
    ref = importSelection.users;                                                                                    //
    for (j = 0, len = ref.length; j < len; j++) {                                                                   //
      user = ref[j];                                                                                                //
      ref1 = this.users.users;                                                                                      //
      for (k = 0, len1 = ref1.length; k < len1; k++) {                                                              //
        u = ref1[k];                                                                                                //
        if (u.id === user.user_id) {                                                                                //
          u.do_import = user.do_import;                                                                             //
        }                                                                                                           //
      }                                                                                                             //
    }                                                                                                               //
    this.collection.update({                                                                                        //
      _id: this.users._id                                                                                           //
    }, {                                                                                                            //
      $set: {                                                                                                       //
        'users': this.users.users                                                                                   //
      }                                                                                                             //
    });                                                                                                             //
    ref2 = importSelection.channels;                                                                                //
    for (l = 0, len2 = ref2.length; l < len2; l++) {                                                                //
      channel = ref2[l];                                                                                            //
      ref3 = this.channels.channels;                                                                                //
      for (m = 0, len3 = ref3.length; m < len3; m++) {                                                              //
        c = ref3[m];                                                                                                //
        if (c.id === channel.channel_id) {                                                                          //
          c.do_import = channel.do_import;                                                                          //
        }                                                                                                           //
      }                                                                                                             //
    }                                                                                                               //
    this.collection.update({                                                                                        //
      _id: this.channels._id                                                                                        //
    }, {                                                                                                            //
      $set: {                                                                                                       //
        'channels': this.channels.channels                                                                          //
      }                                                                                                             //
    });                                                                                                             //
    startedByUserId = Meteor.userId();                                                                              //
    Meteor.defer(function (_this) {                                                                                 //
      return function () {                                                                                          //
        var fn, ignoreTypes, len4, len5, len6, messagesObj, missedTypes, n, o, p, ref4, ref5, ref6, ref7, timeTook;
        _this.updateProgress(Importer.ProgressStep.IMPORTING_USERS);                                                //
        ref4 = _this.users.users;                                                                                   //
        for (n = 0, len4 = ref4.length; n < len4; n++) {                                                            //
          user = ref4[n];                                                                                           //
          if (user.do_import) {                                                                                     //
            (function (user) {                                                                                      //
              return Meteor.runAsUser(startedByUserId, function () {                                                //
                var existantUser, userId;                                                                           //
                existantUser = RocketChat.models.Users.findOneByEmailAddress(user.profile.email);                   //
                if (!existantUser) {                                                                                //
                  existantUser = RocketChat.models.Users.findOneByUsername(user.name);                              //
                }                                                                                                   //
                if (existantUser) {                                                                                 //
                  user.rocketId = existantUser._id;                                                                 //
                  RocketChat.models.Users.update({                                                                  //
                    _id: user.rocketId                                                                              //
                  }, {                                                                                              //
                    $addToSet: {                                                                                    //
                      importIds: user.id                                                                            //
                    }                                                                                               //
                  });                                                                                               //
                  _this.userTags.push({                                                                             //
                    slack: "<@" + user.id + ">",                                                                    //
                    slackLong: "<@" + user.id + "|" + user.name + ">",                                              //
                    rocket: "@" + existantUser.username                                                             //
                  });                                                                                               //
                } else {                                                                                            //
                  if (user.profile.email) {                                                                         //
                    userId = Accounts.createUser({                                                                  //
                      email: user.profile.email,                                                                    //
                      password: Date.now() + user.name + user.profile.email.toUpperCase()                           //
                    });                                                                                             //
                  } else {                                                                                          //
                    userId = Accounts.createUser({                                                                  //
                      username: user.name,                                                                          //
                      password: Date.now() + user.name                                                              //
                    });                                                                                             //
                  }                                                                                                 //
                  Meteor.runAsUser(userId, function () {                                                            //
                    var url;                                                                                        //
                    Meteor.call('setUsername', user.name);                                                          //
                    Meteor.call('joinDefaultChannels', true);                                                       //
                    url = null;                                                                                     //
                    if (user.profile.image_original) {                                                              //
                      url = user.profile.image_original;                                                            //
                    } else if (user.profile.image_512) {                                                            //
                      url = user.profile.image_512;                                                                 //
                    }                                                                                               //
                    Meteor.call('setAvatarFromService', url, void 0, 'url');                                        //
                    if (user.tz_offset) {                                                                           //
                      return Meteor.call('userSetUtcOffset', user.tz_offset / 3600);                                //
                    }                                                                                               //
                  });                                                                                               //
                  RocketChat.models.Users.update({                                                                  //
                    _id: userId                                                                                     //
                  }, {                                                                                              //
                    $addToSet: {                                                                                    //
                      importIds: user.id                                                                            //
                    }                                                                                               //
                  });                                                                                               //
                  if (user.profile.real_name) {                                                                     //
                    RocketChat.models.Users.setName(userId, user.profile.real_name);                                //
                  }                                                                                                 //
                  if (user.deleted) {                                                                               //
                    Meteor.call('setUserActiveStatus', userId, false);                                              //
                  }                                                                                                 //
                  user.rocketId = userId;                                                                           //
                  _this.userTags.push({                                                                             //
                    slack: "<@" + user.id + ">",                                                                    //
                    slackLong: "<@" + user.id + "|" + user.name + ">",                                              //
                    rocket: "@" + user.name                                                                         //
                  });                                                                                               //
                }                                                                                                   //
                return _this.addCountCompleted(1);                                                                  //
              });                                                                                                   //
            })(user);                                                                                               //
          }                                                                                                         //
        }                                                                                                           //
        _this.collection.update({                                                                                   //
          _id: _this.users._id                                                                                      //
        }, {                                                                                                        //
          $set: {                                                                                                   //
            'users': _this.users.users                                                                              //
          }                                                                                                         //
        });                                                                                                         //
        _this.updateProgress(Importer.ProgressStep.IMPORTING_CHANNELS);                                             //
        ref5 = _this.channels.channels;                                                                             //
        for (o = 0, len5 = ref5.length; o < len5; o++) {                                                            //
          channel = ref5[o];                                                                                        //
          if (channel.do_import) {                                                                                  //
            (function (channel) {                                                                                   //
              return Meteor.runAsUser(startedByUserId, function () {                                                //
                var existantRoom, lastSetTopic, len6, len7, member, p, q, ref6, ref7, ref8, ref9, roomUpdate, userId, users;
                existantRoom = RocketChat.models.Rooms.findOneByName(channel.name);                                 //
                if (existantRoom || channel.is_general) {                                                           //
                  if (channel.is_general && channel.name !== (existantRoom != null ? existantRoom.name : void 0)) {
                    Meteor.call('saveRoomSettings', 'GENERAL', 'roomName', channel.name);                           //
                  }                                                                                                 //
                  channel.rocketId = channel.is_general ? 'GENERAL' : existantRoom._id;                             //
                  RocketChat.models.Rooms.update({                                                                  //
                    _id: channel.rocketId                                                                           //
                  }, {                                                                                              //
                    $addToSet: {                                                                                    //
                      importIds: channel.id                                                                         //
                    }                                                                                               //
                  });                                                                                               //
                } else {                                                                                            //
                  users = [];                                                                                       //
                  ref6 = channel.members;                                                                           //
                  for (p = 0, len6 = ref6.length; p < len6; p++) {                                                  //
                    member = ref6[p];                                                                               //
                    if (!(member !== channel.creator)) {                                                            //
                      continue;                                                                                     //
                    }                                                                                               //
                    user = _this.getRocketUser(member);                                                             //
                    if (user != null) {                                                                             //
                      users.push(user.username);                                                                    //
                    }                                                                                               //
                  }                                                                                                 //
                  userId = '';                                                                                      //
                  ref7 = _this.users.users;                                                                         //
                  for (q = 0, len7 = ref7.length; q < len7; q++) {                                                  //
                    user = ref7[q];                                                                                 //
                    if (user.id === channel.creator) {                                                              //
                      userId = user.rocketId;                                                                       //
                    }                                                                                               //
                  }                                                                                                 //
                  if (userId === '') {                                                                              //
                    _this.logger.warn("Failed to find the channel creator for " + channel.name + ", setting it to the current running user.");
                    userId = startedByUserId;                                                                       //
                  }                                                                                                 //
                  Meteor.runAsUser(userId, function () {                                                            //
                    var returned;                                                                                   //
                    returned = Meteor.call('createChannel', channel.name, users);                                   //
                    return channel.rocketId = returned.rid;                                                         //
                  });                                                                                               //
                  roomUpdate = {                                                                                    //
                    ts: new Date(channel.created * 1000)                                                            //
                  };                                                                                                //
                  if (!_.isEmpty((ref8 = channel.topic) != null ? ref8.value : void 0)) {                           //
                    roomUpdate.topic = channel.topic.value;                                                         //
                    lastSetTopic = channel.topic.last_set;                                                          //
                  }                                                                                                 //
                  if (!_.isEmpty((ref9 = channel.purpose) != null ? ref9.value : void 0) && channel.purpose.last_set > lastSetTopic) {
                    roomUpdate.topic = channel.purpose.value;                                                       //
                  }                                                                                                 //
                  RocketChat.models.Rooms.update({                                                                  //
                    _id: channel.rocketId                                                                           //
                  }, {                                                                                              //
                    $set: roomUpdate,                                                                               //
                    $addToSet: {                                                                                    //
                      importIds: channel.id                                                                         //
                    }                                                                                               //
                  });                                                                                               //
                }                                                                                                   //
                return _this.addCountCompleted(1);                                                                  //
              });                                                                                                   //
            })(channel);                                                                                            //
          }                                                                                                         //
        }                                                                                                           //
        _this.collection.update({                                                                                   //
          _id: _this.channels._id                                                                                   //
        }, {                                                                                                        //
          $set: {                                                                                                   //
            'channels': _this.channels.channels                                                                     //
          }                                                                                                         //
        });                                                                                                         //
        missedTypes = {};                                                                                           //
        ignoreTypes = {                                                                                             //
          'bot_add': true,                                                                                          //
          'file_comment': true,                                                                                     //
          'file_mention': true,                                                                                     //
          'channel_name': true                                                                                      //
        };                                                                                                          //
        _this.updateProgress(Importer.ProgressStep.IMPORTING_MESSAGES);                                             //
        ref6 = _this.messages;                                                                                      //
        fn = function fn(channel, messagesObj) {                                                                    //
          return Meteor.runAsUser(startedByUserId, function () {                                                    //
            var botUser, botUsername, date, details, message, msgDataDefaults, msgObj, msgs, results, room, slackChannel;
            slackChannel = _this.getSlackChannelFromName(channel);                                                  //
            if (slackChannel != null ? slackChannel.do_import : void 0) {                                           //
              room = RocketChat.models.Rooms.findOneById(slackChannel.rocketId, {                                   //
                fields: {                                                                                           //
                  usernames: 1,                                                                                     //
                  t: 1,                                                                                             //
                  name: 1                                                                                           //
                }                                                                                                   //
              });                                                                                                   //
              results = [];                                                                                         //
              for (date in meteorBabelHelpers.sanitizeForInObject(messagesObj)) {                                   //
                msgs = messagesObj[date];                                                                           //
                _this.updateRecord({                                                                                //
                  'messagesstatus': channel + "/" + date + "." + msgs.messages.length                               //
                });                                                                                                 //
                results.push(function () {                                                                          //
                  var len6, p, ref7, ref8, ref9, results1;                                                          //
                  ref7 = msgs.messages;                                                                             //
                  results1 = [];                                                                                    //
                  for (p = 0, len6 = ref7.length; p < len6; p++) {                                                  //
                    message = ref7[p];                                                                              //
                    msgDataDefaults = {                                                                             //
                      _id: "slack-" + slackChannel.id + "-" + message.ts.replace(/\./g, '-'),                       //
                      ts: new Date(parseInt(message.ts.split('.')[0]) * 1000)                                       //
                    };                                                                                              //
                    if (message.type === 'message') {                                                               //
                      if (message.subtype != null) {                                                                //
                        if (message.subtype === 'channel_join') {                                                   //
                          if (this.getRocketUser(message.user) != null) {                                           //
                            RocketChat.models.Messages.createUserJoinWithRoomIdAndUser(room._id, this.getRocketUser(message.user), msgDataDefaults);
                          }                                                                                         //
                        } else if (message.subtype === 'channel_leave') {                                           //
                          if (this.getRocketUser(message.user) != null) {                                           //
                            RocketChat.models.Messages.createUserLeaveWithRoomIdAndUser(room._id, this.getRocketUser(message.user), msgDataDefaults);
                          }                                                                                         //
                        } else if (message.subtype === 'me_message') {                                              //
                          msgObj = {                                                                                //
                            msg: "_" + this.convertSlackMessageToRocketChat(message.text) + "_"                     //
                          };                                                                                        //
                          _.extend(msgObj, msgDataDefaults);                                                        //
                          RocketChat.sendMessage(this.getRocketUser(message.user), msgObj, room, true);             //
                        } else if (message.subtype === 'bot_message') {                                             //
                          botUser = RocketChat.models.Users.findOneById('rocket.cat', {                             //
                            fields: {                                                                               //
                              username: 1                                                                           //
                            }                                                                                       //
                          });                                                                                       //
                          botUsername = this.bots[message.bot_id] ? (ref8 = this.bots[message.bot_id]) != null ? ref8.name : void 0 : message.username;
                          msgObj = {                                                                                //
                            msg: this.convertSlackMessageToRocketChat(message.text),                                //
                            rid: room._id,                                                                          //
                            bot: true,                                                                              //
                            attachments: message.attachments,                                                       //
                            username: botUsername ? botUsername : void 0                                            //
                          };                                                                                        //
                          _.extend(msgObj, msgDataDefaults);                                                        //
                          if (message.edited != null) {                                                             //
                            msgObj.ets = new Date(parseInt(message.edited.ts.split('.')[0]) * 1000);                //
                          }                                                                                         //
                          if (message.icons != null) {                                                              //
                            msgObj.emoji = message.icons.emoji;                                                     //
                          }                                                                                         //
                          RocketChat.sendMessage(botUser, msgObj, room, true);                                      //
                        } else if (message.subtype === 'channel_purpose') {                                         //
                          RocketChat.models.Messages.createRoomSettingsChangedWithTypeRoomIdMessageAndUser('room_changed_topic', room._id, message.purpose, this.getRocketUser(message.user), msgDataDefaults);
                        } else if (message.subtype === 'channel_topic') {                                           //
                          RocketChat.models.Messages.createRoomSettingsChangedWithTypeRoomIdMessageAndUser('room_changed_topic', room._id, message.topic, this.getRocketUser(message.user), msgDataDefaults);
                        } else if (message.subtype === 'pinned_item') {                                             //
                          if (message.attachments) {                                                                //
                            msgObj = {                                                                              //
                              attachments: [{                                                                       //
                                "text": this.convertSlackMessageToRocketChat(message.attachments[0].text),          //
                                "author_name": message.attachments[0].author_subname,                               //
                                "author_icon": getAvatarUrlFromUsername(message.attachments[0].author_subname)      //
                              }]                                                                                    //
                            };                                                                                      //
                            _.extend(msgObj, msgDataDefaults);                                                      //
                            RocketChat.models.Messages.createWithTypeRoomIdMessageAndUser('message_pinned', room._id, '', this.getRocketUser(message.user), msgObj);
                          } else {                                                                                  //
                            this.logger.debug('Pinned item with no attachment, needs work.');                       //
                          }                                                                                         //
                        } else if (message.subtype === 'file_share') {                                              //
                          if (((ref9 = message.file) != null ? ref9.url_private_download : void 0) !== void 0) {    //
                            details = {                                                                             //
                              message_id: "slack-" + message.ts.replace(/\./g, '-'),                                //
                              name: message.file.name,                                                              //
                              size: message.file.size,                                                              //
                              type: message.file.mimetype,                                                          //
                              rid: room._id                                                                         //
                            };                                                                                      //
                            this.uploadFile(details, message.file.url_private_download, this.getRocketUser(message.user), room, new Date(parseInt(message.ts.split('.')[0]) * 1000));
                          }                                                                                         //
                        } else {                                                                                    //
                          if (!missedTypes[message.subtype] && !ignoreTypes[message.subtype]) {                     //
                            missedTypes[message.subtype] = message;                                                 //
                          }                                                                                         //
                        }                                                                                           //
                      } else {                                                                                      //
                        user = this.getRocketUser(message.user);                                                    //
                        if (user != null) {                                                                         //
                          msgObj = {                                                                                //
                            msg: this.convertSlackMessageToRocketChat(message.text),                                //
                            rid: room._id,                                                                          //
                            u: {                                                                                    //
                              _id: user._id,                                                                        //
                              username: user.username                                                               //
                            }                                                                                       //
                          };                                                                                        //
                          _.extend(msgObj, msgDataDefaults);                                                        //
                          if (message.edited != null) {                                                             //
                            msgObj.ets = new Date(parseInt(message.edited.ts.split('.')[0]) * 1000);                //
                          }                                                                                         //
                          RocketChat.sendMessage(this.getRocketUser(message.user), msgObj, room, true);             //
                        }                                                                                           //
                      }                                                                                             //
                    }                                                                                               //
                    results1.push(this.addCountCompleted(1));                                                       //
                  }                                                                                                 //
                  return results1;                                                                                  //
                }.call(_this));                                                                                     //
              }                                                                                                     //
              return results;                                                                                       //
            }                                                                                                       //
          });                                                                                                       //
        };                                                                                                          //
        for (channel in meteorBabelHelpers.sanitizeForInObject(ref6)) {                                             //
          messagesObj = ref6[channel];                                                                              //
          fn(channel, messagesObj);                                                                                 //
        }                                                                                                           //
        console.log(missedTypes);                                                                                   //
        _this.updateProgress(Importer.ProgressStep.FINISHING);                                                      //
        ref7 = _this.channels.channels;                                                                             //
        for (p = 0, len6 = ref7.length; p < len6; p++) {                                                            //
          channel = ref7[p];                                                                                        //
          if (channel.do_import && channel.is_archived) {                                                           //
            (function (channel) {                                                                                   //
              return Meteor.runAsUser(startedByUserId, function () {                                                //
                return Meteor.call('archiveRoom', channel.rocketId);                                                //
              });                                                                                                   //
            })(channel);                                                                                            //
          }                                                                                                         //
        }                                                                                                           //
        _this.updateProgress(Importer.ProgressStep.DONE);                                                           //
        timeTook = Date.now() - start;                                                                              //
        return _this.logger.log("Import took " + timeTook + " milliseconds.");                                      //
      };                                                                                                            //
    }(this));                                                                                                       //
    return this.getProgress();                                                                                      //
  };                                                                                                                //
                                                                                                                    //
  Slack.prototype.getSlackChannelFromName = function (channelName) {                                                //
    var channel, j, len, ref;                                                                                       //
    ref = this.channels.channels;                                                                                   //
    for (j = 0, len = ref.length; j < len; j++) {                                                                   //
      channel = ref[j];                                                                                             //
      if (channel.name === channelName) {                                                                           //
        return channel;                                                                                             //
      }                                                                                                             //
    }                                                                                                               //
  };                                                                                                                //
                                                                                                                    //
  Slack.prototype.getRocketUser = function (slackId) {                                                              //
    var j, len, ref, user;                                                                                          //
    ref = this.users.users;                                                                                         //
    for (j = 0, len = ref.length; j < len; j++) {                                                                   //
      user = ref[j];                                                                                                //
      if (user.id === slackId) {                                                                                    //
        return RocketChat.models.Users.findOneById(user.rocketId, {                                                 //
          fields: {                                                                                                 //
            username: 1                                                                                             //
          }                                                                                                         //
        });                                                                                                         //
      }                                                                                                             //
    }                                                                                                               //
  };                                                                                                                //
                                                                                                                    //
  Slack.prototype.convertSlackMessageToRocketChat = function (message) {                                            //
    var j, len, ref, userReplace;                                                                                   //
    if (message != null) {                                                                                          //
      message = message.replace(/<!everyone>/g, '@all');                                                            //
      message = message.replace(/<!channel>/g, '@all');                                                             //
      message = message.replace(/&gt;/g, '<');                                                                      //
      message = message.replace(/&lt;/g, '>');                                                                      //
      message = message.replace(/&amp;/g, '&');                                                                     //
      message = message.replace(/:simple_smile:/g, ':smile:');                                                      //
      message = message.replace(/:memo:/g, ':pencil:');                                                             //
      message = message.replace(/:piggy:/g, ':pig:');                                                               //
      message = message.replace(/:uk:/g, ':gb:');                                                                   //
      message = message.replace(/<(http[s]?:[^>]*)>/g, '$1');                                                       //
      ref = this.userTags;                                                                                          //
      for (j = 0, len = ref.length; j < len; j++) {                                                                 //
        userReplace = ref[j];                                                                                       //
        message = message.replace(userReplace.slack, userReplace.rocket);                                           //
        message = message.replace(userReplace.slackLong, userReplace.rocket);                                       //
      }                                                                                                             //
    } else {                                                                                                        //
      message = '';                                                                                                 //
    }                                                                                                               //
    return message;                                                                                                 //
  };                                                                                                                //
                                                                                                                    //
  Slack.prototype.getSelection = function () {                                                                      //
    var selectionChannels, selectionUsers;                                                                          //
    selectionUsers = this.users.users.map(function (user) {                                                         //
      return new Importer.SelectionUser(user.id, user.name, user.profile.email, user.deleted, user.is_bot, !user.is_bot);
    });                                                                                                             //
    selectionChannels = this.channels.channels.map(function (channel) {                                             //
      return new Importer.SelectionChannel(channel.id, channel.name, channel.is_archived, true);                    //
    });                                                                                                             //
    return new Importer.Selection(this.name, selectionUsers, selectionChannels);                                    //
  };                                                                                                                //
                                                                                                                    //
  return Slack;                                                                                                     //
}(Importer.Base);                                                                                                   //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/rocketchat_importer-slack/main.coffee.js                                                                //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Importer.AddImporter('slack', Importer.Slack, {                                                                     // 1
  name: 'Slack',                                                                                                    //
  fileTypeRegex: new RegExp('application\/.*?zip')                                                                  //
});                                                                                                                 //
                                                                                                                    //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:importer-slack'] = {};

})();

//# sourceMappingURL=rocketchat_importer-slack.js.map
