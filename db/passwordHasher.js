'use strict';

require('dotenv').config({path: './.env.dev'});
const crypto = require('crypto');
const salt = (process.env.SALT_VAL)


var sha512 = function(password){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

function saltHashPassword(userpassword) {
    var passwordData = sha512(userpassword);
    console.log('UserPassword = '+userpassword);
    console.log('Passwordhash = '+passwordData.passwordHash);
    console.log('\nSalt = '+passwordData.salt);
}


saltHashPassword('PASSWORD')
