const _ = require('lodash');
const Joi = require('joi');
const Boom = require('boom');
const InvestorHelper = require('../helper/investorHelper');
const UtilHelper = require('../helper/utilsHelper');
const FundingHelper = require('../helper/fundingHelper');
const AuthHelper = require('../helper/authHelper');
const KycHelper = require('../helper/kycHelper');

const registerInvestorPersonal = async (request, h) => {
    const req = request.payload;
    try {
        const userCode = await UtilHelper.generateUserCode(req.nama, req.tanggalLahir);

        console.log('');
        console.log('|===================== DATA INVESTOR PERSONAL =======================|');
        console.log('| usercode => ', userCode);
        console.log('|=========================== END OF DATA ============================|');
        console.log('');

        const insertInvestorBank = await InvestorHelper.insertInvestorDataBank(
            req.userId,
            req.kodeBank,
            req.nomorRekening,
            req.namaNasabah,
            req.jenisRekening,
            req.cabang
        );

        const insertInvestor = await InvestorHelper.insertInvestorPersonalData(
            insertInvestorBank,
            userCode,
            req.userId,
            req.panggilan,
            req.nama,
            req.tempatLahir,
            req.tanggalLahir,
            req.jenisKelamin,
            req.agama,
            req.pekerjaan,
            req.statusPerkawinan,
            req.penghasilan,
            req.pendidikan,
            req.sumberDana,
            req.namaGadisIbu,
            req.alamat,
            req.provinsi,
            req.kabupaten,
            req.kecamatan,
            req.kelurahan,
            req.kodePos,
            req.kewarganegaraan,
            req.noNpwp,
            req.noKtp,
            req.tempatTerbit,
            req.tanggalKadaluarsa,
            req.noKitas,
            req.noPassport,
            req.uploadKtp,
            req.uploadNpwp,
            req.uploadSelfie
        );
        const getData = await AuthHelper.getPassword(null, null, req.userId);
        const authToken = await AuthHelper.getToken(true, getData.email, getData);
        const createKycValidation =  await KycHelper.createKycValidation(userCode);
        console.log(createKycValidation);
        return h.response({ insertInvestor, authToken });
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const registerInvestorCorporate = async (request, h) => {
    const req = request.payload;
    try {
        const userCode = await UtilHelper.generateUserCode(req.namaPerusahaan, req.tanggalBerdiri);

        console.log('');
        console.log('|==================== DATA INVESTOR CORPORATE =======================|');
        console.log('| usercode => ', userCode);
        console.log('|=========================== END OF DATA ============================|');
        console.log('');

        const insertInvestorPerusahaan = await InvestorHelper.insertInvestorCorporateDataPerusahaan(
            req.userId,
            req.namaPerusahaan,
            req.emailPerusahaan,
            req.teleponPerusahaan,
            req.tanggalBerdiri,
            req.tempatBerdiri,
            req.alamat,
            req.provinsi,
            req.kota,
            req.kodePos
        );

        const insertInvestorBank = await InvestorHelper.insertInvestorDataBank(
            req.userId,
            req.kodeBank,
            req.nomorRekening,
            req.namaNasabah,
            req.jenisRekening,
            req.cabang
        );

        const insertInvestorUser = await InvestorHelper.insertInvestorCorporateDataUser(
            insertInvestorPerusahaan,
            insertInvestorBank,
            userCode,
            req.userId,
            req.namaPIC,
            req.emailPIC,
            req.teleponPIC,
            req.noKTPPIC,
            req.uploadKtp,
            req.uploadNpwp
        );
        const getData = await AuthHelper.getPassword(null, null, req.userId);
        const authToken = await AuthHelper.getToken(true, getData.email, getData);
        const createKycValidation =  await KycHelper.createKycValidation(userCode);
        return h.response({ insertInvestorUser, authToken });
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const updateInvestorPersonalByAdmin = async (request, h) => {
    const req = request.payload;
    try {
        const authInvestor = await InvestorHelper.updateDataAuthInvestor(
            req.userCode,
            req.email,
            req.nomorTelepon
        );

        const dataDiriInvestor = await InvestorHelper.updateDataDiriInvestorPersonal(
            req.userCode,
            req.panggilan,
            req.nama,
            req.tempatLahir,
            req.tanggalLahir,
            req.jenisKelamin,
            req.agama,
            req.pekerjaan,
            req.statusPerkawinan,
            req.penghasilan,
            req.pendidikan,
            req.sumberDana,
            req.namaGadisIbu,
            req.alamat,
            req.provinsi,
            req.kabupaten,
            req.kecamatan,
            req.kelurahan,
            req.kodePos,
            req.kewarganegaraan,
            req.noNpwp,
            req.noKtp,
            req.tempatTerbit,
            req.tanggalKadaluarsa,
            req.noKitas,
            req.noPassport
        );

        return h.response(dataDiriInvestor);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const updateInvestorCorporateByAdmin = async (request, h) => {
    const req = request.payload;
    try {
        const authInvestor = await InvestorHelper.updateDataAuthInvestor(
            req.userCode,
            req.email,
            req.nomorTelepon
        );

        const dataDiriInvestor = await InvestorHelper.updateDataDiriInvestorCorporate(
            req.userCode,
            req.nama,
            req.noKtp
        );

        const dataPerusahaan = await InvestorHelper.updateDataPerusahaanInvestorCorporate(
            req.userCode,
            req.namaPerusahaan,
            req.emailPerusahaan,
            req.teleponPerusahaan,
            req.tempatBerdiri,
            req.tanggalBerdiri,
            req.alamatPerusahaan,
            req.provinsiPerusahaan,
            req.kotaPerusahaan,
            req.kodePosPerusahaan
        );

        return h.response(dataPerusahaan);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const updateInvestorBankByAdmin = async (request, h) => {
    const req = request.payload;
    try {
        const bankInvestor = await InvestorHelper.updateDataBankInvestor(
            req.userCode,
            req.kodeBank,
            req.nomorRekening,
            req.namaNasabah,
            req.jenisRekening,
            req.cabang
        );

        return h.response(bankInvestor);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const updateAlamatInvestorPersonal = async (request, h) => {
    const req = request.payload;
    try {
        const updateAlamatInvestorPersonals = await InvestorHelper.updateAlamatInvestorPersonal(
            req.userCode,
            req.kewarganegaraan,
            req.alamat,
            req.provinsi,
            req.kabupaten,
            req.kelurahan,
            req.kecamatan,
            req.kodePos
        );
        return h.response(updateAlamatInvestorPersonals);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const updateAlamatInvestorCorporate = async (request, h) => {
    const req = request.payload;
    try {
        const updateAlamatInvestorCorporates = await InvestorHelper.updateAlamatInvestorCorporate(
            req.userCode,
            req.alamatCompany,
            req.provinsiCompany,
            req.kotaCompany,
            req.kodePosCompany
        );
        return h.response(updateAlamatInvestorCorporates);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const deleteInvestor = async (request, h) => {
    const req = request.payload;
    try {
        console.log('USER ID NYA BRO => ', req.user_id);
        const deleteInvestors = await InvestorHelper.deleteInvestorData(
            req.user_id
        );
        return h.response(deleteInvestors);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const getAllInvestor = async (request, h) => {
    const req = request.payload;
    try {
        const allInvestor = await InvestorHelper.getAllInvestor(
            req.roleId,
            req.deleted);
        return h.response(allInvestor);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const getInvestorStatistik = async (request, h) => {
    const req = request.payload;
    try {
        const getStatistikInvestors = await InvestorHelper.getStatistikInvestor(
            req.userCode);
        return h.response(getStatistikInvestors);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const getRefCodeInvestor = async (request, h) => {
    const req = request.payload;
    try {
        const getRefCode = await InvestorHelper.getReferalCodeInvestor(
            req.userCode);
        return h.response(getRefCode);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const getDashboardInvestorData = async (request, h) => {
    const req = request.payload;
    try {
        const getDashboardInvestors = await InvestorHelper.getTotalIncomeAndWithdrawInvestor(
            req.userCode);
        return h.response(getDashboardInvestors);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const getActivityInvestorData = async (request, h) => {
    const req = request.payload;
    try {
        const getActivityInvestors = await InvestorHelper.getActivityInvestor(
            req.userCode);
        return h.response(getActivityInvestors);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const hardDelete = (request, h) => {
    var userId = request.params.user_id;
    allInvestor.findByIdAndRemove(userId).exec(function (err, removed) {
        if (err) {
            return h(Boom.badImplementation(err));
        } else if (!removed) {
            return h('Investor Not Found').code(404);
        }

        return h('investor removed successfully').code(200);
    });
};

const investorFunding = async (request, h) => {
    const req = request.payload;
    try {
        const listFunding = await FundingHelper.getFundingListByInvestor(req.userCode);
        return h.response({
            listFunding
        });
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

exports.plugin = {
    register: (server, options) => {
        options = _.extend({ basePath: '' }, options);

        server.route([{
            method: 'POST',
            path: options.basePath + '/register-investor',
            handler: registerInvestorPersonal,
            options: {
                description: 'Register New Investor',
                tags: ['api', 'investor'],
                auth: false,
                validate: {
                    payload: {
                        userId: Joi.string().required(),
                        nama: Joi.string().required(),
                        tipePendana: Joi.string().required(),
                        tempatLahir: Joi.string().required(),
                        tanggalLahir: Joi.string().required(),
                        noKtp: Joi.string().required(),
                        noNpwp: Joi.string().required(),
                        alamat: Joi.string().required(),
                        provinsi: Joi.string().required(),
                        kabupaten: Joi.string().required(),
                        kecamatan: Joi.string().required(),
                        kelurahan: Joi.string().required(),
                        kodePos: Joi.string().required(),
                        jenisKelamin: Joi.string().required(),
                        kewarganegaraan: Joi.string().required(),
                        noKitas: Joi.string().required(),
                        noPassport: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/update-investor-personal',
            handler: registerInvestorPersonal,
            options: {
                description: 'Update Data Investor Personal',
                tags: ['api', 'investor'],
                auth: false,
                validate: {
                    payload: {
                        userId: Joi.string().required(),
                        panggilan: Joi.string().required(),
                        nama: Joi.string().required(),
                        tempatLahir: Joi.string().required(),
                        tanggalLahir: Joi.string().required(),
                        jenisKelamin: Joi.string().required(),
                        agama: Joi.string().required(),
                        pekerjaan: Joi.string().required(),
                        statusPerkawinan: Joi.string().required(),
                        penghasilan: Joi.string().required(),
                        pendidikan: Joi.string().required(),
                        sumberDana: Joi.string().required(),
                        namaGadisIbu: Joi.string().required(),
                        alamat: Joi.string().required(),
                        provinsi: Joi.string().required(),
                        kabupaten: Joi.string().required(),
                        kecamatan: Joi.string().required(),
                        kelurahan: Joi.string().required(),
                        kodePos: Joi.string().required(),
                        kewarganegaraan: Joi.string().required(),
                        noNpwp: Joi.string().required(),
                        noKtp: Joi.string().required(),
                        tempatTerbit: Joi.string().required(),
                        tanggalKadaluarsa: Joi.string().required(),
                        noKitas: Joi.string().required(),
                        noPassport: Joi.string().required(),
                        kodeBank: Joi.string().required(),
                        nomorRekening: Joi.string().required(),
                        namaNasabah: Joi.string().required(),
                        jenisRekening: Joi.string().required(),
                        cabang: Joi.string().required(),
                        uploadKtp: Joi.string().required(),
                        uploadNpwp: Joi.string().required(),
                        uploadSelfie: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/update-investor-personal-admin',
            handler: updateInvestorPersonalByAdmin,
            options: {
                description: 'Update Data Investor Personal by Admin',
                tags: ['api', 'investor'],
                auth: false,
                validate: {
                    payload: {
                        userCode: Joi.string().required(),
                        email: Joi.string().required(),
                        nomorTelepon: Joi.string().required(),
                        panggilan: Joi.string().required(),
                        nama: Joi.string().required(),
                        tempatLahir: Joi.string().required(),
                        tanggalLahir: Joi.string().required(),
                        jenisKelamin: Joi.string().required(),
                        agama: Joi.string().required(),
                        pekerjaan: Joi.string().required(),
                        statusPerkawinan: Joi.string().required(),
                        penghasilan: Joi.string().required(),
                        pendidikan: Joi.string().required(),
                        sumberDana: Joi.string().required(),
                        namaGadisIbu: Joi.string().required(),
                        alamat: Joi.string().required(),
                        provinsi: Joi.string().required(),
                        kabupaten: Joi.string().required(),
                        kecamatan: Joi.string().required(),
                        kelurahan: Joi.string().required(),
                        kodePos: Joi.string().required(),
                        kewarganegaraan: Joi.string().required(),
                        noNpwp: Joi.string().required(),
                        noKtp: Joi.string().required(),
                        tempatTerbit: Joi.string().required(),
                        tanggalKadaluarsa: Joi.string().required(),
                        noKitas: Joi.string().required(),
                        noPassport: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/update-investor-corporate-admin',
            handler: updateInvestorCorporateByAdmin,
            options: {
                description: 'Update Data Investor Corporate by Admin',
                tags: ['api', 'investor'],
                auth: false,
                validate: {
                    payload: {
                        userCode: Joi.string().required(),
                        email: Joi.string().required(),
                        nomorTelepon: Joi.string().required(),
                        nama: Joi.string().required(),
                        noKtp: Joi.string().required(),
                        namaPerusahaan: Joi.string().required(),
                        emailPerusahaan: Joi.string().required(),
                        teleponPerusahaan: Joi.string().required(),
                        tempatBerdiri: Joi.string().required(),
                        tanggalBerdiri: Joi.string().required(),
                        alamatPerusahaan: Joi.string().required(),
                        provinsiPerusahaan: Joi.string().required(),
                        kotaPerusahaan: Joi.string().required(),
                        kodePosPerusahaan: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/update-bank-investor-admin',
            handler: updateInvestorBankByAdmin,
            options: {
                description: 'Update Data Bank Investor by Admin',
                tags: ['api', 'investor'],
                auth: false,
                validate: {
                    payload: {
                        userCode: Joi.string().required(),
                        kodeBank: Joi.string().required(),
                        nomorRekening: Joi.string().required(),
                        namaNasabah: Joi.string().required(),
                        jenisRekening: Joi.string().required(),
                        cabang: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/update-alamat-investor-personal',
            handler: updateAlamatInvestorPersonal,
            options: {
                description: 'Update Data Alamat Investor Personal',
                tags: ['api', 'investor'],
                auth: false,
                validate: {
                    payload: {
                        userCode: Joi.string().required(),
                        alamat: Joi.string().required(),
                        provinsi: Joi.string().required(),
                        kabupaten: Joi.string().required(),
                        kecamatan: Joi.string().required(),
                        kelurahan: Joi.string().required(),
                        kodePos: Joi.string().required(),
                        kewarganegaraan: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/update-investor-corporate',
            handler: registerInvestorCorporate,
            options: {
                description: 'Update Data Investor Corporate',
                tags: ['api', 'investor'],
                auth: false,
                validate: {
                    payload: {
                        userId: Joi.string().required(),
                        namaPIC: Joi.string().required(),
                        emailPIC: Joi.string().required(),
                        teleponPIC: Joi.string().required(),
                        noKTPPIC: Joi.string().required(),
                        namaPerusahaan: Joi.string().required(),
                        emailPerusahaan: Joi.string().required(),
                        teleponPerusahaan: Joi.string().required(),
                        tempatBerdiri: Joi.string().required(),
                        tanggalBerdiri: Joi.string().required(),
                        alamat: Joi.string().required(),
                        provinsi: Joi.string().required(),
                        kota: Joi.string().required(),
                        kodePos: Joi.string().required(),
                        kodeBank: Joi.string().required(),
                        nomorRekening: Joi.string().required(),
                        namaNasabah: Joi.string().required(),
                        jenisRekening: Joi.string().required(),
                        cabang: Joi.string().required(),
                        uploadKtp: Joi.string().required(),
                        uploadNpwp: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/update-alamat-investor-corporate',
            handler: updateAlamatInvestorCorporate,
            options: {
                description: 'Update Data Alamat Investor Corporate',
                tags: ['api', 'investor'],
                auth: false,
                validate: {
                    payload: {
                        userCode: Joi.string().required(),
                        alamatCompany: Joi.string().required(),
                        provinsiCompany: Joi.string().required(),
                        kotaCompany: Joi.string().required(),
                        kodePosCompany: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/get-investor',
            handler: getAllInvestor,
            options: {
                description: 'Get all investor list',
                tags: ['api'],
                auth: false,
                validate: {
                    payload: {
                        roleId: Joi.number().required()
                    }
                }
            }
        },
        {
            method: 'POST',
            path: options.basePath + '/delete-investor',
            handler: deleteInvestor,
            options: {
                description: 'Delete  a Investor',
                tags: ['api', 'investor'],
                auth: false,
                validate: {
                    payload: {
                        user_id: Joi.string().required()
                    }
                }
            }
        },
        {
            method: 'POST',
            path: options.basePath + '/funding-detail',
            handler: investorFunding,
            options: {
                description: 'Info of borrower dashboard',
                tags: ['api', 'borrower'],
                auth: false,
                validate: {
                    payload: {
                        userCode: Joi.string().required()
                    }
                }
            }
        },
        {
            method: 'POST',
            path: options.basePath + '/get-statistik-investor',
            handler: getInvestorStatistik,
            options: {
                description: 'Info of investor statistics',
                tags: ['api', 'investor'],
                auth: false,
                validate: {
                    payload: {
                        userCode: Joi.string().required()
                    }
                }
            }
        },
        {
            method: 'POST',
            path: options.basePath + '/get-dashboard-investor-data',
            handler: getDashboardInvestorData,
            options: {
                description: 'Investor dashboard data',
                tags: ['api', 'investor'],
                auth: false,
                validate: {
                    payload: {
                        userCode: Joi.string().required()
                    }
                }
            }
        },
        {
            method: 'POST',
            path: options.basePath + '/get-activity-investor',
            handler: getActivityInvestorData,
            options: {
                description: 'Investor activity data',
                tags: ['api', 'investor'],
                auth: false,
                validate: {
                    payload: {
                        userCode: Joi.string().required()
                    }
                }
            }
        },
        {
            method: 'POST',
            path: options.basePath + '/get-ref-code-investor',
            handler: getRefCodeInvestor,
            options: {
                description: 'Investor referal code',
                tags: ['api', 'investor'],
                auth: false,
                validate: {
                    payload: {
                        userCode: Joi.string().required()
                    }
                }
            }
        }
        ]);
    },

    'name': 'api-investor'
};
