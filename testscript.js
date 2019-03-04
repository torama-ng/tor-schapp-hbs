const fs = require("fs");
const path = require("path");
const fetch = require('node-fetch');
const dree = require('dree')
const trim = require('deep-trim-node');

const folder = '.'

 
const options = {
  stat: false,
  normalize: true,
  followLinks: true,
  size: true,
  hash: true,
  depth: 3,
  exclude: /tmp/,
  extensions: [ 'txt', 'jpg' ]
};
 
// const tree = dree.scan(folder, options);
const tree = dree.parse(folder, options);
console.log(tree)