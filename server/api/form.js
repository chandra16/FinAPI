const _ = require('lodash');
const Joi = require('joi');
const Boom = require('boom');
const FormHelper = require('../helper/formHelper');

const selectDropdown = async (request, h) => {
    const req = request.payload;
    try {
        const selectDropdowns = await FormHelper.selectDropdownData();
        return h.response(selectDropdowns);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const selectDropdownCorporate = async (request, h) => {
    const req = request.payload;
    try {
        const selectDropdownCorporates = await FormHelper.selectDropdownCorporateData();
        return h.response(selectDropdownCorporates);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};


exports.plugin = {
    register: (server, options) => {
        options = _.extend({ basePath: '' }, options);

        server.route([{
            method: 'POST',
            path: options.basePath + '/form-dropdown',
            handler: selectDropdown,
            options: {
                description: 'Get json required on the form registration',
                tags: ['api', 'form'],
                auth: false
            }
        }, {
            method: 'POST',
            path: options.basePath + '/form-dropdown-corporate',
            handler: selectDropdownCorporate,
            options: {
                description: 'Get json required on the form corporate registration',
                tags: ['api', 'form'],
                auth: false
            }
        }]);
    },

    'name': 'api-form'
};
