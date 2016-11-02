(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var check = Package.check.check;
var Match = Package.check.Match;
var ECMAScript = Package.ecmascript.ECMAScript;
var UploadFS = Package['jalik:ufs'].UploadFS;
var _ = Package.underscore._;
var meteorInstall = Package.modules.meteorInstall;
var Buffer = Package.modules.Buffer;
var process = Package.modules.process;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"jalik:ufs-local":{"ufs-local.js":["meteor/underscore","meteor/check","meteor/meteor",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/jalik_ufs-local/ufs-local.js                                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _;module.import('meteor/underscore',{"_":function(v){_=v}});var check;module.import('meteor/check',{"check":function(v){check=v}});var Meteor;module.import('meteor/meteor',{"Meteor":function(v){Meteor=v}});
                                                                                                                      // 2
                                                                                                                      // 3
                                                                                                                      //
/**                                                                                                                   // 5
 * File system store                                                                                                  //
 * @param options                                                                                                     //
 * @constructor                                                                                                       //
 */                                                                                                                   //
UploadFS.store.Local = function (options) {                                                                           // 10
    // Default options                                                                                                // 11
    options = _.extend({                                                                                              // 12
        mode: '0744',                                                                                                 // 13
        path: 'ufs/uploads',                                                                                          // 14
        writeMode: '0744'                                                                                             // 15
    }, options);                                                                                                      // 12
                                                                                                                      //
    // Check options                                                                                                  // 18
    if (typeof options.mode !== 'string') {                                                                           // 19
        throw new TypeError('mode is not a string');                                                                  // 20
    }                                                                                                                 // 21
    if (typeof options.path !== 'string') {                                                                           // 22
        throw new TypeError('path is not a string');                                                                  // 23
    }                                                                                                                 // 24
    if (typeof options.writeMode !== 'string') {                                                                      // 25
        throw new TypeError('writeMode is not a string');                                                             // 26
    }                                                                                                                 // 27
                                                                                                                      //
    // Private attributes                                                                                             // 29
    var mode = options.mode;                                                                                          // 30
    var path = options.path;                                                                                          // 31
    var writeMode = options.writeMode;                                                                                // 32
                                                                                                                      //
    if (Meteor.isServer) {                                                                                            // 34
        (function () {                                                                                                // 34
            var fs = Npm.require('fs');                                                                               // 35
                                                                                                                      //
            fs.stat(path, function (err) {                                                                            // 37
                if (err) {                                                                                            // 38
                    var mkdirp = Npm.require('mkdirp');                                                               // 39
                                                                                                                      //
                    // Create the directory                                                                           // 41
                    mkdirp(path, { mode: mode }, function (err) {                                                     // 42
                        if (err) {                                                                                    // 43
                            console.error('ufs: cannot create store at ' + path + ' (' + err.message + ')');          // 44
                        } else {                                                                                      // 45
                            console.info('ufs: store created at ' + path);                                            // 46
                        }                                                                                             // 47
                    });                                                                                               // 48
                } else {                                                                                              // 49
                    // Set directory permissions                                                                      // 50
                    fs.chmod(path, mode, function (err) {                                                             // 51
                        err && console.error('ufs: cannot set store permissions ' + mode + ' (' + err.message + ')');
                    });                                                                                               // 53
                }                                                                                                     // 54
            });                                                                                                       // 55
        })();                                                                                                         // 34
    }                                                                                                                 // 56
                                                                                                                      //
    // Create the store                                                                                               // 58
    var self = new UploadFS.Store(options);                                                                           // 59
                                                                                                                      //
    /**                                                                                                               // 61
     * Returns the file path                                                                                          //
     * @param fileId                                                                                                  //
     * @param file                                                                                                    //
     * @return {string}                                                                                               //
     */                                                                                                               //
    self.getFilePath = function (fileId, file) {                                                                      // 67
        file = file || self.getCollection().findOne(fileId, { fields: { extension: 1 } });                            // 68
        return file && self.getPath(fileId + (file.extension ? '.' + file.extension : ''));                           // 69
    };                                                                                                                // 70
                                                                                                                      //
    /**                                                                                                               // 72
     * Returns the path or sub path                                                                                   //
     * @param file                                                                                                    //
     * @return {string}                                                                                               //
     */                                                                                                               //
    self.getPath = function (file) {                                                                                  // 77
        return path + (file ? '/' + file : '');                                                                       // 78
    };                                                                                                                // 79
                                                                                                                      //
    if (Meteor.isServer) {                                                                                            // 82
        /**                                                                                                           // 83
         * Removes the file                                                                                           //
         * @param fileId                                                                                              //
         * @param callback                                                                                            //
         */                                                                                                           //
        self['delete'] = function (fileId, callback) {                                                                // 88
            var path = self.getFilePath(fileId);                                                                      // 89
                                                                                                                      //
            if (typeof callback !== 'function') {                                                                     // 91
                callback = function callback(err) {                                                                   // 92
                    err && console.error('ufs: cannot delete file "' + fileId + '" at ' + path + ' (' + err.message + ')');
                };                                                                                                    // 94
            }                                                                                                         // 95
            var fs = Npm.require('fs');                                                                               // 96
            fs.stat(path, Meteor.bindEnvironment(function (err, stat) {                                               // 97
                if (!err && stat && stat.isFile()) {                                                                  // 98
                    fs.unlink(path, Meteor.bindEnvironment(function () {                                              // 99
                        self.getCollection().remove(fileId);                                                          // 100
                        callback.call(this);                                                                          // 101
                    }));                                                                                              // 102
                }                                                                                                     // 103
            }));                                                                                                      // 104
        };                                                                                                            // 105
                                                                                                                      //
        /**                                                                                                           // 107
         * Returns the file read stream                                                                               //
         * @param fileId                                                                                              //
         * @param file                                                                                                //
         * @param options                                                                                             //
         * @return {*}                                                                                                //
         */                                                                                                           //
        self.getReadStream = function (fileId, file, options) {                                                       // 114
            var fs = Npm.require('fs');                                                                               // 115
            options = _.extend({}, options);                                                                          // 116
            return fs.createReadStream(self.getFilePath(fileId, file), {                                              // 117
                flags: 'r',                                                                                           // 118
                encoding: null,                                                                                       // 119
                autoClose: true,                                                                                      // 120
                start: options.start,                                                                                 // 121
                end: options.end                                                                                      // 122
            });                                                                                                       // 117
        };                                                                                                            // 124
                                                                                                                      //
        /**                                                                                                           // 126
         * Returns the file write stream                                                                              //
         * @param fileId                                                                                              //
         * @param file                                                                                                //
         * @param options                                                                                             //
         * @return {*}                                                                                                //
         */                                                                                                           //
        self.getWriteStream = function (fileId, file, options) {                                                      // 133
            var fs = Npm.require('fs');                                                                               // 134
            options = _.extend({}, options);                                                                          // 135
            return fs.createWriteStream(self.getFilePath(fileId, file), {                                             // 136
                flags: 'a',                                                                                           // 137
                encoding: null,                                                                                       // 138
                mode: writeMode,                                                                                      // 139
                start: options.start                                                                                  // 140
            });                                                                                                       // 136
        };                                                                                                            // 142
    }                                                                                                                 // 143
                                                                                                                      //
    return self;                                                                                                      // 145
};                                                                                                                    // 146
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/jalik:ufs-local/ufs-local.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['jalik:ufs-local'] = {};

})();

//# sourceMappingURL=jalik_ufs-local.js.map
