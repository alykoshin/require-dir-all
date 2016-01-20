// See README.md for details.

'use strict';

//var config = require('require-dir-all')('config', { recursive: true });
var config = require('../../index.js')('config', { recursive: true }); // as this demo is the part of package itself, require index file of the package

console.log('config:', JSON.stringify(config, null, 2));

/*
Output:

config: {
  "client": {
    "protocol": "http",
      "hostname": "localhost",
      "port": 8080
  },
  "server": {
    "http": {
      "port": 8080
    },
    "https": {
      "port": 8081,
        "cert": "./cert.pem",
        "key": "./key.pem"
    }
  }
}
*/
