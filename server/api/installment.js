const _ = require('lodash');
const Boom = require('boom');
const Joi = require('joi');
const InstallmentHelper = require('../helper/installmentHelper');
const FundingData = require('../model/fundingData');
const ConstantHelper = require('../helper/constantHelper');
const AssetHelper = require('../helper/assetHelper');

const getListInstallment = async (request, h) => {
    const req = request.payload;
    try {
        const listInstallment = await InstallmentHelper.getListInstallment(req.loanCode);
        return h.response({ listInstallment });
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const getAllInstallment = async (request, h) => {
    const req = request.payload;
    try {
        const listInstallment = await InstallmentHelper.getListInstallmentByUser(req.userCode);
        return h.response({ listInstallment });
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const disbursementInstallmentstatus = async (request, h) => {
    const req = request.payload;
    try {
        const disburse = await InstallmentHelper.disbursementInstallmentstatusHelper(req.disbursementStatus);
        return h.response({ disburse });
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const disburseInstallment = async (request, h) => {
    const req = request.payload;
    try {
        // get total penalti keterlambatan pada cicilan pinjaman saat ini
        const currentInstallment = await InstallmentHelper.getAmountLateInterest(req.loanCode);
        console.log('bunga keterlambatan: ' + currentInstallment[0].amount_late_interest);

        // get jumlah amount cicilan per bulannya
        // const amountInstallment = await InstallmentHelper.getAmountInstallment(req.loanCode);

        // get rdl investor, select investor from tbl_funding_detail
        const getRdlInvestor = await FundingData.getListFunding(req.loanCode);

        const serviceFeeAllInvestor = [];
        const descriptions = 'Transfer Installment to RDL for loan ' + req.loanCode;
        for (const rdl of getRdlInvestor) {
            console.log('User Code Investor (Loop) :' + rdl.user_code);
            console.log('RDL Investor (Loop) :' + rdl.virtual_acc);
            const investorIncome = await InstallmentHelper.getInvestorIncome(req.loanCode, rdl.user_code, currentInstallment[0].plan);
            console.log('amount investor : ' + investorIncome[0].amount);
            console.log('service fee investor : ' + investorIncome[0].service_fee);
            const finalAmount = await investorIncome[0].amount - investorIncome[0].service_fee; // total yang didapat investor dari cicilan borrower
            console.log('Total keseluruhan yang di dapat Investor: ' + finalAmount);
            //  Transfer to Rdl Investor
            const investorDisbursmentApi = await AssetHelper.paymentIdrProcess('009', null, null, finalAmount, rdl.virtual_acc, descriptions, null, null, null, null);
            console.log('danonDisbursementApi', investorDisbursmentApi);
            await AssetHelper.insertDisbursement(rdl.user_code, finalAmount, await ConstantHelper.getValue('danonBankName'), 3,
                investorDisbursmentApi.response.journal_number, rdl.virtual_acc, rdl.user_code, descriptions, investorDisbursmentApi.response.responseUuid);

            // Save all Service fee from all investor in Array
            serviceFeeAllInvestor.push(investorIncome[0].service_fee);
        }

        let totalServiceFee = 0;
        // Sum Total Service Fee from array serviceFeeAllInvestor to get Total Service fee
        if (currentInstallment[0].plan > 1) {
            totalServiceFee = serviceFeeAllInvestor.reduce((partialSum, a) => partialSum + a) + currentInstallment[ 0 + 1 ].amount_late_interest;
            console.log('yang di transfer ke rekening giro: ' + totalServiceFee);
        } else {
            totalServiceFee = serviceFeeAllInvestor.reduce((partialSum, a) => partialSum + a);
            console.log('yang di transfer ke rekening giro: ' + totalServiceFee);
        }

        // Transfer to danon giro
        const danonDescription = 'Disburse Installment for loan ' + req.loanCode;

        const danonDisbursementApi = await AssetHelper.paymentIdrProcess(await ConstantHelper.getValue('danonBankCode'), await ConstantHelper.getValue('danonClearingCode'), await ConstantHelper.getValue('danonRtgsCode'),
            totalServiceFee, await ConstantHelper.getValue('danonGiroNo'), danonDescription, await ConstantHelper.getValue('danonAddress1'), await ConstantHelper.getValue('danonAddress2'), await ConstantHelper.getValue('danonFullName'), 'BEN');
        console.log('danonDisbursementApi', danonDisbursementApi);
        await AssetHelper.insertDisbursement(await ConstantHelper.getValue('danonUserCode'), totalServiceFee, await ConstantHelper.getValue('danonBankName'), 3,
            danonDisbursementApi.response.journal_number, await ConstantHelper.getValue('danonGiroNo'), await ConstantHelper.getValue('danonFullName'), danonDescription, danonDisbursementApi.response.responseUuid);

        const updateDisburseInstallmentStatus = await InstallmentHelper.updateDisburseInstallmentStatus(currentInstallment[0].plan, req.loanCode);

        return h.response({ updateDisburseInstallmentStatus });
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

exports.plugin = {
    register: (server, options) => {
        options = _.extend({ basePath: '' }, options);

        server.route([{
            method: 'POST',
            path: options.basePath + '/get-installment',
            handler: getListInstallment,
            options: {
                description: 'Get installment data',
                tags: ['api', 'installment'],
                auth: false,
                validate: {
                    payload: {
                        loanCode: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/get-disburse-installments-status',
            handler: disbursementInstallmentstatus,
            options: {
                description: 'Get all installment data',
                tags: ['api', 'installment'],
                validate: {
                    payload: {
                        disbursementStatus: Joi.number().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/disburse-installment',
            handler: disburseInstallment,
            options: {
                description: 'Get all installment data',
                tags: ['api', 'installment'],
                auth: false,
                validate: {
                    payload: {
                        loanCode: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/getall-installment',
            handler: getAllInstallment,
            options: {
                description: 'Get all installment data',
                tags: ['api', 'installment'],
                auth: false,
                validate: {
                    payload: {
                        userCode: Joi.string().required()
                    }
                }
            }
        }]);
    },

    'name': 'api-installment'
};
