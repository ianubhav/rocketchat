(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var RocketChatFile = Package['rocketchat:file'].RocketChatFile;
var UploadFS = Package['jalik:ufs'].UploadFS;
var Slingshot = Package['edgee:slingshot'].Slingshot;
var AWS = Package['peerlibrary:aws-sdk'].AWS;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var Random = Package.random.Random;
var _ = Package.underscore._;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
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
var FileUpload, FileUploadBase, FileSystemStore, fileUploadHandler;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:file-upload":{"globalFileRestrictions.js":["filesize",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/globalFileRestrictions.js                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var filesize;module.import('filesize',{"default":function(v){filesize=v}});/* globals Slingshot */                     // 1
                                                                                                                       //
                                                                                                                       // 3
                                                                                                                       //
Slingshot.fileRestrictions('rocketchat-uploads', {                                                                     // 5
	authorize: function () {                                                                                              // 6
		function authorize(file /*, metaContext*/) {                                                                         // 6
			if (!RocketChat.fileUploadIsValidContentType(file.type)) {                                                          // 7
				throw new Meteor.Error(TAPi18n.__('error-invalid-file-type'));                                                     // 8
			}                                                                                                                   // 9
                                                                                                                       //
			var maxFileSize = RocketChat.settings.get('FileUpload_MaxFileSize');                                                // 11
                                                                                                                       //
			if (maxFileSize && maxFileSize < file.size) {                                                                       // 13
				throw new Meteor.Error(TAPi18n.__('File_exceeds_allowed_size_of_bytes', { size: filesize(maxFileSize) }));         // 14
			}                                                                                                                   // 15
                                                                                                                       //
			//Deny uploads if user is not logged in.                                                                            // 17
			if (!this.userId) {                                                                                                 // 18
				throw new Meteor.Error('login-require', 'Please login before posting files');                                      // 19
			}                                                                                                                   // 20
                                                                                                                       //
			return true;                                                                                                        // 22
		}                                                                                                                    // 23
                                                                                                                       //
		return authorize;                                                                                                    // 6
	}(),                                                                                                                  // 6
	maxSize: 0,                                                                                                           // 24
	allowedFileTypes: null                                                                                                // 25
});                                                                                                                    // 5
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"lib":{"FileUpload.js":["filesize",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/lib/FileUpload.js                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var filesize;module.import('filesize',{"default":function(v){filesize=v}});/* globals FileUpload:true */               // 1
/* exported FileUpload */                                                                                              // 2
                                                                                                                       //
                                                                                                                       // 4
                                                                                                                       //
var maxFileSize = 0;                                                                                                   // 6
                                                                                                                       //
FileUpload = {                                                                                                         // 8
	validateFileUpload: function () {                                                                                     // 9
		function validateFileUpload(file) {                                                                                  // 8
			if (file.size > maxFileSize) {                                                                                      // 10
				var user = Meteor.user();                                                                                          // 11
				var reason = TAPi18n.__('File_exceeds_allowed_size_of_bytes', {                                                    // 12
					size: filesize(maxFileSize)                                                                                       // 13
				}, user.language);                                                                                                 // 12
				throw new Meteor.Error('error-file-too-large', reason);                                                            // 15
			}                                                                                                                   // 16
                                                                                                                       //
			if (!RocketChat.fileUploadIsValidContentType(file.type)) {                                                          // 18
				var _user = Meteor.user();                                                                                         // 19
				var _reason = TAPi18n.__('File_type_is_not_accepted', _user.language);                                             // 20
				throw new Meteor.Error('error-invalid-file-type', _reason);                                                        // 21
			}                                                                                                                   // 22
                                                                                                                       //
			return true;                                                                                                        // 24
		}                                                                                                                    // 25
                                                                                                                       //
		return validateFileUpload;                                                                                           // 8
	}()                                                                                                                   // 8
};                                                                                                                     // 8
                                                                                                                       //
RocketChat.settings.get('FileUpload_MaxFileSize', function (key, value) {                                              // 28
	maxFileSize = value;                                                                                                  // 29
});                                                                                                                    // 30
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"FileUploadBase.js":["babel-runtime/helpers/classCallCheck",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/lib/FileUploadBase.js                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck;module.import("babel-runtime/helpers/classCallCheck",{"default":function(v){_classCallCheck=v}});  //
/* globals FileUploadBase:true */                                                                                      // 1
/* exported FileUploadBase */                                                                                          // 2
                                                                                                                       //
FileUploadBase = function () {                                                                                         // 4
	function FileUploadBase(meta, file) {                                                                                 // 5
		_classCallCheck(this, FileUploadBase);                                                                               // 5
                                                                                                                       //
		this.id = Random.id();                                                                                               // 6
		this.meta = meta;                                                                                                    // 7
		this.file = file;                                                                                                    // 8
	}                                                                                                                     // 9
                                                                                                                       //
	FileUploadBase.prototype.getProgress = function () {                                                                  // 4
		function getProgress() {}                                                                                            // 4
                                                                                                                       //
		return getProgress;                                                                                                  // 4
	}();                                                                                                                  // 4
                                                                                                                       //
	FileUploadBase.prototype.getFileName = function () {                                                                  // 4
		function getFileName() {                                                                                             // 4
			return this.meta.name;                                                                                              // 16
		}                                                                                                                    // 17
                                                                                                                       //
		return getFileName;                                                                                                  // 4
	}();                                                                                                                  // 4
                                                                                                                       //
	FileUploadBase.prototype.start = function () {                                                                        // 4
		function start() {}                                                                                                  // 4
                                                                                                                       //
		return start;                                                                                                        // 4
	}();                                                                                                                  // 4
                                                                                                                       //
	FileUploadBase.prototype.stop = function () {                                                                         // 4
		function stop() {}                                                                                                   // 4
                                                                                                                       //
		return stop;                                                                                                         // 4
	}();                                                                                                                  // 4
                                                                                                                       //
	return FileUploadBase;                                                                                                // 4
}();                                                                                                                   // 4
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]},"server":{"lib":{"FileUpload.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/server/lib/FileUpload.js                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals FileUpload:true */                                                                                          // 1
var mime = Npm.require('mime-types');                                                                                  // 2
                                                                                                                       //
FileUpload.handlers = {};                                                                                              // 4
                                                                                                                       //
FileUpload.addHandler = function (store, handler) {                                                                    // 6
	this.handlers[store] = handler;                                                                                       // 7
};                                                                                                                     // 8
                                                                                                                       //
FileUpload['delete'] = function (fileId) {                                                                             // 10
	var file = RocketChat.models.Uploads.findOneById(fileId);                                                             // 11
                                                                                                                       //
	if (!file) {                                                                                                          // 13
		return;                                                                                                              // 14
	}                                                                                                                     // 15
                                                                                                                       //
	this.handlers[file.store]['delete'](file);                                                                            // 17
                                                                                                                       //
	return RocketChat.models.Uploads.remove(file._id);                                                                    // 19
};                                                                                                                     // 20
                                                                                                                       //
FileUpload.get = function (file, req, res, next) {                                                                     // 22
	if (file.store && this.handlers && this.handlers[file.store] && this.handlers[file.store].get) {                      // 23
		this.handlers[file.store].get.call(this, file, req, res, next);                                                      // 24
	} else {                                                                                                              // 25
		res.writeHead(404);                                                                                                  // 26
		res.end();                                                                                                           // 27
		return;                                                                                                              // 28
	}                                                                                                                     // 29
};                                                                                                                     // 30
                                                                                                                       //
FileUpload.addExtensionTo = function (file) {                                                                          // 32
	if (mime.lookup(file.name) === file.type) {                                                                           // 33
		return file;                                                                                                         // 34
	}                                                                                                                     // 35
                                                                                                                       //
	var ext = mime.extension(file.type);                                                                                  // 37
	if (ext && false === new RegExp('.' + ext + '$', 'i').test(file.name)) {                                              // 38
		file.name = file.name + '.' + ext;                                                                                   // 39
	}                                                                                                                     // 40
                                                                                                                       //
	return file;                                                                                                          // 42
};                                                                                                                     // 43
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"requests.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/server/lib/requests.js                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals FileUpload, WebApp, Cookies */                                                                              // 1
var protectedFiles;                                                                                                    // 2
                                                                                                                       //
RocketChat.settings.get('FileUpload_ProtectFiles', function (key, value) {                                             // 4
	protectedFiles = value;                                                                                               // 5
});                                                                                                                    // 6
                                                                                                                       //
WebApp.connectHandlers.use('/file-upload/', function (req, res, next) {                                                // 8
	var file;                                                                                                             // 9
                                                                                                                       //
	var match = /^\/([^\/]+)\/(.*)/.exec(req.url);                                                                        // 11
                                                                                                                       //
	if (match[1]) {                                                                                                       // 13
		file = RocketChat.models.Uploads.findOneById(match[1]);                                                              // 14
                                                                                                                       //
		if (file) {                                                                                                          // 16
			if (!Meteor.settings['public'].sandstorm && protectedFiles) {                                                       // 17
				var cookie, rawCookies, ref, token, uid;                                                                           // 18
				cookie = new Cookies();                                                                                            // 19
                                                                                                                       //
				if ((typeof req !== 'undefined' && req !== null ? (ref = req.headers) != null ? ref.cookie : void 0 : void 0) != null) {
					rawCookies = req.headers.cookie;                                                                                  // 22
				}                                                                                                                  // 23
                                                                                                                       //
				if (rawCookies != null) {                                                                                          // 25
					uid = cookie.get('rc_uid', rawCookies);                                                                           // 26
				}                                                                                                                  // 27
                                                                                                                       //
				if (rawCookies != null) {                                                                                          // 29
					token = cookie.get('rc_token', rawCookies);                                                                       // 30
				}                                                                                                                  // 31
                                                                                                                       //
				if (uid == null) {                                                                                                 // 33
					uid = req.query.rc_uid;                                                                                           // 34
					token = req.query.rc_token;                                                                                       // 35
				}                                                                                                                  // 36
                                                                                                                       //
				if (!(uid && token && RocketChat.models.Users.findOneByIdAndLoginToken(uid, token))) {                             // 38
					res.writeHead(403);                                                                                               // 39
					res.end();                                                                                                        // 40
					return false;                                                                                                     // 41
				}                                                                                                                  // 42
			}                                                                                                                   // 43
                                                                                                                       //
			return FileUpload.get(file, req, res, next);                                                                        // 45
		}                                                                                                                    // 46
	}                                                                                                                     // 47
                                                                                                                       //
	res.writeHead(404);                                                                                                   // 49
	res.end();                                                                                                            // 50
	return;                                                                                                               // 51
});                                                                                                                    // 52
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"config":{"configFileUploadAmazonS3.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/server/config/configFileUploadAmazonS3.js                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals Slingshot, FileUpload, AWS, SystemLogger */                                                                 // 1
var crypto = Npm.require('crypto');                                                                                    // 2
                                                                                                                       //
var S3accessKey, S3secretKey, S3expiryTimeSpan;                                                                        // 4
                                                                                                                       //
var generateURL = function generateURL(file) {                                                                         // 6
	if (!file || !file.s3) {                                                                                              // 7
		return;                                                                                                              // 8
	}                                                                                                                     // 9
	var resourceURL = '/' + file.s3.bucket + '/' + file.s3.path + file._id;                                               // 10
	var expires = parseInt(new Date().getTime() / 1000) + Math.max(5, S3expiryTimeSpan);                                  // 11
	var StringToSign = 'GET\n\n\n' + expires + '\n' + resourceURL;                                                        // 12
	var signature = crypto.createHmac('sha1', S3secretKey).update(new Buffer(StringToSign, 'utf-8')).digest('base64');    // 13
	return file.url + '?AWSAccessKeyId=' + encodeURIComponent(S3accessKey) + '&Expires=' + expires + '&Signature=' + encodeURIComponent(signature);
};                                                                                                                     // 15
                                                                                                                       //
FileUpload.addHandler('s3', {                                                                                          // 17
	get: function () {                                                                                                    // 18
		function get(file, req, res) {                                                                                       // 17
			var fileUrl = generateURL(file);                                                                                    // 19
                                                                                                                       //
			if (fileUrl) {                                                                                                      // 21
				res.setHeader('Location', fileUrl);                                                                                // 22
				res.writeHead(302);                                                                                                // 23
			}                                                                                                                   // 24
			res.end();                                                                                                          // 25
		}                                                                                                                    // 26
                                                                                                                       //
		return get;                                                                                                          // 17
	}(),                                                                                                                  // 17
	'delete': function () {                                                                                               // 17
		function _delete(file) {                                                                                             // 17
			var s3 = new AWS.S3();                                                                                              // 28
			var request = s3.deleteObject({                                                                                     // 29
				Bucket: file.s3.bucket,                                                                                            // 30
				Key: file.s3.path + file._id                                                                                       // 31
			});                                                                                                                 // 29
			request.send();                                                                                                     // 33
		}                                                                                                                    // 34
                                                                                                                       //
		return _delete;                                                                                                      // 17
	}()                                                                                                                   // 17
});                                                                                                                    // 17
                                                                                                                       //
var createS3Directive = _.debounce(function () {                                                                       // 37
	var directiveName = 'rocketchat-uploads';                                                                             // 38
                                                                                                                       //
	var type = RocketChat.settings.get('FileUpload_Storage_Type');                                                        // 40
	var bucket = RocketChat.settings.get('FileUpload_S3_Bucket');                                                         // 41
	var acl = RocketChat.settings.get('FileUpload_S3_Acl');                                                               // 42
	var accessKey = RocketChat.settings.get('FileUpload_S3_AWSAccessKeyId');                                              // 43
	var secretKey = RocketChat.settings.get('FileUpload_S3_AWSSecretAccessKey');                                          // 44
	var cdn = RocketChat.settings.get('FileUpload_S3_CDN');                                                               // 45
	var region = RocketChat.settings.get('FileUpload_S3_Region');                                                         // 46
	var bucketUrl = RocketChat.settings.get('FileUpload_S3_BucketURL');                                                   // 47
                                                                                                                       //
	AWS.config.update({                                                                                                   // 49
		accessKeyId: RocketChat.settings.get('FileUpload_S3_AWSAccessKeyId'),                                                // 50
		secretAccessKey: RocketChat.settings.get('FileUpload_S3_AWSSecretAccessKey')                                         // 51
	});                                                                                                                   // 49
                                                                                                                       //
	if (type === 'AmazonS3' && !_.isEmpty(bucket) && !_.isEmpty(accessKey) && !_.isEmpty(secretKey)) {                    // 54
		if (Slingshot._directives[directiveName]) {                                                                          // 55
			delete Slingshot._directives[directiveName];                                                                        // 56
		}                                                                                                                    // 57
		var config = {                                                                                                       // 58
			bucket: bucket,                                                                                                     // 59
			AWSAccessKeyId: accessKey,                                                                                          // 60
			AWSSecretAccessKey: secretKey,                                                                                      // 61
			key: function () {                                                                                                  // 62
				function key(file, metaContext) {                                                                                  // 62
					var path = RocketChat.hostname + '/' + metaContext.rid + '/' + this.userId + '/';                                 // 63
                                                                                                                       //
					var upload = {                                                                                                    // 65
						s3: {                                                                                                            // 66
							bucket: bucket,                                                                                                 // 67
							region: region,                                                                                                 // 68
							path: path                                                                                                      // 69
						}                                                                                                                // 66
					};                                                                                                                // 65
					var fileId = RocketChat.models.Uploads.insertFileInit(metaContext.rid, this.userId, 's3', file, upload);          // 72
                                                                                                                       //
					return path + fileId;                                                                                             // 74
				}                                                                                                                  // 75
                                                                                                                       //
				return key;                                                                                                        // 62
			}()                                                                                                                 // 62
		};                                                                                                                   // 58
                                                                                                                       //
		if (!_.isEmpty(acl)) {                                                                                               // 78
			config.acl = acl;                                                                                                   // 79
		}                                                                                                                    // 80
                                                                                                                       //
		if (!_.isEmpty(cdn)) {                                                                                               // 82
			config.cdn = cdn;                                                                                                   // 83
		}                                                                                                                    // 84
                                                                                                                       //
		if (!_.isEmpty(region)) {                                                                                            // 86
			config.region = region;                                                                                             // 87
		}                                                                                                                    // 88
                                                                                                                       //
		if (!_.isEmpty(bucketUrl)) {                                                                                         // 90
			config.bucketUrl = bucketUrl;                                                                                       // 91
		}                                                                                                                    // 92
                                                                                                                       //
		try {                                                                                                                // 94
			Slingshot.createDirective(directiveName, Slingshot.S3Storage, config);                                              // 95
		} catch (e) {                                                                                                        // 96
			SystemLogger.error('Error configuring S3 ->', e.message);                                                           // 97
		}                                                                                                                    // 98
	} else if (Slingshot._directives[directiveName]) {                                                                    // 99
		delete Slingshot._directives[directiveName];                                                                         // 100
	}                                                                                                                     // 101
}, 500);                                                                                                               // 102
                                                                                                                       //
RocketChat.settings.get('FileUpload_Storage_Type', createS3Directive);                                                 // 104
                                                                                                                       //
RocketChat.settings.get('FileUpload_S3_Bucket', createS3Directive);                                                    // 106
                                                                                                                       //
RocketChat.settings.get('FileUpload_S3_Acl', createS3Directive);                                                       // 108
                                                                                                                       //
RocketChat.settings.get('FileUpload_S3_AWSAccessKeyId', function (key, value) {                                        // 110
	S3accessKey = value;                                                                                                  // 111
	createS3Directive();                                                                                                  // 112
});                                                                                                                    // 113
                                                                                                                       //
RocketChat.settings.get('FileUpload_S3_AWSSecretAccessKey', function (key, value) {                                    // 115
	S3secretKey = value;                                                                                                  // 116
	createS3Directive();                                                                                                  // 117
});                                                                                                                    // 118
                                                                                                                       //
RocketChat.settings.get('FileUpload_S3_URLExpiryTimeSpan', function (key, value) {                                     // 120
	S3expiryTimeSpan = value;                                                                                             // 121
	createS3Directive();                                                                                                  // 122
});                                                                                                                    // 123
                                                                                                                       //
RocketChat.settings.get('FileUpload_S3_CDN', createS3Directive);                                                       // 125
                                                                                                                       //
RocketChat.settings.get('FileUpload_S3_Region', createS3Directive);                                                    // 127
                                                                                                                       //
RocketChat.settings.get('FileUpload_S3_BucketURL', createS3Directive);                                                 // 129
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"configFileUploadFileSystem.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/server/config/configFileUploadFileSystem.js                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals FileSystemStore:true, FileUpload, UploadFS, RocketChatFile */                                               // 1
                                                                                                                       //
var storeName = 'fileSystem';                                                                                          // 3
                                                                                                                       //
FileSystemStore = null;                                                                                                // 5
                                                                                                                       //
var createFileSystemStore = _.debounce(function () {                                                                   // 7
	var stores = UploadFS.getStores();                                                                                    // 8
	if (stores[storeName]) {                                                                                              // 9
		delete stores[storeName];                                                                                            // 10
	}                                                                                                                     // 11
	FileSystemStore = new UploadFS.store.Local({                                                                          // 12
		collection: RocketChat.models.Uploads.model,                                                                         // 13
		name: storeName,                                                                                                     // 14
		path: RocketChat.settings.get('FileUpload_FileSystemPath'), //'/tmp/uploads/photos',                                 // 15
		filter: new UploadFS.Filter({                                                                                        // 16
			onCheck: FileUpload.validateFileUpload                                                                              // 17
		}),                                                                                                                  // 16
		transformWrite: function () {                                                                                        // 19
			function transformWrite(readStream, writeStream, fileId, file) {                                                    // 19
				if (RocketChatFile.enabled === false || !/^image\/((x-windows-)?bmp|p?jpeg|png)$/.test(file.type)) {               // 20
					return readStream.pipe(writeStream);                                                                              // 21
				}                                                                                                                  // 22
                                                                                                                       //
				var stream = void 0;                                                                                               // 24
                                                                                                                       //
				var identify = function () {                                                                                       // 26
					function identify(err, data) {                                                                                    // 26
						if (err != null) {                                                                                               // 27
							return stream.pipe(writeStream);                                                                                // 28
						}                                                                                                                // 29
                                                                                                                       //
						file.identify = {                                                                                                // 31
							format: data.format,                                                                                            // 32
							size: data.size                                                                                                 // 33
						};                                                                                                               // 31
                                                                                                                       //
						if ([null, undefined, '', 'Unknown', 'Undefined'].indexOf(data.Orientation) === -1) {                            // 36
							return RocketChatFile.gm(stream).autoOrient().stream().pipe(writeStream);                                       // 37
						} else {                                                                                                         // 38
							return stream.pipe(writeStream);                                                                                // 39
						}                                                                                                                // 40
					}                                                                                                                 // 41
                                                                                                                       //
					return identify;                                                                                                  // 26
				}();                                                                                                               // 26
                                                                                                                       //
				stream = RocketChatFile.gm(readStream).identify(identify).stream();                                                // 43
				return;                                                                                                            // 44
			}                                                                                                                   // 45
                                                                                                                       //
			return transformWrite;                                                                                              // 19
		}()                                                                                                                  // 19
	});                                                                                                                   // 12
}, 500);                                                                                                               // 47
                                                                                                                       //
RocketChat.settings.get('FileUpload_FileSystemPath', createFileSystemStore);                                           // 49
                                                                                                                       //
var fs = Npm.require('fs');                                                                                            // 51
                                                                                                                       //
FileUpload.addHandler(storeName, {                                                                                     // 53
	get: function () {                                                                                                    // 54
		function get(file, req, res) {                                                                                       // 53
			var filePath = FileSystemStore.getFilePath(file._id, file);                                                         // 55
                                                                                                                       //
			try {                                                                                                               // 57
				var stat = Meteor.wrapAsync(fs.stat)(filePath);                                                                    // 58
                                                                                                                       //
				if (stat && stat.isFile()) {                                                                                       // 60
					file = FileUpload.addExtensionTo(file);                                                                           // 61
					res.setHeader('Content-Disposition', 'attachment; filename*=UTF-8\'\'' + encodeURIComponent(file.name));          // 62
					res.setHeader('Last-Modified', file.uploadedAt.toUTCString());                                                    // 63
					res.setHeader('Content-Type', file.type);                                                                         // 64
					res.setHeader('Content-Length', file.size);                                                                       // 65
                                                                                                                       //
					FileSystemStore.getReadStream(file._id, file).pipe(res);                                                          // 67
				}                                                                                                                  // 68
			} catch (e) {                                                                                                       // 69
				res.writeHead(404);                                                                                                // 70
				res.end();                                                                                                         // 71
				return;                                                                                                            // 72
			}                                                                                                                   // 73
		}                                                                                                                    // 74
                                                                                                                       //
		return get;                                                                                                          // 53
	}(),                                                                                                                  // 53
	'delete': function () {                                                                                               // 53
		function _delete(file) {                                                                                             // 53
			return FileSystemStore['delete'](file._id);                                                                         // 76
		}                                                                                                                    // 77
                                                                                                                       //
		return _delete;                                                                                                      // 53
	}()                                                                                                                   // 53
});                                                                                                                    // 53
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"configFileUploadGridFS.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/server/config/configFileUploadGridFS.js                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* globals FileUpload, UploadFS */                                                                                     // 1
var stream = Npm.require('stream');                                                                                    // 2
var zlib = Npm.require('zlib');                                                                                        // 3
                                                                                                                       //
// code from: https://github.com/jalik/jalik-ufs/blob/master/ufs-server.js#L91                                         // 5
var readFromGridFS = function readFromGridFS(storeName, fileId, file, headers, req, res) {                             // 6
	var store = UploadFS.getStore(storeName);                                                                             // 7
	var rs = store.getReadStream(fileId, file);                                                                           // 8
	var ws = new stream.PassThrough();                                                                                    // 9
                                                                                                                       //
	rs.on('error', function (err) {                                                                                       // 11
		store.onReadError.call(store, err, fileId, file);                                                                    // 12
		res.end();                                                                                                           // 13
	});                                                                                                                   // 14
	ws.on('error', function (err) {                                                                                       // 15
		store.onReadError.call(store, err, fileId, file);                                                                    // 16
		res.end();                                                                                                           // 17
	});                                                                                                                   // 18
	ws.on('close', function () {                                                                                          // 19
		// Close output stream at the end                                                                                    // 20
		ws.emit('end');                                                                                                      // 21
	});                                                                                                                   // 22
                                                                                                                       //
	var accept = req.headers['accept-encoding'] || '';                                                                    // 24
                                                                                                                       //
	// Transform stream                                                                                                   // 26
	store.transformRead(rs, ws, fileId, file, req, headers);                                                              // 27
                                                                                                                       //
	// Compress data using gzip                                                                                           // 29
	if (accept.match(/\bgzip\b/)) {                                                                                       // 30
		headers['Content-Encoding'] = 'gzip';                                                                                // 31
		delete headers['Content-Length'];                                                                                    // 32
		res.writeHead(200, headers);                                                                                         // 33
		ws.pipe(zlib.createGzip()).pipe(res);                                                                                // 34
	} else if (accept.match(/\bdeflate\b/)) {                                                                             // 35
		// Compress data using deflate                                                                                       // 36
		headers['Content-Encoding'] = 'deflate';                                                                             // 37
		delete headers['Content-Length'];                                                                                    // 38
		res.writeHead(200, headers);                                                                                         // 39
		ws.pipe(zlib.createDeflate()).pipe(res);                                                                             // 40
	} else {                                                                                                              // 41
		// Send raw data                                                                                                     // 42
		res.writeHead(200, headers);                                                                                         // 43
		ws.pipe(res);                                                                                                        // 44
	}                                                                                                                     // 45
};                                                                                                                     // 46
                                                                                                                       //
FileUpload.addHandler('rocketchat_uploads', {                                                                          // 48
	get: function () {                                                                                                    // 49
		function get(file, req, res) {                                                                                       // 48
			file = FileUpload.addExtensionTo(file);                                                                             // 50
			var headers = {                                                                                                     // 51
				'Content-Disposition': 'attachment; filename*=UTF-8\'\'' + encodeURIComponent(file.name),                          // 52
				'Last-Modified': file.uploadedAt.toUTCString(),                                                                    // 53
				'Content-Type': file.type,                                                                                         // 54
				'Content-Length': file.size                                                                                        // 55
			};                                                                                                                  // 51
			return readFromGridFS(file.store, file._id, file, headers, req, res);                                               // 57
		}                                                                                                                    // 58
                                                                                                                       //
		return get;                                                                                                          // 48
	}(),                                                                                                                  // 48
	'delete': function () {                                                                                               // 48
		function _delete(file) {                                                                                             // 48
			return Meteor.fileStore['delete'](file._id);                                                                        // 60
		}                                                                                                                    // 61
                                                                                                                       //
		return _delete;                                                                                                      // 48
	}()                                                                                                                   // 48
});                                                                                                                    // 48
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"methods":{"sendFileMessage.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/server/methods/sendFileMessage.js                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.methods({                                                                                                       // 1
	'sendFileMessage': function () {                                                                                      // 2
		function sendFileMessage(roomId, store, file) {                                                                      // 1
			if (!Meteor.userId()) {                                                                                             // 3
				throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'sendFileMessage' });                       // 4
			}                                                                                                                   // 5
                                                                                                                       //
			var room = Meteor.call('canAccessRoom', roomId, Meteor.userId());                                                   // 7
                                                                                                                       //
			if (!room) {                                                                                                        // 9
				return false;                                                                                                      // 10
			}                                                                                                                   // 11
                                                                                                                       //
			RocketChat.models.Uploads.updateFileComplete(file._id, Meteor.userId(), _.omit(file, '_id'));                       // 13
                                                                                                                       //
			var fileUrl = '/file-upload/' + file._id + '/' + file.name;                                                         // 15
                                                                                                                       //
			var attachment = {                                                                                                  // 17
				title: TAPi18n.__('Attachment_File_Uploaded') + ': ' + file.name,                                                  // 18
				title_link: fileUrl,                                                                                               // 19
				title_link_download: true                                                                                          // 20
			};                                                                                                                  // 17
                                                                                                                       //
			if (/^image\/.+/.test(file.type)) {                                                                                 // 23
				attachment.image_url = fileUrl;                                                                                    // 24
				attachment.image_type = file.type;                                                                                 // 25
				attachment.image_size = file.size;                                                                                 // 26
				if (file.identify && file.identify.size) {                                                                         // 27
					attachment.image_dimensions = file.identify.size;                                                                 // 28
				}                                                                                                                  // 29
			} else if (/^audio\/.+/.test(file.type)) {                                                                          // 30
				attachment.audio_url = fileUrl;                                                                                    // 31
				attachment.audio_type = file.type;                                                                                 // 32
				attachment.audio_size = file.size;                                                                                 // 33
			} else if (/^video\/.+/.test(file.type)) {                                                                          // 34
				attachment.video_url = fileUrl;                                                                                    // 35
				attachment.video_type = file.type;                                                                                 // 36
				attachment.video_size = file.size;                                                                                 // 37
			}                                                                                                                   // 38
                                                                                                                       //
			var msg = {                                                                                                         // 40
				_id: Random.id(),                                                                                                  // 41
				rid: roomId,                                                                                                       // 42
				msg: '',                                                                                                           // 43
				file: {                                                                                                            // 44
					_id: file._id                                                                                                     // 45
				},                                                                                                                 // 44
				groupable: false,                                                                                                  // 47
				attachments: [attachment]                                                                                          // 48
			};                                                                                                                  // 40
                                                                                                                       //
			return Meteor.call('sendMessage', msg);                                                                             // 51
		}                                                                                                                    // 52
                                                                                                                       //
		return sendFileMessage;                                                                                              // 1
	}()                                                                                                                   // 1
});                                                                                                                    // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"startup":{"settings.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rocketchat_file-upload/server/startup/settings.js                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RocketChat.settings.addGroup('FileUpload', function () {                                                               // 1
	this.add('FileUpload_Enabled', true, {                                                                                // 2
		type: 'boolean',                                                                                                     // 3
		'public': true                                                                                                       // 4
	});                                                                                                                   // 2
                                                                                                                       //
	this.add('FileUpload_MaxFileSize', 2097152, {                                                                         // 7
		type: 'int',                                                                                                         // 8
		'public': true                                                                                                       // 9
	});                                                                                                                   // 7
                                                                                                                       //
	this.add('FileUpload_MediaTypeWhiteList', 'image/*,audio/*,video/*,application/zip,application/x-rar-compressed,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document', {
		type: 'string',                                                                                                      // 13
		'public': true,                                                                                                      // 14
		i18nDescription: 'FileUpload_MediaTypeWhiteListDescription'                                                          // 15
	});                                                                                                                   // 12
                                                                                                                       //
	this.add('FileUpload_ProtectFiles', true, {                                                                           // 18
		type: 'boolean',                                                                                                     // 19
		'public': true,                                                                                                      // 20
		i18nDescription: 'FileUpload_ProtectFilesDescription'                                                                // 21
	});                                                                                                                   // 18
                                                                                                                       //
	this.add('FileUpload_Storage_Type', 'GridFS', {                                                                       // 24
		type: 'select',                                                                                                      // 25
		values: [{                                                                                                           // 26
			key: 'GridFS',                                                                                                      // 27
			i18nLabel: 'GridFS'                                                                                                 // 28
		}, {                                                                                                                 // 26
			key: 'AmazonS3',                                                                                                    // 30
			i18nLabel: 'AmazonS3'                                                                                               // 31
		}, {                                                                                                                 // 29
			key: 'FileSystem',                                                                                                  // 33
			i18nLabel: 'FileSystem'                                                                                             // 34
		}],                                                                                                                  // 32
		'public': true                                                                                                       // 36
	});                                                                                                                   // 24
                                                                                                                       //
	this.section('Amazon S3', function () {                                                                               // 39
		this.add('FileUpload_S3_Bucket', '', {                                                                               // 40
			type: 'string',                                                                                                     // 41
			enableQuery: {                                                                                                      // 42
				_id: 'FileUpload_Storage_Type',                                                                                    // 43
				value: 'AmazonS3'                                                                                                  // 44
			}                                                                                                                   // 42
		});                                                                                                                  // 40
		this.add('FileUpload_S3_Acl', '', {                                                                                  // 47
			type: 'string',                                                                                                     // 48
			enableQuery: {                                                                                                      // 49
				_id: 'FileUpload_Storage_Type',                                                                                    // 50
				value: 'AmazonS3'                                                                                                  // 51
			}                                                                                                                   // 49
		});                                                                                                                  // 47
		this.add('FileUpload_S3_AWSAccessKeyId', '', {                                                                       // 54
			type: 'string',                                                                                                     // 55
			enableQuery: {                                                                                                      // 56
				_id: 'FileUpload_Storage_Type',                                                                                    // 57
				value: 'AmazonS3'                                                                                                  // 58
			}                                                                                                                   // 56
		});                                                                                                                  // 54
		this.add('FileUpload_S3_AWSSecretAccessKey', '', {                                                                   // 61
			type: 'string',                                                                                                     // 62
			enableQuery: {                                                                                                      // 63
				_id: 'FileUpload_Storage_Type',                                                                                    // 64
				value: 'AmazonS3'                                                                                                  // 65
			}                                                                                                                   // 63
		});                                                                                                                  // 61
		this.add('FileUpload_S3_CDN', '', {                                                                                  // 68
			type: 'string',                                                                                                     // 69
			enableQuery: {                                                                                                      // 70
				_id: 'FileUpload_Storage_Type',                                                                                    // 71
				value: 'AmazonS3'                                                                                                  // 72
			}                                                                                                                   // 70
		});                                                                                                                  // 68
		this.add('FileUpload_S3_Region', '', {                                                                               // 75
			type: 'string',                                                                                                     // 76
			enableQuery: {                                                                                                      // 77
				_id: 'FileUpload_Storage_Type',                                                                                    // 78
				value: 'AmazonS3'                                                                                                  // 79
			}                                                                                                                   // 77
		});                                                                                                                  // 75
		this.add('FileUpload_S3_BucketURL', '', {                                                                            // 82
			type: 'string',                                                                                                     // 83
			enableQuery: {                                                                                                      // 84
				_id: 'FileUpload_Storage_Type',                                                                                    // 85
				value: 'AmazonS3'                                                                                                  // 86
			},                                                                                                                  // 84
			i18nDescription: 'Override_URL_to_which_files_are_uploaded_This_url_also_used_for_downloads_unless_a_CDN_is_given.'
		});                                                                                                                  // 82
		this.add('FileUpload_S3_URLExpiryTimeSpan', 120, {                                                                   // 90
			type: 'int',                                                                                                        // 91
			enableQuery: {                                                                                                      // 92
				_id: 'FileUpload_Storage_Type',                                                                                    // 93
				value: 'AmazonS3'                                                                                                  // 94
			},                                                                                                                  // 92
			i18nDescription: 'FileUpload_S3_URLExpiryTimeSpan_Description'                                                      // 96
		});                                                                                                                  // 90
	});                                                                                                                   // 98
                                                                                                                       //
	this.section('File System', function () {                                                                             // 100
		this.add('FileUpload_FileSystemPath', '', {                                                                          // 101
			type: 'string',                                                                                                     // 102
			enableQuery: {                                                                                                      // 103
				_id: 'FileUpload_Storage_Type',                                                                                    // 104
				value: 'FileSystem'                                                                                                // 105
			}                                                                                                                   // 103
		});                                                                                                                  // 101
	});                                                                                                                   // 108
});                                                                                                                    // 109
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"node_modules":{"filesize":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// .npm/package/node_modules/filesize/package.json                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
exports.name = "filesize";
exports.version = "3.3.0";
exports.main = "lib/filesize";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"filesize.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/rocketchat:file-upload/node_modules/filesize/lib/filesize.js                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
"use strict";

/**
 * filesize
 *
 * @copyright 2016 Jason Mulligan <jason.mulligan@avoidwork.com>
 * @license BSD-3-Clause
 * @version 3.3.0
 */
(function (global) {
	var b = /^(b|B)$/;
	var symbol = {
		iec: {
			bits: ["b", "Kib", "Mib", "Gib", "Tib", "Pib", "Eib", "Zib", "Yib"],
			bytes: ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"]
		},
		jedec: {
			bits: ["b", "Kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb"],
			bytes: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
		}
	};

	/**
  * filesize
  *
  * @method filesize
  * @param  {Mixed}   arg        String, Int or Float to transform
  * @param  {Object}  descriptor [Optional] Flags
  * @return {String}             Readable file size String
  */
	function filesize(arg) {
		var descriptor = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

		var result = [],
		    val = 0,
		    e = void 0,
		    base = void 0,
		    bits = void 0,
		    ceil = void 0,
		    neg = void 0,
		    num = void 0,
		    output = void 0,
		    round = void 0,
		    unix = void 0,
		    spacer = void 0,
		    standard = void 0,
		    symbols = void 0;

		if (isNaN(arg)) {
			throw new Error("Invalid arguments");
		}

		bits = descriptor.bits === true;
		unix = descriptor.unix === true;
		base = descriptor.base || 2;
		round = descriptor.round !== undefined ? descriptor.round : unix ? 1 : 2;
		spacer = descriptor.spacer !== undefined ? descriptor.spacer : unix ? "" : " ";
		symbols = descriptor.symbols || descriptor.suffixes || {};
		standard = base === 2 ? descriptor.standard || "jedec" : "jedec";
		output = descriptor.output || "string";
		e = descriptor.exponent !== undefined ? descriptor.exponent : -1;
		num = Number(arg);
		neg = num < 0;
		ceil = base > 2 ? 1000 : 1024;

		// Flipping a negative number to determine the size
		if (neg) {
			num = -num;
		}

		// Zero is now a special case because bytes divide by 1
		if (num === 0) {
			result[0] = 0;
			result[1] = unix ? "" : !bits ? "B" : "b";
		} else {
			// Determining the exponent
			if (e === -1 || isNaN(e)) {
				e = Math.floor(Math.log(num) / Math.log(ceil));

				if (e < 0) {
					e = 0;
				}
			}

			// Exceeding supported length, time to reduce & multiply
			if (e > 8) {
				e = 8;
			}

			val = base === 2 ? num / Math.pow(2, e * 10) : num / Math.pow(1000, e);

			if (bits) {
				val = val * 8;

				if (val > ceil && e < 8) {
					val = val / ceil;
					e++;
				}
			}

			result[0] = Number(val.toFixed(e > 0 ? round : 0));
			result[1] = base === 10 && e === 1 ? bits ? "kb" : "kB" : symbol[standard][bits ? "bits" : "bytes"][e];

			if (unix) {
				result[1] = standard === "jedec" ? result[1].charAt(0) : e > 0 ? result[1].replace(/B$/, "") : result[1];

				if (b.test(result[1])) {
					result[0] = Math.floor(result[0]);
					result[1] = "";
				}
			}
		}

		// Decorating a 'diff'
		if (neg) {
			result[0] = -result[0];
		}

		// Applying custom symbol
		result[1] = symbols[result[1]] || result[1];

		// Returning Array, Object, or String (default)
		if (output === "array") {
			return result;
		}

		if (output === "exponent") {
			return e;
		}

		if (output === "object") {
			return { value: result[0], suffix: result[1], symbol: result[1] };
		}

		return result.join(spacer);
	}

	// CommonJS, AMD, script tag
	if (typeof exports !== "undefined") {
		module.exports = filesize;
	} else if (typeof define === "function" && define.amd) {
		define(function () {
			return filesize;
		});
	} else {
		global.filesize = filesize;
	}
})(typeof window !== "undefined" ? window : global);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/rocketchat:file-upload/globalFileRestrictions.js");
require("./node_modules/meteor/rocketchat:file-upload/lib/FileUpload.js");
require("./node_modules/meteor/rocketchat:file-upload/lib/FileUploadBase.js");
require("./node_modules/meteor/rocketchat:file-upload/server/lib/FileUpload.js");
require("./node_modules/meteor/rocketchat:file-upload/server/lib/requests.js");
require("./node_modules/meteor/rocketchat:file-upload/server/config/configFileUploadAmazonS3.js");
require("./node_modules/meteor/rocketchat:file-upload/server/config/configFileUploadFileSystem.js");
require("./node_modules/meteor/rocketchat:file-upload/server/config/configFileUploadGridFS.js");
require("./node_modules/meteor/rocketchat:file-upload/server/methods/sendFileMessage.js");
require("./node_modules/meteor/rocketchat:file-upload/server/startup/settings.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['rocketchat:file-upload'] = {}, {
  fileUploadHandler: fileUploadHandler,
  FileUpload: FileUpload
});

})();

//# sourceMappingURL=rocketchat_file-upload.js.map
