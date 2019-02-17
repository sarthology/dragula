'use strict';

// Dependencies
const { ipcRenderer } = require('electron');

// Module imports
const unsplash = require('./util/unsplash');
const canvas = require('./util/canvas');
const imgur = require('./util/imgur'); 

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
const loader = document.getElementById('loader');
const message = document.getElementById('message');
const main = document.getElementById('main');



// Event to open main window
enter.onclick = (event) => {
	event.preventDefault();

	if(!drag.getAttribute('src')){
		loadImage();
	}

	main.style = 'display:inline-flex;';
	enter.style = 'display:none';

	ipcRenderer.send('open');
};

// Event to search image by keyword 
keyword.onkeydown = (event) => {
	if (event.keyCode === 13) {
		loadImage(event.currentTarget.value);
	}
};

// Event to load new image 
reload.onclick = (event) => {
	event.preventDefault();

	loadImage(keyword.value);
};

// Event to minimize main window 
minimize.onclick = (event) => {
	event.preventDefault();
	main.style = 'display:none';
	enter.style = 'display:block';
	ipcRenderer.send('close');
};

// Event to download the image 
download.onclick = (event) => {
	event.preventDefault();
	ipcRenderer.send('download', {
		'url': drag.getAttribute('src')
	});
};

// Event to copy the markdown code
markdown.onclick = (event) => {
	event.preventDefault();
	let img;
	alert.setAttribute('style','display:inline-flex;');
	drag.classList.add('image-blur'); 

	if(document.getElementsByClassName('image-original')[0]){
		img = canvas.getDataUrl(drag);
	}
	else{
		img = canvas.getOriginalDataUrl(drag);
	}

	imgur.unploadImage(img).then((body)=>{
		alert.setAttribute('style','display:none;');
		drag.classList.remove('image-blur');
		const data = JSON.parse(body).data;
		ipcRenderer.send('markdown', {
			'url': data.link
		});
		markdownAnimate();
	});
};

// Event to see the original size of image
original.onclick = (event) => {
	event.preventDefault();
	drag.classList.toggle('image-original');
	drag.classList.toggle('image-canvas');
};

// Event to start image dragging 
drag.ondragstart = (event) => {
	event.preventDefault();
	if(document.getElementsByClassName('image-original')[0]){
		ipcRenderer.send('ondragstart', canvas.getDataUrl(event.currentTarget));
	}
	else{
		ipcRenderer.send('ondragstart', canvas.getOriginalDataUrl(event.currentTarget));
	}
};

// Event to check if image loaded
drag.onload= (event) => {
	event.preventDefault();
	alert.setAttribute('style','display:none;');
	drag.classList.remove('image-blur'); 
};

// Function to fetch image from unsplash
const loadImage = (keyword)=>{

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

// Function to do animation for markdown code successfully copied
const markdownAnimate = ()=>{

	alert.setAttribute('style','display:inline-flex;');
	loader.setAttribute('style','display:none;');
	message.setAttribute('style','display:block;');
	drag.classList.add('image-blur'); 
	
	setTimeout(() => {
		alert.setAttribute('style','display:none;');
		loader.setAttribute('style','display:block;');
		message.setAttribute('style','display:none;');
		drag.classList.remove('image-blur'); 
	}, 2000);
};