(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var ECMAScript = Package.ecmascript.ECMAScript;
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

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:slashcommands-asciiarts":{"gimme.js":function(){

////////////////////////////////////////////////////////////////////////
//                                                                    //
// packages/rocketchat_slashcommands-asciiarts/gimme.js               //
//                                                                    //
////////////////////////////////////////////////////////////////////////
                                                                      //
/*                                                                    // 1
* Gimme is a named function that will replace /gimme commands         //
* @param {Object} message - The message object                        //
*/                                                                    //
                                                                      //
function Gimme(command, params, item) {                               // 7
	if (command === 'gimme') {                                           // 8
		var msg;                                                            // 9
                                                                      //
		msg = item;                                                         // 11
		msg.msg = '༼ つ ◕_◕ ༽つ ' + params;                                   // 12
		Meteor.call('sendMessage', msg);                                    // 13
	}                                                                    // 14
}                                                                     // 15
                                                                      //
RocketChat.slashCommands.add('gimme', Gimme, {                        // 17
	description: 'Slash_Gimme_Description',                              // 18
	params: 'your_message_optional'                                      // 19
});                                                                   // 17
////////////////////////////////////////////////////////////////////////

},"lenny.js":function(){

////////////////////////////////////////////////////////////////////////
//                                                                    //
// packages/rocketchat_slashcommands-asciiarts/lenny.js               //
//                                                                    //
////////////////////////////////////////////////////////////////////////
                                                                      //
/*                                                                    // 1
* Lenny is a named function that will replace /lenny commands         //
* @param {Object} message - The message object                        //
*/                                                                    //
                                                                      //
function LennyFace(command, params, item) {                           // 7
	if (command === 'lennyface') {                                       // 8
		var msg;                                                            // 9
                                                                      //
		msg = item;                                                         // 11
		msg.msg = params + ' ( ͡° ͜ʖ ͡°)';                                  // 12
		Meteor.call('sendMessage', msg);                                    // 13
	}                                                                    // 14
}                                                                     // 15
                                                                      //
RocketChat.slashCommands.add('lennyface', LennyFace, {                // 17
	description: 'Slash_LennyFace_Description',                          // 18
	params: 'your_message_optional'                                      // 19
});                                                                   // 17
////////////////////////////////////////////////////////////////////////

},"shrug.js":function(){

////////////////////////////////////////////////////////////////////////
//                                                                    //
// packages/rocketchat_slashcommands-asciiarts/shrug.js               //
//                                                                    //
////////////////////////////////////////////////////////////////////////
                                                                      //
/*                                                                    // 1
* Shrug is a named function that will replace /shrug commands         //
* @param {Object} message - The message object                        //
*/                                                                    //
                                                                      //
function Shrug(command, params, item) {                               // 7
	if (command === 'shrug') {                                           // 8
		var msg;                                                            // 9
                                                                      //
		msg = item;                                                         // 11
		msg.msg = params + ' ¯\\_(ツ)_/¯';                                   // 12
		Meteor.call('sendMessage', msg);                                    // 13
	}                                                                    // 14
}                                                                     // 15
                                                                      //
RocketChat.slashCommands.add('shrug', Shrug, {                        // 17
	description: 'Slash_Shrug_Description',                              // 18
	params: 'your_message_optional'                                      // 19
});                                                                   // 17
////////////////////////////////////////////////////////////////////////

},"tableflip.js":function(){

////////////////////////////////////////////////////////////////////////
//                                                                    //
// packages/rocketchat_slashcommands-asciiarts/tableflip.js           //
//                                                                    //
////////////////////////////////////////////////////////////////////////
                                                                      //
/*                                                                    // 1
* Tableflip is a named function that will replace /Tableflip commands
* @param {Object} message - The message object                        //
*/                                                                    //
                                                                      //
function Tableflip(command, params, item) {                           // 7
	if (command === 'tableflip') {                                       // 8
		var msg;                                                            // 9
                                                                      //
		msg = item;                                                         // 11
		msg.msg = params + ' (╯°□°）╯︵ ┻━┻';                                 // 12
		Meteor.call('sendMessage', msg);                                    // 13
	}                                                                    // 14
}                                                                     // 15
                                                                      //
RocketChat.slashCommands.add('tableflip', Tableflip, {                // 17
	description: 'Slash_Tableflip_Description',                          // 18
	params: 'your_message_optional'                                      // 19
});                                                                   // 17
////////////////////////////////////////////////////////////////////////

},"unflip.js":function(){

////////////////////////////////////////////////////////////////////////
//                                                                    //
// packages/rocketchat_slashcommands-asciiarts/unflip.js              //
//                                                                    //
////////////////////////////////////////////////////////////////////////
                                                                      //
/*                                                                    // 1
* Unflip is a named function that will replace /unflip commands       //
* @param {Object} message - The message object                        //
*/                                                                    //
                                                                      //
function Unflip(command, params, item) {                              // 7
	if (command === 'unflip') {                                          // 8
		var msg;                                                            // 9
                                                                      //
		msg = item;                                                         // 11
		msg.msg = params + ' ┬─┬﻿ ノ( ゜-゜ノ)';                                // 12
		Meteor.call('sendMessage', msg);                                    // 13
	}                                                                    // 14
}                                                                     // 15
                                                                      //
RocketChat.slashCommands.add('unflip', Unflip, {                      // 17
	description: 'Slash_TableUnflip_Description',                        // 18
	params: 'your_message_optional'                                      // 19
});                                                                   // 17
////////////////////////////////////////////////////////////////////////

}}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/rocketchat:slashcommands-asciiarts/gimme.js");
require("./node_modules/meteor/rocketchat:slashcommands-asciiarts/lenny.js");
require("./node_modules/meteor/rocketchat:slashcommands-asciiarts/shrug.js");
require("./node_modules/meteor/rocketchat:slashcommands-asciiarts/tableflip.js");
require("./node_modules/meteor/rocketchat:slashcommands-asciiarts/unflip.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:slashcommands-asciiarts'] = {};

})();

//# sourceMappingURL=rocketchat_slashcommands-asciiarts.js.map
