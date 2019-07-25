var request = require('request');

module.exports = function (opt) {
    return new Promise(function (resolve, reject) {
        request(opt, function (err, response, body) {
            if (err) {
                reject(err);
            }
            else {
                resolve(body);
            }
        });
    });
};