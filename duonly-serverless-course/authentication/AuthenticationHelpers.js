const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs-then');

module.exports.signJWT = id => {
    return jwt.sign(id, process.env.JWT_SECRET, {expiresIn: 604800});
}

module.exports.validRegistration = body => {
    if(!body.password || body.password.length <= 6) {
        return Promise.reject(new Error('Password needs to be at least 7 characters.'));
    }

    if(!body.email) {
        return Promise.reject(new Error('Email is required.'));
    }

    return Promise.resolve();
}

module.exports.verifyPassword = (sentPassword, realPassword, userId) => {
    return bcrypt.compare(sentPassword, realPassword)
        .then(valid => !valid ? Promise.reject(new Error('Incorrect password.')) : this.signJWT(userId)
        );
}

module.exports.success = res => {
    return {
        statusCode: 200,
        body: JSON.stringify(res)
    }
}

module.exports.errResponse = err => {
    return {
        statusCode: err.statusCode || 500,
        body: err.message
    }
}