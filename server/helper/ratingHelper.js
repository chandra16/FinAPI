const RatingData = require('../model/ratingData');
const CreditScoringData = require('../model/creditScoringData');

const insertRatingData = function (maks, min, ratingId, userId) {
    return new Promise(function (resolve, reject) {
        RatingData.addBessRating(maks, min, ratingId, userId)
        .then((result) => {
            if (result) {
              const successResult = {
                  'statusCode': 'C0001',
                  'response': 'Success',
                  'message': 'Insert data Borrower successfully'
              };
                return resolve(successResult);
            }
        })
        .catch((err) => {
            return reject(err);
        });
    });
};

const getBessRating = () => {
    return new Promise( (resolve, reject) => {
        try {
            const allBessRating = RatingData.getBessRating();
            resolve(allBessRating);
        } catch (err) {
            reject({ 'err.message': err });
        }
    });
};

const updateBessRating = (ratingId, maks, min, rating, userId) => {
    return new Promise( (resolve, reject) => {
        try {
            const updateRating = RatingData.updateBessRating(ratingId, maks, min, rating, userId);
            resolve(updateRating);
        } catch (err) {
            reject({ 'err.message': err });
        }
    });
};

const disableBessRating = (ratingId, userId) => {
    return new Promise( (resolve, reject) => {
        try {
            const disableRating = RatingData.disableBessRating(ratingId, userId);
            resolve(disableRating);
        } catch (err) {
            reject({ 'err.message': err });
        }
    });
};

const getCreditScoringWeight = (type, id) => {
    return new Promise( (resolve, reject) => {
        try {
            const creditScoringWeight = CreditScoringData.getCreditScoringWeight(type, id);
            resolve(creditScoringWeight);
        } catch (err) {
            reject({ 'err.message': err });
        }
    });
};

const addCreditScoringWeight = (type, variableId, weight, userCode) => {
    return new Promise( (resolve, reject) => {
        try {
            const addCreditScoringWeightResult = CreditScoringData.addCreditScoringWeight(type, variableId, weight, userCode);
            resolve(addCreditScoringWeightResult);
        } catch (err) {
            reject({ 'err.message': err });
        }
    });
};

const updateCreditScoringWeight = (id, weight, userCode) => {
    return new Promise( (resolve, reject) => {
        try {
            const updateScoringWeight = CreditScoringData.updateCreditScoringWeight(id, weight, userCode);
            resolve(updateScoringWeight);
        } catch (err) {
            reject({ 'err.message': err });
        }
    });
};

const getCreditScoring = (type, id) => {
    return new Promise( (resolve, reject) => {
        try {
            const creditScoring = CreditScoringData.getCreditScoring(type, id);
            resolve(creditScoring);
        } catch (err) {
            reject({ 'err.message': err });
        }
    });
};

const addCreditScoring = (type, ratingId, minValue, userCode) => {
    return new Promise( (resolve, reject) => {
        try {
            const addCreditScoringResult = CreditScoringData.addCreditScoring(type, ratingId, minValue, userCode);
            resolve(addCreditScoringResult);
        } catch (err) {
            reject({ 'err.message': err });
        }
    });
};

const updateCreditScoring = (id, ratingId, minValue, userCode) => {
    return new Promise( (resolve, reject) => {
        try {
            const updateScoring = CreditScoringData.updateCreditScoring(id, ratingId, minValue, userCode);
            resolve(updateScoring);
        } catch (err) {
            reject({ 'err.message': err });
        }
    });
};

const getRatingList = () => {
    return new Promise( (resolve, reject) => {
        try {
            const ratingList = RatingData.getRatingList();
            resolve(ratingList);
        } catch (err) {
            reject({ 'err.message': err });
        }
    });
};

module.exports = {
    insertRatingData,
    getBessRating,
    updateBessRating,
    disableBessRating,
    addCreditScoringWeight,
    getCreditScoringWeight,
    updateCreditScoringWeight,
    addCreditScoring,
    getCreditScoring,
    updateCreditScoring,
    getRatingList
};
