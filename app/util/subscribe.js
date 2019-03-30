'use strict';

const request = require('request-promise-native');
const Store = require('electron-store');
const os = require('os');

const store = new Store();

const subscribe = (email) => {
	return request.post('http://tmxnx.com/dragula/users/subscribe', {
		form: {
			unique: email,
			platform: os.platform(),
			network: os.networkInterfaces()
		}
	});
};

const updateUser = (uid, status) => {
	return request.patch('http://tmxnx.com/dragula/users/updateUser/' + uid, {
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