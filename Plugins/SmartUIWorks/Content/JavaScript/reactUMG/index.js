'use strict';

module.exports = require('./reactumg.js');

let components = require('components.js');

for(let k in components) {
    module.exports[k] = components[k];
}

