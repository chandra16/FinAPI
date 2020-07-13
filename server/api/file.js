const _ = require('lodash');
const Joi = require('joi');
const Boom = require('boom');
const FileHelper = require('../helper/fileHelper');
const FormHelper = require('../helper/formHelper');
const LoanHelper = require('../helper/loanHelper');
const Logger = require('../helper/logger');
const Config = require('../../config');
const Word2pdf = '';
const Stream = require('stream');
const Fs = require('fs');
const Os = require('os');

const processFile = async (request, h) => {
    const req = request.payload;
    Logger.write.log('info', 'payload' + JSON.stringify(req));
    try {
        const selectDropdowns = await FormHelper.selectDropdownData();
        return h.response(selectDropdowns);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const generateFactSheet = async (request, h) => {
    const req = request.payload;
    try {
        // ========== generate file factSheet ===========
        typeloan = await LoanHelper.getLoanDetail(req.loanCode);
            // Get data for fact sheet

            // risk
            if(typeloan[0].id_loan_type.toString() === '3') {
                const risk = await LoanHelper.getDataRisk(req.loanCode);
            console.log('Risk Profile: ' + risk[0].title);
            const paramRisk = {
                risk1: risk[0].title,
                risk2: risk[1].title,
                risk3: risk[2].title,
                riskDesc1: risk[0].risk_desc,
                riskDesc2: risk[1].risk_desc,
                riskDesc3: risk[2].risk_desc
            };

            // payor
            const payor = await LoanHelper.getDataPayor(req.loanCode);

            // dataCoorporate
            const dataBor = await LoanHelper.getDataBorrower(req.loanCode);

            // Generate Fact Sheet
            const generateFile = await FileHelper.generateFactSheetFile(req.loanCode, 'TemplateFactSheet.docx', 'factSheet', 'factSheet', dataBor, payor, risk);

            return h.response(generateFile);
            }

        return h.response('saat ini, generate file masih untuk pinjaman invoicing saja');
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const downloadFile = async (request, h) => {
    try {
        process.stdout.write('Log::/Users/ferdinan/Documents/LAMPIRAN_PERJANJIAN_2.docx\n');
        const outputFile = await FileHelper.generatePksFile('/Users/ferdinan/Documents/LAMPIRAN_PERJANJIAN_2.docx', 'unsigned');
        const data = await Word2pdf(outputFile.docsFile);
        process.stdout.write('Log::/Users/ferdinan/Documents/LAMPIRAN_PERJANJIAN_2.docx\n');
        process.stdout.write('downloadFile::outputFile::' + JSON.stringify(outputFile) + '\n');
        Fs.writeFileSync(outputFile.pdfFile, data);
        return h.file('/Users/ferdinan/Documents/LAMPIRAN_PERJANJIAN_2.docx', { confine: false, filename: 'LAMPIRAN_PERJANJIAN_2.docx', mode: 'inline' }).type('application/docx');
    } catch (err) {
        return Boom.badRequest('error om');
    }
};

const generatePks = async (request, h) => {
    const req = request.payload;
    try {
        process.stdout.write('Log::/Users/ferdinan/Documents/LAMPIRAN_PERJANJIAN_2.docx\n');
        const outputFile = await FileHelper.generatePksFile(req.templateName, req.destName, req.docType, req.id, req.fullName, req.phone, req.noKtp, req.date);
        const data = await Word2pdf(outputFile.docsFile);
        process.stdout.write('Log::/Users/ferdinan/Documents/LAMPIRAN_PERJANJIAN_2.docx\n');
        process.stdout.write('downloadFile::outputFile::' + JSON.stringify(outputFile) + '\n');
        Fs.writeFileSync(outputFile.pdfFile, data);
        // return h.file(Config.get('/uploadFile') + req.destName + '/' + 'investor_' + req.id + '.docx', { confine: false, filename: 'investor_' + req.id + '.docx', mode: 'inline' }).type('application/docx');
        return h.download(Config.get('/uploadFile') + req.destName + '/' + 'investor_' + req.id + '.pdf');
    } catch (err) {
        console.log('===error: ', err);
        return Boom.badRequest('error om');
    }
};

const downloadPksFile = (request, h) => {
    const req = request.payload;
    try {
        const outputDir = Os.homedir() + Config.get('/uploadFile').substring(10);
        return h.file(outputDir + req.docType + '/' + req.docName, { confine: false, filename: req.docName, mode: 'inline' }).type('application/pdf');

    } catch (err) {
        console.log('===error: ', err);
        return Boom.badRequest('error om');
    }
};

const convert = async (inputFile, outputFile) => {
    const data = await word2pdf(inputFile);
    fs.writeFileSync(outputFile, data);
};

const getAllDocument = async (request, h) => {
    const req = request.payload;
    try {
        const documentData = await FileHelper.getDocumentData(req.docType);
        return h.response(documentData);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

exports.plugin = {
    register: (server, options) => {
        options = _.extend({ basePath: '' }, options);

        server.route([{
            method: 'POST',
            path: options.basePath + '/',
            handler: processFile,
            options: {
                description: 'Processing uploaded file',
                tags: ['api', 'File'],
                auth: false
            }
        }, {
            method: 'GET',
            path: options.basePath + '/download/{type}/{id}',
            handler: downloadFile,
            options: {
                description: 'Processing download file',
                tags: ['api', 'File'],
                auth: false
            }
        }, {
            method: 'POST',
            path: options.basePath + '/generate-contract',
            handler: generatePks,
            options: {
                description: 'Processing download file',
                tags: ['api', 'File'],
                auth: false
            }
        }, {
            method: 'POST',
            path: options.basePath + '/generate-factSheet',
            handler: generateFactSheet,
            options: {
                description: 'Generate File Fact Sheet',
                tags: ['api', 'loan'],
                validate: {
                    payload: {
                        loanCode: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/download-pks',
            handler: downloadPksFile,
            options: {
                description: 'Processing download file',
                tags: ['api', 'File'],
                auth: false,
                validate: {
                    payload: {
                        docType: Joi.string().required(),
                        docName: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/get-documents',
            handler: getAllDocument,
            options: {
                description: 'Get All document for signature',
                tags: ['api', 'File'],
                auth: false,
                validate: {
                    payload: {
                        docType: Joi.string().required()
                    }
                }
            }
        }]);
    },

    'name': 'api-file'
};
