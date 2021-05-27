const fs = require('fs');
/*File system module - fs */
const textIn = fs.readFileSync('./txt/input.txt','utf-8');
console.log(textIn);
const textOut = `This is what we know about the avacoda: ${textIn}. \nCreated on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt',textOut);
const written = fs.readFileSync('./txt/output.txt','utf-8');
console.log(written);