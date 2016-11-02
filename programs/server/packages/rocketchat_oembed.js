(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var changeCase = Package['konecty:change-case'].changeCase;
var RocketChat = Package['rocketchat:lib'].RocketChat;
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

/* Package-scope variables */
var __coffeescriptShare, OEmbed;

var require = meteorInstall({"node_modules":{"meteor":{"rocketchat:oembed":{"server":{"server.coffee.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/rocketchat_oembed/server/server.coffee.js                                                              //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var URL, getCharset, getRelevantHeaders, getRelevantMetaTags, getUrlContent, he, iconv, ipRangeCheck, jschardet, querystring, request, toUtf8,        
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
                                                                                                                   //
URL = Npm.require('url');                                                                                          // 1
                                                                                                                   //
querystring = Npm.require('querystring');                                                                          // 2
                                                                                                                   //
request = HTTPInternals.NpmModules.request.module;                                                                 // 3
                                                                                                                   //
iconv = Npm.require('iconv-lite');                                                                                 // 4
                                                                                                                   //
ipRangeCheck = Npm.require('ip-range-check');                                                                      // 5
                                                                                                                   //
he = Npm.require('he');                                                                                            // 6
                                                                                                                   //
jschardet = Npm.require('jschardet');                                                                              // 7
                                                                                                                   //
OEmbed = {};                                                                                                       // 9
                                                                                                                   //
getCharset = function(contentType, body) {                                                                         // 15
  var binary, detected, detectedCharset, htmlMetaCharset, httpHeaderCharset, m1, m2, result;                       // 16
  contentType = contentType || '';                                                                                 //
  binary = body.toString('binary');                                                                                //
  detected = jschardet.detect(binary);                                                                             //
  if (detected.confidence > 0.8) {                                                                                 //
    detectedCharset = detected.encoding.toLowerCase();                                                             //
  }                                                                                                                //
  m1 = contentType.match(/charset=([\w\-]+)/i);                                                                    //
  if (m1) {                                                                                                        //
    httpHeaderCharset = m1[1].toLowerCase();                                                                       //
  }                                                                                                                //
  m2 = binary.match(/<meta\b[^>]*charset=["']?([\w\-]+)/i);                                                        //
  if (m2) {                                                                                                        //
    htmlMetaCharset = m2[1].toLowerCase();                                                                         //
  }                                                                                                                //
  switch (detectedCharset) {                                                                                       // 31
    case httpHeaderCharset:                                                                                        // 31
      result = httpHeaderCharset;                                                                                  //
      break;                                                                                                       // 32
    case htmlMetaCharset:                                                                                          // 31
      result = htmlMetaCharset;                                                                                    //
      break;                                                                                                       // 34
    default:                                                                                                       // 31
      result = httpHeaderCharset || htmlMetaCharset || detectedCharset || 'utf-8';                                 //
  }                                                                                                                // 31
  return result;                                                                                                   // 39
};                                                                                                                 // 15
                                                                                                                   //
toUtf8 = function(contentType, body) {                                                                             // 41
  return iconv.decode(body, getCharset(contentType, body));                                                        // 42
};                                                                                                                 // 41
                                                                                                                   //
getUrlContent = function(urlObj, redirectCount, callback) {                                                        // 44
  var chunks, chunksTotalLength, data, error, headers, ignoredHosts, opts, parsedUrl, ref, ref1, safePorts, statusCode, stream, url;
  if (redirectCount == null) {                                                                                     //
    redirectCount = 5;                                                                                             //
  }                                                                                                                //
  if (_.isString(urlObj)) {                                                                                        //
    urlObj = URL.parse(urlObj);                                                                                    //
  }                                                                                                                //
  parsedUrl = _.pick(urlObj, ['host', 'hash', 'pathname', 'protocol', 'port', 'query', 'search', 'hostname']);     //
  ignoredHosts = RocketChat.settings.get('API_EmbedIgnoredHosts').replace(/\s/g, '').split(',') || [];             //
  if ((ref = parsedUrl.hostname, indexOf.call(ignoredHosts, ref) >= 0) || ipRangeCheck(parsedUrl.hostname, ignoredHosts)) {
    return callback();                                                                                             // 52
  }                                                                                                                //
  safePorts = RocketChat.settings.get('API_EmbedSafePorts').replace(/\s/g, '').split(',') || [];                   //
  if (parsedUrl.port && safePorts.length > 0 && (ref1 = parsedUrl.port, indexOf.call(safePorts, ref1) < 0)) {      //
    return callback();                                                                                             // 56
  }                                                                                                                //
  data = RocketChat.callbacks.run('oembed:beforeGetUrlContent', {                                                  //
    urlObj: urlObj,                                                                                                //
    parsedUrl: parsedUrl                                                                                           //
  });                                                                                                              //
  if (data.attachments != null) {                                                                                  //
    return callback(null, data);                                                                                   // 63
  }                                                                                                                //
  url = URL.format(data.urlObj);                                                                                   //
  opts = {                                                                                                         //
    url: url,                                                                                                      //
    strictSSL: !RocketChat.settings.get('Allow_Invalid_SelfSigned_Certs'),                                         //
    gzip: true,                                                                                                    //
    maxRedirects: redirectCount,                                                                                   //
    headers: {                                                                                                     //
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.0 Safari/537.36'
    }                                                                                                              //
  };                                                                                                               //
  headers = null;                                                                                                  //
  statusCode = null;                                                                                               //
  error = null;                                                                                                    //
  chunks = [];                                                                                                     //
  chunksTotalLength = 0;                                                                                           //
  stream = request(opts);                                                                                          //
  stream.on('response', function(response) {                                                                       //
    statusCode = response.statusCode;                                                                              //
    headers = response.headers;                                                                                    //
    if (response.statusCode !== 200) {                                                                             //
      return stream.abort();                                                                                       // 85
    }                                                                                                              //
  });                                                                                                              //
  stream.on('data', function(chunk) {                                                                              //
    chunks.push(chunk);                                                                                            //
    chunksTotalLength += chunk.length;                                                                             //
    if (chunksTotalLength > 250000) {                                                                              //
      return stream.abort();                                                                                       //
    }                                                                                                              //
  });                                                                                                              //
  stream.on('end', Meteor.bindEnvironment(function() {                                                             //
    var buffer;                                                                                                    // 94
    if (error != null) {                                                                                           //
      return callback(null, {                                                                                      // 95
        error: error,                                                                                              //
        parsedUrl: parsedUrl                                                                                       //
      });                                                                                                          //
    }                                                                                                              //
    buffer = Buffer.concat(chunks);                                                                                //
    return callback(null, {                                                                                        //
      headers: headers,                                                                                            //
      body: toUtf8(headers['content-type'], buffer),                                                               //
      parsedUrl: parsedUrl,                                                                                        //
      statusCode: statusCode                                                                                       //
    });                                                                                                            //
  }));                                                                                                             //
  return stream.on('error', function(err) {                                                                        //
    return error = err;                                                                                            //
  });                                                                                                              //
};                                                                                                                 // 44
                                                                                                                   //
OEmbed.getUrlMeta = function(url, withFragment) {                                                                  // 112
  var content, data, getUrlContentSync, header, headers, metas, path, queryStringObj, ref, urlObj, value;          // 113
  getUrlContentSync = Meteor.wrapAsync(getUrlContent);                                                             //
  urlObj = URL.parse(url);                                                                                         //
  if (withFragment != null) {                                                                                      //
    queryStringObj = querystring.parse(urlObj.query);                                                              //
    queryStringObj._escaped_fragment_ = '';                                                                        //
    urlObj.query = querystring.stringify(queryStringObj);                                                          //
    path = urlObj.pathname;                                                                                        //
    if (urlObj.query != null) {                                                                                    //
      path += '?' + urlObj.query;                                                                                  //
    }                                                                                                              //
    urlObj.path = path;                                                                                            //
  }                                                                                                                //
  content = getUrlContentSync(urlObj, 5);                                                                          //
  if (!content) {                                                                                                  //
    return;                                                                                                        // 130
  }                                                                                                                //
  if (content.attachments != null) {                                                                               //
    return content;                                                                                                // 133
  }                                                                                                                //
  metas = void 0;                                                                                                  //
  if ((content != null ? content.body : void 0) != null) {                                                         //
    metas = {};                                                                                                    //
    content.body.replace(/<title[^>]*>([^<]*)<\/title>/gmi, function(meta, title) {                                //
      return metas.pageTitle != null ? metas.pageTitle : metas.pageTitle = he.unescape(title);                     //
    });                                                                                                            //
    content.body.replace(/<meta[^>]*(?:name|property)=[']([^']*)['][^>]*\scontent=[']([^']*)['][^>]*>/gmi, function(meta, name, value) {
      var name1;                                                                                                   // 143
      return metas[name1 = changeCase.camelCase(name)] != null ? metas[name1] : metas[name1] = he.unescape(value);
    });                                                                                                            //
    content.body.replace(/<meta[^>]*(?:name|property)=["]([^"]*)["][^>]*\scontent=["]([^"]*)["][^>]*>/gmi, function(meta, name, value) {
      var name1;                                                                                                   // 146
      return metas[name1 = changeCase.camelCase(name)] != null ? metas[name1] : metas[name1] = he.unescape(value);
    });                                                                                                            //
    content.body.replace(/<meta[^>]*\scontent=[']([^']*)['][^>]*(?:name|property)=[']([^']*)['][^>]*>/gmi, function(meta, value, name) {
      var name1;                                                                                                   // 149
      return metas[name1 = changeCase.camelCase(name)] != null ? metas[name1] : metas[name1] = he.unescape(value);
    });                                                                                                            //
    content.body.replace(/<meta[^>]*\scontent=["]([^"]*)["][^>]*(?:name|property)=["]([^"]*)["][^>]*>/gmi, function(meta, value, name) {
      var name1;                                                                                                   // 152
      return metas[name1 = changeCase.camelCase(name)] != null ? metas[name1] : metas[name1] = he.unescape(value);
    });                                                                                                            //
    if (metas.fragment === '!' && (withFragment == null)) {                                                        //
      return OEmbed.getUrlMeta(url, true);                                                                         // 156
    }                                                                                                              //
  }                                                                                                                //
  headers = void 0;                                                                                                //
  if ((content != null ? content.headers : void 0) != null) {                                                      //
    headers = {};                                                                                                  //
    ref = content.headers;                                                                                         // 162
    for (header in ref) {                                                                                          // 162
      value = ref[header];                                                                                         //
      headers[changeCase.camelCase(header)] = value;                                                               //
    }                                                                                                              // 162
  }                                                                                                                //
  if ((content != null ? content.statusCode : void 0) !== 200) {                                                   //
    return data;                                                                                                   // 166
  }                                                                                                                //
  data = RocketChat.callbacks.run('oembed:afterParseContent', {                                                    //
    meta: metas,                                                                                                   //
    headers: headers,                                                                                              //
    parsedUrl: content.parsedUrl,                                                                                  //
    content: content                                                                                               //
  });                                                                                                              //
  return data;                                                                                                     // 174
};                                                                                                                 // 112
                                                                                                                   //
OEmbed.getUrlMetaWithCache = function(url, withFragment) {                                                         // 176
  var cache, data, e;                                                                                              // 177
  cache = RocketChat.models.OEmbedCache.findOneById(url);                                                          //
  if (cache != null) {                                                                                             //
    return cache.data;                                                                                             // 179
  }                                                                                                                //
  data = OEmbed.getUrlMeta(url, withFragment);                                                                     //
  if (data != null) {                                                                                              //
    try {                                                                                                          // 184
      RocketChat.models.OEmbedCache.createWithIdAndData(url, data);                                                //
    } catch (error1) {                                                                                             //
      e = error1;                                                                                                  //
      console.error('OEmbed duplicated record', url);                                                              //
    }                                                                                                              //
    return data;                                                                                                   // 189
  }                                                                                                                //
};                                                                                                                 // 176
                                                                                                                   //
getRelevantHeaders = function(headersObj) {                                                                        // 193
  var headers, key, ref, value;                                                                                    // 194
  headers = {};                                                                                                    //
  for (key in headersObj) {                                                                                        // 195
    value = headersObj[key];                                                                                       //
    if (((ref = key.toLowerCase()) === 'contenttype' || ref === 'contentlength') && (value != null ? value.trim() : void 0) !== '') {
      headers[key] = value;                                                                                        //
    }                                                                                                              //
  }                                                                                                                // 195
  if (Object.keys(headers).length > 0) {                                                                           //
    return headers;                                                                                                // 200
  }                                                                                                                //
};                                                                                                                 // 193
                                                                                                                   //
getRelevantMetaTags = function(metaObj) {                                                                          // 203
  var key, tags, value;                                                                                            // 204
  tags = {};                                                                                                       //
  for (key in metaObj) {                                                                                           // 205
    value = metaObj[key];                                                                                          //
    if (/^(og|fb|twitter|oembed).+|description|title|pageTitle$/.test(key.toLowerCase()) && (value != null ? value.trim() : void 0) !== '') {
      tags[key] = value;                                                                                           //
    }                                                                                                              //
  }                                                                                                                // 205
  if (Object.keys(tags).length > 0) {                                                                              //
    return tags;                                                                                                   // 210
  }                                                                                                                //
};                                                                                                                 // 203
                                                                                                                   //
OEmbed.RocketUrlParser = function(message) {                                                                       // 213
  var attachments, changed;                                                                                        // 214
  if (Array.isArray(message.urls)) {                                                                               //
    attachments = [];                                                                                              //
    changed = false;                                                                                               //
    message.urls.forEach(function(item) {                                                                          //
      var data;                                                                                                    // 218
      if (item.ignoreParse === true) {                                                                             //
        return;                                                                                                    // 218
      }                                                                                                            //
      if (item.url.startsWith("grain://")) {                                                                       //
        changed = true;                                                                                            //
        item.meta = {                                                                                              //
          sandstorm: {                                                                                             //
            grain: item.sandstormViewInfo                                                                          //
          }                                                                                                        //
        };                                                                                                         //
        return;                                                                                                    // 224
      }                                                                                                            //
      if (!/^https?:\/\//i.test(item.url)) {                                                                       //
        return;                                                                                                    // 226
      }                                                                                                            //
      data = OEmbed.getUrlMetaWithCache(item.url);                                                                 //
      if (data != null) {                                                                                          //
        if (data.attachments) {                                                                                    //
          return attachments = _.union(attachments, data.attachments);                                             //
        } else {                                                                                                   //
          if (data.meta != null) {                                                                                 //
            item.meta = getRelevantMetaTags(data.meta);                                                            //
          }                                                                                                        //
          if (data.headers != null) {                                                                              //
            item.headers = getRelevantHeaders(data.headers);                                                       //
          }                                                                                                        //
          item.parsedUrl = data.parsedUrl;                                                                         //
          return changed = true;                                                                                   //
        }                                                                                                          //
      }                                                                                                            //
    });                                                                                                            //
    if (attachments.length) {                                                                                      //
      RocketChat.models.Messages.setMessageAttachments(message._id, attachments);                                  //
    }                                                                                                              //
    if (changed === true) {                                                                                        //
      RocketChat.models.Messages.setUrlsById(message._id, message.urls);                                           //
    }                                                                                                              //
  }                                                                                                                //
  return message;                                                                                                  // 249
};                                                                                                                 // 213
                                                                                                                   //
RocketChat.settings.get('API_Embed', function(key, value) {                                                        // 251
  if (value) {                                                                                                     //
    return RocketChat.callbacks.add('afterSaveMessage', OEmbed.RocketUrlParser, RocketChat.callbacks.priority.LOW, 'API_Embed');
  } else {                                                                                                         //
    return RocketChat.callbacks.remove('afterSaveMessage', 'API_Embed');                                           //
  }                                                                                                                //
});                                                                                                                // 251
                                                                                                                   //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"providers.coffee.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/rocketchat_oembed/server/providers.coffee.js                                                           //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Providers, QueryString, URL, providers;                                                                        // 1
                                                                                                                   //
URL = Npm.require('url');                                                                                          // 1
                                                                                                                   //
QueryString = Npm.require('querystring');                                                                          // 2
                                                                                                                   //
Providers = (function() {                                                                                          // 4
  function Providers() {}                                                                                          //
                                                                                                                   //
  Providers.prototype.providers = [];                                                                              //
                                                                                                                   //
  Providers.getConsumerUrl = function(provider, url) {                                                             //
    var urlObj;                                                                                                    // 8
    urlObj = URL.parse(provider.endPoint, true);                                                                   //
    urlObj.query['url'] = url;                                                                                     //
    delete urlObj.search;                                                                                          //
    return URL.format(urlObj);                                                                                     // 11
  };                                                                                                               //
                                                                                                                   //
  Providers.prototype.registerProvider = function(provider) {                                                      //
    return this.providers.push(provider);                                                                          //
  };                                                                                                               //
                                                                                                                   //
  Providers.prototype.getProviders = function() {                                                                  //
    return this.providers;                                                                                         // 17
  };                                                                                                               //
                                                                                                                   //
  Providers.prototype.getProviderForUrl = function(url) {                                                          //
    return _.find(this.providers, function(provider) {                                                             // 20
      var candidate;                                                                                               // 21
      candidate = _.find(provider.urls, function(re) {                                                             //
        return re.test(url);                                                                                       // 22
      });                                                                                                          //
      return candidate != null;                                                                                    // 23
    });                                                                                                            //
  };                                                                                                               //
                                                                                                                   //
  return Providers;                                                                                                //
                                                                                                                   //
})();                                                                                                              //
                                                                                                                   //
providers = new Providers();                                                                                       // 25
                                                                                                                   //
providers.registerProvider({                                                                                       // 26
  urls: [new RegExp('https?://soundcloud.com/\\S+')],                                                              //
  endPoint: 'https://soundcloud.com/oembed?format=json&maxheight=150'                                              //
});                                                                                                                //
                                                                                                                   //
providers.registerProvider({                                                                                       // 29
  urls: [new RegExp('https?://vimeo.com/[^/]+'), new RegExp('https?://vimeo.com/channels/[^/]+/[^/]+'), new RegExp('https://vimeo.com/groups/[^/]+/videos/[^/]+')],
  endPoint: 'https://vimeo.com/api/oembed.json?maxheight=200'                                                      //
});                                                                                                                //
                                                                                                                   //
providers.registerProvider({                                                                                       // 32
  urls: [new RegExp('https?://www.youtube.com/\\S+'), new RegExp('https?://youtu.be/\\S+')],                       //
  endPoint: 'https://www.youtube.com/oembed?maxheight=200'                                                         //
});                                                                                                                //
                                                                                                                   //
providers.registerProvider({                                                                                       // 35
  urls: [new RegExp('https?://www.rdio.com/\\S+'), new RegExp('https?://rd.io/\\S+')],                             //
  endPoint: 'https://www.rdio.com/api/oembed/?format=json&maxheight=150'                                           //
});                                                                                                                //
                                                                                                                   //
providers.registerProvider({                                                                                       // 38
  urls: [new RegExp('https?://www.slideshare.net/[^/]+/[^/]+')],                                                   //
  endPoint: 'https://www.slideshare.net/api/oembed/2?format=json&maxheight=200'                                    //
});                                                                                                                //
                                                                                                                   //
providers.registerProvider({                                                                                       // 41
  urls: [new RegExp('https?://www.dailymotion.com/video/\\S+')],                                                   //
  endPoint: 'https://www.dailymotion.com/services/oembed?maxheight=200'                                            //
});                                                                                                                //
                                                                                                                   //
RocketChat.oembed = {};                                                                                            // 45
                                                                                                                   //
RocketChat.oembed.providers = providers;                                                                           // 46
                                                                                                                   //
RocketChat.callbacks.add('oembed:beforeGetUrlContent', function(data) {                                            // 48
  var consumerUrl, provider, url;                                                                                  // 49
  if (data.parsedUrl != null) {                                                                                    //
    url = URL.format(data.parsedUrl);                                                                              //
    provider = providers.getProviderForUrl(url);                                                                   //
    if (provider != null) {                                                                                        //
      consumerUrl = Providers.getConsumerUrl(provider, url);                                                       //
      consumerUrl = URL.parse(consumerUrl, true);                                                                  //
      _.extend(data.parsedUrl, consumerUrl);                                                                       //
      data.urlObj.port = consumerUrl.port;                                                                         //
      data.urlObj.hostname = consumerUrl.hostname;                                                                 //
      data.urlObj.pathname = consumerUrl.pathname;                                                                 //
      data.urlObj.query = consumerUrl.query;                                                                       //
      delete data.urlObj.search;                                                                                   //
    }                                                                                                              //
  }                                                                                                                //
  return data;                                                                                                     // 62
}, RocketChat.callbacks.priority.MEDIUM, 'oembed-providers-before');                                               // 48
                                                                                                                   //
RocketChat.callbacks.add('oembed:afterParseContent', function(data) {                                              // 65
  var metas, provider, queryString, ref, ref1, url;                                                                // 66
  if (((ref = data.parsedUrl) != null ? ref.query : void 0) != null) {                                             //
    queryString = data.parsedUrl.query;                                                                            //
    if (_.isString(data.parsedUrl.query)) {                                                                        //
      queryString = QueryString.parse(data.parsedUrl.query);                                                       //
    }                                                                                                              //
    if (queryString.url != null) {                                                                                 //
      url = queryString.url;                                                                                       //
      provider = providers.getProviderForUrl(url);                                                                 //
      if (provider != null) {                                                                                      //
        if (((ref1 = data.content) != null ? ref1.body : void 0) != null) {                                        //
          try {                                                                                                    // 75
            metas = JSON.parse(data.content.body);                                                                 //
            _.each(metas, function(value, key) {                                                                   //
              if (_.isString(value)) {                                                                             //
                return data.meta[changeCase.camelCase('oembed_' + key)] = value;                                   //
              }                                                                                                    //
            });                                                                                                    //
            data.meta['oembedUrl'] = url;                                                                          //
          } catch (error) {}                                                                                       //
        }                                                                                                          //
      }                                                                                                            //
    }                                                                                                              //
  }                                                                                                                //
  return data;                                                                                                     // 82
}, RocketChat.callbacks.priority.MEDIUM, 'oembed-providers-after');                                                // 65
                                                                                                                   //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"jumpToMessage.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/rocketchat_oembed/server/jumpToMessage.js                                                              //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
/* globals getAvatarUrlFromUsername */                                                                             // 1
                                                                                                                   //
var URL = Npm.require('url');                                                                                      // 3
var QueryString = Npm.require('querystring');                                                                      // 4
                                                                                                                   //
RocketChat.callbacks.add('beforeSaveMessage', function (msg) {                                                     // 6
	if (msg && msg.urls) {                                                                                            // 7
		msg.urls.forEach(function (item) {                                                                               // 8
			if (item.url.indexOf(Meteor.absoluteUrl()) === 0) {                                                             // 9
				var urlObj = URL.parse(item.url);                                                                              // 10
				if (urlObj.query) {                                                                                            // 11
					var queryString = QueryString.parse(urlObj.query);                                                            // 12
					if (_.isString(queryString.msg)) {                                                                            // 13
						// Jump-to query param                                                                                       // 13
						var jumpToMessage = RocketChat.models.Messages.findOneById(queryString.msg);                                 // 14
						if (jumpToMessage) {                                                                                         // 15
							msg.attachments = msg.attachments || [];                                                                    // 16
							msg.attachments.push({                                                                                      // 17
								'text': jumpToMessage.msg,                                                                                 // 18
								'author_name': jumpToMessage.u.username,                                                                   // 19
								'author_icon': getAvatarUrlFromUsername(jumpToMessage.u.username),                                         // 20
								'message_link': item.url,                                                                                  // 21
								'attachments': jumpToMessage.attachments || [],                                                            // 22
								'ts': jumpToMessage.ts                                                                                     // 23
							});                                                                                                         // 17
							item.ignoreParse = true;                                                                                    // 25
						}                                                                                                            // 26
					}                                                                                                             // 27
				}                                                                                                              // 28
			}                                                                                                               // 29
		});                                                                                                              // 30
	}                                                                                                                 // 31
	return msg;                                                                                                       // 32
}, RocketChat.callbacks.priority.LOW, 'jumpToMessage');                                                            // 33
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"models":{"OEmbedCache.coffee.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/rocketchat_oembed/server/models/OEmbedCache.coffee.js                                                  //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;                                                                                     //
                                                                                                                   //
RocketChat.models.OEmbedCache = new ((function(superClass) {                                                       // 1
  extend(_Class, superClass);                                                                                      //
                                                                                                                   //
  function _Class() {                                                                                              //
    _Class.__super__.constructor.call(this, 'oembed_cache');                                                       //
  }                                                                                                                //
                                                                                                                   //
  _Class.prototype.findOneById = function(_id, options) {                                                          //
    var query;                                                                                                     // 8
    query = {                                                                                                      //
      _id: _id                                                                                                     //
    };                                                                                                             //
    return this.findOne(query, options);                                                                           // 11
  };                                                                                                               //
                                                                                                                   //
  _Class.prototype.createWithIdAndData = function(_id, data) {                                                     //
    var record;                                                                                                    // 16
    record = {                                                                                                     //
      _id: _id,                                                                                                    //
      data: data,                                                                                                  //
      updatedAt: new Date                                                                                          //
    };                                                                                                             //
    record._id = this.insert(record);                                                                              //
    return record;                                                                                                 // 22
  };                                                                                                               //
                                                                                                                   //
  return _Class;                                                                                                   //
                                                                                                                   //
})(RocketChat.models._Base));                                                                                      //
                                                                                                                   //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{"extensions":[".js",".json",".coffee"]});
require("./node_modules/meteor/rocketchat:oembed/server/server.coffee.js");
require("./node_modules/meteor/rocketchat:oembed/server/providers.coffee.js");
require("./node_modules/meteor/rocketchat:oembed/server/jumpToMessage.js");
require("./node_modules/meteor/rocketchat:oembed/server/models/OEmbedCache.coffee.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['rocketchat:oembed'] = {}, {
  OEmbed: OEmbed
});

})();

//# sourceMappingURL=rocketchat_oembed.js.map
