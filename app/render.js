const { ipcRenderer } = require('electron');
const unsplash = require('./util/unsplash');

document.getElementById('drag').ondragstart = (event) => {
	event.preventDefault();
	ipcRenderer.send('ondragstart', getDataUrl(event.currentTarget));
};

document.getElementById('enter').onclick = (event) => {
	event.preventDefault();

	unsplash.fetchRandom().then((url)=>{
		document.getElementById('drag').setAttribute('src',url);
	});

	document.getElementsByClassName('main')[0].style = 'display:block';
	document.getElementById('enter').style = 'display:none';
	
	ipcRenderer.send('open');
};

document.getElementById('keyword').onkeydown = (event) =>{
	if(event.keyCode === 13){
		unsplash.fetchFromKeyword(event.currentTarget.value).then((url)=>{
			document.getElementById('drag').setAttribute('src',url);
		});
	}
};

let getDataUrl = function (img) {
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	
	canvas.width = img.naturalWidth;
	canvas.height = img.naturalHeight;
	ctx.drawImage(img, 0, 0);

	return canvas.toDataURL();
};