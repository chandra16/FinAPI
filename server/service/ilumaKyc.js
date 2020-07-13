'use strict';

const Config = require('../../config');
const Request = require('request');
const Logger = require('../helper/logger');

const __headerApi = () => {
    // Encrypt the Api keys for KYC to base64
    const authorization = Buffer.from(Config.get('/ilumaKyc/secretKey') + ':').toString('base64');
    const kycHeader = {
        'Accept': 'application/json',
        'Authorization': 'Basic ' + authorization,
        'Content-type': 'application/x-www-form-urlencoded'
    };
    return kycHeader;
};

const __request = (methodRequest, path, data) => {
    return new Promise((resolve, reject) => {

        const options = {
            'uri': Config.get('/ilumaKyc/server') + path,
            'method': methodRequest,
            'headers': __headerApi(),
            'form': data
        };
        console.log(data);

        console.log('');
        console.log('====================== SEND ==========================');
        console.log(options);
        console.log('');

        Request(options, (err, response) => {
            if (err) {
                Logger.write.log('error', 'KYC api request error for operation: ' + path + ', with error : ' + err.message);
                return reject({ 'message': 'KYC api failed for operation: ' + path });
            }

            return resolve(response.body);
        });
    });
};

const __methodGetRequest = (path) => {
    return new Promise((resolve, reject) => {
        const options = {
            'uri': Config.get('/ilumaKyc/server') + path ,
            'method': 'GET',
            'headers': __headerApi()
        };
        console.log(path);

        console.log('');
        console.log('====================== SEND ==========================');
        console.log(options);
        console.log('');

        Request(options, (err, response) => {
            if(err) {
                Logger.write.log('error', 'KYC api request error for operation: ' + path + ', with error: ' + err.message);
                return reject({'message': 'KYC api failed for operation: ' + path});
            }

            return resolve(JSON.parse(response.body));
        });
    });
};

const __generateRequest = (data, url) => {
    return new Promise(async (resolve, reject) => {
        try {
            const responseBody = await __request('POST', url, data);
            const responseVal = JSON.parse(responseBody);

            console.log('RESPONSE VAL => ', JSON.stringify(responseVal));

            return resolve(responseVal);
        } catch (err) {
            Logger.write.log('error', 'Generate api request error for: ' + url + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to generate request' });
        }
    });
};

const getCallbackToken = () => {
        const callbackToken = Config.get('/ilumaKyc/callbackToken');
        return callbackToken;
};

const checkMultiDrawndown = (bankAcountNo, bankCode) => {
    return new Promise(async (resolve, reject) => {
        const data = {
            'bank_account_number': bankAcountNo,
            'bank_code': bankCode
        };

        try {
            const drawdownRequest = await __generateRequest(data, '/v1/credit/drawdowns');
            return resolve(drawdownRequest);
        } catch (err) {
            Logger.write.log('error', 'Cek Multi Drawdowns api request error for: ' + data.bank_code + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to cek multi drawdown' });
        }
    });
};

const KTPnameValidation = (nik, nama) => {
    return new Promise(async (resolve, reject) => {
        const data = {
            'nik': nik.toString(),
            'name': nama
        };
        try {
            const KTPnameValidationRequest = await __generateRequest(data, '/v1/identity/ktp_name/validations');
            return resolve(KTPnameValidationRequest);
        } catch (err) {
            Logger.write.log('error', 'Cek KTP name validation request error for: ' + data.nik + ', with error : ' + err.message);
            return reject({'message': 'Failed to cek KTP name Validation'});
        }
    });
};

const cekPhoneAge = (codeCountry, phoneNo) => {
    return new Promise(async (resolve, reject) => {
        try {
            const PhoneAgeRequest = await __methodGetRequest('/v1/fraud/phone_numbers/' + codeCountry + phoneNo + '/age');
            return resolve(PhoneAgeRequest);
        } catch(err) {
            Logger.write.log('error', 'Cek Phone Age validation request error for: ' + codeCountry + phoneNo + ', with error: ' + err.message);
            return reject({'message': 'Failed to cek Phone Age Validation'});
        }
    });
};

const cekPhoneNumber = (phoneNumber, givenName, surName) => {
    return new Promise(async (resolve, reject) => {
        const data = {
            'phone_number': phoneNumber,
            'given_name': givenName,
            'surname': surName
        };
        try {
            const phoneNumberRequest = await __generateRequest(data, '/v2/identity/phone_numbers/validate');
            return resolve(phoneNumberRequest);
        } catch(err) {
            Logger.write.log('error', 'Cek Phone Number validation request error for: ' + data.phone_number + ', with error: ' + err.message);
            return reject({'message': 'Failed to cek Phone Number Validation'});
        }
    });
};

const idCardOCR = (image, type) => {
    return new Promise(async (resolve, reject) => {
        const data = {
            'image': image,
            'type': type
        };
        try {
            const idCardOCRRequest = await __generateRequest(data, '/v1/identity/id_card_images');
            return resolve(idCardOCRRequest);
        } catch(err) {
            Logger.write.log('error', 'Id Card OCR request error for: ' + data.image + ', with error: ' + err.message);
            return reject({'message': 'Failed to Id Card OCR'});
        }
    });
};

const imageValidator = (faceImg, ktpImg) => {
    return new Promise(async (resolve, reject) => {
        const data = {
            'image1': faceImg,
            'image2': ktpImg
        };
        try {
            const imageValidatorRequest = await __generateRequest(data, '/v1/identity/face_comparisons');
            return resolve(imageValidatorRequest);
        } catch(err) {
            Logger.write.log('error', 'Image Validator request error for: ' + data.image1 + ', with error: ' + err.message);
            return reject({'message': 'Failed to Validate Image'});
        }
    });
};

const cekCFT = (givenName, surName) => {
    return new Promise(async (resolve, reject) => {
        const data = {
            'given_name': givenName,
            'surname': surName
        };
        try {
            const cekCFTrequest = await __generateRequest(data, '/v1/identity/cft/individual_watchlist');
            return resolve(cekCFTrequest);
        } catch(err) {
            Logger.write.log('error', 'CFT request error for: ' + data.given_name + ', with error: ' + err.message);
            return reject({'message': 'Failed to CFT'});
        }
    });
};

const bankAccountValidator = (bankAccountNumber, bankCode, givenName, surName) => {
    return new Promise(async (resolve, reject) => {
        const data = {
            'bank_account_number': bankAccountNumber,
            'bank_code': bankCode,
            'given_name': givenName,
            'surname': surName
        };
        try {
            const BankAccValRequest = await __generateRequest(data, '/v2/identity/bank_account_data_requests');
            return resolve(BankAccValRequest);
        } catch(err) {
            Logger.write.log('error', 'Bank Account Validator request error for: ' + data.bank_account_number + ', with error: ' + err.message);
            return reject({'message': 'Failed to ceck Bank Account'});
        }
    });
};

module.exports = {
    checkMultiDrawndown,
    KTPnameValidation,
    cekPhoneAge,
    cekPhoneNumber,
    idCardOCR,
    imageValidator,
    cekCFT,
    bankAccountValidator,
    getCallbackToken
};
