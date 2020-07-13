const Fs = require('fs');
const Path = require('path');

const PhoneJson = Path.join(__dirname,'../../assets/province_postal_info.json');
const UserData = require('../model/userData');
const LoanData = require('../model/loanData');
const UtilsData = require('../model/utilsData');
const GoogleApi = require('../service/google');
const Config = require('../../config');
const Logger = require('../helper/logger');

// private function

const __getValue = () => {
    return new Promise((resolve, reject) => {
        let outputDir = Config.get('/uploadFile');
        if(outputDir.lastIndexOf('{home.dir}') === 0){
            const os = require('os');

            outputDir = os.homedir() + outputDir.substr(10);
        }

        const JsonPath = outputDir + 'Assets/dashboard_variable.json';

        Fs.readFile(JsonPath, 'utf8', (err, content) => {
            if (err) {
                return reject({ err: err });
            }

            var parsedJSON = JSON.parse(content);
            return resolve(parsedJSON);
        });
    });
};


const __generateDobCode = (dob) => {
    const fullDate = new Date(dob);
    const date = generateTwoDigit(String(fullDate.getDate()));
    const year = generateTwoDigit(String(fullDate.getYear()));
    const dateCode = date + year;
    return dateCode;
};

const __generateInitialCode = (firstname, lastname, dateCode) => {
    let initialCode  = (firstname !== lastname) ? (firstname.slice(0,3) + lastname.slice(0,3) + dateCode) :
        firstname + dateCode;
    initialCode = initialCode.toLowerCase();
    return initialCode;
};

const __generateNewCode = (dbData, initialCode) => {
    let userCode;
    if (dbData.length > 1) {
        const latestCode = dbData[0].user_code;
        const lastCode = parseInt(latestCode.slice(-2)) + 1;
        const lastTwoDigit = generateTwoDigit(String(lastCode));
        userCode = latestCode.slice(0,(latestCode.length - 2)) + lastTwoDigit;
    } else if(dbData.length === 1) {
        userCode = initialCode + '01';
    } else {
        userCode = initialCode;
    }

    return userCode;
};

const generateTwoDigit = (numberVal) => {
    return (numberVal.length < 2) ? '0' + numberVal : numberVal;
};

const __getName = (fullName) => {
    const nameArray = fullName.match(/\S+/g);
    let splitName;
    if (nameArray.length > 1) {
        splitName = {
            firstName: nameArray[0],
            lastName: nameArray[nameArray.length - 1]
        };
    } else {
        splitName = {
            firstName: nameArray[0],
            lastName: nameArray[0]
        };
    }

    return splitName;
};

const __createJsonDashboardVariable = (param) => {
    return new Promise((resolve) => {
        console.log('masuk sini');
        let outputDir = Config.get('/uploadFile');
        if(outputDir.lastIndexOf('{home.dir}') === 0){
            const os = require('os');

            outputDir = os.homedir() + outputDir.substr(10);
        }

        var fs = require('fs');

        const finalOutPutDir = outputDir + 'Assets';
        if (!Fs.existsSync(finalOutPutDir)){
          fs.mkdirSync(finalOutPutDir);
        }

        const data = {
            jumlah_investor: param.jumlah_investor,
            nilai_dana_pinjaman_tersalurkan: param.nilai_dana_pinjaman_tersalurkan,
            jumlah_pinjaman_tersalurkan_keseluruhan: param.jumlah_pinjaman_tersalurkan_keseluruhan,
            pembayaran_pinjaman_macet_keseluruhan: param.pembayaran_pinjaman_macet_keseluruhan,
            TKB90_keseluruhan: param.TKB90_keseluruhan,
            average_interest: param.average_interest,
            jumlah_pendanaan_saat_ini: param.jumlah_pendanaan_saat_ini,
            jumlah_pinjaman_lunas: param.jumlah_pinjaman_lunas,
            total_nilai_pinjaman_lunas: param.total_nilai_pinjaman_lunas,
            jumlah_TKB90_cicilan_masih_berjalan: param.jumlah_TKB90_cicilan_masih_berjalan,
            jumlah_cicilan_masih_berjalan: param.jumlah_cicilan_masih_berjalan
        };

        const dictstring = JSON.stringify(data);

        const fileDest = finalOutPutDir + '/dashboard_variable.json';
        fs.writeFile(fileDest, dictstring, function(err){
            if (err) {
                return reject(err);
            }

            const finalResponse = {
              'statusCode': 'C0001',
              'response': 'Success',
              'message': 'Update file JSON succesfully'
            };
            return resolve(finalResponse);
        });
    });
};

//public function
const getArea = () => {
    return new Promise((resolve, reject) => {
        Fs.readFile(PhoneJson, 'utf8', (err, content) => {
          if (err) {
            return reject(err);
          }

          const jsonData = JSON.parse(content);
          return resolve(jsonData);
        });
    });
};

const generateUserCode = (fullName, dob) => {
    return new Promise(async (resolve, reject) => {
        try {
            const nameCode = __getName(fullName);
            const dobCode = __generateDobCode(dob);
            const initialCode = __generateInitialCode(nameCode.firstName, nameCode.lastName, dobCode);
            const dbCode = await UserData.checkUserCode(initialCode);
            const userCode = __generateNewCode(dbCode, initialCode);
            return resolve(userCode);
        } catch (err) {
            return reject(err);
        }
    });
};

const generateUserCodeAdmin = (fullName, role) => {
    return new Promise(async (resolve, reject) => {
        try {
            const nameCode = __getName(fullName);
            const initialCode = __generateInitialCode('admin', nameCode.firstName, role);
            const dbCode = await UserData.checkUserCode(initialCode);
            const userCode = __generateNewCode(dbCode, initialCode);
            return resolve(userCode);
        } catch (err) {
            return reject(err);
        }
    });
};

const generateVirtualAccountNo = (msisdn) => {
    return new Promise((resolve) => {
        const extraZero = '0'.repeat(12 - msisdn.length);
        const virtualNo = '1209' + extraZero + msisdn;
        return resolve({virtualNo});
    });
};


const uploadFile = (image, type, extention, authId, randomChar) => {
    return new Promise((resolve, reject) => {
        let outputDir = Config.get('/uploadFile');
        if(outputDir.lastIndexOf('{home.dir}') === 0){
            const os = require('os');

            outputDir = os.homedir() + outputDir.substr(10);
        }

        const imageFile = image.split(';base64,').pop();
        var fs = require('fs');

        const finalOutPutDir = outputDir + type;
        if (!Fs.existsSync(finalOutPutDir)){
          fs.mkdirSync(finalOutPutDir);
        }

        const fileDest = finalOutPutDir + '/' + type + '_' + authId + ((randomChar) ? randomChar : '') + extention;
        Fs.writeFile(fileDest, imageFile, {encoding: 'base64'}, function(err) {
            if (err) {
                return reject(err);
            }

            const finalResponse = {
              'statusCode': 'C0001',
              'response': 'Success',
              'message': 'Upload file succesfully'
            };
            return resolve(finalResponse);
        });
    });
};

const accessUpload = (type, file) => {
    return new Promise((resolve, reject) => {
        let outputDir = Config.get('/uploadFile');
        if(outputDir.lastIndexOf('{home.dir}') === 0){
            const os = require('os');

            outputDir = os.homedir() + outputDir.substr(10);
        }

        const finalOutPutDir = outputDir + type;
        const fileDest = finalOutPutDir + '/' + file;
        Fs.readFile(fileDest, function(err, files) {
            if (err) {
                return reject(err);
            }

            return resolve(files);
        });
    });
};

const validateCaptcha = (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            const captchaResponse = await GoogleApi.googleApi(token);
            return resolve(captchaResponse);
        } catch (err) {
            return reject(err);
        }
    });
};

const generateProjectCode = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const compCode = 'DAN';
            const year = generateTwoDigit(String(new Date().getFullYear()).substr(-2));
            const tempCode = compCode + year;
            const latestLoanCode = await LoanData.getLatestLoanCode(tempCode);
            let loanCode;
            if (latestLoanCode[0]) {
                const lastDigitNumber = latestLoanCode[0].loan_code.substring(5, latestLoanCode[0].length);
                const addOne = parseInt(lastDigitNumber) + 1;
                const finalDigitNumber = String('00000000' + addOne).slice(-8);
                loanCode = tempCode + finalDigitNumber;
            } else {
                loanCode = tempCode + '00000001';
            }

            resolve(loanCode);
        } catch(err) {
            Logger.write.log('error', 'generate project code error: ' + err.message);
            reject(err);
        }
    });
};

const successTemplate = (code, data) => {
    return new Promise((resolve) => {
        const successResponse = {
            'status': 'success',
            'code': code,
            'data': data
        };
        resolve(successResponse);
    });
};

const failedTemplate = (code, data) => {
    return new Promise((resolve) => {
        const failedResponse = {
            'status': 'failed',
            'code': code,
            'message': data
        };
        resolve(failedResponse);
    });
};

const updatedToken = (token) => {
    return new Promise((resolve, reject) => {
        UtilsData.updateToken(token)
            .then((result) => {
                console.log('RESULT => ', result);
                if (result) {
                    const successResult = {
                        'statusCode': 'C0001',
                        'response': 'Success',
                        'message': 'Update data token successfully'
                    };
                    return resolve(successResult);
                }
            })
            .catch((err) => {
                console.log('errr1', err);
                return reject(err);
            });
    });
};

const getToken = () => {
    return new Promise((resolve, reject) => {
        try {
            const detail = UtilsData.getToken();
            return resolve(detail);
        } catch (err) {
            return reject({ 'err.message': err });
        }
    });
};

const getVariableDashboardDanon = (type) => {
    return new Promise(async(resolve, reject) => {
        try {
            const readFile = await __getValue();
            console.log(readFile);
            if(type === 'full') {
                const resp = {
                    jumlah_investor: readFile.jumlah_investor,
                    nilai_dana_pinjaman_tersalurkan: readFile.nilai_dana_pinjaman_tersalurkan,
                    jumlah_pinjaman_tersalurkan_keseluruhan: readFile.jumlah_pinjaman_tersalurkan_keseluruhan,
                    pembayaran_pinjaman_macet_keseluruhan: readFile.pembayaran_pinjaman_macet_keseluruhan,
                    TKB90_keseluruhan: readFile.TKB90_keseluruhan,
                    average_interest: readFile.average_interest,
                    jumlah_pendanaan_saat_ini: readFile.jumlah_pendanaan_saat_ini,
                    jumlah_pinjaman_lunas: readFile.jumlah_pinjaman_lunas,
                    total_nilai_pinjaman_lunas: readFile.total_nilai_pinjaman_lunas,
                    jumlah_cicilan_masih_berjalan: readFile.jumlah_cicilan_masih_berjalan,
                    jumlah_TKB90_cicilan_masih_berjalan: readFile.jumlah_TKB90_cicilan_masih_berjalan
                };
                return resolve(resp);
            } else if (type === 'simple') {
                const resp = {
                    jumlah_investor: readFile.jumlah_investor,
                    nilai_dana_pinjaman_tersalurkan: readFile.nilai_dana_pinjaman_tersalurkan,
                    jumlah_cicilan_masih_berjalan: readFile.jumlah_cicilan_masih_berjalan,
                    jumlah_TKB90_cicilan_masih_berjalan: readFile.jumlah_TKB90_cicilan_masih_berjalan
                };
                return resolve(resp);
            }
        } catch (err) {
            return reject({ 'err.message': err});
        }
    });
};

const updateDashboardJsonFile = () => {
    return new Promise(async(resolve, reject) => {
        try {
            const data = await UtilsData.getVariableDashboardDanon();
            const createJsonFile = await __createJsonDashboardVariable(data[0]);
            return resolve(createJsonFile);
        } catch (err) {
            return reject({ 'err.message': err});
        }
    });
};


const interestCalculation = (interest, amount) => {
    return new Promise((resolve) => {
        const netInterest = Math.floor(( interest / 100 ) * amount / 12);
        return resolve(netInterest);
    });
};

const serviceFeeCalculation = (totalAmount, collectionInterest) => {
    return new Promise((resolve) => {
        const serviceFee = Math.ceil(( totalAmount ) * ( collectionInterest / 100 ));
        return resolve(serviceFee);
    });
};

const failedResponse = (type, message) => {
    return new Promise((resolve) => {
        try {
            let failedRes;
            if (type === 1) {
                failedRes = {
                    'statusCode': 'E0001',
                    'response': 'Failed',
                    'message': message
                };
            }

            return resolve(failedRes);
        } catch (err) {
            Logger.write.log('error', 'failed response generator error: ' + err.message);
            return reject({ 'err.message': err});
        }
    });
};

const getRandomChar = (totalLength) => {
    const randomToken = Array(totalLength).fill(0).map(() =>
        Math.random().toString(36).charAt(2)).join('');
    return randomToken;
};

module.exports = {
    generateTwoDigit,
    accessUpload,
    failedResponse,
    failedTemplate,
    getArea,
    getToken,
    generateProjectCode,
    generateUserCode,
    generateVirtualAccountNo,
    interestCalculation,
    uploadFile,
    updatedToken,
    serviceFeeCalculation,
    successTemplate,
    validateCaptcha,
    generateUserCodeAdmin,
    getRandomChar,
    getVariableDashboardDanon,
    updateDashboardJsonFile
};
