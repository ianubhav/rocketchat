(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var RocketChat = Package['rocketchat:lib'].RocketChat;
var RoutePolicy = Package.routepolicy.RoutePolicy;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var _ = Package.underscore._;
var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;
var Accounts = Package['accounts-base'].Accounts;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var SAML, __coffeescriptShare;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/steffo_meteor-accounts-saml/saml_server.js                                                            //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
/* globals RoutePolicy, SAML */
/* jshint newcap: false */

if (!Accounts.saml) {
	Accounts.saml = {
		settings: {
			debug: true,
			generateUsername: false,
			providers: []
		}
	};
}

var fiber = Npm.require('fibers');
var connect = Npm.require('connect');
RoutePolicy.declare('/_saml/', 'network');

Meteor.methods({
	samlLogout: function(provider) {
		// Make sure the user is logged in before initiate SAML SLO
		if (!Meteor.userId()) {
			throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'samlLogout' });
		}
		var samlProvider = function(element) {
			return (element.provider === provider);
		};
		var providerConfig = Accounts.saml.settings.providers.filter(samlProvider)[0];

		if (Accounts.saml.settings.debug) {
			console.log('Logout request from ' + JSON.stringify(providerConfig));
		}
		// This query should respect upcoming array of SAML logins
		var user = Meteor.users.findOne({
			_id: Meteor.userId(),
			'services.saml.provider': provider
		}, {
			'services.saml': 1
		});
		var nameID = user.services.saml.nameID;
		var sessionIndex = user.services.saml.idpSession;
		nameID = sessionIndex;
		if (Accounts.saml.settings.debug) {
			console.log('NameID for user ' + Meteor.userId() + ' found: ' + JSON.stringify(nameID));
		}

		var _saml = new SAML(providerConfig);

		var request = _saml.generateLogoutRequest({
			nameID: nameID,
			sessionIndex: sessionIndex
		});

		// request.request: actual XML SAML Request
		// request.id: comminucation id which will be mentioned in the ResponseTo field of SAMLResponse

		Meteor.users.update({
			_id: Meteor.userId()
		}, {
			$set: {
				'services.saml.inResponseTo': request.id
			}
		});

		var _syncRequestToUrl = Meteor.wrapAsync(_saml.requestToUrl, _saml);
		var result = _syncRequestToUrl(request.request, 'logout');
		if (Accounts.saml.settings.debug) {
			console.log('SAML Logout Request ' + result);
		}


		return result;
	}
});

Accounts.registerLoginHandler(function(loginRequest) {
	if (!loginRequest.saml || !loginRequest.credentialToken) {
		return undefined;
	}

	var loginResult = Accounts.saml.retrieveCredential(loginRequest.credentialToken);
	if (Accounts.saml.settings.debug) {
		console.log('RESULT :' + JSON.stringify(loginResult));
	}

	if (loginResult === undefined) {
		return {
			type: 'saml',
			error: new Meteor.Error(Accounts.LoginCancelledError.numericError, 'No matching login attempt found')
		};
	}

	if (loginResult && loginResult.profile && loginResult.profile.email) {
		var user = Meteor.users.findOne({
			'emails.address': loginResult.profile.email
		});

		if (!user) {
			var newUser = {
				name: loginResult.profile.cn || loginResult.profile.username,
				active: true,
				globalRoles: ['user'],
				emails: [{
					address: loginResult.profile.email,
					verified: true
				}]
			};

			if (Accounts.saml.settings.generateUsername === true) {
				var username = RocketChat.generateUsernameSuggestion(newUser);
				if (username) {
					newUser.username = username;
				}
			} else if (loginResult.profile.username) {
				newUser.username = loginResult.profile.username;
			}

			var userId = Accounts.insertUserDoc({}, newUser);
			user = Meteor.users.findOne(userId);
		}

		//creating the token and adding to the user
		var stampedToken = Accounts._generateStampedLoginToken();
		Meteor.users.update(user, {
			$push: {
				'services.resume.loginTokens': stampedToken
			}
		});

		var samlLogin = {
			provider: Accounts.saml.RelayState,
			idp: loginResult.profile.issuer,
			idpSession: loginResult.profile.sessionIndex,
			nameID: loginResult.profile.nameID
		};

		Meteor.users.update({
			_id: user._id
		}, {
			$set: {
				// TBD this should be pushed, otherwise we're only able to SSO into a single IDP at a time
				'services.saml': samlLogin
			}
		});

		//sending token along with the userId
		var result = {
			userId: user._id,
			token: stampedToken.token
		};

		return result;

	} else {
		throw new Error('SAML Profile did not contain an email address');
	}
});

Accounts.saml._loginResultForCredentialToken = {};

Accounts.saml.hasCredential = function(credentialToken) {
	return _.has(Accounts.saml._loginResultForCredentialToken, credentialToken);
};

Accounts.saml.retrieveCredential = function(credentialToken) {
	// The credentialToken in all these functions corresponds to SAMLs inResponseTo field and is mandatory to check.
	var result = Accounts.saml._loginResultForCredentialToken[credentialToken];
	delete Accounts.saml._loginResultForCredentialToken[credentialToken];
	return result;
};

var closePopup = function(res, err) {
	res.writeHead(200, {
		'Content-Type': 'text/html'
	});
	var content = '<html><head><script>window.close()</script></head><body><H1>Verified</H1></body></html>';
	if (err) {
		content = '<html><body><h2>Sorry, an annoying error occured</h2><div>' + err + '</div><a onclick="window.close();">Close Window</a></body></html>';
	}
	res.end(content, 'utf-8');
};

var samlUrlToObject = function(url) {
	// req.url will be '/_saml/<action>/<service name>/<credentialToken>'
	if (!url) {
		return null;
	}

	var splitPath = url.split('/');

	// Any non-saml request will continue down the default
	// middlewares.
	if (splitPath[1] !== '_saml') {
		return null;
	}

	var result = {
		actionName: splitPath[2],
		serviceName: splitPath[3],
		credentialToken: splitPath[4]
	};
	if (Accounts.saml.settings.debug) {
		console.log(result);
	}
	return result;
};

var middleware = function(req, res, next) {
	// Make sure to catch any exceptions because otherwise we'd crash
	// the runner
	try {
		var samlObject = samlUrlToObject(req.url);
		if (!samlObject || !samlObject.serviceName) {
			next();
			return;
		}

		if (!samlObject.actionName) {
			throw new Error('Missing SAML action');
		}

		console.log(Accounts.saml.settings.providers);
		console.log(samlObject.serviceName);
		var service = _.find(Accounts.saml.settings.providers, function(samlSetting) {
			return samlSetting.provider === samlObject.serviceName;
		});

		// Skip everything if there's no service set by the saml middleware
		if (!service) {
			throw new Error('Unexpected SAML service ' + samlObject.serviceName);
		}
		var _saml;
		switch (samlObject.actionName) {
			case 'metadata':
				_saml = new SAML(service);
				service.callbackUrl = Meteor.absoluteUrl('_saml/validate/' + service.provider);
				res.writeHead(200);
				res.write(_saml.generateServiceProviderMetadata(service.callbackUrl));
				res.end();
				//closePopup(res);
				break;
			case 'logout':
				// This is where we receive SAML LogoutResponse
				_saml = new SAML(service);
				_saml.validateLogoutResponse(req.query.SAMLResponse, function(err, result) {
					if (!err) {
						var logOutUser = function(inResponseTo) {
							if (Accounts.saml.settings.debug) {
								console.log('Logging Out user via inResponseTo ' + inResponseTo);
							}
							var loggedOutUser = Meteor.users.find({
								'services.saml.inResponseTo': inResponseTo
							}).fetch();
							if (loggedOutUser.length === 1) {
								if (Accounts.saml.settings.debug) {
									console.log('Found user ' + loggedOutUser[0]._id);
								}
								Meteor.users.update({
									_id: loggedOutUser[0]._id
								}, {
									$set: {
										'services.resume.loginTokens': []
									}
								});
								Meteor.users.update({
									_id: loggedOutUser[0]._id
								}, {
									$unset: {
										'services.saml': ''
									}
								});
							} else {
								throw new Meteor.Error('Found multiple users matching SAML inResponseTo fields');
							}
						};

						fiber(function() {
							logOutUser(result);
						}).run();


						res.writeHead(302, {
							'Location': req.query.RelayState
						});
						res.end();
					}
					//  else {
					// 	// TBD thinking of sth meaning full.
					// }
				});
				break;
			case 'sloRedirect':
				var idpLogout = req.query.redirect;
				res.writeHead(302, {
					// credentialToken here is the SAML LogOut Request that we'll send back to IDP
					'Location': idpLogout
				});
				res.end();
				break;
			case 'authorize':
				service.callbackUrl = Meteor.absoluteUrl('_saml/validate/' + service.provider);
				service.id = samlObject.credentialToken;
				_saml = new SAML(service);
				_saml.getAuthorizeUrl(req, function(err, url) {
					if (err) {
						throw new Error('Unable to generate authorize url');
					}
					res.writeHead(302, {
						'Location': url
					});
					res.end();
				});
				break;
			case 'validate':
				_saml = new SAML(service);
				Accounts.saml.RelayState = req.body.RelayState;
				_saml.validateResponse(req.body.SAMLResponse, req.body.RelayState, function(err, profile/*, loggedOut*/) {
					if (err) {
						throw new Error('Unable to validate response url: ' + err);
					}

					var credentialToken = profile.inResponseToId || profile.InResponseTo || samlObject.credentialToken;
					if (!credentialToken) {
						throw new Error('Unable to determine credentialToken');
					}
					Accounts.saml._loginResultForCredentialToken[credentialToken] = {
						profile: profile
					};
					closePopup(res);
				});
				break;
			default:
				throw new Error('Unexpected SAML action ' + samlObject.actionName);

		}
	} catch (err) {
		closePopup(res, err);
	}
};

// Listen to incoming SAML http requests
WebApp.connectHandlers.use(connect.bodyParser()).use(function(req, res, next) {
	// Need to create a fiber since we're using synchronous http calls and nothing
	// else is wrapping this in a fiber automatically
	fiber(function() {
		middleware(req, res, next);
	}).run();
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/steffo_meteor-accounts-saml/saml_utils.js                                                             //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
/* globals SAML:true */

var zlib = Npm.require('zlib');
var xml2js = Npm.require('xml2js');
var xmlCrypto = Npm.require('xml-crypto');
var crypto = Npm.require('crypto');
var xmldom = Npm.require('xmldom');
var querystring = Npm.require('querystring');
var xmlbuilder = Npm.require('xmlbuilder');
// var xmlenc = Npm.require('xml-encryption');
// var xpath = xmlCrypto.xpath;
// var Dom = xmldom.DOMParser;

// var prefixMatch = new RegExp(/(?!xmlns)^.*:/);


SAML = function(options) {
	this.options = this.initialize(options);
};

// var stripPrefix = function(str) {
// 	return str.replace(prefixMatch, '');
// };

SAML.prototype.initialize = function(options) {
	if (!options) {
		options = {};
	}

	if (!options.protocol) {
		options.protocol = 'https://';
	}

	if (!options.path) {
		options.path = '/saml/consume';
	}

	if (!options.issuer) {
		options.issuer = 'onelogin_saml';
	}

	if (options.identifierFormat === undefined) {
		options.identifierFormat = 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress';
	}

	if (options.authnContext === undefined) {
		options.authnContext = 'urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport';
	}

	return options;
};

SAML.prototype.generateUniqueID = function() {
	var chars = 'abcdef0123456789';
	var uniqueID = '';
	for (var i = 0; i < 20; i++) {
		uniqueID += chars.substr(Math.floor((Math.random() * 15)), 1);
	}
	return uniqueID;
};

SAML.prototype.generateInstant = function() {
	return new Date().toISOString();
};

SAML.prototype.signRequest = function(xml) {
	var signer = crypto.createSign('RSA-SHA1');
	signer.update(xml);
	return signer.sign(this.options.privateKey, 'base64');
};

SAML.prototype.generateAuthorizeRequest = function(req) {
	var id = '_' + this.generateUniqueID();
	var instant = this.generateInstant();

	// Post-auth destination
	var callbackUrl;
	if (this.options.callbackUrl) {
		callbackUrl = this.options.callbackUrl;
	} else {
		callbackUrl = this.options.protocol + req.headers.host + this.options.path;
	}

	if (this.options.id) {
		id = this.options.id;
	}

	var request =
		'<samlp:AuthnRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" ID="' + id + '" Version="2.0" IssueInstant="' + instant +
		'" ProtocolBinding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" AssertionConsumerServiceURL="' + callbackUrl + '" Destination="' +
		this.options.entryPoint + '">' +
		'<saml:Issuer xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">' + this.options.issuer + '</saml:Issuer>\n';

	if (this.options.identifierFormat) {
		request += '<samlp:NameIDPolicy xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" Format="' + this.options.identifierFormat +
			'" AllowCreate="true"></samlp:NameIDPolicy>\n';
	}

	request +=
		'<samlp:RequestedAuthnContext xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" Comparison="exact">' +
		'<saml:AuthnContextClassRef xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport</saml:AuthnContextClassRef></samlp:RequestedAuthnContext>\n' +
		'</samlp:AuthnRequest>';

	return request;
};

SAML.prototype.generateLogoutRequest = function(options) {
	// options should be of the form
	// nameId: <nameId as submitted during SAML SSO>
	// sessionIndex: sessionIndex
	// --- NO SAMLsettings: <Meteor.setting.saml  entry for the provider you want to SLO from

	var id = '_' + this.generateUniqueID();
	var instant = this.generateInstant();

	var request = '<samlp:LogoutRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" ' +
		'xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" ID="' + id + '" Version="2.0" IssueInstant="' + instant +
		'" Destination="' + this.options.idpSLORedirectURL + '">' +
		'<saml:Issuer xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">' + this.options.issuer + '</saml:Issuer>' +
		'<saml:NameID Format="' + this.options.identifierFormat + '">' + options.nameID + '</saml:NameID>' +
		'</samlp:LogoutRequest>';

	request = '<samlp:LogoutRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"  ' +
		'ID="' + id + '" ' +
		'Version="2.0" ' +
		'IssueInstant="' + instant + '" ' +
		'Destination="' + this.options.idpSLORedirectURL + '" ' +
		'>' +
		'<saml:Issuer xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">' + this.options.issuer + '</saml:Issuer>' +
		'<saml:NameID xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" ' +
		'NameQualifier="http://id.init8.net:8080/openam" ' +
		'SPNameQualifier="' + this.options.issuer + '" ' +
		'Format="' + this.options.identifierFormat + '">' +
		options.nameID + '</saml:NameID>' +
		'<samlp:SessionIndex xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol">' + options.sessionIndex + '</samlp:SessionIndex>' +
		'</samlp:LogoutRequest>';
	if (Meteor.settings.debug) {
		console.log('------- SAML Logout request -----------');
		console.log(request);
	}
	return {
		request: request,
		id: id
	};
};

SAML.prototype.requestToUrl = function(request, operation, callback) {
	var self = this;
	zlib.deflateRaw(request, function(err, buffer) {
		if (err) {
			return callback(err);
		}

		var base64 = buffer.toString('base64');
		var target = self.options.entryPoint;

		if (operation === 'logout') {
			if (self.options.idpSLORedirectURL) {
				target = self.options.idpSLORedirectURL;
			}
		}

		if (target.indexOf('?') > 0) {
			target += '&';
		} else {
			target += '?';
		}

		var samlRequest = {
			SAMLRequest: base64
		};

		if (self.options.privateCert) {
			samlRequest.SigAlg = 'http://www.w3.org/2000/09/xmldsig#rsa-sha1';
			samlRequest.Signature = self.signRequest(querystring.stringify(samlRequest));
		}

		// TBD. We should really include a proper RelayState here
		var relayState;
		if (operation === 'logout') {
			// in case of logout we want to be redirected back to the Meteor app.
			relayState = Meteor.absoluteUrl();
		} else {
			relayState = self.options.provider;
		}
		target += querystring.stringify(samlRequest) + '&RelayState=' + relayState;

		if (Meteor.settings.debug) {
			console.log('requestToUrl: ' + target);
		}
		if (operation === 'logout') {
			// in case of logout we want to be redirected back to the Meteor app.
			return callback(null, target);

		} else {
			callback(null, target);
		}
	});
};

SAML.prototype.getAuthorizeUrl = function(req, callback) {
	var request = this.generateAuthorizeRequest(req);

	this.requestToUrl(request, 'authorize', callback);
};

SAML.prototype.getLogoutUrl = function(req, callback) {
	var request = this.generateLogoutRequest(req);

	this.requestToUrl(request, 'logout', callback);
};

SAML.prototype.certToPEM = function(cert) {
	cert = cert.match(/.{1,64}/g).join('\n');
	cert = '-----BEGIN CERTIFICATE-----\n' + cert;
	cert = cert + '\n-----END CERTIFICATE-----\n';
	return cert;
};

// functionfindChilds(node, localName, namespace) {
// 	var res = [];
// 	for (var i = 0; i < node.childNodes.length; i++) {
// 		var child = node.childNodes[i];
// 		if (child.localName === localName && (child.namespaceURI === namespace || !namespace)) {
// 			res.push(child);
// 		}
// 	}
// 	return res;
// }

SAML.prototype.validateSignature = function(xml, cert) {
	var self = this;

	var doc = new xmldom.DOMParser().parseFromString(xml);
	var signature = xmlCrypto.xpath(doc, '//*[local-name(.)=\'Signature\' and namespace-uri(.)=\'http://www.w3.org/2000/09/xmldsig#\']')[0];

	var sig = new xmlCrypto.SignedXml();

	sig.keyInfoProvider = {
		getKeyInfo: function(/*key*/) {
			return '<X509Data></X509Data>';
		},
		getKey: function(/*keyInfo*/) {
			return self.certToPEM(cert);
		}
	};

	sig.loadSignature(signature);

	return sig.checkSignature(xml);
};

SAML.prototype.getElement = function(parentElement, elementName) {
	if (parentElement['saml:' + elementName]) {
		return parentElement['saml:' + elementName];
	} else if (parentElement['samlp:' + elementName]) {
		return parentElement['samlp:' + elementName];
	} else if (parentElement['saml2p:' + elementName]) {
		return parentElement['saml2p:' + elementName];
	} else if (parentElement['saml2:' + elementName]) {
		return parentElement['saml2:' + elementName];
	}
	return parentElement[elementName];
};

SAML.prototype.validateLogoutResponse = function(samlResponse, callback) {
	var self = this;

	var compressedSAMLResponse = new Buffer(samlResponse, 'base64');
	zlib.inflateRaw(compressedSAMLResponse, function(err, decoded) {

		if (err) {
			if (Meteor.settings.debug) {
				console.log(err);
			}
		} else {
			var parser = new xml2js.Parser({
				explicitRoot: true
			});
			parser.parseString(decoded, function(err, doc) {
				var response = self.getElement(doc, 'LogoutResponse');

				if (response) {
					// TBD. Check if this msg corresponds to one we sent
					var inResponseTo = response.$.InResponseTo;
					if (Meteor.settings.debug) {
						console.log('In Response to: ' + inResponseTo);
					}
					var status = self.getElement(response, 'Status');
					var statusCode = self.getElement(status[0], 'StatusCode')[0].$.Value;
					if (Meteor.settings.debug) {
						console.log('StatusCode: ' + JSON.stringify(statusCode));
					}
					if (statusCode === 'urn:oasis:names:tc:SAML:2.0:status:Success') {
						// In case of a successful logout at IDP we return inResponseTo value.
						// This is the only way how we can identify the Meteor user (as we don't use Session Cookies)
						callback(null, inResponseTo);
					} else {
						callback('Error. Logout not confirmed by IDP', null);
					}
				} else {
					callback('No Response Found', null);
				}
			});
		}

	});
};

SAML.prototype.validateResponse = function(samlResponse, relayState, callback) {
	var self = this;
	var xml = new Buffer(samlResponse, 'base64').toString('ascii');
	// We currently use RelayState to save SAML provider
	if (Meteor.settings.debug) {
		console.log('Validating response with relay state: ' + xml);
	}
	var parser = new xml2js.Parser({
		explicitRoot: true
	});

	parser.parseString(xml, function(err, doc) {
		// Verify signature
		if (Meteor.settings.debug) {
			console.log('Verify signature');
		}
		if (self.options.cert && !self.validateSignature(xml, self.options.cert)) {
			if (Meteor.settings.debug) {
				console.log('Signature WRONG');
			}
			return callback(new Error('Invalid signature'), null, false);
		}
		if (Meteor.settings.debug) {
			console.log('Signature OK');
		}
		var response = self.getElement(doc, 'Response');
		if (Meteor.settings.debug) {
			console.log('Got response');
		}
		if (response) {
			var assertion = self.getElement(response, 'Assertion');
			if (!assertion) {
				return callback(new Error('Missing SAML assertion'), null, false);
			}

			var profile = {};

			if (response.$ && response.$.InResponseTo) {
				profile.inResponseToId = response.$.InResponseTo;
			}

			var issuer = self.getElement(assertion[0], 'Issuer');
			if (issuer) {
				profile.issuer = issuer[0]._;
			}

			var subject = self.getElement(assertion[0], 'Subject');

			if (subject) {
				var nameID = self.getElement(subject[0], 'NameID');
				if (nameID) {
					profile.nameID = nameID[0]._;

					if (nameID[0].$.Format) {
						profile.nameIDFormat = nameID[0].$.Format;
					}
				}
			}

			var authnStatement = self.getElement(assertion[0], 'AuthnStatement');

			if (authnStatement) {
				if (authnStatement[0].$.SessionIndex) {

					profile.sessionIndex = authnStatement[0].$.SessionIndex;
					if (Meteor.settings.debug) {
						console.log('Session Index: ' + profile.sessionIndex);
					}
				} else if (Meteor.settings.debug) {
					console.log('No Session Index Found');
				}


			} else if (Meteor.settings.debug) {
				console.log('No AuthN Statement found');
			}

			var attributeStatement = self.getElement(assertion[0], 'AttributeStatement');
			if (attributeStatement) {
				var attributes = self.getElement(attributeStatement[0], 'Attribute');

				if (attributes) {
					attributes.forEach(function(attribute) {
						var value = self.getElement(attribute, 'AttributeValue');
						if (typeof value[0] === 'string') {
							profile[attribute.$.Name] = value[0];
						} else {
							profile[attribute.$.Name] = value[0]._;
						}
					});
				}

				if (!profile.mail && profile['urn:oid:0.9.2342.19200300.100.1.3']) {
					// See http://www.incommonfederation.org/attributesummary.html for definition of attribute OIDs
					profile.mail = profile['urn:oid:0.9.2342.19200300.100.1.3'];
				}

				if (!profile.email && profile.mail) {
					profile.email = profile.mail;
				}
			}

			if (!profile.email && profile.nameID && profile.nameIDFormat && profile.nameIDFormat.indexOf('emailAddress') >= 0) {
				profile.email = profile.nameID;
			}
			if (Meteor.settings.debug) {
				console.log('NameID: ' + JSON.stringify(profile));
			}

			callback(null, profile, false);
		} else {
			var logoutResponse = self.getElement(doc, 'LogoutResponse');

			if (logoutResponse) {
				callback(null, null, true);
			} else {
				return callback(new Error('Unknown SAML response message'), null, false);
			}

		}
	});
};

var decryptionCert;
SAML.prototype.generateServiceProviderMetadata = function(callbackUrl) {

	var keyDescriptor = null;

	if (!decryptionCert) {
		decryptionCert = this.options.privateCert;
	}

	if (this.options.privateKey) {
		if (!decryptionCert) {
			throw new Error(
				'Missing decryptionCert while generating metadata for decrypting service provider');
		}

		decryptionCert = decryptionCert.replace(/-+BEGIN CERTIFICATE-+\r?\n?/, '');
		decryptionCert = decryptionCert.replace(/-+END CERTIFICATE-+\r?\n?/, '');
		decryptionCert = decryptionCert.replace(/\r\n/g, '\n');

		keyDescriptor = {
			'ds:KeyInfo': {
				'ds:X509Data': {
					'ds:X509Certificate': {
						'#text': decryptionCert
					}
				}
			},
			'#list': [
				// this should be the set that the xmlenc library supports
				{
					'EncryptionMethod': {
						'@Algorithm': 'http://www.w3.org/2001/04/xmlenc#aes256-cbc'
					}
				},
				{
					'EncryptionMethod': {
						'@Algorithm': 'http://www.w3.org/2001/04/xmlenc#aes128-cbc'
					}
				},
				{
					'EncryptionMethod': {
						'@Algorithm': 'http://www.w3.org/2001/04/xmlenc#tripledes-cbc'
					}
				}
			]
		};
	}

	if (!this.options.callbackUrl && !callbackUrl) {
		throw new Error(
			'Unable to generate service provider metadata when callbackUrl option is not set');
	}

	var metadata = {
		'EntityDescriptor': {
			'@xmlns': 'urn:oasis:names:tc:SAML:2.0:metadata',
			'@xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
			'@entityID': this.options.issuer,
			'SPSSODescriptor': {
				'@protocolSupportEnumeration': 'urn:oasis:names:tc:SAML:2.0:protocol',
				'KeyDescriptor': keyDescriptor,
				'SingleLogoutService': {
					'@Binding': 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect',
					'@Location': Meteor.absoluteUrl() + '_saml/logout/' + this.options.provider + '/',
					'@ResponseLocation': Meteor.absoluteUrl() + '_saml/logout/' + this.options.provider + '/'
				},
				'NameIDFormat': this.options.identifierFormat,
				'AssertionConsumerService': {
					'@index': '1',
					'@isDefault': 'true',
					'@Binding': 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',
					'@Location': callbackUrl
				}
			}
		}
	};

	return xmlbuilder.create(metadata).end({
		pretty: true,
		indent: '  ',
		newline: '\n'
	});
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/steffo_meteor-accounts-saml/saml_rocketchat.coffee.js                                                 //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var logger, timer, updateServices;                                                                                // 1
                                                                                                                  //
logger = new Logger('steffo:meteor-accounts-saml', {                                                              // 1
  methods: {                                                                                                      //
    updated: {                                                                                                    //
      type: 'info'                                                                                                //
    }                                                                                                             //
  }                                                                                                               //
});                                                                                                               //
                                                                                                                  //
RocketChat.settings.addGroup('SAML');                                                                             // 6
                                                                                                                  //
Meteor.methods({                                                                                                  // 7
  addSamlService: function(name) {                                                                                //
    RocketChat.settings.add("SAML_Custom_" + name, false, {                                                       //
      type: 'boolean',                                                                                            //
      group: 'SAML',                                                                                              //
      section: name,                                                                                              //
      i18nLabel: 'Accounts_OAuth_Custom_Enable'                                                                   //
    });                                                                                                           //
    RocketChat.settings.add("SAML_Custom_" + name + "_provider", 'openidp', {                                     //
      type: 'string',                                                                                             //
      group: 'SAML',                                                                                              //
      section: name,                                                                                              //
      i18nLabel: 'SAML_Custom_Provider'                                                                           //
    });                                                                                                           //
    RocketChat.settings.add("SAML_Custom_" + name + "_entry_point", 'https://openidp.feide.no/simplesaml/saml2/idp/SSOService.php', {
      type: 'string',                                                                                             //
      group: 'SAML',                                                                                              //
      section: name,                                                                                              //
      i18nLabel: 'SAML_Custom_Entry_point'                                                                        //
    });                                                                                                           //
    RocketChat.settings.add("SAML_Custom_" + name + "_issuer", 'https://rocket.chat/', {                          //
      type: 'string',                                                                                             //
      group: 'SAML',                                                                                              //
      section: name,                                                                                              //
      i18nLabel: 'SAML_Custom_Issuer'                                                                             //
    });                                                                                                           //
    RocketChat.settings.add("SAML_Custom_" + name + "_cert", '', {                                                //
      type: 'string',                                                                                             //
      group: 'SAML',                                                                                              //
      section: name,                                                                                              //
      i18nLabel: 'SAML_Custom_Cert'                                                                               //
    });                                                                                                           //
    RocketChat.settings.add("SAML_Custom_" + name + "_button_label_text", '', {                                   //
      type: 'string',                                                                                             //
      group: 'SAML',                                                                                              //
      section: name,                                                                                              //
      i18nLabel: 'Accounts_OAuth_Custom_Button_Label_Text'                                                        //
    });                                                                                                           //
    RocketChat.settings.add("SAML_Custom_" + name + "_button_label_color", '#FFFFFF', {                           //
      type: 'string',                                                                                             //
      group: 'SAML',                                                                                              //
      section: name,                                                                                              //
      i18nLabel: 'Accounts_OAuth_Custom_Button_Label_Color'                                                       //
    });                                                                                                           //
    RocketChat.settings.add("SAML_Custom_" + name + "_button_color", '#13679A', {                                 //
      type: 'string',                                                                                             //
      group: 'SAML',                                                                                              //
      section: name,                                                                                              //
      i18nLabel: 'Accounts_OAuth_Custom_Button_Color'                                                             //
    });                                                                                                           //
    return RocketChat.settings.add("SAML_Custom_" + name + "_generate_username", false, {                         //
      type: 'boolean',                                                                                            //
      group: 'SAML',                                                                                              //
      section: name,                                                                                              //
      i18nLabel: 'SAML_Custom_Generate_Username'                                                                  //
    });                                                                                                           //
  }                                                                                                               //
});                                                                                                               //
                                                                                                                  //
timer = void 0;                                                                                                   // 19
                                                                                                                  //
updateServices = function() {                                                                                     // 20
  if (timer != null) {                                                                                            //
    Meteor.clearTimeout(timer);                                                                                   //
  }                                                                                                               //
  return timer = Meteor.setTimeout(function() {                                                                   //
    var data, i, len, results, service, serviceName, services;                                                    // 24
    services = RocketChat.settings.get(/^(SAML_Custom_)[a-z]+$/i);                                                //
    Accounts.saml.settings.providers = [];                                                                        //
    results = [];                                                                                                 // 28
    for (i = 0, len = services.length; i < len; i++) {                                                            //
      service = services[i];                                                                                      //
      logger.updated(service.key);                                                                                //
      serviceName = 'saml';                                                                                       //
      if (service.value === true) {                                                                               //
        data = {                                                                                                  //
          buttonLabelText: RocketChat.settings.get(service.key + "_button_label_text"),                           //
          buttonLabelColor: RocketChat.settings.get(service.key + "_button_label_color"),                         //
          buttonColor: RocketChat.settings.get(service.key + "_button_color"),                                    //
          clientConfig: {                                                                                         //
            provider: RocketChat.settings.get(service.key + "_provider")                                          //
          }                                                                                                       //
        };                                                                                                        //
        Accounts.saml.settings.generateUsername = RocketChat.settings.get(service.key + "_generate_username");    //
        Accounts.saml.settings.providers.push({                                                                   //
          provider: data.clientConfig.provider,                                                                   //
          entryPoint: RocketChat.settings.get(service.key + "_entry_point"),                                      //
          issuer: RocketChat.settings.get(service.key + "_issuer"),                                               //
          cert: RocketChat.settings.get(service.key + "_cert")                                                    //
        });                                                                                                       //
        results.push(ServiceConfiguration.configurations.upsert({                                                 //
          service: serviceName.toLowerCase()                                                                      //
        }, {                                                                                                      //
          $set: data                                                                                              //
        }));                                                                                                      //
      } else {                                                                                                    //
        results.push(ServiceConfiguration.configurations.remove({                                                 //
          service: serviceName.toLowerCase()                                                                      //
        }));                                                                                                      //
      }                                                                                                           //
    }                                                                                                             // 28
    return results;                                                                                               //
  }, 2000);                                                                                                       //
};                                                                                                                // 20
                                                                                                                  //
RocketChat.settings.get(/^SAML_.+/, function(key, value) {                                                        // 54
  return updateServices();                                                                                        //
});                                                                                                               // 54
                                                                                                                  //
Meteor.startup(function() {                                                                                       // 57
  var ref;                                                                                                        // 58
  if (((ref = RocketChat.settings.get(/^(SAML_Custom)_[a-z]+$/i)) != null ? ref.length : void 0) === 0) {         //
    return Meteor.call('addSamlService', 'Default');                                                              //
  }                                                                                                               //
});                                                                                                               // 57
                                                                                                                  //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['steffo:meteor-accounts-saml'] = {};

})();

//# sourceMappingURL=steffo_meteor-accounts-saml.js.map
