'use strict';

var config = {
  'protocol': 'http',
  'hostname': 'localhost',
  'port': 8080
};

config.url = config.protocol + '://' + config.hostname + ':' + config.port;

module.exports = config;


