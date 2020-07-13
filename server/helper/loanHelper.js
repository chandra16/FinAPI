const LoanData = require('../model/loanData');
const Logger = require('./logger');
const Fs = require('fs');
const Path = require('path');
const UtilsHelper = require('../helper/utilsHelper');
const AdminHelper = require('../helper/adminHelper');
const EmailHelper = require('../helper/emailHelper');
const AuthHelper = require('../helper/authHelper');
const BorrowerHelper = require('../helper/borrowerHelper');
const DocumentData = require('../model/documentData');
const AuthenticationData = require('../model/authenticationData');
const FundingData = require('../model/fundingData');
const AssetData = require('../model/assetData');
const UserData = require('../model/userData');
const DigiSign = require('../service/digiSign');
const Config = require('../../config');

const getAllLoanList = (status) => {
    return new Promise((resolve, reject) => {
        try {
            const allLoan = LoanData.getAllLoanList(status);
            resolve(allLoan);
        } catch (err) {
            reject({ 'err.message': err });
        }
    });
};

const getNewLoanList = () => {
    return new Promise((resolve, reject) => {
        try {
            const allLoan = LoanData.getNewLoanList();
            resolve(allLoan);
        } catch (err) {
            reject({ 'err.message': err });
        }
    });
};

const getLoanDetail = (loanCode) => {
    return new Promise((resolve, reject) => {
        try {
            const allLoan = LoanData.getLoanDetail(loanCode);
            resolve(allLoan);
        } catch (err) {
            reject({ 'err.message': err });
        }
    });
};

const getVerifiedInvestor = () => {
    return new Promise((resolve, reject) => {
        try {
            const getInvestor = LoanData.getVerifiedInvestor();
            resolve(getInvestor);
        } catch (err) {
            reject({ 'err.message': err });
        }
    });
};

const getTotalMoney = (userCode) => {
    return new Promise((resolve, reject) => {
        try {
            const allLoan = LoanData.getCollectionMoney(userCode);
            resolve(allLoan);
        } catch (err) {
            reject({ 'err.message': err });
        }
    });
};

const insertLoan = function (userCode, idLoanType, jumlahPinjaman, lamaTenor, sukuBunga, grade, jatuhTempo, tujuan, dokumen1, dokumen2, dokumen3, dokumen4, dokumen5, dokumen6, dokumen7, dokumen8, dokumen9, dokumen10, interestType, fotoProject) {
    return new Promise(function (resolve, reject) {
        UtilsHelper.generateProjectCode()
            .then((loanCode) => {
                LoanData.insertLoan(loanCode, userCode, idLoanType, jumlahPinjaman, lamaTenor, sukuBunga, grade, jatuhTempo, tujuan, dokumen1, dokumen2, dokumen3, dokumen4, dokumen5, dokumen6, dokumen7, dokumen8, dokumen9, dokumen10, interestType, fotoProject)
                    .then((result) => {
                        if (result) {
                            const successResult = {
                                'statusCode': 'C0001',
                                'response': 'Success',
                                'message': 'Insert data Loan successfully'
                            };
                            return resolve({ successResult, result });
                        }
                    })
                    .catch((err) => {
                        return reject(err);
                    });
            });
    });
};


const getUserFromLoan = (loanCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (loanCode) {
                const loanData = await LoanData.getUserFromLoan(loanCode);
                return resolve(loanData);
            }

            Logger.write.log('error', 'Loan code not available.');
            return reject({ 'message': 'not available' });
        } catch (err) {
            Logger.write.log('error', 'get user using Loan code error: ' + err.message);
            return reject(err);
        }
    });
};

const getInstallmentFromLoan = (loanCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (loanCode) {
                const installmentData = await LoanData.getInstallmentDetail(loanCode);
                return resolve(installmentData);
            }

            Logger.write.log('error', 'Loan code not available.');
            return reject({ 'message': 'not available' });
        } catch (err) {
            Logger.write.log('error', 'get installment data using Loan code error: ' + err.message);
            return reject(err);
        }
    });
};

const approveLoan = (loanCode, status, userCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (loanCode) {
                const loanData = await LoanData.approveDisbursement(loanCode, status, userCode);
                return resolve(loanData);
            }

            Logger.write.log('error', 'Loan code not available.');
            return reject({ 'message': 'not available' });
        } catch (err) {
            Logger.write.log('error', 'update Loan status after disbursement error: ' + err.message);
            return reject(err);
        }
    });
};

const updateInstallmentComplete = (loanCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (loanCode) {
                const loanData = await LoanData.updateInstallmentComplete(loanCode, 4);
                return resolve(loanData);
            }

            Logger.write.log('error', 'Loan code not available.');
            return reject({ 'message': 'not available' });
        } catch (err) {
            Logger.write.log('error', 'update loan status when installment complete error: ' + err.message);
            return reject(err);
        }
    });
};

const updateLoanDocument = (idLoan, projectImage, dokumen1, dokumen2, dokumen3, dokumen4, dokumen5, dokumen6, dokumen7, dokumen8, dokumen9, dokumen10) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (idLoan) {
                const loanData = await LoanData.updateLoanDocument(idLoan, projectImage, dokumen1, dokumen2, dokumen3, dokumen4, dokumen5, dokumen6, dokumen7, dokumen8, dokumen9, dokumen10);
                return resolve(loanData);
            }

            Logger.write.log('error', 'ID Loan Code not available.');
            return reject({ 'message': 'not available' });
        } catch (err) {
            Logger.write.log('error', 'get user using Id Loan error: ' + err.message);
            return reject(err);
        }
    });
};

const getLoanCount = (userCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (userCode) {
                const totalLoan = await LoanData.getLoanCount(userCode);
                return resolve((totalLoan[0].count !== null) ? totalLoan[0].count : 0);
            }

            Logger.write.log('error', 'User Code not available.');
            return reject({ 'message': 'not available' });
        } catch (err) {
            Logger.write.log('error', 'get user using Loan code error: ' + err.message);
            return reject(err);
        }
    });
};

const getOnProgressLoanCount = (userCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (userCode) {
                const totalLoan = await LoanData.getOnProgressLoan(userCode, 3);
                return resolve((totalLoan[0].count !== null) ? totalLoan[0].count : 0);
            }

            Logger.write.log('error', 'User Code not available.');
            return reject({ 'message': 'not available' });
        } catch (err) {
            Logger.write.log('error', 'get user using Loan code error: ' + err.message);
            return reject(err);
        }
    });
};

const updateInterest = (loanCode, grade, lamaTenor, additionalFee) => {
    return new Promise(async (resolve, reject) => {
        const otherFee = (additionalFee) ? additionalFee : 0;
        try {
            const interestData = await LoanData.getLoanBunga(lamaTenor, grade);
            const insertStatus = await LoanData.insertInterestDetail(loanCode, (interestData[0].bunga + interestData[0].service_fee),
                interestData[0].bunga, interestData[0].service_fee, interestData[0].borrower_fee, otherFee);
            if (insertStatus.affectedRows) {
                Logger.write.log('info', 'insert detail of interest successful for loanCode = ' + loanCode);
                return resolve({ 'status': 'OK' });
            }

            Logger.write.log('error', 'detail of interest not failed');
            return reject({ 'message': 'something went wrong' });
        } catch (err) {
            Logger.write.log('error', 'update interest loan error: ' + err.message);
            return reject(err);
        }
    });
};

const calculateAdminFee = (loanCode, amount) => {
    return new Promise(async (resolve, reject) => {
        try {
            const adminFee = await LoanData.getBorrowerFee(loanCode);
            if (adminFee[0].borrower_interest) {
                borrowerFee = (adminFee[0].borrower_interest / 100) * amount;
                totalFee = borrowerFee + adminFee[0].others_fee;
                return resolve(totalFee);
            }

            return reject({ 'message': 'no admin fee available for this loan: ' + loanCode });
        } catch (err) {
            Logger.write.log('error', 'calculate admin fee for loan error: ' + err.message);
            return reject(err);
        }
    });
};

const getAmountForLoan = (loanCode) => {
    return new Promise((resolve, reject) => {
        try {
            const disbursementAmount = LoanData.getDetailAmount(loanCode);
            return resolve(disbursementAmount);
        } catch (err) {
            Logger.write.log('error', 'get amount for disbursement borrower error: ' + err.message);
            return reject(err);
        }
    });
};

const getCountLoan = (userCode) => {
    return new Promise((resolve, reject) => {
        LoanData.getCountLoan(userCode)
            .then((results) => {
                return resolve(results[0]);
            })
            .catch((err) => {
                return reject(err);
            });
    });
};

const getDocumentSignStatus = (userCode, loanCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            const docNo = await DocumentData.getDocumentNoForLoan(userCode, loanCode);

            const docStatus = await DigiSign.checkDocStatus(docNo[0].document_no);

            if (JSON.parse(docStatus).JSONFile.status === 'waiting') {
                const failedResult = {
                    'statusCode': 'E0001',
                    'response': 'Failed',
                    'message': 'document has not been signed'
                };
                return resolve(failedResult);
            }

            const successResult = {
                'statusCode': 'C0001',
                'response': 'Success',
                'message': 'document already been signed'
            };
            return resolve(successResult);
        } catch (err) {
            Logger.write.log('error', 'get loan document sign status error: ' + err.message);
            return reject(err);
        }
    });
};

const insertLoanRiskProfile = function (idLoan, title, desc) {
    return new Promise(function (resolve, reject) {
        try {
            const insertRiskProfile = LoanData.insertLoanRiskProfile(idLoan, title, desc)
                .then((results) => {
                    if (results) {
                        return ({
                            'status': 'ok'
                        });
                    }

                    return ({
                        'status': 'failed'
                    });
                });

            return resolve(insertRiskProfile);
        } catch (err) {
            Logger.write.log('error', 'insert Asset Data error: ' + err.message);
            return reject(err);
        }
    });
};

const insertPayorInformation = function (idLoan, jaminan, informasiPayor, industri, klasifikasi, nilaiTagihan) {
    return new Promise(async (resolve, reject) => {
        try {
            const loanCode = await LoanData.getLoanCode(idLoan);
            const insertPayorData = await LoanData.insertPayorInformation(loanCode[0].loan_code, jaminan, informasiPayor, industri, klasifikasi, nilaiTagihan)
                .then((results) => {
                    if (results) {
                        return ({
                            'status': 'ok'
                        });
                    }

                    return ({
                        'status': 'failed'
                    });
                });

            return resolve(insertPayorData);
        } catch (err) {
            Logger.write.log('error', 'insert Asset Data error: ' + err.message);
            return reject(err);
        }
    });
};

const getDataPayor = function (loanCode) {
    return new Promise((resolve, reject) => {
        LoanData.getDataPayor(loanCode)
            .then((results) => {
                return resolve(results[0]);
            })
            .catch((err) => {
                return reject(err);
            });
    });
};

const getDataRisk = function (loanCode) {
    return new Promise((resolve, reject) => {
        LoanData.getDataRisk(loanCode)
            .then((results) => {
                return resolve(results);
            })
            .catch((err) => {
                return reject(err);
            });
    });
};

const getDataBorrower = function (loanCode) {
    return new Promise((resolve, reject) => {
        LoanData.getDataBorrower(loanCode)
            .then((results) => {
                return resolve(results[0]);
            })
            .catch((err) => {
                return reject(err);
            });
    });
};


const updateLoanInfo = function (loanCode, payorDesc, tujuan) {
    return new Promise(async (resolve, reject) => {
        try {
            const updatePayor = await LoanData.updatePayorInfo(loanCode, payorDesc);
            const updateTujuan = await LoanData.updateTujuanLoan(laonCode, tujuan)
                .then((results) => {
                    if (results) {
                        return ({
                            'status': 'ok'
                        });
                    }

                    return ({
                        'status': 'failed'
                    });
                });

            return resolve(updateTujuan);
        } catch (err) {
            Logger.write.log('error', 'update payor info error for ' + loanCode + ': ' + err.message);
            return reject({ 'message': 'update payor info failed, something wrong.' });
        }
    });
};

const newLoanExternal = function (userId, email, idLoanType, amountLoan, loanPeriod, totalInterest, fundingPeriod, loanPurpose, interestType) {
    return new Promise(async (resolve, reject) => {
        try {
            const userCode = await AuthenticationData.getAuthDetail(email, null, null);

            const checkExternalId = await AuthHelper.checkExternal(userId);
            if (checkExternalId !== 'Ok') {
                failedRes = await UtilsHelper.failedResponse(1, 'user not recognize');
                return resolve(failedRes);
            }

            const loanCode = await UtilsHelper.generateProjectCode();
            const danonFeePercent = 1;
            //register loan
            await LoanData.insertLoanExternal(loanCode, userCode[0].user_code, idLoanType, amountLoan,
                loanPeriod, totalInterest, 'AA', fundingPeriod, loanPurpose, null, null, null, null, null,
                null, null, null, null, null, interestType, null, 1);

            // insert interest detail
            await LoanData.insertInterestDetail(loanCode, totalInterest,
                totalInterest, 0, danonFeePercent, 0);

            //calcuate total admin fee for danon
            const danonFee = await (danonFeePercent / 100) * amountLoan;

            //approve loan
            await AdminHelper.approveLoan(1, loanCode, 1, totalInterest, 'AA', userId, danonFee, null);

            await BorrowerData.updateApprovedBorrowerLoans(loanCode, '1');

            const successResponse = {
                'statusCode': 'C0001',
                'response': 'Success',
                'message': 'Loan has been successfully added'
            };

            return resolve(successResponse);
        } catch (err) {
            Logger.write.log('error', 'add load external failed: ' + err.message);
            return reject({ 'message': 'add loan external failed, something wrong. ' + err.message });
        }
    });
};

const insertCollateralFile = function (loanCode, fileName) {
    return new Promise(function (resolve, reject) {
        try {
            const insertCollateral = LoanData.insertCollateralFile(loanCode, fileName)
                .then((results) => {
                    if (results) {
                        return ({
                            'status': 'ok'
                        });
                    }

                    return ({
                        'status': 'failed'
                    });
                });

            return resolve(insertCollateral);
        } catch (err) {
            Logger.write.log('error', 'insert Collateral Data error: ' + err.message);
            return reject(err);
        }
    });
};

const getExpiredLoan = function() {
    return new Promise(async (resolve, reject) => {
        try {
            const listLoan = await LoanData.getExpiredLoan();

            listLoan.forEach(async (expiredLoan) => {
                await LoanData.insertLoanCase(expiredLoan.loan_code, 0, expiredLoan.jumlah_pinjaman, expiredLoan.total_funding, expiredLoan.user_code);
                const email = await UserData.getEmailByUserCode(expiredLoan.user_code);
                const dataLoan = await EmailHelper.dataLoanExpired(email[0].email, expiredLoan.loan_code, expiredLoan.jumlah_pinjaman, expiredLoan.total_funding);
                // send email
                await EmailHelper.sendEmail(dataLoan, 'loan-expired');
                //update table funding
                FundingData.updateFundingStatus(expiredLoan.loan_code, 2);
            });

            const successResponse = {
                'statusCode': 'C0001',
                'response': 'Success',
                'message': 'Loan has been successfully added'
            };

            return resolve(successResponse);
        } catch (err) {
            Logger.write.log('error', 'get expired loan failed: ' + err.message);
            return reject({ 'message': 'get expired loan failed, something wrong. ' + err.message });
        }
    });
};

const getExpiredFunding = (userCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            const expiredLoan = await LoanData.getExpiredFunding(0, userCode);
            return resolve(expiredLoan);
        } catch (err) {
            Logger.write.log('error', 'get expired fund failed: ' + err.message);
            return reject({ 'message': 'get expired fund failed, something wrong. ' + err.message });
        }
    });
};

const getCollateralTypeId = (typeName) => {
    return new Promise(async (resolve, reject) => {
        try {
            const id = await LoanData.getCollateralTypeId(typeName);
            return resolve(id[0]);
        } catch (err) {
            Logger.write.log('error', 'get Collateral Id Failed: ' + err.message);
            return reject({'message': 'get Collateral Id Failed, something wrong. ' + err.message });
        }
    });
};

const approvalCollectedFund = (status, loanCode, amount, userCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            await LoanData.updateStatusLoanCase(status, loanCode);

            if (status === 1) {
                await LoanData.updateTotalLoan(amount, loanCode);
                await BorrowerHelper.createLoanDocument(loanCode, userCode);

            } else {
                await FundingData.updateFundingStatus(loanCode, 5);
                await LoanData.updateInstallmentComplete(loanCode, 5);

                const investorList = await FundingData.getInvestorFunding(loanCode);

                investorList.forEach(async (investorDetail) => {
                    await FundingData.updateFundingDetailStatus(2, investorDetail.user_code, loanCode, 'refund due to cancelation by borrower, expired funding period');
                    await AssetData.updateBalanceByUserCode(investorDetail.userCode, investorDetail.funding);
                });

            }

            const successResponse = {
                'statusCode': 'C0001',
                'response': 'Success',
                'message': 'Approval collected Fund done'
            };

            return resolve(successResponse);
        } catch (err) {
            Logger.write.log('error', 'approval for colleted fund failed: ' + err.message);
            return reject({ 'message': 'approval for colledted fund error, something wrong. ' + err.message });
        }
    });
};

const getLoanCode = (idLoan) => {
     return new Promise((resolve, reject) => {
        LoanData.getLoanCode(idLoan)
            .then((results) => {
                return resolve(results[0]);
            })
            .catch((err) => {
                return reject(err);
            });
    });
};


module.exports = {
    approvalCollectedFund,
    approveLoan,
    calculateAdminFee,
    getAllLoanList,
    getAmountForLoan,
    getDocumentSignStatus,
    getInstallmentFromLoan,
    getLoanCount,
    getLoanDetail,
    getOnProgressLoanCount,
    getTotalMoney,
    getUserFromLoan,
    insertLoan,
    getNewLoanList,
    updateInstallmentComplete,
    updateInterest,
    updateLoanDocument,
    getCountLoan,
    getVerifiedInvestor,
    getDataPayor,
    updateLoanInfo,
    insertPayorInformation,
    insertLoanRiskProfile,
    getDataRisk,
    getDataBorrower,
    newLoanExternal,
    insertCollateralFile,
    getExpiredFunding,
    getExpiredLoan,
    getCollateralTypeId,
    getLoanCode
};
