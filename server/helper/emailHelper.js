const Config = require('../../config');
const mailgun = require('mailgun-js')({apiKey: Config.get('/email/apiKey'), domain: Config.get('/email/domain')});
const Path = require('path');
const Fs = require('fs');
const Logger = require('./logger');
const OtpData = require('../model/otpData');
const AuthHelper = require('./authHelper');
const AuthenticationData = require('../model/authenticationData');

const __getRandomToken = (totalLength) => {
    const randomToken = Array(totalLength).fill(0).map(() =>
        Math.random().toString(36).charAt(2)).join('');
    return randomToken;
};

const __getUrlVerify = (name, email, token) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const date = new Date();
    const url = Config.get('/mailServer') + '/success-verify-email?token=' + token;
    const emailObject = {
        urlAction: url,
        fullName: name,
        to: email,
        subject: '[Email Verification - Danon | ' + date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear() + ' ]'
    };
    return emailObject;
};

const dataForgetPass = (email, randomPassword, hashPassword) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const date = new Date();
    const emailObject = {
        to: email,
        randomPassword: randomPassword,
        hashPassword: hashPassword,
        subject: '[Forget Password - Danon | ' + date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear() + ' ]'
    };
    return emailObject;
};

const dataAccountApproval = (name, email) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const date = new Date();
    const emailObject = {
        to: email,
        fullName: name,
        subject: '[Account approval - Danon | ' + date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear() + ' ]'
    };
    return emailObject;
};

const dataNewLoan = (jumlahPinjaman, tenor, grade, bunga, loanCode, projectImage, email, nama) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const date = new Date();
    const emailObject = {
        to: email,
        fullName: nama,
        jumlahPinjaman: jumlahPinjaman,
        tenor: tenor,
        grade: grade,
        bunga: bunga,
        loanCode: loanCode,
        projectImage: projectImage,
        subject: '[Daftar Pinjaman Baru - Danon | ' + date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear() + ' ]'
    };
    return emailObject;
};

const dataLoanExpired = (email, loanCode, requestedAmount, collectedAmount) => {
    const emailObject = {
        to: email,
        loanCode: loanCode,
        requestedAmount: requestedAmount,
        collectedAmount: collectedAmount,
        subject: '[Status Pengumpulan Dana Berakhir - Danon | ' + loanCode + ' ]'
    };
    console.log('==loan expired: ', emailObject);
    return emailObject;
};

const sendEmail = async function (payload, type) {
    var fileContent = '';
    if(type === 'verification'){
      fileContent = await loadInvestorRegistrationHtmlContent(payload.fullName, payload.urlAction);
    } else if (type === 'forget-password') {
       fileContent = await forgetPasswordContent(payload.to, payload.randomPassword);
       AuthenticationData.updatePassword(payload.to, payload.hashPassword)
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

    } else if (type === 'account-approval-notification')  {
        fileContent = await accountApprovalContent(payload.fullName);
    } else if (type === 'new-loan-listing') {
        fileContent = await newLoanListingContent(payload.fullName, payload.jumlahPinjaman, payload.tenor, payload.grade, payload.bunga, payload.projectImage, payload.loanCode);
    } else if (type === 'loan-expired') {
        fileContent = await loanExpiredContent(payload.loanCode, payload.requestedAmount, payload.collectedAmount);
    } else{
      fileContent = 'Default Content';
    }

    return new Promise(function (resolve, reject) {
      const data = {
        from: Config.get('/email/sender'),
        to: payload.to,
        subject: payload.subject,
        html: fileContent
      };
      mailgun.messages().send(data, (error) => {
        if (error) {
          return reject(error);
        }

        return resolve(data);
      });
    });
};

const loadTemplate = function (fileName){
      Logger.write.log('info', 'loadTemplate : ' + fileName);
      return new Promise((resolve, reject) => {
        Fs.readFile(Path.join(__dirname,'./../../email_template/' + fileName), 'utf8', (err, content) => {
            if (err) {
              return reject(err);
            }

            return resolve(content);
          });
      });
};

const loadInvestorRegistrationHtmlContent = async function (fullName, urlAction){
      var data = await loadTemplate('investor_registration_verification.html');
      var result = data.replace(/\$fullName/g, fullName).replace(/\$urlAction/g, urlAction);
      return result;
};

const forgetPasswordContent = async function (email, randomPassword) {
    var data = await loadTemplate('forget_password_tamplate.html');
    var result = data.replace(/\$email/g, email).replace(/\$randomPassword/g, randomPassword);
    return result;
};

const newPasswordContent = async (email, randomPassword) => {
    var data = await loadTemplate('new_password_template.html');
    var result = data.replace(/\$email/g, email).replace(/\$randomPassword/g, randomPassword);
    return result;
};

const accountApprovalContent = async function (name) {
    var data = await loadTemplate('account_approval_notification.html');
    var result = data.replace(/\$fullName/g, name);
    return result;
};

const newLoanListingContent = async function (name, jumlahPinjaman, tenor, grade, bunga, projectImage, loanCode) {
    console.log('name: ' + name);
    console.log('jumlah pinjaman: ' + jumlahPinjaman);
    console.log('tenor: ' + tenor);
    console.log('grade: ' + grade);
    console.log('bunga: ' + bunga);
    console.log('Project Image: ' + projectImage);
    console.log('loan Code: ' + loanCode);
    var data = await loadTemplate('new_loan_listing.html');
    var result = data.replace(/\$fullName/g, name).replace(/\$jumlahPinjaman/g, jumlahPinjaman).replace(/\$tenor/g, tenor).replace(/\$grade/g, grade).replace(/\$bunga/g, bunga).replace(/\$projectImage/g, projectImage).replace(/\$loanCode/g, loanCode);
    return result;
};

const setEmailUrl = (name, authId, email) => {
  return new Promise(async (resolve, reject) => {
      const randomToken = __getRandomToken(16);
      const storeToDb = await OtpData.insertEmailToken(authId, email, randomToken, new Date());
      if (storeToDb.affectedRows) {
          const urlVerify = __getUrlVerify(name, email, randomToken);
          return resolve(urlVerify);
      }
  });
};

const getVerifyData = (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            const verifyData = await OtpData.getEmailToken(token);
            return resolve(verifyData[0]);
        } catch (err) {
            return reject(err);
        }
    });
};

const responseEmail = (getEmail) => {
    return new Promise((resolve) => {
        let emailResponse;
        if (getEmail.from) {
            emailResponse = {
                'statusCode': 'C0001',
                'response': 'Success',
                'message': 'Forget Password succesfully'
            };
        } else {
            emailResponse = {
                'statusCode': 'E0001',
                'response': 'Failed',
                'message': 'Forget Password failed'
            };
        }

        return resolve(emailResponse);
    });
};

const randomPasswordExternal = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            const randomPassword = await __getRandomToken(10);
            await newPasswordContent(email, randomPassword);
            return resolve(randomPassword);
        } catch (err) {
            console.log(err);
            Logger.write.log('error', 'create new password error for ' + email + ': ' + err.message);
            return reject(err);
        }
    });
};

const loanExpiredContent = async function (loanCode, requestedAmount, collectedAmount) {
    var data = await loadTemplate('loan_expired_template.html');
    var result = data.replace(/\$loanCode/g, loanCode).replace(/\$requestedAmount/g, requestedAmount).replace(/\$collectedAmount/g, collectedAmount);
    return result;
};

module.exports = {
    getVerifyData,
    loadInvestorRegistrationHtmlContent,
    loanExpiredContent,
    forgetPasswordContent,
    loadTemplate,
    responseEmail,
    sendEmail,
    setEmailUrl,
    dataForgetPass,
    dataAccountApproval,
    accountApprovalContent,
    dataNewLoan,
    dataLoanExpired,
    newLoanListingContent,
    newPasswordContent,
    randomPasswordExternal
};
