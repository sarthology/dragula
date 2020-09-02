'use strict';

const request = require('request');
const Store = require('electron-store');
const os = require('os');

const pJSON = require('../../package.json');

const store = new Store();

const subscribe = (email, mac) => {
	request.post('https://api.mxnx.com/api/dragula/subscribe', {
		json: {
			email: email,
			macAddress: mac,
			platform: os.platform(),
			version: pJSON.version
		}
	}, (err, res)=>{
		if(err)
			return err;
		return res.body;
	});
};

const updateUser = (uid, status) => {
	return request.patch('https://api.tmxnx.com/dragula/update/' + uid, {
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
