const Bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const UtilsHelper = require('./utilsHelper');
const EmailHelper = require('./emailHelper');
const AuthenticationData = require('../model/authenticationData');
const BorrowerData = require('../model/borrowerData');
const UserData = require('../model/userData');
const OtpData = require('../model/otpData');
const DigiSign = require('../service/digiSign');
const Config = require('../../config');
const Otp = require('../service/otp');
const Logger = require('../helper/logger');

// private function
const __createToken = (tokenData) => {
    const secret = Config.get('/login/secret');
    const authToken = JWT.sign(tokenData, secret, { algorithm: 'HS256', expiresIn: '3h' }); // synchronous
    return authToken;
};

const __emailResponse = (data) => {
    const responseVal = {
        authId: data.authentication_id,
        countryCode: data.code_country,
        noHp: data.no_hp
    };
    return responseVal;
};

const __generateOtp = () => {
    const otpNo = Math.floor(100000 + Math.random() * 900000);
    return otpNo;
};

const __generateContentSms = (otp) => {
    console.log('otp: ' + otp);
    const value = otp.toString().split('').join(' ');
    const content = 'Your Danon verification code is: ' + value + '. Please input the code right now.';
    return content;
};

const __getTokenData = (data, email) => {
    const user = {
        authId: data.authentication_id,
        email: email,
        userCode: data.user_code,
        role: data.role_id
    };
    return user;
};

// public function
const comparePassword = (hash, keyinpassword) => {
    return new Promise((resolve, reject) => {
        Bcrypt.compare(keyinpassword, hash)
            .then((res, err) => {
                if (!err) {
                    return resolve(res);
                }

                return reject({ 'err.message': err });
            });
    });
};

const getDataforKYC = (userCode) => {
    return new Promise(function (resolve, reject) {
        AuthenticationData.getDataforKYC(userCode)
            .then((result) => {
                return resolve(result[0]);
            })
            .catch((err) => {
                return reject({'err.message': err});
            });
    });
};

const getPassword = function (email, noHp, userId) {
    return new Promise(function (resolve, reject) {
        AuthenticationData.getAuthDetail(email, noHp, userId)
            .then((result) => {
                return resolve(result[0]);
            })
            .catch((err) => {
                Logger.write.log('error', 'get password error for ' + email ? email : noHp + ': ' + err.message);
                return reject(err);
            });
    });
};

const getToken = (passwordMatch, email, originData) => {
    return new Promise((resolve, reject) => {
        if (passwordMatch) {
            const tokenData = __getTokenData(originData, email);
            try {
                const authToken = __createToken(tokenData);
                const profile = { 'userId': originData.user_id, 'authId': originData.authentication_id,
                'roleId': originData.role_id, 'is_register': originData.is_register, 'name': originData.nama,
                'email': originData.email, 'countryCode': originData.code_country, 'noHp': originData.no_hp,
                'is_verify': originData.is_verify, 'approval': originData.approval};
                return resolve({ 'authToken': authToken,  profile: profile });
            } catch (err) {
                Logger.write.log('error', 'get token error for ' + email + ': ' + err.message);
                return reject({ 'err.message': err });
            }
        } else {
            const failedResult = {
                'statusCode': 'E0001',
                'response': 'Failed',
                'message': 'Wrong input email or password'
            };
            return resolve(failedResult);
        }
    });
};

const hashPassword = function (password) {
    return new Promise(function (resolve, reject) {
        console.log('masuk fungsi hashPassword()');
        Bcrypt.hash(password, 5, (err, hash) => {
            if (hash) {
                console.log(hash);
                return resolve(hash);
            }

            Logger.write.log('error', 'hashPassword error: ' + err.message);
            return reject(err);
        });
    });
};

const insertAuthentication = function (email, password, codecountry, msisdn) {
    return new Promise(async (resolve, reject) => {
        console.log('masuk fungsi insert');
        const checkEmail = await AuthenticationData.checkAuth(email);
        if(!checkEmail[0]) {
            console.log('masuk ke if');
            await AuthenticationData.insertAuthentication(email, password, codecountry, msisdn)
            .then((result) => {
                if (result) {
                    const successResult = 'ok';
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                Logger.write.log('error', 'insert authentication error for ' + email + ': ' + err.message);
                return reject(err);
            });
        }

        console.log('masuk ke else');
        return reject({'statusCode': 'E0001',
        'response': 'Failed',
        'message': 'Ooops ! Email already registered'});
    });
};

const insertAuthAdmin = function (email, password) {
    return new Promise(function (resolve, reject) {
        AuthenticationData.insertAuthAdmin(email, password)
            .then((result) => {
                if (result) {
                    return resolve(result.insertId);
                }
            })
            .catch((err) => {
                Logger.write.log('error', 'insert authentication error for ' + email + ': ' + err.message);
                return reject(err);
            });
    });
};

const selectAuth = function (status, email, password, codecountry, msisdn) {
    if (status === 'ok') {
        return new Promise(function (resolve, reject) {
            AuthenticationData.selectAuthentications(email, password, codecountry, msisdn)
                .then((result) => {
                    return resolve(result[0].authentication_id);
                })
                .catch((err) => {
                    Logger.write.log('error', 'select authentication error for ' + email + ': ' + err.message);
                    return reject(err);
                });
        });
    }

    const errorResult = {
        'statusCode': 'E0001',
        'response': 'Failed',
        'message': 'Ooops ! Something wrong with our ends'
    };
    return resolve(errorResult);
};


const updateProfile = (userId, alamat,  kewarganegaraan, provinsi, kabupaten, kecamatan, kelurahan, kodePost) => {
    return new Promise((resolve, reject) => {
        try {
            UserData.updateProfile(userId, alamat, kewarganegaraan, provinsi, kabupaten, kecamatan, kelurahan, kodePost)
                .then((result) => {
                    return resolve({result});
                });
        } catch (err) {
            return reject({ 'error': err });
        }
    });
};

const getUserDetail = (authId) => {
    return new Promise((resolve,reject) => {
        try {
            UserData.getDetailUser(authId)
                .then((userDetail) => {
                    return resolve(userDetail);
                });
        } catch (err) {
            return reject({ 'error': err });
        }
    });
};

const getUserDetailFromCode = (userCode) => {
    return new Promise((resolve,reject) => {
        try {
            UserData.getDetailUserByUserCode(userCode)
                .then((userDetail) => {
                    return resolve(userDetail);
                });
        } catch (err) {
            return reject({ 'error': err });
        }
    });
};

const getUserDetailInvestorBasedUserCode = (userCode) => {
    return new Promise((resolve,reject) => {
        try {
            UserData.getDetailInvestorByUserCode(userCode)
                .then((userDetail) => {
                    return resolve(userDetail);
                });
        } catch (err) {
            return reject({ 'error': err });
        }
    });
};

const getUserDetailBorrowerBasedUserCode = (userCode) => {
    return new Promise((resolve,reject) => {
        try {
            UserData.getDetailBorrowerByUserCode(userCode)
                .then((userDetail) => {
                    return resolve(userDetail);
                });
        } catch (err) {
            return reject({ 'error': err });
        }
    });
};

const getBankUser = (userCode) => {
    return new Promise((resolve,reject) => {
        try {
            UserData.getDetailBankByUserCode(userCode)
                .then((bankDetail) => {
                    return resolve(bankDetail);
                });
        } catch (err) {
            return reject({ 'error': err });
        }
    });
};

const updatePassword = (passwordMatch,email, newPassword) => {
    return new Promise((resolve, reject) => {
        if(passwordMatch){
            AuthenticationData.updatePassword(email, newPassword)
            .then((result) => {
                if(result) {
                    const successResult = {
                        'response': 'Success',
                        'message': 'password has been changed'
                    };
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                return reject(err);
            });
        }else{
            const failedResult = {
                'statusCode': 'E0001',
                'response': 'Failed',
                'message': 'Wrong input Password'
            };
            return resolve(failedResult);
        }
    });
};

const insertUsers = function (authId, referalBy, nama, role) {
    return new Promise(function (resolve, reject) {
        AuthenticationData.insertUsers(authId, referalBy, nama, role)
            .then((result) => {
                if (result) {
                    const successResult = {
                        'statusCode': 'C0001',
                        'response': 'Success',
                        'message': 'Insert data Authentications successfully'
                    };
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                AuthenticationData.rollbackAuthenticationData(authId)
                    .then((result) => {
                        if (result) {
                            const successResult = {
                                'statusCode': 'R0001',
                                'response': 'Rollback',
                                'message': 'Rollback data authentication successfully'
                            };
                            return resolve(successResult);
                        }
                    });

                return reject(err + 'Ooops !');
            });
    });
};

const insertUserAdmin = function (authId, nama, role, userCode) {
    return new Promise(function (resolve, reject) {
        AuthenticationData.insertUserAdmin(authId, nama, role, userCode)
            .then((result) => {
                if (result) {
                    const successResult = {
                        'statusCode': 'C0001',
                        'response': 'Success',
                        'message': 'Insert data Authentications successfully'
                    };
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                AuthenticationData.rollbackAuthenticationData(authId)
                    .then((result) => {
                        if (result) {
                            const successResult = {
                                'statusCode': 'R0001',
                                'response': 'Rollback',
                                'message': 'Rollback data authentication successfully'
                            };
                            return resolve(successResult);
                        }
                    });

                return reject(err + 'Ooops !');
            });
    });
};

const isExist = function (email) {
    return new Promise(function (resolve, reject) {
        try {
            AuthenticationData.checkEmail(email)
                .then((result) => {
                    const userExist = result[0] ? true : false;
                    return resolve({ userExist });
                });
        } catch (err) {
            Logger.write.log('error', 'check email is exist error for ' + email + ': ' + err.message);
            return reject({ 'error': err });
        }
    });
};

const isMsisdnExist = function (codeCountry, msisdn) {
    console.log('masuk isMsisdnExist');
    return new Promise(function (resolve, reject) {
        try {
            AuthenticationData.checkPhone(codeCountry, msisdn)
                .then((result) => {
                    const userExist = result[0] ? true : false;
                    console.log('user Exist: ' + userExist);
                    return resolve(userExist);
                });
        } catch (err) {
            Logger.write.log('error', 'check msisdn exist error for ' + msisdn + ': ' + err.message);
            return reject({ 'error': err });
        }
    });
};

const updateVerify = (verifyStatus, authId) => {
    return new Promise((resolve, reject) => {
        try {
            AuthenticationData.updateVerify(verifyStatus, authId)
                .then((result) => {
                    return resolve({result});
                });
        } catch (err) {
            Logger.write.log('error', 'update verify error for ' + authId + ': ' + err.message);
            return reject({ 'message': 'update verify failed, something wrong.' });
        }
    });
};

const emailVerify = (updateStatus, authId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (updateStatus.result.affectedRows === 1) {
                const resultVal = await AuthenticationData.getPhone(authId);
                const finalResponse = __emailResponse(resultVal[0]);
                await sendSmsOtp(resultVal[0].no_hp, authId, 1);
                return resolve(finalResponse);
            }

            Logger.write.log('error', 'no changes in verify email status for ' + authId);
            return reject({'message': 'no changes in verify email status'});
        } catch(err) {
            Logger.write.log('error', 'Failed to update verify email status ' + authId + ': ' + err.message);
            return reject({ 'error': err });
        }
    });
};

const phoneVerify = (updateStatus, authId, data) => {
    return new Promise((resolve, reject) => {
        try {
            if (updateStatus.result.affectedRows === 1) {
                const finalResponse = getToken(true, data.email, data);
                return resolve(finalResponse);
            }

            Logger.write.log('error', 'no changes in verify phone status for ' + authId);
            return reject({'message': 'no changes in verify phone status'});
        } catch(err) {
            Logger.write.log('error', 'Failed to update verify phone status ' + authId + ': ' + err.message);
            return reject({ 'error': err });
        }
    });
};

const checkOtp = (authId, noHp, otp, type) => {
    return new Promise(async (resolve, reject) => {
        try {
            const otpValue = await OtpData.getOtp(authId, noHp, type);
            if (otpValue[0].otp === otp) {
                const resultVal = await getPassword(null, noHp, null);
                return resolve(resultVal);
            }

            Logger.write.log('error', 'otp not match for ' + noHp);
            return reject({'message': 'otp not match'});
        } catch(err) {
            Logger.write.log('error', 'check Otp error for ' + authId + ': ' + err.message);
            return reject({'error': err});
        }
    });
};

const sendSmsOtp = (msisdn, authId, type) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check otp request
            console.log('MASUK KE SINI<<<<<');
            const otpCount = await OtpData.checkOtpCount(msisdn, type);
            console.log('msisdn ' + msisdn);
            console.log('type: ' + type);
            console.log('authId: ' + authId);
            console.log('ISI VARIABLE COUNT: ' + otpCount.count);

            if (otpCount[0].count <= 3) {
                const otpToken = __generateOtp();
                await OtpData.insertOtp(authId, otpToken, type, msisdn, new Date());
                const contentMessage = __generateContentSms(otpToken);
                const sendOtp = await Otp.otpApi('+62' + msisdn, contentMessage);
                return resolve(sendOtp);
            }

            const failedResult = {
                'statusCode': 'E0001',
                'response': 'Failed',
                'message': 'You have request to many otp, please wait around 20 minutes'
            };
            return resolve(failedResult);
        } catch (err) {
            Logger.write.log('error', 'send sms otp error for ' + authId + ': ' + err.message);
            return reject({'message': 'send sms failed'});
        }

    });
};

const checkVerifyStatus = (authId) => {
    return new Promise(async (resolve, reject) => {
        try{
            const verifyStatus = await AuthenticationData.getVerifyStatus(authId);
            return resolve(verifyStatus[0].is_verify);
        } catch (err) {
            Logger.write.log('error', 'verify phone error for ' + authId + ': ' + err.message);
            return reject({ 'error': err });
        }
    });
};

const logout = (userCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            const status = await UserData.logout(userCode);
            if (status) {
              const finalResponse = {
                'statusCode': 'C0001',
                'response': 'Success',
                'message': 'Logout succesfully'
              };
              return resolve(finalResponse);
            }
        } catch (err) {
            Logger.write.log('error', 'logout process error for ' + userCode + ': ' + err.message);
            return reject({ 'error': err });
        }
    });
};

const isKtpExist = function (noKtp) {
  console.log('AuthHelper::isKtpExist');
    return new Promise(function (resolve, reject) {
        try {
             AuthenticationData.checkKtp(noKtp)
                 .then((result) => {
                    const ktpExist = result[0] ? true : false;
                      return resolve(ktpExist);
                 });
        } catch (err) {
            console.log('AuthHelper::isKtpExist::err', err);
            return reject({ 'error': err });
        }
    });
};

const checkApprovalStatus = (userCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            const approvalUser = await UserData.checkApprovalStatus(userCode);
            return resolve(approvalUser);
        } catch(err) {
            Logger.write.log('error', 'check approval status of the user error: ' + err.message);
            return reject({ 'error': err });
        }
    });
};

const checkDeletedStatus = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            const deletedStatus = await UserData.checkDeleteStatus(email);
            return resolve(deletedStatus);
        } catch(err) {
            Logger.write.log('error', 'check deleted status of the user error: ' + err.message);
            return reject({ 'error': err });
        }
    });
};

const checkDataExternal = (email, phone, ktp) => {
    return new Promise(async (resolve, reject) => {
        try {
            let failedRes;
            if (!email || !phone || !ktp) {
                failedRes = await UtilsHelper.failedResponse(1, 'email / phone / ktp empty');
                return resolve(failedRes);
            }

            const emailData = await isExist(email);
            if (emailData.userExist) {
                failedRes = await UtilsHelper.failedResponse(1, 'email data already exist');
                return resolve(failedRes);
            }

            const phoneData = await isMsisdnExist(phone);
            if (phoneData.userExist) {
                failedRes = await UtilsHelper.failedResponse(1, 'phone data already exist');
                return resolve(failedRes);
            }

            const ktpData = await isKtpExist(ktp);
            if (ktpData) {
                failedRes = await UtilsHelper.failedResponse(1, 'ktp number already exist');
                return resolve(failedRes);
            }

            return resolve('Ok');
        } catch(err) {
            Logger.write.log('error', 'check data for externar party error: ' + err.message);
            return reject({ 'error': err });
        }
    });
};

const checkExternal = (userId) => {
    return new Promise( (resolve, reject) => {
        try {
            const responseVal = (userId === 'ExternalName') ? 'Ok' : 'Failed';
            return resolve(responseVal);
        } catch(err) {
            Logger.write.log('error', 'check data for external party error: ' + err.message);
            return reject({ 'error': err });
        }
    });
};

const checkInitRegistrationExternal = (userId, email, phone, ktp) => {
    return new Promise( async (resolve, reject) => {
        try {
            let failedRes;

            const checkExternalId = await checkExternal(userId);
            if (checkExternalId !== 'Ok') {
                failedRes = await UtilsHelper.failedResponse(1, 'user not recognize');
                return resolve(failedRes);
            }

            const randomPassword = await EmailHelper.randomPasswordExternal(email);
            const generatePass = await hashPassword(randomPassword);
            await AuthenticationData.insertAuthenticationCase(email, generatePass, '+62', phone, 3);

            return resolve('Ok');
        } catch(err) {
            Logger.write.log('error', 'check data for externar party error: ' + err.message);
            return reject({ 'error': err });
        }
    });
};

const registrationExternalBorrower = (userId, email, phone, ktp, fullName, birthDate, birthPlace, sex, address, province,
    kabupaten, kecamatan, kelurahan, postalCode, npwp, uploadKtp, uploadSelfie, idListBank, accountNo, accountType, branch) => {
    return new Promise( async (resolve, reject) => {
        try {
            const checkExternalData = await checkInitRegistrationExternal(userId, email, phone, ktp);
            if (checkExternalData !== 'Ok') {
                return resolve(checkExternalData);
            }

            const authData = await AuthenticationData.checkAuth(email);
            await AuthenticationData.insertUsersExternal(authData[0].authentication_id, '-', fullName, '1');
            const userCode = await UtilsHelper.generateUserCode(fullName, birthDate);
            const originData = await AuthenticationData.getAuthDetailExternal(email, null, null);

            await BorrowerData.insertBorrowerBank(originData[0].user_id, idListBank, accountNo, fullName, accountType, branch);
            const randomChar = await UtilsHelper.getRandomChar(5);
            await UtilsHelper.uploadFile(uploadKtp, 'user_ktp', '.jpeg', originData[0].user_id, randomChar);
            await UtilsHelper.uploadFile(uploadSelfie, 'user_selfie', '.jpeg', originData[0].user_id, randomChar);
            await BorrowerData.updateBorrowerData(originData[0].user_id, userCode, fullName, birthPlace, birthDate, sex, address, province,
                kabupaten, kecamatan, kelurahan, postalCode, ktp, npwp, ('user_ktp_' + originData[0].user_id + randomChar + '.jpeg'),
                ('user_selfie_' + originData[0].user_id + randomChar + '.jpeg'));

            await DigiSign.registerDigiSign(userCode, address, sex, kecamatan, kelurahan, postalCode, kabupaten, fullName, ('62' + phone), new Date(birthDate), province,
                ktp, birthPlace, email, npwp, null, ('user_ktp_' + originData[0].user_id + randomChar + '.jpeg'),
                ('user_selfie_' + originData[0].user_id + randomChar + '.jpeg'), '', '');

            const successResponse = {
                'statusCode': 'C0001',
                'response': 'Success',
                'message': userCode
            };

            return resolve(successResponse);
        } catch(err) {
            Logger.write.log('error', 'registration for external borrower error: ' + err.message);
            return reject({ 'error': err });
        }
    });
};

module.exports = {
    checkApprovalStatus,
    checkDataExternal,
    checkDeletedStatus,
    checkExternal,
    checkOtp,
    checkVerifyStatus,
    comparePassword,
    emailVerify,
    getPassword,
    getToken,
    hashPassword,
    insertAuthentication,
    isExist,
    isKtpExist,
    isMsisdnExist,
    insertUsers,
    logout,
    phoneVerify,
    selectAuth,
    sendSmsOtp,
    updateVerify,
    updatePassword,
    updateProfile,
    getUserDetail,
    getUserDetailFromCode,
    getUserDetailInvestorBasedUserCode,
    getUserDetailBorrowerBasedUserCode,
    getBankUser,
    insertAuthAdmin,
    insertUserAdmin,
    getDataforKYC,
    registrationExternalBorrower
};
