'use strict';

require('dotenv').config({path: './.env.salt'});
const crypto = require('crypto');
const salt = (process.env.SALT_VAL)


var saltHash = function(hashThis) {
    return crypto.createHmac('sha512', salt).update(hashThis).digest('hex')
}

//console.log(saltHash('password'))
//If working coorectly should print out:
//d6f7598b96cce1f72e9ef1f4a97eae5a8bf1d943d5eefb53eb59277ace381a9062c681a9df43b0ec71e961544be7b4bbd594421aebbf4bf411410d18aae4bab5