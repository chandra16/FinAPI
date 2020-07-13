const Fs = require('fs');
const Docxtemplater = require('docxtemplater');
const JSZip = require('jszip');
const Config = require('../../config');
const ConverterHelper = require('./converterHelper');
const Os = require('os');
const DocumentData = require('../model/documentData.js');
const Logger = require('./logger');
const DigiSign = require('../service/digiSign');
const Word2pdf = '';
const UtilsHelper = require('../helper/utilsHelper');

const generatePksFileOld = (templateFile, type) => {
    process.stdout.write('generatePksFile::' + templateFile + '\n');
    let outputDir = Config.get('/uploadFile');
    process.stdout.write('outputDir::' + outputDir + '\n');
    if(outputDir.lastIndexOf('{home.dir}') === 0){
        outputDir = Os.homedir() + outputDir.substr(10);
        process.stdout.write('outputDir::' + outputDir + '\n');
    }

    process.stdout.write('outputDir::' + outputDir + '\n');
    const finalOutPutDir = outputDir + type;
    process.stdout.write('finalOutPutDir::' + finalOutPutDir + '\n');
    if (!Fs.existsSync(finalOutPutDir)){
      Fs.mkdirSync(finalOutPutDir);
    }

    return new Promise((resolve, reject) => {
        Fs.readFile(templateFile, 'binary', (err, content) => {
          if (err) {
            return reject(err);
          }

          var zip = new JSZip(content);
          var doc = new Docxtemplater();
          doc.loadZip(zip);

          doc.setData({
              'firstname':'John',
              'lastname':'Doe'
          });
          doc.render();
          const buf = doc.getZip().generate({type:'nodebuffer'});
          const outputFile = finalOutPutDir + '/output.docx';
          const outputPdfFile = finalOutPutDir + '/output_12.pdf';
          Fs.writeFileSync(outputFile,buf);
          process.stdout.write('outputFile::' + outputFile + '\n');
          const outputObj = {
            docsFile:outputFile,
            pdfFile:outputPdfFile
          };
          /*DocxConverter(outputFile,outputPdfFile, (err, result) => {
            if (err){
              process.stdout.write('docxConverter::err::' + err + '\n');
            }else{
              process.stdout.write('docxConverter::result::' + result + '\n'); // writes to file for us
            }
          });*/
        //  const data = ();
          /*Word2pdf(outputFile, (err, data) => {
            if (err){
              process.stdout.write('Word2pdf::err::' + err + '\n');
            }else{
              Fs.writeFileSync(outputPdfFile, data);
              process.stdout.write('Word2pdf::result::' + data + '\n'); // writes to file for us
            }
          });*/

          return resolve(outputObj);
        });
    });
};

const generateFactSheetFile = (loanCode, templateFile, type, docType, borrowerParam, payorParam, riskParam) => {

  // calculate number of year coorporate
  var now = new Date();
  var past = new Date(borrowerParam.tanggal_berdiri);
  var nowYear = now.getFullYear();
  var pastYear = past.getFullYear();
  const age = nowYear - pastYear;

  process.stdout.write('generatePksFile::' + templateFile + '\n');
    let outputDir = Config.get('/uploadFile');
    process.stdout.write('outputDir::' + outputDir + '\n');
    if(outputDir.lastIndexOf('{home.dir}') === 0){
        outputDir = Os.homedir() + outputDir.substr(10);
        process.stdout.write('outputDir::' + outputDir + '\n');
    }

    process.stdout.write('outputDir::' + outputDir + '\n');
    const finalOutPutDir = outputDir + type;
    process.stdout.write('finalOutPutDir::' + finalOutPutDir + '\n');
    if (!Fs.existsSync(finalOutPutDir)){
      Fs.mkdirSync(finalOutPutDir);
    }

    const templatePath = outputDir + 'templateFactSheet/' + templateFile;
    console.log('==template path: ', templatePath);
    return new Promise((resolve, reject) => {
        Fs.readFile(templatePath, 'binary', async (err, content) => {
          if (err) {
            return reject(err);
          }

          var zip = new JSZip(content);
          var doc = new Docxtemplater();
          doc.loadZip(zip);

          console.log('klasifikasi payor: ' + payorParam.klasifikasi);
          console.log('payor desc: ' + payorParam.payor_desc);
          console.log('industri: ' + payorParam.industri);
          console.log('nilai tagihan: ' + payorParam.nilai_tagihan);

          console.log('risk title 1: ' + riskParam[0].title);
          console.log('risk title 2: ' + riskParam[1].title);
          console.log('risk title 3: ' + riskParam[2].title);
          console.log('risk desc 1: ' + riskParam[0].title);
          console.log('risk desc 2: ' + riskParam[1].title);
          console.log('risk desc 3: ' + riskParam[2].title);

          doc.setData({
              'BORROWER': borrowerParam.inisial_borrower,
              'TypeIndustri': borrowerParam.name_company_sector,
              'location': borrowerParam.alamat,
              'lamaUsaha': age,
              'klasifikasiBor': 'Perusahaan Nasional',
              'borrowerOverview': borrowerParam.informasi_perusahaan,
              'jaminan': 'ada',
              'payorInfo': payorParam.payor_desc,
              'TypeIndustriPayor': payorParam.industri,
              'klasifikasi': payorParam.klasifikasi,
              'nilaiTagihan': payorParam.nilai_tagihan,
              'riskProfile1': riskParam[0].title,
              'riskProfile2': riskParam[1].title,
              'riskProfile3': riskParam[2].title,
              'descRiskProfile1': ': ' + riskParam[0].risk_desc,
              'descRiskProfile2': ': ' + riskParam[1].risk_desc,
              'descRiskProfile3': ': ' + riskParam[2].risk_desc
          });
          doc.render();
          const buf = doc.getZip().generate({type:'nodebuffer'});
          const docName = docType + '_' + loanCode;
          const outputFile = finalOutPutDir + '/' + docName + '.docx';
          const outputPdfFile = finalOutPutDir + '/' + docName + '.pdf';
          Fs.writeFileSync(outputFile,buf);
          process.stdout.write('outputFile::' + outputFile + '\n');
          const outputObj = {
            docsFile:outputFile,
            pdfFile:outputPdfFile
          };

          const data = await Word2pdf(outputObj.docsFile);
          process.stdout.write('downloadFile::outputFile::' + JSON.stringify(outputObj) + '\n');
          Fs.writeFileSync(outputObj.pdfFile, data);

          return resolve(outputObj);
        });
    });
};

const generatePksFile = (userCode, templateFile, type, docType, code, fullname, phone, noktp, createdDate, docNo, address, email) => {
    process.stdout.write('generatePksFile::' + templateFile + '\n');
    const firstName = fullname.split(' ');
    let outputDir = Config.get('/uploadFile');
    process.stdout.write('outputDir::' + outputDir + '\n');
    if(outputDir.lastIndexOf('{home.dir}') === 0){
        outputDir = Os.homedir() + outputDir.substr(10);
        process.stdout.write('outputDir::' + outputDir + '\n');
    }

    process.stdout.write('outputDir::' + outputDir + '\n');
    const finalOutPutDir = outputDir + type;
    process.stdout.write('finalOutPutDir::' + finalOutPutDir + '\n');
    if (!Fs.existsSync(finalOutPutDir)){
      Fs.mkdirSync(finalOutPutDir);
    }

    const templatePath = outputDir + 'template/' + templateFile;
    console.log('==template path: ', templatePath);
    return new Promise((resolve, reject) => {
        Fs.readFile(templatePath, 'binary', async (err, content) => {
          if (err) {
            return reject(err);
          }

          var zip = new JSZip(content);
          var doc = new Docxtemplater();
          doc.loadZip(zip);

          doc.setData({
              'full_name': fullname,
              'phone': phone,
              'ktp_no': noktp,
              'address': address,
              'created_date': createdDate,
              'document_no': docNo,
              'email': email
          });
          doc.render();
          const buf = doc.getZip().generate({type:'nodebuffer'});
          const docName = docType + '_' + firstName[0] + '_' + docNo;
          const outputFile = finalOutPutDir + '/' + docName + '.docx';
          const outputPdfFile = finalOutPutDir + '/' + docName + '.pdf';
          Fs.writeFileSync(outputFile,buf);
          process.stdout.write('outputFile::' + outputFile + '\n');
          const outputObj = {
            docsFile:outputFile,
            pdfFile:outputPdfFile
          };

          const data = await Word2pdf(outputObj.docsFile);
          process.stdout.write('downloadFile::outputFile::' + JSON.stringify(outputObj) + '\n');
          Fs.writeFileSync(outputObj.pdfFile, data);

          await DigiSign.sendDocumentDigi(userCode, 'INVESTOR', docNo, firstName[0], email, '411', '67', '236', '474', '10', '411', '333', '502', '474', '10', outputPdfFile);

          // insert to database
          await DocumentData.insertDocumentData(userCode, fullname, type, docName + '.pdf', email, docNo, code);
          /*DocxConverter(outputFile,outputPdfFile, (err, result) => {
            if (err){
              process.stdout.write('docxConverter::err::' + err + '\n');
            }else{
              process.stdout.write('docxConverter::result::' + result + '\n'); // writes to file for us
            }
          });*/
        //  const data = ();
          /*Word2pdf(outputFile, (err, data) => {
            if (err){
              process.stdout.write('Word2pdf::err::' + err + '\n');
            }else{
              Fs.writeFileSync(outputPdfFile, data);
              process.stdout.write('Word2pdf::result::' + data + '\n'); // writes to file for us
            }
          });*/

          return resolve(outputObj);
        });
    });
};

const generateLoanDoc = (userCode, templateFile, type, docType, code, fullname, phone, createdDate, docNo, email, day, investor,
    totalLoan, plan, installment, noktp, address, interest) => {
    process.stdout.write('generatePksFile::' + templateFile + '\n');
    const firstName = fullname.split(' ');
    let outputDir = Config.get('/uploadFile');
    process.stdout.write('outputDir::' + outputDir + '\n');
    if(outputDir.lastIndexOf('{home.dir}') === 0){
        outputDir = Os.homedir() + outputDir.substr(10);
        process.stdout.write('outputDir::' + outputDir + '\n');
    }

    process.stdout.write('outputDir::' + outputDir + '\n');
    const finalOutPutDir = outputDir + type;
    process.stdout.write('finalOutPutDir::' + finalOutPutDir + '\n');
    if (!Fs.existsSync(finalOutPutDir)){
      Fs.mkdirSync(finalOutPutDir);
    }

    const templatePath = outputDir + 'template/' + templateFile;
    return new Promise((resolve, reject) => {
        Fs.readFile(templatePath, 'binary', async (err, content) => {
          if (err) {
            return reject(err);
          }

          var zip = new JSZip(content);
          var doc = new Docxtemplater();
          doc.loadZip(zip);

          doc.setData({
              'full_name': fullname,
              'phone': phone,
              'create_date': createdDate,
              'document_no': docNo,
              'email': email,
              'investor': investor,
              'day': day,
              'total_loan': ConverterHelper.currencyFormat(totalLoan),
              'spell_loan': ConverterHelper.spellNumber(totalLoan),
              'plan': plan,
              'installment': ConverterHelper.currencyFormat(installment),
              'ktp_no': noktp,
              'address': address,
              'interest': interest,
              'spell_interest': ConverterHelper.spellNumber(interest)
          });
          doc.render();
          const buf = doc.getZip().generate({type:'nodebuffer'});
          const docName = docType + '_' + firstName[0] + '_' + docNo;
          const outputFile = finalOutPutDir + '/' + docName + '.docx';
          const outputPdfFile = finalOutPutDir + '/' + docName + '.pdf';
          Fs.writeFileSync(outputFile,buf);
          process.stdout.write('outputFile::' + outputFile + '\n');
          const outputObj = {
            docsFile:outputFile,
            pdfFile:outputPdfFile
          };

          const data = await Word2pdf(outputObj.docsFile);
          process.stdout.write('downloadFile::outputFile::' + JSON.stringify(outputObj) + '\n');
          Fs.writeFileSync(outputObj.pdfFile, data);

          await DigiSign.sendDocumentDigi(userCode, 'BORROWER', docNo, firstName[0], email, '528', '342', '523', '592', '10', '528', '35', '216', '592', '10', outputPdfFile);
          // insert to database
          await DocumentData.insertDocumentData(userCode, fullname, type, docName + '.pdf', email, docNo, code);

          return resolve(outputObj);
        });
    });
};

const getDocumentData = (type) => {
    return new Promise(async (resolve, reject) => {
        try {
                const documentData = await DocumentData.getAllDocument(type);
                return resolve(documentData);
        } catch (err) {
            Logger.write.log('error', 'get Document Data error: ' + err.message);
            return reject(err);
        }
    });
};

const createCollateralFile = function (loanCode, type, param) {
  return new Promise(async (resolve) => {
      console.log('masuk sini');
      const randomChar = await UtilsHelper.getRandomChar(16);
      let outputDir = await Config.get('/uploadFile');
      if (outputDir.lastIndexOf('{home.dir}') === 0) {
          const os = require('os');

          outputDir = os.homedir() + outputDir.substr(10);
      }

      var fs = require('fs');

      const finalOutPutDir = await outputDir + 'collateralFile';
      if (!Fs.existsSync(finalOutPutDir)) {
          fs.mkdirSync(finalOutPutDir);
      }

      const dictstring = JSON.parse(param);
      const z = JSON.stringify(dictstring);

      const fileName = type + loanCode + randomChar + '.json';
      const fileDest = finalOutPutDir + '/' + fileName;
      fs.writeFile(fileDest, z, function (err) {
          if (err) {
              return reject(err);
          }

          const finalResponse = {
              'statusCode': 'C0001',
              'response': 'Success',
              'fileName': fileName,
              'message': 'Update file JSON succesfully'
          };
          return resolve(finalResponse);
      });
  });
};

module.exports = {
    generateLoanDoc,
    generatePksFile,
    getDocumentData,
    generateFactSheetFile,
    createCollateralFile
};
