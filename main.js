'use strict';

// Dependencies
const electron = require('electron');
const { app, BrowserWindow, ipcMain, nativeImage, clipboard } = require('electron');
const { download } = require('electron-dl');

// Native imports
const fs = require('fs');
const path = require('path');

// Global Variables
let win;
let display, width, height;

//Function to create app window
function createWindow() {
	display = electron.screen.getPrimaryDisplay();
	width = display.bounds.width;
	height = display.bounds.height;
	// Create the browser window.
	win = new BrowserWindow({
		width: 100,
		height: 50,
		movable: false,
		resizable: false,
		x: width - 20,
		y: height - 20,
		frame: false,
		autoHideMenuBar: true,
		alwaysOnTop: true
	});

	// and load the index.html of the app.
	win.loadFile('app/index.html');
}

// Function to handle native drag and drop
ipcMain.on('ondragstart', (event, filePath) => {
	let file = nativeImage.createFromDataURL(filePath);

	fs.writeFile('image.png', file.toPNG(), () => {
		event.sender.startDrag({
			file: path.join(__dirname + '/image.png'),
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
		x: width - 310,
		y: height - 280,
	}, true);
});

// Function to resize window when main window closes
ipcMain.on('close', () => {
	win.setBounds({
		width: 100,
		height: 50,
		x: width - 110,
		y: height - 130
	}, true);
});

// App ready event
app.on('ready', createWindow);