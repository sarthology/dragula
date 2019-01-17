const { ipcRenderer } = require('electron');
const unsplash = require('./util/unsplash');
const canvas = require('./util/canvas');

//Variables for Dom references
const enter = document.getElementById('enter');
const reload = document.getElementById('reload');
const keyword = document.getElementById('keyword');
const drag = document.getElementById('drag');
const minimize = document.getElementById('minimize');
const download = document.getElementById('download');
const markdown = document.getElementById('markdown');
const original = document.getElementById('original');
const alert = document.getElementById('alert');
const main = document.getElementById('main');



// Events to load image
enter.onclick = (event) => {
	event.preventDefault();

	if(!drag.getAttribute('src')){
		loadImage();
	}

	main.style = 'display:inline-flex;';
	enter.style = 'display:none';

	ipcRenderer.send('open');
};
reload.onclick = (event) => {
	event.preventDefault();

	loadImage(keyword.value);
};
keyword.onkeydown = (event) => {
	if (event.keyCode === 13) {
		loadImage(event.currentTarget.value);
	}
};

// Events for toolbar actions
minimize.onclick = (event) => {
	event.preventDefault();
	main.style = 'display:none';
	enter.style = 'display:block';
	ipcRenderer.send('close');
};

download.onclick = (event) => {
	event.preventDefault();
	ipcRenderer.send('download', {
		'url': drag.getAttribute('src')
	});
};

markdown.onclick = (event) => {
	event.preventDefault();
	ipcRenderer.send('markdown', {
		'url': drag.getAttribute('src')
	});
};

original.onclick = (event) => {
	event.preventDefault();
	drag.classList.toggle('image-original');
	drag.classList.toggle('image-canvas');
};

// Other events
drag.ondragstart = (event) => {
	event.preventDefault();
	if(document.getElementsByClassName('image-original')[0]){
		ipcRenderer.send('ondragstart', canvas.getDataUrl(event.currentTarget));
	}
	else{
		ipcRenderer.send('ondragstart', canvas.getOriginalDataUrl(event.currentTarget));
	}
};
drag.onload= (event) => {
	event.preventDefault();
	alert.setAttribute('style','display:none;');
	drag.classList.remove('image-blur'); 
};

// Common functions
let loadImage = (keyword)=>{

	alert.setAttribute('style','display:inline-flex;');
	drag.classList.add('image-blur'); 

	if(keyword){
		unsplash.fetchFromKeyword(keyword).then((url) => {
			drag.setAttribute('src', url);
		});
	}
	else{
		unsplash.fetchRandom().then((url) => {
			drag.setAttribute('src',url);
		});
	}
};