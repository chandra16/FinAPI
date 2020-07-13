const Bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const AuthenticationData = require('../model/authenticationData');
const KycData = require('../model/kycData');
const Config = require('../../config');
const Logger = require('../helper/logger');

// private function

// public function

const createKycDetail = (id, status, info) => {
    return new Promise(function (resolve, reject) {
        KycData.createKycDetail(id, status, info)
            .then((result) => {
                if (result) {
                    const successResult = {
                        'statusCode': 'C0001',
                        'response': 'Success',
                        'message': 'Update data Ocr successfully'
                    };
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                Logger.write.log('error', 'update Ocr error for ' + id + ': ' + err.message);
                return reject(err);
            });
    });
};

const createKycValidation = (userCode) => {
    return new Promise(function (resolve, reject) {
        KycData.createKycValidation(userCode)
            .then((result) => {
                if (result) {
                    const successResult = {
                        'statusCode': 'C0001',
                        'response': 'Success',
                        'message': 'create data kyc successfully'
                    };
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                Logger.write.log('error', 'create data kyc error for ' + userCode + ': ' + err.message);
                return reject(err);
            });
    });
};

const updateOcrValidation = (param, id, idNumber, name, dob, pob) => {
    if(param.statusCode === 'C0001') {
        return new Promise(function (resolve, reject) {
            KycData.updateOcr(id, idNumber, name, dob, pob)
                .then((result) => {
                    if (result) {
                        const successResult = {
                            'statusCode': 'C0001',
                            'response': 'Success',
                            'message': 'Update data Ocr successfully'
                        };
                        return resolve(successResult);
                    }
                })
                .catch((err) => {
                    Logger.write.log('error', 'update Ocr error for ' + id + ': ' + err.message);
                    return reject(err);
                });
        });
    }

    const errorResult = {
        'statusCode': 'E0001',
        'response': 'Failed',
        'message': 'Ooops ! Something wrong with our ends'
    };
    return resolve(errorResult);
};

const updateKycValidation = (param, userCode, columnName, id) => {
        if(param.statusCode === 'C0001') {
            return new Promise(function (resolve, reject) {
                KycData.updateKycValidation( userCode, columnName, id)
                .then((result) => {
                    if(result) {
                        const successResult = {
                            'statusCode': 'C0001',
                            'response': 'Success',
                            'message': 'Update data Kyc Validation successfully'
                        };
                        return resolve(successResult);
                    }
                })
                .catch((err) => {
                    Logger.write.log('error', 'update Kyc Validation status error for ' + userCode + ': ' + err.message);
                    return reject(err);
                });
            });
        }

        const errorResult = {
            'statusCode': 'E0001',
            'response': 'Failed',
            'message': 'Ooops ! Something wrong with our ends'
        };
        return resolve(errorResult);
};

const updateBankAccValidator = (id, status, info, updatedAt) => {
    return new Promise(function (resolve, reject) {
        KycData.updateBankAccValidator( id, status, info, updatedAt)
        .then((result) => {
            if(result) {
                const successResult = {
                    'statusCode': 'C0001',
                    'response': 'Success',
                    'message': 'Update data bank account validator successfully'
                };
                return resolve(successResult);
            }
        })
        .catch((err) => {
            Logger.write.log('error', 'update bank account validator error for ' + id + ': ' + err.message);
            return reject(err);
        });
    });
};

const getDataKycDetailHelper = function (userCode, type) {
    return new Promise((resolve,reject) => {
            KycData.getDataKycDetail(userCode, type)
                .then((results) => {
                    return resolve(results[0]);
                })
                .catch((err) => {
                    return reject(err);
                });
    });
};

const getKycOcrDetail = function (userCode) {
    return new Promise(function (resolve, reject) {
        KycData.getKycOcrDetail(userCode)
            .then((result) => {
                return resolve(result[0]);
            })
            .catch((err) => {
                Logger.write.log('error', 'get data kyc detail for ' + userCode + ': ' + err.message);
                return reject(err);
            });
    });
};

module.exports = {
    updateOcrValidation,
    createKycDetail,
    updateKycValidation,
    updateBankAccValidator,
    createKycValidation,
    getDataKycDetailHelper,
    getKycOcrDetail
};
