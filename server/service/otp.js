'use strict';

const Config = require('../../config');
const Request = require('request');

const otpApi = (msisdn, content) => {
    return new Promise((resolve, reject) => {
        const otpHeader = {
            'Accept': 'application/json',
            'Authorization': Config.get('/otp/authHeader'),
            'Content-type': 'application/x-www-form-urlencoded',
            'X-MainAPI-Senderid': 'TELKOM'
        };

        const data = {
          'msisdn': msisdn,
          'content': content
        };

        console.log('Ini nomor hp di funsi terakhir: ' + msisdn);

        console.log('data : ' + JSON.stringify(data));
        const options = {
          uri: Config.get('/otp/tokenGenerator'),
          method: 'POST',
          headers: otpHeader,
          form: data
        };
        Request(options, (err, response) => {
            if (err) {
              return reject({'message': 'failed to send otp'});
            }

            return resolve(response.body);
        });
    });
};

module.exports = {
    otpApi
};
