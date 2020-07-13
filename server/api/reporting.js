const _ = require('lodash');
const Joi = require('joi');
const Boom = require('boom');
const ReportingHelper = require('../helper/reportingHelper');

const generateReporting = async (request, h) => {
    const req = request.payload;
    try {
        const generateReport = await ReportingHelper.generateReporting('admin');
        return h.response(generateReport);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const generateReportingProfilIndividu = async (request, h) => {
    const req = request.payload;
    try {
        const generateReportProfilIndividu = await ReportingHelper.generateReportingProfilIndividu();
        return h.response(generateReportProfilIndividu);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const generateReportingProfilPinjaman = async (request, h) => {
    const req = request.payload;
    try {
        const generateReportProfilPinjaman = await ReportingHelper.generateReportingProfilPinjaman();
        return h.response(generateReportProfilPinjaman);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const generateReportingPermohonanPinjaman = async (request, h) => {
    const req = request.payload;
    try {
        const generateReportPermohonanPinjaman = await ReportingHelper.generateReportingPermohonanPinjaman();
        return h.response(generateReportPermohonanPinjaman);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const generateReportingPersetujuanPinjaman = async (request, h) => {
    const req = request.payload;
    try {
        const generateReportPersetujuanPinjaman = await ReportingHelper.generateReportingPersetujuanPinjaman();
        return h.response(generateReportPersetujuanPinjaman);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const generateReportingStatusPinjaman = async (request, h) => {
    const req = request.payload;
    try {
        const generateReportStatusPinjaman = await ReportingHelper.generateReportingStatusPinjaman();
        return h.response(generateReportStatusPinjaman);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const generateReportingStatusAkumulasiPinjaman = async (request, h) => {
    const req = request.payload;
    try {
        const generateReportStatusAkumulasiPinjaman = await ReportingHelper.generateReportingStatusAkumulasiPinjaman();
        return h.response(generateReportStatusAkumulasiPinjaman);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const getFileReporting = async (request, h) => {
    const req = request.payload;
    try {
        const getFile = await ReportingHelper.getFileReporting(req.type, req.dd, req.mm, req.yy);
        return h.response(getFile);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const generateValueAllReporting = async (request, h) => {
    const req = request.payload;
    try {
        const generateReporting = await ReportingHelper.generatingValueAllReporting();
        return h.response(generateReporting);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const updateDataReportingEveryDay = async (request, h) => {
    const req = request.payload;
    try {
        const updateData = await ReportingHelper.updateDataReportingEveryDay();
        return h.response(updateData);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const selectDataReporting = async (request, h) => {
    const req = request.payload;
    try {
        if(req.type === 'form3A') {
            const dataPermohonanPeminjam = await ReportingHelper.generateForm3A(req.year);
            return h.response(dataPermohonanPeminjam); 
        } else if(req.type === 'form3B') {
            const dataPersetujuanPeminjam = await ReportingHelper.generateForm3B(req.month, req.year);
            return h.response(dataPersetujuanPeminjam);
        } else if(req.type === 'form3C') {
            const dataStatusPinjaman = await ReportingHelper.generateForm3C(req.year);
            return h.response(dataStatusPinjaman);
        } else if(req.type === 'selectData') {
            const dataStatusAkumulasiPinjaman = await ReportingHelper.__getValueFormulir3A(req.year);
            return h.response(dataStatusAkumulasiPinjaman);
        }

        const failResponse = {'statusCode': 'E0001',
        'response': 'Failed',
        'message': 'User has been deleted'};
        return h.response(failResponse);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

exports.plugin = {
    register: (server, options) => {
        options = _.extend({ basePath: '' }, options);

        server.route([{
            method: 'POST',
            path: options.basePath + '/generate-report-aging',
            handler: generateReporting,
            options: {
                description: 'Generate reporting and save into database',
                tags: ['api', 'form'],
                auth: false
            }
        }, {
            method: 'POST',
            path: options.basePath + '/select-data-reporting',
            handler: selectDataReporting,
            options: {
                description: 'Generate reporting',
                tags: ['api', 'form'],
                auth: false,
                validate: {
                    payload: {
                        type: Joi.string().required(),
                        year: Joi.string().required(),
                        month: Joi.string()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/get-file-reporting',
            handler: getFileReporting,
            options: {
                description: 'get file Reporting ',
                tags: ['api', 'form'],
                auth: false,
                validate: {
                    payload: {
                        dd: Joi.number().required(),
                        yy: Joi.number().required(),
                        mm: Joi.number().required(),
                        type: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/update-data-reporting-every-day',
            handler: updateDataReportingEveryDay,
            options: {
                description: 'Update Data reporting every day in database',
                tags: ['api', 'form'],
                auth: false
            }
        }, {
            method: 'POST',
            path: options.basePath + '/generate-reporting-every-year',
            handler: generateValueAllReporting,
            options: {
                description: 'Generate reporting default value in db every year',
                tags: ['api', 'form'],
                auth: false
            }
        }]);
    },

    'name': 'api-reporting'
};
