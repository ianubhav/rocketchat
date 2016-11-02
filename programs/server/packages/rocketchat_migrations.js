(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var check = Package.check.check;
var Match = Package.check.Match;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var moment = Package['momentjs:moment'].moment;
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

/* Package-scope variables */
var Migrations, migrated;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:migrations":{"migrations.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/rocketchat_migrations/migrations.js                                                                //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
/*                                                                                                             // 1
	Adds migration capabilities. Migrations are defined like:                                                     //
                                                                                                               //
	Migrations.add({                                                                                              //
		up: function() {}, //*required* code to run to migrate upwards                                               //
		version: 1, //*required* number to identify migration order                                                  //
		down: function() {}, //*optional* code to run to migrate downwards                                           //
		name: 'Something' //*optional* display name for the migration                                                //
	});                                                                                                           //
                                                                                                               //
	The ordering of migrations is determined by the version you set.                                              //
                                                                                                               //
	To run the migrations, set the MIGRATE environment variable to either                                         //
	'latest' or the version number you want to migrate to. Optionally, append                                     //
	',exit' if you want the migrations to exit the meteor process, e.g if you're                                  //
	migrating from a script (remember to pass the --once parameter).                                              //
                                                                                                               //
	e.g:                                                                                                          //
	MIGRATE="latest" mrt # ensure we'll be at the latest version and run the app                                  //
	MIGRATE="latest,exit" mrt --once # ensure we'll be at the latest version and exit                             //
	MIGRATE="2,exit" mrt --once # migrate to version 2 and exit                                                   //
                                                                                                               //
	Note: Migrations will lock ensuring only 1 app can be migrating at once. If                                   //
	a migration crashes, the control record in the migrations collection will                                     //
	remain locked and at the version it was at previously, however the db could                                   //
	be in an inconsistant state.                                                                                  //
*/                                                                                                             //
                                                                                                               //
// since we'll be at version 0 by default, we should have a migration set for                                  // 29
// it.                                                                                                         // 30
var DefaultMigration = {                                                                                       // 31
	version: 0,                                                                                                   // 32
	up: function () {                                                                                             // 33
		function up() {                                                                                              // 33
			// @TODO: check if collection "migrations" exist                                                            // 34
			// If exists, rename and rerun _migrateTo                                                                   // 35
		}                                                                                                            // 36
                                                                                                               //
		return up;                                                                                                   // 33
	}()                                                                                                           // 33
};                                                                                                             // 31
                                                                                                               //
Migrations = {                                                                                                 // 39
	_list: [DefaultMigration],                                                                                    // 40
	options: {                                                                                                    // 41
		// false disables logging                                                                                    // 42
		log: true,                                                                                                   // 43
		// null or a function                                                                                        // 44
		logger: null,                                                                                                // 45
		// enable/disable info log "already at latest."                                                              // 46
		logIfLatest: true,                                                                                           // 47
		// lock will be valid for this amount of minutes                                                             // 48
		lockExpiration: 5,                                                                                           // 49
		// retry interval in seconds                                                                                 // 50
		retryInterval: 10,                                                                                           // 51
		// max number of attempts to retry unlock                                                                    // 52
		maxAttempts: 30,                                                                                             // 53
		// migrations collection name                                                                                // 54
		collectionName: "migrations"                                                                                 // 55
		// collectionName: "rocketchat_migrations"                                                                   // 56
	},                                                                                                            // 41
	config: function () {                                                                                         // 58
		function config(opts) {                                                                                      // 58
			this.options = _.extend({}, this.options, opts);                                                            // 59
		}                                                                                                            // 60
                                                                                                               //
		return config;                                                                                               // 58
	}()                                                                                                           // 58
};                                                                                                             // 39
                                                                                                               //
Migrations._collection = new Mongo.Collection(Migrations.options.collectionName);                              // 63
                                                                                                               //
/* Create a box around messages for displaying on a console.log */                                             // 65
function makeABox(message) {                                                                                   // 66
	var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'red';                        // 66
                                                                                                               //
	if (!_.isArray(message)) {                                                                                    // 67
		message = message.split("\n");                                                                               // 68
	}                                                                                                             // 69
	var len = _(message).reduce(function (memo, msg) {                                                            // 70
		return Math.max(memo, msg.length);                                                                           // 71
	}, 0) + 4;                                                                                                    // 72
	var text = message.map(function (msg) {                                                                       // 73
		return "|"[color] + s.lrpad(msg, len)[color] + "|"[color];                                                   // 74
	}).join("\n");                                                                                                // 75
	var topLine = "+"[color] + s.pad('', len, '-')[color] + "+"[color];                                           // 76
	var separator = "|"[color] + s.pad('', len, '') + "|"[color];                                                 // 77
	var bottomLine = "+"[color] + s.pad('', len, '-')[color] + "+"[color];                                        // 78
	return "\n" + topLine + "\n" + separator + "\n" + text + "\n" + separator + "\n" + bottomLine + "\n";         // 79
}                                                                                                              // 80
                                                                                                               //
/*                                                                                                             // 82
	Logger factory function. Takes a prefix string and options object                                             //
	and uses an injected `logger` if provided, else falls back to                                                 //
	Meteor's `Log` package.                                                                                       //
	Will send a log object to the injected logger, on the following form:                                         //
		message: String                                                                                              //
		level: String (info, warn, error, debug)                                                                     //
		tag: 'Migrations'                                                                                            //
*/                                                                                                             //
function createLogger(prefix) {                                                                                // 91
	check(prefix, String);                                                                                        // 92
                                                                                                               //
	// Return noop if logging is disabled.                                                                        // 94
	if (Migrations.options.log === false) {                                                                       // 95
		return function () {};                                                                                       // 96
	}                                                                                                             // 97
                                                                                                               //
	return function (level, message) {                                                                            // 99
		check(level, Match.OneOf('info', 'error', 'warn', 'debug'));                                                 // 100
		check(message, Match.OneOf(String, [String]));                                                               // 101
                                                                                                               //
		var logger = Migrations.options && Migrations.options.logger;                                                // 103
                                                                                                               //
		if (logger && _.isFunction(logger)) {                                                                        // 105
                                                                                                               //
			logger({                                                                                                    // 107
				level: level,                                                                                              // 108
				message: message,                                                                                          // 109
				tag: prefix                                                                                                // 110
			});                                                                                                         // 107
		} else {                                                                                                     // 113
			Log[level]({                                                                                                // 114
				message: prefix + ': ' + message                                                                           // 115
			});                                                                                                         // 114
		}                                                                                                            // 117
	};                                                                                                            // 118
}                                                                                                              // 119
                                                                                                               //
var log;                                                                                                       // 121
                                                                                                               //
var options = Migrations.options;                                                                              // 123
                                                                                                               //
// collection holding the control record                                                                       // 125
                                                                                                               //
log = createLogger('Migrations');                                                                              // 127
                                                                                                               //
['info', 'warn', 'error', 'debug'].forEach(function (level) {                                                  // 129
	log[level] = _.partial(log, level);                                                                           // 130
});                                                                                                            // 131
                                                                                                               //
// if (process.env.MIGRATE)                                                                                    // 133
//   Migrations.migrateTo(process.env.MIGRATE);                                                                // 134
                                                                                                               //
// Add a new migration:                                                                                        // 136
// {up: function *required                                                                                     // 137
//  version: Number *required                                                                                  // 138
//  down: function *optional                                                                                   // 139
//  name: String *optional                                                                                     // 140
// }                                                                                                           // 141
Migrations.add = function (migration) {                                                                        // 142
	if (typeof migration.up !== 'function') throw new Meteor.Error('Migration must supply an up function.');      // 143
                                                                                                               //
	if (typeof migration.version !== 'number') throw new Meteor.Error('Migration must supply a version number.');
                                                                                                               //
	if (migration.version <= 0) throw new Meteor.Error('Migration version must be greater than 0');               // 149
                                                                                                               //
	// Freeze the migration object to make it hereafter immutable                                                 // 152
	Object.freeze(migration);                                                                                     // 153
                                                                                                               //
	this._list.push(migration);                                                                                   // 155
	this._list = _.sortBy(this._list, function (m) {                                                              // 156
		return m.version;                                                                                            // 157
	});                                                                                                           // 158
};                                                                                                             // 159
                                                                                                               //
// Attempts to run the migrations using command in the form of:                                                // 161
// e.g 'latest', 'latest,exit', 2                                                                              // 162
// use 'XX,rerun' to re-run the migration at that version                                                      // 163
Migrations.migrateTo = function (command) {                                                                    // 164
	if (_.isUndefined(command) || command === '' || this._list.length === 0) throw new Error("Cannot migrate using invalid command: " + command);
                                                                                                               //
	if (typeof command === 'number') {                                                                            // 168
		var version = command;                                                                                       // 169
	} else {                                                                                                      // 170
		var version = command.split(',')[0];                                                                         // 171
		var subcommand = command.split(',')[1];                                                                      // 172
	}                                                                                                             // 173
                                                                                                               //
	var maxAttempts = Migrations.options.maxAttempts;                                                             // 175
	var retryInterval = Migrations.options.retryInterval;                                                         // 176
	for (var attempts = 1; attempts <= maxAttempts; attempts++) {                                                 // 177
		if (version === 'latest') {                                                                                  // 178
			migrated = this._migrateTo(_.last(this._list).version);                                                     // 179
		} else {                                                                                                     // 180
			migrated = this._migrateTo(parseInt(version), subcommand === 'rerun');                                      // 181
		}                                                                                                            // 182
		if (migrated) {                                                                                              // 183
			break;                                                                                                      // 184
		} else {                                                                                                     // 185
			var willRetry = void 0;                                                                                     // 186
			if (attempts < maxAttempts) {                                                                               // 187
				willRetry = " Trying again in " + retryInterval + " seconds.";                                             // 188
				Meteor._sleepForMs(retryInterval * 1000);                                                                  // 189
			} else {                                                                                                    // 190
				willRetry = "";                                                                                            // 191
			}                                                                                                           // 192
			console.log(("Not migrating, control is locked. Attempt " + attempts + "/" + maxAttempts + "." + willRetry).yellow);
		}                                                                                                            // 194
	}                                                                                                             // 195
	if (!migrated) {                                                                                              // 196
		var control = this._getControl(); // Side effect: upserts control document.                                  // 197
		console.log(makeABox(["ERROR! SERVER STOPPED", "", "Your database migration control is locked.", "Please make sure you are running the latest version and try again.", "If the problem persists, please contact support.", "", "This Rocket.Chat version: " + RocketChat.Info.version, "Database locked at version: " + control.version, "Database target version: " + (version === 'latest' ? _.last(this._list).version : version), "", "Commit: " + RocketChat.Info.commit.hash, "Date: " + RocketChat.Info.commit.date, "Branch: " + RocketChat.Info.commit.branch, "Tag: " + RocketChat.Info.commit.tag]));
		process.exit(1);                                                                                             // 214
	}                                                                                                             // 215
                                                                                                               //
	// remember to run meteor with --once otherwise it will restart                                               // 217
	if (subcommand === 'exit') process.exit(0);                                                                   // 218
};                                                                                                             // 220
                                                                                                               //
// just returns the current version                                                                            // 222
Migrations.getVersion = function () {                                                                          // 223
	return this._getControl().version;                                                                            // 224
};                                                                                                             // 225
                                                                                                               //
// migrates to the specific version passed in                                                                  // 227
Migrations._migrateTo = function (version, rerun) {                                                            // 228
	var self = this;                                                                                              // 229
	var control = this._getControl(); // Side effect: upserts control document.                                   // 230
	var currentVersion = control.version;                                                                         // 231
                                                                                                               //
	if (lock() === false) {                                                                                       // 233
		// log.info('Not migrating, control is locked.');                                                            // 234
		// Warning                                                                                                   // 235
		return false;                                                                                                // 236
	}                                                                                                             // 237
                                                                                                               //
	if (rerun) {                                                                                                  // 239
		log.info('Rerunning version ' + version);                                                                    // 240
		migrate('up', version);                                                                                      // 241
		log.info('Finished migrating.');                                                                             // 242
		unlock();                                                                                                    // 243
		return true;                                                                                                 // 244
	}                                                                                                             // 245
                                                                                                               //
	if (currentVersion === version) {                                                                             // 247
		if (this.options.logIfLatest) {                                                                              // 248
			log.info('Not migrating, already at version ' + version);                                                   // 249
		}                                                                                                            // 250
		unlock();                                                                                                    // 251
		return true;                                                                                                 // 252
	}                                                                                                             // 253
                                                                                                               //
	var startIdx = this._findIndexByVersion(currentVersion);                                                      // 255
	var endIdx = this._findIndexByVersion(version);                                                               // 256
                                                                                                               //
	// log.info('startIdx:' + startIdx + ' endIdx:' + endIdx);                                                    // 258
	log.info('Migrating from version ' + this._list[startIdx].version + ' -> ' + this._list[endIdx].version);     // 259
                                                                                                               //
	// run the actual migration                                                                                   // 261
	function migrate(direction, idx) {                                                                            // 262
		var migration = self._list[idx];                                                                             // 263
                                                                                                               //
		if (typeof migration[direction] !== 'function') {                                                            // 265
			unlock();                                                                                                   // 266
			throw new Meteor.Error('Cannot migrate ' + direction + ' on version ' + migration.version);                 // 267
		}                                                                                                            // 268
                                                                                                               //
		function maybeName() {                                                                                       // 270
			return migration.name ? ' (' + migration.name + ')' : '';                                                   // 271
		}                                                                                                            // 272
                                                                                                               //
		log.info('Running ' + direction + '() on version ' + migration.version + maybeName());                       // 274
                                                                                                               //
		try {                                                                                                        // 276
			migration[direction](migration);                                                                            // 277
		} catch (e) {                                                                                                // 278
			console.log(makeABox(["ERROR! SERVER STOPPED", "", "Your database migration failed:", e.message, "", "Please make sure you are running the latest version and try again.", "If the problem persists, please contact support.", "", "This Rocket.Chat version: " + RocketChat.Info.version, "Database locked at version: " + control.version, "Database target version: " + version, "", "Commit: " + RocketChat.Info.commit.hash, "Date: " + RocketChat.Info.commit.date, "Branch: " + RocketChat.Info.commit.branch, "Tag: " + RocketChat.Info.commit.tag]));
			process.exit(1);                                                                                            // 297
		}                                                                                                            // 298
	}                                                                                                             // 299
                                                                                                               //
	// Returns true if lock was acquired.                                                                         // 301
	function lock() {                                                                                             // 302
		var date = new Date();                                                                                       // 303
		var dateMinusInterval = moment(date).subtract(self.options.lockExpiration, 'minutes').toDate();              // 304
		var build = RocketChat.Info ? RocketChat.Info.build.date : date;                                             // 305
                                                                                                               //
		// This is atomic. The selector ensures only one caller at a time will see                                   // 307
		// the unlocked control, and locking occurs in the same update's modifier.                                   // 308
		// All other simultaneous callers will get false back from the update.                                       // 309
		return self._collection.update({                                                                             // 310
			_id: 'control',                                                                                             // 311
			$or: [{                                                                                                     // 312
				locked: false                                                                                              // 313
			}, {                                                                                                        // 312
				lockedAt: {                                                                                                // 315
					$lt: dateMinusInterval                                                                                    // 316
				}                                                                                                          // 315
			}, {                                                                                                        // 314
				buildAt: {                                                                                                 // 319
					$ne: build                                                                                                // 320
				}                                                                                                          // 319
			}]                                                                                                          // 318
		}, {                                                                                                         // 310
			$set: {                                                                                                     // 324
				locked: true,                                                                                              // 325
				lockedAt: date,                                                                                            // 326
				buildAt: build                                                                                             // 327
			}                                                                                                           // 324
		}) === 1;                                                                                                    // 323
	}                                                                                                             // 330
                                                                                                               //
	// Side effect: saves version.                                                                                // 333
	function unlock() {                                                                                           // 334
		self._setControl({                                                                                           // 335
			locked: false,                                                                                              // 336
			version: currentVersion                                                                                     // 337
		});                                                                                                          // 335
	}                                                                                                             // 339
                                                                                                               //
	if (currentVersion < version) {                                                                               // 341
		for (var i = startIdx; i < endIdx; i++) {                                                                    // 342
			migrate('up', i + 1);                                                                                       // 343
			currentVersion = self._list[i + 1].version;                                                                 // 344
			self._setControl({                                                                                          // 345
				locked: true,                                                                                              // 346
				version: currentVersion                                                                                    // 347
			});                                                                                                         // 345
		}                                                                                                            // 349
	} else {                                                                                                      // 350
		for (var i = startIdx; i > endIdx; i--) {                                                                    // 351
			migrate('down', i);                                                                                         // 352
			currentVersion = self._list[i - 1].version;                                                                 // 353
			self._setControl({                                                                                          // 354
				locked: true,                                                                                              // 355
				version: currentVersion                                                                                    // 356
			});                                                                                                         // 354
		}                                                                                                            // 358
	}                                                                                                             // 359
                                                                                                               //
	unlock();                                                                                                     // 361
	log.info('Finished migrating.');                                                                              // 362
};                                                                                                             // 363
                                                                                                               //
// gets the current control record, optionally creating it if non-existant                                     // 365
Migrations._getControl = function () {                                                                         // 366
	var control = this._collection.findOne({                                                                      // 367
		_id: 'control'                                                                                               // 368
	});                                                                                                           // 367
                                                                                                               //
	return control || this._setControl({                                                                          // 371
		version: 0,                                                                                                  // 372
		locked: false                                                                                                // 373
	});                                                                                                           // 371
};                                                                                                             // 375
                                                                                                               //
// sets the control record                                                                                     // 377
Migrations._setControl = function (control) {                                                                  // 378
	// be quite strict                                                                                            // 379
	check(control.version, Number);                                                                               // 380
	check(control.locked, Boolean);                                                                               // 381
                                                                                                               //
	this._collection.update({                                                                                     // 383
		_id: 'control'                                                                                               // 384
	}, {                                                                                                          // 383
		$set: {                                                                                                      // 386
			version: control.version,                                                                                   // 387
			locked: control.locked                                                                                      // 388
		}                                                                                                            // 386
	}, {                                                                                                          // 385
		upsert: true                                                                                                 // 391
	});                                                                                                           // 390
                                                                                                               //
	return control;                                                                                               // 394
};                                                                                                             // 395
                                                                                                               //
// returns the migration index in _list or throws if not found                                                 // 397
Migrations._findIndexByVersion = function (version) {                                                          // 398
	for (var i = 0; i < this._list.length; i++) {                                                                 // 399
		if (this._list[i].version === version) return i;                                                             // 400
	}                                                                                                             // 402
                                                                                                               //
	throw new Meteor.Error('Can\'t find migration version ' + version);                                           // 404
};                                                                                                             // 405
                                                                                                               //
//reset (mainly intended for tests)                                                                            // 407
Migrations._reset = function () {                                                                              // 408
	this._list = [{                                                                                               // 409
		version: 0,                                                                                                  // 410
		up: function () {                                                                                            // 411
			function up() {}                                                                                            // 411
                                                                                                               //
			return up;                                                                                                  // 411
		}()                                                                                                          // 411
	}];                                                                                                           // 409
	this._collection.remove({});                                                                                  // 413
};                                                                                                             // 414
                                                                                                               //
RocketChat.Migrations = Migrations;                                                                            // 416
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/rocketchat:migrations/migrations.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['rocketchat:migrations'] = {};

})();

//# sourceMappingURL=rocketchat_migrations.js.map
