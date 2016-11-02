(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var __coffeescriptShare, Autocomplete, AutocompleteTest;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                        //
// packages/mizzao_autocomplete/autocomplete-server.coffee.js                             //
//                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////
                                                                                          //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                                                                                          // 1
                                                                                          //
Autocomplete = (function() {                                                              // 1
  function Autocomplete() {}                                                              //
                                                                                          //
  Autocomplete.publishCursor = function(cursor, sub) {                                    //
    return Mongo.Collection._publishCursor(cursor, sub, "autocompleteRecords");           //
  };                                                                                      //
                                                                                          //
  return Autocomplete;                                                                    //
                                                                                          //
})();                                                                                     //
                                                                                          //
Meteor.publish('autocomplete-recordset', function(selector, options, collName) {          // 7
  var collection;                                                                         // 8
  collection = global[collName];                                                          //
  if (!collection) {                                                                      //
    throw new Error(collName + ' is not defined on the global namespace of the server.');
  }                                                                                       //
  if (!collection._isInsecure()) {                                                        //
    Meteor._debug(collName + ' is a secure collection, therefore no data was returned because the client could compromise security by subscribing to arbitrary server collections via the browser console. Please write your own publish function.');
    return [];                                                                            // 16
  }                                                                                       //
  if (options.limit) {                                                                    //
    options.limit = Math.min(50, Math.abs(options.limit));                                //
  }                                                                                       //
  Autocomplete.publishCursor(collection.find(selector, options), this);                   //
  return this.ready();                                                                    //
});                                                                                       // 7
                                                                                          //
////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['mizzao:autocomplete'] = {}, {
  Autocomplete: Autocomplete,
  AutocompleteTest: AutocompleteTest
});

})();

//# sourceMappingURL=mizzao_autocomplete.js.map
