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
		// checkOrientation(document.getElementById('drag'));
	});

	document.getElementsByClassName('main')[0].style = 'display:inline-flex;';
	document.getElementById('enter').style = 'display:none';
	
	ipcRenderer.send('open');
};

document.getElementById('keyword').onkeydown = (event) =>{
	if(event.keyCode === 13){
		unsplash.fetchFromKeyword(event.currentTarget.value).then((url)=>{
			document.getElementById('drag').setAttribute('src',url);
			// checkOrientation(document.getElementById('drag'));
		});
	}
};

document.getElementById('reload').onclick = (event) =>{
	event.preventDefault();
	if(document.getElementById('keyword').value){
		unsplash.fetchFromKeyword(document.getElementById('keyword').value).then((url)=>{
			document.getElementById('drag').setAttribute('src',url);
			// checkOrientation(document.getElementById('drag'));
		});
	}
	else{
		unsplash.fetchRandom().then((url)=>{
			document.getElementById('drag').setAttribute('src',url);
			// checkOrientation(document.getElementById('drag'));
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

document.getElementById('markdown').onclick = (event) =>{
	event.preventDefault();
	ipcRenderer.send('markdown',{
		'url': document.getElementById('drag').getAttribute('src')
	});
};

document.getElementById('original').onclick = (event) =>{
	event.preventDefault();
	document.getElementById('drag').classList.toggle('image-original');
	document.getElementById('drag').classList.toggle('image-canvas');
};

let getDataUrl = (img)=> {
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	
	canvas.width = img.naturalWidth;
	canvas.height = img.naturalHeight;
	ctx.drawImage(img, 0, 0);

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