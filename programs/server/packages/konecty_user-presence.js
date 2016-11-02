(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var colors = Package['nooitaf:colors'].colors;
var _ = Package.underscore._;

/* Package-scope variables */
var UsersSessions, UserPresence, UserPresenceMonitor;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/konecty_user-presence/common/common.js                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/* globals UsersSessions */
/* exported UsersSessions */

UsersSessions = new Meteor.Collection('usersSessions');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/konecty_user-presence/server/server.js                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/* globals InstanceStatus, UsersSessions, UserPresenceMonitor, UserPresence */

UsersSessions._ensureIndex({'connections.instanceId': 1}, {sparse: 1, name: 'connections.instanceId'});
UsersSessions._ensureIndex({'connections.id': 1}, {sparse: 1, name: 'connections.id'});

var allowedStatus = ['online', 'away', 'busy', 'offline'];

var logEnable = false;

var log = function(msg, color) {
	if (logEnable) {
		if (color) {
			console.log(msg[color]);
		} else {
			console.log(msg);
		}
	}
};

var logRed = function() {
	log(Array.prototype.slice.call(arguments).join(' '), 'red');
};
var logGrey = function() {
	log(Array.prototype.slice.call(arguments).join(' '), 'grey');
};
var logGreen = function() {
	log(Array.prototype.slice.call(arguments).join(' '), 'green');
};
var logYellow = function() {
	log(Array.prototype.slice.call(arguments).join(' '), 'yellow');
};

UserPresence = {
	activeLogs: function() {
		logEnable = true;
	},

	removeLostConnections: function() {
		if (Package['konecty:multiple-instances-status']) {
			var ids = InstanceStatus.getCollection().find({}, {fields: {_id: 1}}).fetch();

			ids = ids.map(function(id) {
				return id._id;
			});

			var update = {
				$pull: {
					connections: {
						instanceId: {
							$nin: ids
						}
					}
				}
			};

			UsersSessions.update({}, update, {multi: true});
		} else {
			UsersSessions.remove({});
		}
	},

	removeConnectionsByInstanceId: function(instanceId) {
		logRed('[user-presence] removeConnectionsByInstanceId', instanceId);
		var update = {
			$pull: {
				connections: {
					instanceId: instanceId
				}
			}
		};

		UsersSessions.update({}, update, {multi: true});
	},

	removeAllConnections: function() {
		logRed('[user-presence] removeAllConnections');
		UsersSessions.remove({});
	},

	startObserveForDeletedServers: function() {
		InstanceStatus.getCollection().find({}, {fields: {_id: 1}}).observeChanges({
			removed: function(id) {
				UserPresence.removeConnectionsByInstanceId(id);
			}
		});
	},

	createConnection: function(userId, connection, status, visitor) {
		if (!userId) {
			return;
		}

		connection.UserPresenceUserId = userId;

		status = status || 'online';

		logGreen('[user-presence] createConnection', userId, connection.id, visitor === true ? 'visitor' : 'user');

		var query = {
			_id: userId
		};

		var now = new Date();

		var instanceId = undefined;
		if (Package['konecty:multiple-instances-status']) {
			instanceId = InstanceStatus.id();
		}

		var update = {
			$set: {
				visitor: visitor === true
			},
			$push: {
				connections: {
					id: connection.id,
					instanceId: instanceId,
					status: status,
					_createdAt: now,
					_updatedAt: now
				}
			}
		};

		UsersSessions.upsert(query, update);
	},

	setConnection: function(userId, connection, status, visitor) {
		if (!userId) {
			return;
		}

		logGrey('[user-presence] setConnection', userId, connection.id, status, visitor === true ? 'visitor' : 'user');

		var query = {
			_id: userId,
			'connections.id': connection.id
		};

		var now = new Date();

		var update = {
			$set: {
				'connections.$.status': status,
				'connections.$._updatedAt': now
			}
		};

		var count = UsersSessions.update(query, update);

		if (count === 0) {
			UserPresence.createConnection(userId, connection, status, visitor);
		}

		if (visitor !== true) {
			if (status === 'online') {
				Meteor.users.update({_id: userId, statusDefault: 'online', status: {$ne: 'online'}}, {$set: {status: 'online'}});
			} else if (status === 'away') {
				Meteor.users.update({_id: userId, statusDefault: 'online', status: {$ne: 'away'}}, {$set: {status: 'away'}});
			}
		}
	},

	setDefaultStatus: function(userId, status) {
		if (!userId) {
			return;
		}

		if (allowedStatus.indexOf(status) === -1) {
			return;
		}

		logYellow('[user-presence] setDefaultStatus', userId, status);

		var update = Meteor.users.update({_id: userId, statusDefault: {$ne: status}}, {$set: {statusDefault: status}});

		if (update > 0) {
			UserPresenceMonitor.processUser(userId, { statusDefault: status });
		}
	},

	removeConnection: function(connectionId) {
		logRed('[user-presence] removeConnection', connectionId);

		var query = {
			'connections.id': connectionId
		};

		var update = {
			$pull: {
				connections: {
					id: connectionId
				}
			}
		};

		UsersSessions.update(query, update);
	},

	start: function() {
		Meteor.onConnection(function(connection) {
			connection.onClose(function() {
				if (connection.UserPresenceUserId !== undefined && connection.UserPresenceUserId !== null) {
					UserPresence.removeConnection(connection.id);
				}
			});
		});

		process.on('exit', Meteor.bindEnvironment(function() {
			if (Package['konecty:multiple-instances-status']) {
				UserPresence.removeConnectionsByInstanceId(InstanceStatus.id());
			} else {
				UserPresence.removeAllConnections();
			}
		}));

		if (Package['accounts-base']) {
			Accounts.onLogin(function(login) {
				UserPresence.createConnection(login.user._id, login.connection);
			});
		}

		Meteor.publish(null, function() {
			if (this.userId == null && this.connection.UserPresenceUserId !== undefined && this.connection.UserPresenceUserId !== null) {
				UserPresence.removeConnection(this.connection.id);
				delete this.connection.UserPresenceUserId;
			}

			this.ready();
		});

		if (Package['konecty:multiple-instances-status']) {
			UserPresence.startObserveForDeletedServers();
		}

		UserPresence.removeLostConnections();

		Meteor.methods({
			'UserPresence:connect': function() {
				this.unblock();
				UserPresence.createConnection(this.userId, this.connection);
			},

			'UserPresence:away': function() {
				this.unblock();
				UserPresence.setConnection(this.userId, this.connection, 'away');
			},

			'UserPresence:online': function() {
				this.unblock();
				UserPresence.setConnection(this.userId, this.connection, 'online');
			},

			'UserPresence:setDefaultStatus': function(status) {
				this.unblock();
				UserPresence.setDefaultStatus(this.userId, status);
			},

			'UserPresence:visitor:connect': function(id) {
				this.unblock();
				UserPresence.createConnection(id, this.connection, 'online', true);
			}
		});
	}
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/konecty_user-presence/server/monitor.js                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/* globals UserPresenceMonitor, UsersSessions */

UserPresenceMonitor = {
	callbacks: [],

	/**
	 * The callback will receive the following parameters: user, status, statusConnection
	 */
	onSetUserStatus: function(callback) {
		this.callbacks.push(callback);
	},

	runCallbacks: function(user, status, statusConnection) {
		this.callbacks.forEach(function(callback) {
			callback.call(null, user, status, statusConnection);
		});
	},

	start: function() {
		UsersSessions.find({}).observe({
			added: function(record) {
				UserPresenceMonitor.processUserSession(record, 'added');
			},
			changed: function(record) {
				UserPresenceMonitor.processUserSession(record, 'changed');
			},
			removed: function(record) {
				UserPresenceMonitor.processUserSession(record, 'removed');
			}
		});
	},

	processUserSession: function(record, action) {
		if (action === 'removed' && (record.connections == null || record.connections.length === 0)) {
			return;
		}

		if (record.connections == null || record.connections.length === 0 || action === 'removed') {
			if (record.visitor === true) {
				UserPresenceMonitor.setVisitorStatus(record._id, 'offline');
			} else {
				UserPresenceMonitor.setUserStatus(record._id, 'offline');
			}

			if (action !== 'removed') {
				UsersSessions.remove({_id: record._id, 'connections.0': {$exists: false} });
			}
			return;
		}

		var connectionStatus = 'offline';
		record.connections.forEach(function(connection) {
			if (connection.status === 'online') {
				connectionStatus = 'online';
			} else if (connection.status === 'away' && connectionStatus === 'offline') {
				connectionStatus = 'away';
			}
		});

		if (record.visitor === true) {
			UserPresenceMonitor.setVisitorStatus(record._id, connectionStatus);
		} else {
			UserPresenceMonitor.setUserStatus(record._id, connectionStatus);
		}
	},

	processUser: function(id, fields) {
		if (fields.statusDefault == null) {
			return;
		}

		var userSession = UsersSessions.findOne({_id: id});

		if (userSession) {
			UserPresenceMonitor.processUserSession(userSession, 'changed');
		}
	},

	setUserStatus: function(userId, status) {
		var user = Meteor.users.findOne(userId),
			statusConnection = status;

		if (!user) {
			return;
		}

		if (user.statusDefault != null && status !== 'offline' && user.statusDefault !== 'online') {
			status = user.statusDefault;
		}

		var query = {
			_id: userId,
			$or: [
				{status: {$ne: status}},
				{statusConnection: {$ne: statusConnection}}
			]
		};

		var update = {
			$set: {
				status: status,
				statusConnection: statusConnection
			}
		};

		Meteor.users.update(query, update);

		this.runCallbacks(user, status, statusConnection);
	},

	setVisitorStatus: function(/*id, status*/) {}
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['konecty:user-presence'] = {}, {
  UserPresence: UserPresence,
  UserPresenceMonitor: UserPresenceMonitor
});

})();
