const fs = require('fs');  // pull in the file system module

//define client html and css directories as index and css
const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const index2 = fs.readFileSync(`${__dirname}/../client/page2.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

//Returns the index html pages 
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getIndex2 = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index2);
  response.end();
};

//Returns a text css page 
const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

//export methods
module.exports = {
  getIndex,
  getIndex2,
  getCSS,
};
