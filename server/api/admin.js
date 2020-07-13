const _ = require('lodash');
const Joi = require('joi');
const Boom = require('boom');
const UtilsHelper = require('../helper/utilsHelper');
const AdminHelper = require('../helper/adminHelper');
const AssetHelper = require('../helper/assetHelper');
const LoanHelper = require('../helper/loanHelper');
const PayinApi = require('../service/payin');
const BniRDL = require('../service/bniRDL');
const AuthHelper = require('../helper/authHelper');
const UtilHelper = require('../helper/utilsHelper');
const EmailHelper = require('../helper/emailHelper');
const DigisignData = require('../model/digisignData');

const createVirtualAccount = async (request, h) => {
    const req = request.payload;
    try {
        const virtualAccountNo = await UtilsHelper.generateVirtualAccountNo(req.msisdn);
        return h.response(virtualAccountNo);
    } catch (err) {
        throw Boom.notFound('error', err);
    }
};

const getAllBorrower = async (request, h) => {
    try {
        const borrower = await AdminHelper.getAllNewBorrower(1, 0);
        return h.response({ borrower });
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const getAllInvestor = async (request, h) => {
    try {
        const investor = await AdminHelper.getAllNewInvestor(2, 0);
        return h.response({ investor });
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const createAdmin = async (request, h) => {
    const req = request.payload;
    const adminRole = request.auth.credentials.role;
    try {
        if (adminRole === 3) {
            const userCode = await UtilHelper.generateUserCodeAdmin(req.name, req.roleId);
            console.log(userCode);
            const hashPassword = await AuthHelper.hashPassword(req.password);
            const insertAuth = await AuthHelper.insertAuthAdmin(req.email, hashPassword);
            const insertUser = await AuthHelper.insertUserAdmin(insertAuth, req.name, req.roleId, userCode);
            return h.response(insertUser);
        }
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const approveBorrowerWithVA = async (request, h) => {
    const req = request.payload;
    const virtualBank = 'MANDIRI';
    const adminName = request.auth.credentials.userCode;
    try {
        if (req.approval === 1) {
            const virtualAccData = JSON.parse(await PayinApi.createVirtualAccount(req.name, virtualBank));
            const insertStatus = await AssetHelper.insertAsset(req.userCode, virtualAccData.account_number, virtualAccData.external_id, 1);
            if (insertStatus.status !== 'ok') {
                const failedResponse = {
                    'statusCode': 'E0001',
                    'response': 'Failed',
                    'message': 'Ooops ! Something wrong with our ends'
                };
                return h.response(failedResponse);
            }
            //store response value from external api as backup
            //store history trx of approve new investor & create virtual Account
        }

        const approvalStatus = await AdminHelper.approveUser(req.userCode, 1, adminName, req.approval);
        return h.response(approvalStatus);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const approveBorrower = async (request, h) => {
    const req = request.payload;
    const adminName = request.auth.credentials.userCode;
    try {
        await DigisignData.insertDataDigisign(req.userCode);

        const digiResponse = await AssetHelper.registrationDigisign(req.userCode);

        if (digiResponse === 'ok') {
            const approvalStatus = await AdminHelper.approveUser(req.userCode, 1, adminName, req.approval);
            // send email notification if success
            if(approvalStatus.statusCode === 'C0001') {
                const getDataUser = await AuthHelper.getUserDetailFromCode(req.userCode);
                const getDataEmail = await EmailHelper.dataAccountApproval(getDataUser[0].nama, getDataUser[0].email);
                await EmailHelper.sendEmail(getDataEmail, 'account-approval-notification');
            }

            return h.response(approvalStatus);
        }

        const failedRes = await UtilsHelper.failedResponse(1, digiResponse);
        return h.response(failedRes);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const approveInvestor = async (request, h) => {
    const req = request.payload;
    const adminName = request.auth.credentials.userCode;
    try {
        await DigisignData.insertDataDigisign(req.userCode);

        const digiResponse = await AssetHelper.registrationDigisign(req.userCode);

        if (digiResponse === 'ok') {

            const approveStatus = await AdminHelper.approveUser(req.userCode, 2, adminName, req.approval);
            // send email notification if success
            if(approveStatus.statusCode === 'C0001') {
                const getDataUser = await AuthHelper.getUserDetailFromCode(req.userCode);
                const getDataEmail = await EmailHelper.dataAccountApproval(getDataUser[0].nama, getDataUser[0].email);
                await EmailHelper.sendEmail(getDataEmail, 'account-approval-notification');

            }

            return h.response(approveStatus);
        }

        const failedRes = await UtilsHelper.failedResponse(1, digiResponse);
        return h.response(failedRes);
    } catch (err) {
        console.log('===error in approve investor: ', err);
        return Boom.badRequest(err.message);
    }
};

const approveLoan = async (request, h) => {
    const req = request.payload;
    const adminName = request.auth.credentials.userCode;
    const addFee = (req.serviceFee) ? req.serviceFee : 0;
    const reasonRej = (req.reasonReject) ? req.reasonReject : ' ';
    let calculateAdminFee = null;

    try {
        const loanDetail = await LoanHelper.getUserFromLoan(req.loanCode);
        const approvalUserStatus = await AuthHelper.checkApprovalStatus(loanDetail[0].user_code);

        if (req.approval === 1) {
            await LoanHelper.updateInterest(req.loanCode, req.grade, loanDetail[0].lama_tenor, addFee);
            calculateAdminFee = await LoanHelper.calculateAdminFee(req.loanCode, loanDetail[0].jumlah_pinjaman);
        }

        const approvalStatus = await AdminHelper.approveLoan(approvalUserStatus[0].approval, req.loanCode, req.approval, req.bunga, req.grade, adminName, calculateAdminFee, reasonRej);

        return h.response(approvalStatus);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const getFullBalance = async (request, h) => {
    try {
        const balance = await PayinApi.checkBalance();
        return h.response(balance);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const getSystemVariable = async (request, h) => {
    try {
        if (request.params.id === undefined) {
            const systemVariable = await AdminHelper.getSystemVariable(request.params.type);
            return h.response(systemVariable);
        }

        const systemVariable = await AdminHelper.getSystemVariableById(request.params.type, request.params.id);
        return h.response(systemVariable);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const addSystemVariable = async (request, h) => {
    const isNew = request.payload.id === 0;
    try {
        const systemVariable = isNew ? await AdminHelper.addSystemVariable(request.params.type, request.payload.item)
            : await AdminHelper.updateSystemVariable(request.payload.id, request.payload.item);
        return h.response(systemVariable);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const getBungaByTenor = async (request, h) => {
    try {
        const tenor = request.params.tenor !== undefined ? request.params.tenor : 0;
        const tenorType = request.params.tenorType !== undefined ? request.params.tenorType : '';
        const id = request.params.id !== undefined ? request.params.id : 0;
        const bungaByTenor = await AdminHelper.getBungaByTenor(tenorType, tenor, id);
        return h.response(bungaByTenor);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const insertInterestRate = async (request, h) => {
    try {
        const isNew = request.payload.interestId === 0;
        const insertInterestRateStatus = isNew ? await AdminHelper.insertInterestRate(request.payload.ratingId, request.payload.tenorId, request.payload.bunga, request.payload.serviceFee, request.payload.borrowerFee)
            : await AdminHelper.updateInterestRate(request.payload.interestId, request.payload.ratingId, request.payload.tenorId, request.payload.bunga, request.payload.serviceFee, request.payload.borrowerFee);
        return h.response(insertInterestRateStatus);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const createVA = async (request, h) => {
    const req = request.payload;
    try {
        const virtualAccountNo = await AdminHelper.createVirtualAccount(req);
        return h.response(virtualAccountNo);
    } catch (err) {
        throw Boom.notFound(err.message);
    }
};

const getTokenAPI = async (request, h) => {
    try {
        const virtualAccountNo = await BniRDL.getApiToken();
        return h.response(virtualAccountNo);
    } catch (err) {
        throw Boom.notFound(err.message);
    }
};

const createCIFInvestor = async (request, h) => {
    const req = request.payload;
    try {
        const createCIFInvestors = await BniRDL.registerCIFInvestor(
            req.title,
            req.firstName,
            req.middleName,
            req.lastName,
            req.optNPWP,
            req.NPWPNum,
            req.nationality,
            req.domicileCountry,
            req.religion,
            req.birthPlace,
            req.birthDate,
            req.gender,
            req.isMarried,
            req.motherMaidenName,
            req.jobCode,
            req.education,
            req.idNumber,
            req.idIssuingCity,
            req.idExpiryDate,
            req.addressStreet,
            req.addressRtRwPerum,
            req.addressKel,
            req.addressKec,
            req.zipCode,
            req.homePhone1,
            req.homePhone2,
            req.officePhone1,
            req.officePhone2,
            req.mobilePhone1,
            req.mobilePhone2,
            req.faxNum1,
            req.faxNum2,
            req.branchOpening,
            req.monthlyIncome,
            req.email);

        return h.response(createCIFInvestors);
    } catch (err) {
        throw Boom.notFound(err.message);
    }
};

const createRDLinvestor = async (request, h) => {
    const req = request.payload;
    try {
        const createRDLAccount = await BniRDL.registerRDLInvestor(
            req.cifNumber,
            req.accountType,
            req.currency,
            req.openAccountReason,
            req.sourceOfFund,
            req.branchId
        );
        return h.response(createRDLAccount);
    } catch (err) {
        throw Boom.notFound(err.message);
    }
};

const getInquiryAccountInfo = async (request, h) => {
    const req = request.payload;
    try {
        const inquiryAccountInfo = await BniRDL.inquiryAccountInfo(
            req.accountNumber
        );
        return h.response(inquiryAccountInfo);
    } catch (err) {
        throw Boom.notFound(err.message);
    }
};

const getInquiryAccountBalance = async (request, h) => {
    const req = request.payload;
    try {
        const inquiryAccountBalance = await BniRDL.inquiryAccountBalance(
            req.accountNumber
        );
        return h.response(inquiryAccountBalance);
    } catch (err) {
        throw Boom.notFound(err.message);
    }
};

const getInquiryAccountHistory = async (request, h) => {
    const req = request.payload;
    try {
        const inquiryAccountHistory = await BniRDL.inquiryAccountHistory(
            req.accountNumber
        );
        return h.response(inquiryAccountHistory);
    } catch (err) {
        throw Boom.notFound(err.message);
    }
};

const getInquiryPaymentStatus = async (request, h) => {
    const req = request.payload;
    try {
        const inquiryPaymentStatus = await BniRDL.inquiryPaymentStatus(
            req.requestedUuid
        );
        return h.response(inquiryPaymentStatus);
    } catch (err) {
        throw Boom.notFound(err.message);
    }
};

const getInquiryInterbankAccount = async (request, h) => {
    const req = request.payload;
    try {
        const inquiryInterbankAccount = await BniRDL.inquiryInterbankAccount(
            req.accountNumber,
            req.beneficiaryBankCode,
            req.beneficiaryAccountNumber
        );
        return h.response(inquiryInterbankAccount);
    } catch (err) {
        throw Boom.notFound(err.message);
    }
};

const PaymentUsingTransfer = async (request, h) => {
    const req = request.payload;
    try {
        const paymentUsingTransfer = await BniRDL.paymentUsingTransfer(
            req.accountNumber,
            req.beneficiaryAccountNumber,
            req.currency,
            req.amount,
            req.remark
        );
        return h.response(paymentUsingTransfer);
    } catch (err) {
        throw Boom.notFound(err.message);
    }
};

const PaymentUsingClearing = async (request, h) => {
    const req = request.payload;
    try {
        const paymentUsingClearing = await BniRDL.paymentUsingClearing(
            req.accountNumber,
            req.beneficiaryAccountNumber,
            req.beneficiaryAddress1,
            req.beneficiaryAddress2,
            req.beneficiaryBankCode,
            req.beneficiaryName,
            req.currency,
            req.amount,
            req.remark,
            req.chargingType
        );
        return h.response(paymentUsingClearing);
    } catch (err) {
        throw Boom.notFound(err.message);
    }
};

const PaymentUsingRTGS = async (request, h) => {
    const req = request.payload;
    try {
        const paymentUsingRTGS = await BniRDL.paymentUsingRTGS(
            req.accountNumber,
            req.beneficiaryAccountNumber,
            req.beneficiaryAddress1,
            req.beneficiaryAddress2,
            req.beneficiaryBankCode,
            req.beneficiaryName,
            req.currency,
            req.amount,
            req.remark,
            req.chargingType
        );
        return h.response(paymentUsingRTGS);
    } catch (err) {
        throw Boom.notFound(err.message);
    }
};

const PaymentUsingInterbank = async (request, h) => {
    const req = request.payload;
    try {
        const paymentUsingInterbank = await BniRDL.paymentUsingInterbank(
            req.accountNumber,
            req.beneficiaryAccountNumber,
            req.beneficiaryAccountName,
            req.beneficiaryBankCode,
            req.beneficiaryBankName,
            req.amount
        );
        return h.response(paymentUsingInterbank);
    } catch (err) {
        throw Boom.notFound(err.message);
    }
};

const DisbursementBorrowerLoan = async (request, h) => {
    const req = request.payload;
    try {
        const disburseLoan = await AdminHelper.disbursToEscrow(
            req.loanCode
        );
        return h.response(disburseLoan);
    } catch (err) {
        throw Boom.notFound(err.message);
    }
};

const DisbursementInvestorRdl = async (request, h) => {
    const req = request.payload;
    try {
        const disburseLoan = await AssetHelper.disbursInvestorRdl(
            req.userCode
        );

        return h.response(disburseLoan);
    } catch (err) {
        console.log('==error disburse investor: ', err);
        throw Boom.notFound(err.message);
    }
};

const InsertAssetUserInvestor = async (request, h) => {
    const req = request.payload;
    try {
        const assetUser = await AssetHelper.insertAsset(
            req.userCode,
            req.virtualAcc,
            req.accountId,
            '2'
        );
        return h.response(assetUser);
    } catch (err) {
        throw Boom.notFound(err.message);
    }
};

const getRemainingTimeToken = async (request, h) => {
    const req = request.payload;
    try {
        const remainingTime = await AdminHelper.getRemainingTimeToken();
        return h.response(remainingTime);
    } catch (err) {
        throw Boom.notFound(err.message);
    }
};

const getAgentComission = async (request, h) => {
    const req = request.payload;
    try {
        const listAgentComission = await AdminHelper.getListAgentComission();
        return h.response(listAgentComission);
    } catch (err) {
        throw Boom.notFound(err.message);
    }
};

const InsertAgentComissionSetting = async (request, h) => {
    const req = request.payload;
    try {
        const insertDataAgentComission = await AdminHelper.insertNewAgentComission(
            req.interestComission,
            req.lowerLimit,
            req.upperLimit,
            req.createdBy
        );
        return h.response(insertDataAgentComission);
    } catch (err) {
        throw Boom.notFound(err.message);
    }
};

const UpdateAgentComissionSetting = async (request, h) => {
    const req = request.payload;
    try {
        const updateDataAgentComission = await AdminHelper.updateDataAgentComission(
            req.idAgentComission,
            req.interestComission,
            req.lowerLimit,
            req.upperLimit,
            req.updatedBy
        );
        return h.response(updateDataAgentComission);
    } catch (err) {
        throw Boom.notFound(err.message);
    }
};

const DeleteAgentComissionSetting = async (request, h) => {
    const req = request.payload;
    try {
        const deleteDataAgentComissions = await AdminHelper.deleteDataAgentComission(
            req.idAgentComission,
            req.deletedBy
        );
        return h.response(deleteDataAgentComissions);
    } catch (err) {
        throw Boom.notFound(err.message);
    }
};

const getDataCollateralType = async (request, h) => {
    try {
        const dataColType = await AdminHelper.getCollateralType();
        return h.response(dataColType);
    } catch (err) {
        throw Boom.notFound(err.message);
    }
};

const getDataCollateralDetail = async (request, h) => {
    const req = request.payload;
    try {
        const dataDetail = await AdminHelper.getCollateraldetail(req.type);
        return h.response(dataDetail);
    } catch (err) {
        throw Boom.notFound(err.message);
    }
};

const createCollateralType = async (request, h) => {
    const req = request.payload;
    try {
        const createColType = await AdminHelper.createColType(req.colType);
        return h.response(createColType);
    } catch (err) {
        throw Boom.notFound(err.message);
    }
};

const createCollateralDetail = async (request, h) => {
    const req = request.payload;
    try {
        var obj = JSON.parse(req.nameField);
        for(let i = 0; i < obj['data'].length; i++) {
            console.log('data: ' + obj['data'][i]);
            if(obj['data'][i]) {
                const createColDetail = await AdminHelper.createColDetail(req.typeId, obj['data'][i]);
            }
        }

        const createColDetail = 'ok';
        return h.response(createColDetail);
    } catch (err) {
        throw Boom.notFound(err.message);
    }
};

exports.plugin = {
    register: (server, options) => {
        options = _.extend({ basePath: '' }, options);

        server.route([{
            method: 'POST',
            path: options.basePath + '/create-account',
            handler: createVirtualAccount,
            options: {
                description: 'Create virtual account for User',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        msisdn: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/get-new-borrower',
            handler: getAllBorrower,
            options: {
                description: 'Get all borrower list not yet approved by admin',
                tags: ['api', 'borrower']
            }
        }, {
            method: 'POST',
            path: options.basePath + '/get-new-investor',
            handler: getAllInvestor,
            options: {
                description: 'Get all investor list not yet approved by admin',
                tags: ['api', 'investor']
            }
        }, {
            method: 'POST',
            path: options.basePath + '/approve-investor',
            handler: approveInvestor,
            options: {
                description: 'Investor approval process done by admin',
                tags: ['api', 'investor'],
                validate: {
                    payload: {
                        userCode: Joi.string().required(),
                        approval: Joi.number().required(),
                        name: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/create-admin',
            handler: createAdmin,
            options: {
                description: 'Create new admin role by admin',
                tags: ['api', 'auth'],
                validate: {
                    payload: {
                        name: Joi.string().required(),
                        email: Joi.string().required(),
                        password: Joi.string().required(),
                        roleId: Joi.number().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/approve-borrower',
            handler: approveBorrower,
            options: {
                description: 'Borrower approval process done by admin',
                tags: ['api', 'borrower'],
                validate: {
                    payload: {
                        userCode: Joi.string().required(),
                        approval: Joi.number().required(),
                        name: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/approve-loan',
            handler: approveLoan,
            options: {
                description: 'Loan approval process done by admin',
                tags: ['api', 'loan'],
                validate: {
                    payload: {
                        loanCode: Joi.string().required(),
                        approval: Joi.number().required(),
                        bunga: Joi.number(),
                        grade: Joi.string(),
                        serviceFee: Joi.number(),
                        reasonReject: Joi.string()
                    }
                }
            }
        }, {
            method: 'GET',
            path: options.basePath + '/get-collateral-type',
            handler: getDataCollateralType,
            options: {
                description: 'Get Type of collateral',
                tags: ['api', 'payment']
            }
        }, {
            method: 'POST',
            path: options.basePath + '/get-collateral-detail',
            handler: getDataCollateralDetail,
            options: {
                description: 'get Data Collateral Detail',
                tags: ['api', 'system'],
                validate: {
                    payload: {
                        type: Joi.number()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/create-collateral-type',
            handler: createCollateralType,
            options: {
                description: 'Create new Collateral Type',
                tags: ['api', 'system'],
                validate: {
                    payload: {
                        colType: Joi.string()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/create-collateral-detail',
            handler: createCollateralDetail,
            options: {
                description: 'Create new Collateral Detail',
                tags: ['api', 'system'],
                validate: {
                    payload: {
                        typeId: Joi.number(),
                        nameField: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'GET',
            path: options.basePath + '/balance',
            handler: getFullBalance,
            options: {
                description: 'Get full balance in wallet',
                tags: ['api', 'payment']
            }
        }, {
            method: 'GET',
            path: options.basePath + '/system-variable/{type}',
            handler: getSystemVariable,
            options: {
                description: 'Get System Variable',
                tags: ['api', 'system'],
                auth: false
            }
        }, {
            method: 'GET',
            path: options.basePath + '/system-variable/{type}/{id}',
            handler: getSystemVariable,
            options: {
                description: 'Get System Variable',
                tags: ['api', 'system'],
                auth: false
            }
        }, {
            method: 'POST',
            path: options.basePath + '/system-variable/{type}',
            handler: addSystemVariable,
            options: {
                description: 'Add System Variable',
                tags: ['api', 'system'],
                auth: false,
                validate: {
                    payload: {
                        id: Joi.number(),
                        item: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/interest',
            handler: insertInterestRate,
            options: {
                description: 'Add Interest Rate',
                tags: ['api', 'interest']
            }
        }, {
            method: 'GET',
            path: options.basePath + '/interest/tenor',
            handler: getBungaByTenor,
            options: {
                description: 'Get all tenor',
                tags: ['api', 'tenor'],
                auth: false
            }
        }, {
            method: 'GET',
            path: options.basePath + '/interest/{id}',
            handler: getBungaByTenor,
            options: {
                description: 'Get all tenor',
                tags: ['api', 'tenor'],
                auth: false
            }
        }, {
            method: 'GET',
            path: options.basePath + '/interest/tenor/{tenorType}',
            handler: getBungaByTenor,
            options: {
                description: 'Get bunga by tenor type and tenor length',
                tags: ['api', 'tenor'],
                auth: false
            }
        }, {
            method: 'GET',
            path: options.basePath + '/interest/tenor/{tenorType}/{tenor}',
            handler: getBungaByTenor,
            options: {
                description: 'Get bunga by tenor type and tenor length',
                tags: ['api', 'tenor'],
                auth: false
            }
        }, {
            method: 'POST',
            path: options.basePath + '/create-va',
            handler: createVA,
            options: {
                description: 'Create virtual account for User',
                tags: ['api', 'auth'],
                auth: false
            }
        }, {
            method: 'POST',
            path: options.basePath + '/get-token',
            handler: getTokenAPI,
            options: {
                description: 'Get token for bni opertion',
                tags: ['api', 'auth'],
                auth: false
            }
        }, {
            method: 'POST',
            path: options.basePath + '/create-cif-investor',
            handler: createCIFInvestor,
            options: {
                description: 'Create CIF Investor to BNI ',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        title: Joi.string().required(),
                        firstName: Joi.string().required(),
                        middleName: Joi.string(),
                        lastName: Joi.string().required(),
                        optNPWP: Joi.string().required(),
                        NPWPNum: Joi.string().required(),
                        nationality: Joi.string().required(),
                        domicileCountry: Joi.string().required(),
                        religion: Joi.string().required(),
                        birthPlace: Joi.string().required(),
                        birthDate: Joi.string().required(),
                        gender: Joi.string().required(),
                        isMarried: Joi.string().required(),
                        motherMaidenName: Joi.string().required(),
                        jobCode: Joi.string().required(),
                        education: Joi.string().required(),
                        idNumber: Joi.string().required(),
                        idIssuingCity: Joi.string().required(),
                        idExpiryDate: Joi.string().required(),
                        addressStreet: Joi.string().required(),
                        addressRtRwPerum: Joi.string().required(),
                        addressKel: Joi.string().required(),
                        addressKec: Joi.string().required(),
                        zipCode: Joi.string().required(),
                        homePhone1: Joi.string().required(),
                        homePhone2: Joi.string().required(),
                        officePhone1: Joi.string(),
                        officePhone2: Joi.string(),
                        mobilePhone1: Joi.string().required(),
                        mobilePhone2: Joi.string().required(),
                        faxNum1: Joi.string(),
                        faxNum2: Joi.string(),
                        branchOpening: Joi.string().required(),
                        monthlyIncome: Joi.string().required(),
                        email: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/create-rdl-investor',
            handler: createRDLinvestor,
            options: {
                description: 'Create RDL Investor to BNI ',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        cifNumber: Joi.string().required(),
                        accountType: Joi.string().required(),
                        currency: Joi.string().required(),
                        openAccountReason: Joi.string().required(),
                        sourceOfFund: Joi.string().required(),
                        branchId: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/inquiry-account-info',
            handler: getInquiryAccountInfo,
            options: {
                description: 'Inquiry account info for BNI RDL',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        accountNumber: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/inquiry-account-balance',
            handler: getInquiryAccountBalance,
            options: {
                description: 'Inquiry account balance for BNI RDL',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        accountNumber: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/inquiry-account-history',
            handler: getInquiryAccountHistory,
            options: {
                description: 'Inquiry account history for BNI RDL',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        accountNumber: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/inquiry-payment-status',
            handler: getInquiryPaymentStatus,
            options: {
                description: 'Inquiry payment status for BNI RDL',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        requestedUuid: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/inquiry-interbank-account',
            handler: getInquiryInterbankAccount,
            options: {
                description: 'Inquiry interbank account for BNI RDL',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        accountNumber: Joi.string().required(),
                        beneficiaryBankCode: Joi.string().required(),
                        beneficiaryAccountNumber: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/payment-using-transfer',
            handler: PaymentUsingTransfer,
            options: {
                description: 'Payment using transfer for BNI RDL',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        accountNumber: Joi.string().required(),
                        beneficiaryAccountNumber: Joi.string().required(),
                        currency: Joi.string().required(),
                        amount: Joi.string().required(),
                        remark: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/payment-using-clearing',
            handler: PaymentUsingClearing,
            options: {
                description: 'Payment using clearing for BNI RDL',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        accountNumber: Joi.string().required(),
                        beneficiaryAccountNumber: Joi.string().required(),
                        beneficiaryAddress1: Joi.string().required(),
                        beneficiaryAddress2: Joi.string().required(),
                        beneficiaryBankCode: Joi.string().required(),
                        beneficiaryName: Joi.string().required(),
                        currency: Joi.string().required(),
                        amount: Joi.string().required(),
                        remark: Joi.string().required(),
                        chargingType: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/payment-using-rtgs',
            handler: PaymentUsingRTGS,
            options: {
                description: 'Payment using rtgs for BNI RDL',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        accountNumber: Joi.string().required(),
                        beneficiaryAccountNumber: Joi.string().required(),
                        beneficiaryAddress1: Joi.string().required(),
                        beneficiaryAddress2: Joi.string().required(),
                        beneficiaryBankCode: Joi.string().required(),
                        beneficiaryName: Joi.string().required(),
                        currency: Joi.string().required(),
                        amount: Joi.string().required(),
                        remark: Joi.string().required(),
                        chargingType: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/payment-using-interbank',
            handler: PaymentUsingInterbank,
            options: {
                description: 'Payment using interbank for BNI RDL',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        accountNumber: Joi.string().required(),
                        beneficiaryAccountNumber: Joi.string().required(),
                        beneficiaryAccountName: Joi.string().required(),
                        beneficiaryBankCode: Joi.string().required(),
                        beneficiaryBankName: Joi.string().required(),
                        amount: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/disburse-borrower-loan',
            handler: DisbursementBorrowerLoan,
            options: {
                description: 'Disbursement borrower loan from admin page',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        loanCode: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/disburse-investor-rdl',
            handler: DisbursementInvestorRdl,
            options: {
                description: 'Disbursement borrower loan from admin page',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        userCode: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/insert-asset-user-investor',
            handler: InsertAssetUserInvestor,
            options: {
                description: 'Insert asset user Investor',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        userCode: Joi.string().required(),
                        virtualAcc: Joi.string().required(),
                        accountId: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/get-remaining-time-token',
            handler: getRemainingTimeToken,
            options: {
                description: 'Get remaining Time Token BNI',
                tags: ['api', 'auth'],
                auth: false
            }
        }, {
            method: 'POST',
            path: options.basePath + '/get-agent-comission',
            handler: getAgentComission,
            options: {
                description: 'Get List Agent Comission Setting',
                tags: ['api', 'auth'],
                auth: false
            }
        }, {
            method: 'POST',
            path: options.basePath + '/insert-agent-comission',
            handler: InsertAgentComissionSetting,
            options: {
                description: 'Insert Agent Comission Setting',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        interestComission: Joi.number().required(),
                        lowerLimit: Joi.number().required(),
                        upperLimit: Joi.number().required(),
                        createdBy: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/update-agent-comission',
            handler: UpdateAgentComissionSetting,
            options: {
                description: 'Update Data Agent Comission Setting',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        idAgentComission: Joi.number().required(),
                        interestComission: Joi.number().required(),
                        lowerLimit: Joi.number().required(),
                        upperLimit: Joi.number().required(),
                        updatedBy: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/delete-agent-comission',
            handler: DeleteAgentComissionSetting,
            options: {
                description: 'Delete Data Agent Comission Setting',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        idAgentComission: Joi.number().required(),
                        deletedBy: Joi.string().required()
                    }
                }
            }
        }]);
    },

    'name': 'api-admin'
};
