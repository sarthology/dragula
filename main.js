const { app, BrowserWindow, ipcMain, nativeImage } = require('electron');
const fs = require('fs');
const path = require('path');

let win;

function createWindow () {
	// Create the browser window.
	win = new BrowserWindow({ 
		width: 800, 
		height: 600,
		alwaysOnTop:true
	});

	// and load the index.html of the app.
	win.loadFile('app/index.html');
}

ipcMain.on('ondragstart', (event, filePath) => {
	let file = nativeImage.createFromDataURL(filePath);	

	fs.writeFile('image.png', file.toPNG(), function (err) {
		throw err;
	});

	event.sender.startDrag({
		file:path.join(__dirname+'/image.png'),
		icon:file
	});
});
app.on('ready', createWindow);