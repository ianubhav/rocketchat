(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/rocketchat_colors/settings.js                            //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
RocketChat.settings.add('HexColorPreview_Enabled', true, {
	type: 'boolean',
	i18nLabel: 'Enabled',
	group: 'Message',
	section: 'Hex Color Preview',
	public: true
});

///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:colors'] = {};

})();
