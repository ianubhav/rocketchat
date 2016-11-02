(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var s = Package['underscorestring:underscore.string'].s;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare, Hubot, RocketChatAdapter, InternalHubotReceiver, HubotScripts, InternalHubot;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_internal-hubot/hubot.coffee.js                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var CoffeeScript,                                                                                                      //
    DEBUG,                                                                                                             //
    Robot,                                                                                                             //
    bind,                                                                                                              //
    fs,                                                                                                                //
    init,                                                                                                              //
    path,                                                                                                              //
    sendHelper,                                                                                                        //
    slice = [].slice,                                                                                                  //
    extend = function extend(child, parent) {                                                                          //
  for (var key in meteorBabelHelpers.sanitizeForInObject(parent)) {                                                    //
    if (hasProp.call(parent, key)) child[key] = parent[key];                                                           //
  }function ctor() {                                                                                                   //
    this.constructor = child;                                                                                          //
  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;     //
},                                                                                                                     //
    hasProp = {}.hasOwnProperty;                                                                                       //
                                                                                                                       //
CoffeeScript = Npm.require('coffee-script');                                                                           //
                                                                                                                       //
CoffeeScript.register();                                                                                               //
                                                                                                                       //
Hubot = Npm.require('hubot');                                                                                          //
                                                                                                                       //
fs = Npm.require('fs');                                                                                                //
                                                                                                                       //
path = Npm.require('path');                                                                                            //
                                                                                                                       //
DEBUG = false;                                                                                                         //
                                                                                                                       //
Hubot.Response.prototype.priv = function () {                                                                          //
  var ref, strings;                                                                                                    //
  strings = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                     //
  return (ref = this.robot.adapter).priv.apply(ref, [this.envelope].concat(slice.call(strings)));                      //
};                                                                                                                     //
                                                                                                                       //
Hubot.Robot.prototype.loadAdapter = function () {};                                                                    //
                                                                                                                       //
bind = function bind(f) {                                                                                              //
  var g;                                                                                                               //
  g = Meteor.bindEnvironment(function () {                                                                             //
    var args, self;                                                                                                    //
    self = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];                                 //
    return f.apply(self, args);                                                                                        //
  });                                                                                                                  //
  return function () {                                                                                                 //
    var args;                                                                                                          //
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                      //
    return g.apply(null, [this].concat(slice.call(args)));                                                             //
  };                                                                                                                   //
};                                                                                                                     //
                                                                                                                       //
Robot = function (superClass) {                                                                                        //
  extend(Robot, superClass);                                                                                           //
                                                                                                                       //
  function Robot() {                                                                                                   //
    var args;                                                                                                          //
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                      //
    Robot.__super__.constructor.apply(this, args);                                                                     //
    this.hear = bind(this.hear);                                                                                       //
    this.respond = bind(this.respond);                                                                                 //
    this.enter = bind(this.enter);                                                                                     //
    this.leave = bind(this.leave);                                                                                     //
    this.topic = bind(this.topic);                                                                                     //
    this.error = bind(this.error);                                                                                     //
    this.catchAll = bind(this.catchAll);                                                                               //
    this.user = Meteor.users.findOne({                                                                                 //
      username: this.name                                                                                              //
    }, {                                                                                                               //
      fields: {                                                                                                        //
        username: 1                                                                                                    //
      }                                                                                                                //
    });                                                                                                                //
  }                                                                                                                    //
                                                                                                                       //
  Robot.prototype.loadAdapter = function () {                                                                          //
    return false;                                                                                                      //
  };                                                                                                                   //
                                                                                                                       //
  Robot.prototype.hear = function (regex, callback) {                                                                  //
    return Robot.__super__.hear.call(this, regex, Meteor.bindEnvironment(callback));                                   //
  };                                                                                                                   //
                                                                                                                       //
  Robot.prototype.respond = function (regex, callback) {                                                               //
    return Robot.__super__.respond.call(this, regex, Meteor.bindEnvironment(callback));                                //
  };                                                                                                                   //
                                                                                                                       //
  Robot.prototype.enter = function (callback) {                                                                        //
    return Robot.__super__.enter.call(this, Meteor.bindEnvironment(callback));                                         //
  };                                                                                                                   //
                                                                                                                       //
  Robot.prototype.leave = function (callback) {                                                                        //
    return Robot.__super__.leave.call(this, Meteor.bindEnvironment(callback));                                         //
  };                                                                                                                   //
                                                                                                                       //
  Robot.prototype.topic = function (callback) {                                                                        //
    return Robot.__super__.topic.call(this, Meteor.bindEnvironment(callback));                                         //
  };                                                                                                                   //
                                                                                                                       //
  Robot.prototype.error = function (callback) {                                                                        //
    return Robot.__super__.error.call(this, Meteor.bindEnvironment(callback));                                         //
  };                                                                                                                   //
                                                                                                                       //
  Robot.prototype.catchAll = function (callback) {                                                                     //
    return Robot.__super__.catchAll.call(this, Meteor.bindEnvironment(callback));                                      //
  };                                                                                                                   //
                                                                                                                       //
  return Robot;                                                                                                        //
}(Hubot.Robot);                                                                                                        //
                                                                                                                       //
RocketChatAdapter = function (superClass) {                                                                            //
  extend(RocketChatAdapter, superClass);                                                                               //
                                                                                                                       //
  function RocketChatAdapter() {                                                                                       //
    return RocketChatAdapter.__super__.constructor.apply(this, arguments);                                             //
  }                                                                                                                    //
                                                                                                                       //
  RocketChatAdapter.prototype.send = function () {                                                                     //
    var envelope, strings;                                                                                             //
    envelope = arguments[0], strings = 2 <= arguments.length ? slice.call(arguments, 1) : [];                          //
    if (DEBUG) {                                                                                                       //
      console.log('ROCKETCHATADAPTER -> send'.blue);                                                                   //
    }                                                                                                                  //
    return sendHelper(this.robot, envelope, strings, function (_this) {                                                //
      return function (string) {                                                                                       //
        if (DEBUG) {                                                                                                   //
          console.log("send " + envelope.room + ": " + string + " (" + envelope.user.id + ")");                        //
        }                                                                                                              //
        return RocketChat.sendMessage(InternalHubot.user, {                                                            //
          msg: string                                                                                                  //
        }, {                                                                                                           //
          _id: envelope.room                                                                                           //
        });                                                                                                            //
      };                                                                                                               //
    }(this));                                                                                                          //
  };                                                                                                                   //
                                                                                                                       //
  RocketChatAdapter.prototype.emote = function () {                                                                    //
    var envelope, strings;                                                                                             //
    envelope = arguments[0], strings = 2 <= arguments.length ? slice.call(arguments, 1) : [];                          //
    if (DEBUG) {                                                                                                       //
      console.log('ROCKETCHATADAPTER -> emote'.blue);                                                                  //
    }                                                                                                                  //
    return sendHelper(this.robot, envelope, strings, function (_this) {                                                //
      return function (string) {                                                                                       //
        if (DEBUG) {                                                                                                   //
          console.log("emote " + envelope.rid + ": " + string + " (" + envelope.u.username + ")");                     //
        }                                                                                                              //
        if (envelope.message["private"]) {                                                                             //
          return _this.priv(envelope, "*** " + string + " ***");                                                       //
        }                                                                                                              //
        return Meteor.call("sendMessage", {                                                                            //
          msg: string,                                                                                                 //
          rid: envelope.rid,                                                                                           //
          action: true                                                                                                 //
        });                                                                                                            //
      };                                                                                                               //
    }(this));                                                                                                          //
  };                                                                                                                   //
                                                                                                                       //
  RocketChatAdapter.prototype.priv = function () {                                                                     //
    var envelope, strings;                                                                                             //
    envelope = arguments[0], strings = 2 <= arguments.length ? slice.call(arguments, 1) : [];                          //
    if (DEBUG) {                                                                                                       //
      console.log('ROCKETCHATADAPTER -> priv'.blue);                                                                   //
    }                                                                                                                  //
    return sendHelper(this.robot, envelope, strings, function (string) {                                               //
      if (DEBUG) {                                                                                                     //
        console.log("priv " + envelope.room + ": " + string + " (" + envelope.user.id + ")");                          //
      }                                                                                                                //
      return Meteor.call("sendMessage", {                                                                              //
        u: {                                                                                                           //
          username: "rocketbot"                                                                                        //
        },                                                                                                             //
        to: "" + envelope.user.id,                                                                                     //
        msg: string,                                                                                                   //
        rid: envelope.room                                                                                             //
      });                                                                                                              //
    });                                                                                                                //
  };                                                                                                                   //
                                                                                                                       //
  RocketChatAdapter.prototype.reply = function () {                                                                    //
    var envelope, strings;                                                                                             //
    envelope = arguments[0], strings = 2 <= arguments.length ? slice.call(arguments, 1) : [];                          //
    if (DEBUG) {                                                                                                       //
      console.log('ROCKETCHATADAPTER -> reply'.blue);                                                                  //
    }                                                                                                                  //
    if (envelope.message["private"]) {                                                                                 //
      return this.priv.apply(this, [envelope].concat(slice.call(strings)));                                            //
    } else {                                                                                                           //
      return this.send.apply(this, [envelope].concat(slice.call(strings.map(function (str) {                           //
        return envelope.user.name + ": " + str;                                                                        //
      }))));                                                                                                           //
    }                                                                                                                  //
  };                                                                                                                   //
                                                                                                                       //
  RocketChatAdapter.prototype.topic = function () {                                                                    //
    var envelope, strings;                                                                                             //
    envelope = arguments[0], strings = 2 <= arguments.length ? slice.call(arguments, 1) : [];                          //
    if (DEBUG) {                                                                                                       //
      return console.log('ROCKETCHATADAPTER -> topic'.blue);                                                           //
    }                                                                                                                  //
  };                                                                                                                   //
                                                                                                                       //
  RocketChatAdapter.prototype.play = function () {                                                                     //
    var envelope, strings;                                                                                             //
    envelope = arguments[0], strings = 2 <= arguments.length ? slice.call(arguments, 1) : [];                          //
    if (DEBUG) {                                                                                                       //
      return console.log('ROCKETCHATADAPTER -> play'.blue);                                                            //
    }                                                                                                                  //
  };                                                                                                                   //
                                                                                                                       //
  RocketChatAdapter.prototype.run = function () {                                                                      //
    if (DEBUG) {                                                                                                       //
      console.log('ROCKETCHATADAPTER -> run'.blue);                                                                    //
    }                                                                                                                  //
    this.robot.emit('connected');                                                                                      //
    return this.robot.brain.mergeData({});                                                                             //
  };                                                                                                                   //
                                                                                                                       //
  RocketChatAdapter.prototype.close = function () {                                                                    //
    if (DEBUG) {                                                                                                       //
      return console.log('ROCKETCHATADAPTER -> close'.blue);                                                           //
    }                                                                                                                  //
  };                                                                                                                   //
                                                                                                                       //
  return RocketChatAdapter;                                                                                            //
}(Hubot.Adapter);                                                                                                      //
                                                                                                                       //
InternalHubotReceiver = function () {                                                                                  //
  function InternalHubotReceiver(message) {                                                                            //
    var InternalHubotTextMessage, InternalHubotUser, room;                                                             //
    if (DEBUG) {                                                                                                       //
      console.log(message);                                                                                            //
    }                                                                                                                  //
    if (message.u.username !== InternalHubot.name) {                                                                   //
      room = RocketChat.models.Rooms.findOneById(message.rid);                                                         //
      if (room.t === 'c') {                                                                                            //
        InternalHubotUser = new Hubot.User(message.u.username, {                                                       //
          room: message.rid                                                                                            //
        });                                                                                                            //
        InternalHubotTextMessage = new Hubot.TextMessage(InternalHubotUser, message.msg, message._id);                 //
        InternalHubot.adapter.receive(InternalHubotTextMessage);                                                       //
      }                                                                                                                //
    }                                                                                                                  //
    return message;                                                                                                    //
  }                                                                                                                    //
                                                                                                                       //
  return InternalHubotReceiver;                                                                                        //
}();                                                                                                                   //
                                                                                                                       //
HubotScripts = function () {                                                                                           //
  function HubotScripts(robot) {                                                                                       //
    var e, i, j, len, len1, modulePath, modulesToLoad, scriptFile, scriptsToLoad;                                      //
    modulesToLoad = ['hubot-help/src/help.coffee'];                                                                    //
    for (i = 0, len = modulesToLoad.length; i < len; i++) {                                                            //
      modulePath = modulesToLoad[i];                                                                                   //
      try {                                                                                                            //
        Npm.require(modulePath)(robot);                                                                                //
        robot.parseHelp(__meteor_bootstrap__.serverDir + '/npm/rocketchat_internal-hubot/node_modules/' + modulePath);
        console.log(("Loaded " + modulePath).green);                                                                   //
      } catch (error) {                                                                                                //
        e = error;                                                                                                     //
        console.log(("can't load " + modulePath).red);                                                                 //
        console.log(e);                                                                                                //
      }                                                                                                                //
    }                                                                                                                  //
    scriptsToLoad = RocketChat.settings.get('InternalHubot_ScriptsToLoad').split(',') || [];                           //
    for (j = 0, len1 = scriptsToLoad.length; j < len1; j++) {                                                          //
      scriptFile = scriptsToLoad[j];                                                                                   //
      try {                                                                                                            //
        scriptFile = s.trim(scriptFile);                                                                               //
        Npm.require('hubot-scripts/src/scripts/' + scriptFile)(robot);                                                 //
        robot.parseHelp(__meteor_bootstrap__.serverDir + '/npm/node_modules/meteor/rocketchat_internal-hubot/node_modules/hubot-scripts/src/scripts/' + scriptFile);
        console.log(("Loaded " + scriptFile).green);                                                                   //
      } catch (error) {                                                                                                //
        e = error;                                                                                                     //
        console.log(("can't load " + scriptFile).red);                                                                 //
        console.log(e);                                                                                                //
      }                                                                                                                //
    }                                                                                                                  //
  }                                                                                                                    //
                                                                                                                       //
  return HubotScripts;                                                                                                 //
}();                                                                                                                   //
                                                                                                                       //
sendHelper = Meteor.bindEnvironment(function (robot, envelope, strings, map) {                                         //
  var err, results, string;                                                                                            //
  results = [];                                                                                                        //
  while (strings.length > 0) {                                                                                         //
    string = strings.shift();                                                                                          //
    if (typeof string === 'function') {                                                                                //
      results.push(string());                                                                                          //
    } else {                                                                                                           //
      try {                                                                                                            //
        results.push(map(string));                                                                                     //
      } catch (error) {                                                                                                //
        err = error;                                                                                                   //
        if (DEBUG) {                                                                                                   //
          console.error("Hubot error: " + err);                                                                        //
        }                                                                                                              //
        results.push(robot.logger.error("RocketChat send error: " + err));                                             //
      }                                                                                                                //
    }                                                                                                                  //
  }                                                                                                                    //
  return results;                                                                                                      //
});                                                                                                                    //
                                                                                                                       //
InternalHubot = {};                                                                                                    //
                                                                                                                       //
init = function (_this) {                                                                                              //
  return function () {                                                                                                 //
    InternalHubot = new Robot(null, null, false, RocketChat.settings.get('InternalHubot_Username'));                   //
    InternalHubot.alias = 'bot';                                                                                       //
    InternalHubot.adapter = new RocketChatAdapter(InternalHubot);                                                      //
    HubotScripts(InternalHubot);                                                                                       //
    InternalHubot.run();                                                                                               //
    if (RocketChat.settings.get('InternalHubot_Enabled')) {                                                            //
      return RocketChat.callbacks.add('afterSaveMessage', InternalHubotReceiver, RocketChat.callbacks.priority.LOW, 'InternalHubot');
    } else {                                                                                                           //
      return RocketChat.callbacks.remove('afterSaveMessage', 'InternalHubot');                                         //
    }                                                                                                                  //
  };                                                                                                                   //
}(this);                                                                                                               //
                                                                                                                       //
Meteor.startup(function () {                                                                                           //
  init();                                                                                                              //
  return RocketChat.models.Settings.findByIds(['InternalHubot_Username', 'InternalHubot_Enabled', 'InternalHubot_ScriptsToLoad']).observe({
    changed: function () {                                                                                             //
      function changed() {                                                                                             //
        return init();                                                                                                 //
      }                                                                                                                //
                                                                                                                       //
      return changed;                                                                                                  //
    }()                                                                                                                //
  });                                                                                                                  //
});                                                                                                                    //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_internal-hubot/settings.coffee.js                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.settings.addGroup('InternalHubot');                                                                         // 1
                                                                                                                       //
RocketChat.settings.add('InternalHubot_Enabled', true, {                                                               // 2
  type: 'boolean',                                                                                                     //
  group: 'InternalHubot',                                                                                              //
  i18nLabel: 'Enabled'                                                                                                 //
});                                                                                                                    //
                                                                                                                       //
RocketChat.settings.add('InternalHubot_Username', 'Rocket.Cat', {                                                      // 3
  type: 'string',                                                                                                      //
  group: 'InternalHubot',                                                                                              //
  i18nLabel: 'Username',                                                                                               //
  i18nDescription: 'InternalHubot_Username_Description'                                                                //
});                                                                                                                    //
                                                                                                                       //
RocketChat.settings.add('InternalHubot_ScriptsToLoad', 'hello.coffee,zen.coffee', {                                    // 4
  type: 'string',                                                                                                      //
  group: 'InternalHubot'                                                                                               //
});                                                                                                                    //
                                                                                                                       //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['rocketchat:internal-hubot'] = {}, {
  Hubot: Hubot,
  HubotScripts: HubotScripts,
  InternalHubot: InternalHubot,
  InternalHubotReceiver: InternalHubotReceiver,
  RocketChatAdapter: RocketChatAdapter
});

})();

//# sourceMappingURL=rocketchat_internal-hubot.js.map
