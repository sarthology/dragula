'use strict';

const request = require('request-promise-native');
const Store = require('electron-store');
const os = require('os');

const store = new Store();

const subscribe = (email) => {
	return request.post('http://139.59.83.253/dragula/users/subscribe', {
		form: {
			unique: email,
			platform: os.platform(),
			network: os.networkInterfaces()
		}
	});
};

const updateUser = (uid, status) => {
	return request.patch('http://139.59.83.253/dragula/users/updateUser/' + uid, {
		form: {
			active: status,
			platform: os.platform(),
			network: os.networkInterfaces(),
			dragCount: store.get('dragCount'),
			loadCount: store.get('reloads')
		}
	});
};

module.exports = {
	subscribe,
	updateUser
};