'use strict';

const Config = require('../../config');
const Request = require('request');
const Logger = require('../helper/logger');
const ConstantHelper = require('../helper/constantHelper');
const UtilsHelper = require('../helper/utilsHelper');
const DigiSignData = require('../model/digisignData');
const Fs = require('fs');
const Os = require('os');

const __headerApi = () => {
    const digiSignHeader = {
        'Content-Type': 'multipart/form-data',
        'Authorization': Config.get('/digiSign/authToken')
    };
    return digiSignHeader;
};

const __request = (methodRequest, path, data) => {
    return new Promise((resolve, reject) => {
        const options = {
            'uri': Config.get('/digiSign/server') + path,
            'method': methodRequest,
            'headers': __headerApi(),
            'formData': data
        };
        Request(options, (err, response) => {
          if (err) {
            Logger.write.log('error', 'digisign api request error: ' + err.message);
            return reject({'message': 'digisign api failed'});
          }

          return resolve(response.body);
        });
    });
};


const registerDigiSign = (userCode, paymentAddress, jenisKelamin, kecamatan, kelurahan, postalCode, city, nama, phone, birthDate, province, ktp,
    birthPlace, email, npwp, regNo, fotoKtp, fotoDiri, fotoTtd, fotoNpwp) => {
    return new Promise(async (resolve, reject) => {
        const formattedDOB = UtilsHelper.generateTwoDigit(birthDate.getUTCDate().toString()) + '-' + UtilsHelper.generateTwoDigit((birthDate.getUTCMonth() + 1).toString()) + '-' + birthDate.getUTCFullYear();
        const JSONFile = {
            'userid': await ConstantHelper.getValue('digi-emailAdmin'),
            'alamat': paymentAddress,
            'jenis_kelamin': (jenisKelamin === 'Pria') ? 'laki-laki' : 'perempuan',
            'kecamatan': kecamatan,
            'kelurahan': kelurahan,
            'kode-pos': postalCode,
            'kota': city,
            'nama': nama,
            'tlp': phone,
            'tgl_lahir': formattedDOB,
            'provinci': province,
            'idktp': ktp,
            'tmp_lahir': birthPlace,
            'email': email,
            'npwp': npwp,
            'reg_number': regNo,
            'ref_verifikasi': refVerifikasi,
            'data_verifikasi': dataVerifikasi,
            'score_selfie': scoreSelfie,
            'vnik': vNik,
            'vnama': vNama,
            'vtgl_lahir': vTanggalLahir,
            'vtmp_lahir': vTempatLahir
        };
        // new parameter provide by KYC
        //"ref_verifikasi":"1546954039393",
        //"data_verifikasi":"{\"name\":true,\"birthplace\":true,\"birthdate\":true,\"address\":\"J**********N 1**B\"}",
        //"score_selfie":"70.2", "vnik":"1", "vnama":"1", "vtgl_lahir":"1", "vtmp_lahir":"1"

        const outputDir = Os.homedir() + Config.get('/uploadFile').substring(10);

        const data = {
            'jsonfield': await JSON.stringify({ JSONFile }),
            'fotoktp': Fs.createReadStream(outputDir + 'user_ktp/' + fotoKtp),
            'fotodiri': Fs.createReadStream(outputDir + 'user_selfie/' + fotoDiri),
            'ttd': fotoTtd,
            'fotonpwp': fotoNpwp
        };

        console.log('===data register digisign: ', JSONFile);
        try {
            const responseBody = await __request('POST', 'REG-MITRA.html', data);
            console.log('======register DigiSign: ', responseBody);

            const newResponse = responseBody.replace(/'/g, '\\\'');
            await DigiSignData.insertRecordDigisign(userCode, 'REGISTER', newResponse);
            return resolve(responseBody);
        } catch (err) {
            console.log('error digisign: ', err);
            Logger.write.log('error', 'register to DigiSign api request error for ' + nama + ': ' + err.message);
            return reject({'message': 'failed to register DigiSign'});
        }
    });
};

const checkUserDigi = (email) => {
    return new Promise(async (resolve, reject) => {
        const JSONFile = {
            'userid': await ConstantHelper.getValue('digi-emailAdmin'),
            'email': email
        };

        const data = {
            'jsonfield': await JSON.stringify({ JSONFile })
        };

        console.log('===check user Digi: ', data);
        try {
            const responseBody = await __request('POST', 'CheckUserMitra.html', data);
            console.log('======check digisign user: ', responseBody);

            const newResponse = responseBody.replace(/'/g, '\\\'');
            await DigiSignData.insertRecordDigisign(email, 'CHECK-USER', newResponse);
            return resolve(responseBody);
        } catch (err) {
            console.log('error digisign: ', err);
            Logger.write.log('error', 'check user digisign error for ' + email + ': ' + err.message);
            return reject({'message': 'failed to check user DigiSign'});
        }
    });
};

const sendDocumentDigi = (userCode, type, docId, name, email, blly, bllx, burx, bury, bpage, ally,allx,aurx,aury,apage, outputPdfFile) => {
    return new Promise(async (resolve, reject) => {
        const reqSign = [
            {
                'name': name,
                'email': email,
                'user': 'ttd1',
                'aksi_ttd': 'mt',
                'lly': blly,
                'llx': bllx,
                'urx': burx,
                'ury': bury,
                'page': bpage,
                'visible': '1'
            }, {
                'name': 'Danon',
                'email': 'admin_dev@danon.id',
                'user': 'ttd2',
                'aksi_ttd': 'at',
                'kuser':'oPM36LpAmd6IouJK',
                'lly': ally,
                'llx': allx,
                'urx': aurx,
                'ury': aury,
                'page': apage,
                'visible': '1'
            }
        ];

        const JSONFile = {
            'userid': await ConstantHelper.getValue('digi-emailAdmin'),
            'document_id': docId,
            'req-sign': reqSign,
            'payment': '3',
            'send-to': []
        };

        const data = {
            'jsonfield': await JSON.stringify({ JSONFile }),
            'file': Fs.createReadStream(outputPdfFile)
        };

        console.log('===data for send document digisign: ', JSONFile, data);
        try {
            const responseBody = await __request('POST', 'SendDocMitraAT.html', data);
            console.log('======send document digisign: ', responseBody);

            const newResponse = responseBody.replace(/'/g, '\\\'');
            await DigiSignData.insertRecordDigisign(userCode, 'SEND-DOCUMENT-' + type, newResponse);
            return resolve(responseBody);
        } catch (err) {
            console.log('error digisign: ', err);
            Logger.write.log('error', 'send document digisign api request error for ' + name + ': ' + err.message);
            return reject({'message': 'failed to send document DigiSign'});
        }
    });
};

const checkDocStatus = (docId) => {
    return new Promise(async (resolve, reject) => {

        const JSONFile = {
            'userid': await ConstantHelper.getValue('digi-emailAdmin'),
            'document_id': docId
        };

        const data = {
            'jsonfield': await JSON.stringify({ JSONFile })
        };

        console.log('===data for check document status: ', JSONFile, data);
        try {
            const responseBody = await __request('POST', 'STATUSDOC.html', data);
            console.log('======check digisign user: ', responseBody);

            const newResponse = responseBody.replace(/'/g, '\\\'');
            await DigiSignData.insertRecordDigisign(docId, 'CHECK-DOCUMENT', newResponse);
            return resolve(responseBody);
        } catch (err) {
            console.log('error digisign: ', err);
            Logger.write.log('error', 'check document DigiSign api request error for ' + docId + ': ' + err.message);
            return reject({'message': 'failed to check document DigiSign'});
        }
    });
};

module.exports = {
    checkDocStatus,
    checkUserDigi,
    registerDigiSign,
    sendDocumentDigi
};
