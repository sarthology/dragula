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

document.getElementById('reload').onclick = (event) =>{
	event.preventDefault();
	if(document.getElementById('keyword').value){
		unsplash.fetchFromKeyword(document.getElementById('keyword').value).then((url)=>{
			document.getElementById('drag').setAttribute('src',url);
		});
	}
	else{
		unsplash.fetchRandom().then((url)=>{
			document.getElementById('drag').setAttribute('src',url);
		});
	}
};

document.getElementById('minimize').onclick = (event) =>{
	event.preventDefault();
	document.getElementsByClassName('main')[0].style = 'display:none';
	document.getElementById('enter').style = 'display:block';
	ipcRenderer.send('close');
};
document.getElementById('download').onclick = (event) =>{
	event.preventDefault();
	ipcRenderer.send('download',{
		'url': document.getElementById('drag').getAttribute('src')
	});
};

let getDataUrl = function (img) {
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	
	canvas.width = img.naturalWidth;
	canvas.height = img.naturalHeight;
	ctx.drawImage(img, 0, 0);

	return canvas.toDataURL();
};