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
			output = '';
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

// function to search for users
GithubSearcher.prototype.queryUsers = function(params, callback) {

	if (typeof callback !== 'function') {
		throw new Error('Callback is not a function!');
	}

	if (_.isEmpty(params) || params === null) {
		throw new Error('Parameters are invalid!');
	}

	var url = this.endpoints.base + this.endpoints.usersUrl + '?';

	if (typeof params === 'string') {
		url += 'q=' + params;

	} else if (typeof params === 'object') {
		url += 'q=';
		if (typeof params['term'] !== 'undefined') {
			url += params['term'];
		}

		for (var k in params) {
			if (k === 'repos' || k === 'followers') {
				url += '+' + k + ':' + convertSign(params[k][0]) + params[k].substring(1, params[k].length);
			} else if (k !== 'term') {
				url += 	'+' + k + ':' + params[k];
			}
		}
	}

	console.log(url);
	var options = {
		url: url,
		headers: {
			'User-Agent': this.auth.username
		}
	};

	request(options, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			callback(JSON.parse(body));
		}
	});

	return this;
};

module.exports = GithubSearcher;