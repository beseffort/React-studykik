/*
let localStorage;

// If we're testing, use a local storage polyfill
if (global.process && process.env.NODE_ENV === 'test') {
  localStorage = require('localStorage');
} else {
  // If not, use the browser one
  localStorage = global.window.localStorage;
}
*/

export function setItem(...args) {
  localStorage.setItem(...args);
}

export function getItem(...args) {
  return localStorage.getItem(...args);
}

export function removeItem(...args) {
  localStorage.removeItem(...args);
}
