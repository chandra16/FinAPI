const FundingData = require('../model/fundingData');
const LoanData = require('../model/loanData');
const UserData = require('../model/userData');
const AssetData = require('../model/assetData');
const DividenData = require('../model/dividenData');
const DocumentData = require('../model/documentData');
const DigisignData = require('../model/digisignData');
const BorrowerHelper = require('./borrowerHelper');
const DigiSign = require('../service/digiSign');
const Logger = require('./logger');

const getFundingByLoan = (loanCode) => {
    return new Promise((resolve, reject) => {
        try {
            const fundingDetail = FundingData.getFundingByLoan(loanCode);
            resolve(fundingDetail);
        } catch (err) {
            reject({ 'err.message': err });
        }
    });
};

const getAllFundingList = (userCode, status) => {
    return new Promise((resolve, reject) => {
        try {
            //  process.stdout.write("getAllFundingList::" + userCode + "::" + (userCode != '0'));
            const fundingList = FundingData.getAllFundingList(userCode, status);
            resolve(fundingList);

        } catch (err) {
            reject({ 'err.message': err });
        }
    });
};

const getFundingDetails = (fundingId) => {
    return new Promise((resolve, reject) => {
        try {
            const findingDetails = FundingData.getFundingDetails(fundingId);
            resolve(findingDetails);
        } catch (err) {
            reject({ 'err.message': err });
        }
    });
};

const insertFunding = function (loanCode, totalFunding, status, userId) {
    return new Promise(function (resolve, reject) {
        FundingData.insertFunding(loanCode, totalFunding, status, userId)
            .then((result) => {
                if (result) {
                    const successResult = {
                        'statusCode': 'C0001',
                        'response': 'Success',
                        'message': 'Insert data funding successfully'
                    };
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                return reject(err);
            });
    });
};

const insertFundingDetails = function (fundingId, userCode, funding, status) {
    return new Promise(function (resolve, reject) {
        FundingData.insertFundingDetails(fundingId, userCode, funding, status)
            .then((result) => {
                if (result) {
                    const successResult = {
                        'statusCode': 'C0001',
                        'response': 'Success',
                        'message': 'Insert data funding details successfully'
                    };
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                return reject(err);
            });
    });
};

const fundingLoan = function (userCode, loanCode, fundingAmount) {
    return new Promise((resolve, reject) => {
        try {
            LoanData.getLoanDetail(loanCode)
                .then((loanDetail) => {
                    if (loanDetail) {
                        FundingData.getFundingByLoan(loanCode)
                            .then((fundingDetails) => {
                                if (fundingDetails) {
                                    const totalFundedLoan = fundingDetails[0].total_funding + fundingAmount;
                                    if (totalFundedLoan > loanDetail[0].jumlah_pinjaman) {
                                        const failedResult = {
                                            'statusCode': 'E0002',
                                            'response': 'Failed',
                                            'message': 'Amount Funded Exceed Loan Amount'
                                        };
                                        resolve(failedResult);
                                    } else {
                                        FundingData.insertFundingDetails(fundingDetails[0].id, userCode, fundingAmount, 1)
                                            .then((insertFundingDetailsStatus) => {
                                                if (insertFundingDetailsStatus) {
                                                    const updateAssetData = AssetData.updateBalanceByUserCode(userCode, -fundingAmount);
                                                    FundingData.updateFundingAmount(fundingDetails[0].id, fundingAmount, userCode)
                                                        .then((updateFundingStatus) => {
                                                            if (updateFundingStatus) {
                                                                if (totalFundedLoan === loanDetail[0].jumlah_pinjaman) {
                                                                    FundingData.updateFundingStatus(loanCode, 2);
                                                                    //create document
                                                                    BorrowerHelper.createLoanDocument(loanCode, loanDetail[0].user_code);
                                                                }

                                                                const successResult = {
                                                                    'statusCode': 'C0001',
                                                                    'response': 'Success',
                                                                    'message': 'Success Update Funding'
                                                                };
                                                                resolve(successResult);
                                                            }
                                                        });
                                                } else {
                                                    const failedResult = {
                                                        'statusCode': 'E0002',
                                                        'response': 'Failed',
                                                        'message': 'Failed update funding table'
                                                    };
                                                    resolve(failedResult);
                                                }
                                            });
                                    }
                                }
                            })
                            .catch((err) => {
                                return reject(err);
                            });
                        //fundingDetails =  FundingData.getFundingByLoan(loanId)
                        // process.stdout.write("loanDetail: " + JSON.stringify(result) + "\n");
                        // process.stdout.write("loanDetail: " + JSON.stringify(result[0]) + "\n");
                        // process.stdout.write("loanDetail:nama " + JSON.stringify(result[0].id) + "\n");
                    }
                })
                .catch((err) => {
                    return reject(err);
                });
        } catch (err) {
            reject({ 'err.message': err });
        }
    });
};

const getTotalFunding = (loanCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalFunding = await FundingData.getCollectionFunding(loanCode);
            resolve(totalFunding);
        } catch (err) {
            reject({ 'err.message': err });
        }
    });
};

const updateAdminFee = (adminFee, loanCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            const updateFee = await FundingData.updateAdminFee(adminFee, loanCode);
            resolve(updateFee);
        } catch (err) {
            reject({ 'err.message': err });
        }
    });
};

const getInvestorFunding = (loanCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            const investorFund = await FundingData.getInvestorFunding(loanCode);
            resolve(investorFund);
        } catch (err) {
            reject({ 'err.message': err });
        }
    });
};

const getFundingListByInvestor = (userCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            const fundingList = await FundingData.getFundingListByInvestor(userCode);

            for (let index = 0; index < fundingList.length; index++) {
                const detailLoanPerMonth = await FundingData.getDetailLoanPerMonth(fundingList[index].loan_code, fundingList[index].user_code);
                fundingList[index].dividen = detailLoanPerMonth;

            }

            resolve(fundingList);
        } catch (err) {
            reject({ 'err.message': err });
        }
    });
};

const getTotalDividen = (funding, userCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            for (let index = 0; index < funding.length; index++) {
                const dividenList = await DividenData.getDividen(userCode, funding[index].loan_code);
                funding[index].dividen = dividenList;
            }

            resolve(funding);
        } catch (err) {
            reject({ 'err.message': err });
        }
    });
};

const updateFundingStatus = function (loanCode, status) {
    return new Promise((resolve, reject) => {
        FundingData.updateFundingStatus(loanCode, status)
            .then((result) => {
                if (result) {
                    const successResult = {
                        'statusCode': 'C0001',
                        'response': 'Success',
                        'message': 'Update funding Status successfully'
                    };
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                return reject(err);
            });
    });
};

const getInvestorRequestWithdraw = (status) => {
    return new Promise(async (resolve, reject) => {
        try {
            const requestListWithdraw = await FundingData.getListRequestWithdrawRDL(status);
            resolve(requestListWithdraw);
        } catch (err) {
            reject({ 'err.message': err });
        }
    });
};

const checkInvestorDocSign = (userCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            const statusSign = await DigisignData.getStatusInvestor(userCode);

            let successResult;
            if (statusSign[0] && statusSign[0].status_investorpks <= 1) {
                const docNumber = await DocumentData.getDocumentNoForFunding(userCode);

                console.log('===docNumber :', docNumber[0].document_no);
                const docStatus = await DigiSign.checkDocStatus(docNumber[0].document_no);

                if (JSON.parse(docStatus).JSONFile.status === 'waiting') {
                    const failedResult = {
                        'statusCode': 'E0001',
                        'response': 'Failed',
                        'message': 'document has not been signed'
                    };
                    return resolve(failedResult);
                }

                await DigisignData.updateInvestorPksStatus(userCode, 2);
                successResult = {
                    'statusCode': 'C0001',
                    'response': 'Success',
                    'message': 'update document to be signed'
                };
            } else if (statusSign[0] && statusSign[0].status_investorpks === 2) {
                successResult = {
                    'statusCode': 'C0001',
                    'response': 'Success',
                    'message': 'document already been signed'
                };
            } else {
                const failedResult = {
                    'statusCode': 'E0001',
                    'response': 'Failed',
                    'message': 'document Data not found'
                };
                return resolve(failedResult);
            }

            return resolve(successResult);
        } catch (err) {
            Logger.write.log('error', 'check document PKS investor status error: ' + err.message);
            reject({ 'err.message': err });
        }
    });
};

module.exports = {
    checkInvestorDocSign,
    insertFunding,
    insertFundingDetails,
    getAllFundingList,
    getFundingByLoan,
    getFundingDetails,
    getFundingListByInvestor,
    getInvestorFunding,
    getTotalDividen,
    getTotalFunding,
    getInvestorRequestWithdraw,
    fundingLoan,
    updateAdminFee,
    updateFundingStatus
};
