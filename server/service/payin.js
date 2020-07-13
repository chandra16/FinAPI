'use strict';

const Config = require('../../config');
const Request = require('request');
const Logger = require('../helper/logger');

const __headerApi = () => {
    const otpHeader = {
        'Accept': 'application/json',
        'Authorization': Config.get('/paymentGateway/authKey'),
        'Content-type': 'application/x-www-form-urlencoded'
    };
    return otpHeader;
};

const __request = (methodRequest, path, data) => {
    return new Promise((resolve, reject) => {
        const options = {
            uri: Config.get('/paymentGateway/server') + path,
            method: methodRequest,
            headers: __headerApi(),
            form: data
        };

        Request(options, (err, response) => {
          if (err) {
            Logger.write.log('error', 'payment infra api request error: ' + err.message);
            return reject({'message': 'failed to get balace'});
          }

          return resolve(response.body);
        });
    });
};

const checkBalance = () => {
    return new Promise((resolve, reject) => {
        try {
            const balance = __request('GET', 'balance', null);
            return resolve(balance);
        } catch (err) {
            Logger.write.log('error', 'check balance api error: ' + err.message);
            return reject({'message': 'failed to get balance'});
        }
    });
};

const createVirtualAccount = (name, bank) => {
    return new Promise((resolve, reject) => {
        const data = {
            'external_id': 'VA_fixed-' + Date.now(),
            'bank_code': bank,
            'name': name
        };

        try {
            const createAccount = __request('POST', 'callback_virtual_accounts', data);
            return resolve(createAccount);
        } catch (err) {
            Logger.write.log('error', 'create virtual account api request error for ' + name + ': ' + err.message);
            return reject({'message': 'failed to create virtual account'});
        }
    });
};

const verifyPayment = (isPaymentExist, paymentId) => {
  return new Promise((resolve, reject) => {
        try {
            if (!isPaymentExist) {
                const paymentVerification = __request('GET', 'callback_virtual_account_payments/payment_id=' + paymentId , null);
                return resolve(paymentVerification);
            }

            Logger.write.log('error', 'payment already exist for payment id: ' + paymentId);
            return reject({'message': 'duplicate payment'});
        } catch (err) {
            Logger.write.log('error', 'verify payment api request error for payment id, ' + paymentId + ': ' + err.message);
            return reject({'message': 'failed to verify payment'});
        }
  });
};

const disbursement = (accountId, amount, bank, name, accountNo, description) => {
    return new Promise((resolve, reject) => {
        const data = {
            'external_id': accountId,
            'bank_code': bank,
            'account_holder_name': name,
            'account_number': accountNo,
            'amount': amount,
            'description': description
        };

        try {
            const disbursementResult = __request('POST', 'disbursements', data);
            if (disbursementResult.error_code) {
                Logger.write.log('error', 'disbursement api request error for ' + name + ': ' + disbursementResult.message);
                return reject(disbursementResult);
            }

            return resolve(disbursementResult);
        } catch (err) {
            Logger.write.log('error', 'disbursement api request error for ' + name + ': ' + err.message);
            return reject({'message': 'failed to disbursement money'});
        }
    });
};

module.exports = {
    checkBalance,
    createVirtualAccount,
    disbursement,
    verifyPayment
};
