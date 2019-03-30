'use strict';

// Dependencies
const { app, BrowserWindow, ipcMain, nativeImage, clipboard, dialog } = require('electron');
const { download } = require('electron-dl');
const {autoUpdater} = require('electron-updater');
var Positioner = require('electron-positioner');
const Store = require('electron-store');
const macaddress = require('macaddress');

// Native imports
const fs = require('fs');
const store = new Store();

// Global Variables
let win, positioner;

//Function to create app window
function createWindow() {
	// Create the browser window.
	win = new BrowserWindow({
		width: 500,
		height: 400,
		movable: false,
		resizable: false,
		frame: false,
		autoHideMenuBar: true,
		alwaysOnTop: true
	});
	positioner = new Positioner(win);
	positioner.move('center');
	// and load the index.html of the app.
	win.loadFile('app/index.html');
}

// Function to handle native drag and drop
ipcMain.on('ondragstart', (event, filePath) => {
	let file = nativeImage.createFromDataURL(filePath);
	fs.writeFile(app.getPath('temp')+'/image.png', file.toPNG(), (err) => {
		if(err) console.log(err);
		event.sender.startDrag({
			file: app.getPath('temp')+'/image.png',
			icon: file
		});
		store.set('settings.dragCount',store.get('settings.dragCount')+1);
		if(store.get('settings.dragCount')%1 == 0){
			event.sender.send('checkDrag');
			win.setBounds({
				width: 550,
				height: 450
			});
			positioner.move('center');
		}
	});
});

// Function to handle native download
ipcMain.on('download', (event,args) => {
	download(BrowserWindow.getFocusedWindow(),args.url);
});

// Function to copy markdown code to clipboard
ipcMain.on('link', (event,args) => {
	if(store.get('settings.link')==='normal'){
		clipboard.writeText(args.url);
	}
	else{
		clipboard.writeText('![alt data]('+ args.url+')');
	}
});

// Function to resize window when main window opens
ipcMain.on('open', () => {
	win.setBounds({
		width: 300,
		height: 200,
	});
	setPosition();
});

// Function to resize window when main window closes
ipcMain.on('close', () => {
	win.setBounds({
		width: 100,
		height: 50,
	});
	setPosition();
});

ipcMain.on('setting', () => {
	win.setBounds({
		width: 500,
		height: 400
	});
	positioner.move('center');
});

let setPosition = ()=>{
	if(store.get('settings.position')){
		positioner.move(store.get('settings.position'));		
	}
	else{
		positioner.move('bottomRight');		
	}
};

// App ready event
app.on('ready', function () {
	createWindow();
	autoUpdater.checkForUpdates();

	macaddress.one(function (err, mac) {
		console.log(mac);
	});
});

// eslint-disable-next-line no-unused-vars
ipcMain.on('app_quit', (event, info) => {
	app.quit();
});

autoUpdater.on('update-available', () => {
	dialog.showMessageBox({
		type: 'info',
		title: 'Found Updates',
		message: 'Found updates, do you want update now?',
		buttons: ['Sure', 'No']
	}, (buttonIndex) => {
		if (buttonIndex === 0) {
			autoUpdater.downloadUpdate();
		}
	});
});
  
autoUpdater.on('update-downloaded', () => {
	dialog.showMessageBox({
		title: 'Install Updates',
		message: 'Updates downloaded, application will be quit for update...'
	}, () => {
		setImmediate(() => autoUpdater.quitAndInstall());
	});
});