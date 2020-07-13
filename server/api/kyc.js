const _ = require('lodash');
const Boom = require('boom');
const Joi = require('joi');
const KycApi = require('../service/ilumaKyc');
const AuthHelper = require('../helper/authHelper');
const UtilsHelper = require('../helper/utilsHelper');
const KycHelper = require('../helper/kycHelper');

// private function
const __getRandomToken = (totalLength) => {
    const randomToken = Array(totalLength).fill(0).map(() =>
        Math.random().toString(36).charAt(2)).join('');
    return randomToken;
};


const _calculateAge = (birthday) => { // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const __splitName = (fullName) => {
    var words = fullName.split(' ');
    var givenName = '';
    var surName = '';
    const array = [];
    if (words.length - 1 > 0) {
        for (let i = 0; i < words.length - 1; i++) {
          array.push(words[i]);
          }

        givenName = array.join(' ');
        surName = words[words.length - 1];
      } else if (words.length - 1 < 1) {
        givenName = 'FNU';
        surName = words[0];
      }

    const data = {
        given_name: givenName,
        surname: surName
    };
    return data;
};

// public function
const ceckDrawdown = async (request, h) => {
    const req = request.payload;
    try {
        const cekMultiDrawdown = await KycApi.checkMultiDrawndown(req.bankAcoNo, req.bankCode);
        return h.response(cekMultiDrawdown);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const ktpNameValidation = async (request, h) => {
    const req = request.payload;
    try {
        console.log('user code: ' + req.userCode);
        const getDataUser = await AuthHelper.getDataforKYC(req.userCode);
        if(getDataUser) {
            console.log('Detail data: ' + getDataUser.nama);
            console.log('NIK: ' + getDataUser.no_ktp);
            const validateName = await KycApi.KTPnameValidation(getDataUser.no_ktp, getDataUser.nama);
            const newId = await __getRandomToken(10);
            const updateTblKycDetail = await KycHelper.createKycDetail(newId + req.userCode, validateName.status, validateName.name_matches);
            const updateTblKyc = await KycHelper.updateKycValidation(updateTblKycDetail, req.userCode, 'ktp_name_validation', newId + req.userCode);
            return h.response(updateTblKyc);
        }

        return h.response('Data Not Found');
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const phoneAgeValidation = async (request, h) => {
    const req = request.payload;
    try {
        const getDataUser = await AuthHelper.getDataforKYC(req.userCode);
        if(getDataUser) {
            const newId = await __getRandomToken(10);
            const phoneAge = await KycApi.cekPhoneAge(getDataUser.code_country, getDataUser.no_hp);
            const createKycDetail = await KycHelper.createKycDetail(newId + req.userCode + 'age', phoneAge['status'], phoneAge['age']);
            const updateKycValidation = await KycHelper.updateKycValidation(createKycDetail, req.userCode, 'phone_age_number_validation', newId + req.userCode + 'age');
            return h.response(updateKycValidation);
        }

        return h.response('No Data');
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const phoneNumberValidator = async (request, h) => {
    const req = request.payload;
    try {
        const phoneNoValidatior = await KycApi.cekPhoneNumber(req.phoneNumber, req.givenName, req.s);
        return h.response(phoneNoValidatior);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const bankAccValidator = async (request, h) => {
    const req = request.payload;
    try {
        const getDataUser = await AuthHelper.getDataforKYC(req.userCode);
        if(getDataUser) {
            const getName = __splitName(getDataUser.nama_nasabah);
            console.log('nama nasabah: ' + getDataUser.nama_nasabah);
            const bankAccountValidator = await KycApi.bankAccountValidator(getDataUser.nomor_rekening, getDataUser.bank_code, getName.given_name, getName.surname);
            var createKycDetail;
            if(bankAccountValidator.status === 'PENDING') {
                createKycDetail = await KycHelper.createKycDetail(bankAccountValidator.id, bankAccountValidator.status, null);
            } else if(bankAccountValidator.status === 'SUCCESS') {
                createKycDetail = await KycHelper.createKycDetail(bankAccountValidator.id, bankAccountValidator.status, bankAccountValidator.name_matching_result);
            }

            const updateKycValidation = await KycHelper.updateKycValidation(createKycDetail, req.userCode, 'bank_acc_validation', bankAccountValidator.id);
            return h.response(updateKycValidation);
        }

        return h.response('No Data');
    } catch(err) {
        return Boom.badRequest(err.message);
    }
};

const bankAccValidatorCallback = async (request, h) => {
    const req = request.payload;
    const callbackToken = await KycApi.getCallbackToken();
    console.log('callback: ' + callbackToken);
    try {
        if(request.headers['x-callback-token'] === callbackToken) {
            console.log('request: ' + request);
            console.log('header: ' + request.headers['x-callback-token']);
            console.log('id: ', req.id);
            console.log('name_matching_result: ', req.name_matching_result);
            console.log('status: ', req.status);
            console.log('updated_at: ', req.updated);
            const updateBankAccValidator = await KycHelper.updateBankAccValidator(req.id, req.status, req.name_matching_result, req.updated);
            return h.response(updateBankAccValidator);
        } else if(request.headers['x-callback-token'] !== callbackToken) {
            return Boom.badRequest('invalid header token');
        }

    } catch (err) {
        // return Boom.badRequest(err.message);
        return h.response('ok');
    }
};

const cekCft = async (request, h) => {
    const req = request.payload;
    try {
        const getDataUser = await AuthHelper.getDataforKYC(req.userCode);
        if(getDataUser) {
            const getName = __splitName(getDataUser.nama);
            const getAge = _calculateAge(getDataUser.tanggal_lahir);

            // const cekCFT = await KycApi.cekCFT(getName.given_name, getName.surname);
            return h.response(getAge);
        }

        return h.response('No Data');
    } catch(err) {
        return Boom.badRequest(err.message);
    }
};

const idCardOCR = async (request, h) => {
    const req = request.payload;
    try {
        const getDataUser = await AuthHelper.getDataforKYC(req.userCode);
        if(getDataUser) {
            const fileName = getDataUser.upload_ktp;
            console.log(fileName);
            const getFileImage = await UtilsHelper.accessUpload('user_ktp', fileName);
            const encodeBase64 = Buffer.from(getFileImage).toString('base64');
            const cekOCR = await KycApi.idCardOCR(encodeBase64,'KTP');
            const createKycDetail = await KycHelper.createKycDetail(cekOCR.id, cekOCR.status, cekOCR.type);
            const update = await KycHelper.updateOcrValidation(createKycDetail, cekOCR.id, cekOCR.content.id_number, cekOCR.content.name, null, null);
            const updateKycValidation = await KycHelper.updateKycValidation(update, req.userCode, 'id_card_ocr_validation', cekOCR.id);
            return h.response(updateKycValidation);
        }

        return h.response('No Data');
    } catch(err) {
        return Boom.badRequest(err.message);
    }
};

const faceImageRecognition = async (request, h) => {
    const req = request.payload;
    try {
        const getDataUser = await AuthHelper.getDataforKYC(req.userCode);
        if(getDataUser) {
            const selfieFileName = getDataUser.upload_selfie;
            const idCardFileName = getDataUser.upload_ktp;
            console.log(selfieFileName);
            console.log(idCardFileName);
            const getFileImageSelfie = await UtilsHelper.accessUpload('user_selfie', selfieFileName);
            const getFileImageKtp = await UtilsHelper.accessUpload('user_ktp', idCardFileName);
            const encodeBase64Selfie = Buffer.from(getFileImageSelfie).toString('base64');
            const encodeBase64Ktp = Buffer.from(getFileImageKtp).toString('base64');
            const imageValidator = await KycApi.imageValidator(encodeBase64Selfie, encodeBase64Ktp);
            let createKycDetail;
            if(imageValidator.status === 'PENDING') {
                createKycDetail = await KycHelper.createKycDetail(imageValidator.id, imageValidator.status, null);
            } else if(imageValidator.status === 'COMPLETED') {
                createKycDetail = await KycHelper.createKycDetail(imageValidator.id, imageValidator.status, imageValidator.match_percentage);
            }

            const updateKycValidation = await KycHelper.updateKycValidation(createKycDetail, req.userCode, 'selfie_idcard_validation', imageValidator.id);
            return h.response(updateKycValidation);
        }

        return h.response('No Data');
    } catch(err) {
        return Boom.badRequest(err.message);
    }
};

const getDataKycDetailApi = async (request, h) => {
    const req = request.payload;
    try {
        if(req.type === 'id_card_ocr_validation'){
            const dataOcr = await KycHelper.getKycOcrDetail(req.userCode);
            return h.response(dataOcr);
        } else if (req.type !== 'id_card_ocr_validation') {
            const data = await KycHelper.getDataKycDetailHelper(req.userCode, req.type);
            return h.response(data);
        }
    } catch(err) {
        return Boom.badRequest(err.message);
    }
};

exports.plugin = {
    register: (server, options) => {
        options = _.extend({ basePath: '' }, options);

        server.route([{
            method: 'POST',
            path: options.basePath + '/ktp-name-validator',
            handler: ktpNameValidation,
            options: {
                description: 'Request for KTP Name Validation',
                tags: ['api','kyc'],
                auth: false,
                validate: {
                    payload: {
                        userCode: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/bank-acc-validator',
            handler: bankAccValidator,
            options: {
                description: 'Request Bank Account Validator',
                tags: ['api','kyc'],
                auth: false,
                validate: {
                    payload: {
                        userCode: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/get-data-kyc-validation-detail',
            handler: getDataKycDetailApi,
            options: {
                description: 'Request for bank Acc Validator callback',
                tags: ['api','kyc'],
                auth: false,
                validate: {
                    payload: {
                        userCode: Joi.string().required(),
                        type: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/bank-acc-validator-callback',
            handler: bankAccValidatorCallback,
            options: {
                description: 'Request for bank Acc Validator callback',
                tags: ['api','kyc'],
                auth: false
            }
        }, {
            method: 'POST',
            path: options.basePath + '/validate-selfie-idcard',
            handler: faceImageRecognition,
            options: {
                description: 'Request for Phone number Validation',
                tags: ['api','kyc'],
                auth: false,
                validate: {
                    payload: {
                        userCode: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/ktp-OCR',
            handler: idCardOCR,
            options: {
                description: 'Request for KTP Name Validation',
                tags: ['api','kyc'],
                auth: false,
                validate: {
                    payload: {
                        userCode: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/phone-age-validator',
            handler: phoneAgeValidation,
            options: {
                description: 'Request for Phone age validation',
                tags: ['api','kyc'],
                auth: false,
                validate: {
                    payload: {
                        userCode: Joi.string().required()
                    }
                }
            }
        }]);
    },

    'name' : 'api-kyc'
};
