'use strict';

const request = require('request-promise-native');
const Store = require('electron-store');
const os = require('os');

const pJSON = require('../../package.json');

const store = new Store();

const subscribe = (email, mac) => {
	return request.post('https://tmxnx.com/dragula/users/subscribe', {
		form: {
			email: email,
			macAddress: mac,
			platform: os.platform(),
			version: pJSON.version
		}
	});
};

const updateUser = (uid, status) => {
	return request.patch('https://tmxnx.com/dragula/users/updateUser/' + uid, {
		form: {
			active: status,
			platform: os.platform(),
			dragCount: store.get('settings.dragCount'),
			loadCount: store.get('settings.reloads'),
			version: pJSON.version
		}
	});
};

module.exports = {
	subscribe,
	updateUser
};