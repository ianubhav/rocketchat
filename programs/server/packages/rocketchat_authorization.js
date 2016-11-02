(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var meteorInstall = Package.modules.meteorInstall;
var Buffer = Package.modules.Buffer;
var process = Package.modules.process;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

/* Package-scope variables */
var __coffeescriptShare;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:authorization":{"lib":{"rocketchat.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/rocketchat_authorization/lib/rocketchat.coffee.js                                                 //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.authz = {};                                                                                        // 1
                                                                                                              //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"models":{"Permissions.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/rocketchat_authorization/server/models/Permissions.coffee.js                                      //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var ModelPermissions,                                                                                         // 1
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;                                                                                //
                                                                                                              //
ModelPermissions = (function(superClass) {                                                                    // 1
  extend(ModelPermissions, superClass);                                                                       //
                                                                                                              //
  function ModelPermissions() {                                                                               //
    ModelPermissions.__super__.constructor.apply(this, arguments);                                            //
  }                                                                                                           //
                                                                                                              //
  ModelPermissions.prototype.findByRole = function(role, options) {                                           //
    var query;                                                                                                // 7
    query = {                                                                                                 //
      roles: role                                                                                             //
    };                                                                                                        //
    return this.find(query, options);                                                                         // 10
  };                                                                                                          //
                                                                                                              //
  ModelPermissions.prototype.findOneById = function(_id) {                                                    //
    return this.findOne(_id);                                                                                 // 13
  };                                                                                                          //
                                                                                                              //
  ModelPermissions.prototype.createOrUpdate = function(name, roles) {                                         //
    return this.upsert({                                                                                      //
      _id: name                                                                                               //
    }, {                                                                                                      //
      $set: {                                                                                                 //
        roles: roles                                                                                          //
      }                                                                                                       //
    });                                                                                                       //
  };                                                                                                          //
                                                                                                              //
  ModelPermissions.prototype.addRole = function(permission, role) {                                           //
    return this.update({                                                                                      //
      _id: permission                                                                                         //
    }, {                                                                                                      //
      $addToSet: {                                                                                            //
        roles: role                                                                                           //
      }                                                                                                       //
    });                                                                                                       //
  };                                                                                                          //
                                                                                                              //
  ModelPermissions.prototype.removeRole = function(permission, role) {                                        //
    return this.update({                                                                                      //
      _id: permission                                                                                         //
    }, {                                                                                                      //
      $pull: {                                                                                                //
        roles: role                                                                                           //
      }                                                                                                       //
    });                                                                                                       //
  };                                                                                                          //
                                                                                                              //
  return ModelPermissions;                                                                                    //
                                                                                                              //
})(RocketChat.models._Base);                                                                                  //
                                                                                                              //
RocketChat.models.Permissions = new ModelPermissions('permissions');                                          // 25
                                                                                                              //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Roles.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/rocketchat_authorization/server/models/Roles.coffee.js                                            //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;                                                                                //
                                                                                                              //
RocketChat.models.Roles = new ((function(superClass) {                                                        // 1
  extend(_Class, superClass);                                                                                 //
                                                                                                              //
  function _Class() {                                                                                         //
    _Class.__super__.constructor.call(this, 'roles');                                                         //
    this.tryEnsureIndex({                                                                                     //
      'name': 1                                                                                               //
    });                                                                                                       //
    this.tryEnsureIndex({                                                                                     //
      'scope': 1                                                                                              //
    });                                                                                                       //
  }                                                                                                           //
                                                                                                              //
  _Class.prototype.findUsersInRole = function(name, scope, options) {                                         //
    var ref, role, roleScope;                                                                                 // 8
    role = this.findOne(name);                                                                                //
    roleScope = (role != null ? role.scope : void 0) || 'Users';                                              //
    return (ref = RocketChat.models[roleScope]) != null ? typeof ref.findUsersInRoles === "function" ? ref.findUsersInRoles(name, scope, options) : void 0 : void 0;
  };                                                                                                          //
                                                                                                              //
  _Class.prototype.isUserInRoles = function(userId, roles, scope) {                                           //
    roles = [].concat(roles);                                                                                 //
    return _.some(roles, (function(_this) {                                                                   //
      return function(roleName) {                                                                             //
        var ref, role, roleScope;                                                                             // 15
        role = _this.findOne(roleName);                                                                       //
        roleScope = (role != null ? role.scope : void 0) || 'Users';                                          //
        return (ref = RocketChat.models[roleScope]) != null ? typeof ref.isUserInRole === "function" ? ref.isUserInRole(userId, roleName, scope) : void 0 : void 0;
      };                                                                                                      //
    })(this));                                                                                                //
  };                                                                                                          //
                                                                                                              //
  _Class.prototype.createOrUpdate = function(name, scope, description, protectedRole) {                       //
    var updateData;                                                                                           // 20
    if (scope == null) {                                                                                      //
      scope = 'Users';                                                                                        //
    }                                                                                                         //
    updateData = {};                                                                                          //
    updateData.name = name;                                                                                   //
    updateData.scope = scope;                                                                                 //
    if (description != null) {                                                                                //
      updateData.description = description;                                                                   //
    }                                                                                                         //
    if (protectedRole != null) {                                                                              //
      updateData["protected"] = protectedRole;                                                                //
    }                                                                                                         //
    return this.upsert({                                                                                      //
      _id: name                                                                                               //
    }, {                                                                                                      //
      $set: updateData                                                                                        //
    });                                                                                                       //
  };                                                                                                          //
                                                                                                              //
  _Class.prototype.addUserRoles = function(userId, roles, scope) {                                            //
    var i, len, ref, results, role, roleName, roleScope;                                                      // 32
    roles = [].concat(roles);                                                                                 //
    results = [];                                                                                             // 33
    for (i = 0, len = roles.length; i < len; i++) {                                                           //
      roleName = roles[i];                                                                                    //
      role = this.findOne(roleName);                                                                          //
      roleScope = (role != null ? role.scope : void 0) || 'Users';                                            //
      results.push((ref = RocketChat.models[roleScope]) != null ? typeof ref.addRolesByUserId === "function" ? ref.addRolesByUserId(userId, roleName, scope) : void 0 : void 0);
    }                                                                                                         // 33
    return results;                                                                                           //
  };                                                                                                          //
                                                                                                              //
  _Class.prototype.removeUserRoles = function(userId, roles, scope) {                                         //
    var i, len, ref, results, role, roleName, roleScope;                                                      // 39
    roles = [].concat(roles);                                                                                 //
    results = [];                                                                                             // 40
    for (i = 0, len = roles.length; i < len; i++) {                                                           //
      roleName = roles[i];                                                                                    //
      role = this.findOne(roleName);                                                                          //
      roleScope = (role != null ? role.scope : void 0) || 'Users';                                            //
      results.push((ref = RocketChat.models[roleScope]) != null ? typeof ref.removeRolesByUserId === "function" ? ref.removeRolesByUserId(userId, roleName, scope) : void 0 : void 0);
    }                                                                                                         // 40
    return results;                                                                                           //
  };                                                                                                          //
                                                                                                              //
  return _Class;                                                                                              //
                                                                                                              //
})(RocketChat.models._Base));                                                                                 //
                                                                                                              //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Base.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/rocketchat_authorization/server/models/Base.js                                                    //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
RocketChat.models._Base.prototype.roleBaseQuery = function () /*userId, scope*/{                              // 1
	return;                                                                                                      // 2
};                                                                                                            // 3
                                                                                                              //
RocketChat.models._Base.prototype.findRolesByUserId = function (userId /*, options*/) {                       // 5
	var query = this.roleBaseQuery(userId);                                                                      // 6
	return this.find(query, { fields: { roles: 1 } });                                                           // 7
};                                                                                                            // 8
                                                                                                              //
RocketChat.models._Base.prototype.isUserInRole = function (userId, roleName, scope) {                         // 10
	var query = this.roleBaseQuery(userId, scope);                                                               // 11
                                                                                                              //
	if (query == null) {                                                                                         // 13
		return false;                                                                                               // 14
	}                                                                                                            // 15
                                                                                                              //
	query.roles = roleName;                                                                                      // 17
	return !_.isUndefined(this.findOne(query));                                                                  // 18
};                                                                                                            // 19
                                                                                                              //
RocketChat.models._Base.prototype.addRolesByUserId = function (userId, roles, scope) {                        // 21
	roles = [].concat(roles);                                                                                    // 22
	var query = this.roleBaseQuery(userId, scope);                                                               // 23
	var update = {                                                                                               // 24
		$addToSet: {                                                                                                // 25
			roles: { $each: roles }                                                                                    // 26
		}                                                                                                           // 25
	};                                                                                                           // 24
	return this.update(query, update);                                                                           // 29
};                                                                                                            // 30
                                                                                                              //
RocketChat.models._Base.prototype.removeRolesByUserId = function (userId, roles, scope) {                     // 32
	roles = [].concat(roles);                                                                                    // 33
	var query = this.roleBaseQuery(userId, scope);                                                               // 34
	var update = {                                                                                               // 35
		$pullAll: {                                                                                                 // 36
			roles: roles                                                                                               // 37
		}                                                                                                           // 36
	};                                                                                                           // 35
	return this.update(query, update);                                                                           // 40
};                                                                                                            // 41
                                                                                                              //
RocketChat.models._Base.prototype.findUsersInRoles = function () {                                            // 43
	throw new Meteor.Error('overwrite-function', 'You must overwrite this function in the extended classes');    // 44
};                                                                                                            // 45
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Users.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/rocketchat_authorization/server/models/Users.js                                                   //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
RocketChat.models.Users.roleBaseQuery = function (userId) {                                                   // 1
	return { _id: userId };                                                                                      // 2
};                                                                                                            // 3
                                                                                                              //
RocketChat.models.Users.findUsersInRoles = function (roles, scope, options) {                                 // 5
	roles = [].concat(roles);                                                                                    // 6
                                                                                                              //
	var query = {                                                                                                // 8
		roles: { $in: roles }                                                                                       // 9
	};                                                                                                           // 8
                                                                                                              //
	return this.find(query, options);                                                                            // 12
};                                                                                                            // 13
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Subscriptions.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/rocketchat_authorization/server/models/Subscriptions.js                                           //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
RocketChat.models.Subscriptions.roleBaseQuery = function (userId, scope) {                                    // 1
	if (scope == null) {                                                                                         // 2
		return;                                                                                                     // 3
	}                                                                                                            // 4
                                                                                                              //
	var query = { 'u._id': userId };                                                                             // 6
	if (!_.isUndefined(scope)) {                                                                                 // 7
		query.rid = scope;                                                                                          // 8
	}                                                                                                            // 9
	return query;                                                                                                // 10
};                                                                                                            // 11
                                                                                                              //
RocketChat.models.Subscriptions.findUsersInRoles = function (roles, scope, options) {                         // 13
	roles = [].concat(roles);                                                                                    // 14
                                                                                                              //
	var query = {                                                                                                // 16
		roles: { $in: roles }                                                                                       // 17
	};                                                                                                           // 16
                                                                                                              //
	if (scope) {                                                                                                 // 20
		query.rid = scope;                                                                                          // 21
	}                                                                                                            // 22
                                                                                                              //
	var subscriptions = this.find(query).fetch();                                                                // 24
                                                                                                              //
	var users = _.compact(_.map(subscriptions, function (subscription) {                                         // 26
		if ('undefined' !== typeof subscription.u && 'undefined' !== typeof subscription.u._id) {                   // 27
			return subscription.u._id;                                                                                 // 28
		}                                                                                                           // 29
	}));                                                                                                         // 30
                                                                                                              //
	return RocketChat.models.Users.find({ _id: { $in: users } }, options);                                       // 32
};                                                                                                            // 33
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"functions":{"addUserRoles.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/rocketchat_authorization/server/functions/addUserRoles.coffee.js                                  //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.authz.addUserRoles = function(userId, roleNames, scope) {                                          // 1
  var existingRoleNames, i, invalidRoleNames, len, role, user;                                                // 2
  if (!userId || !roleNames) {                                                                                //
    return false;                                                                                             // 3
  }                                                                                                           //
  user = RocketChat.models.Users.findOneById(userId);                                                         //
  if (!user) {                                                                                                //
    throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                            // 7
      "function": 'RocketChat.authz.addUserRoles'                                                             //
    });                                                                                                       //
  }                                                                                                           //
  roleNames = [].concat(roleNames);                                                                           //
  existingRoleNames = _.pluck(RocketChat.authz.getRoles(), '_id');                                            //
  invalidRoleNames = _.difference(roleNames, existingRoleNames);                                              //
  if (!_.isEmpty(invalidRoleNames)) {                                                                         //
    for (i = 0, len = invalidRoleNames.length; i < len; i++) {                                                // 14
      role = invalidRoleNames[i];                                                                             //
      RocketChat.models.Roles.createOrUpdate(role);                                                           //
    }                                                                                                         // 14
  }                                                                                                           //
  RocketChat.models.Roles.addUserRoles(userId, roleNames, scope);                                             //
  return true;                                                                                                // 19
};                                                                                                            // 1
                                                                                                              //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"canAccessRoom.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/rocketchat_authorization/server/functions/canAccessRoom.js                                        //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
/* globals RocketChat */                                                                                      // 1
RocketChat.authz.roomAccessValidators = [function (room, user) {                                              // 2
	return room.usernames.indexOf(user.username) !== -1;                                                         // 4
}, function (room, user) {                                                                                    // 5
	if (room.t === 'c') {                                                                                        // 7
		return RocketChat.authz.hasPermission(user._id, 'view-c-room');                                             // 8
	}                                                                                                            // 9
}];                                                                                                           // 10
                                                                                                              //
RocketChat.authz.canAccessRoom = function (room, user) {                                                      // 13
	var _this = this;                                                                                            // 13
                                                                                                              //
	return RocketChat.authz.roomAccessValidators.some(function (validator) {                                     // 14
		return validator.call(_this, room, user);                                                                   // 15
	});                                                                                                          // 16
};                                                                                                            // 17
                                                                                                              //
RocketChat.authz.addRoomAccessValidator = function (validator) {                                              // 19
	RocketChat.authz.roomAccessValidators.push(validator);                                                       // 20
};                                                                                                            // 21
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getRoles.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/rocketchat_authorization/server/functions/getRoles.coffee.js                                      //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.authz.getRoles = function() {                                                                      // 1
  return RocketChat.models.Roles.find().fetch();                                                              // 2
};                                                                                                            // 1
                                                                                                              //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getUsersInRole.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/rocketchat_authorization/server/functions/getUsersInRole.coffee.js                                //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.authz.getUsersInRole = function(roleName, scope, options) {                                        // 1
  return RocketChat.models.Roles.findUsersInRole(roleName, scope, options);                                   // 2
};                                                                                                            // 1
                                                                                                              //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"hasPermission.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/rocketchat_authorization/server/functions/hasPermission.coffee.js                                 //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var all, atLeastOne, hasPermission;                                                                           // 1
                                                                                                              //
atLeastOne = function(userId, permissions, scope) {                                                           // 1
  return _.some(permissions, function(permissionId) {                                                         // 2
    var permission;                                                                                           // 3
    permission = RocketChat.models.Permissions.findOne(permissionId);                                         //
    return RocketChat.models.Roles.isUserInRoles(userId, permission.roles, scope);                            //
  });                                                                                                         //
};                                                                                                            // 1
                                                                                                              //
all = function(userId, permissions, scope) {                                                                  // 6
  return _.every(permissions, function(permissionId) {                                                        // 7
    var permission;                                                                                           // 8
    permission = RocketChat.models.Permissions.findOne(permissionId);                                         //
    return RocketChat.models.Roles.isUserInRoles(userId, permission.roles, scope);                            //
  });                                                                                                         //
};                                                                                                            // 6
                                                                                                              //
hasPermission = function(userId, permissions, scope, strategy) {                                              // 11
  if (!userId) {                                                                                              //
    return false;                                                                                             // 13
  }                                                                                                           //
  permissions = [].concat(permissions);                                                                       //
  return strategy(userId, permissions, scope);                                                                // 17
};                                                                                                            // 11
                                                                                                              //
RocketChat.authz.hasAllPermission = function(userId, permissions, scope) {                                    // 21
  return hasPermission(userId, permissions, scope, all);                                                      // 22
};                                                                                                            // 21
                                                                                                              //
RocketChat.authz.hasPermission = RocketChat.authz.hasAllPermission;                                           // 24
                                                                                                              //
RocketChat.authz.hasAtLeastOnePermission = function(userId, permissions, scope) {                             // 26
  return hasPermission(userId, permissions, scope, atLeastOne);                                               // 27
};                                                                                                            // 26
                                                                                                              //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"hasRole.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/rocketchat_authorization/server/functions/hasRole.coffee.js                                       //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.authz.hasRole = function(userId, roleNames, scope) {                                               // 1
  roleNames = [].concat(roleNames);                                                                           //
  return RocketChat.models.Roles.isUserInRoles(userId, roleNames, scope);                                     // 3
};                                                                                                            // 1
                                                                                                              //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"removeUserFromRoles.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/rocketchat_authorization/server/functions/removeUserFromRoles.coffee.js                           //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
RocketChat.authz.removeUserFromRoles = function(userId, roleNames, scope) {                                   // 1
  var existingRoleNames, invalidRoleNames, user;                                                              // 2
  if (!userId || !roleNames) {                                                                                //
    return false;                                                                                             // 3
  }                                                                                                           //
  user = RocketChat.models.Users.findOneById(userId);                                                         //
  if (user == null) {                                                                                         //
    throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                            // 7
      "function": 'RocketChat.authz.removeUserFromRoles'                                                      //
    });                                                                                                       //
  }                                                                                                           //
  roleNames = [].concat(roleNames);                                                                           //
  existingRoleNames = _.pluck(RocketChat.authz.getRoles(), '_id');                                            //
  invalidRoleNames = _.difference(roleNames, existingRoleNames);                                              //
  if (!_.isEmpty(invalidRoleNames)) {                                                                         //
    throw new Meteor.Error('error-invalid-role', 'Invalid role', {                                            // 14
      "function": 'RocketChat.authz.removeUserFromRoles'                                                      //
    });                                                                                                       //
  }                                                                                                           //
  RocketChat.models.Roles.removeUserRoles(userId, roleNames, scope);                                          //
  return true;                                                                                                // 18
};                                                                                                            // 1
                                                                                                              //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"publications":{"permissions.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/rocketchat_authorization/server/publications/permissions.js                                       //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
Meteor.methods({                                                                                              // 1
	'permissions/get': function () {                                                                             // 2
		function permissionsGet(updatedAt) {                                                                        // 1
			this.unblock();                                                                                            // 3
                                                                                                              //
			if (updatedAt instanceof Date) {                                                                           // 5
				return RocketChat.models.Permissions.dinamicFindChangesAfter('find', updatedAt);                          // 6
			}                                                                                                          // 7
                                                                                                              //
			return RocketChat.models.Permissions.find().fetch();                                                       // 9
		}                                                                                                           // 10
                                                                                                              //
		return permissionsGet;                                                                                      // 1
	}()                                                                                                          // 1
});                                                                                                           // 1
                                                                                                              //
RocketChat.models.Permissions.on('change', function (type) {                                                  // 14
	var records = RocketChat.models.Permissions.getChangedRecords(type, arguments.length <= 1 ? undefined : arguments[1]);
                                                                                                              //
	for (var _iterator = records, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
		var _ref;                                                                                                   // 17
                                                                                                              //
		if (_isArray) {                                                                                             // 17
			if (_i >= _iterator.length) break;                                                                         // 17
			_ref = _iterator[_i++];                                                                                    // 17
		} else {                                                                                                    // 17
			_i = _iterator.next();                                                                                     // 17
			if (_i.done) break;                                                                                        // 17
			_ref = _i.value;                                                                                           // 17
		}                                                                                                           // 17
                                                                                                              //
		var record = _ref;                                                                                          // 17
                                                                                                              //
		RocketChat.Notifications.notifyAll('permissions-changed', type, record);                                    // 18
	}                                                                                                            // 19
});                                                                                                           // 20
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"roles.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/rocketchat_authorization/server/publications/roles.coffee.js                                      //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('roles', function() {                                                                          // 1
  if (!this.userId) {                                                                                         //
    return this.ready();                                                                                      // 3
  }                                                                                                           //
  return RocketChat.models.Roles.find();                                                                      // 5
});                                                                                                           // 1
                                                                                                              //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"usersInRole.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/rocketchat_authorization/server/publications/usersInRole.coffee.js                                //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('usersInRole', function(roleName, scope, limit) {                                              // 1
  var options;                                                                                                // 2
  if (limit == null) {                                                                                        //
    limit = 50;                                                                                               //
  }                                                                                                           //
  if (!this.userId) {                                                                                         //
    return this.ready();                                                                                      // 3
  }                                                                                                           //
  if (!RocketChat.authz.hasPermission(this.userId, 'access-permissions')) {                                   //
    return this.error(new Meteor.Error("error-not-allowed", 'Not allowed', {                                  // 6
      publish: 'usersInRole'                                                                                  //
    }));                                                                                                      //
  }                                                                                                           //
  options = {                                                                                                 //
    limit: limit,                                                                                             //
    sort: {                                                                                                   //
      name: 1                                                                                                 //
    }                                                                                                         //
  };                                                                                                          //
  return RocketChat.authz.getUsersInRole(roleName, scope, options);                                           // 13
});                                                                                                           // 1
                                                                                                              //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"methods":{"addUserToRole.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/rocketchat_authorization/server/methods/addUserToRole.coffee.js                                   //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                              // 1
  'authorization:addUserToRole': function(roleName, username, scope) {                                        //
    var add, user;                                                                                            // 3
    if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'access-permissions')) {         //
      throw new Meteor.Error("error-action-not-allowed", "Accessing permissions is not allowed", {            // 4
        method: 'authorization:addUserToRole',                                                                //
        action: 'Accessing_permissions'                                                                       //
      });                                                                                                     //
    }                                                                                                         //
    if (!roleName || !_.isString(roleName) || !username || !_.isString(username)) {                           //
      throw new Meteor.Error('error-invalid-arguments', 'Invalid arguments', {                                // 7
        method: 'authorization:addUserToRole'                                                                 //
      });                                                                                                     //
    }                                                                                                         //
    if (roleName === 'admin' && !RocketChat.authz.hasPermission(Meteor.userId(), 'assign-admin-role')) {      //
      throw new Meteor.Error('error-action-not-allowed', 'Assigning admin is not allowed', {                  // 10
        method: 'insertOrUpdateUser',                                                                         //
        action: 'Assign_admin'                                                                                //
      });                                                                                                     //
    }                                                                                                         //
    user = RocketChat.models.Users.findOneByUsername(username, {                                              //
      fields: {                                                                                               //
        _id: 1                                                                                                //
      }                                                                                                       //
    });                                                                                                       //
    if ((user != null ? user._id : void 0) == null) {                                                         //
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                          // 15
        method: 'authorization:addUserToRole'                                                                 //
      });                                                                                                     //
    }                                                                                                         //
    add = RocketChat.models.Roles.addUserRoles(user._id, roleName, scope);                                    //
    if (RocketChat.settings.get('UI_DisplayRoles')) {                                                         //
      RocketChat.Notifications.notifyAll('roles-change', {                                                    //
        type: 'added',                                                                                        //
        _id: roleName,                                                                                        //
        u: {                                                                                                  //
          _id: user._id,                                                                                      //
          username: username                                                                                  //
        },                                                                                                    //
        scope: scope                                                                                          //
      });                                                                                                     //
    }                                                                                                         //
    return add;                                                                                               // 22
  }                                                                                                           //
});                                                                                                           //
                                                                                                              //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"deleteRole.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/rocketchat_authorization/server/methods/deleteRole.coffee.js                                      //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                              // 1
  'authorization:deleteRole': function(roleName) {                                                            //
    var existingUsers, ref, role, roleScope;                                                                  // 3
    if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'access-permissions')) {         //
      throw new Meteor.Error('error-action-not-allowed', 'Accessing permissions is not allowed', {            // 4
        method: 'authorization:deleteRole',                                                                   //
        action: 'Accessing_permissions'                                                                       //
      });                                                                                                     //
    }                                                                                                         //
    role = RocketChat.models.Roles.findOne(roleName);                                                         //
    if (role == null) {                                                                                       //
      throw new Meteor.Error('error-invalid-role', 'Invalid role', {                                          // 8
        method: 'authorization:deleteRole'                                                                    //
      });                                                                                                     //
    }                                                                                                         //
    if (role["protected"]) {                                                                                  //
      throw new Meteor.Error('error-delete-protected-role', 'Cannot delete a protected role', {               // 11
        method: 'authorization:deleteRole'                                                                    //
      });                                                                                                     //
    }                                                                                                         //
    roleScope = role.scope || 'Users';                                                                        //
    existingUsers = (ref = RocketChat.models[roleScope]) != null ? typeof ref.findUsersInRoles === "function" ? ref.findUsersInRoles(roleName) : void 0 : void 0;
    if ((existingUsers != null ? existingUsers.count() : void 0) > 0) {                                       //
      throw new Meteor.Error('error-role-in-use', 'Cannot delete role because it\'s in use', {                // 17
        method: 'authorization:deleteRole'                                                                    //
      });                                                                                                     //
    }                                                                                                         //
    return RocketChat.models.Roles.remove(role.name);                                                         // 19
  }                                                                                                           //
});                                                                                                           //
                                                                                                              //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"removeUserFromRole.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/rocketchat_authorization/server/methods/removeUserFromRole.coffee.js                              //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                              // 1
  'authorization:removeUserFromRole': function(roleName, username, scope) {                                   //
    var adminCount, remove, user, userIsAdmin;                                                                // 3
    if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'access-permissions')) {         //
      throw new Meteor.Error("error-action-not-allowed", 'Access permissions is not allowed', {               // 4
        method: 'authorization:removeUserFromRole',                                                           //
        action: 'Accessing_permissions'                                                                       //
      });                                                                                                     //
    }                                                                                                         //
    if (!roleName || !_.isString(roleName) || !username || !_.isString(username)) {                           //
      throw new Meteor.Error('error-invalid-arguments', 'Invalid arguments', {                                // 7
        method: 'authorization:removeUserFromRole'                                                            //
      });                                                                                                     //
    }                                                                                                         //
    user = Meteor.users.findOne({                                                                             //
      username: username                                                                                      //
    }, {                                                                                                      //
      fields: {                                                                                               //
        _id: 1,                                                                                               //
        roles: 1                                                                                              //
      }                                                                                                       //
    });                                                                                                       //
    if ((user != null ? user._id : void 0) == null) {                                                         //
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                          // 12
        method: 'authorization:removeUserFromRole'                                                            //
      });                                                                                                     //
    }                                                                                                         //
    if (roleName === 'admin') {                                                                               //
      adminCount = Meteor.users.find({                                                                        //
        roles: {                                                                                              //
          $in: ['admin']                                                                                      //
        }                                                                                                     //
      }).count();                                                                                             //
      userIsAdmin = user.roles.indexOf('admin') > -1;                                                         //
      if (adminCount === 1 && userIsAdmin) {                                                                  //
        throw new Meteor.Error('error-action-not-allowed', 'Leaving the app without admins is not allowed', {
          method: 'removeUserFromRole',                                                                       //
          action: 'Remove_last_admin'                                                                         //
        });                                                                                                   //
      }                                                                                                       //
    }                                                                                                         //
    remove = RocketChat.models.Roles.removeUserRoles(user._id, roleName, scope);                              //
    if (RocketChat.settings.get('UI_DisplayRoles')) {                                                         //
      RocketChat.Notifications.notifyAll('roles-change', {                                                    //
        type: 'removed',                                                                                      //
        _id: roleName,                                                                                        //
        u: {                                                                                                  //
          _id: user._id,                                                                                      //
          username: username                                                                                  //
        },                                                                                                    //
        scope: scope                                                                                          //
      });                                                                                                     //
    }                                                                                                         //
    return remove;                                                                                            // 26
  }                                                                                                           //
});                                                                                                           //
                                                                                                              //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"saveRole.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/rocketchat_authorization/server/methods/saveRole.coffee.js                                        //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                              // 1
  'authorization:saveRole': function(roleData) {                                                              //
    var ref, update;                                                                                          // 3
    if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'access-permissions')) {         //
      throw new Meteor.Error("error-action-not-allowed", 'Accessing permissions is not allowed', {            // 4
        method: 'authorization:saveRole',                                                                     //
        action: 'Accessing_permissions'                                                                       //
      });                                                                                                     //
    }                                                                                                         //
    if (roleData.name == null) {                                                                              //
      throw new Meteor.Error('error-role-name-required', 'Role name is required', {                           // 7
        method: 'authorization:saveRole'                                                                      //
      });                                                                                                     //
    }                                                                                                         //
    if ((ref = roleData.scope) !== 'Users' && ref !== 'Subscriptions') {                                      //
      roleData.scope = 'Users';                                                                               //
    }                                                                                                         //
    update = RocketChat.models.Roles.createOrUpdate(roleData.name, roleData.scope, roleData.description);     //
    if (RocketChat.settings.get('UI_DisplayRoles')) {                                                         //
      RocketChat.Notifications.notifyAll('roles-change', {                                                    //
        type: 'changed',                                                                                      //
        _id: roleData.name                                                                                    //
      });                                                                                                     //
    }                                                                                                         //
    return update;                                                                                            // 17
  }                                                                                                           //
});                                                                                                           //
                                                                                                              //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"addPermissionToRole.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/rocketchat_authorization/server/methods/addPermissionToRole.coffee.js                             //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                              // 1
  'authorization:addPermissionToRole': function(permission, role) {                                           //
    if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'access-permissions')) {         //
      throw new Meteor.Error('error-action-not-allowed', 'Adding permission is not allowed', {                // 4
        method: 'authorization:addPermissionToRole',                                                          //
        action: 'Adding_permission'                                                                           //
      });                                                                                                     //
    }                                                                                                         //
    return RocketChat.models.Permissions.addRole(permission, role);                                           //
  }                                                                                                           //
});                                                                                                           //
                                                                                                              //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"removeRoleFromPermission.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/rocketchat_authorization/server/methods/removeRoleFromPermission.coffee.js                        //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                              // 1
  'authorization:removeRoleFromPermission': function(permission, role) {                                      //
    if (!Meteor.userId() || !RocketChat.authz.hasPermission(Meteor.userId(), 'access-permissions')) {         //
      throw new Meteor.Error("error-action-not-allowed", "Accessing permissions is not allowed", {            // 4
        method: 'authorization:removeRoleFromPermission',                                                     //
        action: 'Accessing_permissions'                                                                       //
      });                                                                                                     //
    }                                                                                                         //
    return RocketChat.models.Permissions.removeRole(permission, role);                                        //
  }                                                                                                           //
});                                                                                                           //
                                                                                                              //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"startup.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/rocketchat_authorization/server/startup.coffee.js                                                 //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function () {                                                                                  //
  var defaultRoles, i, j, len, len1, permission, permissions, results, role;                                  //
  permissions = [{                                                                                            //
    _id: 'access-permissions',                                                                                //
    roles: ['admin']                                                                                          //
  }, {                                                                                                        //
    _id: 'add-oauth-service',                                                                                 //
    roles: ['admin']                                                                                          //
  }, {                                                                                                        //
    _id: 'add-user-to-room',                                                                                  //
    roles: ['admin', 'owner', 'moderator']                                                                    //
  }, {                                                                                                        //
    _id: 'archive-room',                                                                                      //
    roles: ['admin', 'owner']                                                                                 //
  }, {                                                                                                        //
    _id: 'assign-admin-role',                                                                                 //
    roles: ['admin']                                                                                          //
  }, {                                                                                                        //
    _id: 'ban-user',                                                                                          //
    roles: ['admin', 'owner', 'moderator']                                                                    //
  }, {                                                                                                        //
    _id: 'bulk-create-c',                                                                                     //
    roles: ['admin']                                                                                          //
  }, {                                                                                                        //
    _id: 'bulk-register-user',                                                                                //
    roles: ['admin']                                                                                          //
  }, {                                                                                                        //
    _id: 'create-c',                                                                                          //
    roles: ['admin', 'user']                                                                                  //
  }, {                                                                                                        //
    _id: 'create-d',                                                                                          //
    roles: ['admin', 'user']                                                                                  //
  }, {                                                                                                        //
    _id: 'create-p',                                                                                          //
    roles: ['admin', 'user']                                                                                  //
  }, {                                                                                                        //
    _id: 'create-user',                                                                                       //
    roles: ['admin']                                                                                          //
  }, {                                                                                                        //
    _id: 'delete-c',                                                                                          //
    roles: ['admin']                                                                                          //
  }, {                                                                                                        //
    _id: 'delete-d',                                                                                          //
    roles: ['admin']                                                                                          //
  }, {                                                                                                        //
    _id: 'delete-message',                                                                                    //
    roles: ['admin', 'owner', 'moderator']                                                                    //
  }, {                                                                                                        //
    _id: 'delete-p',                                                                                          //
    roles: ['admin']                                                                                          //
  }, {                                                                                                        //
    _id: 'delete-user',                                                                                       //
    roles: ['admin']                                                                                          //
  }, {                                                                                                        //
    _id: 'edit-message',                                                                                      //
    roles: ['admin', 'owner', 'moderator']                                                                    //
  }, {                                                                                                        //
    _id: 'edit-other-user-active-status',                                                                     //
    roles: ['admin']                                                                                          //
  }, {                                                                                                        //
    _id: 'edit-other-user-info',                                                                              //
    roles: ['admin']                                                                                          //
  }, {                                                                                                        //
    _id: 'edit-other-user-password',                                                                          //
    roles: ['admin']                                                                                          //
  }, {                                                                                                        //
    _id: 'edit-privileged-setting',                                                                           //
    roles: ['admin']                                                                                          //
  }, {                                                                                                        //
    _id: 'edit-room',                                                                                         //
    roles: ['admin', 'owner', 'moderator']                                                                    //
  }, {                                                                                                        //
    _id: 'manage-assets',                                                                                     //
    roles: ['admin']                                                                                          //
  }, {                                                                                                        //
    _id: 'manage-emoji',                                                                                      //
    roles: ['admin']                                                                                          //
  }, {                                                                                                        //
    _id: 'manage-integrations',                                                                               //
    roles: ['admin']                                                                                          //
  }, {                                                                                                        //
    _id: 'manage-own-integrations',                                                                           //
    roles: ['admin', 'bot']                                                                                   //
  }, {                                                                                                        //
    _id: 'manage-oauth-apps',                                                                                 //
    roles: ['admin']                                                                                          //
  }, {                                                                                                        //
    _id: 'mention-all',                                                                                       //
    roles: ['admin', 'owner', 'moderator', 'user']                                                            //
  }, {                                                                                                        //
    _id: 'mute-user',                                                                                         //
    roles: ['admin', 'owner', 'moderator']                                                                    //
  }, {                                                                                                        //
    _id: 'remove-user',                                                                                       //
    roles: ['admin', 'owner', 'moderator']                                                                    //
  }, {                                                                                                        //
    _id: 'run-import',                                                                                        //
    roles: ['admin']                                                                                          //
  }, {                                                                                                        //
    _id: 'run-migration',                                                                                     //
    roles: ['admin']                                                                                          //
  }, {                                                                                                        //
    _id: 'set-moderator',                                                                                     //
    roles: ['admin', 'owner']                                                                                 //
  }, {                                                                                                        //
    _id: 'set-owner',                                                                                         //
    roles: ['admin', 'owner']                                                                                 //
  }, {                                                                                                        //
    _id: 'unarchive-room',                                                                                    //
    roles: ['admin']                                                                                          //
  }, {                                                                                                        //
    _id: 'view-c-room',                                                                                       //
    roles: ['admin', 'user', 'bot']                                                                           //
  }, {                                                                                                        //
    _id: 'view-d-room',                                                                                       //
    roles: ['admin', 'user', 'bot']                                                                           //
  }, {                                                                                                        //
    _id: 'view-full-other-user-info',                                                                         //
    roles: ['admin']                                                                                          //
  }, {                                                                                                        //
    _id: 'view-history',                                                                                      //
    roles: ['admin', 'user']                                                                                  //
  }, {                                                                                                        //
    _id: 'view-joined-room',                                                                                  //
    roles: ['guest', 'bot']                                                                                   //
  }, {                                                                                                        //
    _id: 'view-join-code',                                                                                    //
    roles: ['admin']                                                                                          //
  }, {                                                                                                        //
    _id: 'view-logs',                                                                                         //
    roles: ['admin']                                                                                          //
  }, {                                                                                                        //
    _id: 'view-other-user-channels',                                                                          //
    roles: ['admin']                                                                                          //
  }, {                                                                                                        //
    _id: 'view-p-room',                                                                                       //
    roles: ['admin', 'user']                                                                                  //
  }, {                                                                                                        //
    _id: 'view-privileged-setting',                                                                           //
    roles: ['admin']                                                                                          //
  }, {                                                                                                        //
    _id: 'view-room-administration',                                                                          //
    roles: ['admin']                                                                                          //
  }, {                                                                                                        //
    _id: 'view-statistics',                                                                                   //
    roles: ['admin']                                                                                          //
  }, {                                                                                                        //
    _id: 'view-user-administration',                                                                          //
    roles: ['admin']                                                                                          //
  }, {                                                                                                        //
    _id: 'preview-c-room',                                                                                    //
    roles: ['admin', 'user']                                                                                  //
  }];                                                                                                         //
  for (i = 0, len = permissions.length; i < len; i++) {                                                       //
    permission = permissions[i];                                                                              //
    if (RocketChat.models.Permissions.findOneById(permission._id) == null) {                                  //
      RocketChat.models.Permissions.upsert(permission._id, {                                                  //
        $set: permission                                                                                      //
      });                                                                                                     //
    }                                                                                                         //
  }                                                                                                           //
  defaultRoles = [{                                                                                           //
    name: 'admin',                                                                                            //
    scope: 'Users',                                                                                           //
    description: 'Admin'                                                                                      //
  }, {                                                                                                        //
    name: 'moderator',                                                                                        //
    scope: 'Subscriptions',                                                                                   //
    description: 'Moderator'                                                                                  //
  }, {                                                                                                        //
    name: 'owner',                                                                                            //
    scope: 'Subscriptions',                                                                                   //
    description: 'Owner'                                                                                      //
  }, {                                                                                                        //
    name: 'user',                                                                                             //
    scope: 'Users',                                                                                           //
    description: ''                                                                                           //
  }, {                                                                                                        //
    name: 'bot',                                                                                              //
    scope: 'Users',                                                                                           //
    description: ''                                                                                           //
  }, {                                                                                                        //
    name: 'guest',                                                                                            //
    scope: 'Users',                                                                                           //
    description: ''                                                                                           //
  }];                                                                                                         //
  results = [];                                                                                               //
  for (j = 0, len1 = defaultRoles.length; j < len1; j++) {                                                    //
    role = defaultRoles[j];                                                                                   //
    results.push(RocketChat.models.Roles.upsert({                                                             //
      _id: role.name                                                                                          //
    }, {                                                                                                      //
      $setOnInsert: {                                                                                         //
        scope: role.scope,                                                                                    //
        description: role.description || '',                                                                  //
        "protected": true                                                                                     //
      }                                                                                                       //
    }));                                                                                                      //
  }                                                                                                           //
  return results;                                                                                             //
});                                                                                                           //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{"extensions":[".js",".json",".coffee"]});
require("./node_modules/meteor/rocketchat:authorization/lib/rocketchat.coffee.js");
require("./node_modules/meteor/rocketchat:authorization/server/models/Permissions.coffee.js");
require("./node_modules/meteor/rocketchat:authorization/server/models/Roles.coffee.js");
require("./node_modules/meteor/rocketchat:authorization/server/models/Base.js");
require("./node_modules/meteor/rocketchat:authorization/server/models/Users.js");
require("./node_modules/meteor/rocketchat:authorization/server/models/Subscriptions.js");
require("./node_modules/meteor/rocketchat:authorization/server/functions/addUserRoles.coffee.js");
require("./node_modules/meteor/rocketchat:authorization/server/functions/canAccessRoom.js");
require("./node_modules/meteor/rocketchat:authorization/server/functions/getRoles.coffee.js");
require("./node_modules/meteor/rocketchat:authorization/server/functions/getUsersInRole.coffee.js");
require("./node_modules/meteor/rocketchat:authorization/server/functions/hasPermission.coffee.js");
require("./node_modules/meteor/rocketchat:authorization/server/functions/hasRole.coffee.js");
require("./node_modules/meteor/rocketchat:authorization/server/functions/removeUserFromRoles.coffee.js");
require("./node_modules/meteor/rocketchat:authorization/server/publications/permissions.js");
require("./node_modules/meteor/rocketchat:authorization/server/publications/roles.coffee.js");
require("./node_modules/meteor/rocketchat:authorization/server/publications/usersInRole.coffee.js");
require("./node_modules/meteor/rocketchat:authorization/server/methods/addUserToRole.coffee.js");
require("./node_modules/meteor/rocketchat:authorization/server/methods/deleteRole.coffee.js");
require("./node_modules/meteor/rocketchat:authorization/server/methods/removeUserFromRole.coffee.js");
require("./node_modules/meteor/rocketchat:authorization/server/methods/saveRole.coffee.js");
require("./node_modules/meteor/rocketchat:authorization/server/methods/addPermissionToRole.coffee.js");
require("./node_modules/meteor/rocketchat:authorization/server/methods/removeRoleFromPermission.coffee.js");
require("./node_modules/meteor/rocketchat:authorization/server/startup.coffee.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:authorization'] = {};

})();

//# sourceMappingURL=rocketchat_authorization.js.map
