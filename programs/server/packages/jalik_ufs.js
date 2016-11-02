(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var check = Package.check.check;
var Match = Package.check.Match;
var ECMAScript = Package.ecmascript.ECMAScript;
var CollectionHooks = Package['matb33:collection-hooks'].CollectionHooks;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
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

/* Package-scope variables */
var UploadFS;

var require = meteorInstall({"node_modules":{"meteor":{"jalik:ufs":{"ufs.js":["babel-runtime/helpers/typeof","meteor/underscore","meteor/meteor","meteor/mongo",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/jalik_ufs/ufs.js                                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _typeof;module.import('babel-runtime/helpers/typeof',{"default":function(v){_typeof=v}});var _;module.import('meteor/underscore',{"_":function(v){_=v}});var Meteor;module.import('meteor/meteor',{"Meteor":function(v){Meteor=v}});var Mongo;module.import('meteor/mongo',{"Mongo":function(v){Mongo=v}});
                                                                                                                       // 1
                                                                                                                       // 2
                                                                                                                       // 3
                                                                                                                       //
var stores = {};                                                                                                       // 5
                                                                                                                       //
UploadFS = {                                                                                                           // 7
                                                                                                                       //
    /**                                                                                                                // 9
     * Contains all stores                                                                                             //
     */                                                                                                                //
    store: {},                                                                                                         // 12
                                                                                                                       //
    /**                                                                                                                // 14
     * Collection of tokens                                                                                            //
     */                                                                                                                //
    tokens: new Mongo.Collection('ufsTokens'),                                                                         // 17
                                                                                                                       //
    /**                                                                                                                // 19
     * Returns the store by its name                                                                                   //
     * @param name                                                                                                     //
     * @return {UploadFS.Store}                                                                                        //
     */                                                                                                                //
    getStore: function () {                                                                                            // 24
        function getStore(name) {                                                                                      // 24
            return stores[name];                                                                                       // 25
        }                                                                                                              // 26
                                                                                                                       //
        return getStore;                                                                                               // 24
    }(),                                                                                                               // 24
                                                                                                                       //
    /**                                                                                                                // 28
     * Returns all stores                                                                                              //
     * @return {object}                                                                                                //
     */                                                                                                                //
    getStores: function () {                                                                                           // 32
        function getStores() {                                                                                         // 32
            return stores;                                                                                             // 33
        }                                                                                                              // 34
                                                                                                                       //
        return getStores;                                                                                              // 32
    }(),                                                                                                               // 32
                                                                                                                       //
    /**                                                                                                                // 36
     * Returns the temporary file path                                                                                 //
     * @param fileId                                                                                                   //
     * @return {string}                                                                                                //
     */                                                                                                                //
    getTempFilePath: function () {                                                                                     // 41
        function getTempFilePath(fileId) {                                                                             // 41
            return UploadFS.config.tmpDir + '/' + fileId;                                                              // 42
        }                                                                                                              // 43
                                                                                                                       //
        return getTempFilePath;                                                                                        // 41
    }(),                                                                                                               // 41
                                                                                                                       //
    /**                                                                                                                // 45
     * Imports a file from a URL                                                                                       //
     * @param url                                                                                                      //
     * @param file                                                                                                     //
     * @param store                                                                                                    //
     * @param callback                                                                                                 //
     */                                                                                                                //
    importFromURL: function () {                                                                                       // 52
        function importFromURL(url, file, store, callback) {                                                           // 52
            if (typeof store === 'string') {                                                                           // 53
                Meteor.call('ufsImportURL', url, file, store, callback);                                               // 54
            } else if ((typeof store === 'undefined' ? 'undefined' : _typeof(store)) === 'object') {                   // 55
                store.importFromURL(url, file, callback);                                                              // 57
            }                                                                                                          // 58
        }                                                                                                              // 59
                                                                                                                       //
        return importFromURL;                                                                                          // 52
    }()                                                                                                                // 52
};                                                                                                                     // 7
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"ufs-mime.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/jalik_ufs/ufs-mime.js                                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * MIME types and extensions                                                                                           //
 */                                                                                                                    //
var MIME = {                                                                                                           // 4
                                                                                                                       //
    // application                                                                                                     // 6
    '7z': 'application/x-7z-compressed',                                                                               // 7
    'arc': 'application/octet-stream',                                                                                 // 8
    'ai': 'application/postscript',                                                                                    // 9
    'bin': 'application/octet-stream',                                                                                 // 10
    'bz': 'application/x-bzip',                                                                                        // 11
    'bz2': 'application/x-bzip2',                                                                                      // 12
    'eps': 'application/postscript',                                                                                   // 13
    'exe': 'application/octet-stream',                                                                                 // 14
    'gz': 'application/x-gzip',                                                                                        // 15
    'gzip': 'application/x-gzip',                                                                                      // 16
    'js': 'application/javascript',                                                                                    // 17
    'json': 'application/json',                                                                                        // 18
    'ogx': 'application/ogg',                                                                                          // 19
    'pdf': 'application/pdf',                                                                                          // 20
    'ps': 'application/postscript',                                                                                    // 21
    'psd': 'application/octet-stream',                                                                                 // 22
    'rar': 'application/x-rar-compressed',                                                                             // 23
    'rev': 'application/x-rar-compressed',                                                                             // 24
    'swf': 'application/x-shockwave-flash',                                                                            // 25
    'tar': 'application/x-tar',                                                                                        // 26
    'xhtml': 'application/xhtml+xml',                                                                                  // 27
    'xml': 'application/xml',                                                                                          // 28
    'zip': 'application/zip',                                                                                          // 29
                                                                                                                       //
    // audio                                                                                                           // 31
    'aif': 'audio/aiff',                                                                                               // 32
    'aifc': 'audio/aiff',                                                                                              // 33
    'aiff': 'audio/aiff',                                                                                              // 34
    'au': 'audio/basic',                                                                                               // 35
    'flac': 'audio/flac',                                                                                              // 36
    'midi': 'audio/midi',                                                                                              // 37
    'mp2': 'audio/mpeg',                                                                                               // 38
    'mp3': 'audio/mpeg',                                                                                               // 39
    'mpa': 'audio/mpeg',                                                                                               // 40
    'oga': 'audio/ogg',                                                                                                // 41
    'ogg': 'audio/ogg',                                                                                                // 42
    'opus': 'audio/ogg',                                                                                               // 43
    'ra': 'audio/vnd.rn-realaudio',                                                                                    // 44
    'spx': 'audio/ogg',                                                                                                // 45
    'wav': 'audio/x-wav',                                                                                              // 46
    'weba': 'audio/webm',                                                                                              // 47
    'wma': 'audio/x-ms-wma',                                                                                           // 48
                                                                                                                       //
    // image                                                                                                           // 50
    'avs': 'image/avs-video',                                                                                          // 51
    'bmp': 'image/x-windows-bmp',                                                                                      // 52
    'gif': 'image/gif',                                                                                                // 53
    'ico': 'image/vnd.microsoft.icon',                                                                                 // 54
    'jpeg': 'image/jpeg',                                                                                              // 55
    'jpg': 'image/jpg',                                                                                                // 56
    'mjpg': 'image/x-motion-jpeg',                                                                                     // 57
    'pic': 'image/pic',                                                                                                // 58
    'png': 'image/png',                                                                                                // 59
    'svg': 'image/svg+xml',                                                                                            // 60
    'tif': 'image/tiff',                                                                                               // 61
    'tiff': 'image/tiff',                                                                                              // 62
                                                                                                                       //
    // text                                                                                                            // 64
    'css': 'text/css',                                                                                                 // 65
    'csv': 'text/csv',                                                                                                 // 66
    'html': 'text/html',                                                                                               // 67
    'txt': 'text/plain',                                                                                               // 68
                                                                                                                       //
    // video                                                                                                           // 70
    'avi': 'video/avi',                                                                                                // 71
    'dv': 'video/x-dv',                                                                                                // 72
    'flv': 'video/x-flv',                                                                                              // 73
    'mov': 'video/quicktime',                                                                                          // 74
    'mp4': 'video/mp4',                                                                                                // 75
    'mpeg': 'video/mpeg',                                                                                              // 76
    'mpg': 'video/mpg',                                                                                                // 77
    'ogv': 'video/ogg',                                                                                                // 78
    'vdo': 'video/vdo',                                                                                                // 79
    'webm': 'video/webm',                                                                                              // 80
    'wmv': 'video/x-ms-wmv',                                                                                           // 81
                                                                                                                       //
    // specific to vendors                                                                                             // 83
    'doc': 'application/msword',                                                                                       // 84
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',                                 // 85
    'odb': 'application/vnd.oasis.opendocument.database',                                                              // 86
    'odc': 'application/vnd.oasis.opendocument.chart',                                                                 // 87
    'odf': 'application/vnd.oasis.opendocument.formula',                                                               // 88
    'odg': 'application/vnd.oasis.opendocument.graphics',                                                              // 89
    'odi': 'application/vnd.oasis.opendocument.image',                                                                 // 90
    'odm': 'application/vnd.oasis.opendocument.text-master',                                                           // 91
    'odp': 'application/vnd.oasis.opendocument.presentation',                                                          // 92
    'ods': 'application/vnd.oasis.opendocument.spreadsheet',                                                           // 93
    'odt': 'application/vnd.oasis.opendocument.text',                                                                  // 94
    'otg': 'application/vnd.oasis.opendocument.graphics-template',                                                     // 95
    'otp': 'application/vnd.oasis.opendocument.presentation-template',                                                 // 96
    'ots': 'application/vnd.oasis.opendocument.spreadsheet-template',                                                  // 97
    'ott': 'application/vnd.oasis.opendocument.text-template',                                                         // 98
    'ppt': 'application/vnd.ms-powerpoint',                                                                            // 99
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',                               // 100
    'xls': 'application/vnd.ms-excel',                                                                                 // 101
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'                                        // 102
                                                                                                                       //
};                                                                                                                     // 4
                                                                                                                       //
/**                                                                                                                    // 106
 * Adds the MIME type for an extension                                                                                 //
 * @param extension                                                                                                    //
 * @param mime                                                                                                         //
 */                                                                                                                    //
UploadFS.addMimeType = function (extension, mime) {                                                                    // 111
    MIME[extension.toLowerCase()] = mime;                                                                              // 112
};                                                                                                                     // 113
                                                                                                                       //
/**                                                                                                                    // 115
 * Returns the MIME type of the extension                                                                              //
 * @param extension                                                                                                    //
 * @returns {*}                                                                                                        //
 */                                                                                                                    //
UploadFS.getMimeType = function (extension) {                                                                          // 120
    extension = extension.toLowerCase();                                                                               // 121
    return MIME[extension];                                                                                            // 122
};                                                                                                                     // 123
                                                                                                                       //
/**                                                                                                                    // 125
 * Returns all MIME types                                                                                              //
 */                                                                                                                    //
UploadFS.getMimeTypes = function () {                                                                                  // 128
    return MIME;                                                                                                       // 129
};                                                                                                                     // 130
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ufs-utilities.js":["meteor/meteor","meteor/underscore",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/jalik_ufs/ufs-utilities.js                                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var Meteor;module.import('meteor/meteor',{"Meteor":function(v){Meteor=v}});var _;module.import('meteor/underscore',{"_":function(v){_=v}});
                                                                                                                       // 2
                                                                                                                       //
if (Meteor.isClient) {                                                                                                 // 5
                                                                                                                       //
    /**                                                                                                                // 7
     * Returns file and data as ArrayBuffer for each files in the event                                                //
     * @deprecated                                                                                                     //
     * @param event                                                                                                    //
     * @param callback                                                                                                 //
     */                                                                                                                //
    // todo remove deprecated method                                                                                   // 13
    UploadFS.readAsArrayBuffer = function (event, callback) {                                                          // 14
        console.error('UploadFS.readAsArrayBuffer is deprecated, see https://github.com/jalik/jalik-ufs#uploading-from-a-file');
    };                                                                                                                 // 16
                                                                                                                       //
    /**                                                                                                                // 18
     * Opens a dialog to select a single file                                                                          //
     * @param callback                                                                                                 //
     */                                                                                                                //
    UploadFS.selectFile = function (callback) {                                                                        // 22
        var input = document.createElement('input');                                                                   // 23
        input.type = 'file';                                                                                           // 24
        input.multiple = false;                                                                                        // 25
        input.onchange = function (ev) {                                                                               // 26
            var files = ev.target.files;                                                                               // 27
            callback.call(UploadFS, files[0]);                                                                         // 28
        };                                                                                                             // 29
        // Fix for iOS                                                                                                 // 30
        input.style = 'display:none';                                                                                  // 31
        document.body.appendChild(input);                                                                              // 32
        input.click();                                                                                                 // 33
    };                                                                                                                 // 34
                                                                                                                       //
    /**                                                                                                                // 36
     * Opens a dialog to select multiple files                                                                         //
     * @param callback                                                                                                 //
     */                                                                                                                //
    UploadFS.selectFiles = function (callback) {                                                                       // 40
        var input = document.createElement('input');                                                                   // 41
        input.type = 'file';                                                                                           // 42
        input.multiple = true;                                                                                         // 43
        input.onchange = function (ev) {                                                                               // 44
            var files = ev.target.files;                                                                               // 45
                                                                                                                       //
            for (var i = 0; i < files.length; i += 1) {                                                                // 47
                callback.call(UploadFS, files[i]);                                                                     // 48
            }                                                                                                          // 49
        };                                                                                                             // 50
        // Fix for iOS                                                                                                 // 51
        input.style = 'display:none';                                                                                  // 52
        document.body.appendChild(input);                                                                              // 53
        input.click();                                                                                                 // 54
    };                                                                                                                 // 55
}                                                                                                                      // 56
                                                                                                                       //
if (Meteor.isServer) {                                                                                                 // 59
                                                                                                                       //
    /**                                                                                                                // 61
     * Adds the path attribute to files                                                                                //
     * @param where                                                                                                    //
     */                                                                                                                //
    UploadFS.addPathAttributeToFiles = function (where) {                                                              // 65
        _.each(UploadFS.getStores(), function (store) {                                                                // 66
            var files = store.getCollection();                                                                         // 67
                                                                                                                       //
            // By default update only files with no path set                                                           // 69
            files.find(where || { path: null }, { fields: { _id: 1 } }).forEach(function (file) {                      // 70
                var path = store.getFileRelativeURL(file._id);                                                         // 71
                files.update({ _id: file._id }, { $set: { path: path } });                                             // 72
            });                                                                                                        // 73
        });                                                                                                            // 74
    };                                                                                                                 // 75
}                                                                                                                      // 76
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"ufs-config.js":["meteor/underscore","meteor/meteor",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/jalik_ufs/ufs-config.js                                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _;module.import('meteor/underscore',{"_":function(v){_=v}});var Meteor;module.import('meteor/meteor',{"Meteor":function(v){Meteor=v}});
                                                                                                                       // 2
                                                                                                                       //
/**                                                                                                                    // 4
 * UploadFS configuration                                                                                              //
 * @param options                                                                                                      //
 * @constructor                                                                                                        //
 */                                                                                                                    //
UploadFS.Config = function (options) {                                                                                 // 9
  // Default options                                                                                                   // 10
  options = _.extend({                                                                                                 // 11
    defaultStorePermissions: null,                                                                                     // 12
    https: false,                                                                                                      // 13
    simulateReadDelay: 0,                                                                                              // 14
    simulateUploadSpeed: 0,                                                                                            // 15
    simulateWriteDelay: 0,                                                                                             // 16
    storesPath: 'ufs',                                                                                                 // 17
    tmpDir: '/tmp/ufs',                                                                                                // 18
    tmpDirPermissions: '0700'                                                                                          // 19
  }, options);                                                                                                         // 11
                                                                                                                       //
  // Check options                                                                                                     // 22
  if (options.defaultStorePermissions && !(options.defaultStorePermissions instanceof UploadFS.StorePermissions)) {    // 23
    throw new TypeError('defaultStorePermissions is not an instance of UploadFS.StorePermissions');                    // 24
  }                                                                                                                    // 25
  if (typeof options.https !== 'boolean') {                                                                            // 26
    throw new TypeError('https is not a function');                                                                    // 27
  }                                                                                                                    // 28
  if (typeof options.simulateReadDelay !== 'number') {                                                                 // 29
    throw new Meteor.Error('simulateReadDelay is not a number');                                                       // 30
  }                                                                                                                    // 31
  if (typeof options.simulateUploadSpeed !== 'number') {                                                               // 32
    throw new Meteor.Error('simulateUploadSpeed is not a number');                                                     // 33
  }                                                                                                                    // 34
  if (typeof options.simulateWriteDelay !== 'number') {                                                                // 35
    throw new Meteor.Error('simulateWriteDelay is not a number');                                                      // 36
  }                                                                                                                    // 37
  if (typeof options.storesPath !== 'string') {                                                                        // 38
    throw new Meteor.Error('storesPath is not a string');                                                              // 39
  }                                                                                                                    // 40
  if (typeof options.tmpDir !== 'string') {                                                                            // 41
    throw new Meteor.Error('tmpDir is not a string');                                                                  // 42
  }                                                                                                                    // 43
  if (typeof options.tmpDirPermissions !== 'string') {                                                                 // 44
    throw new Meteor.Error('tmpDirPermissions is not a string');                                                       // 45
  }                                                                                                                    // 46
                                                                                                                       //
  /**                                                                                                                  // 48
   * Default store permissions                                                                                         //
   * @type {UploadFS.StorePermissions}                                                                                 //
   */                                                                                                                  //
  this.defaultStorePermissions = options.defaultStorePermissions;                                                      // 52
  /**                                                                                                                  // 53
   * Use or not secured protocol in URLS                                                                               //
   * @type {boolean}                                                                                                   //
   */                                                                                                                  //
  this.https = options.https;                                                                                          // 57
  /**                                                                                                                  // 58
   * The simulation read delay                                                                                         //
   * @type {Number}                                                                                                    //
   */                                                                                                                  //
  this.simulateReadDelay = parseInt(options.simulateReadDelay);                                                        // 62
  /**                                                                                                                  // 63
   * The simulation upload speed                                                                                       //
   * @type {Number}                                                                                                    //
   */                                                                                                                  //
  this.simulateUploadSpeed = parseInt(options.simulateUploadSpeed);                                                    // 67
  /**                                                                                                                  // 68
   * The simulation write delay                                                                                        //
   * @type {Number}                                                                                                    //
   */                                                                                                                  //
  this.simulateWriteDelay = parseInt(options.simulateWriteDelay);                                                      // 72
  /**                                                                                                                  // 73
   * The URL root path of stores                                                                                       //
   * @type {string}                                                                                                    //
   */                                                                                                                  //
  this.storesPath = options.storesPath;                                                                                // 77
  /**                                                                                                                  // 78
   * The temporary directory of uploading files                                                                        //
   * @type {string}                                                                                                    //
   */                                                                                                                  //
  this.tmpDir = options.tmpDir;                                                                                        // 82
  /**                                                                                                                  // 83
   * The permissions of the temporary directory                                                                        //
   * @type {string}                                                                                                    //
   */                                                                                                                  //
  this.tmpDirPermissions = options.tmpDirPermissions;                                                                  // 87
};                                                                                                                     // 88
                                                                                                                       //
/**                                                                                                                    // 90
 * Global configuration                                                                                                //
 * @type {UploadFS.Config}                                                                                             //
 */                                                                                                                    //
UploadFS.config = new UploadFS.Config();                                                                               // 94
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"ufs-filter.js":["babel-runtime/helpers/typeof","meteor/underscore",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/jalik_ufs/ufs-filter.js                                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _typeof;module.import('babel-runtime/helpers/typeof',{"default":function(v){_typeof=v}});var _;module.import('meteor/underscore',{"_":function(v){_=v}});
                                                                                                                       // 1
                                                                                                                       //
/**                                                                                                                    // 3
 * File filter                                                                                                         //
 * @param options                                                                                                      //
 * @constructor                                                                                                        //
 */                                                                                                                    //
UploadFS.Filter = function (options) {                                                                                 // 8
    var self = this;                                                                                                   // 9
                                                                                                                       //
    // Default options                                                                                                 // 11
    options = _.extend({                                                                                               // 12
        contentTypes: null,                                                                                            // 13
        extensions: null,                                                                                              // 14
        minSize: 1,                                                                                                    // 15
        maxSize: 0,                                                                                                    // 16
        onCheck: null                                                                                                  // 17
    }, options);                                                                                                       // 12
                                                                                                                       //
    // Check options                                                                                                   // 20
    if (options.contentTypes && !(options.contentTypes instanceof Array)) {                                            // 21
        throw new TypeError('contentTypes is not an Array');                                                           // 22
    }                                                                                                                  // 23
    if (options.extensions && !(options.extensions instanceof Array)) {                                                // 24
        throw new TypeError('extensions is not an Array');                                                             // 25
    }                                                                                                                  // 26
    if (typeof options.minSize !== 'number') {                                                                         // 27
        throw new TypeError('minSize is not a number');                                                                // 28
    }                                                                                                                  // 29
    if (typeof options.maxSize !== 'number') {                                                                         // 30
        throw new TypeError('maxSize is not a number');                                                                // 31
    }                                                                                                                  // 32
    if (options.onCheck && typeof options.onCheck !== 'function') {                                                    // 33
        throw new TypeError('onCheck is not a function');                                                              // 34
    }                                                                                                                  // 35
                                                                                                                       //
    // Private attributes                                                                                              // 37
    var contentTypes = options.contentTypes;                                                                           // 38
    var extensions = options.extensions;                                                                               // 39
    var onCheck = options.onCheck;                                                                                     // 40
    var maxSize = parseInt(options.maxSize);                                                                           // 41
    var minSize = parseInt(options.minSize);                                                                           // 42
                                                                                                                       //
    /**                                                                                                                // 44
     * Checks the file                                                                                                 //
     * @param file                                                                                                     //
     */                                                                                                                //
    self.check = function (file) {                                                                                     // 48
        // Check size                                                                                                  // 49
        if (file.size <= 0 || file.size < self.getMinSize()) {                                                         // 50
            throw new Meteor.Error('file-too-small', 'File is too small (min =' + self.getMinSize() + ')');            // 51
        }                                                                                                              // 52
        if (self.getMaxSize() > 0 && file.size > self.getMaxSize()) {                                                  // 53
            throw new Meteor.Error('file-too-large', 'File is too large (max = ' + self.getMaxSize() + ')');           // 54
        }                                                                                                              // 55
        // Check extension                                                                                             // 56
        if (self.getExtensions() && !_.contains(self.getExtensions(), file.extension)) {                               // 57
            throw new Meteor.Error('invalid-file-extension', 'File extension is not accepted');                        // 58
        }                                                                                                              // 59
        // Check content type                                                                                          // 60
        if (self.getContentTypes() && !checkContentType(file.type, self.getContentTypes())) {                          // 61
            throw new Meteor.Error('invalid-file-type', 'File type is not accepted');                                  // 62
        }                                                                                                              // 63
        // Apply custom check                                                                                          // 64
        if (typeof onCheck === 'function' && !onCheck.call(self, file)) {                                              // 65
            throw new Meteor.Error('invalid-file', 'File does not match filter');                                      // 66
        }                                                                                                              // 67
    };                                                                                                                 // 68
                                                                                                                       //
    /**                                                                                                                // 70
     * Returns the allowed content types                                                                               //
     * @return {Array}                                                                                                 //
     */                                                                                                                //
    self.getContentTypes = function () {                                                                               // 74
        return contentTypes;                                                                                           // 75
    };                                                                                                                 // 76
                                                                                                                       //
    /**                                                                                                                // 78
     * Returns the allowed extensions                                                                                  //
     * @return {Array}                                                                                                 //
     */                                                                                                                //
    self.getExtensions = function () {                                                                                 // 82
        return extensions;                                                                                             // 83
    };                                                                                                                 // 84
                                                                                                                       //
    /**                                                                                                                // 86
     * Returns the maximum file size                                                                                   //
     * @return {Number}                                                                                                //
     */                                                                                                                //
    self.getMaxSize = function () {                                                                                    // 90
        return maxSize;                                                                                                // 91
    };                                                                                                                 // 92
                                                                                                                       //
    /**                                                                                                                // 94
     * Returns the minimum file size                                                                                   //
     * @return {Number}                                                                                                //
     */                                                                                                                //
    self.getMinSize = function () {                                                                                    // 98
        return minSize;                                                                                                // 99
    };                                                                                                                 // 100
                                                                                                                       //
    /**                                                                                                                // 102
     * Checks if the file matches filter                                                                               //
     * @param file                                                                                                     //
     * @return {boolean}                                                                                               //
     */                                                                                                                //
    self.isValid = function (file) {                                                                                   // 107
        var result = true;                                                                                             // 108
        try {                                                                                                          // 109
            self.check(file);                                                                                          // 110
        } catch (err) {                                                                                                // 111
            result = false;                                                                                            // 112
        }                                                                                                              // 113
        return result;                                                                                                 // 114
    };                                                                                                                 // 115
};                                                                                                                     // 116
                                                                                                                       //
function checkContentType(type, list) {                                                                                // 118
    if (type) {                                                                                                        // 119
        if (_.contains(list, type)) {                                                                                  // 120
            return true;                                                                                               // 121
        } else {                                                                                                       // 122
            var _ret = function () {                                                                                   // 122
                var wildCardGlob = '/*';                                                                               // 123
                var wildcards = _.filter(list, function (item) {                                                       // 124
                    return item.indexOf(wildCardGlob) > 0;                                                             // 125
                });                                                                                                    // 126
                                                                                                                       //
                if (_.contains(wildcards, type.replace(/(\/.*)$/, wildCardGlob))) {                                    // 128
                    return {                                                                                           // 129
                        v: true                                                                                        // 129
                    };                                                                                                 // 129
                }                                                                                                      // 130
            }();                                                                                                       // 122
                                                                                                                       //
            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;               // 122
        }                                                                                                              // 131
    }                                                                                                                  // 132
    return false;                                                                                                      // 133
}                                                                                                                      // 134
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"ufs-store-permissions.js":["meteor/underscore",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/jalik_ufs/ufs-store-permissions.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _;module.import('meteor/underscore',{"_":function(v){_=v}});                                                       // 1
                                                                                                                       //
/**                                                                                                                    // 3
 * Store permissions                                                                                                   //
 * @param options                                                                                                      //
 * @constructor                                                                                                        //
 */                                                                                                                    //
UploadFS.StorePermissions = function (options) {                                                                       // 8
    var _this = this;                                                                                                  // 8
                                                                                                                       //
    // Default options                                                                                                 // 9
    options = _.extend({                                                                                               // 10
        insert: null,                                                                                                  // 11
        remove: null,                                                                                                  // 12
        update: null                                                                                                   // 13
    }, options);                                                                                                       // 10
                                                                                                                       //
    // Check options                                                                                                   // 16
    if (typeof options.insert === 'function') {                                                                        // 17
        this.insert = options.insert;                                                                                  // 18
    }                                                                                                                  // 19
    if (typeof options.remove === 'function') {                                                                        // 20
        this.remove = options.remove;                                                                                  // 21
    }                                                                                                                  // 22
    if (typeof options.update === 'function') {                                                                        // 23
        this.update = options.update;                                                                                  // 24
    }                                                                                                                  // 25
                                                                                                                       //
    var checkPermission = function checkPermission(permission, userId, file, fields, modifiers) {                      // 27
        if (typeof _this[permission] === 'function') {                                                                 // 28
            return _this[permission](userId, file, fields, modifiers);                                                 // 29
        }                                                                                                              // 30
        return true; // by default allow all                                                                           // 31
    };                                                                                                                 // 32
                                                                                                                       //
    /**                                                                                                                // 34
     * Checks the insert permission                                                                                    //
     * @param userId                                                                                                   //
     * @param file                                                                                                     //
     * @returns {*}                                                                                                    //
     */                                                                                                                //
    this.checkInsert = function (userId, file) {                                                                       // 40
        return checkPermission('insert', userId, file);                                                                // 41
    };                                                                                                                 // 42
    /**                                                                                                                // 43
     * Checks the remove permission                                                                                    //
     * @param userId                                                                                                   //
     * @param file                                                                                                     //
     * @returns {*}                                                                                                    //
     */                                                                                                                //
    this.checkRemove = function (userId, file) {                                                                       // 49
        return checkPermission('remove', userId, file);                                                                // 50
    };                                                                                                                 // 51
    /**                                                                                                                // 52
     * Checks the update permission                                                                                    //
     * @param userId                                                                                                   //
     * @param file                                                                                                     //
     * @param fields                                                                                                   //
     * @param modifiers                                                                                                //
     * @returns {*}                                                                                                    //
     */                                                                                                                //
    this.checkUpdate = function (userId, file, fields, modifiers) {                                                    // 60
        return checkPermission('update', userId, file, fields, modifiers);                                             // 61
    };                                                                                                                 // 62
};                                                                                                                     // 63
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"ufs-store.js":["meteor/underscore","meteor/check","meteor/meteor","meteor/mongo",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/jalik_ufs/ufs-store.js                                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _;module.import('meteor/underscore',{"_":function(v){_=v}});var check;module.import('meteor/check',{"check":function(v){check=v}});var Meteor;module.import('meteor/meteor',{"Meteor":function(v){Meteor=v}});var Mongo;module.import('meteor/mongo',{"Mongo":function(v){Mongo=v}});
                                                                                                                       // 2
                                                                                                                       // 3
                                                                                                                       // 4
                                                                                                                       //
/**                                                                                                                    // 6
 * File store                                                                                                          //
 * @param options                                                                                                      //
 * @constructor                                                                                                        //
 */                                                                                                                    //
UploadFS.Store = function (options) {                                                                                  // 11
    var self = this;                                                                                                   // 12
                                                                                                                       //
    // Default options                                                                                                 // 14
    options = _.extend({                                                                                               // 15
        collection: null,                                                                                              // 16
        filter: null,                                                                                                  // 17
        name: null,                                                                                                    // 18
        onCopyError: null,                                                                                             // 19
        onFinishUpload: null,                                                                                          // 20
        onRead: null,                                                                                                  // 21
        onReadError: null,                                                                                             // 22
        onWriteError: null,                                                                                            // 23
        permissions: null,                                                                                             // 24
        transformRead: null,                                                                                           // 25
        transformWrite: null                                                                                           // 26
    }, options);                                                                                                       // 15
                                                                                                                       //
    // Check instance                                                                                                  // 29
    if (!(self instanceof UploadFS.Store)) {                                                                           // 30
        throw new Error('UploadFS.Store is not an instance');                                                          // 31
    }                                                                                                                  // 32
                                                                                                                       //
    // Check options                                                                                                   // 34
    if (!(options.collection instanceof Mongo.Collection)) {                                                           // 35
        throw new TypeError('collection is not a Mongo.Collection');                                                   // 36
    }                                                                                                                  // 37
    if (options.filter && !(options.filter instanceof UploadFS.Filter)) {                                              // 38
        throw new TypeError('filter is not a UploadFS.Filter');                                                        // 39
    }                                                                                                                  // 40
    if (typeof options.name !== 'string') {                                                                            // 41
        throw new TypeError('name is not a string');                                                                   // 42
    }                                                                                                                  // 43
    if (UploadFS.getStore(options.name)) {                                                                             // 44
        throw new TypeError('name already exists');                                                                    // 45
    }                                                                                                                  // 46
    if (options.onCopyError && typeof options.onCopyError !== 'function') {                                            // 47
        throw new TypeError('onCopyError is not a function');                                                          // 48
    }                                                                                                                  // 49
    if (options.onFinishUpload && typeof options.onFinishUpload !== 'function') {                                      // 50
        throw new TypeError('onFinishUpload is not a function');                                                       // 51
    }                                                                                                                  // 52
    if (options.onRead && typeof options.onRead !== 'function') {                                                      // 53
        throw new TypeError('onRead is not a function');                                                               // 54
    }                                                                                                                  // 55
    if (options.onReadError && typeof options.onReadError !== 'function') {                                            // 56
        throw new TypeError('onReadError is not a function');                                                          // 57
    }                                                                                                                  // 58
    if (options.onWriteError && typeof options.onWriteError !== 'function') {                                          // 59
        throw new TypeError('onWriteError is not a function');                                                         // 60
    }                                                                                                                  // 61
    if (options.permissions && !(options.permissions instanceof UploadFS.StorePermissions)) {                          // 62
        throw new TypeError('permissions is not a UploadFS.StorePermissions');                                         // 63
    }                                                                                                                  // 64
    if (options.transformRead && typeof options.transformRead !== 'function') {                                        // 65
        throw new TypeError('transformRead is not a function');                                                        // 66
    }                                                                                                                  // 67
    if (options.transformWrite && typeof options.transformWrite !== 'function') {                                      // 68
        throw new TypeError('transformWrite is not a function');                                                       // 69
    }                                                                                                                  // 70
                                                                                                                       //
    // Public attributes                                                                                               // 72
    self.onCopyError = options.onCopyError || self.onCopyError;                                                        // 73
    self.onFinishUpload = options.onFinishUpload || self.onFinishUpload;                                               // 74
    self.onRead = options.onRead || self.onRead;                                                                       // 75
    self.onReadError = options.onReadError || self.onReadError;                                                        // 76
    self.onWriteError = options.onWriteError || self.onWriteError;                                                     // 77
    self.permissions = options.permissions;                                                                            // 78
                                                                                                                       //
    // Private attributes                                                                                              // 80
    var collection = options.collection;                                                                               // 81
    var copyTo = options.copyTo;                                                                                       // 82
    var filter = options.filter;                                                                                       // 83
    var name = options.name;                                                                                           // 84
    var transformRead = options.transformRead;                                                                         // 85
    var transformWrite = options.transformWrite;                                                                       // 86
                                                                                                                       //
    // Set default permissions                                                                                         // 88
    if (!(self.permissions instanceof UploadFS.StorePermissions)) {                                                    // 89
        // Uses user's default permissions or UFS default permissions (deny all)                                       // 90
        if (UploadFS.config.defaultStorePermissions instanceof UploadFS.StorePermissions) {                            // 91
            self.permissions = UploadFS.config.defaultStorePermissions;                                                // 92
        } else {                                                                                                       // 93
            self.permissions = new UploadFS.StorePermissions();                                                        // 94
            console.warn('ufs: permissions are not defined for store "' + name + '"');                                 // 95
        }                                                                                                              // 96
    }                                                                                                                  // 97
                                                                                                                       //
    // Add the store to the list                                                                                       // 99
    UploadFS.getStores()[name] = self;                                                                                 // 100
                                                                                                                       //
    /**                                                                                                                // 102
     * Returns the collection                                                                                          //
     * @return {Mongo.Collection}                                                                                      //
     */                                                                                                                //
    self.getCollection = function () {                                                                                 // 106
        return collection;                                                                                             // 107
    };                                                                                                                 // 108
                                                                                                                       //
    /**                                                                                                                // 110
     * Returns the file filter                                                                                         //
     * @return {UploadFS.Filter}                                                                                       //
     */                                                                                                                //
    self.getFilter = function () {                                                                                     // 114
        return filter;                                                                                                 // 115
    };                                                                                                                 // 116
                                                                                                                       //
    /**                                                                                                                // 118
     * Returns the store name                                                                                          //
     * @return {string}                                                                                                //
     */                                                                                                                //
    self.getName = function () {                                                                                       // 122
        return name;                                                                                                   // 123
    };                                                                                                                 // 124
                                                                                                                       //
    /**                                                                                                                // 126
     * Defines the store permissions                                                                                   //
     * @param permissions                                                                                              //
     */                                                                                                                //
    self.setPermissions = function (permissions) {                                                                     // 130
        if (!(permissions instanceof UploadFS.StorePermissions)) {                                                     // 131
            throw new TypeError("permissions is not an instance of UploadFS.StorePermissions");                        // 132
        }                                                                                                              // 133
        self.permissions = permissions;                                                                                // 134
    };                                                                                                                 // 135
                                                                                                                       //
    if (Meteor.isServer) {                                                                                             // 137
                                                                                                                       //
        /**                                                                                                            // 139
         * Checks token validity                                                                                       //
         * @param token                                                                                                //
         * @param fileId                                                                                               //
         * @returns {boolean}                                                                                          //
         */                                                                                                            //
        self.checkToken = function (token, fileId) {                                                                   // 145
            check(token, String);                                                                                      // 146
            check(fileId, String);                                                                                     // 147
            return UploadFS.tokens.find({ value: token, fileId: fileId }).count() === 1;                               // 148
        };                                                                                                             // 149
                                                                                                                       //
        /**                                                                                                            // 151
         * Copies the file to a store                                                                                  //
         * @param fileId                                                                                               //
         * @param store                                                                                                //
         * @param callback                                                                                             //
         */                                                                                                            //
        self.copy = function (fileId, store, callback) {                                                               // 157
            check(fileId, String);                                                                                     // 158
                                                                                                                       //
            if (!(store instanceof UploadFS.Store)) {                                                                  // 160
                throw new TypeError('store is not a UploadFS.store.Store');                                            // 161
            }                                                                                                          // 162
            // Get original file                                                                                       // 163
            var file = collection.findOne({ _id: fileId });                                                            // 164
            if (!file) {                                                                                               // 165
                throw new Meteor.Error(404, 'File not found');                                                         // 166
            }                                                                                                          // 167
            // Ignore the file if it does not match store filter                                                       // 168
            var filter = store.getFilter();                                                                            // 169
            if (filter instanceof UploadFS.Filter && !filter.isValid(file)) {                                          // 170
                return;                                                                                                // 171
            }                                                                                                          // 172
                                                                                                                       //
            // Prepare copy                                                                                            // 174
            var copy = _.omit(file, '_id', 'url');                                                                     // 175
            copy.originalStore = self.getName();                                                                       // 176
            copy.originalId = fileId;                                                                                  // 177
                                                                                                                       //
            // Create the copy                                                                                         // 179
            var copyId = store.create(copy);                                                                           // 180
                                                                                                                       //
            // Get original stream                                                                                     // 182
            var rs = self.getReadStream(fileId, file);                                                                 // 183
                                                                                                                       //
            // Catch errors to avoid app crashing                                                                      // 185
            rs.on('error', Meteor.bindEnvironment(function (err) {                                                     // 186
                callback.call(self, err, null);                                                                        // 187
            }));                                                                                                       // 188
                                                                                                                       //
            // Copy file data                                                                                          // 190
            store.write(rs, copyId, Meteor.bindEnvironment(function (err) {                                            // 191
                if (err) {                                                                                             // 192
                    collection.remove({ _id: copyId });                                                                // 193
                    self.onCopyError.call(self, err, fileId, file);                                                    // 194
                }                                                                                                      // 195
                if (typeof callback === 'function') {                                                                  // 196
                    callback.call(self, err, copyId, copy, store);                                                     // 197
                }                                                                                                      // 198
            }));                                                                                                       // 199
        };                                                                                                             // 200
                                                                                                                       //
        /**                                                                                                            // 202
         * Creates the file in the collection                                                                          //
         * @param file                                                                                                 //
         * @param callback                                                                                             //
         * @return {string}                                                                                            //
         */                                                                                                            //
        self.create = function (file, callback) {                                                                      // 208
            check(file, Object);                                                                                       // 209
            file.store = name;                                                                                         // 210
            return collection.insert(file, callback);                                                                  // 211
        };                                                                                                             // 212
                                                                                                                       //
        /**                                                                                                            // 214
         * Creates a token for the file (only needed for client side upload)                                           //
         * @param fileId                                                                                               //
         * @returns {*}                                                                                                //
         */                                                                                                            //
        self.createToken = function (fileId) {                                                                         // 219
            var token = self.generateToken();                                                                          // 220
                                                                                                                       //
            // Check if token exists                                                                                   // 222
            if (UploadFS.tokens.find({ fileId: fileId }).count()) {                                                    // 223
                UploadFS.tokens.update({ fileId: fileId }, {                                                           // 224
                    $set: {                                                                                            // 225
                        createdAt: new Date(),                                                                         // 226
                        value: token                                                                                   // 227
                    }                                                                                                  // 225
                });                                                                                                    // 224
            } else {                                                                                                   // 230
                UploadFS.tokens.insert({                                                                               // 231
                    createdAt: new Date(),                                                                             // 232
                    fileId: fileId,                                                                                    // 233
                    value: token                                                                                       // 234
                });                                                                                                    // 231
            }                                                                                                          // 236
            return token;                                                                                              // 237
        };                                                                                                             // 238
                                                                                                                       //
        /**                                                                                                            // 240
         * Generates a random token                                                                                    //
         * @param pattern                                                                                              //
         * @return {string}                                                                                            //
         */                                                                                                            //
        self.generateToken = function (pattern) {                                                                      // 245
            return (pattern || 'xyxyxyxyxy').replace(/[xy]/g, function (c) {                                           // 246
                var r = Math.random() * 16 | 0,                                                                        // 247
                    v = c == 'x' ? r : r & 0x3 | 0x8;                                                                  // 247
                var s = v.toString(16);                                                                                // 248
                return Math.round(Math.random()) ? s.toUpperCase() : s;                                                // 249
            });                                                                                                        // 250
        };                                                                                                             // 251
                                                                                                                       //
        /**                                                                                                            // 253
         * Transforms the file on reading                                                                              //
         * @param readStream                                                                                           //
         * @param writeStream                                                                                          //
         * @param fileId                                                                                               //
         * @param file                                                                                                 //
         * @param request                                                                                              //
         * @param headers                                                                                              //
         */                                                                                                            //
        self.transformRead = function (readStream, writeStream, fileId, file, request, headers) {                      // 262
            if (typeof transformRead === 'function') {                                                                 // 263
                transformRead.call(self, readStream, writeStream, fileId, file, request, headers);                     // 264
            } else {                                                                                                   // 265
                readStream.pipe(writeStream);                                                                          // 266
            }                                                                                                          // 267
        };                                                                                                             // 268
                                                                                                                       //
        /**                                                                                                            // 270
         * Transforms the file on writing                                                                              //
         * @param readStream                                                                                           //
         * @param writeStream                                                                                          //
         * @param fileId                                                                                               //
         * @param file                                                                                                 //
         */                                                                                                            //
        self.transformWrite = function (readStream, writeStream, fileId, file) {                                       // 277
            if (typeof transformWrite === 'function') {                                                                // 278
                transformWrite.call(self, readStream, writeStream, fileId, file);                                      // 279
            } else {                                                                                                   // 280
                readStream.pipe(writeStream);                                                                          // 281
            }                                                                                                          // 282
        };                                                                                                             // 283
                                                                                                                       //
        /**                                                                                                            // 285
         * Writes the file to the store                                                                                //
         * @param rs                                                                                                   //
         * @param fileId                                                                                               //
         * @param callback                                                                                             //
         */                                                                                                            //
        self.write = function (rs, fileId, callback) {                                                                 // 291
            var file = collection.findOne({ _id: fileId });                                                            // 292
            var ws = self.getWriteStream(fileId, file);                                                                // 293
                                                                                                                       //
            var errorHandler = Meteor.bindEnvironment(function (err) {                                                 // 295
                collection.remove({ _id: fileId });                                                                    // 296
                self.onWriteError.call(self, err, fileId, file);                                                       // 297
                callback.call(self, err);                                                                              // 298
            });                                                                                                        // 299
                                                                                                                       //
            ws.on('error', errorHandler);                                                                              // 301
            ws.on('finish', Meteor.bindEnvironment(function () {                                                       // 302
                var size = 0;                                                                                          // 303
                var readStream = self.getReadStream(fileId, file);                                                     // 304
                                                                                                                       //
                readStream.on('error', Meteor.bindEnvironment(function (error) {                                       // 306
                    callback.call(self, error, null);                                                                  // 307
                }));                                                                                                   // 308
                readStream.on('data', Meteor.bindEnvironment(function (data) {                                         // 309
                    size += data.length;                                                                               // 310
                }));                                                                                                   // 311
                readStream.on('end', Meteor.bindEnvironment(function () {                                              // 312
                    // Set file attribute                                                                              // 313
                    file.complete = true;                                                                              // 314
                    file.path = self.getFileRelativeURL(fileId);                                                       // 315
                    file.progress = 1;                                                                                 // 316
                    file.size = size;                                                                                  // 317
                    file.token = self.generateToken();                                                                 // 318
                    file.uploading = false;                                                                            // 319
                    file.uploadedAt = new Date();                                                                      // 320
                    file.url = self.getFileURL(fileId);                                                                // 321
                                                                                                                       //
                    // Sets the file URL when file transfer is complete,                                               // 323
                    // this way, the image will loads entirely.                                                        // 324
                    collection.direct.update({ _id: fileId }, {                                                        // 325
                        $set: {                                                                                        // 326
                            complete: file.complete,                                                                   // 327
                            path: file.path,                                                                           // 328
                            progress: file.progress,                                                                   // 329
                            size: file.size,                                                                           // 330
                            token: file.token,                                                                         // 331
                            uploading: file.uploading,                                                                 // 332
                            uploadedAt: file.uploadedAt,                                                               // 333
                            url: file.url                                                                              // 334
                        }                                                                                              // 326
                    });                                                                                                // 325
                                                                                                                       //
                    // Return file info                                                                                // 338
                    callback.call(self, null, file);                                                                   // 339
                                                                                                                       //
                    // Execute callback                                                                                // 341
                    if (typeof self.onFinishUpload == 'function') {                                                    // 342
                        self.onFinishUpload.call(self, file);                                                          // 343
                    }                                                                                                  // 344
                                                                                                                       //
                    // Simulate write speed                                                                            // 346
                    if (UploadFS.config.simulateWriteDelay) {                                                          // 347
                        Meteor._sleepForMs(UploadFS.config.simulateWriteDelay);                                        // 348
                    }                                                                                                  // 349
                                                                                                                       //
                    // Copy file to other stores                                                                       // 351
                    if (copyTo instanceof Array) {                                                                     // 352
                        for (var i = 0; i < copyTo.length; i += 1) {                                                   // 353
                            var store = copyTo[i];                                                                     // 354
                                                                                                                       //
                            if (!store.getFilter() || store.getFilter().isValid(file)) {                               // 356
                                self.copy(fileId, store);                                                              // 357
                            }                                                                                          // 358
                        }                                                                                              // 359
                    }                                                                                                  // 360
                }));                                                                                                   // 361
            }));                                                                                                       // 362
                                                                                                                       //
            // Execute transformation                                                                                  // 364
            self.transformWrite(rs, ws, fileId, file);                                                                 // 365
        };                                                                                                             // 366
    }                                                                                                                  // 367
                                                                                                                       //
    if (Meteor.isServer) {                                                                                             // 369
        (function () {                                                                                                 // 369
            var fs = Npm.require('fs');                                                                                // 370
                                                                                                                       //
            // Code executed after removing file                                                                       // 372
            collection.after.remove(function (userId, file) {                                                          // 373
                // Remove associated tokens                                                                            // 374
                UploadFS.tokens.remove({ fileId: file._id });                                                          // 375
                                                                                                                       //
                if (copyTo instanceof Array) {                                                                         // 377
                    for (var i = 0; i < copyTo.length; i += 1) {                                                       // 378
                        // Remove copies in stores                                                                     // 379
                        copyTo[i].getCollection().remove({ originalId: file._id });                                    // 380
                    }                                                                                                  // 381
                }                                                                                                      // 382
            });                                                                                                        // 383
                                                                                                                       //
            // Code executed before inserting file                                                                     // 385
            collection.before.insert(function (userId, file) {                                                         // 386
                if (!self.permissions.checkInsert(userId, file)) {                                                     // 387
                    throw new Meteor.Error('forbidden', "Forbidden");                                                  // 388
                }                                                                                                      // 389
            });                                                                                                        // 390
                                                                                                                       //
            // Code executed before updating file                                                                      // 392
            collection.before.update(function (userId, file, fields, modifiers) {                                      // 393
                if (!self.permissions.checkUpdate(userId, file, fields, modifiers)) {                                  // 394
                    throw new Meteor.Error('forbidden', "Forbidden");                                                  // 395
                }                                                                                                      // 396
            });                                                                                                        // 397
                                                                                                                       //
            // Code executed before removing file                                                                      // 399
            collection.before.remove(function (userId, file) {                                                         // 400
                if (!self.permissions.checkRemove(userId, file)) {                                                     // 401
                    throw new Meteor.Error('forbidden', "Forbidden");                                                  // 402
                }                                                                                                      // 403
                                                                                                                       //
                // Delete the physical file in the store                                                               // 405
                self['delete'](file._id);                                                                              // 406
                                                                                                                       //
                var tmpFile = UploadFS.getTempFilePath(file._id);                                                      // 408
                                                                                                                       //
                // Delete the temp file                                                                                // 410
                fs.stat(tmpFile, function (err) {                                                                      // 411
                    !err && fs.unlink(tmpFile, function (err) {                                                        // 412
                        err && console.error('ufs: cannot delete temp file at ' + tmpFile + ' (' + err.message + ')');
                    });                                                                                                // 414
                });                                                                                                    // 415
            });                                                                                                        // 416
        })();                                                                                                          // 369
    }                                                                                                                  // 417
};                                                                                                                     // 418
                                                                                                                       //
/**                                                                                                                    // 420
 * Returns the file URL                                                                                                //
 * @param fileId                                                                                                       //
 */                                                                                                                    //
UploadFS.Store.prototype.getFileRelativeURL = function (fileId) {                                                      // 424
    var file = this.getCollection().findOne({ _id: fileId }, { fields: { name: 1 } });                                 // 425
    return file && this.getRelativeURL(fileId + '/' + encodeURIComponent(file.name));                                  // 426
};                                                                                                                     // 427
                                                                                                                       //
/**                                                                                                                    // 429
 * Returns the file URL                                                                                                //
 * @param fileId                                                                                                       //
 */                                                                                                                    //
UploadFS.Store.prototype.getFileURL = function (fileId) {                                                              // 433
    var file = this.getCollection().findOne({ _id: fileId }, { fields: { name: 1 } });                                 // 434
    return file && this.getURL(fileId + '/' + encodeURIComponent(file.name));                                          // 435
};                                                                                                                     // 436
                                                                                                                       //
/**                                                                                                                    // 438
 * Returns the store relative URL                                                                                      //
 * @param path                                                                                                         //
 */                                                                                                                    //
UploadFS.Store.prototype.getRelativeURL = function (path) {                                                            // 442
    return [UploadFS.config.storesPath, this.getName(), path].join('/').replace(/\/$/, '');                            // 443
};                                                                                                                     // 444
                                                                                                                       //
/**                                                                                                                    // 446
 * Returns the store absolute URL                                                                                      //
 * @param path                                                                                                         //
 */                                                                                                                    //
UploadFS.Store.prototype.getURL = function (path) {                                                                    // 450
    return Meteor.absoluteUrl(this.getRelativeURL(path), { secure: UploadFS.config.https });                           // 451
};                                                                                                                     // 452
                                                                                                                       //
/**                                                                                                                    // 454
 * Completes the file upload                                                                                           //
 * @param url                                                                                                          //
 * @param file                                                                                                         //
 * @param callback                                                                                                     //
 */                                                                                                                    //
UploadFS.Store.prototype.importFromURL = function (url, file, callback) {                                              // 460
    Meteor.call('ufsImportURL', url, file, this.getName(), callback);                                                  // 461
};                                                                                                                     // 462
                                                                                                                       //
if (Meteor.isServer) {                                                                                                 // 464
    /**                                                                                                                // 465
     * Deletes a file async                                                                                            //
     * @param fileId                                                                                                   //
     * @param callback                                                                                                 //
     */                                                                                                                //
    UploadFS.Store.prototype['delete'] = function (fileId, callback) {                                                 // 470
        throw new Error('delete is not implemented');                                                                  // 471
    };                                                                                                                 // 472
                                                                                                                       //
    /**                                                                                                                // 474
     * Returns the file read stream                                                                                    //
     * @param fileId                                                                                                   //
     * @param file                                                                                                     //
     */                                                                                                                //
    UploadFS.Store.prototype.getReadStream = function (fileId, file) {                                                 // 479
        throw new Error('getReadStream is not implemented');                                                           // 480
    };                                                                                                                 // 481
                                                                                                                       //
    /**                                                                                                                // 483
     * Returns the file write stream                                                                                   //
     * @param fileId                                                                                                   //
     * @param file                                                                                                     //
     */                                                                                                                //
    UploadFS.Store.prototype.getWriteStream = function (fileId, file) {                                                // 488
        throw new Error('getWriteStream is not implemented');                                                          // 489
    };                                                                                                                 // 490
                                                                                                                       //
    /**                                                                                                                // 492
     * Callback for copy errors                                                                                        //
     * @param err                                                                                                      //
     * @param fileId                                                                                                   //
     * @param file                                                                                                     //
     * @return boolean                                                                                                 //
     */                                                                                                                //
    UploadFS.Store.prototype.onCopyError = function (err, fileId, file) {                                              // 499
        console.error('ufs: cannot copy file "' + fileId + '" (' + err.message + ')', err);                            // 500
    };                                                                                                                 // 501
                                                                                                                       //
    /**                                                                                                                // 503
     * Called when a file has been uploaded                                                                            //
     * @param file                                                                                                     //
     */                                                                                                                //
    UploadFS.Store.prototype.onFinishUpload = function (file) {};                                                      // 507
                                                                                                                       //
    /**                                                                                                                // 510
     * Called when a file is read from the store                                                                       //
     * @param fileId                                                                                                   //
     * @param file                                                                                                     //
     * @param request                                                                                                  //
     * @param response                                                                                                 //
     * @return boolean                                                                                                 //
     */                                                                                                                //
    UploadFS.Store.prototype.onRead = function (fileId, file, request, response) {                                     // 518
        return true;                                                                                                   // 519
    };                                                                                                                 // 520
                                                                                                                       //
    /**                                                                                                                // 522
     * Callback for read errors                                                                                        //
     * @param err                                                                                                      //
     * @param fileId                                                                                                   //
     * @param file                                                                                                     //
     * @return boolean                                                                                                 //
     */                                                                                                                //
    UploadFS.Store.prototype.onReadError = function (err, fileId, file) {                                              // 529
        console.error('ufs: cannot read file "' + fileId + '" (' + err.message + ')', err);                            // 530
    };                                                                                                                 // 531
                                                                                                                       //
    /**                                                                                                                // 533
     * Callback for write errors                                                                                       //
     * @param err                                                                                                      //
     * @param fileId                                                                                                   //
     * @param file                                                                                                     //
     * @return boolean                                                                                                 //
     */                                                                                                                //
    UploadFS.Store.prototype.onWriteError = function (err, fileId, file) {                                             // 540
        console.error('ufs: cannot write file "' + fileId + '" (' + err.message + ')', err);                           // 541
    };                                                                                                                 // 542
}                                                                                                                      // 543
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"ufs-methods.js":["babel-runtime/helpers/typeof","meteor/underscore","meteor/check","meteor/meteor",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/jalik_ufs/ufs-methods.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _typeof;module.import('babel-runtime/helpers/typeof',{"default":function(v){_typeof=v}});var _;module.import('meteor/underscore',{"_":function(v){_=v}});var check;module.import('meteor/check',{"check":function(v){check=v}});var Meteor;module.import('meteor/meteor',{"Meteor":function(v){Meteor=v}});
                                                                                                                       // 1
                                                                                                                       // 2
                                                                                                                       // 3
                                                                                                                       //
var fs = Npm.require('fs');                                                                                            // 5
var http = Npm.require('http');                                                                                        // 6
var https = Npm.require('https');                                                                                      // 7
var Future = Npm.require('fibers/future');                                                                             // 8
                                                                                                                       //
Meteor.methods({                                                                                                       // 11
                                                                                                                       //
    /**                                                                                                                // 13
     * Completes the file transfer                                                                                     //
     * @param fileId                                                                                                   //
     * @param storeName                                                                                                //
     * @param token                                                                                                    //
     */                                                                                                                //
    ufsComplete: function () {                                                                                         // 19
        function ufsComplete(fileId, storeName, token) {                                                               // 19
            check(fileId, String);                                                                                     // 20
            check(storeName, String);                                                                                  // 21
            check(token, String);                                                                                      // 22
                                                                                                                       //
            // Get store                                                                                               // 24
            var store = UploadFS.getStore(storeName);                                                                  // 25
            if (!store) {                                                                                              // 26
                throw new Meteor.Error('invalid-store', "Store not found");                                            // 27
            }                                                                                                          // 28
            // Check token                                                                                             // 29
            if (!store.checkToken(token, fileId)) {                                                                    // 30
                throw new Meteor.Error('invalid-token', "Token is not valid");                                         // 31
            }                                                                                                          // 32
                                                                                                                       //
            var fut = new Future();                                                                                    // 34
            var tmpFile = UploadFS.getTempFilePath(fileId);                                                            // 35
                                                                                                                       //
            // Get the temp file                                                                                       // 37
            var rs = fs.createReadStream(tmpFile, {                                                                    // 38
                flags: 'r',                                                                                            // 39
                encoding: null,                                                                                        // 40
                autoClose: true                                                                                        // 41
            });                                                                                                        // 38
                                                                                                                       //
            rs.on('error', Meteor.bindEnvironment(function (err) {                                                     // 44
                console.error(err);                                                                                    // 45
                store.getCollection().remove({ _id: fileId });                                                         // 46
                fut['throw'](err);                                                                                     // 47
            }));                                                                                                       // 48
                                                                                                                       //
            // Save file in the store                                                                                  // 50
            store.write(rs, fileId, Meteor.bindEnvironment(function (err, file) {                                      // 51
                fs.unlink(tmpFile, function (err) {                                                                    // 52
                    err && console.error('ufs: cannot delete temp file "' + tmpFile + '" (' + err.message + ')');      // 53
                });                                                                                                    // 54
                                                                                                                       //
                if (err) {                                                                                             // 56
                    fut['throw'](err);                                                                                 // 57
                } else {                                                                                               // 58
                    // File has been fully uploaded                                                                    // 59
                    // so we don't need to keep the token anymore.                                                     // 60
                    // Also this ensure that the file cannot be modified with extra chunks later.                      // 61
                    UploadFS.tokens.remove({ fileId: fileId });                                                        // 62
                    fut['return'](file);                                                                               // 63
                }                                                                                                      // 64
            }));                                                                                                       // 65
            return fut.wait();                                                                                         // 66
        }                                                                                                              // 67
                                                                                                                       //
        return ufsComplete;                                                                                            // 19
    }(),                                                                                                               // 19
                                                                                                                       //
    /**                                                                                                                // 69
     * Creates the file and returns the file upload token                                                              //
     * @param file                                                                                                     //
     * @returns {{fileId: string, token: *, url}}                                                                      //
     */                                                                                                                //
    ufsCreate: function () {                                                                                           // 74
        function ufsCreate(file) {                                                                                     // 74
            check(file, Object);                                                                                       // 75
                                                                                                                       //
            if (typeof file.name !== 'string' || !file.name.length) {                                                  // 77
                throw new Meteor.Error('invalid-file-name', "file name is not valid");                                 // 78
            }                                                                                                          // 79
            if (typeof file.store !== 'string' || !file.store.length) {                                                // 80
                throw new Meteor.Error('invalid-store', "store is not valid");                                         // 81
            }                                                                                                          // 82
            // Get store                                                                                               // 83
            var store = UploadFS.getStore(file.store);                                                                 // 84
            if (!store) {                                                                                              // 85
                throw new Meteor.Error('invalid-store', "Store not found");                                            // 86
            }                                                                                                          // 87
                                                                                                                       //
            // Set default info                                                                                        // 89
            file.complete = false;                                                                                     // 90
            file.uploading = false;                                                                                    // 91
            file.extension = file.name && file.name.substr((~-file.name.lastIndexOf('.') >>> 0) + 2).toLowerCase();    // 92
            // Assign file MIME type based on the extension                                                            // 93
            if (file.extension && !file.type) {                                                                        // 94
                file.type = UploadFS.getMimeType(file.extension) || 'application/octet-stream';                        // 95
            }                                                                                                          // 96
            file.progress = 0;                                                                                         // 97
            file.size = parseInt(file.size) || 0;                                                                      // 98
            file.userId = file.userId || this.userId;                                                                  // 99
                                                                                                                       //
            // Check if the file matches store filter                                                                  // 101
            var filter = store.getFilter();                                                                            // 102
            if (filter instanceof UploadFS.Filter) {                                                                   // 103
                filter.check(file);                                                                                    // 104
            }                                                                                                          // 105
                                                                                                                       //
            // Create the file                                                                                         // 107
            var fileId = store.create(file);                                                                           // 108
            var token = store.createToken(fileId);                                                                     // 109
            var uploadUrl = store.getURL(fileId + '?token=' + token);                                                  // 110
                                                                                                                       //
            return {                                                                                                   // 112
                fileId: fileId,                                                                                        // 113
                token: token,                                                                                          // 114
                url: uploadUrl                                                                                         // 115
            };                                                                                                         // 112
        }                                                                                                              // 117
                                                                                                                       //
        return ufsCreate;                                                                                              // 74
    }(),                                                                                                               // 74
                                                                                                                       //
    /**                                                                                                                // 119
     * Deletes a file                                                                                                  //
     * @param fileId                                                                                                   //
     * @param storeName                                                                                                //
     * @param token                                                                                                    //
     * @returns {*}                                                                                                    //
     */                                                                                                                //
    ufsDelete: function () {                                                                                           // 126
        function ufsDelete(fileId, storeName, token) {                                                                 // 126
            check(fileId, String);                                                                                     // 127
            check(storeName, String);                                                                                  // 128
            check(token, String);                                                                                      // 129
                                                                                                                       //
            // Check store                                                                                             // 131
            var store = UploadFS.getStore(storeName);                                                                  // 132
            if (!store) {                                                                                              // 133
                throw new Meteor.Error('invalid-store', "Store not found");                                            // 134
            }                                                                                                          // 135
            // Ignore files that does not exist                                                                        // 136
            if (store.getCollection().find({ _id: fileId }).count() === 0) {                                           // 137
                return 1;                                                                                              // 138
            }                                                                                                          // 139
            // Check token                                                                                             // 140
            if (!store.checkToken(token, fileId)) {                                                                    // 141
                throw new Meteor.Error('invalid-token', "Token is not valid");                                         // 142
            }                                                                                                          // 143
            return store.getCollection().remove({ _id: fileId });                                                      // 144
        }                                                                                                              // 145
                                                                                                                       //
        return ufsDelete;                                                                                              // 126
    }(),                                                                                                               // 126
                                                                                                                       //
    /**                                                                                                                // 147
     * Imports a file from the URL                                                                                     //
     * @param url                                                                                                      //
     * @param file                                                                                                     //
     * @param storeName                                                                                                //
     * @return {*}                                                                                                     //
     */                                                                                                                //
    ufsImportURL: function () {                                                                                        // 154
        function ufsImportURL(url, file, storeName) {                                                                  // 154
            check(url, String);                                                                                        // 155
            check(file, Object);                                                                                       // 156
            check(storeName, String);                                                                                  // 157
                                                                                                                       //
            // Check URL                                                                                               // 159
            if (typeof url !== 'string' || url.length <= 0) {                                                          // 160
                throw new Meteor.Error('invalid-url', "The url is not valid");                                         // 161
            }                                                                                                          // 162
            // Check file                                                                                              // 163
            if ((typeof file === 'undefined' ? 'undefined' : _typeof(file)) !== 'object' || file === null) {           // 164
                throw new Meteor.Error('invalid-file', "The file is not valid");                                       // 165
            }                                                                                                          // 166
            // Check store                                                                                             // 167
            var store = UploadFS.getStore(storeName);                                                                  // 168
            if (!store) {                                                                                              // 169
                throw new Meteor.Error('invalid-store', 'The store does not exist');                                   // 170
            }                                                                                                          // 171
                                                                                                                       //
            // Extract file info                                                                                       // 173
            if (!file.name) {                                                                                          // 174
                file.name = url.replace(/\?.*$/, '').split('/').pop();                                                 // 175
            }                                                                                                          // 176
            if (file.name && !file.extension) {                                                                        // 177
                file.extension = file.name && file.name.substr((~-file.name.lastIndexOf('.') >>> 0) + 2).toLowerCase();
            }                                                                                                          // 179
            if (file.extension && !file.type) {                                                                        // 180
                // Assign file MIME type based on the extension                                                        // 181
                file.type = UploadFS.getMimeType(file.extension) || 'application/octet-stream';                        // 182
            }                                                                                                          // 183
            // Check if file is valid                                                                                  // 184
            if (store.getFilter() instanceof UploadFS.Filter) {                                                        // 185
                store.getFilter().check(file);                                                                         // 186
            }                                                                                                          // 187
                                                                                                                       //
            if (file.originalUrl) {                                                                                    // 189
                console.warn('ufs: The "originalUrl" attribute is automatically set when importing a file from a URL');
            }                                                                                                          // 191
                                                                                                                       //
            // Add original URL                                                                                        // 193
            file.originalUrl = url;                                                                                    // 194
                                                                                                                       //
            // Create the file                                                                                         // 196
            file.complete = false;                                                                                     // 197
            file.uploading = true;                                                                                     // 198
            file.progress = 0;                                                                                         // 199
            file._id = store.create(file);                                                                             // 200
                                                                                                                       //
            var fut = new Future();                                                                                    // 202
            var proto = void 0;                                                                                        // 203
                                                                                                                       //
            // Detect protocol to use                                                                                  // 205
            if (/http:\/\//i.test(url)) {                                                                              // 206
                proto = http;                                                                                          // 207
            } else if (/https:\/\//i.test(url)) {                                                                      // 208
                proto = https;                                                                                         // 209
            }                                                                                                          // 210
                                                                                                                       //
            this.unblock();                                                                                            // 212
                                                                                                                       //
            // Download file                                                                                           // 214
            proto.get(url, Meteor.bindEnvironment(function (res) {                                                     // 215
                // Save the file in the store                                                                          // 216
                store.write(res, file._id, function (err, file) {                                                      // 217
                    if (err) {                                                                                         // 218
                        fut['throw'](err);                                                                             // 219
                    } else {                                                                                           // 220
                        fut['return'](file);                                                                           // 221
                    }                                                                                                  // 222
                });                                                                                                    // 223
            })).on('error', function (err) {                                                                           // 224
                fut['throw'](err);                                                                                     // 225
            });                                                                                                        // 226
            return fut.wait();                                                                                         // 227
        }                                                                                                              // 228
                                                                                                                       //
        return ufsImportURL;                                                                                           // 154
    }(),                                                                                                               // 154
                                                                                                                       //
    /**                                                                                                                // 230
     * Marks the file uploading as stopped                                                                             //
     * @param fileId                                                                                                   //
     * @param storeName                                                                                                //
     * @param token                                                                                                    //
     * @returns {*}                                                                                                    //
     */                                                                                                                //
    ufsStop: function () {                                                                                             // 237
        function ufsStop(fileId, storeName, token) {                                                                   // 237
            check(fileId, String);                                                                                     // 238
            check(storeName, String);                                                                                  // 239
            check(token, String);                                                                                      // 240
                                                                                                                       //
            // Check store                                                                                             // 242
            var store = UploadFS.getStore(storeName);                                                                  // 243
            if (!store) {                                                                                              // 244
                throw new Meteor.Error('invalid-store', "Store not found");                                            // 245
            }                                                                                                          // 246
            // Check file                                                                                              // 247
            var file = store.getCollection().find({ _id: fileId }, { fields: { userId: 1 } });                         // 248
            if (!file) {                                                                                               // 249
                throw new Meteor.Error('invalid-file', "File not found");                                              // 250
            }                                                                                                          // 251
            // Check token                                                                                             // 252
            if (!store.checkToken(token, fileId)) {                                                                    // 253
                throw new Meteor.Error('invalid-token', "Token is not valid");                                         // 254
            }                                                                                                          // 255
                                                                                                                       //
            return store.getCollection().update({ _id: fileId }, {                                                     // 257
                $set: { uploading: false }                                                                             // 258
            });                                                                                                        // 257
        }                                                                                                              // 260
                                                                                                                       //
        return ufsStop;                                                                                                // 237
    }()                                                                                                                // 237
});                                                                                                                    // 11
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"ufs-server.js":["babel-runtime/helpers/typeof","meteor/underscore","meteor/meteor","meteor/webapp",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/jalik_ufs/ufs-server.js                                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _typeof;module.import('babel-runtime/helpers/typeof',{"default":function(v){_typeof=v}});var _;module.import('meteor/underscore',{"_":function(v){_=v}});var Meteor;module.import('meteor/meteor',{"Meteor":function(v){Meteor=v}});var WebApp;module.import('meteor/webapp',{"WebApp":function(v){WebApp=v}});
                                                                                                                       // 1
                                                                                                                       // 2
                                                                                                                       // 3
                                                                                                                       //
var domain = Npm.require('domain');                                                                                    // 5
var fs = Npm.require('fs');                                                                                            // 6
var http = Npm.require('http');                                                                                        // 7
var https = Npm.require('https');                                                                                      // 8
var mkdirp = Npm.require('mkdirp');                                                                                    // 9
var stream = Npm.require('stream');                                                                                    // 10
var URL = Npm.require('url');                                                                                          // 11
var zlib = Npm.require('zlib');                                                                                        // 12
                                                                                                                       //
Meteor.startup(function () {                                                                                           // 15
    var path = UploadFS.config.tmpDir;                                                                                 // 16
    var mode = UploadFS.config.tmpDirPermissions;                                                                      // 17
                                                                                                                       //
    fs.stat(path, function (err) {                                                                                     // 19
        if (err) {                                                                                                     // 20
            // Create the temp directory                                                                               // 21
            mkdirp(path, { mode: mode }, function (err) {                                                              // 22
                if (err) {                                                                                             // 23
                    console.error('ufs: cannot create temp directory at "' + path + '" (' + err.message + ')');        // 24
                } else {                                                                                               // 25
                    console.log('ufs: temp directory created at "' + path + '"');                                      // 26
                }                                                                                                      // 27
            });                                                                                                        // 28
        } else {                                                                                                       // 29
            // Set directory permissions                                                                               // 30
            fs.chmod(path, mode, function (err) {                                                                      // 31
                err && console.error('ufs: cannot set temp directory permissions ' + mode + ' (' + err.message + ')');
            });                                                                                                        // 33
        }                                                                                                              // 34
    });                                                                                                                // 35
});                                                                                                                    // 36
                                                                                                                       //
// Create domain to handle errors                                                                                      // 38
// and possibly avoid server crashes.                                                                                  // 39
var d = domain.create();                                                                                               // 40
                                                                                                                       //
d.on('error', function (err) {                                                                                         // 42
    console.error('ufs: ' + err.message);                                                                              // 43
});                                                                                                                    // 44
                                                                                                                       //
// Listen HTTP requests to serve files                                                                                 // 46
WebApp.connectHandlers.use(function (req, res, next) {                                                                 // 47
    // Quick check to see if request should be catch                                                                   // 48
    if (req.url.indexOf(UploadFS.config.storesPath) === -1) {                                                          // 49
        next();                                                                                                        // 50
        return;                                                                                                        // 51
    }                                                                                                                  // 52
                                                                                                                       //
    // Remove store path                                                                                               // 54
    var parsedUrl = URL.parse(req.url);                                                                                // 55
    var path = parsedUrl.pathname.substr(UploadFS.config.storesPath.length + 1);                                       // 56
                                                                                                                       //
    var allowCORS = function allowCORS() {                                                                             // 58
        // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);                                           // 59
        res.setHeader("Access-Control-Allow-Methods", "POST");                                                         // 60
        res.setHeader("Access-Control-Allow-Origin", "*");                                                             // 61
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");                                                 // 62
    };                                                                                                                 // 63
                                                                                                                       //
    if (req.method === "OPTIONS") {                                                                                    // 65
        var regExp = new RegExp('^\/([^\/\?]+)\/([^\/\?]+)$');                                                         // 66
        var match = regExp.exec(path);                                                                                 // 67
                                                                                                                       //
        // Request is not valid                                                                                        // 69
        if (match === null) {                                                                                          // 70
            res.writeHead(400);                                                                                        // 71
            res.end();                                                                                                 // 72
            return;                                                                                                    // 73
        }                                                                                                              // 74
                                                                                                                       //
        // Get store                                                                                                   // 76
        var store = UploadFS.getStore(match[1]);                                                                       // 77
        if (!store) {                                                                                                  // 78
            res.writeHead(404);                                                                                        // 79
            res.end();                                                                                                 // 80
            return;                                                                                                    // 81
        }                                                                                                              // 82
                                                                                                                       //
        // If a store is found, go ahead and allow the origin                                                          // 84
        allowCORS();                                                                                                   // 85
                                                                                                                       //
        next();                                                                                                        // 87
    } else if (req.method === 'POST') {                                                                                // 88
        var _ret = function () {                                                                                       // 89
            // Get store                                                                                               // 90
            var regExp = new RegExp('^\/([^\/\?]+)\/([^\/\?]+)$');                                                     // 91
            var match = regExp.exec(path);                                                                             // 92
                                                                                                                       //
            // Request is not valid                                                                                    // 94
            if (match === null) {                                                                                      // 95
                res.writeHead(400);                                                                                    // 96
                res.end();                                                                                             // 97
                return {                                                                                               // 98
                    v: void 0                                                                                          // 98
                };                                                                                                     // 98
            }                                                                                                          // 99
                                                                                                                       //
            // Get store                                                                                               // 101
            var store = UploadFS.getStore(match[1]);                                                                   // 102
            if (!store) {                                                                                              // 103
                res.writeHead(404);                                                                                    // 104
                res.end();                                                                                             // 105
                return {                                                                                               // 106
                    v: void 0                                                                                          // 106
                };                                                                                                     // 106
            }                                                                                                          // 107
                                                                                                                       //
            // If a store is found, go ahead and allow the origin                                                      // 109
            allowCORS();                                                                                               // 110
                                                                                                                       //
            // Get file                                                                                                // 112
            var fileId = match[2];                                                                                     // 113
            if (store.getCollection().find({ _id: fileId }).count() === 0) {                                           // 114
                res.writeHead(404);                                                                                    // 115
                res.end();                                                                                             // 116
                return {                                                                                               // 117
                    v: void 0                                                                                          // 117
                };                                                                                                     // 117
            }                                                                                                          // 118
                                                                                                                       //
            // Check upload token                                                                                      // 120
            if (!store.checkToken(req.query.token, fileId)) {                                                          // 121
                res.writeHead(403);                                                                                    // 122
                res.end();                                                                                             // 123
                return {                                                                                               // 124
                    v: void 0                                                                                          // 124
                };                                                                                                     // 124
            }                                                                                                          // 125
                                                                                                                       //
            var tmpFile = UploadFS.getTempFilePath(fileId);                                                            // 127
            var ws = fs.createWriteStream(tmpFile, { flags: 'a' });                                                    // 128
            var fields = { uploading: true };                                                                          // 129
            var progress = parseFloat(req.query.progress);                                                             // 130
            if (!isNaN(progress) && progress > 0) {                                                                    // 131
                fields.progress = Math.min(progress, 1);                                                               // 132
            }                                                                                                          // 133
                                                                                                                       //
            req.on('data', function (chunk) {                                                                          // 135
                ws.write(chunk);                                                                                       // 136
            });                                                                                                        // 137
            req.on('error', function (err) {                                                                           // 138
                res.writeHead(500);                                                                                    // 139
                res.end();                                                                                             // 140
            });                                                                                                        // 141
            req.on('end', Meteor.bindEnvironment(function () {                                                         // 142
                // Update completed state without triggering hooks                                                     // 143
                store.getCollection().direct.update({ _id: fileId }, { $set: fields });                                // 144
                ws.end();                                                                                              // 145
            }));                                                                                                       // 146
            ws.on('error', function (err) {                                                                            // 147
                console.error('ufs: cannot write chunk of file "' + fileId + '" (' + err.message + ')');               // 148
                fs.unlink(tmpFile, function (err) {                                                                    // 149
                    err && console.error('ufs: cannot delete temp file "' + tmpFile + '" (' + err.message + ')');      // 150
                });                                                                                                    // 151
                res.writeHead(500);                                                                                    // 152
                res.end();                                                                                             // 153
            });                                                                                                        // 154
            ws.on('finish', function () {                                                                              // 155
                res.writeHead(204, { "Content-Type": 'text/plain' });                                                  // 156
                res.end();                                                                                             // 157
            });                                                                                                        // 158
        }();                                                                                                           // 89
                                                                                                                       //
        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;                   // 89
    } else if (req.method == 'GET') {                                                                                  // 159
        var _ret2 = function () {                                                                                      // 160
            // Get store, file Id and file name                                                                        // 161
            var regExp = new RegExp('^\/([^\/\?]+)\/([^\/\?]+)(?:\/([^\/\?]+))?$');                                    // 162
            var match = regExp.exec(path);                                                                             // 163
                                                                                                                       //
            // Avoid 504 Gateway timeout error                                                                         // 165
            // if file is not handled by UploadFS.                                                                     // 166
            if (match === null) {                                                                                      // 167
                next();                                                                                                // 168
                return {                                                                                               // 169
                    v: void 0                                                                                          // 169
                };                                                                                                     // 169
            }                                                                                                          // 170
                                                                                                                       //
            // Get store                                                                                               // 172
            var storeName = match[1];                                                                                  // 173
            var store = UploadFS.getStore(storeName);                                                                  // 174
                                                                                                                       //
            if (!store) {                                                                                              // 176
                res.writeHead(404);                                                                                    // 177
                res.end();                                                                                             // 178
                return {                                                                                               // 179
                    v: void 0                                                                                          // 179
                };                                                                                                     // 179
            }                                                                                                          // 180
                                                                                                                       //
            if (store.onRead !== null && store.onRead !== undefined && typeof store.onRead !== 'function') {           // 182
                console.error('ufs: store "' + storeName + '" onRead is not a function');                              // 183
                res.writeHead(500);                                                                                    // 184
                res.end();                                                                                             // 185
                return {                                                                                               // 186
                    v: void 0                                                                                          // 186
                };                                                                                                     // 186
            }                                                                                                          // 187
                                                                                                                       //
            // Remove file extension from file Id                                                                      // 189
            var index = match[2].indexOf('.');                                                                         // 190
            var fileId = index !== -1 ? match[2].substr(0, index) : match[2];                                          // 191
                                                                                                                       //
            // Get file from database                                                                                  // 193
            var file = store.getCollection().findOne({ _id: fileId });                                                 // 194
            if (!file) {                                                                                               // 195
                res.writeHead(404);                                                                                    // 196
                res.end();                                                                                             // 197
                return {                                                                                               // 198
                    v: void 0                                                                                          // 198
                };                                                                                                     // 198
            }                                                                                                          // 199
                                                                                                                       //
            // Simulate read speed                                                                                     // 201
            if (UploadFS.config.simulateReadDelay) {                                                                   // 202
                Meteor._sleepForMs(UploadFS.config.simulateReadDelay);                                                 // 203
            }                                                                                                          // 204
                                                                                                                       //
            d.run(function () {                                                                                        // 206
                // Check if the file can be accessed                                                                   // 207
                if (store.onRead.call(store, fileId, file, req, res) !== false) {                                      // 208
                    var _ret3 = function () {                                                                          // 208
                        var options = {};                                                                              // 209
                        var status = 200;                                                                              // 210
                                                                                                                       //
                        // Prepare response headers                                                                    // 212
                        var headers = {                                                                                // 213
                            'Content-Type': file.type,                                                                 // 214
                            'Content-Length': file.size                                                                // 215
                        };                                                                                             // 213
                                                                                                                       //
                        // Parse request headers                                                                       // 218
                        if (_typeof(req.headers) === 'object') {                                                       // 219
                            // Send data in range                                                                      // 220
                            if (typeof req.headers.range === 'string') {                                               // 221
                                var range = req.headers.range;                                                         // 222
                                                                                                                       //
                                // Range is not valid                                                                  // 224
                                if (!range) {                                                                          // 225
                                    res.writeHead(416);                                                                // 226
                                    res.end();                                                                         // 227
                                    return {                                                                           // 228
                                        v: void 0                                                                      // 228
                                    };                                                                                 // 228
                                }                                                                                      // 229
                                                                                                                       //
                                var positions = range.replace(/bytes=/, '').split('-');                                // 231
                                var start = parseInt(positions[0], 10);                                                // 232
                                var total = file.size;                                                                 // 233
                                var end = positions[1] ? parseInt(positions[1], 10) : total - 1;                       // 234
                                                                                                                       //
                                // Update headers                                                                      // 236
                                headers['Content-Range'] = 'bytes ' + start + '-' + end + '/' + total;                 // 237
                                headers['Accept-Ranges'] = 'bytes';                                                    // 238
                                headers['Content-Length'] = end - start + 1;                                           // 239
                                                                                                                       //
                                status = 206; // partial content                                                       // 241
                                options.start = start;                                                                 // 242
                                options.end = end;                                                                     // 243
                            }                                                                                          // 244
                        }                                                                                              // 245
                                                                                                                       //
                        // Open the file stream                                                                        // 247
                        var rs = store.getReadStream(fileId, file, options);                                           // 248
                        var ws = new stream.PassThrough();                                                             // 249
                                                                                                                       //
                        rs.on('error', Meteor.bindEnvironment(function (err) {                                         // 251
                            store.onReadError.call(store, err, fileId, file);                                          // 252
                            res.end();                                                                                 // 253
                        }));                                                                                           // 254
                        ws.on('error', Meteor.bindEnvironment(function (err) {                                         // 255
                            store.onReadError.call(store, err, fileId, file);                                          // 256
                            res.end();                                                                                 // 257
                        }));                                                                                           // 258
                        ws.on('close', function () {                                                                   // 259
                            // Close output stream at the end                                                          // 260
                            ws.emit('end');                                                                            // 261
                        });                                                                                            // 262
                                                                                                                       //
                        // Transform stream                                                                            // 264
                        store.transformRead(rs, ws, fileId, file, req, headers);                                       // 265
                                                                                                                       //
                        // Parse request headers                                                                       // 267
                        if (_typeof(req.headers) === 'object') {                                                       // 268
                            // Compress data using if needed (ignore audio/video as they are already compressed)       // 269
                            if (typeof req.headers['accept-encoding'] === 'string' && !/^(audio|video)/.test(file.type)) {
                                var accept = req.headers['accept-encoding'];                                           // 271
                                                                                                                       //
                                // Compress with gzip                                                                  // 273
                                if (accept.match(/\bgzip\b/)) {                                                        // 274
                                    headers['Content-Encoding'] = 'gzip';                                              // 275
                                    delete headers['Content-Length'];                                                  // 276
                                    res.writeHead(status, headers);                                                    // 277
                                    ws.pipe(zlib.createGzip()).pipe(res);                                              // 278
                                    return {                                                                           // 279
                                        v: void 0                                                                      // 279
                                    };                                                                                 // 279
                                }                                                                                      // 280
                                // Compress with deflate                                                               // 281
                                else if (accept.match(/\bdeflate\b/)) {                                                // 274
                                        headers['Content-Encoding'] = 'deflate';                                       // 283
                                        delete headers['Content-Length'];                                              // 284
                                        res.writeHead(status, headers);                                                // 285
                                        ws.pipe(zlib.createDeflate()).pipe(res);                                       // 286
                                        return {                                                                       // 287
                                            v: void 0                                                                  // 287
                                        };                                                                             // 287
                                    }                                                                                  // 288
                            }                                                                                          // 289
                        }                                                                                              // 290
                                                                                                                       //
                        // Send raw data                                                                               // 292
                        if (!headers['Content-Encoding']) {                                                            // 293
                            res.writeHead(status, headers);                                                            // 294
                            ws.pipe(res);                                                                              // 295
                        }                                                                                              // 296
                    }();                                                                                               // 208
                                                                                                                       //
                    if ((typeof _ret3 === 'undefined' ? 'undefined' : _typeof(_ret3)) === "object") return _ret3.v;    // 208
                } else {                                                                                               // 298
                    res.end();                                                                                         // 299
                }                                                                                                      // 300
            });                                                                                                        // 301
        }();                                                                                                           // 160
                                                                                                                       //
        if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;                // 160
    } else {                                                                                                           // 302
        next();                                                                                                        // 303
    }                                                                                                                  // 304
});                                                                                                                    // 305
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/jalik:ufs/ufs.js");
require("./node_modules/meteor/jalik:ufs/ufs-mime.js");
require("./node_modules/meteor/jalik:ufs/ufs-utilities.js");
require("./node_modules/meteor/jalik:ufs/ufs-config.js");
require("./node_modules/meteor/jalik:ufs/ufs-filter.js");
require("./node_modules/meteor/jalik:ufs/ufs-store-permissions.js");
require("./node_modules/meteor/jalik:ufs/ufs-store.js");
require("./node_modules/meteor/jalik:ufs/ufs-methods.js");
require("./node_modules/meteor/jalik:ufs/ufs-server.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['jalik:ufs'] = {}, {
  UploadFS: UploadFS
});

})();

//# sourceMappingURL=jalik_ufs.js.map
