const InvestorData = require('../model/investorData');
const UserData = require('../model/userData');

const insertInvestorPersonalData = function (
    statusBank,
    userCode,
    userId,
    panggilan,
    nama,
    tempatLahir,
    tanggalLahir,
    jenisKelamin,
    agama,
    pekerjaan,
    statusPerkawinan,
    penghasilan,
    pendidikan,
    sumberDana,
    namaGadisIbu,
    alamat,
    provinsi,
    kabupaten,
    kecamatan,
    kelurahan,
    kodePos,
    kewarganegaraan,
    noNpwp,
    noKtp,
    tempatTerbit,
    tanggalKadaluarsa,
    noKitas,
    noPassport,
    uploadKtp,
    uploadNpwp,
    uploadSelfie) {
    if (statusBank === 'ok') {
        return new Promise(function (resolve, reject) {
            InvestorData.insertInvestorPersonal(
                userCode,
                userId,
                panggilan,
                nama,
                tempatLahir,
                tanggalLahir,
                jenisKelamin,
                agama,
                pekerjaan,
                statusPerkawinan,
                penghasilan,
                pendidikan,
                sumberDana,
                namaGadisIbu,
                alamat,
                provinsi,
                kabupaten,
                kecamatan,
                kelurahan,
                kodePos,
                kewarganegaraan,
                noNpwp,
                noKtp,
                tempatTerbit,
                tanggalKadaluarsa,
                noKitas,
                noPassport,
                uploadKtp,
                uploadNpwp,
                uploadSelfie)
                .then((result) => {
                    if (result) {
                        const successResult = {
                            'statusCode': 'C0001',
                            'response': 'Success',
                            'message': 'Insert data investor personal successfully'
                        };
                        return resolve(successResult);
                    }
                })
                .catch((err) => {
                    console.log('ERROR : ', err);
                    // InvestorData.rollbackInvestorDataBank(userId)
                    //     .then((result) => {
                    //         if (result) {
                    //             const successResult = {
                    //                 'statusCode': 'R0001',
                    //                 'response': 'Success',
                    //                 'message': 'Rollback data bank successfully'
                    //             };
                    //             return resolve(successResult);
                    //         }
                    //     });

                    return reject(err + ' Ooops !');
                });
        });
    }

    InvestorData.rollbackInvestorDataBank(userId)
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

    const errorResult = {
        'statusCode': 'E0001',
        'response': 'Failed',
        'message': 'Ooops ! Something wrong with our ends'
    };
    return resolve(errorResult);

};

const insertInvestorCorporateDataUser = function (
    statusPerusahaan,
    statusBank,
    userCode,
    userId,
    namaPIC,
    emailPIC,
    teleponPIC,
    noKTPPIC,
    uploadKtp,
    uploadNpwp) {
    if (statusPerusahaan === 'ok' && statusBank === 'ok') {
        return new Promise(function (resolve, reject) {
            InvestorData.insertInvestorCorporateUser(
                userCode,
                userId,
                namaPIC,
                emailPIC,
                teleponPIC,
                noKTPPIC,
                uploadKtp,
                uploadNpwp)
                .then((result) => {
                    if (result) {
                        const successResult = {
                            'statusCode': 'C0001',
                            'response': 'Success',
                            'message': 'Insert data investor corporate successfully'
                        };
                        return resolve(successResult);
                    }
                })

                .catch((err) => {
                    InvestorData.rollbackInvestorDataPerusahaan(userId)
                        .then((result) => {
                            if (result) {
                                const successResult = {
                                    'statusCode': 'R0001',
                                    'response': 'Success',
                                    'message': 'Rollback data perusahan successfully'
                                };
                                return resolve(successResult);
                            }
                        });

                    InvestorData.rollbackInvestorDataBank(userId)
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

                    return reject(err + ' Ooops !');
                });
        });
    }

    if (statusPerusahaan !== 'ok') {
        return new Promise(function (resolve, reject) {
            InvestorData.rollbackInvestorDataPerusahaan(userId)
                .then((result) => {
                    if (result) {
                        const successResult = {
                            'statusCode': 'R0001',
                            'response': 'Success',
                            'message': 'Rollback data perusahan successfully'
                        };
                        return resolve(successResult);
                    }
                });
        });
    }

    if (statusBank !== 'ok') {
        InvestorData.rollbackInvestorDataBank(userId)
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

        return reject(err + ' Ooops !');
    }

    const errorResult = {
        'statusCode': 'E0001',
        'response': 'Failed',
        'message': 'Ooops ! Something wrong with our ends'
    };
    return resolve(errorResult);
};

const insertInvestorCorporateDataPerusahaan = function (
    userId,
    namaPerusahaan,
    emailPerusahaan,
    teleponPerusahaan,
    tanggalBerdiri,
    tempatBerdiri,
    alamat,
    provinsi,
    kota,
    kodePos) {
    return new Promise(function (resolve, reject) {
        InvestorData.insertInvestorCorporatePerusahaan(
            userId,
            namaPerusahaan,
            emailPerusahaan,
            teleponPerusahaan,
            tanggalBerdiri,
            tempatBerdiri,
            alamat,
            provinsi,
            kota,
            kodePos)
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

const updateDataDiriInvestorPersonal = function (
    userCode,
    panggilan,
    nama,
    tempatLahir,
    tanggalLahir,
    jenisKelamin,
    agama,
    pekerjaan,
    statusPerkawinan,
    penghasilan,
    pendidikan,
    sumberDana,
    namaGadisIbu,
    alamat,
    provinsi,
    kabupaten,
    kecamatan,
    kelurahan,
    kodePos,
    kewarganegaraan,
    noNPWP,
    noKTP,
    tempatTerbit,
    tanggalKadaluarsa,
    noKitas,
    noPassport) {
    return new Promise(function (resolve, reject) {
        InvestorData.updateDataDiriInvestorPersonal(
            userCode,
            panggilan,
            nama,
            tempatLahir,
            tanggalLahir,
            jenisKelamin,
            agama,
            pekerjaan,
            statusPerkawinan,
            penghasilan,
            pendidikan,
            sumberDana,
            namaGadisIbu,
            alamat,
            provinsi,
            kabupaten,
            kecamatan,
            kelurahan,
            kodePos,
            kewarganegaraan,
            noNPWP,
            noKTP,
            tempatTerbit,
            tanggalKadaluarsa,
            noKitas,
            noPassport)
            .then((result) => {
                if (result) {
                    const successResult = {
                        'statusCode': 'C0001',
                        'response': 'Success',
                        'message': 'Update  Data Diri Investor Personal Successs'
                    };
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                return reject(err);
            });
    });
};

const updateDataDiriInvestorCorporate = function (
    userCode,
    nama,
    noKTP) {
    return new Promise(function (resolve, reject) {
        InvestorData.updateDataDiriInvestorCorporate(
            userCode,
            nama,
            noKTP)
            .then((result) => {
                if (result) {
                    const successResult = {
                        'statusCode': 'C0001',
                        'response': 'Success',
                        'message': 'Update Data Diri Investor Corporate Successs'
                    };
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                return reject(err);
            });
    });
};

const updateDataPerusahaanInvestorCorporate = function (
    userCode,
    perusahaanNama,
    perusahaanEmail,
    perusahaanTelepon,
    tempatBerdiri,
    tanggalBerdiri,
    alamat,
    provinsi,
    kota,
    kodePos) {
    return new Promise(function (resolve, reject) {
        InvestorData.updateDataPerusahaanInvestorCorporate(
            userCode,
            perusahaanNama,
            perusahaanEmail,
            perusahaanTelepon,
            tempatBerdiri,
            tanggalBerdiri,
            alamat,
            provinsi,
            kota,
            kodePos)
            .then((result) => {
                if (result) {
                    const successResult = {
                        'statusCode': 'C0001',
                        'response': 'Success',
                        'message': 'Update Data Diri Investor Corporate Successs'
                    };
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                return reject(err);
            });
    });
};

const updateDataAuthInvestor = function (
    userCode,
    email,
    nomorTelepon) {
    return new Promise(function (resolve, reject) {
        InvestorData.updateDataAuthInvestor(
            userCode,
            email,
            nomorTelepon)
            .then((result) => {
                if (result) {
                    const successResult = {
                        'statusCode': 'C0001',
                        'response': 'Success',
                        'message': 'Update Auth Investor Successs'
                    };
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                return reject(err);
            });
    });
};

const updateDataBankInvestor = function (
    userCode,
    kodeBank,
    nomorRekening,
    namaNasabah,
    jenisRekening,
    cabang) {
    return new Promise(function (resolve, reject) {
        InvestorData.updateDataBankInvestor(
            userCode,
            kodeBank,
            nomorRekening,
            namaNasabah,
            jenisRekening,
            cabang)
            .then((result) => {
                if (result) {
                    const successResult = {
                        'statusCode': 'C0001',
                        'response': 'Success',
                        'message': 'Update Bank Investor Successs'
                    };
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                return reject(err);
            });
    });
};

const insertInvestorDataBank = function (
    userId,
    kodeBank,
    nomorRekening,
    namaNasabah,
    jenisRekening,
    cabang) {
    return new Promise(function (resolve, reject) {
        InvestorData.insertInvestorBank(
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

const updateAlamatInvestorPersonal = function (
    userCode,
    kewarganegaraan,
    alamat,
    provinsi,
    kabupaten,
    kecamatan,
    kelurahan,
    kodePos) {
    return new Promise(function (resolve, reject) {
        InvestorData.updateAlamatInvestorPersonal(
            userCode,
            kewarganegaraan,
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
                        'message': 'Update Alamat Investor Personal Successs'
                    };
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                return reject(err);
            });
    });
};

const updateAlamatInvestorCorporate = function (
    userCode,
    alamatCompany,
    provinsiCompany,
    kotaCompany,
    kodePosCompany) {
    return new Promise(function (resolve, reject) {
        InvestorData.updateAlamatInvestorCorporate(
            userCode,
            alamatCompany,
            provinsiCompany,
            kotaCompany,
            kodePosCompany)
            .then((result) => {
                if (result) {
                    const successResult = {
                        'statusCode': 'C0001',
                        'response': 'Success',
                        'message': 'Update Alamat Investor Corporate Successs'
                    };
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                return reject(err);
            });
    });
};

const getAllInvestor = (roleId) => {
    return new Promise((resolve, reject) => {
        try {
            const allInvestor = UserData.getUserBasedRole(roleId);
            resolve(allInvestor);
        } catch (err) {
            reject({ 'err.message': err });
        }
    });
};

const getReferalCodeInvestor = (userCode) => {
    return new Promise((resolve, reject) => {
        try {
            const getRefCode = UserData.getReferalCodeUser(userCode);
            resolve(getRefCode);
        } catch (err) {
            reject({ 'err.message': err });
        }
    });
};

const getStatistikInvestor = (userCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            const getAllTopUps = await InvestorData.getAllTopUp(userCode);
            const getAllWithdraws = await InvestorData.getAllWithdraw(userCode);
            const getAllIncomes = await InvestorData.getAllIncome(userCode);
            const getCountAllFundedLoans = await InvestorData.getCountAllFundedLoan(userCode);

            const dataStatistik = {
                'topUp': getAllTopUps,
                'withdraw': getAllWithdraws,
                'income': getAllIncomes,
                'fundedLoan': getCountAllFundedLoans
            };

            return resolve(dataStatistik);
        } catch (err) {
            return reject({ 'err.message': err });
        }
    });
};

const getTotalIncomeAndWithdrawInvestor = (userCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            const getTotalIncomes = await InvestorData.getTotalIncome(userCode);
            const getTotalWithdraws = await InvestorData.getTotalWithdraw(userCode);
            const getTotalFundedLoans = await InvestorData.getTotalFundedLoan(userCode);

            const data = {
                'income': (getTotalIncomes[0].amount !== null) ? getTotalIncomes[0].amount : 0,
                'withdraw': (getTotalWithdraws[0].amount !== null) ? getTotalWithdraws[0].amount : 0,
                'fundedloan': (getTotalFundedLoans[0].funding !== null) ? getTotalFundedLoans[0].funding : 0
            };

            return resolve(data);
        } catch (err) {
            return reject({ 'err.message': err });
        }
    });
};

const getActivityInvestor = (userCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            const getDetailTopUps = await InvestorData.getDetailTopUp(userCode);
            const getDetailWithdraws = await InvestorData.getDetailWithdraw(userCode);
            const getDetailIncomes = await InvestorData.getDetailIncome(userCode);
            const getDetailFundedLoans = await InvestorData.getDetailFundedLoan(userCode);

            const data = {
                'topup': getDetailTopUps,
                'withdraw': getDetailWithdraws,
                'income': getDetailIncomes,
                'fundedloan': getDetailFundedLoans
            };

            return resolve(data);
        } catch (err) {
            return reject({ 'err.message': err });
        }
    });
};

const deleteInvestorData = function (userId) {
    return new Promise(function (resolve, reject) {
        InvestorData.deleteInvestor(userId)
            .then((result) => {
                if (result) {
                    const successResult = {
                        'statusCode': 'C0001',
                        'response': 'Success',
                        'message': 'Delete data investor successfully'
                    };
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                return reject(err);
            });
    });
};

module.exports = {
    insertInvestorPersonalData,
    insertInvestorCorporateDataUser,
    insertInvestorCorporateDataPerusahaan,
    insertInvestorDataBank,
    getAllInvestor,
    getStatistikInvestor,
    getActivityInvestor,
    getTotalIncomeAndWithdrawInvestor,
    getReferalCodeInvestor,
    updateAlamatInvestorPersonal,
    updateAlamatInvestorCorporate,
    updateDataDiriInvestorPersonal,
    updateDataDiriInvestorCorporate,
    updateDataAuthInvestor,
    updateDataBankInvestor,
    updateDataPerusahaanInvestorCorporate,
    deleteInvestorData
};
