(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;

/* Package-scope variables */
var LDAPJS;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/rocketchat_ldapjs/lib/ldapjs.js                          //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
LDAPJS = Npm.require('ldapjs');

///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['rocketchat:ldapjs'] = {}, {
  LDAPJS: LDAPJS
});

})();
