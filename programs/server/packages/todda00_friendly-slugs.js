(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var check = Package.check.check;
var Match = Package.check.Match;
var CollectionHooks = Package['matb33:collection-hooks'].CollectionHooks;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/todda00_friendly-slugs/slugs.coffee.js                                                                 //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Mongo, slugify, stringToNested;                                                                                // 2
                                                                                                                   //
if (typeof Mongo === "undefined") {                                                                                // 2
  Mongo = {};                                                                                                      //
  Mongo.Collection = Meteor.Collection;                                                                            //
}                                                                                                                  //
                                                                                                                   //
Mongo.Collection.prototype.friendlySlugs = function(options) {                                                     // 6
  var collection, fsDebug, runSlug;                                                                                // 7
  if (options == null) {                                                                                           //
    options = {};                                                                                                  //
  }                                                                                                                //
  collection = this;                                                                                               //
  if (!_.isArray(options)) {                                                                                       //
    options = [options];                                                                                           //
  }                                                                                                                //
  _.each(options, function(opts) {                                                                                 //
    var defaults, fields;                                                                                          // 13
    if (_.isString(opts)) {                                                                                        //
      opts = {                                                                                                     //
        slugFrom: [opts]                                                                                           //
      };                                                                                                           //
    }                                                                                                              //
    if (_.isString(opts.slugFrom)) {                                                                               //
      opts.slugFrom = [opts.slugFrom];                                                                             //
    }                                                                                                              //
    defaults = {                                                                                                   //
      slugFrom: ['name'],                                                                                          //
      slugField: 'slug',                                                                                           //
      distinct: true,                                                                                              //
      distinctUpTo: [],                                                                                            //
      updateSlug: true,                                                                                            //
      createOnUpdate: true,                                                                                        //
      maxLength: 0,                                                                                                //
      debug: false,                                                                                                //
      transliteration: [                                                                                           //
        {                                                                                                          //
          from: 'àáâäåãа',                                                                                         //
          to: 'a'                                                                                                  //
        }, {                                                                                                       //
          from: 'б',                                                                                               //
          to: 'b'                                                                                                  //
        }, {                                                                                                       //
          from: 'ç',                                                                                               //
          to: 'c'                                                                                                  //
        }, {                                                                                                       //
          from: 'д',                                                                                               //
          to: 'd'                                                                                                  //
        }, {                                                                                                       //
          from: 'èéêëẽэе',                                                                                         //
          to: 'e'                                                                                                  //
        }, {                                                                                                       //
          from: 'ф',                                                                                               //
          to: 'f'                                                                                                  //
        }, {                                                                                                       //
          from: 'г',                                                                                               //
          to: 'g'                                                                                                  //
        }, {                                                                                                       //
          from: 'х',                                                                                               //
          to: 'h'                                                                                                  //
        }, {                                                                                                       //
          from: 'ìíîïи',                                                                                           //
          to: 'i'                                                                                                  //
        }, {                                                                                                       //
          from: 'к',                                                                                               //
          to: 'k'                                                                                                  //
        }, {                                                                                                       //
          from: 'л',                                                                                               //
          to: 'l'                                                                                                  //
        }, {                                                                                                       //
          from: 'м',                                                                                               //
          to: 'm'                                                                                                  //
        }, {                                                                                                       //
          from: 'ñн',                                                                                              //
          to: 'n'                                                                                                  //
        }, {                                                                                                       //
          from: 'òóôöõо',                                                                                          //
          to: 'o'                                                                                                  //
        }, {                                                                                                       //
          from: 'п',                                                                                               //
          to: 'p'                                                                                                  //
        }, {                                                                                                       //
          from: 'р',                                                                                               //
          to: 'r'                                                                                                  //
        }, {                                                                                                       //
          from: 'с',                                                                                               //
          to: 's'                                                                                                  //
        }, {                                                                                                       //
          from: 'т',                                                                                               //
          to: 't'                                                                                                  //
        }, {                                                                                                       //
          from: 'ùúûüу',                                                                                           //
          to: 'u'                                                                                                  //
        }, {                                                                                                       //
          from: 'в',                                                                                               //
          to: 'v'                                                                                                  //
        }, {                                                                                                       //
          from: 'йы',                                                                                              //
          to: 'y'                                                                                                  //
        }, {                                                                                                       //
          from: 'з',                                                                                               //
          to: 'z'                                                                                                  //
        }, {                                                                                                       //
          from: 'æ',                                                                                               //
          to: 'ae'                                                                                                 //
        }, {                                                                                                       //
          from: 'ч',                                                                                               //
          to: 'ch'                                                                                                 //
        }, {                                                                                                       //
          from: 'щ',                                                                                               //
          to: 'sch'                                                                                                //
        }, {                                                                                                       //
          from: 'ш',                                                                                               //
          to: 'sh'                                                                                                 //
        }, {                                                                                                       //
          from: 'ц',                                                                                               //
          to: 'ts'                                                                                                 //
        }, {                                                                                                       //
          from: 'я',                                                                                               //
          to: 'ya'                                                                                                 //
        }, {                                                                                                       //
          from: 'ю',                                                                                               //
          to: 'yu'                                                                                                 //
        }, {                                                                                                       //
          from: 'ж',                                                                                               //
          to: 'zh'                                                                                                 //
        }, {                                                                                                       //
          from: 'ъь',                                                                                              //
          to: ''                                                                                                   //
        }                                                                                                          //
      ]                                                                                                            //
    };                                                                                                             //
    _.defaults(opts, defaults);                                                                                    //
    fields = {                                                                                                     //
      slugFrom: Array,                                                                                             //
      slugField: String,                                                                                           //
      distinct: Boolean,                                                                                           //
      createOnUpdate: Boolean,                                                                                     //
      maxLength: Number,                                                                                           //
      debug: Boolean                                                                                               //
    };                                                                                                             //
    if (typeof opts.updateSlug !== "function") {                                                                   //
      if (opts.updateSlug) {                                                                                       //
        opts.updateSlug = function() {                                                                             //
          return true;                                                                                             //
        };                                                                                                         //
      } else {                                                                                                     //
        opts.updateSlug = function() {                                                                             //
          return false;                                                                                            //
        };                                                                                                         //
      }                                                                                                            //
    }                                                                                                              //
    check(opts, Match.ObjectIncluding(fields));                                                                    //
    collection.before.insert(function(userId, doc) {                                                               //
      fsDebug(opts, 'before.insert function');                                                                     //
      runSlug(doc, opts);                                                                                          //
    });                                                                                                            //
    collection.before.update(function(userId, doc, fieldNames, modifier, options) {                                //
      var cleanModifier, cont, slugFromChanged;                                                                    // 87
      fsDebug(opts, 'before.update function');                                                                     //
      cleanModifier = function() {                                                                                 //
        if (_.isEmpty(modifier.$set)) {                                                                            //
          return delete modifier.$set;                                                                             //
        }                                                                                                          //
      };                                                                                                           //
      options = options || {};                                                                                     //
      if (options.multi) {                                                                                         //
        fsDebug(opts, "multi doc update attempted, can't update slugs this way, leaving.");                        //
        return true;                                                                                               // 96
      }                                                                                                            //
      modifier = modifier || {};                                                                                   //
      modifier.$set = modifier.$set || {};                                                                         //
      cont = false;                                                                                                //
      _.each(opts.slugFrom, function(slugFrom) {                                                                   //
        if (stringToNested(doc, slugFrom) || (modifier.$set[slugFrom] != null) || stringToNested(modifier.$set, slugFrom)) {
          return cont = true;                                                                                      //
        }                                                                                                          //
      });                                                                                                          //
      if (!cont) {                                                                                                 //
        fsDebug(opts, "no slugFrom fields are present (either before or after update), leaving.");                 //
        cleanModifier();                                                                                           //
        return true;                                                                                               // 108
      }                                                                                                            //
      slugFromChanged = false;                                                                                     //
      _.each(opts.slugFrom, function(slugFrom) {                                                                   //
        var docFrom;                                                                                               // 113
        if ((modifier.$set[slugFrom] != null) || stringToNested(modifier.$set, slugFrom)) {                        //
          docFrom = stringToNested(doc, slugFrom);                                                                 //
          if ((docFrom !== modifier.$set[slugFrom]) && (docFrom !== stringToNested(modifier.$set, slugFrom))) {    //
            return slugFromChanged = true;                                                                         //
          }                                                                                                        //
        }                                                                                                          //
      });                                                                                                          //
      fsDebug(opts, slugFromChanged, 'slugFromChanged');                                                           //
      if (!stringToNested(doc, opts.slugField) && opts.createOnUpdate) {                                           //
        fsDebug(opts, 'Update: Slug Field is missing and createOnUpdate is set to true');                          //
        if (slugFromChanged) {                                                                                     //
          fsDebug(opts, 'slugFrom field has changed, runSlug with modifier');                                      //
          runSlug(doc, opts, modifier);                                                                            //
        } else {                                                                                                   //
          fsDebug(opts, 'runSlug to create');                                                                      //
          runSlug(doc, opts, modifier, true);                                                                      //
          cleanModifier();                                                                                         //
          return true;                                                                                             // 132
        }                                                                                                          //
      } else {                                                                                                     //
        if ((typeof opts.updateSlug === "function" ? opts.updateSlug(doc, modifier) : void 0) === false) {         //
          fsDebug(opts, 'updateSlug is false, nothing to do.');                                                    //
          cleanModifier();                                                                                         //
          return true;                                                                                             // 139
        }                                                                                                          //
        if (!slugFromChanged) {                                                                                    //
          fsDebug(opts, 'slugFrom field has not changed, nothing to do.');                                         //
          cleanModifier();                                                                                         //
          return true;                                                                                             // 145
        }                                                                                                          //
        runSlug(doc, opts, modifier);                                                                              //
        cleanModifier();                                                                                           //
        return true;                                                                                               // 150
      }                                                                                                            //
      cleanModifier();                                                                                             //
      return true;                                                                                                 // 153
    });                                                                                                            //
  });                                                                                                              //
  runSlug = function(doc, opts, modifier, create) {                                                                //
    var baseField, combineFrom, defaultSlugGenerator, f, fieldSelector, finalSlug, from, i, index, indexField, limitSelector, ref, result, slugBase, slugGenerator, sortSelector;
    if (modifier == null) {                                                                                        //
      modifier = false;                                                                                            //
    }                                                                                                              //
    if (create == null) {                                                                                          //
      create = false;                                                                                              //
    }                                                                                                              //
    fsDebug(opts, 'Begin runSlug');                                                                                //
    fsDebug(opts, opts, 'Options');                                                                                //
    fsDebug(opts, modifier, 'Modifier');                                                                           //
    fsDebug(opts, create, 'Create');                                                                               //
    combineFrom = function(doc, fields, modifierDoc) {                                                             //
      var fromValues;                                                                                              // 162
      fromValues = [];                                                                                             //
      _.each(fields, function(f) {                                                                                 //
        var val;                                                                                                   // 164
        if (modifierDoc != null) {                                                                                 //
          if (stringToNested(modifierDoc, f)) {                                                                    //
            val = stringToNested(modifierDoc, f);                                                                  //
          } else {                                                                                                 //
            val = stringToNested(doc, f);                                                                          //
          }                                                                                                        //
        } else {                                                                                                   //
          val = stringToNested(doc, f);                                                                            //
        }                                                                                                          //
        if (val) {                                                                                                 //
          return fromValues.push(val);                                                                             //
        }                                                                                                          //
      });                                                                                                          //
      if (fromValues.length === 0) {                                                                               //
        return false;                                                                                              // 172
      }                                                                                                            //
      return fromValues.join('-');                                                                                 // 173
    };                                                                                                             //
    from = create || !modifier ? combineFrom(doc, opts.slugFrom) : combineFrom(doc, opts.slugFrom, modifier.$set);
    if (from === false) {                                                                                          //
      fsDebug(opts, "Nothing to slug from, leaving.");                                                             //
      return true;                                                                                                 // 179
    }                                                                                                              //
    fsDebug(opts, from, 'Slugging From');                                                                          //
    slugBase = slugify(from, opts.transliteration, opts.maxLength);                                                //
    if (!slugBase) {                                                                                               //
      return false;                                                                                                // 184
    }                                                                                                              //
    fsDebug(opts, slugBase, 'SlugBase before reduction');                                                          //
    if (opts.distinct) {                                                                                           //
      slugBase = slugBase.replace(/(-\d+)+$/, '');                                                                 //
      fsDebug(opts, slugBase, 'SlugBase after reduction');                                                         //
      baseField = "friendlySlugs." + opts.slugField + ".base";                                                     //
      indexField = "friendlySlugs." + opts.slugField + ".index";                                                   //
      fieldSelector = {};                                                                                          //
      fieldSelector[baseField] = slugBase;                                                                         //
      i = 0;                                                                                                       //
      while (i < opts.distinctUpTo.length) {                                                                       // 201
        f = opts.distinctUpTo[i];                                                                                  //
        fieldSelector[f] = doc[f];                                                                                 //
        i++;                                                                                                       //
      }                                                                                                            //
      sortSelector = {};                                                                                           //
      sortSelector[indexField] = -1;                                                                               //
      limitSelector = {};                                                                                          //
      limitSelector[indexField] = 1;                                                                               //
      result = collection.findOne(fieldSelector, {                                                                 //
        sort: sortSelector,                                                                                        //
        fields: limitSelector,                                                                                     //
        limit: 1                                                                                                   //
      });                                                                                                          //
      fsDebug(opts, result, 'Highest indexed base found');                                                         //
      if ((result == null) || (result.friendlySlugs == null) || (result.friendlySlugs[opts.slugField] == null) || (result.friendlySlugs[opts.slugField].index == null)) {
        index = 0;                                                                                                 //
      } else {                                                                                                     //
        index = result.friendlySlugs[opts.slugField].index + 1;                                                    //
      }                                                                                                            //
      defaultSlugGenerator = function(slugBase, index) {                                                           //
        if (index === 0) {                                                                                         //
          return slugBase;                                                                                         //
        } else {                                                                                                   //
          return slugBase + '-' + index;                                                                           //
        }                                                                                                          //
      };                                                                                                           //
      slugGenerator = (ref = opts.slugGenerator) != null ? ref : defaultSlugGenerator;                             //
      finalSlug = slugGenerator(slugBase, index);                                                                  //
    } else {                                                                                                       //
      index = false;                                                                                               //
      finalSlug = slugBase;                                                                                        //
    }                                                                                                              //
    fsDebug(opts, finalSlug, 'finalSlug');                                                                         //
    if (modifier || create) {                                                                                      //
      fsDebug(opts, 'Set to modify or create slug on update');                                                     //
      modifier = modifier || {};                                                                                   //
      modifier.$set = modifier.$set || {};                                                                         //
      modifier.$set.friendlySlugs = doc.friendlySlugs || {};                                                       //
      modifier.$set.friendlySlugs[opts.slugField] = modifier.$set.friendlySlugs[opts.slugField] || {};             //
      modifier.$set.friendlySlugs[opts.slugField].base = slugBase;                                                 //
      modifier.$set.friendlySlugs[opts.slugField].index = index;                                                   //
      modifier.$set[opts.slugField] = finalSlug;                                                                   //
      fsDebug(opts, modifier, 'Final Modifier');                                                                   //
    } else {                                                                                                       //
      fsDebug(opts, 'Set to update');                                                                              //
      doc.friendlySlugs = doc.friendlySlugs || {};                                                                 //
      doc.friendlySlugs[opts.slugField] = doc.friendlySlugs[opts.slugField] || {};                                 //
      doc.friendlySlugs[opts.slugField].base = slugBase;                                                           //
      doc.friendlySlugs[opts.slugField].index = index;                                                             //
      doc[opts.slugField] = finalSlug;                                                                             //
      fsDebug(opts, doc, 'Final Doc');                                                                             //
    }                                                                                                              //
    return true;                                                                                                   // 258
  };                                                                                                               //
  return fsDebug = function(opts, item, label) {                                                                   //
    if (label == null) {                                                                                           //
      label = '';                                                                                                  //
    }                                                                                                              //
    if (!opts.debug) {                                                                                             //
      return;                                                                                                      // 261
    }                                                                                                              //
    if (typeof item === 'object') {                                                                                //
      console.log("friendlySlugs DEBUG: " + label + '↓');                                                          //
      return console.log(item);                                                                                    //
    } else {                                                                                                       //
      return console.log("friendlySlugs DEBUG: " + label + '= ' + item);                                           //
    }                                                                                                              //
  };                                                                                                               //
};                                                                                                                 // 6
                                                                                                                   //
slugify = function(text, transliteration, maxLength) {                                                             // 268
  var lastDash, slug;                                                                                              // 269
  if (text == null) {                                                                                              //
    return false;                                                                                                  // 269
  }                                                                                                                //
  if (text.length < 1) {                                                                                           //
    return false;                                                                                                  // 270
  }                                                                                                                //
  text = text.toString().toLowerCase();                                                                            //
  _.each(transliteration, function(item) {                                                                         //
    return text = text.replace(new RegExp('[' + item.from + ']', 'g'), item.to);                                   //
  });                                                                                                              //
  slug = text.replace(/'/g, '').replace(/[^0-9a-z-]/g, '-').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
  if (maxLength > 0 && slug.length > maxLength) {                                                                  //
    lastDash = slug.substring(0, maxLength).lastIndexOf('-');                                                      //
    slug = slug.substring(0, lastDash);                                                                            //
  }                                                                                                                //
  return slug;                                                                                                     // 283
};                                                                                                                 // 268
                                                                                                                   //
stringToNested = function(obj, path) {                                                                             // 285
  var parts;                                                                                                       // 286
  parts = path.split(".");                                                                                         //
  if (parts.length === 1) {                                                                                        //
    if ((obj != null) && (obj[parts[0]] != null)) {                                                                //
      return obj[parts[0]];                                                                                        // 289
    } else {                                                                                                       //
      return false;                                                                                                // 291
    }                                                                                                              //
  }                                                                                                                //
  return stringToNested(obj[parts[0]], parts.slice(1).join("."));                                                  // 292
};                                                                                                                 // 285
                                                                                                                   //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['todda00:friendly-slugs'] = {};

})();

//# sourceMappingURL=todda00_friendly-slugs.js.map
