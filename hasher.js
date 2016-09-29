'use strict';

require('dotenv').config({path: './.env.salt'});
const crypto = require('crypto');
const salt = (process.env.SALT_VAL)


var saltHash = function(hashThis) {
    return crypto.createHmac('sha512', salt).update(hashThis).digest('hex')
}

//console.log(saltHash('password'))
