(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var meteorInstall = Package['modules-runtime'].meteorInstall;

/* Package-scope variables */
var Buffer, process;

var require = meteorInstall({"node_modules":{"meteor":{"modules":{"server.js":["./install-packages.js","./buffer.js","./process.js","reify/lib/runtime",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/modules/server.js                                                                                     //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
require("./install-packages.js");
require("./buffer.js");
require("./process.js");
require("reify/lib/runtime").enable(module.constructor);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"buffer.js":["buffer",function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/modules/buffer.js                                                                                     //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
try {
  Buffer = global.Buffer || require("buffer").Buffer;
} catch (noBuffer) {}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"install-packages.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/modules/install-packages.js                                                                           //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
function install(name, mainModule) {
  var meteorDir = {};

  // Given a package name <name>, install a stub module in the
  // /node_modules/meteor directory called <name>.js, so that
  // require.resolve("meteor/<name>") will always return
  // /node_modules/meteor/<name>.js instead of something like
  // /node_modules/meteor/<name>/index.js, in the rare but possible event
  // that the package contains a file called index.js (#6590).

  if (mainModule) {
    meteorDir[name + ".js"] = [mainModule, function (require, e, module) {
      module.exports = require(mainModule);
    }];
  } else {
    // back compat with old Meteor packages
    meteorDir[name + ".js"] = function (r, e, module) {
      module.exports = Package[name];
    };
  }

  meteorInstall({
    node_modules: {
      meteor: meteorDir
    }
  });
}

// This file will be modified during computeJsOutputFilesMap to include
// install(<name>) calls for every Meteor package.

install("underscore");
install("meteor");
install("modules-runtime");
install("modules", "meteor/modules/server.js");
install("promise", "meteor/promise/server.js");
install("ecmascript-runtime", "meteor/ecmascript-runtime/runtime.js");
install("babel-compiler");
install("coffeescript");
install("ecmascript");
install("base64");
install("ejson");
install("logging");
install("routepolicy");
install("tracker");
install("deps");
install("htmljs");
install("html-tools");
install("blaze-tools");
install("spacebars-compiler");
install("id-map");
install("babel-runtime", "meteor/babel-runtime/babel-runtime.js");
install("random");
install("mongo-id");
install("diff-sequence");
install("observe-sequence");
install("jquery");
install("check", "meteor/check/match.js");
install("reactive-var");
install("blaze");
install("spacebars");
install("ui");
install("boilerplate-generator");
install("webapp-hashing");
install("webapp");
install("rocketchat:cors");
install("rate-limit");
install("ddp-rate-limiter");
install("callback-hook");
install("retry");
install("ddp-common");
install("ddp-client");
install("ordered-dict");
install("geojson-utils", "meteor/geojson-utils/main.js");
install("minimongo");
install("ddp-server");
install("ddp");
install("npm-mongo");
install("allow-deny");
install("binary-heap");
install("mongo");
install("accounts-base", "meteor/accounts-base/server_main.js");
install("service-configuration");
install("localstorage");
install("url");
install("oauth");
install("accounts-oauth");
install("oauth2");
install("http");
install("facebook");
install("accounts-facebook");
install("github");
install("accounts-github");
install("google");
install("accounts-google");
install("meteor-developer");
install("accounts-meteor-developer");
install("npm-bcrypt", "meteor/npm-bcrypt/wrapper.js");
install("sha");
install("srp");
install("email");
install("accounts-password");
install("oauth1");
install("twitter");
install("accounts-twitter");
install("blaze-html-templates");
install("fastclick");
install("less");
install("meteor-base");
install("mobile-experience");
install("reactive-dict");
install("reload");
install("session");
install("shell-server", "meteor/shell-server/main.js");
install("standard-minifier-css");
install("standard-minifier-js");
install("templating-compiler");
install("templating-runtime");
install("templating");
install("underscorestring:underscore.string");
install("matb33:collection-hooks");
install("momentjs:moment");
install("raix:eventemitter");
install("meteorspark:util");
install("cfs:http-methods");
install("tap:i18n");
install("rocketchat:i18n");
install("rocketchat:streamer");
install("rocketchat:version");
install("nooitaf:colors");
install("rocketchat:logger");
install("rocketchat:custom-oauth");
install("kadira:flow-router");
install("rocketchat:lib");
install("rocketchat:file");
install("rocketchat:assets");
install("rocketchat:theme");
install("raix:eventstate");
install("raix:push");
install("raix:ui-dropped-event");
install("rocketchat:ui");
install("rocketchat:action-links");
install("simple:json-routes");
install("nimble:restivus");
install("rocketchat:api");
install("rocketchat:authorization");
install("rocketchat:autolinker");
install("rocketchat:bot-helpers");
install("rocketchat:cas");
install("rocketchat:channel-settings");
install("rocketchat:channel-settings-mail-messages");
install("rocketchat:colors");
install("rocketchat:crowd");
install("rocketchat:ui-account");
install("rocketchat:ui-message");
install("rocketchat:emoji");
install("rocketchat:emoji-custom");
install("emojione:emojione");
install("rocketchat:emoji-emojione");
install("rocketchat:error-handler");
install("rocketchat:favico");
install("jalik:ufs");
install("jalik:ufs-local");
install("edgee:slingshot");
install("peerlibrary:blocking");
install("peerlibrary:aws-sdk");
install("rocketchat:file-upload");
install("rocketchat:github-enterprise");
install("rocketchat:gitlab");
install("rocketchat:highlight-words");
install("rocketchat:iframe-login");
install("aldeed:moment-timezone");
install("rocketchat:importer");
install("rocketchat:importer-hipchat");
install("rocketchat:importer-slack");
install("simple:highlight.js");
install("rocketchat:integrations");
install("rocketchat:internal-hubot");
install("rocketchat:irc");
install("rocketchat:katex");
install("rocketchat:ldapjs");
install("yasaricli:slugify");
install("rocketchat:ldap");
install("autoupdate");
install("konecty:user-presence");
install("rocketchat:sms");
install("rocketchat:livechat");
install("rocketchat:mailer");
install("rocketchat:mapview");
install("rocketchat:markdown");
install("rocketchat:mentions");
install("rocketchat:mentions-flextab");
install("rocketchat:message-attachments");
install("rocketchat:message-mark-as-unread");
install("rocketchat:message-pin");
install("rocketchat:message-star");
install("rocketchat:migrations");
install("rocketchat:oauth2-server");
install("rocketchat:oauth2-server-config");
install("konecty:change-case");
install("rocketchat:oembed");
install("rocketchat:otr");
install("rocketchat:piwik");
install("rocketchat:push-notifications");
install("rocketchat:reactions");
install("rocketchat:sandstorm");
install("rocketchat:slackbridge");
install("rocketchat:slashcommands-archive");
install("rocketchat:slashcommands-asciiarts");
install("rocketchat:slashcommands-create");
install("rocketchat:slashcommands-invite");
install("rocketchat:slashcommands-join");
install("rocketchat:slashcommands-kick");
install("rocketchat:slashcommands-leave");
install("rocketchat:slashcommands-me");
install("rocketchat:slashcommands-mute");
install("rocketchat:slashcommands-open");
install("rocketchat:slashcommands-topic");
install("rocketchat:slashcommands-unarchive");
install("rocketchat:smarsh-connector");
install("rocketchat:spotify");
install("rocketchat:statistics");
install("meteorhacks:inject-initial");
install("rocketchat:ui-master");
install("rocketchat:tooltip");
install("rocketchat:tutum");
install("rocketchat:ui-admin");
install("rocketchat:ui-flextab");
install("rocketchat:ui-login");
install("rocketchat:ui-sidenav");
install("rocketchat:ui-vrecord");
install("rocketchat:videobridge");
install("rocketchat:webrtc");
install("rocketchat:wordpress");
install("konecty:delayed-task");
install("mongo-livedata");
install("konecty:mongo-counter");
install("konecty:multiple-instances-status");
install("konecty:nrr");
install("chrismbeckett:toastr");
install("dispatch:run-as-user");
install("francocatena:status");
install("jalik:ufs-gridfs");
install("jparker:crypto-core");
install("jparker:crypto-md5");
install("jparker:gravatar");
install("kadira:blaze-layout");
install("kenton:accounts-sandstorm");
install("mizzao:autocomplete");
install("mizzao:timesync");
install("mrt:reactive-store");
install("mystor:device-detection");
install("ostrio:cookies", "meteor/ostrio:cookies/cookies.coffee.js");
install("pauli:linkedin");
install("pauli:accounts-linkedin");
install("perak:codemirror");
install("percolate:synced-cron");
install("raix:handlebar-helpers");
install("smoral:sweetalert");
install("steffo:meteor-accounts-saml");
install("tmeasday:crypto-base");
install("tmeasday:crypto-md5");
install("todda00:friendly-slugs");
install("yasinuslu:blaze-meta");
install("deepwell:bootstrap-datepicker2");
install("livedata");
install("hot-code-push");
install("launch-screen");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"process.js":["process",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/modules/process.js                                                                                    //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
try {
  // The application can run `npm install process` to provide its own
  // process stub; otherwise this module will provide a partial stub.
  process = global.process || require("process");
} catch (noProcess) {
  process = {};
}

if (Meteor.isServer) {
  // Make require("process") work on the server in all versions of Node.
  meteorInstall({
    node_modules: {
      "process.js": function (r, e, module) {
        module.exports = process;
      }
    }
  });
} else {
  process.platform = "browser";
  process.nextTick = process.nextTick || Meteor._setImmediate;
}

if (typeof process.env !== "object") {
  process.env = {};
}

_.extend(process.env, meteorEnv);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"node_modules":{"reify":{"lib":{"runtime.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// node_modules/meteor/modules/node_modules/reify/lib/runtime.js                                                  //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var Entry = require("./entry.js").Entry;
var utils = require("./utils.js");

exports.enable = function (Module) {
  var Mp = Module.prototype;

  if (typeof Mp.import === "function" &&
      typeof Mp.export === "function") {
    // If the Mp.{import,export} methods have already been
    // defined, abandon reification immediately.
    return Module;
  }

  // Platform-specific code should implement this method however
  // appropriate. Module.prototype.resolve(id) should return an absolute
  // version of the given module identifier, like require.resolve.
  Mp.resolve = Mp.resolve || function resolve(id) {
    throw new Error("Module.prototype.resolve not implemented");
  };

  // Platform-specific code should find a way to call this method whenever
  // the module system is about to return module.exports from require. This
  // might happen more than once per module, in case of dependency cycles,
  // so we want Module.prototype.runModuleSetters to run each time.
  Mp.runModuleSetters = function runModuleSetters(valueToPassThrough) {
    var entry = Entry.get(this.id);
    if (entry) {
      entry.runModuleSetters(this);
    }

    // Assignments to exported local variables get wrapped with calls to
    // module.runModuleSetters, so module.runModuleSetters returns the
    // valueToPassThrough parameter to allow the value of the original
    // expression to pass through. For example,
    //
    //   export var a = 1;
    //   console.log(a += 3);
    //
    // becomes
    //
    //   module.export("a", () => a);
    //   var a = 1;
    //   console.log(module.runModuleSetters(a += 3));
    //
    // This ensures module.runModuleSetters runs immediately after the
    // assignment, and does not interfere with the larger computation.
    return valueToPassThrough;
  };

  function setESModule(module) {
    var exports = module.exports;
    if (exports && typeof exports === "object") {
      exports.__esModule = true;
    }
  }

  Mp.import = function (id, setters) {
    var module = this;
    setESModule(module);

    var absoluteId = module.resolve(id);

    if (setters && typeof setters === "object") {
      var entry = Entry.getOrCreate(absoluteId);
      entry.addSetters(module, setters);
    }

    var countBefore = entry && entry.runCount;
    var exports = typeof module.require === "function"
      ? module.require(absoluteId)
      : require(absoluteId);

    if (entry && entry.runCount === countBefore) {
      // If require(absoluteId) didn't run any setters for this entry,
      // perhaps because it's not the first time this module has been
      // required, run the setters now using an object that passes as the
      // real module object.
      entry.runModuleSetters({
        id: absoluteId,
        exports: exports,
        getExportByName: Mp.getExportByName
      });
    }
  };

  // Register getter functions for local variables in the scope of an
  // export statement. The keys of the getters object are exported names,
  // and the values are functions that return local values.
  Mp.export = function (getters) {
    var module = this;
    setESModule(module);

    if (utils.isPlainObject(getters)) {
      Entry.getOrCreate(module.id).addGetters(getters);
    }

    if (module.loaded) {
      // If the module has already been evaluated, then we need to trigger
      // another round of entry.runModuleSetters calls, which begins by
      // calling entry.runModuleGetters(module).
      module.runModuleSetters();
    }
  };

  // This method can be overridden by client code to implement custom export
  // naming logic. The current implementation works well with Babel's
  // __esModule convention.
  Mp.getExportByName = function (name) {
    var exports = this.exports;

    if (name === "*") {
      return exports;
    }

    if (name === "default" &&
        ! (exports &&
           typeof exports === "object" &&
           exports.__esModule &&
           "default" in exports)) {
      return exports;
    }

    return exports && exports[name];
  };

  return Module;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},"bcrypt":{"package.json":function(require,exports){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// node_modules/bcrypt/package.json                                                                               //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
exports.name = "bcrypt";
exports.version = "0.8.7";
exports.main = "./bcrypt";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"bcrypt.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// node_modules/bcrypt/bcrypt.js                                                                                  //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
'use strict';

var bindings = require('bindings')('bcrypt_lib');
var crypto = require('crypto');

/// generate a salt (sync)
/// @param {Number} [rounds] number of rounds (default 10)
/// @return {String} salt
module.exports.genSaltSync = function(rounds) {
    // default 10 rounds
    if (!rounds) {
        rounds = 10;
    } else if (typeof rounds !== 'number') {
        throw new Error('rounds must be a number');
    }

    return bindings.gen_salt_sync(rounds, crypto.randomBytes(16));
};

/// generate a salt
/// @param {Number} [rounds] number of rounds (default 10)
/// @param {Function} cb callback(err, salt)
module.exports.genSalt = function(rounds, ignore, cb) {
    // if callback is first argument, then use defaults for others
    if (typeof arguments[0] === 'function') {
        // have to set callback first otherwise arguments are overriden
        cb = arguments[0];
        rounds = 10;
    // callback is second argument
    } else if (typeof arguments[1] === 'function') {
        // have to set callback first otherwise arguments are overriden
        cb = arguments[1];
    }

    // default 10 rounds
    if (!rounds) {
        rounds = 10;
    } else if (typeof rounds !== 'number') {
        // callback error asynchronously
        return process.nextTick(function() {
            cb(new Error('rounds must be a number'));
        });
    }

    if (!cb) {
        return;
    }

    crypto.randomBytes(16, function(error, randomBytes) {
        if (error) {
            cb(error);
            return;
        }

        bindings.gen_salt(rounds, randomBytes, cb);
    });
};

/// hash data using a salt
/// @param {String} data the data to encrypt
/// @param {String} salt the salt to use when hashing
/// @return {String} hash
module.exports.hashSync = function(data, salt) {
    if (data == null || salt == null) {
        throw new Error('data and salt arguments required');
    }

    if (typeof data !== 'string' || (typeof salt !== 'string' && typeof salt !== 'number')) {
        throw new Error('data must be a string and salt must either be a salt string or a number of rounds');
    }

    if (typeof salt === 'number') {
        salt = module.exports.genSaltSync(salt);
    }

    return bindings.encrypt_sync(data, salt);
};

/// hash data using a salt
/// @param {String} data the data to encrypt
/// @param {String} salt the salt to use when hashing
/// @param {Function} cb callback(err, hash)
module.exports.hash = function(data, salt, cb) {
    if (typeof data === 'function') {
        return process.nextTick(function() {
            data(new Error('data must be a string and salt must either be a salt string or a number of rounds'));
        });
    }

    if (typeof salt === 'function') {
        return process.nextTick(function() {
            salt(new Error('data must be a string and salt must either be a salt string or a number of rounds'));
        });
    }

    if (data == null || salt == null) {
        return process.nextTick(function() {
            cb(new Error('data and salt arguments required'));
        });
    }

    if (typeof data !== 'string' || (typeof salt !== 'string' && typeof salt !== 'number')) {
        return process.nextTick(function() {
            cb(new Error('data must be a string and salt must either be a salt string or a number of rounds'));
        });
    }

    if (!cb || typeof cb !== 'function') {
        return;
    }

    if (typeof salt === 'number') {
        return module.exports.genSalt(salt, function(err, salt) {
            return bindings.encrypt(data, salt, cb);
        });
    }

    return bindings.encrypt(data, salt, cb);
};

/// compare raw data to hash
/// @param {String} data the data to hash and compare
/// @param {String} hash expected hash
/// @return {bool} true if hashed data matches hash
module.exports.compareSync = function(data, hash) {
    if (data == null || hash == null) {
        throw new Error('data and hash arguments required');
    }

    if (typeof data !== 'string' || typeof hash !== 'string') {
        throw new Error('data and hash must be strings');
    }

    return bindings.compare_sync(data, hash);
};

/// compare raw data to hash
/// @param {String} data the data to hash and compare
/// @param {String} hash expected hash
/// @param {Function} cb callback(err, matched) - matched is true if hashed data matches hash
module.exports.compare = function(data, hash, cb) {
    if (data == null || hash == null) {
        return process.nextTick(function() {
            cb(new Error('data and hash arguments required'));
        });
    }

    if (typeof data !== 'string' || typeof hash !== 'string') {
        return process.nextTick(function() {
            cb(new Error('data and hash must be strings'));
        });
    }

    if (!cb || typeof cb !== 'function') {
        return;
    }

    return bindings.compare(data, hash, cb);
};

/// @param {String} hash extract rounds from this hash
/// @return {Number} the number of rounds used to encrypt a given hash
module.exports.getRounds = function(hash) {
    if (hash == null) {
        throw new Error('hash argument required');
    }

    if (typeof hash !== 'string') {
        throw new Error('hash must be a string');
    }

    return bindings.get_rounds(hash);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},{"extensions":[".js",".json"]});
var exports = require("./node_modules/meteor/modules/server.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package.modules = exports, {
  meteorInstall: meteorInstall,
  Buffer: Buffer,
  process: process
});

})();
