const _ = require('lodash');
const Boom = require('boom');
const Joi = require('joi');
const RatingHelper = require('../helper/ratingHelper');
const Logger = require('../helper/logger');

const addBessRating = async (request, h) => {
    const req = request.payload;
    Logger.write.log('info', 'payload' + JSON.stringify(req));
    try {
        const insertRating = await RatingHelper.insertRatingData(req.maks, req.min, req.ratingId, req.userId);
        return h.response(insertRating);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const getBessRating = async (request, h) => {
    const req = request.payload;
    Logger.write.log('info', 'payload' + JSON.stringify(req));
    try {
        const getRating = await RatingHelper.getBessRating();
        return h.response(getRating);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const updateBessRating = async (request, h) => {
    const req = request.payload;
    Logger.write.log('info', 'payload' + JSON.stringify(req));
    try {
        const updateRating = await RatingHelper.updateBessRating(req.ratingId, req.maks, req.min, req.rating, req.userId);
        return h.response(updateRating);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const disableBessRating = async (request, h) => {
    const req = request.payload;
    Logger.write.log('info', 'payload' + JSON.stringify(req));
    try {
        const disableRating = await RatingHelper.disableBessRating(req.ratingId, req.userId);
        return h.response(disableRating);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const getCreditScoringWeight = async (request, h) => {
    try {
        const id = request.params.id !== null ? request.params.id : 0;
        const creditScoringWeight = await RatingHelper.getCreditScoringWeight(request.params.type, id);
        return h.response(creditScoringWeight);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const getCreditScoringType = async (request, h) => {
    try {
        const id = request.params.id !== null ? request.params.id : 0;
        const creditScoringWeight = await RatingHelper.getCreditScoring(request.params.type, id);
        return h.response(creditScoringWeight);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const saveCreditScoringWeight = async (request, h) => {
    const req = request.payload;
    const isNew = req.weightId === 0;
    try {
        const creditScoringWeight = isNew ? await RatingHelper.addCreditScoringWeight(req.type, req.variableId, req.weight, req.userCode)
         : await RatingHelper.updateCreditScoringWeight(req.weightId, req.weight, req.userCode);
        return h.response(creditScoringWeight);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const saveCreditScoring = async (request, h) => {
    const req = request.payload;
    const isNew = req.scoringId === 0;
    try {
        const creditScoring = isNew ? await RatingHelper.addCreditScoring(req.type, req.ratingId, req.minVal, req.userCode)
         : await RatingHelper.updateCreditScoring(req.scoringId, req.ratingId, req.minVal, req.userCode);
        return h.response(creditScoring);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const getRatingList = async (request, h) => {
    try {
        const getRating = await RatingHelper.getRatingList();
        return h.response(getRating);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

exports.plugin = {
    register: (server, options) => {
        options = _.extend({ basePath: '' }, options);

        server.route([{
            method: 'GET',
            path: options.basePath + '/',
            handler: getRatingList,
            options: {
                description: 'get All available rating',
                tags: ['api', 'Rating'],
                auth: false
            }
        },{
            method: 'POST',
            path: options.basePath + '/bess',
            handler: addBessRating,
            options: {
                description: 'Insert Rating for Bess',
                tags: ['api', 'Rating'],
                auth: false
            }
        },
        {
            method: 'GET',
            path: options.basePath + '/bess',
            handler: getBessRating,
            options: {
                description: 'Get Rating for Bess',
                tags: ['api', 'Rating'],
                auth: false
            }
        },
        {
            method: 'POST',
            path: options.basePath + '/bess/update',
            handler: updateBessRating,
            options: {
                description: 'Update Rating for Bess',
                tags: ['api', 'Rating'],
                auth: false
            }
        },
        {
            method: 'POST',
            path: options.basePath + '/bess/disable',
            handler: disableBessRating,
            options: {
                description: 'Disable a Rating for Bess',
                tags: ['api', 'Rating'],
                auth: false
            }
        },{
            method: 'GET',
            path: options.basePath + '/weight/{type}',
            handler: getCreditScoringWeight,
            options: {
                description: 'Get Weight by loan type',
                tags: ['api', 'Weight'],
                auth: false
            }
        },{
            method: 'GET',
            path: options.basePath + '/weight/{type}/{id}',
            handler: getCreditScoringWeight,
            options: {
                description: 'Get Weight by loan type by id',
                tags: ['api', 'Weight'],
                auth: false
            }
        },{
            method: 'GET',
            path: options.basePath + '/{type}/{id}',
            handler: getCreditScoringType,
            options: {
                description: 'Get rating by loan type by id',
                tags: ['api', 'Rating'],
                auth: false
            }
        },{
            method: 'GET',
            path: options.basePath + '/{type}',
            handler: getCreditScoringType,
            options: {
                description: 'Get rating by loan type',
                tags: ['api', 'Rating'],
                auth: false
            }
        }, {
            method: 'POST',
            path: options.basePath + '/weight',
            handler: saveCreditScoringWeight,
            options: {
                description: 'Save Credit Scoring Weight',
                tags: ['api', 'Weight'],
                auth: false
            }
        }, {
            method: 'POST',
            path: options.basePath + '/',
            handler: saveCreditScoring,
            options: {
                description: 'Save Credit Scoring',
                tags: ['api', 'Rating'],
                auth: false
            }
        }]);
    },

    'name': 'api-rating'
};
