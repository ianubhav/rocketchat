(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var LDAPJS = Package['rocketchat:ldapjs'].LDAPJS;
var Logger = Package['rocketchat:logger'].Logger;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var slugify = Package['yasaricli:slugify'].slugify;
var ECMAScript = Package.ecmascript.ECMAScript;
var SHA256 = Package.sha.SHA256;
var Accounts = Package['accounts-base'].Accounts;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var meteorInstall = Package.modules.meteorInstall;
var Buffer = Package.modules.Buffer;
var process = Package.modules.process;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var LDAP, slug, getLdapUsername, getLdapUserUniqueID, getDataToSyncUserData, syncUserData, addLdapUser, sync;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:ldap":{"server":{"ldap.js":["babel-runtime/helpers/classCallCheck",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_ldap/server/ldap.js                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck;module.import('babel-runtime/helpers/classCallCheck',{"default":function(v){_classCallCheck=v}});  //
/* globals LDAP:true, LDAPJS */                                                                                        // 1
/* exported LDAP */                                                                                                    // 2
                                                                                                                       //
var ldapjs = LDAPJS;                                                                                                   // 4
                                                                                                                       //
var logger = new Logger('LDAP', {                                                                                      // 6
	sections: {                                                                                                           // 7
		connection: 'Connection',                                                                                            // 8
		bind: 'Bind',                                                                                                        // 9
		search: 'Search',                                                                                                    // 10
		auth: 'Auth'                                                                                                         // 11
	}                                                                                                                     // 7
});                                                                                                                    // 6
                                                                                                                       //
LDAP = function () {                                                                                                   // 15
	function LDAP() {                                                                                                     // 16
		_classCallCheck(this, LDAP);                                                                                         // 16
                                                                                                                       //
		var self = this;                                                                                                     // 17
                                                                                                                       //
		self.ldapjs = ldapjs;                                                                                                // 19
                                                                                                                       //
		self.connected = false;                                                                                              // 21
                                                                                                                       //
		self.options = {                                                                                                     // 23
			host: RocketChat.settings.get('LDAP_Host'),                                                                         // 24
			port: RocketChat.settings.get('LDAP_Port'),                                                                         // 25
			connect_timeout: RocketChat.settings.get('LDAP_Connect_Timeout'),                                                   // 26
			idle_timeout: RocketChat.settings.get('LDAP_Idle_Timeout'),                                                         // 27
			encryption: RocketChat.settings.get('LDAP_Encryption'),                                                             // 28
			ca_cert: RocketChat.settings.get('LDAP_CA_Cert'),                                                                   // 29
			reject_unauthorized: RocketChat.settings.get('LDAP_Reject_Unauthorized') || false,                                  // 30
			domain_base: RocketChat.settings.get('LDAP_Domain_Base'),                                                           // 31
			use_custom_domain_search: RocketChat.settings.get('LDAP_Use_Custom_Domain_Search'),                                 // 32
			custom_domain_search: RocketChat.settings.get('LDAP_Custom_Domain_Search'),                                         // 33
			domain_search_user: RocketChat.settings.get('LDAP_Domain_Search_User'),                                             // 34
			domain_search_password: RocketChat.settings.get('LDAP_Domain_Search_Password'),                                     // 35
			domain_search_filter: RocketChat.settings.get('LDAP_Domain_Search_Filter'),                                         // 36
			domain_search_user_id: RocketChat.settings.get('LDAP_Domain_Search_User_ID'),                                       // 37
			domain_search_object_class: RocketChat.settings.get('LDAP_Domain_Search_Object_Class'),                             // 38
			domain_search_object_category: RocketChat.settings.get('LDAP_Domain_Search_Object_Category')                        // 39
		};                                                                                                                   // 23
                                                                                                                       //
		self.connectSync = Meteor.wrapAsync(self.connectAsync, self);                                                        // 42
		self.searchAllSync = Meteor.wrapAsync(self.searchAllAsync, self);                                                    // 43
	}                                                                                                                     // 44
                                                                                                                       //
	LDAP.prototype.connectAsync = function () {                                                                           // 15
		function connectAsync(callback) {                                                                                    // 15
			var self = this;                                                                                                    // 47
                                                                                                                       //
			logger.connection.info('Init setup');                                                                               // 49
                                                                                                                       //
			var replied = false;                                                                                                // 51
                                                                                                                       //
			var connectionOptions = {                                                                                           // 53
				url: self.options.host + ':' + self.options.port,                                                                  // 54
				timeout: 1000 * 60 * 10,                                                                                           // 55
				connectTimeout: self.options.connect_timeout,                                                                      // 56
				idleTimeout: self.options.idle_timeout,                                                                            // 57
				reconnect: false                                                                                                   // 58
			};                                                                                                                  // 53
                                                                                                                       //
			var tlsOptions = {                                                                                                  // 61
				rejectUnauthorized: self.options.reject_unauthorized                                                               // 62
			};                                                                                                                  // 61
                                                                                                                       //
			if (self.options.ca_cert && self.options.ca_cert !== '') {                                                          // 65
				// Split CA cert into array of strings                                                                             // 66
				var chainLines = RocketChat.settings.get('LDAP_CA_Cert').split('\n');                                              // 67
				var cert = [];                                                                                                     // 68
				var ca = [];                                                                                                       // 69
				chainLines.forEach(function (line) {                                                                               // 70
					cert.push(line);                                                                                                  // 71
					if (line.match(/-END CERTIFICATE-/)) {                                                                            // 72
						ca.push(cert.join('\n'));                                                                                        // 73
						cert = [];                                                                                                       // 74
					}                                                                                                                 // 75
				});                                                                                                                // 76
				tlsOptions.ca = ca;                                                                                                // 77
			}                                                                                                                   // 78
                                                                                                                       //
			if (self.options.encryption === 'ssl') {                                                                            // 80
				connectionOptions.url = 'ldaps://' + connectionOptions.url;                                                        // 81
				connectionOptions.tlsOptions = tlsOptions;                                                                         // 82
			} else {                                                                                                            // 83
				connectionOptions.url = 'ldap://' + connectionOptions.url;                                                         // 84
			}                                                                                                                   // 85
                                                                                                                       //
			logger.connection.info('Connecting', connectionOptions.url);                                                        // 87
			logger.connection.debug('connectionOptions', connectionOptions);                                                    // 88
                                                                                                                       //
			self.client = ldapjs.createClient(connectionOptions);                                                               // 90
                                                                                                                       //
			self.bindSync = Meteor.wrapAsync(self.client.bind, self.client);                                                    // 92
                                                                                                                       //
			self.client.on('error', function (error) {                                                                          // 94
				logger.connection.error('connection', error);                                                                      // 95
				if (replied === false) {                                                                                           // 96
					replied = true;                                                                                                   // 97
					callback(error, null);                                                                                            // 98
				}                                                                                                                  // 99
			});                                                                                                                 // 100
                                                                                                                       //
			if (self.options.encryption === 'tls') {                                                                            // 102
                                                                                                                       //
				// Set host parameter for tls.connect which is used by ldapjs starttls. This shouldn't be needed in newer nodejs versions (e.g v5.6.0).
				// https://github.com/RocketChat/Rocket.Chat/issues/2035                                                           // 105
				// https://github.com/mcavage/node-ldapjs/issues/349                                                               // 106
				tlsOptions.host = [self.options.host];                                                                             // 107
                                                                                                                       //
				logger.connection.info('Starting TLS');                                                                            // 109
				logger.connection.debug('tlsOptions', tlsOptions);                                                                 // 110
                                                                                                                       //
				self.client.starttls(tlsOptions, null, function (error, response) {                                                // 112
					if (error) {                                                                                                      // 113
						logger.connection.error('TLS connection', error);                                                                // 114
						if (replied === false) {                                                                                         // 115
							replied = true;                                                                                                 // 116
							callback(error, null);                                                                                          // 117
						}                                                                                                                // 118
						return;                                                                                                          // 119
					}                                                                                                                 // 120
                                                                                                                       //
					logger.connection.info('TLS connected');                                                                          // 122
					self.connected = true;                                                                                            // 123
					if (replied === false) {                                                                                          // 124
						replied = true;                                                                                                  // 125
						callback(null, response);                                                                                        // 126
					}                                                                                                                 // 127
				});                                                                                                                // 128
			} else {                                                                                                            // 129
				self.client.on('connect', function (response) {                                                                    // 130
					logger.connection.info('LDAP connected');                                                                         // 131
					self.connected = true;                                                                                            // 132
					if (replied === false) {                                                                                          // 133
						replied = true;                                                                                                  // 134
						callback(null, response);                                                                                        // 135
					}                                                                                                                 // 136
				});                                                                                                                // 137
			}                                                                                                                   // 138
                                                                                                                       //
			setTimeout(function () {                                                                                            // 140
				if (replied === false) {                                                                                           // 141
					logger.connection.error('connection time out', connectionOptions.timeout);                                        // 142
					replied = true;                                                                                                   // 143
					callback(new Error('Timeout'));                                                                                   // 144
				}                                                                                                                  // 145
			}, connectionOptions.timeout);                                                                                      // 146
		}                                                                                                                    // 147
                                                                                                                       //
		return connectAsync;                                                                                                 // 15
	}();                                                                                                                  // 15
                                                                                                                       //
	LDAP.prototype.getDomainBindSearch = function () {                                                                    // 15
		function getDomainBindSearch() {                                                                                     // 15
			var self = this;                                                                                                    // 150
                                                                                                                       //
			if (self.options.use_custom_domain_search === true) {                                                               // 152
				var custom_domain_search = void 0;                                                                                 // 153
				try {                                                                                                              // 154
					custom_domain_search = JSON.parse(self.options.custom_domain_search);                                             // 155
				} catch (error) {                                                                                                  // 156
					throw new Error('Invalid Custom Domain Search JSON');                                                             // 157
				}                                                                                                                  // 158
                                                                                                                       //
				return {                                                                                                           // 160
					filter: custom_domain_search.filter,                                                                              // 161
					domain_search_user: custom_domain_search.userDN || '',                                                            // 162
					domain_search_password: custom_domain_search.password || ''                                                       // 163
				};                                                                                                                 // 160
			}                                                                                                                   // 165
                                                                                                                       //
			var filter = ['(&'];                                                                                                // 167
                                                                                                                       //
			if (self.options.domain_search_object_category !== '') {                                                            // 169
				filter.push('(objectCategory=' + self.options.domain_search_object_category + ')');                                // 170
			}                                                                                                                   // 171
                                                                                                                       //
			if (self.options.domain_search_object_class !== '') {                                                               // 173
				filter.push('(objectclass=' + self.options.domain_search_object_class + ')');                                      // 174
			}                                                                                                                   // 175
                                                                                                                       //
			if (self.options.domain_search_filter !== '') {                                                                     // 177
				filter.push('(' + self.options.domain_search_filter + ')');                                                        // 178
			}                                                                                                                   // 179
                                                                                                                       //
			var domain_search_user_id = self.options.domain_search_user_id.split(',');                                          // 181
			if (domain_search_user_id.length === 1) {                                                                           // 182
				filter.push('(' + domain_search_user_id[0] + '=#{username})');                                                     // 183
			} else {                                                                                                            // 184
				filter.push('(|');                                                                                                 // 185
				domain_search_user_id.forEach(function (item) {                                                                    // 186
					filter.push('(' + item + '=#{username})');                                                                        // 187
				});                                                                                                                // 188
				filter.push(')');                                                                                                  // 189
			}                                                                                                                   // 190
                                                                                                                       //
			filter.push(')');                                                                                                   // 192
                                                                                                                       //
			return {                                                                                                            // 194
				filter: filter.join(''),                                                                                           // 195
				domain_search_user: self.options.domain_search_user || '',                                                         // 196
				domain_search_password: self.options.domain_search_password || ''                                                  // 197
			};                                                                                                                  // 194
		}                                                                                                                    // 199
                                                                                                                       //
		return getDomainBindSearch;                                                                                          // 15
	}();                                                                                                                  // 15
                                                                                                                       //
	LDAP.prototype.bindIfNecessary = function () {                                                                        // 15
		function bindIfNecessary() {                                                                                         // 15
			var self = this;                                                                                                    // 202
                                                                                                                       //
			if (self.domainBinded === true) {                                                                                   // 204
				return;                                                                                                            // 205
			}                                                                                                                   // 206
                                                                                                                       //
			var domain_search = self.getDomainBindSearch();                                                                     // 208
                                                                                                                       //
			if (domain_search.domain_search_user !== '' && domain_search.domain_search_password !== '') {                       // 210
				logger.bind.info('Binding admin user', domain_search.domain_search_user);                                          // 211
				self.bindSync(domain_search.domain_search_user, domain_search.domain_search_password);                             // 212
				self.domainBinded = true;                                                                                          // 213
			}                                                                                                                   // 214
		}                                                                                                                    // 215
                                                                                                                       //
		return bindIfNecessary;                                                                                              // 15
	}();                                                                                                                  // 15
                                                                                                                       //
	LDAP.prototype.searchUsersSync = function () {                                                                        // 15
		function searchUsersSync(username) {                                                                                 // 15
			var self = this;                                                                                                    // 218
                                                                                                                       //
			self.bindIfNecessary();                                                                                             // 220
                                                                                                                       //
			var domain_search = self.getDomainBindSearch();                                                                     // 222
                                                                                                                       //
			var searchOptions = {                                                                                               // 224
				filter: domain_search.filter.replace(/#{username}/g, username),                                                    // 225
				scope: 'sub'                                                                                                       // 226
			};                                                                                                                  // 224
                                                                                                                       //
			logger.search.info('Searching user', username);                                                                     // 229
			logger.search.debug('searchOptions', searchOptions);                                                                // 230
			logger.search.debug('domain_base', self.options.domain_base);                                                       // 231
                                                                                                                       //
			return self.searchAllSync(self.options.domain_base, searchOptions);                                                 // 233
		}                                                                                                                    // 234
                                                                                                                       //
		return searchUsersSync;                                                                                              // 15
	}();                                                                                                                  // 15
                                                                                                                       //
	LDAP.prototype.getUserByIdSync = function () {                                                                        // 15
		function getUserByIdSync(id, attribute) {                                                                            // 15
			var self = this;                                                                                                    // 237
                                                                                                                       //
			self.bindIfNecessary();                                                                                             // 239
                                                                                                                       //
			var Unique_Identifier_Field = RocketChat.settings.get('LDAP_Unique_Identifier_Field').split(',');                   // 241
                                                                                                                       //
			var filter = void 0;                                                                                                // 243
                                                                                                                       //
			if (attribute) {                                                                                                    // 245
				filter = new self.ldapjs.filters.EqualityFilter({                                                                  // 246
					attribute: attribute,                                                                                             // 247
					value: new Buffer(id, 'hex')                                                                                      // 248
				});                                                                                                                // 246
			} else {                                                                                                            // 250
				(function () {                                                                                                     // 250
					var filters = [];                                                                                                 // 251
					Unique_Identifier_Field.forEach(function (item) {                                                                 // 252
						filters.push(new self.ldapjs.filters.EqualityFilter({                                                            // 253
							attribute: item,                                                                                                // 254
							value: new Buffer(id, 'hex')                                                                                    // 255
						}));                                                                                                             // 253
					});                                                                                                               // 257
                                                                                                                       //
					filter = new self.ldapjs.filters.OrFilter({ filters: filters });                                                  // 259
				})();                                                                                                              // 250
			}                                                                                                                   // 260
                                                                                                                       //
			var searchOptions = {                                                                                               // 262
				filter: filter,                                                                                                    // 263
				scope: 'sub'                                                                                                       // 264
			};                                                                                                                  // 262
                                                                                                                       //
			logger.search.info('Searching by id', id);                                                                          // 267
			logger.search.debug('search filter', searchOptions.filter.toString());                                              // 268
			logger.search.debug('domain_base', self.options.domain_base);                                                       // 269
                                                                                                                       //
			var result = self.searchAllSync(self.options.domain_base, searchOptions);                                           // 271
                                                                                                                       //
			if (!Array.isArray(result) || result.length === 0) {                                                                // 273
				return;                                                                                                            // 274
			}                                                                                                                   // 275
                                                                                                                       //
			if (result.length > 1) {                                                                                            // 277
				logger.search.error('Search by id', id, 'returned', result.length, 'records');                                     // 278
			}                                                                                                                   // 279
                                                                                                                       //
			return result[0];                                                                                                   // 281
		}                                                                                                                    // 282
                                                                                                                       //
		return getUserByIdSync;                                                                                              // 15
	}();                                                                                                                  // 15
                                                                                                                       //
	LDAP.prototype.getUserByUsernameSync = function () {                                                                  // 15
		function getUserByUsernameSync(username) {                                                                           // 15
			var self = this;                                                                                                    // 285
                                                                                                                       //
			self.bindIfNecessary();                                                                                             // 287
                                                                                                                       //
			var domain_search = self.getDomainBindSearch();                                                                     // 289
                                                                                                                       //
			var searchOptions = {                                                                                               // 291
				filter: domain_search.filter.replace(/#{username}/g, username),                                                    // 292
				scope: 'sub'                                                                                                       // 293
			};                                                                                                                  // 291
                                                                                                                       //
			logger.search.info('Searching user', username);                                                                     // 296
			logger.search.debug('searchOptions', searchOptions);                                                                // 297
			logger.search.debug('domain_base', self.options.domain_base);                                                       // 298
                                                                                                                       //
			var result = self.searchAllSync(self.options.domain_base, searchOptions);                                           // 300
                                                                                                                       //
			if (!Array.isArray(result) || result.length === 0) {                                                                // 302
				return;                                                                                                            // 303
			}                                                                                                                   // 304
                                                                                                                       //
			if (result.length > 1) {                                                                                            // 306
				logger.search.error('Search by username', username, 'returned', result.length, 'records');                         // 307
			}                                                                                                                   // 308
                                                                                                                       //
			return result[0];                                                                                                   // 310
		}                                                                                                                    // 311
                                                                                                                       //
		return getUserByUsernameSync;                                                                                        // 15
	}();                                                                                                                  // 15
                                                                                                                       //
	LDAP.prototype.searchAllAsync = function () {                                                                         // 15
		function searchAllAsync(domain_base, options, callback) {                                                            // 15
			var self = this;                                                                                                    // 314
                                                                                                                       //
			self.client.search(domain_base, options, function (error, res) {                                                    // 316
				if (error) {                                                                                                       // 317
					logger.search.error(error);                                                                                       // 318
					callback(error);                                                                                                  // 319
					return;                                                                                                           // 320
				}                                                                                                                  // 321
                                                                                                                       //
				res.on('error', function (error) {                                                                                 // 323
					logger.search.error(error);                                                                                       // 324
					callback(error);                                                                                                  // 325
					return;                                                                                                           // 326
				});                                                                                                                // 327
                                                                                                                       //
				var entries = [];                                                                                                  // 329
				var jsonEntries = [];                                                                                              // 330
                                                                                                                       //
				res.on('searchEntry', function (entry) {                                                                           // 332
					entries.push(entry);                                                                                              // 333
					jsonEntries.push(entry.json);                                                                                     // 334
				});                                                                                                                // 335
                                                                                                                       //
				res.on('end', function () /*result*/{                                                                              // 337
					logger.search.info('Search result count', entries.length);                                                        // 338
					logger.search.debug('Search result', JSON.stringify(jsonEntries, null, 2));                                       // 339
					callback(null, entries);                                                                                          // 340
				});                                                                                                                // 341
			});                                                                                                                 // 342
		}                                                                                                                    // 343
                                                                                                                       //
		return searchAllAsync;                                                                                               // 15
	}();                                                                                                                  // 15
                                                                                                                       //
	LDAP.prototype.authSync = function () {                                                                               // 15
		function authSync(dn, password) {                                                                                    // 15
			var self = this;                                                                                                    // 346
                                                                                                                       //
			logger.auth.info('Authenticating', dn);                                                                             // 348
                                                                                                                       //
			try {                                                                                                               // 350
				self.bindSync(dn, password);                                                                                       // 351
				logger.auth.info('Authenticated', dn);                                                                             // 352
				return true;                                                                                                       // 353
			} catch (error) {                                                                                                   // 354
				logger.auth.info('Not authenticated', dn);                                                                         // 355
				logger.auth.debug('error', error);                                                                                 // 356
				return false;                                                                                                      // 357
			}                                                                                                                   // 358
		}                                                                                                                    // 359
                                                                                                                       //
		return authSync;                                                                                                     // 15
	}();                                                                                                                  // 15
                                                                                                                       //
	LDAP.prototype.disconnect = function () {                                                                             // 15
		function disconnect() {                                                                                              // 15
			var self = this;                                                                                                    // 362
                                                                                                                       //
			self.connected = false;                                                                                             // 364
			logger.connection.info('Disconecting');                                                                             // 365
			self.client.unbind();                                                                                               // 366
		}                                                                                                                    // 367
                                                                                                                       //
		return disconnect;                                                                                                   // 15
	}();                                                                                                                  // 15
                                                                                                                       //
	return LDAP;                                                                                                          // 15
}();                                                                                                                   // 15
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"sync.js":["babel-runtime/helpers/typeof",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_ldap/server/sync.js                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _typeof;module.import('babel-runtime/helpers/typeof',{"default":function(v){_typeof=v}});                          //
/* globals slug:true, slugify, LDAP, getLdapUsername:true, getLdapUserUniqueID:true, getDataToSyncUserData:true, syncUserData:true, sync:true, addLdapUser:true  */
                                                                                                                       //
var logger = new Logger('LDAPSync', {});                                                                               // 3
                                                                                                                       //
slug = function () {                                                                                                   // 5
	function slug(text) {                                                                                                 // 5
		if (RocketChat.settings.get('UTF8_Names_Slugify') !== true) {                                                        // 6
			return text;                                                                                                        // 7
		}                                                                                                                    // 8
		text = slugify(text, '.');                                                                                           // 9
		return text.replace(/[^0-9a-z-_.]/g, '');                                                                            // 10
	}                                                                                                                     // 11
                                                                                                                       //
	return slug;                                                                                                          // 5
}();                                                                                                                   // 5
                                                                                                                       //
getLdapUsername = function () {                                                                                        // 14
	function getLdapUsername(ldapUser) {                                                                                  // 14
		var usernameField = RocketChat.settings.get('LDAP_Username_Field');                                                  // 15
                                                                                                                       //
		if (usernameField.indexOf('#{') > -1) {                                                                              // 17
			return usernameField.replace(/#{(.+?)}/g, function (match, field) {                                                 // 18
				return ldapUser.object[field];                                                                                     // 19
			});                                                                                                                 // 20
		}                                                                                                                    // 21
                                                                                                                       //
		return ldapUser.object[usernameField];                                                                               // 23
	}                                                                                                                     // 24
                                                                                                                       //
	return getLdapUsername;                                                                                               // 14
}();                                                                                                                   // 14
                                                                                                                       //
getLdapUserUniqueID = function () {                                                                                    // 27
	function getLdapUserUniqueID(ldapUser) {                                                                              // 27
		var Unique_Identifier_Field = RocketChat.settings.get('LDAP_Unique_Identifier_Field');                               // 28
                                                                                                                       //
		if (Unique_Identifier_Field !== '') {                                                                                // 30
			Unique_Identifier_Field = Unique_Identifier_Field.replace(/\s/g, '').split(',');                                    // 31
		} else {                                                                                                             // 32
			Unique_Identifier_Field = [];                                                                                       // 33
		}                                                                                                                    // 34
                                                                                                                       //
		var LDAP_Domain_Search_User_ID = RocketChat.settings.get('LDAP_Domain_Search_User_ID');                              // 36
                                                                                                                       //
		if (LDAP_Domain_Search_User_ID !== '') {                                                                             // 38
			LDAP_Domain_Search_User_ID = LDAP_Domain_Search_User_ID.replace(/\s/g, '').split(',');                              // 39
		} else {                                                                                                             // 40
			LDAP_Domain_Search_User_ID = [];                                                                                    // 41
		}                                                                                                                    // 42
                                                                                                                       //
		Unique_Identifier_Field = Unique_Identifier_Field.concat(LDAP_Domain_Search_User_ID);                                // 44
                                                                                                                       //
		if (Unique_Identifier_Field.length > 0) {                                                                            // 46
			Unique_Identifier_Field = Unique_Identifier_Field.find(function (field) {                                           // 47
				return !_.isEmpty(ldapUser.object[field]);                                                                         // 48
			});                                                                                                                 // 49
			if (Unique_Identifier_Field) {                                                                                      // 50
				Unique_Identifier_Field = {                                                                                        // 51
					attribute: Unique_Identifier_Field,                                                                               // 52
					value: ldapUser.raw[Unique_Identifier_Field].toString('hex')                                                      // 53
				};                                                                                                                 // 51
			}                                                                                                                   // 55
			return Unique_Identifier_Field;                                                                                     // 56
		}                                                                                                                    // 57
	}                                                                                                                     // 58
                                                                                                                       //
	return getLdapUserUniqueID;                                                                                           // 27
}();                                                                                                                   // 27
                                                                                                                       //
getDataToSyncUserData = function () {                                                                                  // 61
	function getDataToSyncUserData(ldapUser, user) {                                                                      // 61
		var syncUserData = RocketChat.settings.get('LDAP_Sync_User_Data');                                                   // 62
		var syncUserDataFieldMap = RocketChat.settings.get('LDAP_Sync_User_Data_FieldMap').trim();                           // 63
                                                                                                                       //
		if (syncUserData && syncUserDataFieldMap) {                                                                          // 65
			var _ret = function () {                                                                                            // 65
				var fieldMap = JSON.parse(syncUserDataFieldMap);                                                                   // 66
				var userData = {};                                                                                                 // 67
                                                                                                                       //
				var emailList = [];                                                                                                // 69
				_.map(fieldMap, function (userField, ldapField) {                                                                  // 70
					if (!ldapUser.object.hasOwnProperty(ldapField)) {                                                                 // 71
						return;                                                                                                          // 72
					}                                                                                                                 // 73
                                                                                                                       //
					switch (userField) {                                                                                              // 75
						case 'email':                                                                                                    // 76
							if (_.isObject(ldapUser.object[ldapField] === 'object')) {                                                      // 77
								_.map(ldapUser.object[ldapField], function (item) {                                                            // 78
									emailList.push({ address: item, verified: true });                                                            // 79
								});                                                                                                            // 80
							} else {                                                                                                        // 81
								emailList.push({ address: ldapUser.object[ldapField], verified: true });                                       // 82
							}                                                                                                               // 83
							break;                                                                                                          // 84
                                                                                                                       //
						case 'name':                                                                                                     // 86
							if (user.name !== ldapUser.object[ldapField]) {                                                                 // 87
								userData.name = ldapUser.object[ldapField];                                                                    // 88
							}                                                                                                               // 89
							break;                                                                                                          // 90
					}                                                                                                                 // 75
				});                                                                                                                // 92
                                                                                                                       //
				if (emailList.length > 0) {                                                                                        // 94
					if (JSON.stringify(user.emails) !== JSON.stringify(emailList)) {                                                  // 95
						userData.emails = emailList;                                                                                     // 96
					}                                                                                                                 // 97
				}                                                                                                                  // 98
                                                                                                                       //
				var uniqueId = getLdapUserUniqueID(ldapUser);                                                                      // 100
                                                                                                                       //
				if (uniqueId && (!user.services || !user.services.ldap || user.services.ldap.id !== uniqueId.value || user.services.ldap.idAttribute !== uniqueId.attribute)) {
					userData['services.ldap.id'] = uniqueId.value;                                                                    // 103
					userData['services.ldap.idAttribute'] = uniqueId.attribute;                                                       // 104
				}                                                                                                                  // 105
                                                                                                                       //
				if (user.ldap !== true) {                                                                                          // 107
					userData.ldap = true;                                                                                             // 108
				}                                                                                                                  // 109
                                                                                                                       //
				if (_.size(userData)) {                                                                                            // 111
					return {                                                                                                          // 112
						v: userData                                                                                                      // 112
					};                                                                                                                // 112
				}                                                                                                                  // 113
			}();                                                                                                                // 65
                                                                                                                       //
			if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;                        // 65
		}                                                                                                                    // 114
	}                                                                                                                     // 115
                                                                                                                       //
	return getDataToSyncUserData;                                                                                         // 61
}();                                                                                                                   // 61
                                                                                                                       //
syncUserData = function () {                                                                                           // 118
	function syncUserData(user, ldapUser) {                                                                               // 118
		logger.info('Syncing user data');                                                                                    // 119
		logger.debug('user', { 'email': user.email, '_id': user._id });                                                      // 120
		logger.debug('ldapUser', ldapUser);                                                                                  // 121
                                                                                                                       //
		var userData = getDataToSyncUserData(ldapUser, user);                                                                // 123
		if (user && user._id && userData) {                                                                                  // 124
			Meteor.users.update(user._id, { $set: userData });                                                                  // 125
			user = Meteor.users.findOne({ _id: user._id });                                                                     // 126
			logger.debug('setting', JSON.stringify(userData, null, 2));                                                         // 127
		}                                                                                                                    // 128
                                                                                                                       //
		if (RocketChat.settings.get('LDAP_Username_Field') !== '') {                                                         // 130
			var username = slug(getLdapUsername(ldapUser));                                                                     // 131
			if (user && user._id && username !== user.username) {                                                               // 132
				logger.info('Syncing user username', user.username, '->', username);                                               // 133
				RocketChat._setUsername(user._id, username);                                                                       // 134
			}                                                                                                                   // 135
		}                                                                                                                    // 136
                                                                                                                       //
		if (user && user._id && RocketChat.settings.get('LDAP_Sync_User_Avatar') === true) {                                 // 138
			var avatar = ldapUser.raw.thumbnailPhoto || ldapUser.raw.jpegPhoto;                                                 // 139
			if (avatar) {                                                                                                       // 140
				logger.info('Syncing user avatar');                                                                                // 141
				var rs = RocketChatFile.bufferToStream(avatar);                                                                    // 142
				RocketChatFileAvatarInstance.deleteFile(encodeURIComponent(user.username + '.jpg'));                               // 143
				var ws = RocketChatFileAvatarInstance.createWriteStream(encodeURIComponent(user.username + '.jpg'), 'image/jpeg');
				ws.on('end', Meteor.bindEnvironment(function () {                                                                  // 145
					Meteor.setTimeout(function () {                                                                                   // 146
						RocketChat.models.Users.setAvatarOrigin(user._id, 'ldap');                                                       // 147
						RocketChat.Notifications.notifyAll('updateAvatar', { username: user.username });                                 // 148
					}, 500);                                                                                                          // 149
				}));                                                                                                               // 150
				rs.pipe(ws);                                                                                                       // 151
			}                                                                                                                   // 152
		}                                                                                                                    // 153
	}                                                                                                                     // 154
                                                                                                                       //
	return syncUserData;                                                                                                  // 118
}();                                                                                                                   // 118
                                                                                                                       //
addLdapUser = function () {                                                                                            // 156
	function addLdapUser(ldapUser, username, password) {                                                                  // 156
		var userObject = {                                                                                                   // 157
			username: username                                                                                                  // 158
		};                                                                                                                   // 157
                                                                                                                       //
		var userData = getDataToSyncUserData(ldapUser, {});                                                                  // 161
                                                                                                                       //
		if (userData && userData.emails) {                                                                                   // 163
			userObject.email = userData.emails[0].address;                                                                      // 164
		} else if (ldapUser.object.mail && ldapUser.object.mail.indexOf('@') > -1) {                                         // 165
			userObject.email = ldapUser.object.mail;                                                                            // 166
		} else if (RocketChat.settings.get('LDAP_Default_Domain') !== '') {                                                  // 167
			userObject.email = username + '@' + RocketChat.settings.get('LDAP_Default_Domain');                                 // 168
		} else {                                                                                                             // 169
			var error = new Meteor.Error('LDAP-login-error', 'LDAP Authentication succeded, there is no email to create an account. Have you tried setting your Default Domain in LDAP Settings?');
			logger.error(error);                                                                                                // 171
			throw error;                                                                                                        // 172
		}                                                                                                                    // 173
                                                                                                                       //
		logger.debug('New user data', userObject);                                                                           // 175
                                                                                                                       //
		if (password) {                                                                                                      // 177
			userObject.password = password;                                                                                     // 178
		}                                                                                                                    // 179
                                                                                                                       //
		try {                                                                                                                // 181
			userObject._id = Accounts.createUser(userObject);                                                                   // 182
		} catch (error) {                                                                                                    // 183
			logger.error('Error creating user', error);                                                                         // 184
			throw error;                                                                                                        // 185
		}                                                                                                                    // 186
                                                                                                                       //
		syncUserData(userObject, ldapUser);                                                                                  // 188
                                                                                                                       //
		logger.info('Joining user to default channels');                                                                     // 190
		Meteor.runAsUser(userObject._id, function () {                                                                       // 191
			Meteor.call('joinDefaultChannels');                                                                                 // 192
		});                                                                                                                  // 193
                                                                                                                       //
		return {                                                                                                             // 195
			userId: userObject._id                                                                                              // 196
		};                                                                                                                   // 195
	}                                                                                                                     // 198
                                                                                                                       //
	return addLdapUser;                                                                                                   // 156
}();                                                                                                                   // 156
                                                                                                                       //
sync = function () {                                                                                                   // 200
	function sync() {                                                                                                     // 200
		if (RocketChat.settings.get('LDAP_Enable') !== true) {                                                               // 201
			return;                                                                                                             // 202
		}                                                                                                                    // 203
                                                                                                                       //
		var ldap = new LDAP();                                                                                               // 205
                                                                                                                       //
		try {                                                                                                                // 207
			ldap.connectSync();                                                                                                 // 208
                                                                                                                       //
			var users = RocketChat.models.Users.findLDAPUsers();                                                                // 210
                                                                                                                       //
			if (RocketChat.settings.get('LDAP_Import_Users') === true && RocketChat.settings.get('LDAP_Username_Field') !== '') {
				var ldapUsers = ldap.searchUsersSync('*');                                                                         // 213
				ldapUsers.forEach(function (ldapUser) {                                                                            // 214
					var username = slug(getLdapUsername(ldapUser));                                                                   // 215
					// Look to see if user already exists                                                                             // 216
					var userQuery = void 0;                                                                                           // 217
					var user = void 0;                                                                                                // 218
					userQuery = {                                                                                                     // 219
						username: username                                                                                               // 220
					};                                                                                                                // 219
                                                                                                                       //
					logger.debug('userQuery', userQuery);                                                                             // 223
                                                                                                                       //
					user = Meteor.users.findOne(userQuery);                                                                           // 225
                                                                                                                       //
					if (!user) {                                                                                                      // 227
						addLdapUser(ldapUser, username);                                                                                 // 228
					}                                                                                                                 // 229
				});                                                                                                                // 230
			}                                                                                                                   // 231
                                                                                                                       //
			users.forEach(function (user) {                                                                                     // 233
				var ldapUser = void 0;                                                                                             // 234
                                                                                                                       //
				if (user.services && user.services.ldap && user.services.ldap.id) {                                                // 236
					ldapUser = ldap.getUserByIdSync(user.services.ldap.id, user.services.ldap.idAttribute);                           // 237
				} else {                                                                                                           // 238
					ldapUser = ldap.getUserByUsernameSync(user.username);                                                             // 239
				}                                                                                                                  // 240
                                                                                                                       //
				if (ldapUser) {                                                                                                    // 242
					syncUserData(user, ldapUser);                                                                                     // 243
				} else {                                                                                                           // 244
					logger.info('Can\'t sync user', user.username);                                                                   // 245
				}                                                                                                                  // 246
			});                                                                                                                 // 247
		} catch (error) {                                                                                                    // 248
			logger.error(error);                                                                                                // 249
			return error;                                                                                                       // 250
		}                                                                                                                    // 251
                                                                                                                       //
		ldap.disconnect();                                                                                                   // 253
		return true;                                                                                                         // 254
	}                                                                                                                     // 255
                                                                                                                       //
	return sync;                                                                                                          // 200
}();                                                                                                                   // 200
                                                                                                                       //
var interval = void 0;                                                                                                 // 257
var timeout = void 0;                                                                                                  // 258
                                                                                                                       //
RocketChat.settings.get('LDAP_Sync_User_Data', function (key, value) {                                                 // 260
	Meteor.clearInterval(interval);                                                                                       // 261
	Meteor.clearTimeout(timeout);                                                                                         // 262
                                                                                                                       //
	if (value === true) {                                                                                                 // 264
		logger.info('Enabling LDAP user sync');                                                                              // 265
		interval = Meteor.setInterval(sync, 1000 * 60 * 60);                                                                 // 266
		timeout = Meteor.setTimeout(function () {                                                                            // 267
			sync();                                                                                                             // 268
		}, 1000 * 60 * 10);                                                                                                  // 269
	} else {                                                                                                              // 270
		logger.info('Disabling LDAP user sync');                                                                             // 271
	}                                                                                                                     // 272
});                                                                                                                    // 273
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"loginHandler.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_ldap/server/loginHandler.js                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals LDAP, slug, getLdapUsername, getLdapUserUniqueID, syncUserData, addLdapUser */                              // 1
/* eslint new-cap: [2, {"capIsNewExceptions": ["SHA256"]}] */                                                          // 2
                                                                                                                       //
var logger = new Logger('LDAPHandler', {});                                                                            // 4
                                                                                                                       //
function fallbackDefaultAccountSystem(bind, username, password) {                                                      // 6
	if (typeof username === 'string') {                                                                                   // 7
		if (username.indexOf('@') === -1) {                                                                                  // 8
			username = { username: username };                                                                                  // 9
		} else {                                                                                                             // 10
			username = { email: username };                                                                                     // 11
		}                                                                                                                    // 12
	}                                                                                                                     // 13
                                                                                                                       //
	logger.info('Fallback to default account systen', username);                                                          // 15
                                                                                                                       //
	var loginRequest = {                                                                                                  // 17
		user: username,                                                                                                      // 18
		password: {                                                                                                          // 19
			digest: SHA256(password),                                                                                           // 20
			algorithm: 'sha-256'                                                                                                // 21
		}                                                                                                                    // 19
	};                                                                                                                    // 17
                                                                                                                       //
	return Accounts._runLoginHandlers(bind, loginRequest);                                                                // 25
}                                                                                                                      // 26
                                                                                                                       //
Accounts.registerLoginHandler('ldap', function (loginRequest) {                                                        // 28
	if (!loginRequest.ldap || !loginRequest.ldapOptions) {                                                                // 29
		return undefined;                                                                                                    // 30
	}                                                                                                                     // 31
                                                                                                                       //
	logger.info('Init LDAP login', loginRequest.username);                                                                // 33
                                                                                                                       //
	if (RocketChat.settings.get('LDAP_Enable') !== true) {                                                                // 35
		return fallbackDefaultAccountSystem(this, loginRequest.username, loginRequest.ldapPass);                             // 36
	}                                                                                                                     // 37
                                                                                                                       //
	var self = this;                                                                                                      // 39
	var ldap = new LDAP();                                                                                                // 40
	var ldapUser = void 0;                                                                                                // 41
                                                                                                                       //
	try {                                                                                                                 // 43
		ldap.connectSync();                                                                                                  // 44
		var users = ldap.searchUsersSync(loginRequest.username);                                                             // 45
                                                                                                                       //
		if (users.length !== 1) {                                                                                            // 47
			logger.info('Search returned', users.length, 'record(s) for', loginRequest.username);                               // 48
			throw new Error('User not Found');                                                                                  // 49
		}                                                                                                                    // 50
                                                                                                                       //
		if (ldap.authSync(users[0].dn, loginRequest.ldapPass) === true) {                                                    // 52
			ldapUser = users[0];                                                                                                // 53
		} else {                                                                                                             // 54
			logger.info('Wrong password for', loginRequest.username);                                                           // 55
		}                                                                                                                    // 56
	} catch (error) {                                                                                                     // 57
		logger.error(error);                                                                                                 // 58
	}                                                                                                                     // 59
                                                                                                                       //
	ldap.disconnect();                                                                                                    // 61
                                                                                                                       //
	if (ldapUser === undefined) {                                                                                         // 63
		if (RocketChat.settings.get('LDAP_Login_Fallback') === true) {                                                       // 64
			return fallbackDefaultAccountSystem(self, loginRequest.username, loginRequest.ldapPass);                            // 65
		}                                                                                                                    // 66
                                                                                                                       //
		throw new Meteor.Error('LDAP-login-error', 'LDAP Authentication failed with provided username [' + loginRequest.username + ']');
	}                                                                                                                     // 69
                                                                                                                       //
	var username = void 0;                                                                                                // 71
                                                                                                                       //
	if (RocketChat.settings.get('LDAP_Username_Field') !== '') {                                                          // 73
		username = slug(getLdapUsername(ldapUser));                                                                          // 74
	} else {                                                                                                              // 75
		username = slug(loginRequest.username);                                                                              // 76
	}                                                                                                                     // 77
                                                                                                                       //
	// Look to see if user already exists                                                                                 // 79
	var userQuery = void 0;                                                                                               // 80
                                                                                                                       //
	var Unique_Identifier_Field = getLdapUserUniqueID(ldapUser);                                                          // 82
	var user = void 0;                                                                                                    // 83
                                                                                                                       //
	if (Unique_Identifier_Field) {                                                                                        // 85
		userQuery = {                                                                                                        // 86
			'services.ldap.id': Unique_Identifier_Field.value                                                                   // 87
		};                                                                                                                   // 86
                                                                                                                       //
		logger.info('Querying user');                                                                                        // 90
		logger.debug('userQuery', userQuery);                                                                                // 91
                                                                                                                       //
		user = Meteor.users.findOne(userQuery);                                                                              // 93
	}                                                                                                                     // 94
                                                                                                                       //
	if (!user) {                                                                                                          // 96
		userQuery = {                                                                                                        // 97
			username: username                                                                                                  // 98
		};                                                                                                                   // 97
                                                                                                                       //
		logger.debug('userQuery', userQuery);                                                                                // 101
                                                                                                                       //
		user = Meteor.users.findOne(userQuery);                                                                              // 103
	}                                                                                                                     // 104
                                                                                                                       //
	// Login user if they exist                                                                                           // 106
	if (user) {                                                                                                           // 107
		if (user.ldap !== true && RocketChat.settings.get('LDAP_Merge_Existing_Users') !== true) {                           // 108
			logger.info('User exists without "ldap: true"');                                                                    // 109
			throw new Meteor.Error('LDAP-login-error', 'LDAP Authentication succeded, but there\'s already an existing user with provided username [' + username + '] in Mongo.');
		}                                                                                                                    // 111
                                                                                                                       //
		logger.info('Logging user');                                                                                         // 113
                                                                                                                       //
		var stampedToken = Accounts._generateStampedLoginToken();                                                            // 115
                                                                                                                       //
		Meteor.users.update(user._id, {                                                                                      // 117
			$push: {                                                                                                            // 118
				'services.resume.loginTokens': Accounts._hashStampedToken(stampedToken)                                            // 119
			}                                                                                                                   // 118
		});                                                                                                                  // 117
                                                                                                                       //
		syncUserData(user, ldapUser);                                                                                        // 123
		Accounts.setPassword(user._id, loginRequest.ldapPass, { logout: false });                                            // 124
		return {                                                                                                             // 125
			userId: user._id,                                                                                                   // 126
			token: stampedToken.token                                                                                           // 127
		};                                                                                                                   // 125
	}                                                                                                                     // 129
                                                                                                                       //
	logger.info('User does not exist, creating', username);                                                               // 131
                                                                                                                       //
	// Create new user                                                                                                    // 133
	return addLdapUser(ldapUser, username, loginRequest.ldapPass);                                                        // 134
});                                                                                                                    // 135
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"settings.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_ldap/server/settings.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.startup(function () {                                                                                           // 1
	RocketChat.settings.addGroup('LDAP', function () {                                                                    // 2
		var enableQuery = { _id: 'LDAP_Enable', value: true };                                                               // 3
		var enableTLSQuery = [{ _id: 'LDAP_Enable', value: true }, { _id: 'LDAP_Encryption', value: { $in: ['tls', 'ssl'] } }];
		var customBindSearchEnabledQuery = [{ _id: 'LDAP_Enable', value: true }, { _id: 'LDAP_Use_Custom_Domain_Search', value: true }];
		var customBindSearchDisabledQuery = [{ _id: 'LDAP_Enable', value: true }, { _id: 'LDAP_Use_Custom_Domain_Search', value: false }];
		var syncDataQuery = [{ _id: 'LDAP_Enable', value: true }, { _id: 'LDAP_Sync_User_Data', value: true }];              // 16
                                                                                                                       //
		this.add('LDAP_Enable', false, { type: 'boolean', 'public': true });                                                 // 21
		this.add('LDAP_Login_Fallback', true, { type: 'boolean', enableQuery: enableQuery });                                // 22
		this.add('LDAP_Host', '', { type: 'string', enableQuery: enableQuery });                                             // 23
		this.add('LDAP_Port', '389', { type: 'string', enableQuery: enableQuery });                                          // 24
		this.add('LDAP_Connect_Timeout', 600000, { type: 'int', enableQuery: enableQuery });                                 // 25
		this.add('LDAP_Idle_Timeout', 600000, { type: 'int', enableQuery: enableQuery });                                    // 26
		this.add('LDAP_Encryption', 'plain', { type: 'select', values: [{ key: 'plain', i18nLabel: 'No_Encryption' }, { key: 'tls', i18nLabel: 'StartTLS' }, { key: 'ssl', i18nLabel: 'SSL/LDAPS' }], enableQuery: enableQuery });
		this.add('LDAP_CA_Cert', '', { type: 'string', multiline: true, enableQuery: enableTLSQuery });                      // 28
		this.add('LDAP_Reject_Unauthorized', true, { type: 'boolean', enableQuery: enableTLSQuery });                        // 29
		this.add('LDAP_Domain_Base', '', { type: 'string', enableQuery: enableQuery });                                      // 30
		this.add('LDAP_Use_Custom_Domain_Search', false, { type: 'boolean', enableQuery: enableQuery });                     // 31
		this.add('LDAP_Custom_Domain_Search', '', { type: 'string', enableQuery: customBindSearchEnabledQuery });            // 32
		this.add('LDAP_Domain_Search_User', '', { type: 'string', enableQuery: customBindSearchDisabledQuery });             // 33
		this.add('LDAP_Domain_Search_Password', '', { type: 'password', enableQuery: customBindSearchDisabledQuery });       // 34
		this.add('LDAP_Domain_Search_Filter', '', { type: 'string', enableQuery: customBindSearchDisabledQuery });           // 35
		this.add('LDAP_Domain_Search_User_ID', 'sAMAccountName', { type: 'string', enableQuery: customBindSearchDisabledQuery });
		this.add('LDAP_Domain_Search_Object_Class', 'user', { type: 'string', enableQuery: customBindSearchDisabledQuery });
		this.add('LDAP_Domain_Search_Object_Category', 'person', { type: 'string', enableQuery: customBindSearchDisabledQuery });
		this.add('LDAP_Username_Field', 'sAMAccountName', { type: 'string', enableQuery: enableQuery });                     // 39
		this.add('LDAP_Unique_Identifier_Field', 'objectGUID,ibm-entryUUID,GUID,dominoUNID,nsuniqueId,uidNumber', { type: 'string', enableQuery: enableQuery });
		this.add('LDAP_Sync_User_Data', false, { type: 'boolean', enableQuery: enableQuery });                               // 41
		this.add('LDAP_Sync_User_Avatar', true, { type: 'boolean', enableQuery: syncDataQuery });                            // 42
		this.add('LDAP_Sync_User_Data_FieldMap', '{"cn":"name", "mail":"email"}', { type: 'string', enableQuery: syncDataQuery });
		this.add('LDAP_Default_Domain', '', { type: 'string', enableQuery: enableQuery });                                   // 44
		this.add('LDAP_Merge_Existing_Users', false, { type: 'boolean', enableQuery: enableQuery });                         // 45
		this.add('LDAP_Import_Users', false, { type: 'boolean', enableQuery: syncDataQuery });                               // 46
		this.add('LDAP_Test_Connection', 'ldap_test_connection', { type: 'action', actionText: 'Test_Connection' });         // 47
		this.add('LDAP_Sync_Users', 'ldap_sync_users', { type: 'action', actionText: 'Sync_Users' });                        // 48
	});                                                                                                                   // 49
});                                                                                                                    // 50
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"testConnection.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_ldap/server/testConnection.js                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals LDAP */                                                                                                     // 1
                                                                                                                       //
Meteor.methods({                                                                                                       // 3
	ldap_test_connection: function () {                                                                                   // 4
		function ldap_test_connection() {                                                                                    // 4
			var user = Meteor.user();                                                                                           // 5
			if (!user) {                                                                                                        // 6
				throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'ldap_test_connection' });                  // 7
			}                                                                                                                   // 8
                                                                                                                       //
			if (!RocketChat.authz.hasRole(user._id, 'admin')) {                                                                 // 10
				throw new Meteor.Error('error-not-authorized', 'Not authorized', { method: 'ldap_test_connection' });              // 11
			}                                                                                                                   // 12
                                                                                                                       //
			if (RocketChat.settings.get('LDAP_Enable') !== true) {                                                              // 14
				throw new Meteor.Error('LDAP_disabled');                                                                           // 15
			}                                                                                                                   // 16
                                                                                                                       //
			var ldap = void 0;                                                                                                  // 18
			try {                                                                                                               // 19
				ldap = new LDAP();                                                                                                 // 20
				ldap.connectSync();                                                                                                // 21
			} catch (error) {                                                                                                   // 22
				console.log(error);                                                                                                // 23
				throw new Meteor.Error(error.message);                                                                             // 24
			}                                                                                                                   // 25
                                                                                                                       //
			try {                                                                                                               // 27
				ldap.bindIfNecessary();                                                                                            // 28
				ldap.disconnect();                                                                                                 // 29
			} catch (error) {                                                                                                   // 30
				throw new Meteor.Error(error.name || error.message);                                                               // 31
			}                                                                                                                   // 32
                                                                                                                       //
			return {                                                                                                            // 34
				message: 'Connection_success',                                                                                     // 35
				params: []                                                                                                         // 36
			};                                                                                                                  // 34
		}                                                                                                                    // 38
                                                                                                                       //
		return ldap_test_connection;                                                                                         // 4
	}()                                                                                                                   // 4
});                                                                                                                    // 3
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"syncUsers.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_ldap/server/syncUsers.js                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals sync */                                                                                                     // 1
                                                                                                                       //
Meteor.methods({                                                                                                       // 3
	ldap_sync_users: function () {                                                                                        // 4
		function ldap_sync_users() {                                                                                         // 4
			var user = Meteor.user();                                                                                           // 5
			if (!user) {                                                                                                        // 6
				throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'ldap_sync_users' });                       // 7
			}                                                                                                                   // 8
                                                                                                                       //
			if (!RocketChat.authz.hasRole(user._id, 'admin')) {                                                                 // 10
				throw new Meteor.Error('error-not-authorized', 'Not authorized', { method: 'ldap_sync_users' });                   // 11
			}                                                                                                                   // 12
                                                                                                                       //
			if (RocketChat.settings.get('LDAP_Enable') !== true) {                                                              // 14
				throw new Meteor.Error('LDAP_disabled');                                                                           // 15
			}                                                                                                                   // 16
                                                                                                                       //
			var result = sync();                                                                                                // 18
                                                                                                                       //
			if (result === true) {                                                                                              // 20
				return {                                                                                                           // 21
					message: 'Sync_success',                                                                                          // 22
					params: []                                                                                                        // 23
				};                                                                                                                 // 21
			}                                                                                                                   // 25
                                                                                                                       //
			throw result;                                                                                                       // 27
		}                                                                                                                    // 28
                                                                                                                       //
		return ldap_sync_users;                                                                                              // 4
	}()                                                                                                                   // 4
});                                                                                                                    // 3
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/rocketchat:ldap/server/ldap.js");
require("./node_modules/meteor/rocketchat:ldap/server/sync.js");
require("./node_modules/meteor/rocketchat:ldap/server/loginHandler.js");
require("./node_modules/meteor/rocketchat:ldap/server/settings.js");
require("./node_modules/meteor/rocketchat:ldap/server/testConnection.js");
require("./node_modules/meteor/rocketchat:ldap/server/syncUsers.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['rocketchat:ldap'] = {}, {
  LDAP: LDAP
});

})();

//# sourceMappingURL=rocketchat_ldap.js.map
