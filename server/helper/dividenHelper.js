const _ = require('lodash');
const DividenData = require('../model/dividenData');
const AssetData = require('../model/assetData');
const Logger = require('./logger');

const __calculateInterest = (fund, bunga, lamaTenor) => {
    const interest = (fund * (bunga / 100)) / 12;
    const dividen = (fund / lamaTenor) + interest;
    return (dividen);
};

const __calculateInterestValue = (fund, interest) => {
    const interestValue = Math.round((fund / 100) * interest / 12);
    return (interestValue);
};

const __calculateServiceFeeValue = (netAmount, interestValue, collectionInterest) => {
    const serviceFee = Math.ceil((netAmount + interestValue) * (collectionInterest / 100));
    return (serviceFee);
};

const __calculateNetAmountValue = (fund, tenor) => {
    const netAmount = Math.round(fund / tenor);
    return (netAmount);
};

const insertDividenData = (loanCode, userCode, amount, plan) => {
    return new Promise((resolve, reject) => {
        try {
            const insertStatus = DividenData.insertDividen(loanCode, userCode, amount, plan)
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
            Logger.write.log('error', 'insert Dividen Data error: ' + err.message);
            return reject(err);
        }
    });
};

const getInterestRate = (loanCode) => {
    return new Promise((resolve, reject) => {
        try {
            const interestData = DividenData.getInterestRate(loanCode);
            return resolve(interestData);
        } catch (err) {
            Logger.write.log('error', 'get Interest Rate data error: ' + err.message);
            return reject(err);
        }
    });
};

const insertDividenInvestor = (loanCode, userCode, amount, interest, collectionInterest, tenor) => {
    return new Promise(async (resolve, reject) => {
        try {
            const NetAmount = await __calculateNetAmountValue(amount, tenor);
            const InterestValue = await __calculateInterestValue(amount, interest);
            const TotalAmount = NetAmount + InterestValue;
            const ServiceFeeValue = await __calculateServiceFeeValue(TotalAmount, InterestValue, collectionInterest);

            for (let index = 1; index <= tenor; index++) {
                await DividenData.insertDividenInvestor(loanCode, userCode, ServiceFeeValue, InterestValue, TotalAmount, index);
                // console.log('DividenData.insertDividenInvestor(' + loanCode + ',' + userCode + ',' + ServiceFeeValue + ',' + InterestValue + ',' + TotalAmount + ',' + index + ')');
                // console.log('');
            }

            return resolve('ok');
        } catch (err) {
            Logger.write.log('error', 'insert dividen error: ' + err.message);
            return reject(err);
        }
    });
};

const calculateDividen = (loanCode, investorFunding, amount, bunga, serviceFee, lamaTenor, plan) => {
    return new Promise(async (resolve, reject) => {
        let totalInvestor = 0;
        try {
            await investorFunding.forEach(async (investorFund) => {
                const eachDividen = Math.round(__calculateInterest(investorFund.funding, bunga, lamaTenor));
                totalInvestor += eachDividen;
                await DividenData.insertDividen(loanCode, investorFund.user_code, eachDividen, plan);
                await AssetData.updateBalanceByUserCode(investorFund.user_code, eachDividen);
            });
            return resolve(totalInvestor);
        } catch (err) {
            Logger.write.log('error', 'calculate dividen error: ' + err.message);
            return reject(err);
        }
    });
};

const addAdminCommision = (loanCode, amount, totalInvestor, plan) => {
    return new Promise(async (resolve, reject) => {
        const danonAdmin = 'danonadmin';
        try {
            const danonCommision = await amount - totalInvestor;
            await DividenData.insertDividen(loanCode, danonAdmin, danonCommision, plan);
            await AssetData.updateBalanceByUserCode(danonAdmin, danonCommision);
            return resolve(danonCommision);
        } catch (err) {
            Logger.write.log('error', 'add admin commision error: ' + err.message);
            return reject(err);
        }
    });
};

const updateDividen = (status, loanCode, plan) => {
    return new Promise((resolve, reject) => {
        try {
            const dividenStatus = DividenData.updateDividen(status, loanCode, plan);
            return resolve(dividenStatus);
        } catch (err) {
            Logger.write.log('error', 'get Interest Rate data error: ' + err.message);
            return reject(err);
        }
    });
};

module.exports = {
    addAdminCommision,
    calculateDividen,
    getInterestRate,
    insertDividenInvestor,
    insertDividenData,
    updateDividen
};
