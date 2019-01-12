const { ipcRenderer } = require('electron');

document.getElementById('drag').ondragstart = (event) => {
	event.preventDefault();
	ipcRenderer.send('ondragstart', getDataUrl(event.currentTarget));
};

let getDataUrl = function (img) {
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
  
	canvas.width = img.width;
	canvas.height = img.height;
	ctx.drawImage(img, 0, 0);
  
	// If the image is not png, the format
	// must be specified here
    
	return canvas.toDataURL();
};