const _ = require('lodash');
const Boom = require('boom');
const Joi = require('joi');
const FundingHelper = require('../helper/fundingHelper');
const LoanHelper = require('../helper/loanHelper');

const getAllFunding = async (request, h) => {
    const req = request.payload;
    try {
        const loans = await FundingHelper.getAllFundingList(req.userCode, req.status);
        return h.response({ loans });
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const getFundingDetail = async (request, h) => {
    const req = request.payload;
    try {
        const loanDetails = await FundingHelper.getFundingDetails(req.fundingId);
        return h.response({ loanDetails });
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const fundingLoan = async (request, h) => {
    const req = request.payload;
    try {
        //check sign dokumen
        const docStatus = await FundingHelper.checkInvestorDocSign(req.userCode);

        if (docStatus.response === 'Success') {
            // check otp response helper
            const finalResponse = await FundingHelper.fundingLoan(req.userCode, req.loanCode, req.fundingAmount);
            return h.response(finalResponse);
        }

        return h.response(docStatus);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};


const withdrawRDL = async (request, h) => {
    const req = request.payload;
    try {
        const requestWithdrawRdl = await FundingHelper.getInvestorRequestWithdraw(req.status);
        return h.response(requestWithdrawRdl);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

exports.plugin = {
    register: (server, options) => {
        options = _.extend({ basePath: '' }, options);

        server.route([{
            method: 'POST',
            path: options.basePath + '/get-funding',
            handler: getAllFunding,
            options: {
                description: 'Get all loans based on status and user code',
                tags: ['api', 'loans'],
                auth: false,
                validate: {
                    payload: {
                        userCode: Joi.string(),
                        status: Joi.number().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/get-funding-detail',
            handler: getFundingDetail,
            options: {
                description: 'Get details of specific loan',
                tags: ['api', 'loans'],
                auth: false,
                validate: {
                    payload: {
                        loanCode: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/',
            handler: fundingLoan,
            options: {
                description: 'Funding a loan',
                tags: ['api', 'loans'],
                auth: false,
                validate: {
                    payload: {
                        loanCode: Joi.string().required(),
                        fundingAmount: Joi.number().required(),
                        userCode: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/get-withdraw-rdl',
            handler: withdrawRDL,
            options: {
                description: 'Get all request withdraw from investor',
                tags: ['api', 'loans'],
                auth: false,
                validate: {
                    payload: {
                        status: Joi.number().required()
                    }
                }
            }
        }]);
    },

    'name': 'api-funding'
};
