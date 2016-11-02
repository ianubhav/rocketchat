(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var renderEmoji = Package['rocketchat:emoji'].renderEmoji;
var RocketChatFile = Package['rocketchat:file'].RocketChatFile;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var _ = Package.underscore._;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
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
var isSet, isSetNotNull;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:emoji-custom":{"function-isSet.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_emoji-custom/function-isSet.js                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/* globals isSet:true, isSetNotNull:true */                                                                           // 1
//http://stackoverflow.com/a/26990347 function isSet() from Gajus                                                     // 2
isSet = function isSet(fn) {                                                                                          // 3
	var value;                                                                                                           // 4
	try {                                                                                                                // 5
		value = fn();                                                                                                       // 6
	} catch (e) {                                                                                                        // 7
		value = undefined;                                                                                                  // 8
	} finally {                                                                                                          // 9
		return value !== undefined;                                                                                         // 10
	}                                                                                                                    // 11
};                                                                                                                    // 12
                                                                                                                      //
isSetNotNull = function isSetNotNull(fn) {                                                                            // 14
	var value;                                                                                                           // 15
	try {                                                                                                                // 16
		value = fn();                                                                                                       // 17
	} catch (e) {                                                                                                        // 18
		value = null;                                                                                                       // 19
	} finally {                                                                                                          // 20
		return value !== null && value !== undefined;                                                                       // 21
	}                                                                                                                    // 22
};                                                                                                                    // 23
                                                                                                                      //
/* exported isSet, isSetNotNull */                                                                                    // 25
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"server":{"startup":{"emoji-custom.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_emoji-custom/server/startup/emoji-custom.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/* globals isSetNotNull, RocketChatFileEmojiCustomInstance */                                                         // 1
Meteor.startup(function () {                                                                                          // 2
	var storeType = 'GridFS';                                                                                            // 3
                                                                                                                      //
	if (RocketChat.settings.get('EmojiUpload_Storage_Type')) {                                                           // 5
		storeType = RocketChat.settings.get('EmojiUpload_Storage_Type');                                                    // 6
	}                                                                                                                    // 7
                                                                                                                      //
	var RocketChatStore = RocketChatFile[storeType];                                                                     // 9
                                                                                                                      //
	if (!isSetNotNull(function () {                                                                                      // 11
		return RocketChatStore;                                                                                             // 11
	})) {                                                                                                                // 11
		throw new Error('Invalid RocketChatStore type [' + storeType + ']');                                                // 12
	}                                                                                                                    // 13
                                                                                                                      //
	console.log(('Using ' + storeType + ' for custom emoji storage').green);                                             // 15
                                                                                                                      //
	var path = '~/uploads';                                                                                              // 17
	if (isSetNotNull(function () {                                                                                       // 18
		return RocketChat.settings.get('EmojiUpload_FileSystemPath');                                                       // 18
	})) {                                                                                                                // 18
		if (RocketChat.settings.get('EmojiUpload_FileSystemPath').trim() !== '') {                                          // 19
			path = RocketChat.settings.get('EmojiUpload_FileSystemPath');                                                      // 20
		}                                                                                                                   // 21
	}                                                                                                                    // 22
                                                                                                                      //
	this.RocketChatFileEmojiCustomInstance = new RocketChatStore({                                                       // 24
		name: 'custom_emoji',                                                                                               // 25
		absolutePath: path                                                                                                  // 26
	});                                                                                                                  // 24
                                                                                                                      //
	return WebApp.connectHandlers.use('/emoji-custom/', Meteor.bindEnvironment(function (req, res /*, next*/) {          // 29
		var params = { emoji: decodeURIComponent(req.url.replace(/^\//, '').replace(/\?.*$/, '')) };                        // 30
                                                                                                                      //
		if (_.isEmpty(params.emoji)) {                                                                                      // 33
			res.writeHead(403);                                                                                                // 34
			res.write('Forbidden');                                                                                            // 35
			res.end();                                                                                                         // 36
			return;                                                                                                            // 37
		}                                                                                                                   // 38
                                                                                                                      //
		var file = RocketChatFileEmojiCustomInstance.getFileWithReadStream(encodeURIComponent(params.emoji));               // 40
                                                                                                                      //
		res.setHeader('Content-Disposition', 'inline');                                                                     // 42
                                                                                                                      //
		if (!isSetNotNull(function () {                                                                                     // 44
			return file;                                                                                                       // 44
		})) {                                                                                                               // 44
			//use code from username initials renderer until file upload is complete                                           // 45
			res.setHeader('Content-Type', 'image/svg+xml');                                                                    // 46
			res.setHeader('Cache-Control', 'public, max-age=0');                                                               // 47
			res.setHeader('Expires', '-1');                                                                                    // 48
			res.setHeader('Last-Modified', 'Thu, 01 Jan 2015 00:00:00 GMT');                                                   // 49
                                                                                                                      //
			var _reqModifiedHeader = req.headers['if-modified-since'];                                                         // 51
			if (_reqModifiedHeader != null) {                                                                                  // 52
				if (_reqModifiedHeader === 'Thu, 01 Jan 2015 00:00:00 GMT') {                                                     // 53
					res.writeHead(304);                                                                                              // 54
					res.end();                                                                                                       // 55
					return;                                                                                                          // 56
				}                                                                                                                 // 57
			}                                                                                                                  // 58
                                                                                                                      //
			var color = '#000';                                                                                                // 60
			var initials = '?';                                                                                                // 61
                                                                                                                      //
			var svg = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<svg xmlns="http://www.w3.org/2000/svg" pointer-events="none" width="50" height="50" style="width: 50px; height: 50px; background-color: ' + color + ';">\n\t<text text-anchor="middle" y="50%" x="50%" dy="0.36em" pointer-events="auto" fill="#ffffff" font-family="Helvetica, Arial, Lucida Grande, sans-serif" style="font-weight: 400; font-size: 28px;">\n\t\t' + initials + '\n\t</text>\n</svg>';
                                                                                                                      //
			res.write(svg);                                                                                                    // 70
			res.end();                                                                                                         // 71
			return;                                                                                                            // 72
		}                                                                                                                   // 73
                                                                                                                      //
		var fileUploadDate = undefined;                                                                                     // 75
		if (isSetNotNull(function () {                                                                                      // 76
			return file.uploadDate;                                                                                            // 76
		})) {                                                                                                               // 76
			fileUploadDate = file.uploadDate.toUTCString();                                                                    // 77
		}                                                                                                                   // 78
                                                                                                                      //
		var reqModifiedHeader = req.headers['if-modified-since'];                                                           // 80
		if (isSetNotNull(function () {                                                                                      // 81
			return reqModifiedHeader;                                                                                          // 81
		})) {                                                                                                               // 81
			if (reqModifiedHeader === fileUploadDate) {                                                                        // 82
				res.setHeader('Last-Modified', reqModifiedHeader);                                                                // 83
				res.writeHead(304);                                                                                               // 84
				res.end();                                                                                                        // 85
				return;                                                                                                           // 86
			}                                                                                                                  // 87
		}                                                                                                                   // 88
                                                                                                                      //
		res.setHeader('Cache-Control', 'public, max-age=0');                                                                // 90
		res.setHeader('Expires', '-1');                                                                                     // 91
		if (isSetNotNull(function () {                                                                                      // 92
			return fileUploadDate;                                                                                             // 92
		})) {                                                                                                               // 92
			res.setHeader('Last-Modified', fileUploadDate);                                                                    // 93
		} else {                                                                                                            // 94
			res.setHeader('Last-Modified', new Date().toUTCString());                                                          // 95
		}                                                                                                                   // 96
		if (/^svg$/i.test(params.emoji.split('.').pop())) {                                                                 // 97
			res.setHeader('Content-Type', 'image/svg+xml');                                                                    // 98
		} else {                                                                                                            // 99
			res.setHeader('Content-Type', 'image/jpeg');                                                                       // 100
		}                                                                                                                   // 101
		res.setHeader('Content-Length', file.length);                                                                       // 102
                                                                                                                      //
		file.readStream.pipe(res);                                                                                          // 104
	}));                                                                                                                 // 105
});                                                                                                                   // 106
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"settings.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_emoji-custom/server/startup/settings.js                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
RocketChat.settings.addGroup('EmojiCustomFilesystem', function () {                                                   // 1
	this.add('EmojiUpload_Storage_Type', 'GridFS', {                                                                     // 2
		type: 'select',                                                                                                     // 3
		values: [{                                                                                                          // 4
			key: 'GridFS',                                                                                                     // 5
			i18nLabel: 'GridFS'                                                                                                // 6
		}, {                                                                                                                // 4
			key: 'FileSystem',                                                                                                 // 8
			i18nLabel: 'FileSystem'                                                                                            // 9
		}],                                                                                                                 // 7
		i18nLabel: 'FileUpload_Storage_Type'                                                                                // 11
	});                                                                                                                  // 2
                                                                                                                      //
	this.add('EmojiUpload_FileSystemPath', '', {                                                                         // 14
		type: 'string',                                                                                                     // 15
		enableQuery: {                                                                                                      // 16
			_id: 'EmojiUpload_Storage_Type',                                                                                   // 17
			value: 'FileSystem'                                                                                                // 18
		},                                                                                                                  // 16
		i18nLabel: 'FileUpload_FileSystemPath'                                                                              // 20
	});                                                                                                                  // 14
});                                                                                                                   // 22
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"models":{"EmojiCustom.js":["babel-runtime/helpers/classCallCheck","babel-runtime/helpers/possibleConstructorReturn","babel-runtime/helpers/inherits",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_emoji-custom/server/models/EmojiCustom.js                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _classCallCheck;module.import('babel-runtime/helpers/classCallCheck',{"default":function(v){_classCallCheck=v}});var _possibleConstructorReturn;module.import('babel-runtime/helpers/possibleConstructorReturn',{"default":function(v){_possibleConstructorReturn=v}});var _inherits;module.import('babel-runtime/helpers/inherits',{"default":function(v){_inherits=v}});
                                                                                                                      //
                                                                                                                      //
                                                                                                                      //
var EmojiCustom = function (_RocketChat$models$_B) {                                                                  //
	_inherits(EmojiCustom, _RocketChat$models$_B);                                                                       //
                                                                                                                      //
	function EmojiCustom() {                                                                                             // 2
		_classCallCheck(this, EmojiCustom);                                                                                 // 2
                                                                                                                      //
		var _this = _possibleConstructorReturn(this, _RocketChat$models$_B.call(this, 'custom_emoji'));                     // 2
                                                                                                                      //
		_this.tryEnsureIndex({ 'name': 1 });                                                                                // 5
		_this.tryEnsureIndex({ 'aliases': 1 });                                                                             // 6
		_this.tryEnsureIndex({ 'extension': 1 });                                                                           // 7
		return _this;                                                                                                       // 2
	}                                                                                                                    // 8
                                                                                                                      //
	//find one                                                                                                           // 10
                                                                                                                      //
                                                                                                                      //
	EmojiCustom.prototype.findOneByID = function () {                                                                    //
		function findOneByID(_id, options) {                                                                                //
			return this.findOne(_id, options);                                                                                 // 12
		}                                                                                                                   // 13
                                                                                                                      //
		return findOneByID;                                                                                                 //
	}();                                                                                                                 //
                                                                                                                      //
	//find                                                                                                               // 15
                                                                                                                      //
                                                                                                                      //
	EmojiCustom.prototype.findByNameOrAlias = function () {                                                              //
		function findByNameOrAlias(name, options) {                                                                         //
			var query = {                                                                                                      // 17
				$or: [{ name: name }, { aliases: name }]                                                                          // 18
			};                                                                                                                 // 17
                                                                                                                      //
			return this.find(query, options);                                                                                  // 24
		}                                                                                                                   // 25
                                                                                                                      //
		return findByNameOrAlias;                                                                                           //
	}();                                                                                                                 //
                                                                                                                      //
	EmojiCustom.prototype.findByNameOrAliasExceptID = function () {                                                      //
		function findByNameOrAliasExceptID(name, except, options) {                                                         //
			var query = {                                                                                                      // 28
				_id: { $nin: [except] },                                                                                          // 29
				$or: [{ name: name }, { aliases: name }]                                                                          // 30
			};                                                                                                                 // 28
                                                                                                                      //
			return this.find(query, options);                                                                                  // 36
		}                                                                                                                   // 37
                                                                                                                      //
		return findByNameOrAliasExceptID;                                                                                   //
	}();                                                                                                                 //
                                                                                                                      //
	//update                                                                                                             // 40
                                                                                                                      //
                                                                                                                      //
	EmojiCustom.prototype.setName = function () {                                                                        //
		function setName(_id, name) {                                                                                       //
			var update = {                                                                                                     // 42
				$set: {                                                                                                           // 43
					name: name                                                                                                       // 44
				}                                                                                                                 // 43
			};                                                                                                                 // 42
                                                                                                                      //
			return this.update({ _id: _id }, update);                                                                          // 48
		}                                                                                                                   // 49
                                                                                                                      //
		return setName;                                                                                                     //
	}();                                                                                                                 //
                                                                                                                      //
	EmojiCustom.prototype.setAliases = function () {                                                                     //
		function setAliases(_id, aliases) {                                                                                 //
			var update = {                                                                                                     // 52
				$set: {                                                                                                           // 53
					aliases: aliases                                                                                                 // 54
				}                                                                                                                 // 53
			};                                                                                                                 // 52
                                                                                                                      //
			return this.update({ _id: _id }, update);                                                                          // 58
		}                                                                                                                   // 59
                                                                                                                      //
		return setAliases;                                                                                                  //
	}();                                                                                                                 //
                                                                                                                      //
	EmojiCustom.prototype.setExtension = function () {                                                                   //
		function setExtension(_id, extension) {                                                                             //
			var update = {                                                                                                     // 62
				$set: {                                                                                                           // 63
					extension: extension                                                                                             // 64
				}                                                                                                                 // 63
			};                                                                                                                 // 62
                                                                                                                      //
			return this.update({ _id: _id }, update);                                                                          // 68
		}                                                                                                                   // 69
                                                                                                                      //
		return setExtension;                                                                                                //
	}();                                                                                                                 //
                                                                                                                      //
	// INSERT                                                                                                            // 71
                                                                                                                      //
                                                                                                                      //
	EmojiCustom.prototype.create = function () {                                                                         //
		function create(data) {                                                                                             //
			return this.insert(data);                                                                                          // 73
		}                                                                                                                   // 74
                                                                                                                      //
		return create;                                                                                                      //
	}();                                                                                                                 //
                                                                                                                      //
	// REMOVE                                                                                                            // 77
                                                                                                                      //
                                                                                                                      //
	EmojiCustom.prototype.removeByID = function () {                                                                     //
		function removeByID(_id) {                                                                                          //
			return this.remove(_id);                                                                                           // 79
		}                                                                                                                   // 80
                                                                                                                      //
		return removeByID;                                                                                                  //
	}();                                                                                                                 //
                                                                                                                      //
	return EmojiCustom;                                                                                                  //
}(RocketChat.models._Base);                                                                                           //
                                                                                                                      //
RocketChat.models.EmojiCustom = new EmojiCustom();                                                                    // 83
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]},"publications":{"fullEmojiData.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_emoji-custom/server/publications/fullEmojiData.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.publish('fullEmojiData', function (filter, limit) {                                                            // 1
	if (!this.userId) {                                                                                                  // 2
		return this.ready();                                                                                                // 3
	}                                                                                                                    // 4
                                                                                                                      //
	var fields = {                                                                                                       // 6
		name: 1,                                                                                                            // 7
		aliases: 1,                                                                                                         // 8
		extension: 1                                                                                                        // 9
	};                                                                                                                   // 6
                                                                                                                      //
	filter = s.trim(filter);                                                                                             // 12
                                                                                                                      //
	var options = {                                                                                                      // 14
		fields: fields,                                                                                                     // 15
		limit: limit,                                                                                                       // 16
		sort: { name: 1 }                                                                                                   // 17
	};                                                                                                                   // 14
                                                                                                                      //
	if (filter) {                                                                                                        // 20
		var filterReg = new RegExp(s.escapeRegExp(filter), 'i');                                                            // 21
		return RocketChat.models.EmojiCustom.findByNameOrAlias(filterReg, options);                                         // 22
	}                                                                                                                    // 23
                                                                                                                      //
	return RocketChat.models.EmojiCustom.find({}, options);                                                              // 25
});                                                                                                                   // 26
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"methods":{"listEmojiCustom.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_emoji-custom/server/methods/listEmojiCustom.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.methods({                                                                                                      // 1
	listEmojiCustom: function () {                                                                                       // 2
		function listEmojiCustom() {                                                                                        // 1
			return RocketChat.models.EmojiCustom.find({}).fetch();                                                             // 3
		}                                                                                                                   // 4
                                                                                                                      //
		return listEmojiCustom;                                                                                             // 1
	}()                                                                                                                  // 1
});                                                                                                                   // 1
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"deleteEmojiCustom.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_emoji-custom/server/methods/deleteEmojiCustom.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/* globals isSetNotNull, RocketChatFileEmojiCustomInstance */                                                         // 1
Meteor.methods({                                                                                                      // 2
	deleteEmojiCustom: function () {                                                                                     // 3
		function deleteEmojiCustom(emojiID) {                                                                               // 2
			var emoji = null;                                                                                                  // 4
                                                                                                                      //
			if (RocketChat.authz.hasPermission(this.userId, 'manage-emoji')) {                                                 // 6
				emoji = RocketChat.models.EmojiCustom.findOneByID(emojiID);                                                       // 7
			} else {                                                                                                           // 8
				throw new Meteor.Error('not_authorized');                                                                         // 9
			}                                                                                                                  // 10
                                                                                                                      //
			if (!isSetNotNull(function () {                                                                                    // 12
				return emoji;                                                                                                     // 12
			})) {                                                                                                              // 12
				throw new Meteor.Error('Custom_Emoji_Error_Invalid_Emoji', 'Invalid emoji', { method: 'deleteEmojiCustom' });     // 13
			}                                                                                                                  // 14
                                                                                                                      //
			RocketChatFileEmojiCustomInstance.deleteFile(encodeURIComponent(emoji.name + '.' + emoji.extension));              // 16
			RocketChat.models.EmojiCustom.removeByID(emojiID);                                                                 // 17
			RocketChat.Notifications.notifyAll('deleteEmojiCustom', { emojiData: emoji });                                     // 18
                                                                                                                      //
			return true;                                                                                                       // 20
		}                                                                                                                   // 21
                                                                                                                      //
		return deleteEmojiCustom;                                                                                           // 2
	}()                                                                                                                  // 2
});                                                                                                                   // 2
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"insertOrUpdateEmoji.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_emoji-custom/server/methods/insertOrUpdateEmoji.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/* globals RocketChatFileEmojiCustomInstance */                                                                       // 1
Meteor.methods({                                                                                                      // 2
	insertOrUpdateEmoji: function () {                                                                                   // 3
		function insertOrUpdateEmoji(emojiData) {                                                                           // 2
			if (!RocketChat.authz.hasPermission(this.userId, 'manage-emoji')) {                                                // 4
				throw new Meteor.Error('not_authorized');                                                                         // 5
			}                                                                                                                  // 6
                                                                                                                      //
			if (!s.trim(emojiData.name)) {                                                                                     // 8
				throw new Meteor.Error('error-the-field-is-required', 'The field Name is required', { method: 'insertOrUpdateEmoji', field: 'Name' });
			}                                                                                                                  // 10
                                                                                                                      //
			//let nameValidation = new RegExp('^[0-9a-zA-Z-_+;.]+$');                                                          // 12
			//let aliasValidation = new RegExp('^[0-9a-zA-Z-_+;., ]+$');                                                       // 13
                                                                                                                      //
			//allow all characters except colon, whitespace, comma, >, <, &, ", ', /, \, (, )                                  // 15
			//more practical than allowing specific sets of characters; also allows foreign languages                          // 16
			var nameValidation = /[\s,:><&"'\/\\\(\)]/;                                                                        // 17
			var aliasValidation = /[:><&"'\/\\\(\)]/;                                                                          // 18
                                                                                                                      //
			//silently strip colon; this allows for uploading :emojiname: as emojiname                                         // 20
			emojiData.name = emojiData.name.replace(/:/g, '');                                                                 // 21
			emojiData.aliases = emojiData.aliases.replace(/:/g, '');                                                           // 22
                                                                                                                      //
			if (nameValidation.test(emojiData.name)) {                                                                         // 24
				throw new Meteor.Error('error-input-is-not-a-valid-field', emojiData.name + ' is not a valid name', { method: 'insertOrUpdateEmoji', input: emojiData.name, field: 'Name' });
			}                                                                                                                  // 26
                                                                                                                      //
			if (emojiData.aliases) {                                                                                           // 28
				if (aliasValidation.test(emojiData.aliases)) {                                                                    // 29
					throw new Meteor.Error('error-input-is-not-a-valid-field', emojiData.aliases + ' is not a valid alias set', { method: 'insertOrUpdateEmoji', input: emojiData.aliases, field: 'Alias_Set' });
				}                                                                                                                 // 31
				emojiData.aliases = emojiData.aliases.split(/[\s,]/);                                                             // 32
				emojiData.aliases = emojiData.aliases.filter(Boolean);                                                            // 33
				emojiData.aliases = _.without(emojiData.aliases, emojiData.name);                                                 // 34
			} else {                                                                                                           // 35
				emojiData.aliases = [];                                                                                           // 36
			}                                                                                                                  // 37
                                                                                                                      //
			var matchingResults = [];                                                                                          // 39
                                                                                                                      //
			if (emojiData._id) {                                                                                               // 41
				matchingResults = RocketChat.models.EmojiCustom.findByNameOrAliasExceptID(emojiData.name, emojiData._id).fetch();
				for (var _iterator = emojiData.aliases, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
					var _ref;                                                                                                        // 43
                                                                                                                      //
					if (_isArray) {                                                                                                  // 43
						if (_i >= _iterator.length) break;                                                                              // 43
						_ref = _iterator[_i++];                                                                                         // 43
					} else {                                                                                                         // 43
						_i = _iterator.next();                                                                                          // 43
						if (_i.done) break;                                                                                             // 43
						_ref = _i.value;                                                                                                // 43
					}                                                                                                                // 43
                                                                                                                      //
					var alias = _ref;                                                                                                // 43
                                                                                                                      //
					matchingResults = matchingResults.concat(RocketChat.models.EmojiCustom.findByNameOrAliasExceptID(alias, emojiData._id).fetch());
				}                                                                                                                 // 45
			} else {                                                                                                           // 46
				matchingResults = RocketChat.models.EmojiCustom.findByNameOrAlias(emojiData.name).fetch();                        // 47
				for (var _iterator2 = emojiData.aliases, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
					var _ref2;                                                                                                       // 48
                                                                                                                      //
					if (_isArray2) {                                                                                                 // 48
						if (_i2 >= _iterator2.length) break;                                                                            // 48
						_ref2 = _iterator2[_i2++];                                                                                      // 48
					} else {                                                                                                         // 48
						_i2 = _iterator2.next();                                                                                        // 48
						if (_i2.done) break;                                                                                            // 48
						_ref2 = _i2.value;                                                                                              // 48
					}                                                                                                                // 48
                                                                                                                      //
					var _alias = _ref2;                                                                                              // 48
                                                                                                                      //
					matchingResults = matchingResults.concat(RocketChat.models.EmojiCustom.findByNameOrAlias(_alias).fetch());       // 49
				}                                                                                                                 // 50
			}                                                                                                                  // 51
                                                                                                                      //
			if (matchingResults.length > 0) {                                                                                  // 53
				throw new Meteor.Error('Custom_Emoji_Error_Name_Or_Alias_Already_In_Use', 'The custom emoji or one of its aliases is already in use', { method: 'insertOrUpdateEmoji' });
			}                                                                                                                  // 55
                                                                                                                      //
			if (!emojiData._id) {                                                                                              // 57
				//insert emoji                                                                                                    // 58
				var createEmoji = {                                                                                               // 59
					name: emojiData.name,                                                                                            // 60
					aliases: emojiData.aliases,                                                                                      // 61
					extension: emojiData.extension                                                                                   // 62
				};                                                                                                                // 59
                                                                                                                      //
				var _id = RocketChat.models.EmojiCustom.create(createEmoji);                                                      // 65
                                                                                                                      //
				RocketChat.Notifications.notifyAll('updateEmojiCustom', { emojiData: createEmoji });                              // 67
                                                                                                                      //
				return _id;                                                                                                       // 69
			} else {                                                                                                           // 70
				//update emoji                                                                                                    // 71
				if (emojiData.newFile) {                                                                                          // 72
					RocketChatFileEmojiCustomInstance.deleteFile(encodeURIComponent(emojiData.name + '.' + emojiData.extension));    // 73
					RocketChatFileEmojiCustomInstance.deleteFile(encodeURIComponent(emojiData.name + '.' + emojiData.previousExtension));
					RocketChatFileEmojiCustomInstance.deleteFile(encodeURIComponent(emojiData.previousName + '.' + emojiData.extension));
					RocketChatFileEmojiCustomInstance.deleteFile(encodeURIComponent(emojiData.previousName + '.' + emojiData.previousExtension));
                                                                                                                      //
					RocketChat.models.EmojiCustom.setExtension(emojiData._id, emojiData.extension);                                  // 78
				} else if (emojiData.name !== emojiData.previousName) {                                                           // 79
					var rs = RocketChatFileEmojiCustomInstance.getFileWithReadStream(encodeURIComponent(emojiData.previousName + '.' + emojiData.previousExtension));
					if (rs !== null) {                                                                                               // 81
						RocketChatFileEmojiCustomInstance.deleteFile(encodeURIComponent(emojiData.name + '.' + emojiData.extension));   // 82
						var ws = RocketChatFileEmojiCustomInstance.createWriteStream(encodeURIComponent(emojiData.name + '.' + emojiData.previousExtension), rs.contentType);
						ws.on('end', Meteor.bindEnvironment(function () {                                                               // 84
							return RocketChatFileEmojiCustomInstance.deleteFile(encodeURIComponent(emojiData.previousName + '.' + emojiData.previousExtension));
						}));                                                                                                            // 84
						rs.readStream.pipe(ws);                                                                                         // 87
					}                                                                                                                // 88
				}                                                                                                                 // 89
                                                                                                                      //
				if (emojiData.name !== emojiData.previousName) {                                                                  // 91
					RocketChat.models.EmojiCustom.setName(emojiData._id, emojiData.name);                                            // 92
				}                                                                                                                 // 93
                                                                                                                      //
				if (emojiData.aliases) {                                                                                          // 95
					RocketChat.models.EmojiCustom.setAliases(emojiData._id, emojiData.aliases);                                      // 96
				} else {                                                                                                          // 97
					RocketChat.models.EmojiCustom.setAliases(emojiData._id, []);                                                     // 98
				}                                                                                                                 // 99
                                                                                                                      //
				RocketChat.Notifications.notifyAll('updateEmojiCustom', { emojiData: emojiData });                                // 101
                                                                                                                      //
				return true;                                                                                                      // 103
			}                                                                                                                  // 104
		}                                                                                                                   // 105
                                                                                                                      //
		return insertOrUpdateEmoji;                                                                                         // 2
	}()                                                                                                                  // 2
});                                                                                                                   // 2
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"uploadEmojiCustom.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_emoji-custom/server/methods/uploadEmojiCustom.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/* globals RocketChatFileEmojiCustomInstance */                                                                       // 1
Meteor.methods({                                                                                                      // 2
	uploadEmojiCustom: function () {                                                                                     // 3
		function uploadEmojiCustom(binaryContent, contentType, emojiData) {                                                 // 2
			if (!RocketChat.authz.hasPermission(this.userId, 'manage-emoji')) {                                                // 4
				throw new Meteor.Error('not_authorized');                                                                         // 5
			}                                                                                                                  // 6
                                                                                                                      //
			//delete aliases for notification purposes. here, it is a string rather than an array                              // 8
			delete emojiData.aliases;                                                                                          // 9
			var file = new Buffer(binaryContent, 'binary');                                                                    // 10
                                                                                                                      //
			var rs = RocketChatFile.bufferToStream(file);                                                                      // 12
			RocketChatFileEmojiCustomInstance.deleteFile(encodeURIComponent(emojiData.name + '.' + emojiData.extension));      // 13
			var ws = RocketChatFileEmojiCustomInstance.createWriteStream(encodeURIComponent(emojiData.name + '.' + emojiData.extension), contentType);
			ws.on('end', Meteor.bindEnvironment(function () {                                                                  // 15
				return Meteor.setTimeout(function () {                                                                            // 15
					return RocketChat.Notifications.notifyAll('updateEmojiCustom', { emojiData: emojiData });                        // 16
				}, 500);                                                                                                          // 16
			}));                                                                                                               // 15
                                                                                                                      //
			rs.pipe(ws);                                                                                                       // 20
		}                                                                                                                   // 21
                                                                                                                      //
		return uploadEmojiCustom;                                                                                           // 2
	}()                                                                                                                  // 2
});                                                                                                                   // 2
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/rocketchat:emoji-custom/function-isSet.js");
require("./node_modules/meteor/rocketchat:emoji-custom/server/startup/emoji-custom.js");
require("./node_modules/meteor/rocketchat:emoji-custom/server/startup/settings.js");
require("./node_modules/meteor/rocketchat:emoji-custom/server/models/EmojiCustom.js");
require("./node_modules/meteor/rocketchat:emoji-custom/server/publications/fullEmojiData.js");
require("./node_modules/meteor/rocketchat:emoji-custom/server/methods/listEmojiCustom.js");
require("./node_modules/meteor/rocketchat:emoji-custom/server/methods/deleteEmojiCustom.js");
require("./node_modules/meteor/rocketchat:emoji-custom/server/methods/insertOrUpdateEmoji.js");
require("./node_modules/meteor/rocketchat:emoji-custom/server/methods/uploadEmojiCustom.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:emoji-custom'] = {};

})();

//# sourceMappingURL=rocketchat_emoji-custom.js.map
