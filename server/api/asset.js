const _ = require('lodash');
const Joi = require('joi');
const Boom = require('boom');
const AssetHelper = require('../helper/assetHelper');
const AuthData = require('../model/authenticationData');
const VirtualAccData = require('../model/virtualAccData');
const LoanHelper = require('../helper/loanHelper');
const InstallmentHelper = require('../helper/installmentHelper');
const DividenHelper = require('../helper/dividenHelper');
const FundingHelper = require('../helper/fundingHelper');
const AdminHelper = require('../helper/adminHelper');
const PayinApi = require('../service/payin');
const EColl = require('../service/eColl');
const Logger = require('../helper/logger');
const UtilsHelper = require('../helper/utilsHelper');
const ConstantHelper = require('../helper/constantHelper');
const BniRdl = require('../service/bniRDL');

const paymentProcess = async (request, h) => {
    const req = request.payload;
    // const req = {
    //     'id': '598d91b1191029596846047f',
    //     'payment_id': '1502450097081',
    //     'callback_virtual_account_id': '598d5f71bf64853820c49a18',
    //     'external_id': 'VA_fixed-1545212977325',
    //     'merchant_code': '77517',
    //     'account_number': '1000016980',
    //     'bank_code': 'BCA',
    //     'amount': 50000,
    //     'transaction_timestamp': '2017-08-11T11:14:57.080Z'
    // };
    Logger.write.log('info', 'verify payment process for payment id = ' + req.payment_id);
    try {
        const paymentIdExist = await AssetHelper.checkPaymentId(req.payment_id);
        const dataPayment = JSON.parse(await PayinApi.verifyPayment(paymentIdExist, req.payment_id));
        const currentAsset = await AssetHelper.getAsset(dataPayment.external_id);
        await AssetHelper.insertDeposit(currentAsset[0].user_code, dataPayment.account_number, dataPayment.amount,
            dataPayment.bank_code, dataPayment.payment_id, dataPayment.transaction_timestamp, dataPayment.external_id);
        if (currentAsset[0].role_id === 2) {
            const updateAsset = await AssetHelper.updateAsset(dataPayment.external_id, currentAsset[0].balance, dataPayment.amount, 0);
            // store the callback external api
            // update history
            return h.response(updateAsset);
        }

        const unpaidInstallment = await InstallmentHelper.getUpaidInstallmentData(dataPayment.amount, currentAsset[0].user_code);

        if (unpaidInstallment.length === 1) {
            await FundingHelper.updateFundingStatus(unpaidInstallment[0].loan_code, 4);
            await LoanHelper.updateInstallmentComplete(unpaidInstallment[0].loan_code);
        }

        const statusPayment = await InstallmentHelper.checkStatusDate(unpaidInstallment[0].due_date);
        await InstallmentHelper.updateInstallment(unpaidInstallment[0].loan_code, unpaidInstallment[0].plan, unpaidInstallment[0].remaining_day,
            dataPayment.payment_id, dataPayment.amount, statusPayment);
        // split the divided to each investor
        const projectDetail = await DividenHelper.getInterestRate(unpaidInstallment[0].loan_code);
        const investorFunding = await FundingHelper.getInvestorFunding(unpaidInstallment[0].loan_code);
        const dividenSplit = await DividenHelper.calculateDividen(unpaidInstallment[0].loan_code, investorFunding, dataPayment.amount, projectDetail[0].bunga, projectDetail[0].service_fee,
            projectDetail[0].lama_tenor, unpaidInstallment[0].plan);
        await DividenHelper.addAdminCommision(unpaidInstallment[0].loan_code, dataPayment.amount, dividenSplit, unpaidInstallment[0].plan);
        Logger.write.log('info', 'verify payment success for payment id = ' + req.payment_id + ', external id = ' + req.external_id);
        return h.response('OK');
    } catch (err) {
        Logger.write.log('error', 'verify payment failed for payment id = ' + req.payment_id + ', external id = ' + req.external_id);
        throw Boom.notFound(err.message);
    }
};

const getTotalAsset = async (request, h) => {
    const req = request.payload;
    try {
        const asset = await AssetHelper.getTotalAsset(req.userCode);
        return h.response(asset);
    } catch (err) {
        Logger.write.log('error', 'get total asset failed for user code = ' + req.userCode);
        throw Boom.badRequest(err.message);
    }
};

const getAllTransaction = async (request, h) => {
    const req = request.payload;
    try {
        const transaction = await AssetHelper.getAllHistory(req.userCode);
        return h.response(transaction);
    } catch (err) {
        throw Boom.badRequest(err.message);
    }
};

const disbursementRequest = async (request, h) => {
    const req = request.payload;
    try {
        const idDisburs = await AssetHelper.checkDisbursementId(req.userCode);
        console.log('idDisburs', idDisburs);
        if (idDisburs.length > 0) {
            const errorRes = {
                'statusCode': 'E0002',
                'response': 'Failed',
                'message': 'You still have a pending disbursement Request'
            };
            return h.response(errorRes);
        }

        const assetData = await AssetHelper.getAssetFromUser(req.userCode);
        if (assetData[0].balance >= req.amount) {
            const requestDisbursement = await AssetHelper.insertWithdrawRdl(req.userCode, req.amount, assetData[0].bank_name, 2,
                assetData[0].account_no, assetData[0].full_name, req.descriptions, null);
            const reduceAsset = await AssetHelper.updateAsset(assetData[0].virtual_acc, assetData[0].balance, req.amount, 1);
            const disbursementResponse = await AssetHelper.finalizeDisbursementRequest(requestDisbursement.status, reduceAsset.status);
            return h.response(disbursementResponse);
        }

        return h.response({
            'statusCode': 'E0002',
            'response': 'Failed',
            'message': 'You don\'t have enough balance'
        });
    } catch (err) {
        throw Boom.badRequest(err.message);
    }
};

const disbursementRequestOld = async (request, h) => {
    const req = request.payload;
    try {
        const assetData = await AssetHelper.getAssetFromUser(req.userCode);
        const payinDisbursementApi = await PayinApi.disbursement(assetData[0].account_id, req.amount, req.bankName, req.name,
            req.accountNo, req.descriptions);
        const requestDisbursement = await AssetHelper.insertDisbursement(req.userCode, req.amount, req.bankName, 2,
            assetData[0].account_id, req.accountNo, req.name, req.descriptions, JSON.parse(payinDisbursementApi).id);
        const reduceAsset = await AssetHelper.updateAsset(assetData[0].account_id, assetData[0].balance, req.amount, 1);
        const disbursementResponse = await AssetHelper.finalizeDisbursementRequest(requestDisbursement.status, reduceAsset.status);
        // reduce amount in asset (temporary, will be updated based on status) tbl_assets
        // insert disbursement data in tbl_asset_txn
        // store api data from instaMoney
        // update history
        return h.response(disbursementResponse);
    } catch (err) {
        throw Boom.badRequest(err.message);
    }
};

const disbursementProcess = async (request, h) => {
    const req = request.payload;
    // const req = {
    // 'id': '5c47f912ad20f820003c2add',
    // 'user_id': '1502450097081',
    // 'external_id': 'VA_fixed-1548056257547',
    // 'amount': 10000000
    // 'bank_code': 'BCA',
    // 'account_holder_name': 'Lolo Lala',
    // 'disbursement_description': 'danon disbursement',
    // 'is_instant': 'FALSE',
    // 'status': 'COMPLETED',
    // 'updated': '2019-01-07T11:14:57.080Z',
    // 'created': '2019-01-07T11:14:57.080Z'
    // };
    Logger.write.log('info', 'verify disbursement for id = ' + req.id);
    try {
        const currentAsset = await AssetHelper.getAsset(req.external_id);
        // store the payload from instamoney
        // update history

        if (currentAsset[0].role_id === 1) {
            // insert into tbl_loan
            const loanCode = await AssetHelper.getLoanCodeById(req.id);
            const projectDetail = await LoanHelper.getInstallmentFromLoan(loanCode);
            await FundingHelper.updateFundingStatus(loanCode, 3);
            for (let planIndex = 0, totalPlan = projectDetail[0].lama_tenor; planIndex < totalPlan; planIndex++) {
                const endDate = new Date();
                endDate.setMonth(endDate.getMonth() + (planIndex + 1));
                const dueDate = endDate.toISOString().replace(/T/, ' ').replace(/\..+/, '');
                const interest = Math.ceil((req.amount * (projectDetail[0].suku_bunga / 100) / 12));
                const amount = (req.amount / totalPlan) + interest;
                await InstallmentHelper.insertInstallmentData(loanCode, currentAsset[0].user_code, amount, planIndex + 1, dueDate);
            }
        }

        const disbursementStatus = await AssetHelper.checkDisbursementStatus(req.status, currentAsset[0].user_code, currentAsset[0].balance,
            req.amount, req.external_id, req.id, req.updated);
        Logger.write.log('info', 'verify disbursement success for id = ' + req.id + ', external id = ' + req.external_id);
        return h.response(disbursementStatus);

    } catch (err) {
        Logger.write.log('error', 'verify disbursement failed for payment id = ' + req.id + ', external id = ' + req.external_id);
        throw Boom.notFound(err.message);
    }
};

const getAccountBankDetailByUserCode = async (request, h) => {
    const req = request.payload;
    try {
        const accountBankDetail = await AssetHelper.getAccountBankDetailByUserCode(req.userCode);
        return h.response(accountBankDetail);
    } catch (err) {
        Logger.write.log('error', 'get account bank detail failed for user code = ' + req.userCode);
        throw Boom.badRequest(err.message);
    }
};

const transferVAProcess = async (request, h) => {
    const req = request.payload;
    // const req = {
    //     'trx_id': '22600003501',
    //     'virtual_account': '886089999044672',
    //     'customer_name': '',
    //     'trx_amount': '10000000',
    //     'payment_amount': '',
    //     'cumulative_payment_amount': '',
    //     'payment_ntb': '',
    //     'datetime_payment': '',
    //     'datetime_payment_iso8601': ''
    // };
    // const req = {
    //     'data': 'HEMeSyUUFyAdSERgDVUIWXJXRQhRBxlEUEIURhghFxkdNRo3Xk5YX11zBkVMRHRUCVxVA1UIIEpNRhpHHRoXIxxGGksZFggSDnYPWVpUf0oGSFNDCEsEUDh3R3UMV1BOCUMMDVtYSUhZAgpYWwdMAkkaFRJGGhM4QjNZc2VXRlxcdksBXFZYWwlROBsXEEYRSBoCEjlNWH4PfkoGUGRHTVhzZwJST1lKSQQFWllVOBs1HxEWRxUXQjw-BgZJZ09OWgdNA1xHCCUKRVEYHBVDB0AQRUIPS1t7AntEBkliU09aBwtTCxcWFyVAShkTFkQFRSAfFEsgE0o4Qgd1TV5LXlAET3hZQWNUUQEJSVBYARhOGhYEUAwVRkdKFkIfFxIgPEghTh8RJBgbQkYhIRBGAxU',
    //     'client_id': '05151'
    // };

    // Logger.write.log('info', 'callback for transfer VA= ' + req);
    try {
        // const paramCb = req;
        const paramCb = await EColl.paymentCallback(req.data);
        // console.log('callback request va:', req, req.data, paramCb);
        console.log('paramCb', paramCb, paramCb.trx_id);
        const roleTransaction = await AdminHelper.checkRoleTransaction(paramCb.trx_id);
        // const roleTransaction = 1;
        console.log('roleTransaction', roleTransaction);

        if (await roleTransaction === 1) {
            console.log('inside here');
            // Update Table VA BORROWER TRANSACTION | Update status_payment, datetime_payment
            const updateVaStatus = await AdminHelper.updatePaymentVaBrw(paramCb.virtual_account, paramCb.trx_id, paramCb.datetime_payment);
            // const updateVaStatus = 'OK';

            if (updateVaStatus === 'OK') {
                /**
                 **** UPDATE INSTALLMENT STATUS ***
                 */

                // Get LoanCode and UserCode Based on Transaction_ID and VA Number
                const userData = await InstallmentHelper.getUserVaTransaction(paramCb.virtual_account, paramCb.trx_id);
                // const userData = [{
                //     user_code: 'wiliam07122',
                //     loan_code: 'DAN1900000050'
                // }];

                // Get Unpaid Installment from Borrower
                const unpaidInstallment = await InstallmentHelper.getUnpaidInstallmentByLoanCodes(userData[0].loan_code);

                // Get user Detail
                const userDetail = await AuthData.getUserDetail(userData[0].user_code);

                // Generate Transaction ID | Description in VA | Amount of Next Installment
                const plan = await UtilsHelper.generateTwoDigit(String(unpaidInstallment[0].plan + 1));
                const trxId = await userDetail[0].authentication_id + '' + plan + '' + unpaidInstallment[0].loan_code.substr(-4) + '01';
                const descText = await 'Installment for ' + unpaidInstallment[0].loan_code;
                const AmountToPay = await unpaidInstallment[0].amount + unpaidInstallment[0].amount_late_interest;

                // Check if Last payment of installment
                if (unpaidInstallment.length === 1) {
                    //Set finish installment to investor
                    await FundingHelper.updateFundingStatus(unpaidInstallment[0].loan_code, 4);

                    // Checking if Borrower have late fee
                    if (unpaidInstallment[0].amount_late_interest > 0) {
                        //Create next VA if borrower have late fee
                        const createNewVA = await EColl.createVirtualAccount(unpaidInstallment[0].amount_late_interest, trxId, userDetail[0].nama, '0' + userDetail[0].no_hp, userDetail[0].email, paramCb.virtual_account, descText, null);
                        return h.response((createNewVA === 'OK') ? {'status': '000'} : {'status': 'failed'});
                    }

                    //Update for Finish Installment
                    await LoanHelper.updateInstallmentComplete(unpaidInstallment[0].loan_code);
                }

                // Update Status Payment in Table Installment
                const statusPayment = await InstallmentHelper.checkStatusDate(unpaidInstallment[0].due_date);
                await InstallmentHelper.updateInstallment(unpaidInstallment[0].loan_code, unpaidInstallment[0].plan,unpaidInstallment[0].remaining_day, paramCb.trx_id, paramCb.trx_amount, statusPayment);

                /**
                 **** GENERATE NEXT VA FOR NEXT INSTALLMENT ***
                 */

                // Generate New VA
                const createNewVA = await EColl.createVirtualAccount(AmountToPay, trxId, userDetail[0].nama, '0' + userDetail[0].no_hp, userDetail[0].email, paramCb.virtual_account, descText, null);
                //insert VA no to table asset borrower.
                await VirtualAccData.insertVirtualDataBrw(userData[0].user_code, unpaidInstallment[0].loan_code, createNewVA.virtual_account, AmountToPay, trxId, 0, descText);

                return h.response((createNewVA.virtual_account) ? {'status': '000'} : {'status': 'failed'});

            }

            return h.response('Error while checking, Transaction ID doesnt exist');

        } else if (roleTransaction === 2) {
            // Update Table VA INVESTOR TRANSACTION | Update status_payment, datetime_payment
            const updateVaStatus = await AdminHelper.updatePaymentVa(paramCb.virtual_account, paramCb.trx_id, paramCb.payment_ntb, paramCb.datetime_payment);
            return h.response((updateVaStatus === 'OK') ? { 'status': '000' } : { 'status': 'failed' });

        }

        return h.response('Error while checking, Transaction ID doesnt exist');

    } catch (err) {
        Logger.write.log('error', 'transfer VA transaction callback error');
        throw Boom.notFound(err.message);
    }
};

const transferRdlProcess = async (request, h) => {
    const req = request.payload;
    // const req = {
    //     'account_number': '12312312301',
    //     'payment_amount': '100000',
    //     'accounting_flag': 'C',
    //     'journal_number': '75610',
    //     'datetime_payment': '2019-01-03 13:00:00'
    // };
    // const req = {
    //     'data': 'YlUoZTg5K1tpOTFvFxFqFmdtdCZkY29zY2tqRGopNiVZYz5kLC0wVmAfZl98HWEUdmVnFGd0dnoYMyRhYCwoLGNfKkcyKWEMCnZ5bGwMdBthYWUSbSE3G0MpLkcNdXtwFgNwEnRxYBUaeRsrJGQ-YSg3O1MnFGtodGFpGB5rWmETKXENZ3ojbUwsMzA7UylnMDYxRDY0QS4nQDVkSHY',
    //     'p2p_id': 'DANON'
    // };

    // Logger.write.log('info', 'callback for transfer VA= ' + req);
    try {
        // const paramCb = req;
        const paramCb = await BniRdl.rdlCallback(req.data);
        // for account no
        const assetInfo = await AssetHelper.getAssetInfo(paramCb.account_number);

        await AssetHelper.sendInvestorPks(assetInfo[0].user_code);
        // insert ke asset_txn, adjust database
        await AssetHelper.insertAssetTxn(assetInfo[0].user_code, paramCb.account_number, paramCb.payment_amount, await ConstantHelper.getValue('danonBankName'),
            paramCb.accounting_flag, paramCb.journal_number, paramCb.datetime_payment);

        await AssetHelper.updateAsset(paramCb.account_number, assetInfo[0].balance, paramCb.payment_amount, (paramCb.accounting_flag === 'C') ? 0 : 1);

        return h.response({'status': '000'});

    } catch (err) {
        Logger.write.log('error', 'transfer rdl callback error');
        return h.response({'status': '000'});
        // throw Boom.notFound(err.message);
    }
};

exports.plugin = {
    register: (server, options) => {
        options = _.extend({ basePath: '' }, options);

        server.route([{
            method: 'POST',
            path: options.basePath + '/payment',
            handler: paymentProcess,
            options: {
                description: 'Get callback from payment success',
                tags: ['api', 'payment'],
                auth: false
            }
        }, {
            method: 'POST',
            path: options.basePath + '/get-asset',
            handler: getTotalAsset,
            options: {
                description: 'Get total asset',
                tags: ['api', 'asset'],
                auth: false,
                validate: {
                    payload: {
                        userCode: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/get-transaction',
            handler: getAllTransaction,
            options: {
                description: 'Get all the transaction',
                tags: ['api', 'asset'],
                auth: false,
                validate: {
                    payload: {
                        userCode: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/disbursement-request',
            handler: disbursementRequest,
            options: {
                description: 'Request for disbursement',
                tags: ['api', 'asset', 'disbursement'],
                auth: false,
                validate: {
                    payload: {
                        userCode: Joi.string().required(),
                        amount: Joi.string().required(),
                        bankName: Joi.string(),
                        name: Joi.string(),
                        accountNo: Joi.string(),
                        descriptions: Joi.string()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/disbursement',
            handler: disbursementProcess,
            options: {
                description: 'Get callback from payment success',
                tags: ['api', 'payment'],
                auth: false
            }
        }, {
            method: 'POST',
            path: options.basePath + '/bank-detail',
            handler: getAccountBankDetailByUserCode,
            options: {
                description: 'Get account bank detail',
                tags: ['api', 'payment'],
                auth: false,
                validate: {
                    payload: {
                        userCode: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/va-payment',
            handler: transferVAProcess,
            options: {
                description: 'Handle callback for VA transaction',
                tags: ['api', 'payment'],
                auth: false
            }
        }, {
            method: 'POST',
            path: options.basePath + '/rdl-payment',
            handler: transferRdlProcess,
            options: {
                description: 'Handle callback for RDL transaction',
                tags: ['api', 'payment'],
                auth: false
            }
        }]);
    },

    'name': 'api-asset'
};
