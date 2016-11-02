(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var RocketChat = Package['rocketchat:lib'].RocketChat;
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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:piwik":{"server":{"settings.js":function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/rocketchat_piwik/server/settings.js                      //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
RocketChat.settings.addGroup('Piwik', function () {                  // 1
	function addSettings() {                                            // 1
		this.add('PiwikAnalytics_url', '', {                               // 2
			type: 'string',                                                   // 3
			'public': true,                                                   // 4
			i18nLabel: 'URL'                                                  // 5
		});                                                                // 2
		this.add('PiwikAnalytics_siteId', '', {                            // 7
			type: 'string',                                                   // 8
			'public': true,                                                   // 9
			i18nLabel: 'Client_ID'                                            // 10
		});                                                                // 7
                                                                     //
		this.section('Analytics_features_enabled', function () {           // 13
			function addFeaturesEnabledSettings() {                           // 13
				this.add('PiwikAnalytics_features_messages', true, {             // 14
					type: 'boolean',                                                // 15
					'public': true,                                                 // 16
					i18nLabel: 'Messages',                                          // 17
					i18nDescription: 'Analytics_features_messages_Description'      // 18
				});                                                              // 14
				this.add('PiwikAnalytics_features_rooms', true, {                // 20
					type: 'boolean',                                                // 21
					'public': true,                                                 // 22
					i18nLabel: 'Rooms',                                             // 23
					i18nDescription: 'Analytics_features_rooms_Description'         // 24
				});                                                              // 20
				this.add('PiwikAnalytics_features_users', true, {                // 26
					type: 'boolean',                                                // 27
					'public': true,                                                 // 28
					i18nLabel: 'Users',                                             // 29
					i18nDescription: 'Analytics_features_users_Description'         // 30
				});                                                              // 26
			}                                                                 // 32
                                                                     //
			return addFeaturesEnabledSettings;                                // 13
		}());                                                              // 13
	}                                                                   // 33
                                                                     //
	return addSettings;                                                 // 1
}());                                                                // 1
///////////////////////////////////////////////////////////////////////

}}}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/rocketchat:piwik/server/settings.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:piwik'] = {};

})();

//# sourceMappingURL=rocketchat_piwik.js.map
