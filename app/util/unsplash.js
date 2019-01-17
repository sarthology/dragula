'use strict';

const fetch =  require('node-fetch');

/**
 * This is function gets random image from unsplash using Source Api.
 * @param {null} 
 * @returns {string} link to image
 */
const fetchRandom = () => {
	return fetch('https://source.unsplash.com/random').then(res => res.url);
};

/**
 * This is function gets image from unsplash of a keyword using Source Api.
 * @param {string} keyword to search
 * @returns {string} link to image
 */
const fetchFromKeyword = (keyword) => {
	return fetch('https://source.unsplash.com/all/?'+keyword).then(res => res.url);
};

module.exports = { fetchRandom, fetchFromKeyword };