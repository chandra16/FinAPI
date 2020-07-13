const _ = require('lodash');
const Boom = require('boom');
const Joi = require('joi');
const AuthHelper = require('../helper/authHelper');
const LoanHelper = require('../helper/loanHelper');

const registration = async (request, h) => {
    const req = request.payload;
    try {
        const finalRes = await AuthHelper.registrationExternalBorrower(req.userId, req.email, req.phone, req.ktp, req.fullName, req.birthDate,
            req.birthPlace, req.sex, req.address, req.province, req.kabupaten, req.kecamatan, req.kelurahan, req.postalCode, req.npwp,
            req.uploadKtp, req.uploadSelfie, req.idListBank, req.accountNo, req.accountType, req.branch);
        return h.response(finalRes);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const addLoan = async (request, h) => {
    const req = request.payload;
    try {
        const addLoanRes = await LoanHelper.newLoanExternal(req.userId, req.email, req.idLoanType, req.amountLoan, req.loanPeriod, req.totalInterest,
            req.fundingPeriod, req.loanPurpose, req.interestType);
        return h.response(addLoanRes);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

exports.plugin = {
    register: (server, options) => {
        options = _.extend({ basePath: '' }, options);

        server.route([{
            method: 'POST',
            path: options.basePath + '/registration',
            handler: registration,
            options: {
                description: 'Registration for third party',
                tags: ['api'],
                auth: false,
                validate: {
                    payload: {
                        userId: Joi.string().required(),
                        email: Joi.string().required(),
                        phone: Joi.string().required(),
                        ktp: Joi.string().required(),
                        fullName: Joi.string().required(),
                        birthDate: Joi.string().required(),
                        birthPlace: Joi.string().required(),
                        sex: Joi.string().required(),
                        address: Joi.string().required(),
                        province: Joi.string().required(),
                        kabupaten: Joi.string().required(),
                        kecamatan: Joi.string().required(),
                        kelurahan: Joi.string().required(),
                        postalCode: Joi.string().required(),
                        npwp: Joi.string().required(),
                        uploadKtp: Joi.string().required(),
                        uploadSelfie: Joi.string().required(),
                        idListBank: Joi.string().required(),
                        accountNo: Joi.string().required(),
                        accountType: Joi.string().required(),
                        branch: Joi.string().required()
                    }
                }
            }
        },{
            method: 'POST',
            path: options.basePath + '/new-loan',
            handler: addLoan,
            options: {
                description: 'add Loan for third party',
                tags: ['api', 'loan'],
                auth: false,
                validate: {
                    payload: {
                        userId: Joi.string().required(),
                        email: Joi.string().required(),
                        idLoanType: Joi.number().required(),
                        amountLoan: Joi.number().required(),
                        loanPeriod: Joi.number().required(),
                        totalInterest: Joi.number().required(),
                        fundingPeriod: Joi.string().required(),
                        loanPurpose: Joi.string().required(),
                        interestType: Joi.number().required()
                    }
                }
            }
        }]);
    },

    'name' : 'api-external'
};
