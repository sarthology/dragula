'use strict';

const request = require('request-promise-native');

const subscribe = (email) => {
	return request.post('http://139.59.83.253/dragula/users/subscribe', {
		form: {
			unique: email
		}
	});
};

const updateUser = (uid, status) => {
	return request.patch('http://139.59.83.253/dragula/users/updateUser/' + uid, {
		form: {
			active: status
		}
	});
};

module.exports = {
	subscribe,
	updateUser
};