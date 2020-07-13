const _ = require('lodash');
const Joi = require('joi');
const Boom = require('boom');

const BorrowerHelper = require('../helper/borrowerHelper');
const UtilsHelper = require('../helper/utilsHelper');
const AuthHelper = require('../helper/authHelper');
const LoanHelper = require('../helper/loanHelper');
const KycHelper = require('../helper/kycHelper');
const InstallmentHelper = require('../helper/installmentHelper');
const Logger = require('../helper/logger');
const EmailHelper = require('../helper/emailHelper');

const registerBorrower = async (request, h) => {
    const req = request.payload;
    try {
        const userCode = await UtilsHelper.generateUserCode(req.nama, req.tanggallahir);
        const insertBorrower = await BorrowerHelper.insertBorrowerData(
            req.userid,
            userCode,
            req.nama,
            req.tempatlahir,
            req.tanggallahir,
            req.jeniskelamin,
            req.pendidikan,
            req.statuspernikahan,
            req.alamat,
            req.provinsi,
            req.kabupaten,
            req.kecamatan,
            req.kelurahan,
            req.kode_pos,
            req.pekerjaan,
            req.sektor_pekerjaan,
            req.deskripsi_pekerjaan,
            req.lama_bekerja,
            req.pendapatan,
            req.nonpwp,
            req.noktp,
            req.uploadktp,
            req.uploadfotopekerjaan
        );

        const insertEmegencyContact = await BorrowerHelper.insertEmergencyContactData(
            insertBorrower,
            req.userid,
            req.nama_em_1,
            req.nohp_em_1,
            req.hubungan_em_1,
            req.nama_em_2,
            req.nohp_em_2,
            req.hubungan_em_2,
            req.nama_em_3,
            req.nohp_em_3,
            req.hubungan_em_3
        );

        const createKycValidation = await KycHelper.createKycValidation(userCode);

        return h.response(insertEmegencyContact);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const updateBorrowerData = async (request, h) => {
    const req = request.payload;
    try {
        const userCode = await UtilsHelper.generateUserCode(req.nama, req.tanggallahir);
        const insertEmegencyContact = await BorrowerHelper.insertEmergencyContactData(
            req.userid,
            req.nama_em_1,
            req.nohp_em_1,
            req.hubungan_em_1,
            req.nama_em_2,
            req.nohp_em_2,
            req.hubungan_em_2,
            req.nama_em_3,
            req.nohp_em_3,
            req.hubungan_em_3
        );

        const insertBorrowerBank = await BorrowerHelper.insertBorrowerDataBank(
            req.userid,
            req.kodeBank,
            req.nomorRekening,
            req.namaNasabah,
            req.jenisRekening,
            req.cabang
        );

        const insertBorrower = await BorrowerHelper.insertBorrowerData(
            insertEmegencyContact,
            insertBorrowerBank,
            req.userid,
            userCode,
            req.nama,
            req.tempatlahir,
            req.tanggallahir,
            req.jeniskelamin,
            req.pendidikan,
            req.statuspernikahan,
            req.alamat,
            req.provinsi,
            req.kabupaten,
            req.kecamatan,
            req.kelurahan,
            req.kode_pos,
            req.pekerjaan,
            req.sektor_pekerjaan,
            req.deskripsi_pekerjaan,
            req.lama_bekerja,
            req.pendapatan,
            req.noktp,
            req.nonpwp,
            req.uploadktp,
            req.uploadnpwp,
            req.uploadselfie
        );
        const getData = await AuthHelper.getPassword(null, null, req.userid);
        const authToken = await AuthHelper.getToken(true, getData.email, getData);
        const createKycValidation = await KycHelper.createKycValidation(userCode);
        return h.response({ insertBorrower, authToken });
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const updateBorrowerCorporateData = async (request, h) => {
    const req = request.payload;
    try {
        const userCode = await UtilsHelper.generateUserCode(req.company_name, req.company_date_of_establishment);
        const insertBorrowerCorporateBank = await BorrowerHelper.insertBorrowerDataBank(
            req.user_id,
            req.kode_bank,
            req.nomor_rekening,
            req.nama_nasabah,
            req.jenis_rekening,
            req.cabang
        );
        const insertBorrowerCompany = await BorrowerHelper.insertBorrowerCompanyData(
            req.user_id,
            req.company_name,
            req.company_email,
            req.company_phone_number,
            req.company_date_of_establishment,
            req.company_place_of_establishment,
            req.company_address,
            req.company_province,
            req.company_city,
            req.company_postal_code,
            req.company_sector,
            req.company_duration,
            req.company_employee,
            req.company_description,
            req.upload_siup_company,
            req.upload_akta_company
        );
        const insertBorrower = await BorrowerHelper.insertBorrowerCorporateData(
            insertBorrowerCompany,
            insertBorrowerCorporateBank,
            req.user_id,
            userCode,
            req.no_ktp_pic,
            req.upload_selfie_pic,
            req.upload_ktp_pic
        );

        const getData = await AuthHelper.getPassword(null, null, req.user_id);
        console.log('DATA ====> ', getData);
        const authToken = await AuthHelper.getToken(true, getData.email, getData);
        const createKycValidation = await KycHelper.createKycValidation(userCode);
        return h.response({ insertBorrower, authToken });
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const updateBorrowerDataDiriByAdmin = async (request, h) => {
    const req = request.payload;
    try {
        const updateBorrowerDataAuths = await BorrowerHelper.updateBorrowerDataAuth(
            req.userCode,
            req.email,
            req.nomorTelepon
        );
        const updateBorrowerDataDiris = await BorrowerHelper.updateBorrowerDataDiri(
            req.userCode,
            req.nama,
            req.tempatLahir,
            req.tanggalLahir,
            req.jenisKelamin,
            req.pendidikan,
            req.statusPernikahan,
            req.pekerjaan,
            req.sektorPekerjaan,
            req.lamaBekerja,
            req.deskripsiPekerjaan,
            req.pendapatan,
            req.alamat,
            req.provinsi,
            req.kabupaten,
            req.kecamatan,
            req.kelurahan,
            req.kodePos,
            req.noNpwp,
            req.noKtp
        );
        return h.response(updateBorrowerDataDiris);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const updateBorrowerDataBankByAdmin = async (request, h) => {
    const req = request.payload;
    try {
        const updateBorrowerDataBanks = await BorrowerHelper.updateBorrowerDataBank(
            req.userCode,
            req.kodeBank,
            req.nomorRekening,
            req.namaNasabah,
            req.jenisRekening,
            req.cabang
        );
        return h.response(updateBorrowerDataBanks);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const updateBorrowerDataEMByAdmin = async (request, h) => {
    const req = request.payload;
    try {
        const updateBorrowerDataEMs = await BorrowerHelper.updateBorrowerDataEmergencyContact(
            req.userCode,
            req.nama_em_1,
            req.nohp_em_1,
            req.hubungan_em_1,
            req.nama_em_2,
            req.nohp_em_2,
            req.hubungan_em_2,
            req.nama_em_3,
            req.nohp_em_3,
            req.hubungan_em_3,
        );
        return h.response(updateBorrowerDataEMs);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const updateAlamatBorrower = async (request, h) => {
    const req = request.payload;
    try {
        const updateAlamatBorrowers = await BorrowerHelper.updateAlamatBorrower(
            req.userCode,
            req.alamat,
            req.provinsi,
            req.kabupaten,
            req.kelurahan,
            req.kecamatan,
            req.kodePos
        );
        return h.response(updateAlamatBorrowers);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const getAllBorrower = async (request, h) => {
    const req = request.payload;
    try {
        const allBorrower = await BorrowerHelper.getAllBorrower(
            req.roleId,
            req.deleted);
        return h.response(allBorrower);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const deleteBorrower = async (request, h) => {
    const req = request.payload;
    try {
        console.log('USER ID => ', req.user_id);
        const deleteBorrowers = await BorrowerHelper.deleteBorrowerData(
            req.user_id
        );
        return h.response(deleteBorrowers);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const getBorrowerDetail = async (request, h) => {
    const req = request.payload;
    try {
        const borrowerDetail = await BorrowerHelper.getBorrowerDetail(req.userCode);
        return h.response({ borrowerDetail });
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const bulkUploadBorrower = async (request, h) => {
    const req = request.payload;
    try {
        var uploadResult = [];
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 5);
        const tenorDate = endDate.toISOString().replace(/T/, ' ').replace(/\..+/, '');
        for (var item of req) {
            var isKtpExistStatus = await AuthHelper.isKtpExist(item.ktp);
            if (!isKtpExistStatus) {
                var arrNama = item.fullName.split(' ');
                var rawPassword = arrNama[0] + item.telp;
                // console.log('info', 'bulkUploadBorrower::rawPassword ', rawPassword);
                var email = rawPassword + '@besscustomer.id';
                // console.log('info', 'bulkUploadBorrower::email ', email);
                var hashPassword = await AuthHelper.hashPassword(arrNama[0] + item.telp);
                // console.log('info', 'bulkUploadBorrower::hashPassword', hashPassword);
                var insertAuth = await AuthHelper.insertAuthentication(email, hashPassword, '62', item.telp);
                // console.log('info', 'bulkUploadBorrower::insertAuth ', insertAuth);
                var selectAuth = await AuthHelper.selectAuth(insertAuth, email, hashPassword, '62', item.telp);
                // console.log('info', 'bulkUploadBorrower::selectAuth ', selectAuth);
                var insertUser = await AuthHelper.insertUsers(selectAuth, item.fullName, '1');
                // console.log('info', 'bulkUploadBorrower::insertUser ', insertUser);
                var userCode = await UtilsHelper.generateUserCode(item.fullName, item.tanggalLahir);
                // console.log('info', 'bulkUploadBorrower::userCode ', userCode);
                var originData = await AuthHelper.getPassword(email, null);
                // console.log('info', 'bulkUploadBorrower::originData ', originData);
                // console.log('info', 'bulkUploadBorrower::insertBorrower ', insertBorrower);
                const insertEmegencyContact = await BorrowerHelper.insertEmergencyContactData(
                    originData.user_id,
                    item.namaEmergencyContact,
                    item.nomorEmergencyContact,
                    item.hubunganEmergentyContact,
                    '',
                    '',
                    '',
                    '',
                    '',
                    ''
                );

                var insertBorrower = await BorrowerHelper.insertBorrowerDataUpload(
                    originData.user_id,
                    userCode,
                    item.fullName,
                    item.tempatLahir,
                    item.tanggalLahir,
                    item.jenisKelamin,
                    item.pendidikanTerakhir,
                    item.statusPernikahan,
                    item.alamat,
                    item.provinsi,
                    '',
                    '',
                    '',
                    '',
                    item.jenisPekerjaan,
                    item.sektorUsaha,
                    item.deskripsiPekerjaan,
                    item.lamaBekerja,
                    item.penghasilan,
                    item.ktp,
                    item.npwp,
                    '',
                    ''
                );
                // console.log('info', 'bulkUploadBorrower::insertEmegencyContact ', insertEmegencyContact);
                try {

                    var insertLoanBorrower = await LoanHelper.insertLoan(userCode, 4, item.jumlahPinjaman,
                        item.tenor, item.bunga, 'AA', tenorDate, item.tujuan, '', '', '', item.interestType);
                    // console.log('info', 'bulkUploadBorrower::insertLoanBorrower ', insertLoanBorrower);
                    uploadResult.push(insertLoanBorrower);
                } catch (err) {
                    Logger.write.log('error', 'insert bulking loans for borrower failed, ' + err.message);
                    return Boom.badRequest(err.message);
                }
            } else {
                // var originData = await AuthHelper.getPassword(email, null);
                //   var insertLoanBorrower = await LoanHelper.insertLoan(userCode, 4, req.jumlahPinjaman,
                //     req.tenor, req.bunga, 'AA', '', req.tujuan, '', '', '');
                // console.log('info', 'The user data already exists');
            }

        }

        //const bulkUpload = await BorrowerHelper.bulkInsertBorrowerData(req);
        return h.response({ uploadResult });
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const borrowerDashboard = async (request, h) => {
    const req = request.payload;
    try {
        const totalLoan = await LoanHelper.getLoanCount(req.userCode);
        const onProgressLoan = await LoanHelper.getOnProgressLoanCount(req.userCode);
        const loanAmount = await InstallmentHelper.getPendingInstallment(req.userCode);
        const currentLoan = await InstallmentHelper.getCurrentInstallment(req.userCode);
        return h.response({
            totalLoan,
            onProgressLoan,
            loanAmount,
            currentLoan
        });
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const getActivityBorrowerData = async (request, h) => {
    const req = request.payload;
    try {
        const getActivityBorrowers = await BorrowerHelper.getActivityBorrower(
            req.userCode);
        return h.response(getActivityBorrowers);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const getDetailLoanProgress = async (request, h) => {
    const req = request.payload;
    try {
        const loanProgress = await BorrowerHelper.getDetailLoanProgress(req.userCode);
        return h.response(loanProgress);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const getLoanWaitingtoApprove = async (request, h) => {
    const req = request.payload;
    try {
        const loanWaitingtoApprove = await BorrowerHelper.getDashboardBorrowerLoanApproved(req.userCode);
        return h.response(loanWaitingtoApprove);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const approveLoanByBorrower = async (request, h) => {
    const req = request.payload;
    try {
        const approveLoan = await BorrowerHelper.updateApprovalBorrowerLoan(req.loanCode, 1);
        // send email notification to all verified investor
        if (approveLoan.statusCode === 'C0001') {
            const getDataLoan = await LoanHelper.getLoanDetail(req.loanCode);
            console.log('jumlah pinjaman: ' + getDataLoan.jumlah_pinjaman);
            const getInvestor = await LoanHelper.getVerifiedInvestor();
            for (const investor of getInvestor) {
                console.log('nama: ' + investor.email);
                const dataEmail = await EmailHelper.dataNewLoan(getDataLoan[0].jumlah_pinjaman, getDataLoan[0].lama_tenor, getDataLoan[0].grade, getDataLoan[0].suku_bunga, getDataLoan[0].loan_code, getDataLoan[0].project_image, investor.email, investor.nama);
                const emailresponse = await EmailHelper.sendEmail(dataEmail, 'new-loan-listing');
            }
        }

        return h.response(approveLoan);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const rejectLoanByBorrower = async (request, h) => {
    const req = request.payload;
    try {
        const approveLoan = await BorrowerHelper.updateApprovalBorrowerLoan(req.loanCode, 2);
        return h.response(approveLoan);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const getLoanExpired = async (request, h) => {
    const req = request.payload;
    try {
        const loanExpired = await LoanHelper.getExpiredFunding(req.userCode);
        return h.response({'expireLoan': loanExpired});
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const approvalLoanExpired = async (request, h) => {
    const req = request.payload;
    try {
        const approvalStatus = await LoanHelper.approvalCollectedFund(req.status, req.loanCode, req.amount, req.userCode);
        return h.response(approvalStatus);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

exports.plugin = {
    register: (server, options) => {
        options = _.extend({ basePath: '' }, options);

        server.route([{
            method: 'POST',
            path: options.basePath + '/register-borrower',
            handler: registerBorrower,
            options: {
                description: 'Register new borrower',
                tags: ['api', 'borrower'],
                auth: false,
                validate: {
                    payload: {
                        userid: Joi.string().required(),
                        nama: Joi.string().required(),
                        tempatlahir: Joi.string().required(),
                        tanggallahir: Joi.string().required(),
                        jeniskelamin: Joi.string().required(),
                        pendidikan: Joi.string().required(),
                        statuspernikahan: Joi.string().required(),
                        alamat: Joi.string().required(),
                        provinsi: Joi.string().required(),
                        kabupaten: Joi.string().required(),
                        kecamatan: Joi.string().required(),
                        kelurahan: Joi.string().required(),
                        kode_pos: Joi.string().required(),
                        pekerjaan: Joi.string().required(),
                        sektor_pekerjaan: Joi.string().required(),
                        deskripsi_pekerjaan: Joi.string().required(),
                        lama_bekerja: Joi.string().required(),
                        pendapatan: Joi.string().required(),
                        nonpwp: Joi.string().required(),
                        noktp: Joi.string().required(),
                        uploadktp: Joi.string().required(),
                        uploadfotopekerjaan: Joi.string().required(),
                        nama_em_1: Joi.string().required(),
                        nohp_em_1: Joi.string().required(),
                        hubungan_em_1: Joi.string().required(),
                        nama_em_2: Joi.string().required(),
                        nohp_em_2: Joi.string().required(),
                        hubungan_em_2: Joi.string().required(),
                        nama_em_3: Joi.string().required(),
                        nohp_em_3: Joi.string().required(),
                        hubungan_em_3: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/update-borrower',
            handler: updateBorrowerData,
            options: {
                description: 'Update borrower',
                tags: ['api', 'borrower'],
                auth: false,
                validate: {
                    payload: {
                        userid: Joi.string().required(),
                        nama: Joi.string().required(),
                        tempatlahir: Joi.string().required(),
                        tanggallahir: Joi.string().required(),
                        jeniskelamin: Joi.string().required(),
                        pendidikan: Joi.string().required(),
                        statuspernikahan: Joi.string().required(),
                        alamat: Joi.string().required(),
                        provinsi: Joi.string().required(),
                        kabupaten: Joi.string().required(),
                        kecamatan: Joi.string().required(),
                        kelurahan: Joi.string().required(),
                        kode_pos: Joi.string().required(),
                        pekerjaan: Joi.string().required(),
                        deskripsi_pekerjaan: Joi.string().required(),
                        sektor_pekerjaan: Joi.string().required(),
                        lama_bekerja: Joi.string().required(),
                        pendapatan: Joi.string().required(),
                        nonpwp: Joi.string().required(),
                        noktp: Joi.string().required(),
                        uploadktp: Joi.string().required(),
                        uploadnpwp: Joi.string().required(),
                        uploadselfie: Joi.string().required(),
                        nama_em_1: Joi.string().required(),
                        nohp_em_1: Joi.string().required(),
                        hubungan_em_1: Joi.string().required(),
                        nama_em_2: Joi.string().required(),
                        nohp_em_2: Joi.string().required(),
                        hubungan_em_2: Joi.string().required(),
                        nama_em_3: Joi.string().required(),
                        nohp_em_3: Joi.string().required(),
                        hubungan_em_3: Joi.string().required(),
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
            path: options.basePath + '/update-borrower-corporate',
            handler: updateBorrowerCorporateData,
            options: {
                description: 'Update Borrower Corporate',
                tags: ['api', 'borrower'],
                auth: false,
                validate: {
                    payload: {
                        user_id: Joi.string().required(),
                        no_ktp_pic: Joi.string().required(),
                        company_name: Joi.string().required(),
                        company_email: Joi.string().required(),
                        company_phone_number: Joi.string().required(),
                        company_date_of_establishment: Joi.string().required(),
                        company_place_of_establishment: Joi.string().required(),
                        company_address: Joi.string().required(),
                        company_province: Joi.string().required(),
                        company_city: Joi.string().required(),
                        company_postal_code: Joi.string().required(),
                        company_sector: Joi.string().required(),
                        company_duration: Joi.string().required(),
                        company_employee: Joi.string().required(),
                        company_description: Joi.string().required(),
                        upload_selfie_pic: Joi.string().required(),
                        upload_ktp_pic: Joi.string().required(),
                        upload_siup_company: Joi.string().required(),
                        upload_akta_company: Joi.string().required(),
                        kode_bank: Joi.string().required(),
                        nomor_rekening: Joi.string().required(),
                        nama_nasabah: Joi.string().required(),
                        jenis_rekening: Joi.string().required(),
                        cabang: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/update-borrower-data-admin',
            handler: updateBorrowerDataDiriByAdmin,
            options: {
                description: 'Update borrower data diri by admin',
                tags: ['api', 'borrower'],
                auth: false,
                validate: {
                    payload: {
                        userCode: Joi.string().required(),
                        email: Joi.string().required(),
                        nomorTelepon: Joi.string().required(),
                        nama: Joi.string().required(),
                        tempatLahir: Joi.string().required(),
                        tanggalLahir: Joi.string().required(),
                        jenisKelamin: Joi.string().required(),
                        pendidikan: Joi.string().required(),
                        statusPernikahan: Joi.string().required(),
                        alamat: Joi.string().required(),
                        provinsi: Joi.string().required(),
                        kabupaten: Joi.string().required(),
                        kecamatan: Joi.string().required(),
                        kelurahan: Joi.string().required(),
                        kodePos: Joi.string().required(),
                        pekerjaan: Joi.string().required(),
                        deskripsiPekerjaan: Joi.string().required(),
                        sektorPekerjaan: Joi.string().required(),
                        lamaBekerja: Joi.string().required(),
                        pendapatan: Joi.string().required(),
                        noNpwp: Joi.string().required(),
                        noKtp: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/update-borrower-bank-admin',
            handler: updateBorrowerDataBankByAdmin,
            options: {
                description: 'Update borrower data bank by admin',
                tags: ['api', 'borrower'],
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
            path: options.basePath + '/update-borrower-emergency-contact-admin',
            handler: updateBorrowerDataEMByAdmin,
            options: {
                description: 'Update borrower data emergenct contact by admin',
                tags: ['api', 'borrower'],
                auth: false,
                validate: {
                    payload: {
                        userCode: Joi.string().required(),
                        nama_em_1: Joi.string().required(),
                        nohp_em_1: Joi.string().required(),
                        hubungan_em_1: Joi.string().required(),
                        nama_em_2: Joi.string().required(),
                        nohp_em_2: Joi.string().required(),
                        hubungan_em_2: Joi.string().required(),
                        nama_em_3: Joi.string().required(),
                        nohp_em_3: Joi.string().required(),
                        hubungan_em_3: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/get-borrower',
            handler: getAllBorrower,
            options: {
                description: 'Get all borrower list',
                tags: ['api'],
                auth: false,
                validate: {
                    payload: {
                        roleId: Joi.number().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/get-detail-borrower',
            handler: getBorrowerDetail,
            options: {
                description: 'Get detail of one borrower',
                tags: ['api', 'borrower'],
                auth: false,
                validate: {
                    payload: {
                        userCode: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/update-alamat-borrower',
            handler: updateAlamatBorrower,
            options: {
                description: 'Update Data Alamat Borrower',
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
                        kodePos: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/delete-borrower',
            handler: deleteBorrower,
            options: {
                description: 'Delete  a Borrower',
                tags: ['api', 'borrower'],
                auth: false,
                validate: {
                    payload: {
                        user_id: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/bulk',
            handler: bulkUploadBorrower,
            options: {
                description: 'Bulk upload Borrower',
                tags: ['api', 'bulk', 'borrower'],
                auth: false
            }
        }, {
            method: 'POST',
            path: options.basePath + '/dashboard',
            handler: borrowerDashboard,
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
        }, {
            method: 'POST',
            path: options.basePath + '/get-activity-borrower',
            handler: getActivityBorrowerData,
            options: {
                description: 'Info of borrower activity',
                tags: ['api', 'borrower'],
                auth: false,
                validate: {
                    payload: {
                        userCode: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/get-loan-progress',
            handler: getDetailLoanProgress,
            options: {
                description: 'Info of borrower loan progress',
                tags: ['api', 'borrower', 'loan'],
                auth: false,
                validate: {
                    payload: {
                        userCode: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/get-loan-approved',
            handler: getLoanWaitingtoApprove,
            options: {
                description: 'Info of borrower loan already approved by admin',
                tags: ['api', 'borrower', 'loan'],
                auth: false,
                validate: {
                    payload: {
                        userCode: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/approve-loan-borrower',
            handler: approveLoanByBorrower,
            options: {
                description: 'Borrower approve loan already have interest',
                tags: ['api', 'borrower', 'loan'],
                auth: false,
                validate: {
                    payload: {
                        loanCode: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/reject-loan-borrower',
            handler: rejectLoanByBorrower,
            options: {
                description: 'Borrower reject loan already have interest',
                tags: ['api', 'borrower', 'loan'],
                auth: false,
                validate: {
                    payload: {
                        loanCode: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/get-loan-expired',
            handler: getLoanExpired,
            options: {
                description: 'Info of borrower loan already exceeded funding period',
                tags: ['api', 'borrower', 'loan'],
                auth: false,
                validate: {
                    payload: {
                        userCode: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/approval-loan-expired',
            handler: approvalLoanExpired,
            options: {
                description: 'Approval of borrower loan already exceeded funding period',
                tags: ['api', 'borrower', 'loan'],
                auth: false,
                validate: {
                    payload: {
                        loanCode: Joi.string().required(),
                        status: Joi.number().required(),
                        amount: Joi.number().required(),
                        userCode: Joi.string().required()
                    }
                }
            }
        }]);
    },

    'name': 'api-borrower'
};
