// index.js

// Include module dependencies
var request = require('request'),
	_ = require('underscore');

// converts the sign to it's hex code
function convertSign(sign) {
	var output;

	switch (sign) {
		case '<':
			output = '%3C';
			break;

		case '=':
			output = '%3D';
			break;

		case '>':
			output = '%3E';
			break;

		default:
			output = sign;
			break;
	}

	return output;
};

// Create a class
function GithubSearcher(options) {
	if (!(this instanceof GithubSearcher)) {
		return new GithubSearcher(options);
	}

	if (_.isEmpty(options)) {
		throw new Error('Please pass in your username and password!');
	}

	this.auth = {
		username: options['username'],
		password: options['password']
	};

	this.endpoints = {
		base: 'https://api.github.com',
		usersUrl: '/search/users',
		reposUrl: '/search/repositories',
		issueUrl: '/search/issues',
		codeUrl: '/search/code'
	};
}

// method to search for users
GithubSearcher.prototype.queryUsers = function(params, callback) {

	// throw error if the callback is not a function
	if (typeof callback !== 'function') {
		throw new Error('Callback is not a function!');
	}

	// ensure that some parameters are passed into the method
	if (_.isEmpty(params) || params === null) {
		throw new Error('Parameters are invalid!');
	}

	// create the base of the url
	var url = this.endpoints.base + this.endpoints.usersUrl + '?q=';

	// check type of argument entered
	// if a query string, just concatenate the string directly to the url
	if (typeof params === 'string') {
		url += params;

	// if an object, then create the url string by iterating through the object
	} else if (typeof params === 'object') {

		// add the term part first, since it is added differently
		if (typeof params['term'] !== 'undefined') {
			url += params['term'];
		}

		// go through members of the JSON object passed into the method
		for (var k in params) {
			if (k === 'repos' || k === 'followers') {
				// repos and followers allows user to pass in comparison operators >, <, =
				url += '+' + k + ':' + convertSign(params[k][0]) + params[k].substring(1, params[k].length);
			} else if (k !== 'term' && k !== 'page') {
				// term and page are handled separately/ differently 
				url += 	'+' + k + ':' + params[k];
			}
		}

		// add the page number to the end of the query, if a page is specified
		if (typeof params['page'] !== 'undefined') {
			url += '&page=' + params['page'];
		}
	}

	// Print the url we are pinging
	console.log('Querying at endpoint: ' + url);

	// Create a JSON object to define API url and request headers
	var options = {
		url: url,
		headers: {
			'User-Agent': this.auth.username,
			'Authorization': 'Basic ' + new Buffer(this.auth.username + ':' + this.auth.password).toString('base64')
		}
	};

	// Use the request module to ping the url
	request.get(options, function(error, response, body) {
		console.log(body)
		if (!error && response.statusCode === 200) {
			// pass our result to the callback
			callback(JSON.parse(body));
		}
	});

	// return this instance of GithubSearcher
	return this;
};

module.exports = GithubSearcher;