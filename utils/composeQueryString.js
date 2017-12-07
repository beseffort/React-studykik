/* eslint-disable */

export default function composeQueryString(params) {
  const str = [];
  for (const p in params) {
    if (params.hasOwnProperty(p) && params[p] !== undefined && params[p] !== null ) {  // we need to pass 0 and empty string
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(params[p]))
    }
  }
  return str.join('&')
}
