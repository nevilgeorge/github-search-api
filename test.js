// test.js

var GithubSearcher = require('./index.js');

var github = new GithubSearcher({username: 'nevilgeorge', password: 'george'});
var params = {
	'term': 'nevilgeorge',
	'in': 'login'
};
github.queryUsers(params, function(data) {
	console.log(data);
});


// -------- //


// var request = require('request');

// var options = {
// 	url: 'https://api.github.com/search/users?q=nevilgeorge+in:login',
// 	headers: {
// 		'User-Agent': 'nevilgeorge'
// 	}
// };

// request.get(options, function(error, response, body) {
// 	if (!error && response.statusCode === 200) {
// 		return callback(JSON.parse(body));
// 	}
// });