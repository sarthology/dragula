'use strict';

/**
 * This function gives DataURL of image passed.
 * @param {object} img object to be converted
 * @returns {string} DataURL of image
 */
const getDataUrl = (img) => {
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');


	canvas.width = img.naturalWidth;
	canvas.height = img.naturalHeight;
	ctx.drawImage(img, 0, 0);

	return canvas.toDataURL();
};

/**
 * This function gives a cropped DataURL of image passed.
 * @param {object} img object to be converted
 * @returns {string} DataURL of image
 */
const getOriginalDataUrl = (img) => {
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
    
	// For horizontal image
	if (img.naturalHeight < img.naturalWidth) {
		aspectRadio = img.naturalWidth / img.naturalHeight;
		newHeight = 1600,
		newWidth = aspectRadio * 1600;
		xStart = -(newWidth - 2400) / 2;
	} 
    
	// For verticle image
	else {
		newWidth = 2400,
		newHeight = aspectRadio * 2400;
		yStart = -(newHeight - 1600) / 2;
	}
    
	ctx.drawImage(img, xStart, yStart, newWidth, newHeight);
    
	return canvas.toDataURL();
};

module.exports = { getDataUrl, getOriginalDataUrl };
