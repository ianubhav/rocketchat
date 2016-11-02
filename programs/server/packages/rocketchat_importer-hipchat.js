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
// packages/rocketchat_importer-hipchat/server.coffee.js                                                            //
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
Importer.HipChat = Importer.HipChat = function (superClass) {                                                       //
  extend(HipChat, superClass);                                                                                      //
                                                                                                                    //
  HipChat.RoomPrefix = 'hipchat_export/rooms/';                                                                     //
                                                                                                                    //
  HipChat.UsersPrefix = 'hipchat_export/users/';                                                                    //
                                                                                                                    //
  function HipChat(name, descriptionI18N, fileTypeRegex) {                                                          //
    this.getSelection = bind(this.getSelection, this);                                                              //
    this.convertHipChatMessageToRocketChat = bind(this.convertHipChatMessageToRocketChat, this);                    //
    this.getRocketUser = bind(this.getRocketUser, this);                                                            //
    this.getHipChatChannelFromName = bind(this.getHipChatChannelFromName, this);                                    //
    this.startImport = bind(this.startImport, this);                                                                //
    this.prepare = bind(this.prepare, this);                                                                        //
    HipChat.__super__.constructor.call(this, name, descriptionI18N, fileTypeRegex);                                 //
    this.logger.debug('Constructed a new Slack Importer.');                                                         //
    this.userTags = [];                                                                                             //
  }                                                                                                                 //
                                                                                                                    //
  HipChat.prototype.prepare = function (dataURI, sentContentType, fileName) {                                       //
    var channel, channelsId, contentType, entry, fn, fn1, image, j, len, messagesCount, messagesObj, ref, selectionChannels, selectionUsers, tempMessages, tempRooms, tempUsers, usersId, zip, zipEntries;
    HipChat.__super__.prepare.call(this, dataURI, sentContentType, fileName);                                       //
    ref = RocketChatFile.dataURIParse(dataURI), image = ref.image, contentType = ref.contentType;                   //
    zip = new this.AdmZip(new Buffer(image, 'base64'));                                                             //
    zipEntries = zip.getEntries();                                                                                  //
    tempRooms = [];                                                                                                 //
    tempUsers = [];                                                                                                 //
    tempMessages = {};                                                                                              //
    fn = function (_this) {                                                                                         //
      return function (entry) {                                                                                     //
        var item, k, len1, msgGroupData, results, room, roomName, usersName;                                        //
        if (entry.entryName.indexOf('__MACOSX') > -1) {                                                             //
          _this.logger.debug("Ignoring the file: " + entry.entryName);                                              //
        }                                                                                                           //
        if (!entry.isDirectory) {                                                                                   //
          if (entry.entryName.indexOf(Importer.HipChat.RoomPrefix) > -1) {                                          //
            roomName = entry.entryName.split(Importer.HipChat.RoomPrefix)[1];                                       //
            if (roomName === 'list.json') {                                                                         //
              _this.updateProgress(Importer.ProgressStep.PREPARING_CHANNELS);                                       //
              tempRooms = JSON.parse(entry.getData().toString()).rooms;                                             //
              results = [];                                                                                         //
              for (k = 0, len1 = tempRooms.length; k < len1; k++) {                                                 //
                room = tempRooms[k];                                                                                //
                results.push(room.name = _.slugify(room.name));                                                     //
              }                                                                                                     //
              return results;                                                                                       //
            } else if (roomName.indexOf('/') > -1) {                                                                //
              item = roomName.split('/');                                                                           //
              roomName = _.slugify(item[0]);                                                                        //
              msgGroupData = item[1].split('.')[0];                                                                 //
              if (!tempMessages[roomName]) {                                                                        //
                tempMessages[roomName] = {};                                                                        //
              }                                                                                                     //
              try {                                                                                                 //
                return tempMessages[roomName][msgGroupData] = JSON.parse(entry.getData().toString());               //
              } catch (error) {                                                                                     //
                return _this.logger.warn(entry.entryName + " is not a valid JSON file! Unable to import it.");      //
              }                                                                                                     //
            }                                                                                                       //
          } else if (entry.entryName.indexOf(Importer.HipChat.UsersPrefix) > -1) {                                  //
            usersName = entry.entryName.split(Importer.HipChat.UsersPrefix)[1];                                     //
            if (usersName === 'list.json') {                                                                        //
              _this.updateProgress(Importer.ProgressStep.PREPARING_USERS);                                          //
              return tempUsers = JSON.parse(entry.getData().toString()).users;                                      //
            } else {                                                                                                //
              return _this.logger.warn("Unexpected file in the " + _this.name + " import: " + entry.entryName);     //
            }                                                                                                       //
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
      'channels': tempRooms                                                                                         //
    });                                                                                                             //
    this.channels = this.collection.findOne(channelsId);                                                            //
    this.updateRecord({                                                                                             //
      'count.channels': tempRooms.length                                                                            //
    });                                                                                                             //
    this.addCountToTotal(tempRooms.length);                                                                         //
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
    if (tempUsers.length === 0 || tempRooms.length === 0 || messagesCount === 0) {                                  //
      this.logger.warn("The loaded users count " + tempUsers.length + ", the loaded channels " + tempChannels.length + ", and the loaded messages " + messagesCount);
      this.updateProgress(Importer.ProgressStep.ERROR);                                                             //
      return this.getProgress();                                                                                    //
    }                                                                                                               //
    selectionUsers = tempUsers.map(function (user) {                                                                //
      return new Importer.SelectionUser(user.user_id, user.name, user.email, user.is_deleted, false, !user.is_bot);
    });                                                                                                             //
    selectionChannels = tempRooms.map(function (room) {                                                             //
      return new Importer.SelectionChannel(room.room_id, room.name, room.is_archived, true);                        //
    });                                                                                                             //
    this.updateProgress(Importer.ProgressStep.USER_SELECTION);                                                      //
    return new Importer.Selection(this.name, selectionUsers, selectionChannels);                                    //
  };                                                                                                                //
                                                                                                                    //
  HipChat.prototype.startImport = function (importSelection) {                                                      //
    var c, channel, j, k, l, len, len1, len2, len3, m, ref, ref1, ref2, ref3, start, startedByUserId, u, user;      //
    HipChat.__super__.startImport.call(this, importSelection);                                                      //
    start = Date.now();                                                                                             //
    ref = importSelection.users;                                                                                    //
    for (j = 0, len = ref.length; j < len; j++) {                                                                   //
      user = ref[j];                                                                                                //
      ref1 = this.users.users;                                                                                      //
      for (k = 0, len1 = ref1.length; k < len1; k++) {                                                              //
        u = ref1[k];                                                                                                //
        if (u.user_id === user.user_id) {                                                                           //
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
        if (c.room_id === channel.channel_id) {                                                                     //
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
        var fn, len4, len5, len6, messagesObj, n, nousers, o, p, ref4, ref5, ref6, ref7, timeTook;                  //
        _this.updateProgress(Importer.ProgressStep.IMPORTING_USERS);                                                //
        ref4 = _this.users.users;                                                                                   //
        for (n = 0, len4 = ref4.length; n < len4; n++) {                                                            //
          user = ref4[n];                                                                                           //
          if (user.do_import) {                                                                                     //
            (function (user) {                                                                                      //
              return Meteor.runAsUser(startedByUserId, function () {                                                //
                var existantUser, userId;                                                                           //
                existantUser = RocketChat.models.Users.findOneByEmailAddress(user.email);                           //
                if (existantUser) {                                                                                 //
                  user.rocketId = existantUser._id;                                                                 //
                  _this.userTags.push({                                                                             //
                    hipchat: "@" + user.mention_name,                                                               //
                    rocket: "@" + existantUser.username                                                             //
                  });                                                                                               //
                } else {                                                                                            //
                  userId = Accounts.createUser({                                                                    //
                    email: user.email,                                                                              //
                    password: Date.now() + user.name + user.email.toUpperCase()                                     //
                  });                                                                                               //
                  user.rocketId = userId;                                                                           //
                  _this.userTags.push({                                                                             //
                    hipchat: "@" + user.mention_name,                                                               //
                    rocket: "@" + user.mention_name                                                                 //
                  });                                                                                               //
                  Meteor.runAsUser(userId, function () {                                                            //
                    Meteor.call('setUsername', user.mention_name);                                                  //
                    Meteor.call('joinDefaultChannels', true);                                                       //
                    Meteor.call('setAvatarFromService', user.photo_url, void 0, 'url');                             //
                    return Meteor.call('userSetUtcOffset', parseInt(moment().tz(user.timezone).format('Z').toString().split(':')[0]));
                  });                                                                                               //
                  if (user.name != null) {                                                                          //
                    RocketChat.models.Users.setName(userId, user.name);                                             //
                  }                                                                                                 //
                  if (user.is_deleted) {                                                                            //
                    Meteor.call('setUserActiveStatus', userId, false);                                              //
                  }                                                                                                 //
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
                var existantRoom, len6, p, ref6, userId;                                                            //
                channel.name = channel.name.replace(/ /g, '');                                                      //
                existantRoom = RocketChat.models.Rooms.findOneByName(channel.name);                                 //
                if (existantRoom) {                                                                                 //
                  channel.rocketId = existantRoom._id;                                                              //
                } else {                                                                                            //
                  userId = '';                                                                                      //
                  ref6 = _this.users.users;                                                                         //
                  for (p = 0, len6 = ref6.length; p < len6; p++) {                                                  //
                    user = ref6[p];                                                                                 //
                    if (user.user_id === channel.owner_user_id) {                                                   //
                      userId = user.rocketId;                                                                       //
                    }                                                                                               //
                  }                                                                                                 //
                  if (userId === '') {                                                                              //
                    _this.logger.warn("Failed to find the channel creator for " + channel.name + ", setting it to the current running user.");
                    userId = startedByUserId;                                                                       //
                  }                                                                                                 //
                  Meteor.runAsUser(userId, function () {                                                            //
                    var returned;                                                                                   //
                    returned = Meteor.call('createChannel', channel.name, []);                                      //
                    return channel.rocketId = returned.rid;                                                         //
                  });                                                                                               //
                  RocketChat.models.Rooms.update({                                                                  //
                    _id: channel.rocketId                                                                           //
                  }, {                                                                                              //
                    $set: {                                                                                         //
                      'ts': new Date(channel.created * 1000)                                                        //
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
        _this.updateProgress(Importer.ProgressStep.IMPORTING_MESSAGES);                                             //
        nousers = {};                                                                                               //
        ref6 = _this.messages;                                                                                      //
        fn = function fn(channel, messagesObj) {                                                                    //
          return Meteor.runAsUser(startedByUserId, function () {                                                    //
            var date, hipchatChannel, message, msgObj, msgs, results, room;                                         //
            hipchatChannel = _this.getHipChatChannelFromName(channel);                                              //
            if (hipchatChannel != null ? hipchatChannel.do_import : void 0) {                                       //
              room = RocketChat.models.Rooms.findOneById(hipchatChannel.rocketId, {                                 //
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
                  var len6, p, ref7, results1;                                                                      //
                  ref7 = msgs.messages;                                                                             //
                  results1 = [];                                                                                    //
                  for (p = 0, len6 = ref7.length; p < len6; p++) {                                                  //
                    message = ref7[p];                                                                              //
                    if (message.from != null) {                                                                     //
                      user = this.getRocketUser(message.from.user_id);                                              //
                      if (user != null) {                                                                           //
                        msgObj = {                                                                                  //
                          msg: this.convertHipChatMessageToRocketChat(message.message),                             //
                          ts: new Date(message.date),                                                               //
                          u: {                                                                                      //
                            _id: user._id,                                                                          //
                            username: user.username                                                                 //
                          }                                                                                         //
                        };                                                                                          //
                        RocketChat.sendMessage(user, msgObj, room, true);                                           //
                      } else {                                                                                      //
                        if (!nousers[message.from.user_id]) {                                                       //
                          nousers[message.from.user_id] = message.from;                                             //
                        }                                                                                           //
                      }                                                                                             //
                    } else {                                                                                        //
                      if (!_.isArray(message)) {                                                                    //
                        console.warn('Please report the following:', message);                                      //
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
        _this.logger.warn('The following did not have users:', nousers);                                            //
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
  HipChat.prototype.getHipChatChannelFromName = function (channelName) {                                            //
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
  HipChat.prototype.getRocketUser = function (hipchatId) {                                                          //
    var j, len, ref, user;                                                                                          //
    ref = this.users.users;                                                                                         //
    for (j = 0, len = ref.length; j < len; j++) {                                                                   //
      user = ref[j];                                                                                                //
      if (user.user_id === hipchatId) {                                                                             //
        return RocketChat.models.Users.findOneById(user.rocketId, {                                                 //
          fields: {                                                                                                 //
            username: 1                                                                                             //
          }                                                                                                         //
        });                                                                                                         //
      }                                                                                                             //
    }                                                                                                               //
  };                                                                                                                //
                                                                                                                    //
  HipChat.prototype.convertHipChatMessageToRocketChat = function (message) {                                        //
    var j, len, ref, userReplace;                                                                                   //
    if (message != null) {                                                                                          //
      ref = this.userTags;                                                                                          //
      for (j = 0, len = ref.length; j < len; j++) {                                                                 //
        userReplace = ref[j];                                                                                       //
        message = message.replace(userReplace.hipchat, userReplace.rocket);                                         //
      }                                                                                                             //
    } else {                                                                                                        //
      message = '';                                                                                                 //
    }                                                                                                               //
    return message;                                                                                                 //
  };                                                                                                                //
                                                                                                                    //
  HipChat.prototype.getSelection = function () {                                                                    //
    var selectionChannels, selectionUsers;                                                                          //
    selectionUsers = this.users.users.map(function (user) {                                                         //
      return new Importer.SelectionUser(user.user_id, user.name, user.email, user.is_deleted, false, !user.is_bot);
    });                                                                                                             //
    selectionChannels = this.channels.channels.map(function (room) {                                                //
      return new Importer.SelectionChannel(room.room_id, room.name, room.is_archived, true);                        //
    });                                                                                                             //
    return new Importer.Selection(this.name, selectionUsers, selectionChannels);                                    //
  };                                                                                                                //
                                                                                                                    //
  return HipChat;                                                                                                   //
}(Importer.Base);                                                                                                   //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/rocketchat_importer-hipchat/main.coffee.js                                                              //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Importer.AddImporter('hipchat', Importer.HipChat, {                                                                 // 1
  name: 'HipChat',                                                                                                  //
  fileTypeRegex: new RegExp('application\/.*?zip')                                                                  //
});                                                                                                                 //
                                                                                                                    //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:importer-hipchat'] = {};

})();

//# sourceMappingURL=rocketchat_importer-hipchat.js.map
