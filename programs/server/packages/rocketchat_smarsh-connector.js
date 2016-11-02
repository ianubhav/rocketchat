(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var _ = Package.underscore._;
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
var moment = Package['momentjs:moment'].moment;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:smarsh-connector":{"lib":{"rocketchat.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_smarsh-connector/lib/rocketchat.js                                                         //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
RocketChat.smarsh = {};                                                                                           // 1
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"settings.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_smarsh-connector/server/settings.js                                                        //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
RocketChat.settings.addGroup('Smarsh', function () {                                                              // 1
	function addSettings() {                                                                                         // 1
		this.add('Smarsh_Enabled', false, {                                                                             // 2
			type: 'boolean',                                                                                               // 3
			i18nLabel: 'Smarsh_Enabled',                                                                                   // 4
			enableQuery: {                                                                                                 // 5
				_id: 'From_Email',                                                                                            // 6
				value: {                                                                                                      // 7
					$exists: 1,                                                                                                  // 8
					$ne: ''                                                                                                      // 9
				}                                                                                                             // 7
			}                                                                                                              // 5
		});                                                                                                             // 2
		this.add('Smarsh_Email', '', {                                                                                  // 13
			type: 'string',                                                                                                // 14
			i18nLabel: 'Smarsh_Email',                                                                                     // 15
			placeholder: 'email@domain.com'                                                                                // 16
		});                                                                                                             // 13
		this.add('Smarsh_MissingEmail_Email', 'no-email@example.com', {                                                 // 18
			type: 'string',                                                                                                // 19
			i18nLabel: 'Smarsh_MissingEmail_Email',                                                                        // 20
			placeholder: 'no-email@example.com'                                                                            // 21
		});                                                                                                             // 18
                                                                                                                  //
		var zoneValues = moment.tz.names().map(function () {                                                            // 24
			function _timeZonesToSettings(name) {                                                                          // 24
				return {                                                                                                      // 25
					key: name,                                                                                                   // 26
					i18nLabel: name                                                                                              // 27
				};                                                                                                            // 25
			}                                                                                                              // 29
                                                                                                                  //
			return _timeZonesToSettings;                                                                                   // 24
		}());                                                                                                           // 24
		this.add('Smarsh_Timezone', 'America/Los_Angeles', {                                                            // 30
			type: 'select',                                                                                                // 31
			values: zoneValues                                                                                             // 32
		});                                                                                                             // 30
                                                                                                                  //
		this.add('Smarsh_Interval', 'every_30_minutes', {                                                               // 35
			type: 'select',                                                                                                // 36
			values: [{                                                                                                     // 37
				key: 'every_30_seconds',                                                                                      // 38
				i18nLabel: 'every_30_seconds'                                                                                 // 39
			}, {                                                                                                           // 37
				key: 'every_30_minutes',                                                                                      // 41
				i18nLabel: 'every_30_minutes'                                                                                 // 42
			}, {                                                                                                           // 40
				key: 'every_1_hours',                                                                                         // 44
				i18nLabel: 'every_hour'                                                                                       // 45
			}, {                                                                                                           // 43
				key: 'every_6_hours',                                                                                         // 47
				i18nLabel: 'every_six_hours'                                                                                  // 48
			}],                                                                                                            // 46
			enableQuery: {                                                                                                 // 50
				_id: 'From_Email',                                                                                            // 51
				value: {                                                                                                      // 52
					$exists: 1,                                                                                                  // 53
					$ne: ''                                                                                                      // 54
				}                                                                                                             // 52
			}                                                                                                              // 50
		});                                                                                                             // 35
	}                                                                                                                // 58
                                                                                                                  //
	return addSettings;                                                                                              // 1
}());                                                                                                             // 1
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"models":{"SmarshHistory.js":["babel-runtime/helpers/classCallCheck","babel-runtime/helpers/possibleConstructorReturn","babel-runtime/helpers/inherits",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_smarsh-connector/server/models/SmarshHistory.js                                            //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _classCallCheck;module.import('babel-runtime/helpers/classCallCheck',{"default":function(v){_classCallCheck=v}});var _possibleConstructorReturn;module.import('babel-runtime/helpers/possibleConstructorReturn',{"default":function(v){_possibleConstructorReturn=v}});var _inherits;module.import('babel-runtime/helpers/inherits',{"default":function(v){_inherits=v}});
                                                                                                                  //
                                                                                                                  //
RocketChat.smarsh.History = new (function (_RocketChat$models$_B) {                                               // 1
	_inherits(_class, _RocketChat$models$_B);                                                                        // 1
                                                                                                                  //
	function _class() {                                                                                              // 2
		_classCallCheck(this, _class);                                                                                  // 2
                                                                                                                  //
		return _possibleConstructorReturn(this, _RocketChat$models$_B.call(this, 'smarsh_history'));                    // 2
	}                                                                                                                // 4
                                                                                                                  //
	return _class;                                                                                                   // 1
}(RocketChat.models._Base))();                                                                                    // 1
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]},"functions":{"sendEmail.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_smarsh-connector/server/functions/sendEmail.js                                             //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
/* globals UploadFS */                                                                                            // 1
//Expects the following details:                                                                                  // 2
// {                                                                                                              // 3
// 	body: '<table>',                                                                                              // 4
// 	subject: 'Rocket.Chat, 17 Users, 24 Messages, 1 File, 799504 Minutes, in #random',                            // 5
//  files: ['i3nc9l3mn']                                                                                          // 6
// }                                                                                                              // 7
                                                                                                                  //
RocketChat.smarsh.sendEmail = function (data) {                                                                   // 9
	var attachments = [];                                                                                            // 10
                                                                                                                  //
	if (data.files.length > 0) {                                                                                     // 12
		_.each(data.files, function (fileId) {                                                                          // 13
			var file = RocketChat.models.Uploads.findOneById(fileId);                                                      // 14
			if (file.store === 'rocketchat_uploads' || file.store === 'fileSystem') {                                      // 15
				var rs = UploadFS.getStore(file.store).getReadStream(fileId, file);                                           // 16
				attachments.push({                                                                                            // 17
					filename: file.name,                                                                                         // 18
					streamSource: rs                                                                                             // 19
				});                                                                                                           // 17
			}                                                                                                              // 21
		});                                                                                                             // 22
	}                                                                                                                // 23
                                                                                                                  //
	Email.send({                                                                                                     // 25
		to: RocketChat.settings.get('Smarsh_Email'),                                                                    // 26
		from: RocketChat.settings.get('From_Email'),                                                                    // 27
		subject: data.subject,                                                                                          // 28
		html: data.body,                                                                                                // 29
		attachments: attachments                                                                                        // 30
	});                                                                                                              // 25
};                                                                                                                // 32
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"generateEml.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_smarsh-connector/server/functions/generateEml.js                                           //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var start = '<table style="width: 100%; border: 1px solid; border-collapse: collapse; table-layout: fixed; margin-top: 10px; font-size: 12px; word-break: break-word;"><tbody>';
var end = '</tbody></table>';                                                                                     // 2
var opentr = '<tr style="border: 1px solid;">';                                                                   // 3
var closetr = '</tr>';                                                                                            // 4
var open20td = '<td style="border: 1px solid; text-align: center; width: 20%;">';                                 // 5
var open60td = '<td style="border: 1px solid; text-align: left; width: 60%; padding: 0 5px;">';                   // 6
var closetd = '</td>';                                                                                            // 7
                                                                                                                  //
function _getLink(attachment) {                                                                                   // 9
	var url = attachment.title_link.replace(/ /g, '%20');                                                            // 10
                                                                                                                  //
	if (Meteor.settings['public'].sandstorm || url.match(/^(https?:)?\/\//i)) {                                      // 12
		return url;                                                                                                     // 13
	} else {                                                                                                         // 14
		return Meteor.absoluteUrl().replace(/\/$/, '') + __meteor_runtime_config__.ROOT_URL_PATH_PREFIX + url;          // 15
	}                                                                                                                // 16
}                                                                                                                 // 17
                                                                                                                  //
RocketChat.smarsh.generateEml = function () {                                                                     // 19
	Meteor.defer(function () {                                                                                       // 20
		var smarshMissingEmail = RocketChat.settings.get('Smarsh_MissingEmail_Email');                                  // 21
		var timeZone = RocketChat.settings.get('Smarsh_Timezone');                                                      // 22
                                                                                                                  //
		RocketChat.models.Rooms.find().forEach(function (room) {                                                        // 24
			var smarshHistory = RocketChat.smarsh.History.findOne({ _id: room._id });                                      // 25
			var query = { rid: room._id };                                                                                 // 26
                                                                                                                  //
			if (smarshHistory) {                                                                                           // 28
				query.ts = { $gt: smarshHistory.lastRan };                                                                    // 29
			}                                                                                                              // 30
                                                                                                                  //
			var date = new Date();                                                                                         // 32
			var rows = [];                                                                                                 // 33
			var data = {                                                                                                   // 34
				users: [],                                                                                                    // 35
				msgs: 0,                                                                                                      // 36
				files: [],                                                                                                    // 37
				time: smarshHistory ? moment(date).diff(moment(smarshHistory.lastRan), 'minutes') : moment(date).diff(moment(room.ts), 'minutes'),
				room: room.name ? '#' + room.name : 'Direct Message Between: ' + room.usernames.join(' & ')                   // 39
			};                                                                                                             // 34
                                                                                                                  //
			RocketChat.models.Messages.find(query).forEach(function (message) {                                            // 42
				rows.push(opentr);                                                                                            // 43
                                                                                                                  //
				//The timestamp                                                                                               // 45
				rows.push(open20td);                                                                                          // 46
				rows.push(moment(message.ts).tz(timeZone).format('YYYY-MM-DD HH-mm-ss z'));                                   // 47
				rows.push(closetd);                                                                                           // 48
                                                                                                                  //
				//The sender                                                                                                  // 50
				rows.push(open20td);                                                                                          // 51
				var sender = RocketChat.models.Users.findOne({ _id: message.u._id });                                         // 52
				if (data.users.indexOf(sender._id) === -1) {                                                                  // 53
					data.users.push(sender._id);                                                                                 // 54
				}                                                                                                             // 55
                                                                                                                  //
				//Get the user's email, can be nothing if it is an unconfigured bot account (like rocket.cat)                 // 57
				if (sender.emails && sender.emails[0] && sender.emails[0].address) {                                          // 58
					rows.push(sender.name + ' &lt;' + sender.emails[0].address + '&gt;');                                        // 59
				} else {                                                                                                      // 60
					rows.push(sender.name + ' &lt;' + smarshMissingEmail + '&gt;');                                              // 61
				}                                                                                                             // 62
				rows.push(closetd);                                                                                           // 63
                                                                                                                  //
				//The message                                                                                                 // 65
				rows.push(open60td);                                                                                          // 66
				data.msgs++;                                                                                                  // 67
				if (message.t) {                                                                                              // 68
					var messageType = RocketChat.MessageTypes.getType(message);                                                  // 69
					if (messageType) {                                                                                           // 70
						rows.push(TAPi18n.__(messageType.message, messageType.data ? messageType.data(message) : '', 'en'));        // 71
					} else {                                                                                                     // 72
						rows.push(message.msg + ' (' + message.t + ')');                                                            // 73
					}                                                                                                            // 74
				} else if (message.file) {                                                                                    // 75
					data.files.push(message.file._id);                                                                           // 76
					rows.push(message.attachments[0].title + ' (' + _getLink(message.attachments[0]) + ')');                     // 77
				} else if (message.attachments) {                                                                             // 78
					(function () {                                                                                               // 78
						var attaches = [];                                                                                          // 79
						_.each(message.attachments, function () {                                                                   // 80
							function _loopThroughMessageAttachments(a) {                                                               // 80
								if (a.image_url) {                                                                                        // 81
									attaches.push(a.image_url);                                                                              // 82
								}                                                                                                         // 83
								//TODO: Verify other type of attachments which need to be handled that aren't file uploads and image urls
								// } else {                                                                                               // 85
								// 	console.log(a);                                                                                       // 86
								// }                                                                                                      // 87
							}                                                                                                          // 88
                                                                                                                  //
							return _loopThroughMessageAttachments;                                                                     // 80
						}());                                                                                                       // 80
                                                                                                                  //
						rows.push(message.msg + ' (' + attaches.join(', ') + ')');                                                  // 90
					})();                                                                                                        // 78
				} else {                                                                                                      // 91
					rows.push(message.msg);                                                                                      // 92
				}                                                                                                             // 93
				rows.push(closetd);                                                                                           // 94
                                                                                                                  //
				rows.push(closetr);                                                                                           // 96
			});                                                                                                            // 97
                                                                                                                  //
			if (rows.length !== 0) {                                                                                       // 99
				var result = start + rows.join('') + end;                                                                     // 100
                                                                                                                  //
				RocketChat.smarsh.History.upsert({ _id: room._id }, {                                                         // 102
					_id: room._id,                                                                                               // 103
					lastRan: date,                                                                                               // 104
					lastResult: result                                                                                           // 105
				});                                                                                                           // 102
                                                                                                                  //
				RocketChat.smarsh.sendEmail({                                                                                 // 108
					body: result,                                                                                                // 109
					subject: 'Rocket.Chat, ' + data.users.length + ' Users, ' + data.msgs + ' Messages, ' + data.files.length + ' Files, ' + data.time + ' Minutes, in ' + data.room,
					files: data.files                                                                                            // 111
				});                                                                                                           // 108
			}                                                                                                              // 113
		});                                                                                                             // 114
	});                                                                                                              // 115
};                                                                                                                // 116
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"startup.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/rocketchat_smarsh-connector/server/startup.js                                                         //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
/* globals SyncedCron */                                                                                          // 1
var smarshJobName = 'Smarsh EML Connector';                                                                       // 2
                                                                                                                  //
var _addSmarshSyncedCronJob = _.debounce(Meteor.bindEnvironment(function () {                                     // 4
	function __addSmarshSyncedCronJobDebounced() {                                                                   // 4
		if (SyncedCron.nextScheduledAtDate(smarshJobName)) {                                                            // 5
			SyncedCron.remove(smarshJobName);                                                                              // 6
		}                                                                                                               // 7
                                                                                                                  //
		if (RocketChat.settings.get('Smarsh_Enabled') && RocketChat.settings.get('Smarsh_Email') !== '' && RocketChat.settings.get('From_Email') !== '') {
			SyncedCron.add({                                                                                               // 10
				name: smarshJobName,                                                                                          // 11
				schedule: function () {                                                                                       // 12
					function schedule(parser) {                                                                                  // 12
						return parser.text(RocketChat.settings.get('Smarsh_Interval').replace(/_/g, ' '));                          // 12
					}                                                                                                            // 12
                                                                                                                  //
					return schedule;                                                                                             // 12
				}(),                                                                                                          // 12
				job: RocketChat.smarsh.generateEml                                                                            // 13
			});                                                                                                            // 10
		}                                                                                                               // 15
	}                                                                                                                // 16
                                                                                                                  //
	return __addSmarshSyncedCronJobDebounced;                                                                        // 4
}()), 500);                                                                                                       // 4
                                                                                                                  //
Meteor.startup(function () {                                                                                      // 18
	Meteor.defer(function () {                                                                                       // 19
		_addSmarshSyncedCronJob();                                                                                      // 20
                                                                                                                  //
		RocketChat.settings.get('Smarsh_Interval', _addSmarshSyncedCronJob);                                            // 22
		RocketChat.settings.get('Smarsh_Enabled', _addSmarshSyncedCronJob);                                             // 23
		RocketChat.settings.get('Smarsh_Email', _addSmarshSyncedCronJob);                                               // 24
		RocketChat.settings.get('From_Email', _addSmarshSyncedCronJob);                                                 // 25
	});                                                                                                              // 26
});                                                                                                               // 27
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/rocketchat:smarsh-connector/lib/rocketchat.js");
require("./node_modules/meteor/rocketchat:smarsh-connector/server/settings.js");
require("./node_modules/meteor/rocketchat:smarsh-connector/server/models/SmarshHistory.js");
require("./node_modules/meteor/rocketchat:smarsh-connector/server/functions/sendEmail.js");
require("./node_modules/meteor/rocketchat:smarsh-connector/server/functions/generateEml.js");
require("./node_modules/meteor/rocketchat:smarsh-connector/server/startup.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:smarsh-connector'] = {};

})();

//# sourceMappingURL=rocketchat_smarsh-connector.js.map
