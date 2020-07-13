const _ = require('lodash');
const Joi = require('joi');
const Boom = require('boom');
const AuthHelper = require('../helper/authHelper');
const EmailHelper = require('../helper/emailHelper');

const PASSWORD_REG_EXP = /^(?=.*[0-9])(?=.*[A-z]).*$/;

const checkEmailExist = async (request, h) => {
    const req = request.payload;
    try {
        const isExist = await AuthHelper.isExist(req.email);
        return h.response(isExist);
    } catch (err) {
        throw Boom.notFound('error', err);
    }
};

const forgetPassword = async (request, h) => {
    const req = request.payload;
    try {
        const isExist = await AuthHelper.isExist(req.email);

        if (isExist.userExist === true) {
            const randomToken = Array(12).fill(0).map(() =>
            Math.random().toString(36).charAt(2)).join('');
            const hashPassword = await AuthHelper.hashPassword(randomToken);
            const data = await EmailHelper.dataForgetPass(req.email, randomToken, hashPassword);
            const emailResponse = await EmailHelper.sendEmail(data, 'forget-password');
            const finalResponse = await EmailHelper.responseEmail(emailResponse);
            return h.response(finalResponse);
        }

        return h.response(isExist);
    } catch (err) {
        throw Boom.notFound('error', err);
    }
};

const registerAuthentication = async (request, h) => {
    const req = request.payload;
    try {
        const checkPhone = await AuthHelper.isMsisdnExist(req.codecountry, req.msisdn);
        if(!checkPhone) {
            console.log('masuk ke if');
            const hashPassword = await AuthHelper.hashPassword(req.password);
            const insertAuth = await AuthHelper.insertAuthentication(req.email, hashPassword, req.codecountry, req.msisdn);
            const selectAuth = await AuthHelper.selectAuth(insertAuth, req.email, hashPassword, req.codecountry, req.msisdn);
            const insertUser = await AuthHelper.insertUsers(selectAuth, req.referalCode, req.nama, req.role);
            const setEmailUrl = await EmailHelper.setEmailUrl(req.nama, selectAuth, req.email);
            await EmailHelper.sendEmail(setEmailUrl, 'verification');
            return h.response(insertUser);
        }

        const failedRespon = {
            'statusCode': 'E0001',
            'response': 'Failed',
            'message': 'Ooops ! Phone number already registered'
        };

        return h.response(failedRespon);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const resendOtp = async (request, h) => {
    const req = request.payload;
    try {
        const type = req.type ? req.type : 1;
        const smsOtp = await AuthHelper.sendSmsOtp(req.msisdn, req.authId, type);
        return h.response(smsOtp);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const resendEmail = async (request, h) => {
    const req = request.payload;
    try {
        const setEmailUrl = await EmailHelper.setEmailUrl(req.nama, req.authId, req.email);
        const emailSendStatus = await EmailHelper.sendEmail(setEmailUrl, 'verification');
        const finalResponse = await EmailHelper.responseEmail(emailSendStatus);
        return h.response(finalResponse);
    } catch (err) {
        return Boom.badRequest(err.message);
    }

};

const loginProcess = async (request, h) => {
    const req = request.payload;
    try {
        const deletedStatus = await AuthHelper.checkDeletedStatus(req.email);
        if (deletedStatus[0].deleted === 0) {
            const originData = await AuthHelper.getPassword(req.email, null);
            const compareValue = await AuthHelper.comparePassword(originData.hash_password, req.password);
            const authToken = await AuthHelper.getToken(compareValue, req.email, originData);
            return h.response(authToken);
        }

        const deleteResult = {
            'statusCode': 'E0001',
            'response': 'Failed',
            'message': 'User has been deleted'
        };
        return h.response(deleteResult);
    } catch (err) {
        if (_.includes(err.message, '\'hash_password\' of undefined')) {
            const failedResult = {
                'statusCode': 'E0001',
                'response': 'Failed',
                'message': 'Wrong input email or password'
            };
            return h.response(failedResult);
        }

      return Boom.badRequest(err.message);
    }
};

const verifyEmail = async (request, h) => {
    const req = request.payload;
    try {
        const verifyData = await EmailHelper.getVerifyData(req.token);
        const verifyStatus = await AuthHelper.checkVerifyStatus(verifyData.auth_id);
        let verifyEmailRes;
        if (verifyStatus === 0) {
            const updateVerify = await AuthHelper.updateVerify(1, verifyData.auth_id);
            verifyEmailRes = await AuthHelper.emailVerify(updateVerify, verifyData.auth_id);
        } else {
            verifyEmailRes = {
                'statusCode': 'E0001',
                'response': 'Failed',
                'message': 'verification process had been verified before.'
            };
        }

        return h.response(verifyEmailRes);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const verifyOtp = async (request, h) => {
    const req = request.payload;
    try {
        console.log('authId: ' + req.authId);
        console.log('noHp: ' + req.noHp);
        console.log('otp: ' + req.otp);
        const checkOtp = await AuthHelper.checkOtp(req.authId, req.noHp, req.otp, 1);
        const updateVerify = await AuthHelper.updateVerify(2, req.authId);
        const checkStatus = await AuthHelper.phoneVerify(updateVerify, req.authId, checkOtp);
        return h.response(checkStatus);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const logout = async (request, h) => {
    const req = request.payload;
    const userCode = request.auth.credentials.userCode;
    try {
        const logoutStatus = await AuthHelper.logout(userCode);
        return h.response(logoutStatus);
    } catch (err) {
        return Boom.badRequest(err.message);
    }
};

const updatePass = async (request, h) => {
    const req = request.payload;
    try {
        const hashPassword = await AuthHelper.hashPassword(req.newPassword);
        const originData = await AuthHelper.getPassword(req.email, null);
        const compareValue = await AuthHelper.comparePassword(originData.hash_password, req.oldPassword);
        const updatePassword = await AuthHelper.updatePassword(compareValue, req.email, hashPassword);
        return h.response(updatePassword);
    } catch (err) {
        if (_.includes(err.message, '\'hash_password\' of undefined')) {
            const failedResult = {
                'statusCode': 'E0001',
                'response': 'Failed',
                'message': 'Wrong input email or password'
            };
            return h.response(failedResult);
        }

      return Boom.badRequest(err.message);
    }
};


const updateProfile = async (request, h) => {
    const req = request.payload;
    try{
        const update = await AuthHelper.updateProfile(req.userId, req.alamat, req.kewarganegaraan, req.provinsi, req.kabupaten, req.kecamatan, req.kelurahan, req.kodePost);
        return h.response(update);
    }catch(err){
        return Boom.badRequest(err.message);
    }
};

const getUserDetail = async (request, h) => {
    const authId = request.auth.credentials.authId;
    try{
        const detail = await AuthHelper.getUserDetail(authId);
        return h.response(detail);
    }catch(err){
        return Boom.badRequest(err.message);
    }
};

const getUserDetailInvestorBasedUserCode = async (request, h) => {
    const req = request.payload;
    try{
        const detail = await AuthHelper.getUserDetailInvestorBasedUserCode(req.userCode);
        return h.response(detail);
    }catch(err){
        return Boom.badRequest(err.message);
    }
};

const getUserDetailBorrowerBasedUserCode = async (request, h) => {
    const req = request.payload;
    try{
        const detail = await AuthHelper.getUserDetailBorrowerBasedUserCode(req.userCode);
        return h.response(detail);
    }catch(err){
        return Boom.badRequest(err.message);
    }
};

const getUserBank = async (request, h) => {
    const req = request.payload;
    try{
        const detail = await AuthHelper.getBankUser(req.userCode);
        return h.response(detail);
    }catch(err){
        return Boom.badRequest(err.message);
    }
};

exports.plugin = {
    register: (server, options) => {
        options = _.extend({ basePath: '' }, options);

        server.route([{
            method: 'POST',
            path: options.basePath + '/check-email',
            handler: checkEmailExist,
            options: {
                description: 'Checking if email already exists',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        email: Joi.string().email().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/register-auth',
            handler: registerAuthentication,
            options: {
                description: 'Register new user, for login purpose',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        role: Joi.number().required(),
                        nama: Joi.string().required(),
                        email: Joi.string().email().required(),
                        referalCode: Joi.string().required(),
                        password: Joi.string().regex(PASSWORD_REG_EXP).required(),
                        codecountry: Joi.string().required(),
                        msisdn: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/resend-otp',
            handler: resendOtp,
            options: {
                description: 'Resend otp for registration',
                tags: ['api', 'auth', 'otp'],
                auth: false,
                validate: {
                    payload: {
                        authId: Joi.number().required(),
                        msisdn: Joi.number().required(),
                        type: Joi.number()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/resend-email',
            handler: resendEmail,
            options: {
                description: 'Resend email for registration',
                tags: ['api', 'auth', 'email'],
                auth: false,
                validate: {
                    payload: {
                        nama: Joi.string().required(),
                        authId: Joi.number().required(),
                        email: Joi.string().email().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/login',
            handler: loginProcess,
            options: {
                description: 'Login check username and password',
                tags: ['api', 'auth', 'login'],
                auth: false,
                validate: {
                    payload: {
                        email: Joi.string().email().required(),
                        password: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/verify-email',
            handler: verifyEmail,
            options: {
                description: 'Verification email',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        token: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/verify-otp',
            handler: verifyOtp,
            options: {
                description: 'Verification phone number',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        authId: Joi.number().required(),
                        noHp: Joi.number().required(),
                        otp: Joi.string().required()
                    }
                }
            }
        },{
            method: 'POST',
            path: options.basePath + '/update-password',
            handler: updatePass,
            options: {
                description: 'Update Password',
                tags: ['api', 'auth', 'update password'],
                auth: false,
                validate: {
                    payload: {
                        oldPassword: Joi.string().required(),
                        email : Joi.string().required(),
                        newPassword : Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/update-profile',
            handler: updateProfile,
            options: {
                description: 'Update Profile',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        userId: Joi.number().required(),
                        alamat: Joi.string().required(),
                        kewarganegaraan: Joi.string().required(),
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
            path: options.basePath + '/get-user-detail',
            handler: getUserDetail,
            options: {
                description: 'Get User Detail',
                tags: ['api', 'auth']
            }
        }, {
            method: 'POST',
            path: options.basePath + '/get-detail-investor',
            handler: getUserDetailInvestorBasedUserCode,
            options: {
                description: 'Get Investor Detail based User Code',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        userCode: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/get-detail-borrower',
            handler: getUserDetailBorrowerBasedUserCode,
            options: {
                description: 'Get Borrower Detail based User Code',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        userCode: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/forget-password',
            handler: forgetPassword,
            options: {
                description: 'Forget Password User',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        email: Joi.string().email().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/get-user-bank',
            handler: getUserBank,
            options: {
                description: 'Get User Bank',
                tags: ['api', 'auth'],
                auth: false,
                validate: {
                    payload: {
                        userCode: Joi.string().required()
                    }
                }
            }
        }, {
            method: 'POST',
            path: options.basePath + '/logout',
            handler: logout,
            options: {
                description: 'Logout process',
                tags: ['api', 'auth']
            }
        }]);
    },

    'name': 'api-auth'
};
