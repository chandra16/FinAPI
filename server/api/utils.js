const _ = require('lodash');
const Boom = require('boom');
const Joi = require('joi');
const UtilsHelper = require('../helper/utilsHelper');
const InstallmentHelper = require('../helper/installmentHelper');
const BniRdl = require('../service/bniRDL');
const DigiSign = require('../service/digiSign');

const areaHandler = async (request, h) => {
    try {
        const areajson = await UtilsHelper.getArea();
        return h.response(areajson);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const captchaValidation = async (request, h) => {
    const req = request.payload;
    try {
        const areajson = await UtilsHelper.validateCaptcha(req.token);
        return h.response(areajson);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const uploadHandler = async (request, h) => {
    const req = request.payload;
    try {
        const uploadStatus = await UtilsHelper.uploadFile(req.image, req.type, req.extention, req.authId, null);
        return h.response(uploadStatus);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const accessUploadHandler = async (request, h) => {
    try {
        const getAccessUploadHandler = await UtilsHelper.accessUpload(request.params.type, request.params.file);
        return h.response(getAccessUploadHandler);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const checkRemainingDate = async(request, h) => {
    try {
        const allUnpaid = await InstallmentHelper.getAllUnpaid();
        allUnpaid.forEach(async (unpaidData) => {
            const statusPayment = await InstallmentHelper.calculateDate(unpaidData.due_date);
            await InstallmentHelper.updateRemainingDay(unpaidData.loan_code, unpaidData.plan, statusPayment);
            await InstallmentHelper.checkRemainingDay(unpaidData.loan_code, statusPayment);
        });
        const successResult = await UtilsHelper.successTemplate('C0001', {'message': 'Update Remaining Day succefully'});
        return h.response(successResult);
    } catch(err) {
        return Boom.badRequest(err.message);
    }
};

const getVariableDashboardDanon = async(request, h) => {
    const req = request.payload;
    try {
        const data = await UtilsHelper.getVariableDashboardDanon(req.type);
        return h.response(data);
    } catch(err) {
        return Boom.badRequest(err.message);
    }
};

const updateDashboardVariableJson = async(request, h) => {
    try {
        const updateFile = await UtilsHelper.updateDashboardJsonFile();
        return h.response(updateFile);
    } catch(err) {
        return Boom.badRequest(err.message);
    }
};

const testApi = async (request, h) => {
    const req = request.payload;
    try {
        // console.log('test', req.key);
        // const uploadStatus = await ConstantHelper.getValue(req.key);
        // const testValue = await InstallmentHelper.installmentCalculation(req.userCode, req.loanCode, req.totalAmount, req.lamaTenor, req.bunga);
        // const testValue = await UtilsHelper.updatedToken('test');
        const testValue = await BniRdl.rdlEncryption(req);
        return h.response(testValue);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const checkUserDigi = async (request, h) => {
    const req = request.payload;
    try {
        const resultVal = await DigiSign.checkUserDigi(req.email);
        return h.response(resultVal);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

exports.plugin = {
    register: (server, options) => {
        options = _.extend({ basePath: '' }, options);

        server.route([{
            method: 'POST',
            path: options.basePath + '/area',
            handler: areaHandler,
            options: {
                description: 'Get the json file of area information',
                tags: ['api'],
                auth: false
            }
        },{
            method: 'GET',
            path: '/upload/{type}/{file*}',
            handler: accessUploadHandler,
            options: {
                tags: ['api'],
                description: 'Upload Directory Handler',
                auth: false
            }
        }, {
            method: 'POST',
            path: options.basePath + '/uploader',
            handler: uploadHandler,
            options: {
                description: 'Upload base64 file',
                tags: ['api'],
                auth: false,
                validate: {
                    payload: {
                        image: Joi.string().required(),
                        extention: Joi.string().required(),
                        authId: Joi.string().required(),
                        type: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/get-variable-dashboard',
            handler: getVariableDashboardDanon,
            options: {
                description: 'Get Variable Dashboard',
                tags: ['api'],
                auth: false,
                validate: {
                    payload: {
                        type: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/update-dashboard-json-file',
            handler: updateDashboardVariableJson,
            options: {
                description: 'Update File JSON for Variable Dashboard',
                tags: ['api'],
                auth: false
            }
        }, {
            method: 'POST',
            path: options.basePath + '/check-remainingdate',
            handler: checkRemainingDate,
            options: {
                description: 'check remaining date for installment, auto run script',
                tags: ['api'],
                auth: false
            }
        }, {
            method: 'POST',
            path: options.basePath + '/test-api',
            handler: testApi,
            options: {
                description: 'Get the json file of area information',
                tags: ['api'],
                auth: false
            }
        },{
            method: 'POST',
            path: options.basePath + '/validate-captcha',
            handler: captchaValidation,
            options: {
                description: 'validate captcha',
                tags: ['api', 'captcha'],
                auth: false,
                validate: {
                    payload: {
                        token: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/check-userdigi',
            handler: checkUserDigi,
            options: {
                description: 'check email in digisign',
                tags: ['api'],
                auth: false
            }
        }]);
    },

    'name' : 'api-utils'
};
