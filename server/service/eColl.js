'use strict';

const Config = require('../../config');
const BniEnc = require('./bniEncryption');
const Request = require('request');
const Logger = require('../helper/logger');
const AssetData = require('../model/assetData');

const __headerApi = () => {
    const eCollHeader = {
        'Content-type': 'application/json'
    };
    return eCollHeader;
};

const __request = (methodRequest, data, source, type) => {
    return new Promise((resolve, reject) => {
        const encryptedData = BniEnc.encrypt(data, Config.get('/eCollection/clientId'), Config.get('/eCollection/secretKey'));
        const dataForm = {
            'client_id': Config.get('/eCollection/clientId'),
            'data': encryptedData
        };

        const options = {
            'uri': Config.get('/eCollection/server'),
            'method': methodRequest,
            'headers': __headerApi(),
            'body': JSON.stringify(dataForm)
        };
        Request(options, (err, response) => {
          if (err) {
            AssetData.insertRecordBni(source, type, err.message);

            Logger.write.log('error', 'eCollection api request error: ' + err.message);
            return reject({'message': 'eCollection api failed'});
          }

          AssetData.insertRecordBni(source, type, response.body);
          return resolve(response.body);
        });
    });
};

const __decryptResponse = (data) => {
    return BniEnc.decrypt(data, Config.get('/eCollection/clientId'), Config.get('/eCollection/secretKey'));
};

const __encryptResponse = (data) => {
    return BniEnc.encrypt(data, Config.get('/eCollection/clientId'), Config.get('/eCollection/secretKey'));
};

const createVirtualAccount = (amount, transId, name, phone, email, virtualAccount, description, expiredDate) => {
    return new Promise(async (resolve, reject) => {
        const data = {
            'type': 'createBilling',
            'client_id': Config.get('/eCollection/clientId'),
            'trx_id': transId,
            'trx_amount': amount,
            'billing_type': 'c',
            'customer_name': name,
            'customer_phone': phone,
            'customer_email': email,
            'virtual_account': virtualAccount,
            'description': description,
            'datetime_expired': expiredDate
        };

        try {
            const responseBody = await __request('POST', data, email, 'ECOLL-CREATEVA');
            const responseVal = JSON.parse(responseBody);
            console.log('======create VirtualAcc: ', responseVal);
            if (responseVal.status === '000') {
                const createAccount = __decryptResponse(responseVal.data);
                console.log('======create VirtualAcc content success: ', createAccount);
                return resolve(createAccount);
            }

            return reject({'message': responseVal.message});
        } catch (err) {
            Logger.write.log('error', 'create virtual account api request error for ' + name + ': ' + err.message);
            return reject({'message': 'failed to create virtual account'});
        }
    });
};

const paymentCallback = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const responseCallback = await __decryptResponse(data);

            await AssetData.insertRecordBni(responseCallback.virtual_account,'VA-CALLBACK', JSON.stringify(responseCallback));
            console.log('====eColl paymentCallback: ', data, responseCallback);
            return resolve(responseCallback);
        } catch (err) {
            await AssetData.insertRecordBni('CALLBACK ERROR','VA-CALLBACK', err.message);
            Logger.write.log('error', 'payment callback decrypt error: ' + err.message);
            return reject({'message': 'failed to decrypt callback va response'});
        }
    });
};

const eCollEncryption = (data) => {
    return new Promise((resolve, reject) => {
        try {
            const responseCallback = __encryptResponse(data);
            console.log('====rdl encryption: ', data, responseCallback);
            return resolve(responseCallback);
        } catch (err) {
            Logger.write.log('error', 'rdl encryption error: ' + err.message);
            return reject({'message': 'failed to encryption rdl response'});
        }
    });
};

module.exports = {
    createVirtualAccount,
    eCollEncryption,
    paymentCallback
};
