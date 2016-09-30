'use strict';
const crypto = require('crypto');

let genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

//console.log(genRandomString(36))

module.exports = genRandomString;