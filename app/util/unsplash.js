'use strict';

const fetch =  require('node-fetch');

/**
 * This is function gets random image from unsplash using Source Api.
 * @param {string} file - The path to the file to be read 
 * @returns {string} The data read from the file
 */
function fetchRandom() {
	return fetch('https://source.unsplash.com/random').then(res => res.url);
}

module.exports = fetchRandom;