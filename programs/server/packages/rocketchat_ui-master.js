(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var Inject = Package['meteorhacks:inject-initial'].Inject;
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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:ui-master":{"server":{"inject.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/rocketchat_ui-master/server/inject.js                                                                    //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
/* globals Inject */                                                                                                 // 1
                                                                                                                     //
Inject.rawBody('page-loading', '\n<style>\n.loading {\n\ttop: 0;\n\tright: 0;\n\tbottom: 0;\n\tleft: 0;\n\tdisplay: flex;\n\talign-items: center;\n\tposition: absolute;\n\tjustify-content: center;\n\ttext-align: center;\n}\n.loading > div {\n\twidth: 10px;\n\theight: 10px;\n\tmargin: 2px;\n\tborder-radius: 100%;\n\tdisplay: inline-block;\n\t-webkit-animation: loading-bouncedelay 1.4s infinite ease-in-out both;\n\tanimation: loading-bouncedelay 1.4s infinite ease-in-out both;\n}\n.loading .bounce1 {\n\t-webkit-animation-delay: -0.32s;\n\tanimation-delay: -0.32s;\n}\n.loading .bounce2 {\n\t-webkit-animation-delay: -0.16s;\n\tanimation-delay: -0.16s;\n}\n@-webkit-keyframes loading-bouncedelay {\n\t0%, 80%, 100% { -webkit-transform: scale(0) }\n\t40% { -webkit-transform: scale(1.0) }\n}\n@keyframes loading-bouncedelay {\n\t0%, 80%, 100% { transform: scale(0); }\n\t40% { transform: scale(1.0); }\n}\n</style>\n<div id="initial-page-loading" class="page-loading">\n\t<div class="loading">\n\t\t<div class="bounce1"></div>\n\t\t<div class="bounce2"></div>\n\t\t<div class="bounce3"></div>\n\t</div>\n</div>');
                                                                                                                     //
RocketChat.settings.get('theme-color-primary-background-color', function (key, value) {                              // 51
	if (value) {                                                                                                        // 52
		Inject.rawHead('theme-color-primary-background-color', '<style>body { background-color: ' + value + ';}</style>');
	} else {                                                                                                            // 54
		Inject.rawHead('theme-color-primary-background-color', '<style>body { background-color: #04436a;}</style>');       // 55
	}                                                                                                                   // 56
});                                                                                                                  // 57
                                                                                                                     //
RocketChat.settings.get('theme-color-tertiary-background-color', function (key, value) {                             // 59
	if (value) {                                                                                                        // 60
		Inject.rawHead('theme-color-tertiary-background-color', '<style>.loading > div { background-color: ' + value + ';}</style>');
	} else {                                                                                                            // 62
		Inject.rawHead('theme-color-tertiary-background-color', '<style>.loading > div { background-color: #cccccc;}</style>');
	}                                                                                                                   // 64
});                                                                                                                  // 65
                                                                                                                     //
RocketChat.settings.get('Site_Url', function () {                                                                    // 67
	Meteor.defer(function () {                                                                                          // 68
		var baseUrl = void 0;                                                                                              // 69
		if (__meteor_runtime_config__.ROOT_URL_PATH_PREFIX && __meteor_runtime_config__.ROOT_URL_PATH_PREFIX.trim() !== '') {
			baseUrl = __meteor_runtime_config__.ROOT_URL_PATH_PREFIX;                                                         // 71
		} else {                                                                                                           // 72
			baseUrl = '/';                                                                                                    // 73
		}                                                                                                                  // 74
		if (/\/$/.test(baseUrl) === false) {                                                                               // 75
			baseUrl += '/';                                                                                                   // 76
		}                                                                                                                  // 77
		Inject.rawHead('base', '<base href="' + baseUrl + '">');                                                           // 78
	});                                                                                                                 // 79
});                                                                                                                  // 80
                                                                                                                     //
RocketChat.settings.get('Site_Name', function (key, value) {                                                         // 82
	if (value) {                                                                                                        // 83
		Inject.rawHead('title', '<title>' + value + '</title>');                                                           // 84
	} else {                                                                                                            // 85
		Inject.rawHead('title', '<title>Rocket.Chat</title>');                                                             // 86
	}                                                                                                                   // 87
});                                                                                                                  // 88
                                                                                                                     //
RocketChat.settings.get('GoogleSiteVerification_id', function (key, value) {                                         // 90
	if (value) {                                                                                                        // 91
		Inject.rawHead('google-site-verification', '<meta name="google-site-verification" content="' + value + '" />');    // 92
	} else {                                                                                                            // 93
		Inject.rawHead('google-site-verification', '');                                                                    // 94
	}                                                                                                                   // 95
});                                                                                                                  // 96
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{"extensions":[".js",".json",".coffee"]});
require("./node_modules/meteor/rocketchat:ui-master/server/inject.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:ui-master'] = {};

})();

//# sourceMappingURL=rocketchat_ui-master.js.map
