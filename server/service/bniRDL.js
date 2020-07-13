'use strict';

const Config = require('../../config');
const Request = require('request');
const Logger = require('../helper/logger');
const Uuidv4 = require('uuid/v4');
const Crypto = require('crypto');
const UtilsHelper = require('../helper/utilsHelper');
const BniEnc = require('../service/bniEncryption');
const AssetData = require('../model/assetData');

const companyId = 'DANON';
const parentCompanyId = '';

const __headerApiToken = () => {
    const authorization = Buffer.from(Config.get('/bniCredential/clientId') + ':' + Config.get('/bniCredential/clientSecret')).toString('base64');
    const rdlHeaderAPIToken = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + authorization
    };

    // console.log('BEFORE ENCODE => ', Config.get('/bniCredential/clientId') + ':' + Config.get('/bniCredential/clientSecret'));
    // console.log('ENCODE => ', authorization);
    // console.log('DECODE => ', Buffer.from(authorization, 'base64').toString('ascii'));

    return rdlHeaderAPIToken;
};

const __header = () => {
    const rdlHeader = {
        'X-API-Key': Config.get('/bniCredential/apiKey'),
        'Content-Type': 'application/json'
    };
    return rdlHeader;
};

const __headerBodyJSON = (signatureStatus, signature, uuid) => {
    const rdlheaderBodyJSON = {
        'companyId': companyId,
        'parentCompanyId': parentCompanyId,
        'requestUuid': uuid
    };

    if (signatureStatus) {
        rdlheaderBodyJSON.signature = signature;
    }

    console.log('RDL Header Body JSON => ', JSON.stringify(rdlheaderBodyJSON));
    console.log('');

    return rdlheaderBodyJSON;
};

const __generateUUID = () => {
    const UUID = Uuidv4().toString().toUpperCase().replace(/-/g, '').substring(0, 16);
    // console.log('UUID => ', UUID);
    // console.log('');

    return UUID;
};

const __generateJWTDigitalSignature = (dataPayloads) => {
    const JWTHeaders = {
        'alg': 'HS256',
        'typ': 'JWT'
    };

    const JWTHeader = Buffer.from(JSON.stringify(JWTHeaders)).toString('base64');
    const Base64JWTHeader = JWTHeader.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    // console.log('JWT HEADER Encode => ', Base64JWTHeader);
    // console.log('');

    const JWTPayloads = Buffer.from(JSON.stringify(dataPayloads)).toString('base64');
    const Base64JWTPayloads = JWTPayloads.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    // console.log('JWT Payloads Encode => ', Base64JWTPayloads);
    // console.log('');

    const JWTSignature = Crypto.createHmac('SHA256', Config.get('/bniCredential/secretKey')).update(Base64JWTHeader + '.' + Base64JWTPayloads).digest('base64');
    const Base64Signature = JWTSignature.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    // console.log('JWT Siganture Encode => ', Base64Signature);
    // console.log('');

    /**
     **** Decode Base64 Header & Payloads ***
     *
    const decodePayload = Buffer.from(Base64JWTPayloads, 'base64').toString('ascii');
    console.log('JWT Payloads Decode => ', decodePayload);
    const decodeHeader = Buffer.from(Base64JWTHeader, 'base64').toString('ascii');
    console.log('JWT HEADER Decode => ', decodeHeader);
    */
    const JWTDS = Base64JWTHeader + '.' + Base64JWTPayloads + '.' + Base64Signature;

    return JWTDS;
};

const __reqApiToken = (methodRequest, path) => {
    return new Promise((resolve, reject) => {
        const options = {
            headers: __headerApiToken(),
            uri: Config.get('/bniCredential/server') + path,
            method: methodRequest,
            form: 'grant_type=client_credentials',
            agent: false
        };

        console.log('');
        console.log('====================== SEND ==========================');
        console.log('GET TOKEN : ');
        console.log(options);
        console.log('');

        Request(options, (err, response) => {
            if (err) {
                console.log(err, response);
                Logger.write.log('error', 'BNI api request error for operation: getApiToken, with error : ' + err.message);
                return reject({ 'message': 'BNI api failed' });
            }

            return resolve(response.body);
        });
    });
};

const __request = (methodRequest, path, data, source, type) => {
    return new Promise(async (resolve, reject) => {
        const Token = await UtilsHelper.getToken();

        const options = {
            'uri': Config.get('/bniCredential/server') + path + '?access_token=' + Token[0].token,
            'method': methodRequest,
            'headers': __header(),
            'body': JSON.stringify({ 'request': data }),
            agent: false
        };

        console.log('');
        console.log('====================== SEND ==========================');
        console.log(options);
        console.log('');

        Request(options, (err, response) => {
            if (err) {
                AssetData.insertRecordBni(source, type, err.message);
                Logger.write.log('error', 'BNI api request error for operation: ' + path + ', with error : ' + err.message);
                return reject({ 'message': 'BNI api failed for operation: ' + path });
            }

            AssetData.insertRecordBni(source, type, response.body);
            return resolve(response.body);
        });
    });
};

const __generateRequest = (data, url, source, type) => {
    return new Promise(async (resolve, reject) => {
        /** Generate UUID */
        const generateUUID = __generateUUID();

        /** Generate JWT Digital Signature */
        const addHeader = Object.assign({ 'header': __headerBodyJSON(false, null, generateUUID) }, data);

        const newPayload = { 'request': addHeader };

        // console.log('BEFORE DATA => ', newPayload);
        const generateSignature = __generateJWTDigitalSignature(newPayload);

        /** New Data With JWTDS & UUID */
        const payload = Object.assign({ 'header': __headerBodyJSON(true, generateSignature, generateUUID) }, data);

        try {
            const responseBody = await __request('POST', url, payload, source, type);
            const responseVal = JSON.parse(responseBody);

            console.log('RESPONSE VAL => ', JSON.stringify(responseVal));
            return resolve(responseVal);
        } catch (err) {
            Logger.write.log('error', 'Generate api request error for: ' + url + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to generate request' });
        }
    });
};

const __decryptResponse = (data) => {
    return BniEnc.decrypt(data, Config.get('/bniCredential/p2pId'), Config.get('/bniCredential/decryptKey'));
};

const __encryptResponse = (data) => {
    return BniEnc.encrypt(data, Config.get('/bniCredential/p2pId'), Config.get('/bniCredential/decryptKey'));
};

const getApiToken = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const responseBody = await __reqApiToken('POST', 'api/oauth/token');
            const responseVal = JSON.parse(responseBody);

            if (responseVal.access_token) {
                console.log('resultVal1', responseVal.access_token);
                await UtilsHelper.updatedToken(responseVal.access_token);
            }

            return resolve(responseVal);
        } catch (err) {
            console.log('err2', err);
            Logger.write.log('error', 'BNI api getApiToken error : ' + err.message);
            return reject({ 'message': 'BNI api failed to operation: getApiToken' });
        }
    });
};

const registerCIFInvestor = (title, firstName, middleName, lastName, optNPWP, NPWPNum, nationality, domicileCountry, religion, birthPlace, birthDate, gender, isMarried, motherMaidenName, jobCode, education, idNumber, idIssuingCity, idExpiryDate, addressStreet, addressRtRwPerum, addressKel, addressKec, zipCode, homePhone1, homePhone2, officePhone1, officePhone2, mobilePhone1, mobilePhone2, faxNum1, faxNum2, branchOpening, monthlyIncome, email) => {
    return new Promise(async (resolve, reject) => {
        const data = {
            'title': title,
            'firstName': firstName,
            'middleName': (middleName) ? middleName : '',
            'lastName': lastName,
            'optNPWP': optNPWP,
            'NPWPNum': NPWPNum,
            'nationality': nationality,
            'domicileCountry': domicileCountry,
            'religion': religion,
            'birthPlace': birthPlace,
            'birthDate': birthDate,
            'gender': gender,
            'isMarried': isMarried,
            'motherMaidenName': motherMaidenName,
            'jobCode': jobCode,
            'education': education,
            'idNumber': idNumber,
            'idIssuingCity': idIssuingCity,
            'idExpiryDate': idExpiryDate,
            'addressStreet': addressStreet,
            'addressRtRwPerum': addressRtRwPerum,
            'addressKel': addressKel,
            'addressKec': addressKec,
            'zipCode': zipCode,
            'homePhone1': homePhone1,
            'homePhone2': homePhone2,
            'officePhone1': (officePhone1) ? officePhone1 : '',
            'officePhone2': (officePhone2) ? officePhone2 : '',
            'mobilePhone1': mobilePhone1,
            'mobilePhone2': mobilePhone2,
            'faxNum1': (faxNum1) ? faxNum1 : '',
            'faxNum2': (faxNum2) ? faxNum2 : '',
            'email': email,
            'monthlyIncome': monthlyIncome,
            'branchOpening': '0259'
        };

        try {
            const cifRequest = await __generateRequest(data, 'p2pl/register/investor', email, 'REGISTER-CIF');
            return resolve(cifRequest);
        } catch (err) {
            Logger.write.log('error', 'Register CIF Investor api request error for: ' + data.email + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to register cif investor' });
        }
    });
};

const registerRDLInvestor = (cifNumber, accountType, currency, openAccountReason, sourceOfFund, branchId) => {
    return new Promise(async (resolve, reject) => {
        const data = {
            'cifNumber': cifNumber,
            'accountType': accountType,
            'currency': currency,
            'openAccountReason': openAccountReason,
            'sourceOfFund': sourceOfFund,
            'branchId': '0259'
        };

        try {
            const registerRDLInvestors = await __generateRequest(data, 'p2pl/register/investor/account', cifNumber, 'REGISTER-RDL');
            return resolve(registerRDLInvestors);
        } catch (err) {
            Logger.write.log('error', 'Register RDL api request error for: ' + cifNumber + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to register rdl' });
        }
    });
};

const inquiryAccountInfo = (accountNumber) => {
    return new Promise(async (resolve, reject) => {
        const data = {
            'accountNumber': accountNumber
        };

        try {
            const inquiryAccountInfos = await __generateRequest(data, 'p2pl/inquiry/account/info');
            return resolve(inquiryAccountInfos);
        } catch (err) {
            Logger.write.log('error', 'Inquiry Account Info api request error for accNumber: ' + accountNumber + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to inquiry acccount info' });
        }
    });
};

const inquiryAccountBalance = (accountNumber) => {
    return new Promise(async (resolve, reject) => {
        const data = {
            'accountNumber': accountNumber
        };

        try {
            const inquiryAccountBalances = await __generateRequest(data, 'p2pl/inquiry/account/balance', accountNumber, 'INQUIRY-BALANCE');
            return resolve(inquiryAccountBalances);
        } catch (err) {
            Logger.write.log('error', 'Inquiry Account Balance api request error for accNumber: ' + accountNumber + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to inquiry acccount balance' });
        }
    });
};

const inquiryAccountHistory = (accountNumber) => {
    return new Promise(async (resolve, reject) => {
        const data = {
            'accountNumber': accountNumber
        };

        try {
            const inquiryAccountHistorys = await __generateRequest(data, 'p2pl/inquiry/account/history', accountNumber, 'INQUIRY-HISTORY');
            return resolve(inquiryAccountHistorys);
        } catch (err) {
            Logger.write.log('error', 'Inquiry Account History api request error for accNumber: ' + accountNumber + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to inquiry acccount history' });
        }
    });
};

const inquiryPaymentStatus = (requestedUuid) => {
    return new Promise(async (resolve, reject) => {
        const data = {
            'requestedUuid': requestedUuid
        };

        try {
            const inquiryPaymentStatuss = await __generateRequest(data, 'p2pl/inquiry/payment/status', requestUuid, 'INQUIRY-PAYMENTSTATUS');
            return resolve(inquiryPaymentStatuss);
        } catch (err) {
            Logger.write.log('error', 'Inquiry Payment Status api request error for reqUUID: ' + requestedUuid + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to inquiry payment status' });
        }
    });
};

const inquiryInterbankAccount = (accountNumber, beneficiaryBankCode, beneficiaryAccountNumber) => {
    return new Promise(async (resolve, reject) => {
        const data = {
            'requestedUuid': accountNumber,
            'beneficiaryBankCode': beneficiaryBankCode,
            'beneficiaryAccountNumber': beneficiaryAccountNumber
        };

        try {
            const inquiryInterbankAccounts = await __generateRequest(data, 'p2pl/inquiry/interbank/account', accountNumber, 'INQUIRY-INTERBANKACC');
            return resolve(inquiryInterbankAccounts);
        } catch (err) {
            Logger.write.log('error', 'Inquiry Interbank Account api request error for accNumber: ' + accountNumber + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to inquiry interbank account' });
        }
    });
};

const paymentUsingTransfer = (accountNumber, beneficiaryAccountNumber, currency, amount, remark) => {
    return new Promise(async (resolve, reject) => {
        const data = {
            'accountNumber': accountNumber,
            'beneficiaryAccountNumber': beneficiaryAccountNumber,
            'currency': currency,
            'amount': amount,
            'remark': remark
        };

        try {
            const paymentUsingTransfers = await __generateRequest(data, 'p2pl/payment/transfer', accountNumber, 'PAYMENT-TRANSFER');
            return resolve(paymentUsingTransfers);
        } catch (err) {
            Logger.write.log('error', 'Payment Using Transfer api request error for accNumber: ' + accountNumber + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to payment using transfer' });
        }
    });
};

const paymentUsingClearing = (accountNumber, beneficiaryAccountNumber, beneficiaryAddress1, beneficiaryAddress2, beneficiaryBankCode, beneficiaryName, currency, amount, remark, chargingType) => {
    return new Promise(async (resolve, reject) => {
        const data = {
            'accountNumber': accountNumber,
            'beneficiaryAccountNumber': beneficiaryAccountNumber,
            'beneficiaryAddress1': beneficiaryAddress1,
            'beneficiaryAddress2': beneficiaryAddress2,
            'beneficiaryBankCode': beneficiaryBankCode,
            'beneficiaryName': beneficiaryName,
            'currency': currency,
            'amount': amount,
            'remark': remark,
            'chargingType': chargingType
        };

        try {
            const paymentUsingClearings = await __generateRequest(data, 'p2pl/payment/clearing', accountNumber, 'PAYMENT-CLEARING');
            return resolve(paymentUsingClearings);
        } catch (err) {
            Logger.write.log('error', 'Payment Using Clearing api request error for accNumber: ' + accountNumber + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to payment using clearing' });
        }
    });
};

const paymentUsingRTGS = (accountNumber, beneficiaryAccountNumber, beneficiaryAddress1, beneficiaryAddress2, beneficiaryBankCode, beneficiaryName, currency, amount, remark, chargingType) => {
    return new Promise(async (resolve, reject) => {
        const data = {
            'accountNumber': accountNumber,
            'beneficiaryAccountNumber': beneficiaryAccountNumber,
            'beneficiaryAddress1': beneficiaryAddress1,
            'beneficiaryAddress2': beneficiaryAddress2,
            'beneficiaryBankCode': beneficiaryBankCode,
            'beneficiaryName': beneficiaryName,
            'currency': currency,
            'amount': amount,
            'remark': remark,
            'chargingType': chargingType
        };

        try {
            const paymentUsingRTGSs = await __generateRequest(data, 'p2pl/payment/rtgs', accountNumber, 'PAYMENT-RTGS');
            return resolve(paymentUsingRTGSs);
        } catch (err) {
            Logger.write.log('error', 'Payment Using RTGS api request error for accNumber: ' + accountNumber + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to payment using rtgs' });
        }
    });
};

const paymentUsingInterbank = (accountNumber, beneficiaryAccountNumber, beneficiaryAccountName, beneficiaryBankCode, beneficiaryBankName, amount) => {
    return new Promise(async (resolve, reject) => {
        const data = {
            'accountNumber': accountNumber,
            'beneficiaryAccountNumber': beneficiaryAccountNumber,
            'beneficiaryAccountName': beneficiaryAccountName,
            'beneficiaryBankCode': beneficiaryBankCode,
            'beneficiaryBankName': beneficiaryBankName,
            'amount': amount
        };

        try {
            const paymentUsingInterbanks = await __generateRequest(data, 'p2pl/payment/interbank', accountNumber, 'PAYMENT-INTERBANK');
            return resolve(paymentUsingInterbanks);
        } catch (err) {
            Logger.write.log('error', 'Payment Using Interbank api request error for accNumber: ' + accountNumber + ', with error : ' + err.message);
            return reject({ 'message': 'Failed to payment using interbank' });
        }
    });
};

const rdlCallback = (data) => {
    return new Promise((resolve, reject) => {
        try {
            const responseCallback = __decryptResponse(data);
            console.log('====rdl Callback: ', data, responseCallback);
            return resolve(responseCallback);
        } catch (err) {
            Logger.write.log('error', 'rdl callback decrypt error: ' + err.message);
            return reject({ 'message': 'failed to decrypt callback rdl response' });
        }
    });
};

const rdlEncryption = (data) => {
    return new Promise((resolve, reject) => {
        try {
            const responseCallback = __encryptResponse(data);
            console.log('====rdl encryption: ', data, responseCallback);
            return resolve(responseCallback);
        } catch (err) {
            Logger.write.log('error', 'rdl encryption error: ' + err.message);
            return reject({ 'message': 'failed to encryption rdl response' });
        }
    });
};

module.exports = {
    getApiToken,
    registerCIFInvestor,
    registerRDLInvestor,
    inquiryAccountInfo,
    inquiryAccountBalance,
    inquiryAccountHistory,
    inquiryPaymentStatus,
    inquiryInterbankAccount,
    paymentUsingTransfer,
    paymentUsingClearing,
    paymentUsingRTGS,
    paymentUsingInterbank,
    rdlCallback,
    rdlEncryption
};
