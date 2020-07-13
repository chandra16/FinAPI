const AssetData = require('../model/assetData');
const UserData = require('../model/userData');
const DigisignData = require('../model/digisignData');
const BniRDL = require('../service/bniRDL');
const Digisign = require('../service/digiSign');
const ConstantHelper = require('./constantHelper');
const AuthHelper = require('./authHelper');
const Logger = require('./logger');
const Fs = require('fs');
const FileHelper = require('./fileHelper');
const Word2pdf = require('word2pdf');

const insertAsset = (userCode, virtualAcc, accountId, roleId) => {
    return new Promise((resolve, reject) => {
        try {
            const insertStatus = AssetData.insertAssetData(userCode, virtualAcc, accountId, roleId)
                .then((dataObject) => {
                    if (dataObject.affectedRows) {
                        return ({
                            'status': 'ok'
                        });
                    }

                    return ({
                        'status': 'failed'
                    });
                });

            return resolve(insertStatus);
        } catch (err) {
              Logger.write.log('error', 'insert Asset Data error: ' + err.message);
              return reject(err);
        }
    });
};

const getAsset = (accountId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (accountId) {
                const assetData = await AssetData.getCurrBalance(accountId);
                return resolve(assetData);
            }

            Logger.write.log('error', 'account / external Id not available.');
            return reject({'message': 'not available'});
        } catch (err) {
            Logger.write.log('error', 'get Asset Data error: ' + err.message);
            return reject(err);
        }
    });
};

const getAssetFromUser = (userCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (userCode) {
                const assetData = await AssetData.getAssetData(userCode);
                return resolve(assetData);
            }

            Logger.write.log('error', 'User not available.');
            return reject({'message': 'not available'});
        } catch (err) {
            Logger.write.log('error', 'get Asset Data using user code error: ' + err.message);
            return reject(err);
        }
    });
};

const getDetailFromUser = (userCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (userCode) {
                const assetData = await AssetData.getAssetDataBorrower(userCode);
                return resolve(assetData);
            }

            Logger.write.log('error', 'User not available.');
            return reject({'message': 'not available'});
        } catch (err) {
            Logger.write.log('error', 'get Asset Data using user code error: ' + err.message);
            return reject(err);
        }
    });
};

const getAssetInfo = (accountNo) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (accountNo) {
                const assetInfo = await AssetData.getAssetInfo(accountNo);
                return resolve(assetInfo);
            }

            Logger.write.log('error', 'account no not available.');
            return reject({'message': 'not available'});
        } catch (err) {
            Logger.write.log('error', 'get Asset Info error for ' + accountNo + ' : ' + err.message);
            return reject(err);
        }
    });
};

const insertDeposit = (userCode, virtualAcc, deposit, bankName, paymentId, txnDate, accountId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const assetData = await AssetData.insertDeposit(userCode, virtualAcc, deposit, bankName, 0, paymentId, txnDate, 1, accountId);
            return resolve(assetData);
        } catch (err) {
            Logger.write.log('error', 'insert asset transaction data error: ' + err.message);
            return reject(err);
        }
    });
};

const insertAssetTxn = (userCode, virtualAcc, deposit, bankName, txnType, journalNo, txnDate) => {
    return new Promise(async (resolve, reject) => {
        try {
            const assetData = await AssetData.insertAssetTxn(userCode, virtualAcc, deposit, bankName, txnType, journalNo, txnDate, 1);
            return resolve(assetData);
        } catch (err) {
            Logger.write.log('error', 'insert asset transaction data error: ' + err.message);
            return reject(err);
        }
    });
};

const updateAsset = (accountId, balance, deposit, type) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('balance: ', balance, deposit);
            const amount = (type === 0) ? (balance + parseInt(deposit)) : (balance - parseInt(deposit));
            const updateAssetData = await AssetData.updateBalance(accountId, amount);
            if (updateAssetData.affectedRows) {
                return resolve({'status': 'ok'});
            }

            return resolve({'status': 'failed'});
        } catch (err) {
            Logger.write.log('error', 'update Asset Data error: ' + err.message);
            return reject(err);
        }
    });
};

const getTotalAsset = (userCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            const asset = await AssetData.getTotalAsset(userCode);
            return resolve({asset: asset[0]});
        } catch (err) {
            Logger.write.log('error', 'get Total Asset Data error: ' + err.message);
            return reject(err);
        }
    });
};

const getAllHistory = (userCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            const transactions = await AssetData.getAllTransaction(userCode);
            return resolve({transactions});
        } catch (err) {
            Logger.write.log('error', 'get all asset transaction error: ' + err.message);
            return reject(err);
        }
    });
};

const checkPaymentId = (paymentId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const isPaymentExist = await AssetData.checkPaymentId(paymentId)
                .then((result) => {
                    return (result[0] ? true : false);
                });
            return resolve(isPaymentExist);
        } catch (err) {
            Logger.write.log('error', 'check payment id error: ' + err.message);
            return reject(err);
        }
    });
};

const insertDisbursement = (userCode, withdraw, bankName, transType, accountId, accountNo, name, description, disbursementId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const assetData = await AssetData.insertDisbursement(userCode, withdraw, bankName, transType, new Date().toISOString(), 1, accountId, accountNo, name,
                description, disbursementId);
            const insertResponse = {
                'status' : (assetData.affectedRows) ? 'ok' : 'failed'
            };
            return resolve(insertResponse);
        } catch (err) {
            Logger.write.log('error', 'insert asset transaction disbursement data error: ' + err.message);
            return reject(err);
        }
    });
};

const finalizeDisbursementRequest = (insertDisbursementResponse, updateAssetResponse) => {
    if (insertDisbursementResponse === 'ok' && updateAssetResponse === 'ok') {
        return ({
            'statusCode': 'C0001',
            'response': 'Success',
            'message': 'Disbursement Request successfully'
        });
    }

    return ({
        'statusCode': 'E0001',
        'response': 'Failed',
        'message': 'Something wrong with disbursement request.'
    });
};

const checkDisbursementStatus = (status, userCode, balance, amount, accountId, id, transDate) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (status === 'COMPLETED') {
                const updateStatus = await AssetData.updateWithdrawTranStatus(userCode, id, 1, transDate);
                if (updateStatus.affectedRows) {
                    return resolve({
                        'statusCode': 'C0001',
                        'response': 'Success',
                        'message': 'update asset transaction status succesfully.'
                    });
                }

                return resolve({
                    'statusCode': 'E0001',
                    'response': 'Failed',
                    'message': 'Something wrong with our end'
                });
            }

            const failedStatus = await AssetData.updateWithdrawTranStatus(userCode, id, 2, transDate);
            const updateBalance = balance + amount;
            const updateFailedAsset = await AssetData.updateBalance(accountId, updateBalance);
            if (failedStatus.affectedRows && updateFailedAsset.affectedRows) {
                return resolve({
                    'statusCode': 'E0001',
                    'response': 'Failed',
                    'message': 'Disbursement failed from payment system.'
                });
            }

            return resolve({
                'statusCode': 'E0001',
                'response': 'Failed',
                'message': 'Something wrong with our end'
            });
        } catch (err) {
            Logger.write.log('error', 'update disbursement status data error: ' + err.message);
            return reject(err);
        }
    });
};

const updateAssetLoanCode = (userCode, loanCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            const updateAssetStatus = await AssetData.updateLoanCode(userCode, loanCode);
            if (updateAssetStatus.affectedRows) {
                return resolve({'status': 'ok'});
            }

            return resolve({'status': 'failed'});
        } catch (err) {
            Logger.write.log('error', 'update Asset project Id error: ' + err.message);
            return reject(err);
        }
    });
};

const getAccountBankDetailByUserCode = (userCode) => {
    return new Promise((resolve,reject) => {
        try {
            UserData.getAccountBankDetailByUserCode(userCode)
                .then((accountBankDetail) => {
                    return resolve(accountBankDetail);
                });
        } catch (err) {
            return reject({ 'error': err });
        }
    });
};

const getLoanCodeById = (disbursementId) => {
    return new Promise(async (resolve,reject) => {
        try {
            const description = await AssetData.getLoanCodeFromWithdraw(disbursementId);
            const regexLoan = /\b(\w*DAN\w*)\b/g;
            const loanCode = await regexLoan.exec(description[0].description);
            return resolve(loanCode[0]);
        } catch (err) {
            Logger.write.log('error', 'get Loan code from disbursement id error: ' + err.message);
            return reject({ 'error': err });
        }
    });
};

const paymentIdrProcess = (bankCode, clearingCode, rtgsCode, amount, accountNo, remark, address1, address2, fullName, chargeType) => {
    return new Promise(async (resolve, reject) => {
        try {
            let transferStatus = '';
            const escrowAccount = await ConstantHelper.getValue('danonEscrowNo');
            //testing
            const finalAcc = accountNo ? accountNo : '0115476117';
            if (amount <= 100000000) {
                console.log('paymentbelow 100,000,000');
                if (bankCode === '009') {
                    console.log('===Payment using transfer - BNI account===');
                    transferStatus = await BniRDL.paymentUsingTransfer(escrowAccount, finalAcc, 'IDR', amount, remark);
                    // transferStatus = await BniRDL.paymentUsingTransfer(escrowAccount, accountNo, 'IDR', amount, remark);
                    console.log('transferStatus: ', transferStatus);
                    //transfer local BNI (payment using transfer)
                } else {
                    console.log('===Payment using clearing other bank account===');
                    transferStatus = await BniRDL.paymentUsingClearing(escrowAccount, '3333333333', address1, address2, '140397', fullName, 'IDR', amount, remark, chargeType);
                    // transferStatus = await BniRDL.paymentUsingClearing(escrowAccount, accountNo, address1, address2, clearingCode, fullName, 'IDR', amount, remark, chargeType);
                    console.log('transferStatus clearing: ', transferStatus);
                    //transfer other bank (payment using clearing)
                }
            } else {
                console.log('payment RTGS above 100,000,000');
                transferStatus = await BniRDL.paymentUsingRTGS(escrowAccount, '0115476117', address1, address2, 'BNINIDJA', fullName, 'IDR', amount, remark, chargeType);
                // transferStatus = await BniRDL.paymentUsingRTGS(escrowAccount, accountNo, address1, address2, rtgsCode, fullName, 'IDR', amount, remark, chargeType);
                console.log('transferStatus rtgs: ', transferStatus);
                //payment RTGS
            }

            return resolve(transferStatus);
        } catch (err) {
            return reject({ 'err.message': err });
        }
    });
};

const paymentRdlProcess = (rdlAccount, bankCode, clearingCode, rtgsCode, amount, accountNo, remark, address1, address2, fullName, chargeType) => {
    return new Promise(async (resolve, reject) => {
        try {
            let transferStatus = '';
            //testing
            const finalAcc = accountNo ? accountNo : '0115476117';
            if (amount <= 100000000) {
                console.log('paymentbelow 100,000,000');
                if (bankCode === '009') {
                    console.log('===Payment using transfer - BNI account===');
                    transferStatus = await BniRDL.paymentUsingTransfer(rdlAccount, finalAcc, 'IDR', amount, remark);
                    // transferStatus = await BniRDL.paymentUsingTransfer(escrowAccount, accountNo, 'IDR', amount, remark);
                    console.log('transferStatus: ', transferStatus);
                    //transfer local BNI (payment using transfer)
                } else {
                    console.log('===Payment using clearing other bank account===');
                    transferStatus = await BniRDL.paymentUsingClearing(rdlAccount, '3333333333', address1, address2, '140397', fullName, 'IDR', amount, remark, chargeType);
                    // transferStatus = await BniRDL.paymentUsingClearing(escrowAccount, accountNo, address1, address2, clearingCode, fullName, 'IDR', amount, remark, chargeType);
                    console.log('transferStatus clearing: ', transferStatus);
                    //transfer other bank (payment using clearing)
                }
            } else {
                console.log('payment RTGS above 100,000,000');
                transferStatus = await BniRDL.paymentUsingRTGS(rdlAccount, '0115476117', address1, address2, 'BNINIDJA', fullName, 'IDR', amount, remark, chargeType);
                // transferStatus = await BniRDL.paymentUsingRTGS(escrowAccount, accountNo, address1, address2, rtgsCode, fullName, 'IDR', amount, remark, chargeType);
                console.log('transferStatus rtgs: ', transferStatus);
                //payment RTGS
            }

            return resolve(transferStatus);
        } catch (err) {
            return reject({ 'err.message': err });
        }
    });
};

const insertWithdrawRdl = (userCode, withdraw, bankName, transType, accountNo, name, description, disbursementId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const assetData = await AssetData.insertWithdrawRdl(userCode, withdraw, bankName, transType, new Date().toISOString(), 0, accountNo, name,
                description, disbursementId);
            const insertResponse = {
                'status' : (assetData.affectedRows) ? 'ok' : 'failed'
            };
            return resolve(insertResponse);
        } catch (err) {
            Logger.write.log('error', 'insert investor asset transaction withdraw data error: ' + err.message);
            return reject(err);
        }
    });
};

const checkDisbursementId = (userCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            const idDisburs = await AssetData.checkIdDisbursement(userCode);
            return resolve(idDisburs);
        } catch (err) {
            Logger.write.log('error', 'get all asset transaction error: ' + err.message);
            return reject(err);
        }
    });
};

const disbursInvestorRdl = (userCode) => {
    return new Promise(async (resolve, reject) => {
        try {

            const idDisburs = await AssetData.checkIdDisbursement(userCode);
            // From loanCode find the funder get the userCode, and amount
            console.log('===Get Disbursement investor Detail: ', idDisburs[0]);
            const assetData = await getAssetFromUser(userCode);
            const balanceRDL = await BniRDL.inquiryAccountBalance(assetData[0].virtual_acc);
            console.log('====balanceRDL: ', balanceRDL);

            if (balanceRDL.response) {
                if (balanceRDL.response.accountBalance >= idDisburs[0].amount) {
                    const payinDisbursementApi = await paymentRdlProcess(
                        assetData[0].virtual_acc,
                        assetData[0].bank_code,
                        assetData[0].clearing_code,
                        assetData[0].rtgs_code,
                        idDisburs[0].amount,
                        null,
                        idDisburs[0].iddescription,
                        assetData[0].address,
                        null,
                        assetData[0].full_name,
                        'BEN');

                    console.log('=====payinDisbursementApi: ', payinDisbursementApi);

                    const requestWithdraw = await AssetData.updateWithdrawRdl(
                        idDisburs[0].id, payinDisbursementApi.response.journal_number, payinDisbursementApi.response.responseUuid, 1
                    );

                    if (requestWithdraw.affectedRows) {
                        return resolve({
                            'statusCode': 'C0001',
                            'response': 'Success',
                            'message': 'Approve user data succesfully'
                        });
                    }

                    return reject({
                        'statusCode': 'E0001',
                        'response': 'Failed',
                        'message': 'Ooops ! Something wrong with our ends'
                    });
                }

                return reject({
                    'statusCode': 'E0002',
                    'response': 'Failed',
                    'message': 'Balance is not enough'
                });
            } else if (balanceRDL.Response) {
                return reject({
                    'statusCode': 'E0001',
                    'response': 'Failed',
                    'message': 'Token has expired'
                });
            }
        } catch (err) {
            Logger.write.log('error', ' disbursement rdl error: ' + err.message);
            return reject(err);
        }
    });
};

const disbursInvestorRdlOld = async (request, h) => {
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

const registrationDigisign = (userCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            const assetData = await DigisignData.getStatusRegistration(userCode);

            if (assetData[0].status_registration === 0) {
                const userData = await UserData.getDetailUserByUserCode(userCode);
                const address = userData[0].alamat.split(' | ');
                const registerStatus = await Digisign.registerDigiSign(userCode, address[0], userData[0].jenis_kelamin, userData[0].kecamatan,
                    userData[0].kelurahan, userData[0].kode_pos, userData[0].provinsi, userData[0].nama,
                    (userData[0].code_country.substring(1, userData[0].code_country.length)) + userData[0].no_hp,
                    userData[0].tanggal_lahir, userData[0].provinsi, userData[0].no_ktp, userData[0].tempat_lahir,
                    userData[0].email, userData[0].no_npwp, '', userData[0].upload_ktp, userData[0].upload_selfie, '', '');

                if (JSON.parse(registerStatus).JSONFile.result !== '00') {
                    return resolve(JSON.parse(registerStatus).JSONFile.notif);
                }

                await DigisignData.updateRegistrationStatus(userCode, 1);
            }

            return resolve('ok');
        } catch (err) {
            Logger.write.log('error', 'registration Digisign check error: ' + err.message);
            return reject(err);
        }
    });
    //test
};

const sendInvestorPks = (userCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            const assetData = await DigisignData.getStatusInvestor(userCode);

            if (assetData[0].status_investorpks === 0) {
                // created investor pks
                const getDataUser = await AuthHelper.getUserDetailFromCode(userCode);

                // generate create Date
                const month = ['Januari', 'Februari', 'Maret', 'April', 'May', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                const currDate = new Date();
                const createdDate = currDate.getDate() + ' ' + month[currDate.getMonth()] + ' ' + currDate.getFullYear();

                // generate document number
                const docNo = currDate.getFullYear() + '1' + String('00000000' + getDataUser[0].authentication_id).slice(-8);

                const address = getDataUser[0].alamat.split(' | ');
                // create PKS document
                await FileHelper.generatePksFile(userCode, 'investor_template.docx', 'investor_pks', 'investor_pks',
                    getDataUser[0].authentication_id, getDataUser[0].nama, getDataUser[0].code_country + ' - ' + getDataUser[0].no_hp,
                    getDataUser[0].no_ktp, createdDate, docNo, address[0], getDataUser[0].email);

                await DigisignData.updateInvestorPksStatus(userCode, 1);
            }

            return resolve('ok');
        } catch (err) {
            Logger.write.log('error', 'send Investor Pks digisign error: ' + err.message);
            return reject(err);
        }
    });
};

module.exports = {
    checkDisbursementStatus,
    checkDisbursementId,
    checkPaymentId,
    disbursInvestorRdl,
    finalizeDisbursementRequest,
    getAllHistory,
    getAsset,
    getAssetFromUser,
    getAssetInfo,
    getLoanCodeById,
    getTotalAsset,
    getDetailFromUser,
    insertAsset,
    insertAssetTxn,
    insertDeposit,
    insertDisbursement,
    insertWithdrawRdl,
    paymentIdrProcess,
    paymentRdlProcess,
    registrationDigisign,
    sendInvestorPks,
    updateAsset,
    updateAssetLoanCode,
    getAccountBankDetailByUserCode
};
