const _ = require('lodash');
const Boom = require('boom');
const Joi = require('joi');

const FileHelper = require('../helper/fileHelper');
const LoanHelper = require('../helper/loanHelper');
const AssetHelper = require('../helper/assetHelper');
const PayinApi = require('../service/payin');
const FundingHelper = require('../helper/fundingHelper');
const BorrowerHelper = require('../helper/borrowerHelper');
const ConstantHelper = require('../helper/constantHelper');
const InstallmentHelper = require('../helper/installmentHelper');
const AdminHelper = require('../helper/adminHelper');
const DividenHelper = require('../helper/dividenHelper');
const LoanData = require('../model/loanData');

const getAllLoans = async (request, h) => {
    const req = request.payload;
    try {
        const loans = await LoanHelper.getAllLoanList(req.status);
        return h.response({ loans });
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const getNewLoans = async (request, h) => {
    const req = request.payload;
    try {
        const loans = await LoanHelper.getNewLoanList();
        return h.response({ loans });
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const getLoanDetail = async (request, h) => {
    const req = request.payload;
    try {
        const loanDetails = await LoanHelper.getLoanDetail(req.loanCode);
        console.log('datanya: ' + loanDetails[0].id_loan_type);
        if(loanDetails[0].id_loan_type === 3) {
            console.log('masuk ke fungsi if');
            console.log('loan_code : ' + loanDetails[0].loan_code);
            const dataPayor = await LoanHelper.getDataPayor(loanDetails[0].loan_code);
            return h.response({loanDetails, dataPayor});
        }

        return h.response({ loanDetails });
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const insertLoan = async (request, h) => {
    const req = request.payload;
    try {
        const finalResponse = await LoanHelper.insertLoan(req.idBorrower, req.idLoanType, req.jumlahPinjaman,
            req.lamaTenor, req.sukuBunga, req.grade, req.jatuhTempo, req.tujuan, req.dokumen1, req.dokumen2, req.dokumen3, req.dokumen4, req.dokumen5, req.dokumen6, req.dokumen7, req.dokumen8, req.dokumen9, req.dokumen10, req.interestType, req.fotoProject);

            return h.response(finalResponse);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const updateLoanDocument = async (request, h) => {
    const req = request.payload;
    try {
        const finalResponse = await LoanHelper.updateLoanDocument(req.idLoan, req.projectImage, req.dokumen1, req.dokumen2, req.dokumen3, req.dokumen4, req.dokumen5, req.dokumen6, req.dokumen7, req.dokumen8, req.dokumen9, req.dokumen10);
        return h.response(finalResponse);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const disbursementLoanRequest = async (request, h) => {

    const req = request.payload;
    //process.stdout.write("disbursementLoanRequest::entering::" + request.auth.credentials + "\n");
    let userCode = 'SuperAdmin';
    //process.stdout.write("disbursementLoanRequest::request.auth.credentials" + request.auth.credentials + "\n");
    if (request.auth.credentials !== null && request.auth.credentials.userCode !== null) {
        userCode = request.auth.credentials.userCode;
    }

    try {
        //process.stdout.write("disbursementLoanRequest::loanCode" + req.loanCode + "\n");
        const loanDetails = await LoanHelper.getUserFromLoan(req.loanCode);

        //need to check document status
        const docStatus = await LoanHelper.getDocumentSignStatus(loanDetails[0].user_code, req.loanCode);

        if (docStatus.response === 'Failed') {
            return h.response(docStatus);
        }

        //check first if the loan Detail status is already bigger than 2, reject disbursement request.
        if (loanDetails[0].status_approval < 3) {
            // create VA, and transfer to escrow
            const escrowTransfer = await AdminHelper.disbursToEscrow(req.loanCode);
            console.log('=====transfer to escrow:', escrowTransfer);

            if (escrowTransfer.statusCode === 'C0001') {
                console.log('===loanDetails: ', loanDetails[0]);
                const assetData = await AssetHelper.getDetailFromUser(loanDetails[0].user_code);
                console.log('===getassetdata: ', assetData[0]);
                const totalFunding = await FundingHelper.getTotalFunding(req.loanCode);
                console.log('===getfundingdata: ', totalFunding[0]);
                const adminFee = await LoanHelper.calculateAdminFee(req.loanCode, totalFunding[0].total_funding);
                console.log('===getadmindata: ', adminFee);

                await FundingHelper.updateAdminFee(adminFee, req.loanCode);

                const finalAmount = (totalFunding[0].total_funding - adminFee);
                console.log('finalamount', finalAmount);
                // transfer to danon giro
                console.log('===danondisdata: ',
                    await ConstantHelper.getValue('danonBankCode'),
                    await ConstantHelper.getValue('danonClearingCode'),
                    await ConstantHelper.getValue('danonRtgsCode'),
                    adminFee,
                    await ConstantHelper.getValue('danonGiroNo'),
                    req.descriptions,
                    await ConstantHelper.getValue('danonAddress1'),
                    await ConstantHelper.getValue('danonAddress2'),
                    await ConstantHelper.getValue('danonFullName'));

                const danonDisbursementApi = await AssetHelper.paymentIdrProcess(
                    await ConstantHelper.getValue('danonBankCode'),
                    await ConstantHelper.getValue('danonClearingCode'),
                    await ConstantHelper.getValue('danonRtgsCode'),
                    adminFee,
                    await ConstantHelper.getValue('danonGiroNo'),
                    req.descriptions,
                    await ConstantHelper.getValue('danonAddress1'),
                    await ConstantHelper.getValue('danonAddress2'),
                    await ConstantHelper.getValue('danonFullName'),
                    'BEN');

                console.log('=====danonDisbursementApi: ', danonDisbursementApi);

                await AssetHelper.insertDisbursement(
                    await ConstantHelper.getValue('danonUserCode'),
                    adminFee,
                    await ConstantHelper.getValue('danonBankName'),
                    1,
                    danonDisbursementApi.response.journal_number,
                    await ConstantHelper.getValue('danonGiroNo'),
                    await ConstantHelper.getValue('danonFullName'),
                    req.descriptions,
                    danonDisbursementApi.response.responseUuid);

                // transfer to borrower
                // const payinDisbursementApi = await AssetHelper.paymentIdrProcess(assetData[0].bank_code, assetData[0].clearing_code, assetData[0].rtgs_code, finalAmount,
                //     assetData[0].account_no, req.descriptions, assetData[0].address, null, assetData[0].full_name, 'BEN');

                const payinDisbursementApi = await AssetHelper.paymentIdrProcess(
                    assetData[0].bank_code,
                    assetData[0].clearing_code,
                    assetData[0].rtgs_code,
                    finalAmount,
                    null,
                    req.descriptions,
                    assetData[0].address,
                    null,
                    assetData[0].full_name,
                    'BEN');

                console.log('=====payinDisbursementApi: ', payinDisbursementApi);

                const requestDisbursement = await AssetHelper.insertDisbursement(
                    loanDetails[0].user_code,
                    finalAmount,
                    assetData[0].bank_name,
                    1,
                    payinDisbursementApi.response.journal_number,
                    assetData[0].account_no,
                    assetData[0].full_name,
                    req.descriptions,
                    payinDisbursementApi.response.responseUuid);

                // create installment plan and first va for borrower
                await InstallmentHelper.installmentCalculation(
                    loanDetails[0].user_code,
                    req.loanCode,
                    totalFunding[0].total_funding,
                    loanDetails[0].lama_tenor,
                    loanDetails[0].suku_bunga);

                const unpaidInstallment = await InstallmentHelper.getUnpaidInstallmentByLoanCodes(req.loanCode);
                console.log('===unpaidInstallment: ', unpaidInstallment);

                if (unpaidInstallment[0].plan === 1) {
                    await LoanHelper.approveLoan(req.loanCode, 3, userCode);
                    await FundingHelper.updateFundingStatus(req.loanCode, 3);
                }

                await LoanData.updateStatusDisburse(1, loanCode);
                // await DividenHelper.updateDividen(1, req.loanCode, unpaidInstallment[0].plan);
                return h.response(requestDisbursement);
            }
        }

        throw Boom.badRequest('disbursement already been requested');
    } catch (err) {
        throw Boom.badRequest(err.message);
    }
};

const disbursementLoanRequestv1 = async (request, h) => {

    const req = request.payload;
    //process.stdout.write("disbursementLoanRequest::entering::" + request.auth.credentials + "\n");
    let userCode = 'SuperAdmin';
    //process.stdout.write("disbursementLoanRequest::request.auth.credentials" + request.auth.credentials + "\n");
    if (request.auth.credentials !== null && request.auth.credentials.userCode !== null) {
        userCode = request.auth.credentials.userCode;
    }

    try {
        //process.stdout.write("disbursementLoanRequest::loanCode" + req.loanCode + "\n");
        const loanDetails = await LoanHelper.getUserFromLoan(req.loanCode);
        if (loanDetails[0].status_approval < 3) {
            //check first if the loan Detail status is already bigger than 2, reject disbursement request.
            //process.stdout.write("disbursementLoanRequest::loanDetails" + loanDetails[0].user_code + "\n");
            const assetData = await AssetHelper.getAssetFromUser(loanDetails[0].user_code);
            //process.stdout.write("disbursementLoanRequest::assetData" + assetData[0].account_id + "\n");
            const totalFunding = await FundingHelper.getTotalFunding(req.loanCode);
            //process.stdout.write("disbursementLoanRequest::totalFunding" + totalFunding[0].total_funding + "\n");
            const bankAccountDetail = await BorrowerHelper.getAccountBankDetailByUserCode(loanDetails[0].user_code);
            //  return h.response(bankAccountDetail);
            //  process.stdout.write("disbursementLoanRequest::bankAccountDetail" + bankAccountDetail[0].pg_code + "\n");
            const payinDisbursementApi = await PayinApi.disbursement(assetData[0].account_id, totalFunding[0].total_funding, bankAccountDetail[0].pg_code, bankAccountDetail[0].nama,
                bankAccountDetail[0].nomor_rekening, req.descriptions);
            //process.stdout.write("disbursementLoanRequest::payinDisbursementApi" + payinDisbursementApi + "\n");
            const requestDisbursement = await AssetHelper.insertDisbursement(loanDetails[0].user_code, totalFunding[0].total_funding, bankAccountDetail[0].nama_bank, 1,
                assetData[0].account_id, bankAccountDetail[0].nomor_rekening, bankAccountDetail[0].nama, req.descriptions, JSON.parse(payinDisbursementApi).id);

            await LoanHelper.approveLoan(req.loanCode, 3, userCode);

            //process.stdout.write("disbursementLoanRequest::requestDisbursement" + requestDisbursement + "\n");
            // const disbursementResponse = await AssetHelper.finalizeDisbursementRequest(requestDisbursement.status);
            // reduce amount in asset (temporary, will be updated based on status) tbl_assets
            // insert disbursement data in tbl_asset_txn
            // store api data from instaMoney
            // update history
            return h.response(requestDisbursement);
        }

        throw Boom.badRequest('disbursement already been requested');
    } catch (err) {
        throw Boom.badRequest(err.message);
    }
};

const getCountLoan = async (request, h) => {
    const req = request.payload;
    try {
        const getCount = await LoanHelper.getCountLoan(req.userCode);
        return h.response(getCount);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const insertLoanRiskProfile = async (request, h) => {
    const req = request.payload;
    try {
        const finalResponse = await LoanHelper.insertLoanRiskProfile(req.idLoan, req.title, req.desc);
        return h.response(finalResponse);

    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const insertPayorInformation = async (request, h) => {
    const req = request.payload;
    try {
        const finalResponse = await LoanHelper.insertPayorInformation(req.idLoan, req.jaminan, req.informasiPayor, req.industri, req.klasifikasi, req.nilaiTagihan);
        return h.response(finalResponse);

    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const updateLoanInfo = async (request, h) => {
    const req = request.payload;
    try {
        const finalResponse = await LoanHelper.updateLoanInfo(req.idLoan, req.payorDesc, req.tujuan);
        return h.response(finalResponse);

    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const saveDataCollateralToJSON = async (request, h) => {
    const req = request.payload;
    try {
        const getLoanCode = await LoanHelper.getLoanCode(req.idLoan);
        const saveData = await FileHelper.createCollateralFile(getLoanCode.loan_code, req.type, req.data);
        if(saveData.response === 'Success') {
            console.log('sudah masuk sini');
            const insertData = await LoanHelper.insertCollateralFile(getLoanCode.loan_code, saveData.fileName);
        }

        return h.response(saveData);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const getCollateralDetailBor = async (request, h) => {
    const req = request.payload;
    try {
        const getColId = await LoanHelper.getCollateralTypeId(req.type);
        if(getColId) {
            const getDataCollateralDetail = await AdminHelper.getCollateraldetail(getColId.id_collateral_type);
            return h.response(getDataCollateralDetail);
        }

        return h.response({'statusCode': 'E0002',
        'response': 'Failed',
        'message': 'No Data Found'});
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

exports.plugin = {
    register: (server, options) => {
        options = _.extend({ basePath: '' }, options);

        server.route([{
            method: 'POST',
            path: options.basePath + '/get-loans',
            handler: getAllLoans,
            options: {
                description: 'Get all loans based on status',
                tags: ['api', 'loans'],
                auth: false,
                validate: {
                    payload: {
                        status: Joi.number().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/get-count-loan',
            handler: getCountLoan,
            options: {
                description: 'Get details of specific loan',
                tags: ['api', 'loans'],
                auth: false,
                validate: {
                    payload: {
                        userCode: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/get-loan-detail',
            handler: getLoanDetail,
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
            path: options.basePath + '/disbursement-loan',
            handler: disbursementLoanRequest,
            options: {
                description: 'Request for loan disbursement',
                tags: ['api', 'loan', 'disbursement'],
                auth: false,
                validate: {
                    payload: {
                        loanCode: Joi.string().required(),
                        descriptions: Joi.string()
                    }
                }
            }
        }, {
            method: 'GET',
            path: '/getNewLoans',
            handler: getNewLoans,
            options: {
                description: 'Get New Loan Status Aproval 1 & >=3 limit 8',
                auth: false
            }
        }, {
            method: 'POST',
            path: options.basePath + '/update-loan-document',
            handler: updateLoanDocument,
            options: {
                description: 'update loan document',
                tags: ['api', 'loans'],
                auth: false,
                validate: {
                    payload: {
                        idLoan: Joi.number().required(),
                        dokumen1: Joi.string(),
                        dokumen2: Joi.string(),
                        dokumen3: Joi.string(),
                        dokumen4: Joi.string(),
                        dokumen5: Joi.string(),
                        dokumen6: Joi.string(),
                        dokumen7: Joi.string(),
                        dokumen8: Joi.string(),
                        dokumen9: Joi.string(),
                        dokumen10: Joi.string(),
                        projectImage: Joi.string()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/insert-loan-risk-profile',
            handler: insertLoanRiskProfile,
            options: {
                description: 'insert loan risk profile',
                tags: ['api', 'loans'],
                auth: false,
                validate: {
                    payload: {
                        idLoan: Joi.string().required(),
                        title: Joi.string().required(),
                        desc: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/insert-loan-payor-information',
            handler: insertPayorInformation,
            options: {
                description: 'insert loan risk profile',
                tags: ['api', 'loans'],
                auth: false,
                validate: {
                    payload: {
                        idLoan: Joi.number().required(),
                        jaminan: Joi.string(),
                        informasiPayor: Joi.string().required(),
                        industri: Joi.string().required(),
                        klasifikasi: Joi.string().required(),
                        nilaiTagihan: Joi.number().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/update-loan-info',
            handler: updateLoanInfo,
            options: {
                description: 'update loan information desc',
                tags: ['api', 'loans'],
                auth: false,
                validate: {
                    payload: {
                        idLoan: Joi.string().required(),
                        payorDesc: Joi.string().required(),
                        tujuan: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/save-data-collateral',
            handler: saveDataCollateralToJSON,
            options: {
                description: 'save data collateral to file JSON',
                tags: ['api', 'loans'],
                auth: false,
                validate : {
                    payload: {
                        idLoan: Joi.number().required(),
                        type: Joi.string().required(),
                        data: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/get-collateral-detail',
            handler: getCollateralDetailBor,
            options: {
                description: 'Get data collateral Detail',
                tags: ['api', 'loans'],
                validate : {
                    payload: {
                        type: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/insert-loan',
            handler: insertLoan,
            options: {
                description: 'Insert loan',
                tags: ['api', 'loans'],
                auth: false,
                validate: {
                    payload: {
                        idBorrower: Joi.string().required(),
                        idLoanType: Joi.number().required(),
                        jumlahPinjaman: Joi.number().required(),
                        lamaTenor: Joi.string().required(),
                        sukuBunga: Joi.string(),
                        grade: Joi.string(),
                        jatuhTempo: Joi.string(),
                        tujuan: Joi.string(),
                        dokumen1: Joi.string(),
                        dokumen2: Joi.string(),
                        dokumen3: Joi.string(),
                        dokumen4: Joi.string(),
                        dokumen5: Joi.string(),
                        dokumen6: Joi.string(),
                        dokumen7: Joi.string(),
                        dokumen8: Joi.string(),
                        dokumen9: Joi.string(),
                        dokumen10: Joi.string(),
                        interestType: Joi.number(),
                        fotoProject: Joi.string()
                    }
                }
            }
        }]);
    },

    'name': 'api-loans'
};
