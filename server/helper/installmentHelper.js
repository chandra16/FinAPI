const _ = require('lodash');
const InstallmentData = require('../model/installmentData');
const AuthData = require('../model/authenticationData');
const LoanData = require('../model/loanData');
const VirtualAccData = require('../model/virtualAccData');
const EColl = require('../service/eColl');
const Logger = require('./logger');

const insertInstallmentData = (loanCode, userCode, amount, plan, dueDate) => {
    return new Promise((resolve, reject) => {
        try {
            const insertStatus = InstallmentData.insertInstallment(loanCode, userCode, amount, plan, dueDate)
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

const getListInstallment = (loanCode) => {
    return new Promise((resolve, reject) => {
        try {
            const installmentData = InstallmentData.getAllInstallmentByLoanCode(loanCode);
            return resolve(installmentData);
        } catch (err) {
              Logger.write.log('error', 'get list of all installment by loan code error: ' + err.message);
              return reject(err);
        }
    });
};

const disbursementInstallmentstatusHelper = (status) => {
    return new Promise( (resolve, reject) => {
        try {
            const allIsntallments = InstallmentData.getDisburseInstallmentStatus(status);
            resolve(allIsntallments);
        } catch (err) {
            reject({ 'err.message': err });
        }
    });
};

const getAmountLateInterest = (loanCode) => {
    return new Promise( (resolve, reject) => {
        try {
            const amountLateInterest = InstallmentData.getAmountLateInterest(loanCode);
            resolve(amountLateInterest);
        } catch (err) {
            reject({ 'err.message': err});
        }
    });
};

const getInvestorIncome = (loanCode, userCode, plan) => {
    return new Promise( (resolve, reject) => {
        try {
            const investorIncome = InstallmentData.getInvestorIncome(loanCode, userCode, plan);
            resolve(investorIncome);
        } catch (err) {
            reject({ 'err.message': err});
        }
    });
};

const getAmountInstallment = (loanCode) => {
    return new Promise( (resolve, reject) => {
        try {
            const amountInstallment = InstallmentData.getAmountInstallment(loanCode);
            resolve(amountInstallment);
        } catch (err) {
            reject({ 'err.message': err});
        }
    });
};


const getListInstallmentByUser = (userCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            const installmentData = await InstallmentData.getAllInstallmentByUserCode(userCode);
            const groupInstallment = _.mapValues(_.groupBy(installmentData, 'loan_code'),
                (groupVal) => groupVal.map((eachObj) => _.omit(eachObj, 'loan_code') ));
            return resolve(groupInstallment);
        } catch (err) {
              Logger.write.log('error', 'get list of all installment by user code error: ' + err.message);
              return reject(err);
        }
    });
};

const getPendingInstallment = (userCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            const installmentData = await InstallmentData.getPendingInstallment(userCode, 0);
            return resolve((installmentData[0].total !== null) ? installmentData[0].total : 0);
        } catch (err) {
              Logger.write.log('error', 'get total money of pending installment error: ' + err.message);
              return reject(err);
        }
    });
};

const getCurrentInstallment = (userCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            const installmentData = await InstallmentData.getCurrentInstallment(userCode, 0);
            return resolve((installmentData[0].total !== null) ? installmentData[0].total : 0);
        } catch (err) {
              Logger.write.log('error', 'get total money of current installment error: ' + err.message);
              return reject(err);
        }
    });
};

const updateInstallment = (loanCode, plan, remainingDay, paymentId, amount, status) => {
    return new Promise(async (resolve, reject) => {
        try {
            var amountLateInterest = 0;
            if(remainingDay < 0) {
                const sumOfDays = Math.abs(remainingDay);
                const lateInterest = await LoanData.getBorrowerFee(loanCode);
                amountLateInterest = amount * lateInterest[0].late_interest / 100 * sumOfDays;
            }

            const updateStatus = await InstallmentData.updateInstallment(loanCode, plan, paymentId, amount, status, amountLateInterest);
            if (updateStatus.affectedRows) {
                return resolve({'status': 'ok'});
            }

            return resolve({'status': 'failed'});
        } catch (err) {
              Logger.write.log('error', 'update installment error: ' + err.message);
              return reject(err);
        }
    });
};

const updateDisburseInstallmentStatus = (plan, loanCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            const updateStatus = await InstallmentData.updateDisburseInstallmentStatus(plan, loanCode);
            if (updateStatus) {
                return resolve({'status': 'ok'});
            }

            return resolve({'status': 'failed'});
        } catch (err) {
            Logger.write.log('error', 'update installment error: ' + err.message);
            return reject(err);
        }
    });

};

const getUpaidInstallmentData = (amount, userCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            const unpaidData = await InstallmentData.getUnpaidInstallment(amount, userCode);
            return resolve(unpaidData);
        } catch (err) {
            Logger.write.log('error', 'get unpaid installment data error: ' + err.message);
            return reject(err);
        }
    });
};

const getUnpaidInstallmentByLoanCodes = (loanCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            const unpaidData = await InstallmentData.getUnpaidInstallmentByLoanCode(loanCode);
            return resolve(unpaidData);
        } catch (err) {
            Logger.write.log('error', 'get unpaid installment by loan code data error: ' + err.message);
            return reject(err);
        }
    });
};

const getUserVaTransaction = (vaNumber, transactionId) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('getUserVaTransaction', vaNumber, transactionId);
            const userData = await InstallmentData.getUserFromVaTransaction(vaNumber, transactionId);
            return resolve(userData);
        } catch (err) {
            Logger.write.log('error', 'get user from va transaction error: ' + err.message);
            return reject(err);
        }
    });
};

const checkStatusDate = (dueDate) => {
    return new Promise((resolve) => {
        const todayDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        let endDate = (new Date(dueDate));
        endDate.setDate(endDate.getDate() + 1);
        endDate = new Date(new Date(endDate).getFullYear(), new Date(endDate).getMonth(), new Date(endDate).getDate());
        if (todayDate < endDate) {
            return resolve(1);
        } else if (todayDate > endDate) {
            return resolve(3);
        }

        return resolve(2);
    });
};

const calculateDate = (dueDate) => {
    return new Promise((resolve) => {
        const todayDate = new Date();
        const date1 = todayDate.getTime();
        const endDate = (new Date(dueDate));
        const date2 = endDate.getTime();
        const remaining = date2 - date1;
        const remainingDay = Math.round(remaining / (1000 * 60 * 60 * 24));

        return resolve(remainingDay);
    });
};

const getAllUnpaid = () => {
    return new Promise((resolve, reject) => {
        try {
            const unpaidData = InstallmentData.getAllUnpaid();
            return resolve(unpaidData);
        } catch (err) {
            Logger.write.log('error', 'get unpaid installment data error: ' + err.message);
            return reject(err);
        }
    });
};

const updateRemainingDay = (loanCode, plan, remainingDay) => {
    return new Promise((resolve, reject) => {
        try {
            const updateStatus = InstallmentData.updateRemainingDay(loanCode, plan, remainingDay);
            return resolve(updateStatus);
        } catch (err) {
            Logger.write.log('error', 'update remainin day data error: ' + err.message);
            return reject(err);
        }
    });
};

const installmentCalculation = (userCode, loanCode, totalAmount, lamaTenor, bunga) => {
    return new Promise(async (resolve, reject) => {
        try {
            const interest = Math.round((totalAmount * (bunga / 100) / 12));
            const amount = Math.round((totalAmount / lamaTenor) + interest);

            for (let planIndex = 0, totalPlan = lamaTenor; planIndex < totalPlan; planIndex++) {
                const endDate = new Date();
                endDate.setMonth(endDate.getMonth() + (planIndex + 1));
                const dueDate = endDate.toISOString().replace(/T/, ' ').replace(/\..+/, '');
                await insertInstallmentData(loanCode, userCode, amount, planIndex + 1, dueDate);
            }

            const userDetail = await AuthData.getUserDetail(userCode);
            const trxId = userDetail[0].authentication_id + '01' + loanCode.substr(-4) + '011';
            const descText = 'Installment for ' + loanCode;
            const virtualAccountNo = await EColl.createVirtualAccount(amount, trxId, userDetail[0].nama, '0' + userDetail[0].no_hp, userDetail[0].email, null, descText, null);
            //insert VA no to table asset borrower.
            await VirtualAccData.insertVirtualDataBrw(userCode, loanCode, virtualAccountNo.virtual_account, amount, trxId, 0, descText);
            return resolve(virtualAccountNo);
        } catch (err) {
            Logger.write.log('error', 'installment calculation error: ' + err.message);
            return reject(err);
        }
    });
};

const checkRemainingDay = (loanCode, remainingDay) => {
    return new Promise((resolve, reject) => {
        try {
            let lateStatus;
            if (remainingDay < -30 && remainingDay >= -90) {
                lateStatus = 1;
            } else if (remainingDay < -90 && remainingDay >= -120) {
                lateStatus = 2;
            } else if (remainingDay < -120 && remainingDay >= -180) {
                lateStatus = 3;
            } else if (remainingDay < -180) {
                lateStatus = 4;
            } else {
                lateStatus = 0;
            }

            if (lateStatus !== 0) {
                LoanData.updateCredibility(loanCode, lateStatus);
            }

            return resolve('ok');
        } catch (err) {
            Logger.write.log('error', 'check remainin day credibility error: ' + err.message);
            return reject(err);
        }
    });
};

module.exports = {
    calculateDate,
    checkRemainingDay,
    checkStatusDate,
    getAllUnpaid,
    getCurrentInstallment,
    getPendingInstallment,
    getListInstallment,
    getListInstallmentByUser,
    getUpaidInstallmentData,
    getUnpaidInstallmentByLoanCodes,
    getUserVaTransaction,
    insertInstallmentData,
    installmentCalculation,
    updateInstallment,
    updateRemainingDay,
    disbursementInstallmentstatusHelper,
    getAmountLateInterest,
    getAmountInstallment,
    getInvestorIncome,
    updateDisburseInstallmentStatus
};
