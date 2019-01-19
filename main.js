const electron = require('electron');
const { app, BrowserWindow, ipcMain, nativeImage, clipboard } = require('electron');
const fs = require('fs');
const path = require('path');
const { download } = require('electron-dl');

let win;
let display, width, height;

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

ipcMain.on('ondragstart', (event, filePath) => {
	let file = nativeImage.createFromDataURL(filePath);

	fs.writeFile('image.png', file.toPNG(), () => {
		event.sender.startDrag({
			file: path.join(__dirname + '/image.png'),
			icon: file
		});
	});
});
ipcMain.on('open', () => {
	win.setBounds({
		width: 300,
		height: 200,
		x: width - 310,
		y: height - 280,
	}, true);
});
ipcMain.on('close', () => {
	win.setBounds({
		width: 100,
		height: 50,
		x: width - 110,
		y: height - 130
	}, true);
});
ipcMain.on('download', (event,args) => {
	download(BrowserWindow.getFocusedWindow(),args.url);
});
ipcMain.on('markdown', (event,args) => {
	clipboard.writeText('![alt data]('+ args.url+')');
});

app.on('ready', createWindow);