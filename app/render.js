const {
	ipcRenderer
} = require('electron');

document.getElementById('drag').ondragstart = (event) => {
	event.preventDefault();
	ipcRenderer.send('ondragstart', getDataUrl(event.currentTarget));
};

document.getElementsByTagName('button')[0].onclick = (event) => {
	event.preventDefault();
	document.getElementById('drag').style = 'display:block';
	ipcRenderer.send('open');
};
let getDataUrl = function (img) {
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');

	canvas.width = img.width;
	canvas.height = img.height;
	ctx.drawImage(img, 0, 0);

	return canvas.toDataURL();
};