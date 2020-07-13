'use strict';

const Config = require('../../config');
const Request = require('request');

const googleApi = (token) => {
    return new Promise((resolve, reject) => {
        const googleHeader = {
            'Accept': 'application/json',
            'Content-type': 'application/x-www-form-urlencoded'
        };

        const data = {
          'secret': Config.get('/captcha/secretKey'),
          'response': token
        };

        const options = {
          uri: Config.get('/captcha/server'),
          method: 'POST',
          headers: googleHeader,
          form: data,
          json: true
        };
        Request(options, (err, response) => {
            if (err) {
              return reject({'message': 'recaptcha error'});
            }

            return resolve(response.body);
        });
    });
};

module.exports = {
    googleApi
};
