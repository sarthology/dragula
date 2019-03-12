'use strict';

// Dependencies
const electron = require('electron');
const { app, BrowserWindow, ipcMain, nativeImage, clipboard } = require('electron');
const { download } = require('electron-dl');
var Positioner = require('electron-positioner');

// Native imports
const fs = require('fs');

// Global Variables
let win,display, width, height, positioner;

//Function to create app window
function createWindow() {
	// Create the browser window.
	win = new BrowserWindow({
		width: 100,
		height: 50,
		movable: false,
		resizable: false,
		frame: false,
		autoHideMenuBar: true,
		alwaysOnTop: true
	});
	positioner = new Positioner(win);
	positioner.move('bottomRight');
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
	});
});

// Function to handle native download
ipcMain.on('download', (event,args) => {
	download(BrowserWindow.getFocusedWindow(),args.url);
});

// Function to copy markdown code to clipboard
ipcMain.on('markdown', (event,args) => {
	clipboard.writeText('![alt data]('+ args.url+')');
});

// Function to resize window when main window opens
ipcMain.on('open', () => {
	win.setBounds({
		width: 300,
		height: 200,
	});
	positioner.move('bottomRight');
});

// Function to resize window when main window closes
ipcMain.on('close', () => {
	win.setBounds({
		width: 100,
		height: 50,
	});
	positioner.move('bottomRight');
});

// App ready event
app.on('ready', createWindow);