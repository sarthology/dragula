const { ipcRenderer } = require('electron');
const unsplash = require('./util/unsplash');


document.getElementById('drag').ondragstart = (event) => {
	event.preventDefault();
	if(document.getElementsByClassName('image-original')[0]){
		ipcRenderer.send('ondragstart', getDataUrl(event.currentTarget));
	}
	else{
		ipcRenderer.send('ondragstart', getOriginalDataUrl(event.currentTarget));
	}
};

document.getElementById('enter').onclick = (event) => {
	event.preventDefault();

	unsplash.fetchRandom().then((url) => {
		document.getElementById('drag').setAttribute('src',url);
		// checkOrientation(document.getElementById('drag'));
	});
	getDataUrl;
	document.getElementsByClassName('main')[0].style = 'display:inline-flex;';
	document.getElementById('enter').style = 'display:none';

	ipcRenderer.send('open');
};

document.getElementById('keyword').onkeydown = (event) => {
	if (event.keyCode === 13) {
		unsplash.fetchFromKeyword(event.currentTarget.value).then((url) => {
			document.getElementById('drag').setAttribute('src', url);
			// checkOrientation(document.getElementById('drag'));
		});
	}
};

document.getElementById('reload').onclick = (event) => {
	event.preventDefault();
	if (document.getElementById('keyword').value) {
		unsplash.fetchFromKeyword(document.getElementById('keyword').value).then((url) => {
			document.getElementById('drag').setAttribute('src', url);
			// checkOrientation(document.getElementById('drag'));
		});
	} else {
		unsplash.fetchRandom().then((url) => {
			document.getElementById('drag').setAttribute('src', url);
			// checkOrientation(document.getElementById('drag'));
		});
	}
};

document.getElementById('minimize').onclick = (event) => {
	event.preventDefault();
	document.getElementsByClassName('main')[0].style = 'display:none';
	document.getElementById('enter').style = 'display:block';
	ipcRenderer.send('close');
};

document.getElementById('download').onclick = (event) => {
	event.preventDefault();
	ipcRenderer.send('download', {
		'url': document.getElementById('drag').getAttribute('src')
	});
};

document.getElementById('markdown').onclick = (event) => {
	event.preventDefault();
	ipcRenderer.send('markdown', {
		'url': document.getElementById('drag').getAttribute('src')
	});
};

document.getElementById('original').onclick = (event) => {
	event.preventDefault();
	document.getElementById('drag').classList.toggle('image-original');
	document.getElementById('drag').classList.toggle('image-canvas');
};

let getDataUrl = (img) => {
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');


	canvas.width = img.naturalWidth;
	canvas.height = img.naturalHeight;
	ctx.drawImage(img, 0, 0);

	return canvas.toDataURL();
};
let getOriginalDataUrl = (img) => {
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	var xStart = 0,
		yStart = 0,
		aspectRadio,
		newWidth,
		newHeight;

	canvas.width = 2400;
	canvas.height = 1600;
	aspectRadio = img.naturalHeight / img.naturalWidth;
	if (img.naturalHeight < img.naturalWidth) {
		//horizontal
		aspectRadio = img.naturalWidth / img.naturalHeight;
		newHeight = 1600,
		newWidth = aspectRadio * 1600;
		xStart = -(newWidth - 2400) / 2;
	} 
	else {
		newWidth = 2400,
		newHeight = aspectRadio * 2400;
		yStart = -(newHeight - 1600) / 2;
	}
	ctx.drawImage(img, xStart, yStart, newWidth, newHeight);

	return canvas.toDataURL();
};
// let checkOrientation = (img)=>{	
// 	if(img.naturalHeight > img.naturalWidth){
// 		document.querySelector('#original p').setAttribute('style','display:block');
// 	}
// 	else{
// 		document.querySelector('#original p').setAttribute('style','display:none');
// 	}
// };