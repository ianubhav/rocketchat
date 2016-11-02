(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var check = Package.check.check;
var Match = Package.check.Match;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var Logger = Package['rocketchat:logger'].Logger;
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

/* Package-scope variables */
var __coffeescriptShare, Importer;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:importer":{"lib":{"_importer.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_importer/lib/_importer.coffee.js                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                                                                                                                      // 1
                                                                                                                      //
Importer = {};                                                                                                        // 1
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"importTool.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_importer/lib/importTool.coffee.js                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Importer.Importers = {};                                                                                              // 1
                                                                                                                      //
Importer.AddImporter = function(name, importer, options) {                                                            // 3
  if (Importer.Importers[name] == null) {                                                                             //
    return Importer.Importers[name] = {                                                                               //
      name: options.name,                                                                                             //
      importer: importer,                                                                                             //
      fileTypeRegex: options.fileTypeRegex,                                                                           //
      description: options.description                                                                                //
    };                                                                                                                //
  }                                                                                                                   //
};                                                                                                                    // 3
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"classes":{"ImporterBase.coffee.js":["bson",function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_importer/server/classes/ImporterBase.coffee.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var bind = function bind(fn, me) {                                                                                    //
  return function () {                                                                                                //
    return fn.apply(me, arguments);                                                                                   //
  };                                                                                                                  //
};                                                                                                                    //
                                                                                                                      //
Importer.Base = Importer.Base = function () {                                                                         //
  Base.MaxBSONSize = 8000000;                                                                                         //
                                                                                                                      //
  Base.http = Npm.require('http');                                                                                    //
                                                                                                                      //
  Base.https = Npm.require('https');                                                                                  //
                                                                                                                      //
  Base.getBSONSize = function (object) {                                                                              //
    var BSON, bson;                                                                                                   //
    BSON = require('bson')["native"]().BSON;                                                                          //
    bson = new BSON();                                                                                                //
    return bson.calculateObjectSize(object);                                                                          //
  };                                                                                                                  //
                                                                                                                      //
  Base.getBSONSafeArraysFromAnArray = function (theArray) {                                                           //
    var BSONSize, i, maxSize, safeArrays;                                                                             //
    BSONSize = Importer.Base.getBSONSize(theArray);                                                                   //
    maxSize = Math.floor(theArray.length / Math.ceil(BSONSize / Importer.Base.MaxBSONSize));                          //
    safeArrays = [];                                                                                                  //
    i = 0;                                                                                                            //
    while (i < theArray.length) {                                                                                     //
      safeArrays.push(theArray.slice(i, i += maxSize));                                                               //
    }                                                                                                                 //
    return safeArrays;                                                                                                //
  };                                                                                                                  //
                                                                                                                      //
  function Base(name, description, fileTypeRegex) {                                                                   //
    var importId;                                                                                                     //
    this.name = name;                                                                                                 //
    this.description = description;                                                                                   //
    this.fileTypeRegex = fileTypeRegex;                                                                               //
    this.uploadFile = bind(this.uploadFile, this);                                                                    //
    this.updateRecord = bind(this.updateRecord, this);                                                                //
    this.addCountCompleted = bind(this.addCountCompleted, this);                                                      //
    this.addCountToTotal = bind(this.addCountToTotal, this);                                                          //
    this.updateProgress = bind(this.updateProgress, this);                                                            //
    this.getProgress = bind(this.getProgress, this);                                                                  //
    this.getSelection = bind(this.getSelection, this);                                                                //
    this.startImport = bind(this.startImport, this);                                                                  //
    this.prepare = bind(this.prepare, this);                                                                          //
    this.logger = new Logger(this.name + " Importer", {});                                                            //
    this.progress = new Importer.Progress(this.name);                                                                 //
    this.collection = Importer.RawImports;                                                                            //
    this.AdmZip = Npm.require('adm-zip');                                                                             //
    importId = Importer.Imports.insert({                                                                              //
      'type': this.name,                                                                                              //
      'ts': Date.now(),                                                                                               //
      'status': this.progress.step,                                                                                   //
      'valid': true,                                                                                                  //
      'user': Meteor.user()._id                                                                                       //
    });                                                                                                               //
    this.importRecord = Importer.Imports.findOne(importId);                                                           //
    this.users = {};                                                                                                  //
    this.channels = {};                                                                                               //
    this.messages = {};                                                                                               //
  }                                                                                                                   //
                                                                                                                      //
  Base.prototype.prepare = function (dataURI, sentContentType, fileName) {                                            //
    if (!this.fileTypeRegex.test(sentContentType)) {                                                                  //
      throw new Error("Invalid file uploaded to import " + this.name + " data from.");                                //
    }                                                                                                                 //
    this.updateProgress(Importer.ProgressStep.PREPARING_STARTED);                                                     //
    return this.updateRecord({                                                                                        //
      'file': fileName                                                                                                //
    });                                                                                                               //
  };                                                                                                                  //
                                                                                                                      //
  Base.prototype.startImport = function (importSelection) {                                                           //
    if (importSelection === void 0) {                                                                                 //
      throw new Error("No selected users and channel data provided to the " + this.name + " importer.");              //
    } else if (importSelection.users === void 0) {                                                                    //
      throw new Error("Users in the selected data wasn't found, it must but at least an empty array for the " + this.name + " importer.");
    } else if (importSelection.channels === void 0) {                                                                 //
      throw new Error("Channels in the selected data wasn't found, it must but at least an empty array for the " + this.name + " importer.");
    }                                                                                                                 //
    return this.updateProgress(Importer.ProgressStep.IMPORTING_STARTED);                                              //
  };                                                                                                                  //
                                                                                                                      //
  Base.prototype.getSelection = function () {                                                                         //
    throw new Error("Invalid 'getSelection' called on " + this.name + ", it must be overridden and super can not be called.");
  };                                                                                                                  //
                                                                                                                      //
  Base.prototype.getProgress = function () {                                                                          //
    return this.progress;                                                                                             //
  };                                                                                                                  //
                                                                                                                      //
  Base.prototype.updateProgress = function (step) {                                                                   //
    this.progress.step = step;                                                                                        //
    this.logger.debug(this.name + " is now at " + step + ".");                                                        //
    this.updateRecord({                                                                                               //
      'status': this.progress.step                                                                                    //
    });                                                                                                               //
    return this.progress;                                                                                             //
  };                                                                                                                  //
                                                                                                                      //
  Base.prototype.addCountToTotal = function (count) {                                                                 //
    this.progress.count.total = this.progress.count.total + count;                                                    //
    this.updateRecord({                                                                                               //
      'count.total': this.progress.count.total                                                                        //
    });                                                                                                               //
    return this.progress;                                                                                             //
  };                                                                                                                  //
                                                                                                                      //
  Base.prototype.addCountCompleted = function (count) {                                                               //
    this.progress.count.completed = this.progress.count.completed + count;                                            //
    if (this.progress.count.completed % 500 === 0 || this.progress.count.completed >= this.progress.count.total) {    //
      this.updateRecord({                                                                                             //
        'count.completed': this.progress.count.completed                                                              //
      });                                                                                                             //
    }                                                                                                                 //
    return this.progress;                                                                                             //
  };                                                                                                                  //
                                                                                                                      //
  Base.prototype.updateRecord = function (fields) {                                                                   //
    Importer.Imports.update({                                                                                         //
      _id: this.importRecord._id                                                                                      //
    }, {                                                                                                              //
      $set: fields                                                                                                    //
    });                                                                                                               //
    this.importRecord = Importer.Imports.findOne(this.importRecord._id);                                              //
    return this.importRecord;                                                                                         //
  };                                                                                                                  //
                                                                                                                      //
  Base.prototype.uploadFile = function (details, fileUrl, user, room, timeStamp) {                                    //
    var requestModule;                                                                                                //
    this.logger.debug("Uploading the file " + details.name + " from " + fileUrl + ".");                               //
    requestModule = /https/i.test(fileUrl) ? Importer.Base.https : Importer.Base.http;                                //
    return requestModule.get(fileUrl, Meteor.bindEnvironment(function (stream) {                                      //
      var fileId;                                                                                                     //
      fileId = Meteor.fileStore.create(details);                                                                      //
      if (fileId) {                                                                                                   //
        return Meteor.fileStore.write(stream, fileId, function (err, file) {                                          //
          var attachment, msg, ref, url;                                                                              //
          if (err) {                                                                                                  //
            throw new Error(err);                                                                                     //
          } else {                                                                                                    //
            url = file.url.replace(Meteor.absoluteUrl(), '/');                                                        //
            attachment = {                                                                                            //
              title: "File Uploaded: " + file.name,                                                                   //
              title_link: url                                                                                         //
            };                                                                                                        //
            if (/^image\/.+/.test(file.type)) {                                                                       //
              attachment.image_url = url;                                                                             //
              attachment.image_type = file.type;                                                                      //
              attachment.image_size = file.size;                                                                      //
              attachment.image_dimensions = (ref = file.identify) != null ? ref.size : void 0;                        //
            }                                                                                                         //
            if (/^audio\/.+/.test(file.type)) {                                                                       //
              attachment.audio_url = url;                                                                             //
              attachment.audio_type = file.type;                                                                      //
              attachment.audio_size = file.size;                                                                      //
            }                                                                                                         //
            if (/^video\/.+/.test(file.type)) {                                                                       //
              attachment.video_url = url;                                                                             //
              attachment.video_type = file.type;                                                                      //
              attachment.video_size = file.size;                                                                      //
            }                                                                                                         //
            msg = {                                                                                                   //
              rid: details.rid,                                                                                       //
              ts: timeStamp,                                                                                          //
              msg: '',                                                                                                //
              file: {                                                                                                 //
                _id: file._id                                                                                         //
              },                                                                                                      //
              groupable: false,                                                                                       //
              attachments: [attachment]                                                                               //
            };                                                                                                        //
            if (details.message_id != null && typeof details.message_id === 'string') {                               //
              msg['_id'] = details.message_id;                                                                        //
            }                                                                                                         //
            return RocketChat.sendMessage(user, msg, room, true);                                                     //
          }                                                                                                           //
        });                                                                                                           //
      } else {                                                                                                        //
        return this.logger.error("Failed to create the store for " + fileUrl + "!!!");                                //
      }                                                                                                               //
    }));                                                                                                              //
  };                                                                                                                  //
                                                                                                                      //
  return Base;                                                                                                        //
}();                                                                                                                  //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"ImporterProgress.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_importer/server/classes/ImporterProgress.coffee.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Importer.Progress = Importer.Progress = (function() {                                                                 // 2
  function Progress(name) {                                                                                           //
    this.name = name;                                                                                                 //
    this.step = Importer.ProgressStep.NEW;                                                                            //
    this.count = {                                                                                                    //
      completed: 0,                                                                                                   //
      total: 0                                                                                                        //
    };                                                                                                                //
  }                                                                                                                   //
                                                                                                                      //
  return Progress;                                                                                                    //
                                                                                                                      //
})();                                                                                                                 //
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ImporterProgressStep.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_importer/server/classes/ImporterProgressStep.coffee.js                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Importer.ProgressStep = Object.freeze({                                                                               //
  NEW: 'importer_new',                                                                                                //
  PREPARING_STARTED: 'importer_preparing_started',                                                                    //
  PREPARING_USERS: 'importer_preparing_users',                                                                        //
  PREPARING_CHANNELS: 'importer_preparing_channels',                                                                  //
  PREPARING_MESSAGES: 'importer_preparing_messages',                                                                  //
  USER_SELECTION: 'importer_user_selection',                                                                          //
  IMPORTING_STARTED: 'importer_importing_started',                                                                    //
  IMPORTING_USERS: 'importer_importing_users',                                                                        //
  IMPORTING_CHANNELS: 'importer_importing_channels',                                                                  //
  IMPORTING_MESSAGES: 'importer_importing_messages',                                                                  //
  FINISHING: 'importer_finishing',                                                                                    //
  DONE: 'importer_done',                                                                                              //
  ERROR: 'importer_import_failed',                                                                                    //
  CANCELLED: 'importer_import_cancelled'                                                                              //
});                                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ImporterSelection.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_importer/server/classes/ImporterSelection.coffee.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Importer.Selection = Importer.Selection = (function() {                                                               // 2
  function Selection(name, users, channels) {                                                                         //
    this.name = name;                                                                                                 //
    this.users = users;                                                                                               //
    this.channels = channels;                                                                                         //
  }                                                                                                                   //
                                                                                                                      //
  return Selection;                                                                                                   //
                                                                                                                      //
})();                                                                                                                 //
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ImporterSelectionChannel.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_importer/server/classes/ImporterSelectionChannel.coffee.js                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Importer.SelectionChannel = Importer.SelectionChannel = (function() {                                                 // 2
  function SelectionChannel(channel_id, name, is_archived, do_import) {                                               //
    this.channel_id = channel_id;                                                                                     //
    this.name = name;                                                                                                 //
    this.is_archived = is_archived;                                                                                   //
    this.do_import = do_import;                                                                                       //
  }                                                                                                                   //
                                                                                                                      //
  return SelectionChannel;                                                                                            //
                                                                                                                      //
})();                                                                                                                 //
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"ImporterSelectionUser.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_importer/server/classes/ImporterSelectionUser.coffee.js                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Importer.SelectionUser = Importer.SelectionUser = function () {                                                       //
  function SelectionUser(user_id, username, email, is_deleted, is_bot, do_import) {                                   //
    this.user_id = user_id;                                                                                           //
    this.username = username;                                                                                         //
    this.email = email;                                                                                               //
    this.is_deleted = is_deleted;                                                                                     //
    this.is_bot = is_bot;                                                                                             //
    this.do_import = do_import;                                                                                       //
  }                                                                                                                   //
                                                                                                                      //
  return SelectionUser;                                                                                               //
}();                                                                                                                  //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"models":{"Imports.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_importer/server/models/Imports.coffee.js                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var extend = function extend(child, parent) {                                                                         //
  for (var key in meteorBabelHelpers.sanitizeForInObject(parent)) {                                                   //
    if (hasProp.call(parent, key)) child[key] = parent[key];                                                          //
  }function ctor() {                                                                                                  //
    this.constructor = child;                                                                                         //
  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;    //
},                                                                                                                    //
    hasProp = {}.hasOwnProperty;                                                                                      //
                                                                                                                      //
Importer.Imports = new (Importer.Imports = function (superClass) {                                                    //
  extend(Imports, superClass);                                                                                        //
                                                                                                                      //
  function Imports() {                                                                                                //
    Imports.__super__.constructor.call(this, 'import');                                                               //
  }                                                                                                                   //
                                                                                                                      //
  return Imports;                                                                                                     //
}(RocketChat.models._Base))();                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"RawImports.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_importer/server/models/RawImports.coffee.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;                                                                                        //
                                                                                                                      //
Importer.RawImports = new (Importer.RawImports = (function(superClass) {                                              // 1
  extend(RawImports, superClass);                                                                                     //
                                                                                                                      //
  function RawImports() {                                                                                             //
    RawImports.__super__.constructor.call(this, 'raw_imports');                                                       //
  }                                                                                                                   //
                                                                                                                      //
  return RawImports;                                                                                                  //
                                                                                                                      //
})(RocketChat.models._Base));                                                                                         //
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"methods":{"getImportProgress.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_importer/server/methods/getImportProgress.coffee.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                      // 1
  getImportProgress: function(name) {                                                                                 //
    var ref;                                                                                                          // 3
    if (!Meteor.userId()) {                                                                                           //
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                  // 4
        method: 'getImportProgress'                                                                                   //
      });                                                                                                             //
    }                                                                                                                 //
    if (Importer.Importers[name] != null) {                                                                           //
      return (ref = Importer.Importers[name].importerInstance) != null ? ref.getProgress() : void 0;                  // 7
    } else {                                                                                                          //
      throw new Meteor.Error('error-importer-not-defined', 'The importer was not defined correctly, it is missing the Import class.', {
        method: 'getImportProgress'                                                                                   //
      });                                                                                                             //
    }                                                                                                                 //
  }                                                                                                                   //
});                                                                                                                   //
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getSelectionData.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_importer/server/methods/getSelectionData.coffee.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                      // 1
  getSelectionData: function(name) {                                                                                  //
    var progress, ref;                                                                                                // 3
    if (!Meteor.userId()) {                                                                                           //
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                  // 4
        method: 'getSelectionData'                                                                                    //
      });                                                                                                             //
    }                                                                                                                 //
    if (((ref = Importer.Importers[name]) != null ? ref.importerInstance : void 0) != null) {                         //
      progress = Importer.Importers[name].importerInstance.getProgress();                                             //
      switch (progress.step) {                                                                                        // 8
        case Importer.ProgressStep.USER_SELECTION:                                                                    // 8
          return Importer.Importers[name].importerInstance.getSelection();                                            // 10
        default:                                                                                                      // 8
          return false;                                                                                               // 12
      }                                                                                                               // 8
    } else {                                                                                                          //
      throw new Meteor.Error('error-importer-not-defined', 'The importer was not defined correctly, it is missing the Import class.', {
        method: 'getSelectionData'                                                                                    //
      });                                                                                                             //
    }                                                                                                                 //
  }                                                                                                                   //
});                                                                                                                   //
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"prepareImport.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_importer/server/methods/prepareImport.coffee.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                      // 1
  prepareImport: function(name, dataURI, contentType, fileName) {                                                     //
    var ref;                                                                                                          // 3
    if (!Meteor.userId()) {                                                                                           //
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                  // 4
        method: 'prepareImport'                                                                                       //
      });                                                                                                             //
    }                                                                                                                 //
    if (((ref = Importer.Importers[name]) != null ? ref.importerInstance : void 0) != null) {                         //
      return Importer.Importers[name].importerInstance.prepare(dataURI, contentType, fileName);                       //
    } else {                                                                                                          //
      throw new Meteor.Error('error-importer-not-defined', 'The importer was not defined correctly, it is missing the Import class.', {
        method: 'prepareImport'                                                                                       //
      });                                                                                                             //
    }                                                                                                                 //
  }                                                                                                                   //
});                                                                                                                   //
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"restartImport.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_importer/server/methods/restartImport.coffee.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                      // 1
  restartImport: function(name) {                                                                                     //
    var importer;                                                                                                     // 3
    if (!Meteor.userId()) {                                                                                           //
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                  // 4
        method: 'restartImport'                                                                                       //
      });                                                                                                             //
    }                                                                                                                 //
    if (Importer.Importers[name] != null) {                                                                           //
      importer = Importer.Importers[name];                                                                            //
      importer.importerInstance.updateProgress(Importer.ProgressStep.CANCELLED);                                      //
      importer.importerInstance.updateRecord({                                                                        //
        valid: false                                                                                                  //
      });                                                                                                             //
      importer.importerInstance = void 0;                                                                             //
      importer.importerInstance = new importer.importer(importer.name, importer.description, importer.fileTypeRegex);
      return importer.importerInstance.getProgress();                                                                 // 12
    } else {                                                                                                          //
      throw new Meteor.Error('error-importer-not-defined', 'The importer was not defined correctly, it is missing the Import class.', {
        method: 'restartImport'                                                                                       //
      });                                                                                                             //
    }                                                                                                                 //
  }                                                                                                                   //
});                                                                                                                   //
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"setupImporter.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_importer/server/methods/setupImporter.coffee.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                      // 1
  setupImporter: function(name) {                                                                                     //
    var importer, ref;                                                                                                // 3
    if (!Meteor.userId()) {                                                                                           //
      throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                  // 4
        method: 'setupImporter'                                                                                       //
      });                                                                                                             //
    }                                                                                                                 //
    if (((ref = Importer.Importers[name]) != null ? ref.importer : void 0) != null) {                                 //
      importer = Importer.Importers[name];                                                                            //
      if (importer.importerInstance) {                                                                                //
        return importer.importerInstance.getProgress();                                                               // 10
      } else {                                                                                                        //
        importer.importerInstance = new importer.importer(importer.name, importer.description, importer.fileTypeRegex);
        return importer.importerInstance.getProgress();                                                               // 13
      }                                                                                                               //
    } else {                                                                                                          //
      console.warn("Tried to setup " + name + " as an importer.");                                                    //
      throw new Meteor.Error('error-importer-not-defined', 'The importer was not defined correctly, it is missing the Import class.', {
        method: 'setupImporter'                                                                                       //
      });                                                                                                             //
    }                                                                                                                 //
  }                                                                                                                   //
});                                                                                                                   //
                                                                                                                      //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"startImport.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_importer/server/methods/startImport.coffee.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({                                                                                                      //
  startImport: function () {                                                                                          //
    function startImport(name, input) {                                                                               //
      var channelsSelection, ref, selection, usersSelection;                                                          //
      if (!Meteor.userId()) {                                                                                         //
        throw new Meteor.Error('error-invalid-user', 'Invalid user', {                                                //
          method: 'startImport'                                                                                       //
        });                                                                                                           //
      }                                                                                                               //
      if (((ref = Importer.Importers[name]) != null ? ref.importerInstance : void 0) != null) {                       //
        usersSelection = input.users.map(function (user) {                                                            //
          return new Importer.SelectionUser(user.user_id, user.username, user.email, user.is_deleted, user.is_bot, user.do_import);
        });                                                                                                           //
        channelsSelection = input.channels.map(function (channel) {                                                   //
          return new Importer.SelectionChannel(channel.channel_id, channel.name, channel.is_archived, channel.do_import);
        });                                                                                                           //
        selection = new Importer.Selection(name, usersSelection, channelsSelection);                                  //
        return Importer.Importers[name].importerInstance.startImport(selection);                                      //
      } else {                                                                                                        //
        throw new Meteor.Error('error-importer-not-defined', 'The importer was not defined correctly, it is missing the Import class.', {
          method: 'startImport'                                                                                       //
        });                                                                                                           //
      }                                                                                                               //
    }                                                                                                                 //
                                                                                                                      //
    return startImport;                                                                                               //
  }()                                                                                                                 //
});                                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"startup":{"setImportsToInvalid.coffee.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/rocketchat_importer/server/startup/setImportsToInvalid.coffee.js                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function () {                                                                                          //
  Importer.Imports.update({                                                                                           //
    valid: {                                                                                                          //
      $ne: false                                                                                                      //
    }                                                                                                                 //
  }, {                                                                                                                //
    $set: {                                                                                                           //
      valid: false                                                                                                    //
    }                                                                                                                 //
  }, {                                                                                                                //
    multi: true                                                                                                       //
  });                                                                                                                 //
  return Importer.Imports.find({                                                                                      //
    valid: {                                                                                                          //
      $ne: true                                                                                                       //
    }                                                                                                                 //
  }).forEach(function (item) {                                                                                        //
    return Importer.RawImports.remove({                                                                               //
      'import': item._id,                                                                                             //
      'importer': item.type                                                                                           //
    });                                                                                                               //
  });                                                                                                                 //
});                                                                                                                   //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"node_modules":{"bson":{"package.json":function(require,exports){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// .npm/package/node_modules/bson/package.json                                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
exports.name = "bson";
exports.version = "0.5.5";
exports.main = "./lib/bson/index";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"bson":{"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/rocketchat:importer/node_modules/bson/lib/bson/index.js                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
try {
  exports.BSONPure = require('./bson');
  exports.BSONNative = require('./bson');
} catch(err) {
}

[ './binary'
  , './code'
  , './map'
  , './db_ref'
  , './double'
  , './int_32'
  , './max_key'
  , './min_key'
  , './objectid'
  , './regexp'
  , './symbol'
  , './decimal128'
  , './timestamp'
  , './long'].forEach(function (path) {
  	var module = require(path);
  	for (var i in module) {
  		exports[i] = module[i];
    }
});

// Exports all the classes for the PURE JS BSON Parser
exports.pure = function() {
  var classes = {};
  // Map all the classes
  [ './binary'
    , './code'
    , './map'
    , './db_ref'
    , './double'
    , './int_32'
    , './max_key'
    , './min_key'
    , './objectid'
    , './regexp'
    , './symbol'
    , './decimal128'
    , './timestamp'
    , './long'
    , './bson'].forEach(function (path) {
    	var module = require(path);
    	for (var i in module) {
    		classes[i] = module[i];
      }
  });
  // Return classes list
  return classes;
}

// Exports all the classes for the NATIVE JS BSON Parser
exports.native = function() {
  var classes = {};
  // Map all the classes
  [ './binary'
    , './code'
    , './map'
    , './db_ref'
    , './double'
    , './int_32'
    , './max_key'
    , './min_key'
    , './objectid'
    , './regexp'
    , './symbol'
    , './decimal128'
    , './timestamp'
    , './long'
  ].forEach(function (path) {
      var module = require(path);
      for (var i in module) {
        classes[i] = module[i];
      }
  });

  // Catch error and return no classes found
  try {
    classes['BSON'] = require('./bson');
  } catch(err) {
    return exports.pure();
  }

  // Return classes list
  return classes;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}}}},{"extensions":[".js",".json",".coffee"]});
require("./node_modules/meteor/rocketchat:importer/lib/_importer.coffee.js");
require("./node_modules/meteor/rocketchat:importer/lib/importTool.coffee.js");
require("./node_modules/meteor/rocketchat:importer/server/classes/ImporterBase.coffee.js");
require("./node_modules/meteor/rocketchat:importer/server/classes/ImporterProgress.coffee.js");
require("./node_modules/meteor/rocketchat:importer/server/classes/ImporterProgressStep.coffee.js");
require("./node_modules/meteor/rocketchat:importer/server/classes/ImporterSelection.coffee.js");
require("./node_modules/meteor/rocketchat:importer/server/classes/ImporterSelectionChannel.coffee.js");
require("./node_modules/meteor/rocketchat:importer/server/classes/ImporterSelectionUser.coffee.js");
require("./node_modules/meteor/rocketchat:importer/server/models/Imports.coffee.js");
require("./node_modules/meteor/rocketchat:importer/server/models/RawImports.coffee.js");
require("./node_modules/meteor/rocketchat:importer/server/methods/getImportProgress.coffee.js");
require("./node_modules/meteor/rocketchat:importer/server/methods/getSelectionData.coffee.js");
require("./node_modules/meteor/rocketchat:importer/server/methods/prepareImport.coffee.js");
require("./node_modules/meteor/rocketchat:importer/server/methods/restartImport.coffee.js");
require("./node_modules/meteor/rocketchat:importer/server/methods/setupImporter.coffee.js");
require("./node_modules/meteor/rocketchat:importer/server/methods/startImport.coffee.js");
require("./node_modules/meteor/rocketchat:importer/server/startup/setImportsToInvalid.coffee.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['rocketchat:importer'] = {}, {
  Importer: Importer
});

})();

//# sourceMappingURL=rocketchat_importer.js.map
