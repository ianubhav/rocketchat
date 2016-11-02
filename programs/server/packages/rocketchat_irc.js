(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare, Irc;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/rocketchat_irc/server/settings.js                                                                       //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
Meteor.startup(function() {
	RocketChat.settings.addGroup('IRC', function() {

// Is this thing on?
		this.add('IRC_Enabled', false, {
			type: 'boolean',
			i18nLabel: 'Enabled',
			i18nDescription: 'IRC_Enabled',
			alert: 'IRC Support is a work in progress. Use on a production system is not recommended at this time.'
		});

// The IRC host server to talk to
		this.add('IRC_Host', 'irc.freenode.net', {
			type: 'string',
			i18nLabel: 'Host',
			i18nDescription: 'IRC_Hostname'
		});

// The port to connect on the remote server
		this.add('IRC_Port', 6667, {
			type: 'int',
			i18nLabel: 'Port',
			i18nDescription: 'IRC_Port'
		});

// Cache size of the messages we send the host IRC server
		this.add('IRC_Message_Cache_Size', 200, {
			type: 'int',
			i18nLabel: 'Message Cache Size',
			i18nDescription: 'IRC_Message_Cache_Size'
		});

// Expandable box for modifying regular expressions for IRC interaction
		this.section('Regular Expressions', function() {
			this.add('IRC_RegEx_successLogin', 'Welcome to the freenode Internet Relay Chat Network', {
				type: 'string',
				i18nLabel: 'Login Successful',
				i18nDescription: 'IRC_Login_Success'
			});
			this.add('IRC_RegEx_failedLogin', 'You have not registered', {
				type: 'string',
				i18nLabel: 'Login Failed',
				i18nDescription: 'IRC_Login_Fail'
			});
			this.add('IRC_RegEx_receiveMessage', '^:(\S+)!~\S+ PRIVMSG (\S+) :(.+)$', {
				type: 'string',
				i18nLabel: 'Private Message',
				i18nDescription: 'IRC_Private_Message'
			});
			this.add('IRC_RegEx_receiveMemberList', '^:\S+ \d+ \S+ = #(\S+) :(.*)$', {
				type: 'string',
				i18nLabel: 'Channel User List Start',
				i18nDescription: 'IRC_Channel_Users'
			});
			this.add('IRC_RegEx_endMemberList', '^.+#(\S+) :End of \/NAMES list.$', {
				type: 'string',
				i18nLabel: 'Channel User List End',
				i18nDescription: 'IRC_Channel_Users_End'
			});
			this.add('IRC_RegEx_addMemberToRoom', '^:(\S+)!~\S+ JOIN #(\S+)$', {
				type: 'string',
				i18nLabel: 'Join Channel',
				i18nDescription: 'IRC_Channel_Join'
			});
			this.add('IRC_RegEx_removeMemberFromRoom', '^:(\S+)!~\S+ PART #(\S+)$', {
				type: 'string',
				i18nLabel: 'Leave Channel',
				i18nDescription: 'IRC_Channel_Leave'
			});
			this.add('IRC_RegEx_quitMember', '^:(\S+)!~\S+ QUIT .*$', {
				type: 'string',
				i18nLabel: 'Quit IRC Session',
				i18nDescription: 'IRC_Quit'
			});
		});

	});
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/rocketchat_irc/server/server.coffee.js                                                                  //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var IRC_AVAILABILITY, IRC_HOST, IRC_PORT, IrcClient, IrcLoginer, IrcLogoutCleanUper, IrcRoomJoiner, IrcRoomLeaver, IrcSender, Lru, MESSAGE_CACHE_SIZE, async, bind, ircClientMap, ircReceiveMessageCache, ircSendMessageCache, net,
  slice = [].slice,                                                                                                 //
  bind1 = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };                                //
                                                                                                                    //
IRC_AVAILABILITY = RocketChat.settings.get('IRC_Enabled');                                                          // 6
                                                                                                                    //
net = Npm.require('net');                                                                                           // 9
                                                                                                                    //
Lru = Npm.require('lru-cache');                                                                                     // 10
                                                                                                                    //
MESSAGE_CACHE_SIZE = RocketChat.settings.get('IRC_Message_Cache_Size');                                             // 11
                                                                                                                    //
ircReceiveMessageCache = Lru(MESSAGE_CACHE_SIZE);                                                                   // 12
                                                                                                                    //
ircSendMessageCache = Lru(MESSAGE_CACHE_SIZE);                                                                      // 13
                                                                                                                    //
IRC_PORT = RocketChat.settings.get('IRC_Port');                                                                     // 16
                                                                                                                    //
IRC_HOST = RocketChat.settings.get('IRC_Host');                                                                     // 17
                                                                                                                    //
ircClientMap = {};                                                                                                  // 19
                                                                                                                    //
bind = function(f) {                                                                                                // 26
  var g;                                                                                                            // 27
  g = Meteor.bindEnvironment(function() {                                                                           //
    var args, self;                                                                                                 // 27
    self = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];                              //
    return f.apply(self, args);                                                                                     //
  });                                                                                                               //
  return function() {                                                                                               //
    var args;                                                                                                       // 28
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                   //
    return g.apply(null, [this].concat(slice.call(args)));                                                          //
  };                                                                                                                //
};                                                                                                                  // 26
                                                                                                                    //
async = function() {                                                                                                // 30
  var args, f;                                                                                                      // 31
  f = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];                                   //
  return Meteor.wrapAsync(f).apply(null, args);                                                                     //
};                                                                                                                  // 30
                                                                                                                    //
IrcClient = (function() {                                                                                           // 33
  function IrcClient(loginReq) {                                                                                    //
    this.loginReq = loginReq;                                                                                       //
    this.onReceiveRawMessage = bind1(this.onReceiveRawMessage, this);                                               //
    this.onError = bind1(this.onError, this);                                                                       //
    this.onTimeout = bind1(this.onTimeout, this);                                                                   //
    this.onClose = bind1(this.onClose, this);                                                                       //
    this.onConnect = bind1(this.onConnect, this);                                                                   //
    this.connect = bind1(this.connect, this);                                                                       //
    this.user = this.loginReq.user;                                                                                 //
    ircClientMap[this.user._id] = this;                                                                             //
    this.ircPort = IRC_PORT;                                                                                        //
    this.ircHost = IRC_HOST;                                                                                        //
    this.msgBuf = [];                                                                                               //
    this.isConnected = false;                                                                                       //
    this.isDistroyed = false;                                                                                       //
    this.socket = new net.Socket;                                                                                   //
    this.socket.setNoDelay;                                                                                         //
    this.socket.setEncoding('utf-8');                                                                               //
    this.socket.setKeepAlive(true);                                                                                 //
    this.onConnect = bind(this.onConnect);                                                                          //
    this.onClose = bind(this.onClose);                                                                              //
    this.onTimeout = bind(this.onTimeout);                                                                          //
    this.onError = bind(this.onError);                                                                              //
    this.onReceiveRawMessage = bind(this.onReceiveRawMessage);                                                      //
    this.socket.on('data', this.onReceiveRawMessage);                                                               //
    this.socket.on('close', this.onClose);                                                                          //
    this.socket.on('timeout', this.onTimeout);                                                                      //
    this.socket.on('error', this.onError);                                                                          //
    this.isJoiningRoom = false;                                                                                     //
    this.receiveMemberListBuf = {};                                                                                 //
    this.pendingJoinRoomBuf = [];                                                                                   //
    this.successLoginMessageRegex = /RocketChat.settings.get('IRC_RegEx_successLogin');/;                           //
    this.failedLoginMessageRegex = /RocketChat.settings.get('IRC_RegEx_failedLogin');/;                             //
    this.receiveMessageRegex = /RocketChat.settings.get('IRC_RegEx_receiveMessage');/;                              //
    this.receiveMemberListRegex = /RocketChat.settings.get('IRC_RegEx_receiveMemberList');/;                        //
    this.endMemberListRegex = /RocketChat.settings.get('IRC_RegEx_endMemberList');/;                                //
    this.addMemberToRoomRegex = /RocketChat.settings.get('IRC_RegEx_addMemberToRoom');/;                            //
    this.removeMemberFromRoomRegex = /RocketChat.settings.get('IRC_RegEx_removeMemberFromRoom');/;                  //
    this.quitMemberRegex = /RocketChat.settings.get('IRC_RegEx_quitMember');/;                                      //
  }                                                                                                                 //
                                                                                                                    //
  IrcClient.prototype.connect = function(loginCb) {                                                                 //
    this.loginCb = loginCb;                                                                                         //
    this.socket.connect(this.ircPort, this.ircHost, this.onConnect);                                                //
    return this.initRoomList();                                                                                     //
  };                                                                                                                //
                                                                                                                    //
  IrcClient.prototype.disconnect = function() {                                                                     //
    this.isDistroyed = true;                                                                                        //
    return this.socket.destroy();                                                                                   //
  };                                                                                                                //
                                                                                                                    //
  IrcClient.prototype.onConnect = function() {                                                                      //
    var i, len, msg, ref, results;                                                                                  // 79
    console.log('[irc] onConnect -> '.yellow, this.user.username, 'connect success.');                              //
    this.socket.write("NICK " + this.user.username + "\r\n");                                                       //
    this.socket.write("USER " + this.user.username + " 0 * :" + this.user.name + "\r\n");                           //
    this.isConnected = true;                                                                                        //
    ref = this.msgBuf;                                                                                              // 84
    results = [];                                                                                                   // 84
    for (i = 0, len = ref.length; i < len; i++) {                                                                   //
      msg = ref[i];                                                                                                 //
      results.push(this.socket.write(msg));                                                                         //
    }                                                                                                               // 84
    return results;                                                                                                 //
  };                                                                                                                //
                                                                                                                    //
  IrcClient.prototype.onClose = function(data) {                                                                    //
    console.log('[irc] onClose -> '.yellow, this.user.username, 'connection close.');                               //
    this.isConnected = false;                                                                                       //
    if (this.isDistroyed) {                                                                                         //
      return delete ircClientMap[this.user._id];                                                                    //
    } else {                                                                                                        //
      return this.connect();                                                                                        //
    }                                                                                                               //
  };                                                                                                                //
                                                                                                                    //
  IrcClient.prototype.onTimeout = function() {                                                                      //
    return console.log('[irc] onTimeout -> '.yellow, this.user.username, 'connection timeout.', arguments);         //
  };                                                                                                                //
                                                                                                                    //
  IrcClient.prototype.onError = function() {                                                                        //
    return console.log('[irc] onError -> '.yellow, this.user.username, 'connection error.', arguments);             //
  };                                                                                                                //
                                                                                                                    //
  IrcClient.prototype.onReceiveRawMessage = function(data) {                                                        //
    var i, len, line, matchResult, results;                                                                         // 101
    data = data.toString().split('\n');                                                                             //
    results = [];                                                                                                   // 102
    for (i = 0, len = data.length; i < len; i++) {                                                                  //
      line = data[i];                                                                                               //
      line = line.trim();                                                                                           //
      console.log("[" + this.ircHost + ":" + this.ircPort + "]:", line);                                            //
      if (line.indexOf('PING') === 0) {                                                                             //
        this.socket.write(line.replace('PING :', 'PONG '));                                                         //
        continue;                                                                                                   // 108
      }                                                                                                             //
      matchResult = this.receiveMessageRegex.exec(line);                                                            //
      if (matchResult) {                                                                                            //
        this.onReceiveMessage(matchResult[1], matchResult[2], matchResult[3]);                                      //
        continue;                                                                                                   // 113
      }                                                                                                             //
      matchResult = this.receiveMemberListRegex.exec(line);                                                         //
      if (matchResult) {                                                                                            //
        this.onReceiveMemberList(matchResult[1], matchResult[2].split(' '));                                        //
        continue;                                                                                                   // 118
      }                                                                                                             //
      matchResult = this.endMemberListRegex.exec(line);                                                             //
      if (matchResult) {                                                                                            //
        this.onEndMemberList(matchResult[1]);                                                                       //
        continue;                                                                                                   // 123
      }                                                                                                             //
      matchResult = this.addMemberToRoomRegex.exec(line);                                                           //
      if (matchResult) {                                                                                            //
        this.onAddMemberToRoom(matchResult[1], matchResult[2]);                                                     //
        continue;                                                                                                   // 128
      }                                                                                                             //
      matchResult = this.removeMemberFromRoomRegex.exec(line);                                                      //
      if (matchResult) {                                                                                            //
        this.onRemoveMemberFromRoom(matchResult[1], matchResult[2]);                                                //
        continue;                                                                                                   // 133
      }                                                                                                             //
      matchResult = this.quitMemberRegex.exec(line);                                                                //
      if (matchResult) {                                                                                            //
        this.onQuitMember(matchResult[1]);                                                                          //
        continue;                                                                                                   // 138
      }                                                                                                             //
      matchResult = this.successLoginMessageRegex.exec(line);                                                       //
      if (matchResult) {                                                                                            //
        this.onSuccessLoginMessage();                                                                               //
        continue;                                                                                                   // 143
      }                                                                                                             //
      matchResult = this.failedLoginMessageRegex.exec(line);                                                        //
      if (matchResult) {                                                                                            //
        this.onFailedLoginMessage();                                                                                //
        continue;                                                                                                   // 148
      } else {                                                                                                      //
        results.push(void 0);                                                                                       //
      }                                                                                                             //
    }                                                                                                               // 102
    return results;                                                                                                 //
  };                                                                                                                //
                                                                                                                    //
  IrcClient.prototype.onSuccessLoginMessage = function() {                                                          //
    console.log('[irc] onSuccessLoginMessage -> '.yellow);                                                          //
    if (this.loginCb) {                                                                                             //
      return this.loginCb(null, this.loginReq);                                                                     //
    }                                                                                                               //
  };                                                                                                                //
                                                                                                                    //
  IrcClient.prototype.onFailedLoginMessage = function() {                                                           //
    console.log('[irc] onFailedLoginMessage -> '.yellow);                                                           //
    this.loginReq.allowed = false;                                                                                  //
    this.disconnect();                                                                                              //
    if (this.loginCb) {                                                                                             //
      return this.loginCb(null, this.loginReq);                                                                     //
    }                                                                                                               //
  };                                                                                                                //
                                                                                                                    //
  IrcClient.prototype.onReceiveMessage = function(source, target, content) {                                        //
    var cacheKey, message, now, room, timestamp;                                                                    // 163
    now = new Date;                                                                                                 //
    timestamp = now.getTime();                                                                                      //
    cacheKey = [source, target, content].join(',');                                                                 //
    console.log('[irc] ircSendMessageCache.get -> '.yellow, 'key:', cacheKey, 'value:', ircSendMessageCache.get(cacheKey), 'ts:', timestamp - 1000);
    if (ircSendMessageCache.get(cacheKey) > (timestamp - 1000)) {                                                   //
      return;                                                                                                       // 169
    } else {                                                                                                        //
      ircSendMessageCache.set(cacheKey, timestamp);                                                                 //
    }                                                                                                               //
    console.log('[irc] onReceiveMessage -> '.yellow, 'source:', source, 'target:', target, 'content:', content);    //
    source = this.createUserWhenNotExist(source);                                                                   //
    if (target[0] === '#') {                                                                                        //
      room = RocketChat.models.Rooms.findOneByName(target.substring(1));                                            //
    } else {                                                                                                        //
      room = this.createDirectRoomWhenNotExist(source, this.user);                                                  //
    }                                                                                                               //
    message = {                                                                                                     //
      msg: content,                                                                                                 //
      ts: now                                                                                                       //
    };                                                                                                              //
    cacheKey = "" + source.username + timestamp;                                                                    //
    ircReceiveMessageCache.set(cacheKey, true);                                                                     //
    console.log('[irc] ircReceiveMessageCache.set -> '.yellow, 'key:', cacheKey);                                   //
    return RocketChat.sendMessage(source, message, room);                                                           //
  };                                                                                                                //
                                                                                                                    //
  IrcClient.prototype.onReceiveMemberList = function(roomName, members) {                                           //
    return this.receiveMemberListBuf[roomName] = this.receiveMemberListBuf[roomName].concat(members);               //
  };                                                                                                                //
                                                                                                                    //
  IrcClient.prototype.onEndMemberList = function(roomName) {                                                        //
    var appendMembers, i, len, member, newMembers, oldMembers, removeMembers, room;                                 // 192
    newMembers = this.receiveMemberListBuf[roomName];                                                               //
    console.log('[irc] onEndMemberList -> '.yellow, 'room:', roomName, 'members:', newMembers.join(','));           //
    room = RocketChat.models.Rooms.findOneByNameAndType(roomName, 'c');                                             //
    if (!room) {                                                                                                    //
      return;                                                                                                       // 196
    }                                                                                                               //
    oldMembers = room.usernames;                                                                                    //
    appendMembers = _.difference(newMembers, oldMembers);                                                           //
    removeMembers = _.difference(oldMembers, newMembers);                                                           //
    for (i = 0, len = appendMembers.length; i < len; i++) {                                                         // 202
      member = appendMembers[i];                                                                                    //
      this.createUserWhenNotExist(member);                                                                          //
    }                                                                                                               // 202
    RocketChat.models.Rooms.removeUsernamesById(room._id, removeMembers);                                           //
    RocketChat.models.Rooms.addUsernamesById(room._id, appendMembers);                                              //
    this.isJoiningRoom = false;                                                                                     //
    roomName = this.pendingJoinRoomBuf.shift();                                                                     //
    if (roomName) {                                                                                                 //
      return this.joinRoom({                                                                                        //
        t: 'c',                                                                                                     //
        name: roomName                                                                                              //
      });                                                                                                           //
    }                                                                                                               //
  };                                                                                                                //
                                                                                                                    //
  IrcClient.prototype.sendRawMessage = function(msg) {                                                              //
    console.log('[irc] sendRawMessage -> '.yellow, msg.slice(0, -2));                                               //
    if (this.isConnected) {                                                                                         //
      return this.socket.write(msg);                                                                                //
    } else {                                                                                                        //
      return this.msgBuf.push(msg);                                                                                 //
    }                                                                                                               //
  };                                                                                                                //
                                                                                                                    //
  IrcClient.prototype.sendMessage = function(room, message) {                                                       //
    var cacheKey, i, len, msg, name, ref, target;                                                                   // 223
    console.log('[irc] sendMessage -> '.yellow, 'userName:', message.u.username);                                   //
    target = '';                                                                                                    //
    if (room.t === 'c') {                                                                                           //
      target = "#" + room.name;                                                                                     //
    } else if (room.t === 'd') {                                                                                    //
      ref = room.usernames;                                                                                         // 228
      for (i = 0, len = ref.length; i < len; i++) {                                                                 // 228
        name = ref[i];                                                                                              //
        if (message.u.username !== name) {                                                                          //
          target = name;                                                                                            //
          break;                                                                                                    // 231
        }                                                                                                           //
      }                                                                                                             // 228
    }                                                                                                               //
    cacheKey = [this.user.username, target, message.msg].join(',');                                                 //
    console.log('[irc] ircSendMessageCache.set -> '.yellow, 'key:', cacheKey, 'ts:', message.ts.getTime());         //
    ircSendMessageCache.set(cacheKey, message.ts.getTime());                                                        //
    msg = "PRIVMSG " + target + " :" + message.msg + "\r\n";                                                        //
    return this.sendRawMessage(msg);                                                                                //
  };                                                                                                                //
                                                                                                                    //
  IrcClient.prototype.initRoomList = function() {                                                                   //
    var i, len, results, room, rooms, roomsCursor;                                                                  // 240
    roomsCursor = RocketChat.models.Rooms.findByTypeContainigUsername('c', this.user.username, {                    //
      fields: {                                                                                                     //
        name: 1,                                                                                                    //
        t: 1                                                                                                        //
      }                                                                                                             //
    });                                                                                                             //
    rooms = roomsCursor.fetch();                                                                                    //
    results = [];                                                                                                   // 246
    for (i = 0, len = rooms.length; i < len; i++) {                                                                 //
      room = rooms[i];                                                                                              //
      results.push(this.joinRoom(room));                                                                            //
    }                                                                                                               // 246
    return results;                                                                                                 //
  };                                                                                                                //
                                                                                                                    //
  IrcClient.prototype.joinRoom = function(room) {                                                                   //
    var msg;                                                                                                        // 250
    if (room.t !== 'c' || room.name === 'general') {                                                                //
      return;                                                                                                       // 251
    }                                                                                                               //
    if (this.isJoiningRoom) {                                                                                       //
      return this.pendingJoinRoomBuf.push(room.name);                                                               //
    } else {                                                                                                        //
      console.log('[irc] joinRoom -> '.yellow, 'roomName:', room.name, 'pendingJoinRoomBuf:', this.pendingJoinRoomBuf.join(','));
      msg = "JOIN #" + room.name + "\r\n";                                                                          //
      this.receiveMemberListBuf[room.name] = [];                                                                    //
      this.sendRawMessage(msg);                                                                                     //
      return this.isJoiningRoom = true;                                                                             //
    }                                                                                                               //
  };                                                                                                                //
                                                                                                                    //
  IrcClient.prototype.leaveRoom = function(room) {                                                                  //
    var msg;                                                                                                        // 263
    if (room.t !== 'c') {                                                                                           //
      return;                                                                                                       // 264
    }                                                                                                               //
    msg = "PART #" + room.name + "\r\n";                                                                            //
    return this.sendRawMessage(msg);                                                                                //
  };                                                                                                                //
                                                                                                                    //
  IrcClient.prototype.getMemberList = function(room) {                                                              //
    var msg;                                                                                                        // 269
    if (room.t !== 'c') {                                                                                           //
      return;                                                                                                       // 270
    }                                                                                                               //
    msg = "NAMES #" + room.name + "\r\n";                                                                           //
    this.receiveMemberListBuf[room.name] = [];                                                                      //
    return this.sendRawMessage(msg);                                                                                //
  };                                                                                                                //
                                                                                                                    //
  IrcClient.prototype.onAddMemberToRoom = function(member, roomName) {                                              //
    if (this.user.username === member) {                                                                            //
      return;                                                                                                       // 277
    }                                                                                                               //
    console.log('[irc] onAddMemberToRoom -> '.yellow, 'roomName:', roomName, 'member:', member);                    //
    this.createUserWhenNotExist(member);                                                                            //
    return RocketChat.models.Rooms.addUsernameByName(roomName, member);                                             //
  };                                                                                                                //
                                                                                                                    //
  IrcClient.prototype.onRemoveMemberFromRoom = function(member, roomName) {                                         //
    console.log('[irc] onRemoveMemberFromRoom -> '.yellow, 'roomName:', roomName, 'member:', member);               //
    return RocketChat.models.Rooms.removeUsernameByName(roomName, member);                                          //
  };                                                                                                                //
                                                                                                                    //
  IrcClient.prototype.onQuitMember = function(member) {                                                             //
    console.log('[irc] onQuitMember ->'.yellow, 'username:', member);                                               //
    RocketChat.models.Rooms.removeUsernameFromAll(member);                                                          //
    return Meteor.users.update({                                                                                    //
      name: member                                                                                                  //
    }, {                                                                                                            //
      $set: {                                                                                                       //
        status: 'offline'                                                                                           //
      }                                                                                                             //
    });                                                                                                             //
  };                                                                                                                //
                                                                                                                    //
  IrcClient.prototype.createUserWhenNotExist = function(name) {                                                     //
    var user;                                                                                                       // 297
    user = Meteor.users.findOne({                                                                                   //
      name: name                                                                                                    //
    });                                                                                                             //
    if (!user) {                                                                                                    //
      console.log('[irc] createNotExistUser ->'.yellow, 'userName:', name);                                         //
      Meteor.call('registerUser', {                                                                                 //
        email: name + "@rocketchat.org",                                                                            //
        pass: 'rocketchat',                                                                                         //
        name: name                                                                                                  //
      });                                                                                                           //
      Meteor.users.update({                                                                                         //
        name: name                                                                                                  //
      }, {                                                                                                          //
        $set: {                                                                                                     //
          status: 'online',                                                                                         //
          username: name                                                                                            //
        }                                                                                                           //
      });                                                                                                           //
      user = Meteor.users.findOne({                                                                                 //
        name: name                                                                                                  //
      });                                                                                                           //
    }                                                                                                               //
    return user;                                                                                                    // 309
  };                                                                                                                //
                                                                                                                    //
  IrcClient.prototype.createDirectRoomWhenNotExist = function(source, target) {                                     //
    var now, rid;                                                                                                   // 313
    console.log('[irc] createDirectRoomWhenNotExist -> '.yellow, 'source:', source, 'target:', target);             //
    rid = [source._id, target._id].sort().join('');                                                                 //
    now = new Date();                                                                                               //
    RocketChat.models.Rooms.upsert({                                                                                //
      _id: rid                                                                                                      //
    }, {                                                                                                            //
      $set: {                                                                                                       //
        usernames: [source.username, target.username]                                                               //
      },                                                                                                            //
      $setOnInsert: {                                                                                               //
        t: 'd',                                                                                                     //
        msgs: 0,                                                                                                    //
        ts: now                                                                                                     //
      }                                                                                                             //
    });                                                                                                             //
    RocketChat.models.Subscriptions.upsert({                                                                        //
      rid: rid,                                                                                                     //
      $and: [                                                                                                       //
        {                                                                                                           //
          'u._id': target._id                                                                                       //
        }                                                                                                           //
      ]                                                                                                             //
    }, {                                                                                                            //
      $setOnInsert: {                                                                                               //
        name: source.username,                                                                                      //
        t: 'd',                                                                                                     //
        open: false,                                                                                                //
        alert: false,                                                                                               //
        unread: 0,                                                                                                  //
        u: {                                                                                                        //
          _id: target._id,                                                                                          //
          username: target.username                                                                                 //
        }                                                                                                           //
      }                                                                                                             //
    });                                                                                                             //
    return {                                                                                                        // 339
      t: 'd',                                                                                                       //
      _id: rid                                                                                                      //
    };                                                                                                              //
  };                                                                                                                //
                                                                                                                    //
  return IrcClient;                                                                                                 //
                                                                                                                    //
})();                                                                                                               //
                                                                                                                    //
IrcClient.getByUid = function(uid) {                                                                                // 344
  return ircClientMap[uid];                                                                                         // 345
};                                                                                                                  // 344
                                                                                                                    //
IrcClient.create = function(login) {                                                                                // 347
  var ircClient;                                                                                                    // 348
  if (login.user == null) {                                                                                         //
    return login;                                                                                                   // 349
  }                                                                                                                 //
  if (!(login.user._id in ircClientMap)) {                                                                          //
    ircClient = new IrcClient(login);                                                                               //
    return async(ircClient.connect);                                                                                // 352
  }                                                                                                                 //
  return login;                                                                                                     // 354
};                                                                                                                  // 347
                                                                                                                    //
IrcLoginer = (function() {                                                                                          // 357
  function IrcLoginer(login) {                                                                                      //
    console.log('[irc] validateLogin -> '.yellow, login);                                                           //
    return IrcClient.create(login);                                                                                 // 360
  }                                                                                                                 //
                                                                                                                    //
  return IrcLoginer;                                                                                                //
                                                                                                                    //
})();                                                                                                               //
                                                                                                                    //
IrcSender = (function() {                                                                                           // 363
  function IrcSender(message) {                                                                                     //
    var cacheKey, ircClient, name, room, timestamp;                                                                 // 365
    name = message.u.username;                                                                                      //
    timestamp = message.ts.getTime();                                                                               //
    cacheKey = "" + name + timestamp;                                                                               //
    if (ircReceiveMessageCache.get(cacheKey)) {                                                                     //
      return message;                                                                                               // 369
    }                                                                                                               //
    room = RocketChat.models.Rooms.findOneById(message.rid, {                                                       //
      fields: {                                                                                                     //
        name: 1,                                                                                                    //
        usernames: 1,                                                                                               //
        t: 1                                                                                                        //
      }                                                                                                             //
    });                                                                                                             //
    ircClient = IrcClient.getByUid(message.u._id);                                                                  //
    ircClient.sendMessage(room, message);                                                                           //
    return message;                                                                                                 // 374
  }                                                                                                                 //
                                                                                                                    //
  return IrcSender;                                                                                                 //
                                                                                                                    //
})();                                                                                                               //
                                                                                                                    //
IrcRoomJoiner = (function() {                                                                                       // 377
  function IrcRoomJoiner(user, room) {                                                                              //
    var ircClient;                                                                                                  // 379
    ircClient = IrcClient.getByUid(user._id);                                                                       //
    ircClient.joinRoom(room);                                                                                       //
    return room;                                                                                                    // 381
  }                                                                                                                 //
                                                                                                                    //
  return IrcRoomJoiner;                                                                                             //
                                                                                                                    //
})();                                                                                                               //
                                                                                                                    //
IrcRoomLeaver = (function() {                                                                                       // 384
  function IrcRoomLeaver(user, room) {                                                                              //
    var ircClient;                                                                                                  // 386
    ircClient = IrcClient.getByUid(user._id);                                                                       //
    ircClient.leaveRoom(room);                                                                                      //
    return room;                                                                                                    // 388
  }                                                                                                                 //
                                                                                                                    //
  return IrcRoomLeaver;                                                                                             //
                                                                                                                    //
})();                                                                                                               //
                                                                                                                    //
IrcLogoutCleanUper = (function() {                                                                                  // 391
  function IrcLogoutCleanUper(user) {                                                                               //
    var ircClient;                                                                                                  // 393
    ircClient = IrcClient.getByUid(user._id);                                                                       //
    ircClient.disconnect();                                                                                         //
    return user;                                                                                                    // 395
  }                                                                                                                 //
                                                                                                                    //
  return IrcLogoutCleanUper;                                                                                        //
                                                                                                                    //
})();                                                                                                               //
                                                                                                                    //
if (IRC_AVAILABILITY === true) {                                                                                    // 403
  RocketChat.callbacks.add('beforeValidateLogin', IrcLoginer, RocketChat.callbacks.priority.LOW, 'irc-loginer');    //
  RocketChat.callbacks.add('beforeSaveMessage', IrcSender, RocketChat.callbacks.priority.LOW, 'irc-sender');        //
  RocketChat.callbacks.add('beforeJoinRoom', IrcRoomJoiner, RocketChat.callbacks.priority.LOW, 'irc-room-joiner');  //
  RocketChat.callbacks.add('beforeCreateChannel', IrcRoomJoiner, RocketChat.callbacks.priority.LOW, 'irc-room-joiner-create-channel');
  RocketChat.callbacks.add('beforeLeaveRoom', IrcRoomLeaver, RocketChat.callbacks.priority.LOW, 'irc-room-leaver');
  RocketChat.callbacks.add('afterLogoutCleanUp', IrcLogoutCleanUper, RocketChat.callbacks.priority.LOW, 'irc-clean-up');
} else {                                                                                                            //
  return;                                                                                                           // 411
}                                                                                                                   //
                                                                                                                    //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['rocketchat:irc'] = {}, {
  Irc: Irc
});

})();

//# sourceMappingURL=rocketchat_irc.js.map
