(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var RocketChat = Package['rocketchat:lib'].RocketChat;
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/rocketchat_statistics/lib/rocketchat.coffee.js                                                          //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.statistics = {};                                                                                         // 1
                                                                                                                    //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/rocketchat_statistics/server/models/Statistics.coffee.js                                                //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;                                                                                      //
                                                                                                                    //
RocketChat.models.Statistics = new ((function(superClass) {                                                         // 1
  extend(_Class, superClass);                                                                                       //
                                                                                                                    //
  function _Class() {                                                                                               //
    _Class.__super__.constructor.call(this, 'statistics');                                                          //
    this.tryEnsureIndex({                                                                                           //
      'createdAt': 1                                                                                                //
    });                                                                                                             //
  }                                                                                                                 //
                                                                                                                    //
  _Class.prototype.findOneById = function(_id, options) {                                                           //
    var query;                                                                                                      // 9
    query = {                                                                                                       //
      _id: _id                                                                                                      //
    };                                                                                                              //
    return this.findOne(query, options);                                                                            // 12
  };                                                                                                                //
                                                                                                                    //
  _Class.prototype.findLast = function() {                                                                          //
    var options, ref;                                                                                               // 15
    options = {                                                                                                     //
      sort: {                                                                                                       //
        createdAt: -1                                                                                               //
      },                                                                                                            //
      limit: 1                                                                                                      //
    };                                                                                                              //
    return (ref = this.find({}, options).fetch()) != null ? ref[0] : void 0;                                        // 19
  };                                                                                                                //
                                                                                                                    //
  return _Class;                                                                                                    //
                                                                                                                    //
})(RocketChat.models._Base));                                                                                       //
                                                                                                                    //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/rocketchat_statistics/server/functions/get.coffee.js                                                    //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.statistics.get = function() {                                                                            // 1
  var migration, os, ref, ref1, ref2, ref3, statistics;                                                             // 2
  statistics = {};                                                                                                  //
  statistics.uniqueId = RocketChat.settings.get("uniqueID");                                                        //
  statistics.installedAt = (ref = RocketChat.models.Settings.findOne("uniqueID")) != null ? ref.createdAt : void 0;
  statistics.version = (ref1 = RocketChat.Info) != null ? ref1.version : void 0;                                    //
  statistics.tag = (ref2 = RocketChat.Info) != null ? ref2.tag : void 0;                                            //
  statistics.branch = (ref3 = RocketChat.Info) != null ? ref3.branch : void 0;                                      //
  statistics.totalUsers = Meteor.users.find().count();                                                              //
  statistics.activeUsers = Meteor.users.find({                                                                      //
    active: true                                                                                                    //
  }).count();                                                                                                       //
  statistics.nonActiveUsers = statistics.totalUsers - statistics.activeUsers;                                       //
  statistics.onlineUsers = Meteor.users.find({                                                                      //
    statusConnection: 'online'                                                                                      //
  }).count();                                                                                                       //
  statistics.awayUsers = Meteor.users.find({                                                                        //
    statusConnection: 'away'                                                                                        //
  }).count();                                                                                                       //
  statistics.offlineUsers = statistics.totalUsers - statistics.onlineUsers - statistics.awayUsers;                  //
  statistics.totalRooms = RocketChat.models.Rooms.find().count();                                                   //
  statistics.totalChannels = RocketChat.models.Rooms.findByType('c').count();                                       //
  statistics.totalPrivateGroups = RocketChat.models.Rooms.findByType('p').count();                                  //
  statistics.totalDirect = RocketChat.models.Rooms.findByType('d').count();                                         //
  statistics.totalMessages = RocketChat.models.Messages.find().count();                                             //
  statistics.lastLogin = RocketChat.models.Users.getLastLogin();                                                    //
  statistics.lastMessageSentAt = RocketChat.models.Messages.getLastTimestamp();                                     //
  statistics.lastSeenSubscription = RocketChat.models.Subscriptions.getLastSeen();                                  //
  migration = typeof Migrations !== "undefined" && Migrations !== null ? Migrations._getControl() : void 0;         //
  if (migration) {                                                                                                  //
    statistics.migration = _.pick(migration, 'version', 'locked');                                                  //
  }                                                                                                                 //
  os = Npm.require('os');                                                                                           //
  statistics.os = {                                                                                                 //
    type: os.type(),                                                                                                //
    platform: os.platform(),                                                                                        //
    arch: os.arch(),                                                                                                //
    release: os.release(),                                                                                          //
    uptime: os.uptime(),                                                                                            //
    loadavg: os.loadavg(),                                                                                          //
    totalmem: os.totalmem(),                                                                                        //
    freemem: os.freemem(),                                                                                          //
    cpus: os.cpus()                                                                                                 //
  };                                                                                                                //
  statistics.process = {                                                                                            //
    nodeVersion: process.version,                                                                                   //
    pid: process.pid,                                                                                               //
    uptime: process.uptime()                                                                                        //
  };                                                                                                                //
  statistics.migration = RocketChat.Migrations._getControl();                                                       //
  statistics.instanceCount = InstanceStatus.getCollection().find().count();                                         //
  return statistics;                                                                                                // 57
};                                                                                                                  // 1
                                                                                                                    //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/rocketchat_statistics/server/functions/save.coffee.js                                                   //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.statistics.save = function() {                                                                           // 1
  var statistics;                                                                                                   // 2
  statistics = RocketChat.statistics.get();                                                                         //
  statistics.createdAt = new Date;                                                                                  //
  RocketChat.models.Statistics.insert(statistics);                                                                  //
  return statistics;                                                                                                // 5
};                                                                                                                  // 1
                                                                                                                    //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/rocketchat_statistics/server/methods/getStatistics.coffee.js                                            //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                    // 1
  getStatistics: function(refresh) {                                                                                //
    if (!Meteor.userId()) {                                                                                         //
      throw new Meteor.Error('error-invalid-user', "Invalid user", {                                                // 4
        method: 'getStatistics'                                                                                     //
      });                                                                                                           //
    }                                                                                                               //
    if (RocketChat.authz.hasPermission(Meteor.userId(), 'view-statistics') !== true) {                              //
      throw new Meteor.Error('error-not-allowed', "Not allowed", {                                                  // 7
        method: 'getStatistics'                                                                                     //
      });                                                                                                           //
    }                                                                                                               //
    if (refresh) {                                                                                                  //
      return RocketChat.statistics.save();                                                                          // 10
    } else {                                                                                                        //
      return RocketChat.models.Statistics.findLast();                                                               // 12
    }                                                                                                               //
  }                                                                                                                 //
});                                                                                                                 //
                                                                                                                    //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:statistics'] = {};

})();

//# sourceMappingURL=rocketchat_statistics.js.map
