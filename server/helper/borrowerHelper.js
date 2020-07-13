const BorrowerData = require('../model/borrowerData');
const UserData = require('../model/userData');
const LoanData = require('../model/loanData');
const DocumentData = require('../model/documentData');
const AuthHelper = require('./authHelper');
const FileHelper = require('./fileHelper');
const Fs = require('fs');
const Word2pdf = '';
const Logger = require('./logger');

const insertBorrowerData = function (
    statusEmergencyContact,
    statusDataBank,
    userid,
    usercode,
    nama,
    tempatlahir,
    tanggallahir,
    jeniskelamin,
    pendidikan,
    statuspernikahan,
    alamat,
    provinsi,
    kabupaten,
    kecamatan,
    kelurahan,
    kodePos,
    pekerjaan,
    sektorPekerjaan,
    deskripsiPekerjaan,
    lamaBekerja,
    pendapatan,
    noktp,
    nonpwp,
    uploadktp,
    uploadnpwp,
    uploadselfie) {
    if (statusEmergencyContact === 'ok' && statusDataBank === 'ok') {
        return new Promise(function (resolve, reject) {
            BorrowerData.insertBorrower(userid, usercode, nama, tempatlahir, tanggallahir, jeniskelamin, pendidikan, statuspernikahan, alamat, provinsi, kabupaten, kecamatan, kelurahan, kodePos, pekerjaan, sektorPekerjaan, deskripsiPekerjaan, lamaBekerja, pendapatan, noktp, nonpwp, uploadktp, uploadnpwp, uploadselfie)
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
                    BorrowerData.rollbackBorrowerDataEmergencyContact(userid)
                        .then((result) => {
                            if (result) {
                                const successResult = {
                                    'statusCode': 'R0001',
                                    'response': 'Success',
                                    'message': 'Rollback data emergency contact successfully'
                                };
                                return resolve(successResult);
                            }
                        });
                    BorrowerData.rollbackBorrowerDataBank(userid)
                        .then((result) => {
                            if (result) {
                                const successResult = {
                                    'statusCode': 'R0001',
                                    'response': 'Success',
                                    'message': 'Rollback data bank successfully'
                                };
                                return resolve(successResult);
                            }
                        });

                    return reject(err);
                });
        });
    }

    if (statusEmergencyContact !== 'ok') {
        BorrowerData.rollbackBorrowerDataEmergencyContact(userid)
            .then((result) => {
                if (result) {
                    const successResult = {
                        'statusCode': 'R0001',
                        'response': 'Success',
                        'message': 'Rollback data emergency contact successfully'
                    };
                    return resolve(successResult);
                }
            });
    }

    if (statusDataBank !== 'ok') {
        BorrowerData.rollbackBorrowerDataBank(userid)
            .then((result) => {
                if (result) {
                    const successResult = {
                        'statusCode': 'R0001',
                        'response': 'Success',
                        'message': 'Rollback data bank successfully'
                    };
                    return resolve(successResult);
                }
            });
    }

    const errorResult = {
        'statusCode': 'E0001',
        'response': 'Failed',
        'message': 'Ooops ! Something wrong with our ends'
    };
    return resolve(errorResult);
};

const insertBorrowerCorporateData = function (
    statusDataCompany,
    statusDataBank,
    userid,
    usercode,
    noKtpPIC,
    uploadSelfiePIC,
    uploadKtpPIC) {
    if (statusDataBank === 'ok' && statusDataCompany === 'ok') {
        return new Promise(function (resolve, reject) {
            BorrowerData.insertBorrowerDataCompany(userid, usercode, noKtpPIC, uploadSelfiePIC, uploadKtpPIC)
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
                    BorrowerData.rollbackBorrowerDataBank(userid)
                        .then((result) => {
                            if (result) {
                                const successResult = {
                                    'statusCode': 'R0001',
                                    'response': 'Success',
                                    'message': 'Rollback data bank successfully'
                                };
                                return resolve(successResult);
                            }
                        });

                    BorrowerData.rollbackBorrowerDataCompany(userid)
                        .then((result) => {
                            if (result) {
                                const successResult = {
                                    'statusCode': 'R0001',
                                    'response': 'Success',
                                    'message': 'Rollback data company successfully'
                                };
                                return resolve(successResult);
                            }
                        });

                    return reject(err);
                });
        });
    }

    if (statusDataBank !== 'ok') {
        BorrowerData.rollbackBorrowerDataBank(userid)
            .then((result) => {
                if (result) {
                    const successResult = {
                        'statusCode': 'R0001',
                        'response': 'Success',
                        'message': 'Rollback data bank successfully'
                    };
                    return resolve(successResult);
                }
            });
    }

    if (statusDataCompany !== 'ok') {
        BorrowerData.rollbackBorrowerDataCompany(userid)
            .then((result) => {
                if (result) {
                    const successResult = {
                        'statusCode': 'R0001',
                        'response': 'Success',
                        'message': 'Rollback data company successfully'
                    };
                    return resolve(successResult);
                }
            });
    }

    const errorResult = {
        'statusCode': 'E0001',
        'response': 'Failed',
        'message': 'Ooops ! Something wrong with our ends'
    };
    return resolve(errorResult);
};

const insertBorrowerDataUpload = function (
    userid,
    usercode,
    nama,
    tempatlahir,
    tanggallahir,
    jeniskelamin,
    pendidikan,
    statuspernikahan,
    alamat,
    provinsi,
    kabupaten,
    kecamatan,
    kelurahan,
    kodePos,
    pekerjaan,
    sektorPekerjaan,
    deskripsiPekerjaan,
    lamaBekerja,
    pendapatan,
    noktp,
    nonpwp,
    uploadktp,
    uploadfotopekerjaan) {
    return new Promise(function (resolve, reject) {
        BorrowerData.insertBorrowerUpload(userid, usercode, nama, tempatlahir, tanggallahir, jeniskelamin, pendidikan, statuspernikahan, alamat, provinsi, kabupaten, kecamatan, kelurahan, kodePos, pekerjaan, sektorPekerjaan, deskripsiPekerjaan, lamaBekerja, pendapatan, noktp, nonpwp, uploadktp, uploadfotopekerjaan)
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

const insertBorrowerCompanyData = function (
    userId,
    companyName,
    companyEmail,
    companyPhoneNumber,
    companyDateOfEstablishment,
    companyPlaceOfEstablishment,
    companyAddress,
    companyProvince,
    companyCity,
    companyPostalCode,
    companySector,
    companyDuration,
    companyEmployee,
    companyDescription,
    uploadSiupCompany,
    uploadAktaCompany) {
    return new Promise(function (resolve, reject) {
        BorrowerData.insertBorrowerCompany(userId, companyName, companyEmail, companyPhoneNumber, companyDateOfEstablishment, companyPlaceOfEstablishment, companyAddress, companyProvince, companyCity, companyPostalCode, companySector, companyDuration, companyEmployee, companyDescription, uploadSiupCompany, uploadAktaCompany)
            .then((result) => {
                if (result) {
                    const successResult = 'ok';
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                return reject(err);
            });
    });
};

const insertEmergencyContactData = function (
    userid,
    namaEm1,
    nohpEm1,
    hubunganEm1,
    namaEm2,
    nohpEm2,
    hubunganEm2,
    namaEm3,
    nohpEm3,
    hubunganEm3) {
    return new Promise(function (resolve, reject) {
        BorrowerData.insertBorrowerEmergencyContact(userid, namaEm1, nohpEm1, hubunganEm1, namaEm2, nohpEm2, hubunganEm2, namaEm3, nohpEm3, hubunganEm3)
            .then((result) => {
                if (result) {
                    const successResult = 'ok';
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                return reject(err);
            });
    });
};

const insertBorrowerDataBank = function (
    userId,
    kodeBank,
    nomorRekening,
    namaNasabah,
    jenisRekening,
    cabang) {
    return new Promise(function (resolve, reject) {
        BorrowerData.insertBorrowerBank(
            userId,
            kodeBank,
            nomorRekening,
            namaNasabah,
            jenisRekening,
            cabang)
            .then((result) => {
                if (result) {
                    const successResult = 'ok';
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                return reject(err);
            });
    });

};

const getAllBorrower = (roleId) => {
    return new Promise((resolve, reject) => {
        try {
            const allBorrower = UserData.getBorrowerBasedRole(roleId);
            resolve(allBorrower);
        } catch (err) {
            reject({ 'err.message': err });
        }
    });
};

const getBorrowerDetail = (userCode) => {
    return new Promise((resolve, reject) => {
        try {
            const detail = BorrowerData.getBorrowerDetail(userCode);
            return resolve(detail);
        } catch (err) {
            return reject({ 'err.message': err });
        }
    });
};

const deleteBorrowerData = function (userId) {
    return new Promise(function (resolve, reject) {
        BorrowerData.deleteBorrower(userId)
            .then((result) => {
                if (result) {
                    const successResult = {
                        'statusCode': 'C0001',
                        'response': 'Success',
                        'message': 'Delete data borrower successfully'
                    };
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                return reject(err);
            });
    });
};

const updateBorrowerDataDiri = function (userCode, nama, tempatLahir, tanggalLahir, jenisKelamin, pendidikan, statusPernikahan, pekerjaan, sektorPekerjaan, durasiPekerjaan, deskripsiPekerjaan, penghasilan, alamat, provinsi, kabupaten, kecamatan, kelurahan, kodePos, noNPWP, noKTP) {
    return new Promise(function (resolve, reject) {
        BorrowerData.updateDataDiriBorrower(userCode, nama, tempatLahir, tanggalLahir, jenisKelamin, pendidikan, statusPernikahan, pekerjaan, sektorPekerjaan, durasiPekerjaan, deskripsiPekerjaan, penghasilan, alamat, provinsi, kabupaten, kecamatan, kelurahan, kodePos, noNPWP, noKTP)
            .then((result) => {
                if (result) {
                    const successResult = {
                        'statusCode': 'C0001',
                        'response': 'Success',
                        'message': 'Update data diri borrower successfully'
                    };
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                return reject(err);
            });
    });
};

const updateBorrowerDataAuth = function (userCode, email, nomorTelepon) {
    return new Promise(function (resolve, reject) {
        BorrowerData.updateDataAuthBorrower(userCode, email, nomorTelepon)
            .then((result) => {
                if (result) {
                    const successResult = {
                        'statusCode': 'C0001',
                        'response': 'Success',
                        'message': 'Update data auth borrower successfully'
                    };
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                return reject(err);
            });
    });
};

const updateBorrowerDataBank = function (userCode, kodeBank, nomorRekening, namaNasabah, jenisRekening, cabang) {
    return new Promise(function (resolve, reject) {
        BorrowerData.updateDataBankBorrower(userCode, kodeBank, nomorRekening, namaNasabah, jenisRekening, cabang)
            .then((result) => {
                if (result) {
                    const successResult = {
                        'statusCode': 'C0001',
                        'response': 'Success',
                        'message': 'Update data auth borrower successfully'
                    };
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                return reject(err);
            });
    });
};

const updateBorrowerDataEmergencyContact = function (userCode, namaEm1, nohpEm1, hubunganEm1, namaEm2, nohpEm2, hubunganEm2, namaEm3, nohpEm3, hubunganEm3) {
    return new Promise(function (resolve, reject) {
        BorrowerData.updateDataEmergencyContactBorrower(userCode, namaEm1, nohpEm1, hubunganEm1, namaEm2, nohpEm2, hubunganEm2, namaEm3, nohpEm3, hubunganEm3)
            .then((result) => {
                if (result) {
                    const successResult = {
                        'statusCode': 'C0001',
                        'response': 'Success',
                        'message': 'Update data emergency contact borrower successfully'
                    };
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                return reject(err);
            });
    });
};

const bulkInsertBorrowerData = function (arrayOfBessBorrower) {
    return new Promise(function (resolve, reject) {

    });
};

const getAccountBankDetailByUserCode = (userCode) => {
    return new Promise((resolve, reject) => {
        try {
            const detail = UserData.getAccountBankDetailByUserCode(userCode);
            return resolve(detail);
        } catch (err) {
            return reject({ 'err.message': err });
        }
    });
};

const updateAlamatBorrower = function (
    userCode,
    alamat,
    provinsi,
    kabupaten,
    kecamatan,
    kelurahan,
    kodePos) {
    return new Promise(function (resolve, reject) {
        BorrowerData.updateAlamatBorrower(
            userCode,
            alamat,
            provinsi,
            kabupaten,
            kecamatan,
            kelurahan,
            kodePos)
            .then((result) => {
                if (result) {
                    const successResult = {
                        'statusCode': 'C0001',
                        'response': 'Success',
                        'message': 'Update Alamat Borrower Successs'
                    };
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                return reject(err);
            });
    });
};

const getActivityBorrower = (userCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            const getDetailInstallments = await BorrowerData.getDetailInstallment(userCode);
            const getDetailRequestLoans = await BorrowerData.getDetailRequestLoan(userCode);

            const data = {
                'installment': getDetailInstallments,
                'requestLoan': getDetailRequestLoans
            };

            return resolve(data);
        } catch (err) {
            return reject({ 'err.message': err });
        }
    });
};

const getDetailLoanProgress = (userCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            const loanProgress = await LoanData.getDetailProgressLoan(userCode);
            return resolve({ loanProgress });
        } catch (err) {
            return reject({ 'err.message': err });
        }
    });
};

const getDashboardBorrowerLoanApproved = (userCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            const loanApproved = await BorrowerData.getBorrowerRequestLoan(userCode);
            return resolve({ loanApproved });
        } catch (err) {
            return reject({ 'err.message': err });
        }
    });
};

const updateApprovalBorrowerLoan = function (loanCode, approval) {
    return new Promise(function (resolve, reject) {
        BorrowerData.updateApprovedBorrowerLoans(loanCode, approval)
            .then((result) => {
                if (result) {
                    const successResult = {
                        'statusCode': 'C0001',
                        'response': 'Success',
                        'message': 'Approval Borrower Loans with Interest Success'
                    };
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                return reject(err);
            });
    });
};

const createLoanDocument = (loanCode, userCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            // detail borrower nama, email dan phone number
            const getDataUser = await AuthHelper.getUserDetailFromCode(userCode);

            const address = getDataUser[0].alamat.split(' | ');

            // generate create Date
            const month = ['Januari', 'Februari', 'Maret', 'April', 'May', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
            const day = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
            const currDate = new Date();
            const createdDate = currDate.getDate() + ' ' + month[currDate.getMonth()] + ' ' + currDate.getFullYear();
            const currDay = day[currDate.getDay()];

            // generate document number
            const docNo = currDate.getFullYear() + '2' + loanCode.slice(-8);

            // list investor dari tbl funding detail, join dengan tabel dokumen dapatkan nomor dokument dan tanggal dokumen tersebut
            const listInvestor = await DocumentData.getAllFunderDocument(loanCode);

            const finalInvestor = [];
            for (let indexVal = 0; indexVal < listInvestor.length; indexVal++) {
                finalInvestor[indexVal] = {
                    'idNumber': indexVal + 1,
                    'investor_doc': listInvestor[indexVal].document_no,
                    'investor_date': listInvestor[indexVal].created_date.getDate() + ' ' + month[listInvestor[indexVal].created_date.getMonth()] + ' ' + listInvestor[indexVal].created_date.getFullYear()
                };
            }

            // loan detail (jumlah dana, lama pinjaman, cicilan yang harus dibayarkan per bulan)
            const detailLoan = await LoanData.getInstallmentDetail(loanCode);

            const interest = await Math.round((detailLoan[0].jumlah_pinjaman * (detailLoan[0].suku_bunga / 100) / 12));
            const installment = await Math.round((detailLoan[0].jumlah_pinjaman / detailLoan[0].lama_tenor) + interest);

            // create Loan document
            await FileHelper.generateLoanDoc(userCode, 'loan_template.docx', 'borrower_loan', 'borrower_pks',
                loanCode, getDataUser[0].nama, getDataUser[0].code_country + ' - ' + getDataUser[0].no_hp,
                createdDate, docNo, getDataUser[0].email, currDay, finalInvestor, detailLoan[0].jumlah_pinjaman, detailLoan[0].lama_tenor,
                installment, getDataUser[0].no_ktp, address[0], detailLoan[0].borrower_interest);

            return resolve({ 'status': 'completed' });
        } catch (err) {
            Logger.write.log('error', 'update Asset Data error: ' + err.message);
            return reject(err);
        }
    });
};

module.exports = {
    createLoanDocument,
    getAllBorrower,
    getBorrowerDetail,
    getAccountBankDetailByUserCode,
    getActivityBorrower,
    getDetailLoanProgress,
    getDashboardBorrowerLoanApproved,
    insertBorrowerData,
    insertBorrowerDataUpload,
    insertEmergencyContactData,
    insertBorrowerDataBank,
    insertBorrowerCorporateData,
    insertBorrowerCompanyData,
    updateAlamatBorrower,
    updateBorrowerDataDiri,
    updateBorrowerDataAuth,
    updateBorrowerDataBank,
    updateBorrowerDataEmergencyContact,
    updateApprovalBorrowerLoan,
    deleteBorrowerData,
    bulkInsertBorrowerData
};
