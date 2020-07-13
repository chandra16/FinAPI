const UserData = require('../model/userData');
const LoanData = require('../model/loanData');
const UtilsData = require('../model/utilsData');
const AuthData = require('../model/authenticationData');
const AssetData = require('../model/assetData');
const VirtualAccData = require('../model/virtualAccData');
const FundingData = require('../model/fundingData');
const SystemVariableData = require('../model/systemVariableData');
const EColl = require('../service/eColl');
const BniRDL = require('../service/bniRDL');
const DigisignData = require('../model/digisignData');
const DividenHelper = require('./dividenHelper');
const Logger = require('./logger');
const ConstantHelper = require('../helper/constantHelper');

const __getRandomToken = (totalLength) => {
    const randomToken = Array(totalLength).fill(0).map(() =>
        Math.random().toString(36).charAt(2)).join('');
    return randomToken;
};

const __checkReferalExist = (referalCode) => {
    return new Promise((resolve, reject) => {
        try {
            const checkRef = UserData.getReferalCode(referalCode);
            if (checkRef) {
                return resolve(true);
            }

            return resolve(false);
        } catch (err) {
            Logger.write.log('error', 'get check referal exist error: ' + err.message);
            return reject(err);
        }
    });
};

const getAllNewBorrower = (roleId, status) => {
    return new Promise((resolve, reject) => {
        try {
            const borrowers = UserData.getAllNewUser(roleId, status);
            return resolve(borrowers);
        } catch (err) {
            Logger.write.log('error', 'get all new user error: ' + err.message);
            return reject(err);
        }
    });
};

const getAllNewInvestor = (roleId, status) => {
    return new Promise((resolve, reject) => {
        try {
            const investors = UserData.getAllNewUser(roleId, status);
            return resolve(investors);
        } catch (err) {
            Logger.write.log('error', 'get all new investor error: ' + err.message);
            return reject(err);
        }
    });
};

const approveUser = (userCode, roleId, admin, status) => {
    return new Promise(async (resolve, reject) => {
        try {
            let randomReferalCode = null;
            if (roleId === 2) {
                do {
                    randomReferalCode = await __getRandomToken(6);
                    checkExistRef = await __checkReferalExist(randomReferalCode);
                } while (checkExistRef === false);
            }

            const approveStatus = UserData.approveUser(userCode, roleId, admin, status, randomReferalCode)
                .then((dataObject) => {
                    if (dataObject.affectedRows) {
                        return ({
                            'statusCode': 'C0001',
                            'response': 'Success',
                            'message': 'Approve user data succesfully'
                        });
                    }

                    return ({
                        'statusCode': 'E0001',
                        'response': 'Failed',
                        'message': 'Ooops ! Something wrong with our ends'
                    });
                });
            return resolve(approveStatus);
        } catch (err) {
            Logger.write.log('error', 'approve user error: ' + err.message);
            return reject(err);
        }
    });
};

const approveLoan = (approvalUser, loanCode, status, currBunga, cuurGrade, admin, adminFee, reasonRej) => {
    return new Promise((resolve, reject) => {
        try {
            console.log('lolo', approvalUser);
            if (approvalUser === 1) {
                LoanData.approveLoan(loanCode, status, currBunga, cuurGrade, admin, adminFee, reasonRej)
                    .then((dataObject) => {
                        if (dataObject.affectedRows) {
                            if (status === 1) {
                                FundingData.insertFunding(loanCode, 0, status, admin)
                                    .then((dataFundingObject) => {
                                        if (dataFundingObject.affectedRows) {
                                            return resolve({
                                                'statusCode': 'C0001',
                                                'response': 'Success',
                                                'message': 'Approve Loan succesfully'
                                            });
                                        }

                                        return resolve({
                                            'statusCode': 'E0001',
                                            'response': 'Failed',
                                            'message': 'Ooops ! Something wrong with our ends'
                                        });
                                    });
                            } else {
                                return resolve({
                                    'statusCode': 'C0001',
                                    'response': 'Success',
                                    'message': 'Reject Loan succesfully'
                                });
                            }
                        } else {
                            return resolve({
                                'status': 'ok'
                            });
                        }
                    });
            } else {
                const rejectStatus = {
                    'statusCode': 'E0002',
                    'response': 'Failed',
                    'message': 'user have not been approved yet'
                };
                return reject(rejectStatus);
            }
        } catch (err) {
            Logger.write.log('error', 'approve loan error: ' + err.message);
            return reject(err);
        }
    });
};

const getSystemVariable = (name) => {
    return new Promise((resolve, reject) => {
        try {
            let variables;
            if (name === 'SCORING') {
                variables = SystemVariableData.getSystemVariable(name);
            }
            else if (name === 'TENOR') {
                variables = SystemVariableData.getAllTenor();
            }

            return resolve(variables);
        } catch (err) {
            Logger.write.log('error', 'get system variable error: ' + err.message);
            return reject(err);
        }
    });
};

const getSystemVariableById = (name, id) => {
    return new Promise((resolve, reject) => {
        try {
            let variables;
            if (name === 'SCORING') {
                variables = SystemVariableData.getSystemVariableById(id);
            }
            else if (name === 'TENOR') {
                variables = SystemVariableData.getAllTenor();
            }

            return resolve(variables);
        } catch (err) {
            Logger.write.log('error', 'get system variable error: ' + err.message);
            return reject(err);
        }
    });
};

const getBungaByTenor = (tenorType, tenor, id) => {
    return new Promise((resolve, reject) => {
        try {
            const variables = SystemVariableData.getBungaByTenor(tenorType, tenor, id);
            return resolve(variables);
        } catch (err) {
            Logger.write.log('error', 'get getBungaByTenor error: ' + err.message);
            return reject(err);
        }
    });
};

const addSystemVariable = (name, item) => {
    return new Promise((resolve, reject) => {
        try {
            const addStatus = SystemVariableData.addSystemVariable(name, item);
            return resolve(addStatus);
        } catch (err) {
            Logger.write.log('error', 'get system variable error: ' + err.message);
            return reject(err);
        }
    });
};

const updateSystemVariable = (id, item) => {
    return new Promise((resolve, reject) => {
        try {
            const updateStatus = SystemVariableData.updateSystemVariable(id, item);
            return resolve(updateStatus);
        } catch (err) {
            Logger.write.log('error', 'get system variable error: ' + err.message);
            return reject(err);
        }
    });
};

const insertInterestRate = (ratingId, tenorId, bunga, serviceFee, borrowerFee) => {
    return new Promise((resolve, reject) => {
        try {
            const addStatus = SystemVariableData.insertInterestRate(ratingId, tenorId, bunga, serviceFee, borrowerFee);
            return resolve(addStatus);
        } catch (err) {
            Logger.write.log('error', ' insertInterestRate error: ' + err.message);
            return reject(err);
        }
    });
};

const updateInterestRate = (interestId, ratingId, tenorId, bunga, serviceFee, borrowerFee) => {
    return new Promise((resolve, reject) => {
        try {
            const updateStatus = SystemVariableData.updateInterestRate(interestId, ratingId, tenorId, bunga, serviceFee, borrowerFee);
            return resolve(updateStatus);
        } catch (err) {
            Logger.write.log('error', ' updateInterestRate error: ' + err.message);
            return reject(err);
        }
    });
};

/**
 **** ===== FUNCTION HANDLE DISBURSEMENT FROM RDL INVESTOR TO ESCROW ACCOUNT DANON ====================================================== ***
 */
const disbursToEscrow = (loanCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            // !! ===== From loanCode find the funder get the userCode, and amount .
            const fundingList = await FundingData.getListFunding(loanCode);
            const descText = 'Funding for ' + loanCode;

            // !! ===== Looping As much Investor who funded the loan .
            for (const eachFund of fundingList) {
                //* -- Description Remark in Payment Using Transfer in BNI RDL -----
                const descRemark = eachFund.virtual_acc + ' transfer funding for ' + loanCode;

                //* -- Get Investor Detail -----------------------------------------
                const userDetail = await AuthData.getUserDetail(eachFund.user_code);
                // console.log('|== User Detail         : ', userDetail[0]);

                //* -- Generate Transaction ID -------------------------------------
                const trxId = userDetail[0].authentication_id + loanCode.substr(-6) + '02';

                //* -- Inquiry Balance of RDL Investor -----------------------------
                const balanceRDL = await BniRDL.inquiryAccountBalance(eachFund.virtual_acc);
                // const balanceRDL = {
                //     response: {
                //         accountBalance: 100000
                //     }
                // };

                //* -- Checking for Agent && Disburse Agent Commission -------------
                if (userDetail[0].referal_by && userDetail[0].referal_by !== '-') {
                    // get user Asset Data .
                    const agentData = await AssetData.getAssetDataByRefCode(userDetail[0].referal_by);
                    console.log('|== Agent Data          : ', agentData[0]);

                    // get Interest Commission .
                    const interestCommision = await getAgentCommissionInterest(eachFund.funding);
                    console.log('|== Interest Commission : ', interestCommision + ' %');

                    // get Calculation of Fund
                    const commission = await interestCommision * eachFund.funding / 100;
                    console.log('|== * Commission        : ', commission);

                    // do Transfer From GIRO to RDL Agent
                    const descCommission = 'Transfer agent comission from ' + userDetail[0].user_code;
                    await BniRDL.paymentUsingTransfer(await ConstantHelper.getValue('danonGiroNo'), agentData[0].virtual_acc, 'IDR', commission, descCommission);

                    // insert into Table Giro Transaction
                    await AssetData.insertGiroTxn(agentData[0].user_code, agentData[0].virtual_acc, commission, agentData[0].bank_name, agentData[0].full_name, descCommission, userDetail[0].user_code);
                }

                //* -- Checking Balance in RDL || Make sure Balance > Fund ---------
                console.log('=====Balance check : ', balanceRDL, balanceRDL.response.accountBalance);
                if (balanceRDL.response) {
                    if (balanceRDL.response.accountBalance >= eachFund.funding) {
                        //* Create VA ----------------------------------------------
                        const virtualAccountNo = await EColl.createVirtualAccount(eachFund.funding, trxId, userDetail[0].nama, '0' + userDetail[0].no_hp, userDetail[0].email, null, descText, null);
                        // console.log('EColl.createVirtualAccount(' + eachFund.funding + ',' + trxId + ',' + userDetail[0].nama + ', 0' + userDetail[0].no_hp + ',' + userDetail[0].email + ',' + null + ',' + descText + ',' +  null + ')');
                        // console.log('');
                        // const virtualAccountNo = {
                        //     virtual_account: 123456789
                        // };
                        console.log('======Virtual account no : ', virtualAccountNo.virtual_account);

                        //* DO transfer from RDL to Escrow from VA -----------------
                        await BniRDL.paymentUsingTransfer(eachFund.virtual_acc, await ConstantHelper.getValue('danonGiroNo'), 'IDR', eachFund.funding, descRemark);
                        // await BniRDL.paymentUsingTransfer(eachFund.virtual_acc, virtualAccountNo.virtual_account, 'IDR', eachFund.funding, descRemark);
                        // console.log('BniRDL.paymentUsingTransfer(' + eachFund.virtual_acc + ',' + virtualAccountNo.virtual_account + ', IDR,' + eachFund.funding + ',' + descRemark + ')');
                        // console.log('');

                        //* Insert History of VA transaction -----------------------
                        await VirtualAccData.insertVirtualData(eachFund.user_code, loanCode, virtualAccountNo.virtual_account, eachFund.funding, trxId, 0, descText);
                        // console.log('VirtualAccData.insertVirtualData(' + eachFund.user_code + ',' + loanCode + ',' + virtualAccountNo.virtual_account + ',' + eachFund.funding + ',' + trxId + ', 0,' + descText + ')');
                        // console.log('');

                        //* Insert into Table Dividen ------------------------------
                        await DividenHelper.insertDividenInvestor(loanCode, eachFund.user_code, eachFund.funding, eachFund.total_interest, eachFund.collection_interest, eachFund.lama_tenor);
                        // console.log('DividenHelper.insertDividenInvestor(' + loanCode + ',' + eachFund.user_code + ',' + eachFund.funding + ',' + eachFund.total_interest + ',' + eachFund.collection_interest + ',' + eachFund.lama_tenor + ')');
                        // console.log('');
                    } else if (balanceRDL.response.accountBalance < eachFund.funding) {
                        return reject({
                            'statusCode': 'E0002',
                            'response': 'Failed',
                            'message': 'Balance is not enough'
                        });
                    }
                } else if (balanceRDL.Response) {
                    return reject({
                        'statusCode': 'E0001',
                        'response': 'Failed',
                        'message': 'Token has expired'
                    });
                }
            }
            // !! ====== End of Looping .

            // !! ====== Send sucess response or send success response with message that some investor failed in create va .
            return resolve({
                'statusCode': 'C0001',
                'response': 'Success',
                'message': 'All Investor funding successfully transfered to Escrow Account'
            });
        } catch (err) {
            Logger.write.log('error', ' insertInterestRate error: ' + err.message);
            return reject(err);
        }
    });
};
/**
 **** ==================================================================================================================================== ***
 */



/**
 **** ===== GET AGENT COMISSION (LOCAL FUNCTION) ========================================================================================= ***
 */
const getAgentCommissionInterest = async (fundingValue) => {
    // Get Agent Commission .
    const agentCommission = await SystemVariableData.getListAgentComission();
    // console.log('*** Agent Commission : ', agentCommission);

    // Check Interest of Agent Commission .
    for (const agentCom of agentCommission) {
        if (agentCom.deleted !== 1) {
            if (agentCom.lower_limit <= fundingValue && fundingValue <= agentCom.upper_limit) {
                return agentCom.interest;
            }
        }
    }

    return 'err';
};
/**
 **** ==================================================================================================================================== ***
 */

const updatePaymentVa = (virtualAcc, trxId, paymentId, paymentDate) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('======updatePaymentVa: ', virtualAcc, trxId, paymentId, paymentDate);
            const updatePayment = await VirtualAccData.updatePayment(virtualAcc, trxId, 1, paymentId, paymentDate);
            if (updatePayment.affectedRows) {
                return resolve('OK');
            }

            return resolve('failed');
        } catch (err) {
            Logger.write.log('error', 'update va payment error: ' + err.message);
            return reject(err);
        }

    });
};

const updatePaymentVaBrw = (virtualAcc, trxId, paymentId, paymentDate) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('======updatePaymentVaBrw: ', virtualAcc, trxId, paymentId, paymentDate);
            const updatePayment = await VirtualAccData.updatePaymentBrw(virtualAcc, trxId, 1, paymentId, paymentDate);
            if (updatePayment.affectedRows) {
                return resolve('OK');
            }

            return resolve('failed');
        } catch (err) {
            Logger.write.log('error', 'update va payment error: ' + err.message);
            return reject(err);
        }

    });
};

const checkRoleTransaction = (trxId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const updatePayment = await VirtualAccData.getRoleTrx(trxId);
            if (updatePayment[0].borrower !== null && updatePayment[0].investor === null) {
                return resolve(1);
            } else if (updatePayment[0].borrower === null && updatePayment[0].investor !== null) {
                return resolve(2);
            }

            return resolve('error');
        } catch (err) {
            Logger.write.log('error', 'check Role Transaction error: ' + err.message);
            return reject(err);
        }

    });
};

const createCIFAccount = (title, firstName, middleName, lastName, optNPWP, NPWPNum, nationality, domicileCountry, religion, birthPlace, birthDate, gender, isMarried, motherMaidenName, jobCode, education, idNumber, idIssuingCity, idExpiryDate, addressStreet, addressRtRwPerum, addressKel, addressKec, zipCode, homePhone1, homePhone2, officePhone1, officePhone2, mobilePhone1, mobilePhone2, faxNum1, faxNum2, branchOpening, monthlyIncome, email) => {
    return new Promise((resolve, reject) => {
        try {
            const registerCIF = BniRDL.registerCIFInvestor(title, firstName, middleName, lastName, optNPWP, NPWPNum, nationality, domicileCountry, religion, birthPlace, birthDate, gender, isMarried, motherMaidenName, jobCode, education, idNumber, idIssuingCity, idExpiryDate, addressStreet, addressRtRwPerum, addressKel, addressKec, zipCode, homePhone1, homePhone2, officePhone1, officePhone2, mobilePhone1, mobilePhone2, faxNum1, faxNum2, branchOpening, monthlyIncome, email);
            return resolve(registerCIF);

        } catch (err) {
            Logger.write.log('error', ' create CIF error: ' + err.message);
            return reject(err);
        }
    });
};

const createRDLAccount = (cifNumber, accountType, currency, openAccountReason, sourceOfFund, branchId) => {
    return new Promise((resolve, reject) => {
        try {
            const registerRDL = BniRDL.registerRDLInvestor(cifNumber, accountType, currency, openAccountReason, sourceOfFund, branchId);
            return resolve(registerRDL);

        } catch (err) {
            Logger.write.log('error', ' create RDL error: ' + err.message);
            return reject(err);
        }
    });
};

const getRemainingTimeToken = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const tokenData = await UtilsData.getToken();
            return resolve(tokenData);

        } catch (err) {
            Logger.write.log('error', 'get remaining Token Data error: ' + err.message);
            return reject(err);
        }
    });
};

const getListAgentComission = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const listAgentComission = await SystemVariableData.getListAgentComission();
            return resolve(listAgentComission);

        } catch (err) {
            Logger.write.log('error', 'get list Agent Comission error: ' + err.message);
            return reject(err);
        }
    });
};

const insertNewAgentComission = (interestComission, lowerLimit, upperLimit, createdBy) => {
    return new Promise(function (resolve, reject) {
        SystemVariableData.insertAgentComission(
            interestComission,
            lowerLimit,
            upperLimit,
            createdBy)
            .then((result) => {
                if (result) {
                    const successResult = {
                        'statusCode': 'C0001',
                        'response': 'Success',
                        'message': 'Insert new Agent Comission Successs'
                    };
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                return reject(err);
            });
    });
};

const updateDataAgentComission = (idAgentComission, interestComission, lowerLimit, upperLimit, updatedBy) => {
    return new Promise(function (resolve, reject) {
        SystemVariableData.updateAgentComission(
            idAgentComission,
            interestComission,
            lowerLimit,
            upperLimit,
            updatedBy)
            .then((result) => {
                if (result) {
                    const successResult = {
                        'statusCode': 'C0001',
                        'response': 'Success',
                        'message': 'Update data Agent Comission Successs'
                    };
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                return reject(err);
            });
    });
};

const deleteDataAgentComission = (idAgentComission, deletedBy) => {
    return new Promise(function (resolve, reject) {
        SystemVariableData.deleteAgentComission(
            idAgentComission,
            deletedBy)
            .then((result) => {
                if (result) {
                    const successResult = {
                        'statusCode': 'C0001',
                        'response': 'Success',
                        'message': 'Delete data Agent Commission Successs'
                    };
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                return reject(err);
            });
    });
};

const getCollateralType = () => {
    return new Promise(function (resolve, reject) {
        SystemVariableData.getCollateralType()
        .then((result) => {
            return resolve(result);
        })
        .catch((err) => {
            return reject(err);
        });
    });
};

const createColType = (nameType) => {
    return new Promise(function (resolve, reject) {
        SystemVariableData.createCollateralType(nameType)
        .then((result) => {
            return resolve(result);
        })
        .catch((err) => {
            return reject(err);
        });
    });
};

const getCollateraldetail = (idType) => {
    return new Promise(function (resolve, reject) {
        SystemVariableData.getCollateralDetail(idType)
        .then((result) => {
            return resolve(result);
        })
        .catch((err) => {
            return reject(err);
        });
    });
};

const createColDetail = (typeId, nameField) => {
    return new Promise(function (resolve, reject) {
        SystemVariableData.createCollateralDetail(typeId, nameField)
        .then((result) => {
            return resolve(result);
        })
        .catch((err) => {
            return reject(err);
        });
    });
};

module.exports = {
    approveLoan,
    approveUser,
    disbursToEscrow,
    checkRoleTransaction,
    createCIFAccount,
    createRDLAccount,
    getAgentCommissionInterest,
    getAllNewBorrower,
    getAllNewInvestor,
    getSystemVariable,
    getSystemVariableById,
    getBungaByTenor,
    getRemainingTimeToken,
    getListAgentComission,
    addSystemVariable,
    updatePaymentVa,
    updatePaymentVaBrw,
    updateSystemVariable,
    insertInterestRate,
    insertNewAgentComission,
    updateInterestRate,
    updateDataAgentComission,
    deleteDataAgentComission,
    getCollateralType,
    getCollateraldetail,
    createColType,
    createColDetail
};
