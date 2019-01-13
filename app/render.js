const { ipcRenderer } = require('electron');
const fetchRandom = require('./util/unsplash');

document.getElementById('drag').ondragstart = (event) => {
	event.preventDefault();
	ipcRenderer.send('ondragstart', getDataUrl(event.currentTarget));
};

document.getElementsByTagName('button')[0].onclick = (event) => {
	event.preventDefault();
	fetchRandom().then((url)=>{
		document.getElementById('drag').setAttribute('src',url);
	});
	document.getElementById('drag').style = 'display:block';
	ipcRenderer.send('open');
};
let getDataUrl = function (img) {
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	
	canvas.width = img.naturalWidth;
	canvas.height = img.naturalHeight;
	ctx.drawImage(img, 0, 0);

	return canvas.toDataURL();
};